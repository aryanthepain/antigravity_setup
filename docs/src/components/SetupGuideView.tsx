import React, { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, ShieldCheck } from 'lucide-react';
import { SETUP_STEPS } from '../data/setupGuideData';

export const SetupGuideView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-teal-950/30 border border-border p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Setup Manual</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Replication & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Setup Guide</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Follow this 5-step walkthrough to replicate the 2026 Zero-Budget Antigravity setup on any machine. Fully compatible with Windows, macOS, and Linux.
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-6">
        {SETUP_STEPS.map((step, idx) => (
          <div key={step.step} className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/30 shrink-0">
                  {step.step}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base">{step.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-medium">
                      {step.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            </div>

            {step.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>Terminal / Configuration</span>
                  </span>
                  <button
                    onClick={() => handleCopy(step.codeSnippet!, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-background hover:bg-muted border border-border text-[11px] text-muted-foreground transition-all"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-background/90 p-4 rounded-xl border border-border font-mono text-xs text-blue-200 overflow-x-auto">
                  {step.codeSnippet}
                </pre>
              </div>
            )}

            {step.notes && (
              <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{step.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
