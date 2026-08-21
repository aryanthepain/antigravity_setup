#!/usr/bin/env bash
# reconcile-issue-numbers.sh
#
# Reconcile issue-file numbers (issues/NNN-slug.md) against a parent branch so
# that work coming from parallel git worktrees never lands two DIFFERENT issues
# on the same number.
#
# The numbers already on the parent branch are authoritative. A branch being
# integrated later YIELDS: only THIS branch's NEW issues are renumbered, never
# issues already present on the parent. Minimal churn -- an issue is renumbered
# only when its number is already owned by a different issue (slug) on the
# parent; numbers that are still free on the parent are left untouched.
#
# Usage:
#   reconcile-issue-numbers.sh [--parent <ref>] [--check] [--no-commit]
#
#   --parent <ref>  Parent/target ref to reconcile against. Default: the repo's
#                   detected default branch (origin/HEAD), else origin/main.
#   --check         Report collisions and exit 1 if any; make no changes.
#   --no-commit     Apply renames/reference rewrites but do not git commit.
#
# Exit codes: 0 = no collision (or applied), 1 = collisions found in --check,
#             2 = usage/environment error.
set -euo pipefail

parent=""
mode="apply"   # apply | check
commit=1

while [ "$#" -gt 0 ]; do
  case "$1" in
    --parent) parent="${2:-}"; shift 2 ;;
    --check) mode="check"; shift ;;
    --no-commit) commit=0; shift ;;
    -h|--help)
      echo "usage: reconcile-issue-numbers.sh [--parent <ref>] [--check] [--no-commit]"
      exit 0 ;;
    *) echo "reconcile: unknown argument: $1" >&2; exit 2 ;;
  esac
done

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "reconcile: not inside a git repository." >&2; exit 2; }
cd "$repo_root"

# --- Resolve the parent/target ref ------------------------------------------
if [ -z "$parent" ]; then
  default_branch="$(git symbolic-ref --quiet refs/remotes/origin/HEAD 2>/dev/null \
    | sed 's@^refs/remotes/origin/@@' || true)"
  if [ -n "$default_branch" ]; then
    parent="origin/$default_branch"
  else
    parent="origin/main"
  fi
fi

if ! git rev-parse --verify --quiet "$parent" >/dev/null 2>&1; then
  alt="${parent#origin/}"
  if git rev-parse --verify --quiet "$alt" >/dev/null 2>&1; then
    parent="$alt"
  else
    echo "reconcile: parent ref '$parent' not found (fetch first?); nothing to reconcile." >&2
    exit 0
  fi
fi

# --- Numbers already used on the parent branch ------------------------------
declare -A parent_owner   # intnum -> slug that owns that number on the parent
declare -A parent_slug    # slug   -> 1 (this slug exists on the parent)
max_used=0

while IFS=$'\t' read -r intnum slug; do
  [ -n "${intnum:-}" ] || continue
  parent_owner["$intnum"]="$slug"
  parent_slug["$slug"]=1
  [ "$intnum" -gt "$max_used" ] && max_used="$intnum"
done < <(
  git ls-tree -r --name-only "$parent" -- issues 2>/dev/null \
    | sed -nE 's#^issues/(done/)?0*([0-9]+)-(.+)\.md$#\2\t\3#p'
)

# --- This branch's issue files (working tree) -------------------------------
shopt -s nullglob
branch_files=( issues/*.md issues/done/*.md )
shopt -u nullglob

# Fold this branch's own numbers into the running maximum.
if [ "${#branch_files[@]}" -gt 0 ]; then
  for f in "${branch_files[@]}"; do
    base="${f##*/}"
    if [[ "$base" =~ ^0*([0-9]+)- ]]; then
      bint="$((10#${BASH_REMATCH[1]}))"
      [ "$bint" -gt "$max_used" ] && max_used="$bint"
    fi
  done
fi

# --- Detect collisions and build the rename plan ----------------------------
old_paths=(); new_paths=(); old_tokens=(); new_tokens=()
collisions=0

if [ "${#branch_files[@]}" -gt 0 ]; then
  for f in "${branch_files[@]}"; do
    dir="$(dirname "$f")"
    base="${f##*/}"
    [[ "$base" =~ ^(0*[0-9]+)-(.+)\.md$ ]] || continue
    num_raw="${BASH_REMATCH[1]}"
    slug="${BASH_REMATCH[2]}"
    intnum="$((10#$num_raw))"

    # Same issue already on the parent (matched by slug) -> never renumber.
    [ -n "${parent_slug[$slug]:-}" ] && continue

    # New issue. Collision only if its number is owned by a DIFFERENT slug.
    owner="${parent_owner[$intnum]:-}"
    if [ -n "$owner" ] && [ "$owner" != "$slug" ]; then
      collisions=$((collisions + 1))
      if [ "$mode" = "check" ]; then
        printf 'collision: %s  (number %s already used on %s by "%s")\n' \
          "$f" "$intnum" "$parent" "$owner" >&2
        continue
      fi
      max_used=$((max_used + 1))
      new3="$(printf '%03d' "$max_used")"
      old_paths+=( "$f" )
      new_paths+=( "${dir}/${new3}-${slug}.md" )
      old_tokens+=( "${num_raw}-${slug}.md" )
      new_tokens+=( "${new3}-${slug}.md" )
    fi
  done
fi

# --- Check mode -------------------------------------------------------------
if [ "$mode" = "check" ]; then
  if [ "$collisions" -gt 0 ]; then
    echo "reconcile: $collisions issue-number collision(s) with $parent." >&2
    exit 1
  fi
  echo "reconcile: no issue-number collisions with $parent."
  exit 0
fi

if [ "${#old_paths[@]}" -eq 0 ]; then
  echo "reconcile: no collisions with $parent; nothing to renumber."
  exit 0
fi

# --- Apply the renames ------------------------------------------------------
for i in "${!old_paths[@]}"; do
  op="${old_paths[$i]}"
  np="${new_paths[$i]}"
  if git ls-files --error-unmatch "$op" >/dev/null 2>&1; then
    git mv -- "$op" "$np"
  else
    mv -- "$op" "$np"
    git add -- "$np" >/dev/null 2>&1 || true
  fi
  echo "renumbered: $op -> $np"
done

# --- Rewrite cross-references (Blocked by issues/NNN-slug.md, etc.) ----------
shopt -s nullglob
all_issue_files=( issues/*.md issues/done/*.md )
shopt -u nullglob

for i in "${!old_tokens[@]}"; do
  ot="${old_tokens[$i]}"
  nt="${new_tokens[$i]}"
  ot_re="$(printf '%s' "$ot" | sed 's/[.]/\\./g')"
  for af in "${all_issue_files[@]}"; do
    [ -f "$af" ] || continue
    if grep -qF -- "$ot" "$af"; then
      tmp="$(mktemp)"
      sed "s#${ot_re}#${nt}#g" "$af" > "$tmp" && mv "$tmp" "$af"
      git add -- "$af" >/dev/null 2>&1 || true
    fi
  done
done

# --- Commit -----------------------------------------------------------------
if [ "$commit" -eq 1 ]; then
  git add -A -- issues
  git commit -q \
    -m "issues: reconcile numbers against ${parent} (renumber ${#old_paths[@]} to avoid collisions)"
  echo "reconcile: committed renumber of ${#old_paths[@]} issue(s)."
else
  echo "reconcile: applied renumber of ${#old_paths[@]} issue(s) (not committed)."
fi
exit 0
