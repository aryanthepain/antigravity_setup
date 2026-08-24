import React, { useState } from 'react';
import { Cpu, Zap, Copy, Check, ShieldCheck, Layers, Terminal } from 'lucide-react';
import { ROUTING_TIERS, PONYTAIL_LADDER, BEHAVIORAL_INVARIANTS } from '../data/architectureData';

export const ArchitectureView: React.FC = () => {
  const [copiedConfig, setCopiedConfig] = useState(false);

  const omnirouteYaml = `# ~/.omniroute/config.yaml - 2026 Free Tier Cascade
version: "2026.1"
server:
  host: "127.0.0.1"
  port: 20128
  cors: true

compression:
  strategy: "rtk-context"
  enabled: true
  max_context_tokens: 32000

providers:
  gemini:
    type: "gemini"
    api_key: "\${GEMINI_API_KEY}"
    models: ["gemini-2.5-flash", "gemini-2.5-pro"]
    daily_quota: 1500
    priority: 1

  groq:
    type: "groq"
    api_key: "\${GROQ_API_KEY}"
    models: ["llama-3.3-70b-versatile"]
    daily_quota: 1000
    priority: 2

  mistral:
    type: "mistral"
    api_key: "\${MISTRAL_API_KEY}"
    models: ["codestral-latest"]
    priority: 3

fallback_chain: ["gemini", "groq", "mistral", "openrouter"]`;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(omnirouteYaml);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/40 via-blue-950/30 to-purple-950/40 border border-border p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>Zero-Budget Architecture & Invariants</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Model Router & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Anti-Bloat Guardrails</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Eliminate API costs through local intelligent proxy cascades, strict token context budgeting (&lt;600 active tokens), and the 6-level Ponytail Laziness Ladder.
          </p>
        </div>
      </div>

      {/* Model Routing Waterfall */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>5-Tier Free Model Routing Cascade</span>
          </h2>
          <span className="text-xs text-muted-foreground">Automated local fallback chain</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROUTING_TIERS.map((tier) => (
            <div
              key={tier.tier}
              className={`glass-card rounded-2xl p-5 border flex flex-col justify-between ${tier.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background/60 border border-border">
                    Tier {tier.tier}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-background/60">
                    {tier.badge}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{tier.name}</h3>
                <p className="text-xs font-mono text-muted-foreground mb-3">{tier.model}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{tier.bestFor}</p>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] font-mono">
                <span>Quota: {tier.quota}</span>
                <span>Latency: {tier.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ponytail Laziness Ladder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>The Ponytail Laziness Ladder (-90% Code Bloat)</span>
          </h2>
          <span className="text-xs text-amber-400 font-medium">Climb 6 levels before writing code</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PONYTAIL_LADDER.map((step) => (
            <div key={step.level} className="glass-card rounded-2xl p-5 border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Level {step.level}: {step.name}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {step.reduction}
                </span>
              </div>
              <h4 className="text-xs font-bold text-foreground">{step.question}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.action}</p>
            </div>
          ))}
        </div>
      </div>

        {/* Behavioral Invariants & Subagent Runner Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invariants */}
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Behavioral Invariants & Karpathy Disciplines</span>
            </h3>
            <div className="space-y-3">
              {BEHAVIORAL_INVARIANTS.map((inv, idx) => (
                <div key={idx} className="bg-muted/40 p-3.5 rounded-xl border border-border space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{inv.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{inv.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Subagent Runner Engine */}
          <div className="glass-card rounded-2xl p-6 border border-border space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Asymmetric Subagent Delegation Engine</span>
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  scripts/subagent.js
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Offloads token-heavy operations (multi-file scans, code drafting, pre-PR reviews, log compression) to worker submodels, returning ultra-lean summaries (&lt;250 tokens).
              </p>
              <div className="space-y-2 font-mono text-xs text-emerald-300 bg-background/90 p-4 rounded-xl border border-border overflow-x-auto">
                <div className="text-muted-foreground text-[11px]">// 1. Multi-file Codebase Research (offloads 20k tokens)</div>
                <div>node .\scripts\subagent.js --task research --query "Explain auth logic" --files "src/auth.ts,src/server.ts"</div>
                <div className="text-muted-foreground text-[11px] pt-1">// 2. Precision Code Generation (Mistral Codestral)</div>
                <div>node .\scripts\subagent.js --task code --prompt "Add UUID generator" --file "src/utils.ts"</div>
                <div className="text-muted-foreground text-[11px] pt-1">// 3. Pre-PR Independent Adversarial Review</div>
                <div>node .\scripts\subagent.js --task review --diff</div>
                <div className="text-muted-foreground text-[11px] pt-1">// 4. Verbose Log Compression</div>
                <div>node .\scripts\subagent.js --task compress --file "test.log"</div>
              </div>
            </div>
          </div>
        </div>

        {/* OmniRoute Config Copier */}
        <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>OmniRoute Local Proxy Gateway Configuration</span>
            </h3>
            <button
              onClick={handleCopyConfig}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-background hover:bg-muted border border-border text-[11px] text-muted-foreground transition-all"
            >
              {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedConfig ? 'Copied' : 'Copy config.yaml'}</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Configured at <code className="text-foreground">~/.omniroute/config.yaml</code> to route all agent LLM calls through localhost:20128 with token context compression.
          </p>
          <pre className="bg-background/90 p-4 rounded-xl border border-border font-mono text-xs text-blue-300 overflow-x-auto max-h-[250px]">
            {omnirouteYaml}
          </pre>
        </div>
      </div>
    );
  };
