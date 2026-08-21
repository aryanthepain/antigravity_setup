import React, { useState } from 'react';
import { X, Copy, Check, Zap, Tag, Terminal, ShieldAlert, FileCode } from 'lucide-react';
import { Skill } from '../data/skillsData';

interface SkillDetailModalProps {
  skill: Skill | null;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!skill) return null;

  const handleCopyTrigger = () => {
    navigator.clipboard.writeText(skill.trigger);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = () => {
    const promptSnippet = `Activate skill: "${skill.name}".\nPurpose: ${skill.description}\nInvariants:\n${skill.details}`;
    navigator.clipboard.writeText(promptSnippet);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-lg">{skill.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {skill.badge}
                </span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">{skill.category} Module</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-foreground">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Overview</h4>
            <p className="text-sm text-foreground leading-relaxed">{skill.description}</p>
          </div>

          {/* Trigger Formula */}
          <div className="bg-muted/50 p-4 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Tag className="w-4 h-4" />
                <span>Natural Language Trigger Expression</span>
              </div>
              <button
                onClick={handleCopyTrigger}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-background hover:bg-muted border border-border text-[11px] text-muted-foreground transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/50">
              {skill.trigger}
            </p>
          </div>

          {/* Operational Details / Invariants */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Behavioral Invariants & Instructions</span>
            </h4>
            <pre className="bg-muted/80 p-4 rounded-xl border border-border font-mono text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {skill.details}
            </pre>
          </div>

          {/* Anti-Triggers if present */}
          {skill.antiTriggers && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-400 font-semibold block mb-0.5">Negative Trigger (When NOT to use)</strong>
                <p className="text-rose-200/80 text-[11px]">{skill.antiTriggers}</p>
              </div>
            </div>
          )}

          {/* Source Link */}
          {skill.sourceFile && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Defined in: <code className="text-foreground font-mono">{skill.sourceFile}</code></span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-muted/60 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Ready for autonomous agent activation</span>
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition-all"
          >
            {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy Activation Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
