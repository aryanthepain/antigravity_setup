#!/usr/bin/env bash
# ==============================================================================
# Deterministic 5-Tier Verification Gate (verify.sh)
# POSIX-compliant verification runner for Linux, Docker, and GitHub Actions CI.
# ==============================================================================

set -uo pipefail

QUICK=0
TARGET_TEST=""
ALARM=0
VOICE=0

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -q|--quick)
      QUICK=1
      shift
      ;;
    -t|--target)
      TARGET_TEST="$2"
      shift 2
      ;;
    -a|--alarm)
      ALARM=1
      shift
      ;;
    -v|--voice)
      VOICE=1
      shift
      ;;
    *)
      shift
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAILED=0

echo ""
echo "🔍 [VERIFY] Running Deterministic 5-Tier Verification Gate (Linux/CI)..."

# ==============================================================================
# TIER 1: Secret Exposure & Credential Leak Gate
# ==============================================================================
echo ""
echo "--- [Tier 1: Secret Exposure & Credential Leak Gate] ---"

# Check .agents/mcp_config.json for hardcoded Bearer tokens
MCP_FILE="$SCRIPT_DIR/../.agents/mcp_config.json"
if [[ -f "$MCP_FILE" ]]; then
  if grep -E 'Bearer [a-zA-Z0-9_\-\:]{20,}' "$MCP_FILE" | grep -v '\${' > /dev/null 2>&1; then
    echo "  ❌ [FAIL] Hardcoded Bearer token found in .agents/mcp_config.json!"
    FAILED=1
  else
    echo "  ✅ [PASS] .agents/mcp_config.json uses safe environment variable placeholders."
  fi
fi

# Run test-secrets-exposure if pwsh is available, otherwise run native grep scans
SECRETS_SCRIPT="$SCRIPT_DIR/test-secrets-exposure.ps1"
if command -v pwsh > /dev/null 2>&1 && [[ -f "$SECRETS_SCRIPT" ]]; then
  pwsh -File "$SECRETS_SCRIPT" || FAILED=1
else
  # Native bash secret pattern scanning across git-tracked files
  if command -v git > /dev/null 2>&1; then
    TRACKED_FILES=$(git ls-files 2>/dev/null || true)
    SECRET_REGEX='(sk-[a-zA-Z0-9_\-]{20,}|ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}|AIza[0-9A-Za-z\\-_]{35}|KGAT_[a-zA-Z0-9]{32}|secret_[a-zA-Z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'
    for file in $TRACKED_FILES; do
      if [[ -f "$file" && ! "$file" =~ \.(png|jpg|jpeg|gif|ico|woff|woff2|lock|pdf)$ && "$file" != "package-lock.json" ]]; then
        if grep -E "$SECRET_REGEX" "$file" > /dev/null 2>&1; then
          # Skip test files and definitions
          if [[ "$file" != *"test-secrets-exposure"* && "$file" != *"\.gitleaks\.toml"* ]]; then
            echo "  ❌ [FAIL] Potential secret detected in $file!"
            FAILED=1
          fi
        fi
      fi
    done
    if [[ $FAILED -eq 0 ]]; then
      echo "  ✅ [PASS] Native secret scan passed (zero exposed credentials)."
    fi
  fi
fi

if [[ $FAILED -ne 0 ]]; then
  echo -e "\n⛔ [TIER 1 FAILED] Aborting verification due to secret exposure."
  exit 1
fi

# ==============================================================================
# TIER 2: Static Analysis, Syntax & Typecheck Gate
# ==============================================================================
echo ""
echo "--- [Tier 2: Static Analysis & Typecheck Gate] ---"

# Python typecheck
if [[ -f "pyproject.toml" || -f "requirements.txt" || -f "setup.py" ]]; then
  if command -v mypy > /dev/null 2>&1; then
    echo "Running mypy static analysis..."
    mypy . || FAILED=1
  fi
fi

# TypeScript typecheck
if [[ -f "package.json" && -f "tsconfig.json" ]]; then
  if command -v npx > /dev/null 2>&1; then
    echo "Running tsc typecheck..."
    npx tsc --noEmit || FAILED=1
  fi
fi

# Node syntax check
if [[ -f "docs/app.js" ]]; then
  if command -v node > /dev/null 2>&1; then
    echo "Checking docs/app.js syntax..."
    node --check docs/app.js || FAILED=1
  fi
fi

if [[ $FAILED -ne 0 ]]; then
  echo -e "\n⛔ [TIER 2 FAILED] Aborting verification due to static analysis errors."
  exit 1
fi

# ==============================================================================
# TIER 3: Deterministic Unit & Invariant Tests Gate
# ==============================================================================
echo ""
echo "--- [Tier 3: Deterministic Unit & Invariant Tests Gate] ---"

# Python tests
if [[ -f "pyproject.toml" || -f "requirements.txt" || -f "setup.py" ]]; then
  if command -v pytest > /dev/null 2>&1; then
    echo "Running pytest..."
    if [[ -n "$TARGET_TEST" ]]; then
      pytest -k "$TARGET_TEST" -v || FAILED=1
    else
      pytest -q || FAILED=1
    fi
  fi
fi

# Node tests
if [[ -f "package.json" ]]; then
  if command -v npm > /dev/null 2>&1; then
    echo "Running npm test..."
    if [[ -n "$TARGET_TEST" ]]; then
      npm test -- "$TARGET_TEST" || FAILED=1
    else
      npm test || FAILED=1
    fi
  fi
fi

if [[ $FAILED -ne 0 ]]; then
  echo -e "\n⛔ [TIER 3 FAILED] Aborting verification due to test failures."
  exit 1
fi

# ==============================================================================
# TIER 4: Integration, Build & E2E Contracts Gate
# ==============================================================================
if [[ $QUICK -eq 0 ]]; then
  echo ""
  echo "--- [Tier 4: Integration, Build & E2E Contracts Gate] ---"
  if [[ -f "package.json" ]]; then
    if grep -q '"build":' package.json 2>/dev/null; then
      echo "Verifying production build (npm run build)..."
      npm run build || FAILED=1
    fi
  fi
else
  echo -e "\n⚡ [--quick] Skipping Tier 4 build/integration gates."
fi

# ==============================================================================
# TIER 5: Audio & Completion Alert
# ==============================================================================
if [[ $FAILED -ne 0 ]]; then
  echo -e "\n⛔ [VERIFICATION FAILED] Please fix errors before proceeding."
  if command -v pwsh > /dev/null 2>&1 && [[ $ALARM -eq 1 || $VOICE -eq 1 ]]; then
    pwsh -File "$SCRIPT_DIR/agent-alarm.ps1" -Type Failure -Message "Verification failed. Attention required." 2>/dev/null || true
  fi
  exit 1
fi

echo -e "\n🎉 [VERIFICATION PASSED] All deterministic gates green."
if command -v pwsh > /dev/null 2>&1 && [[ $ALARM -eq 1 || $VOICE -eq 1 ]]; then
  pwsh -File "$SCRIPT_DIR/agent-alarm.ps1" -Type Success -Message "All verification gates green." 2>/dev/null || true
fi
exit 0
