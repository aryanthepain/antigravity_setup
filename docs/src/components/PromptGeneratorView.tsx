import React, { useState } from 'react';
import { Sparkles, Copy, Check, Terminal, Zap, Server } from 'lucide-react';
import { SKILLS_DATA } from '../data/skillsData';
import { MCP_SERVERS_DATA } from '../data/mcpData';

export const PromptGeneratorView: React.FC = () => {
  const [taskGoal, setTaskGoal] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'global_rules',
    'ponytail',
    'tdd',
    'karpathy-skills',
    'code-review',
    'task-observer',
    'grill-me',
    'subagent-orchestrator',
    'superpowers'
  ]);
  const [selectedMcps, setSelectedMcps] = useState<string[]>([
    'filesystem',
    'github',
    'notion',
    'memory',
    'sequential-thinking',
    'visualization'
  ]);
  const [selectedTier, setSelectedTier] = useState('gemini-flash');
  const [copied, setCopied] = useState(false);

  const toggleSkill = (name: string) => {
    setSelectedSkills((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const toggleMcp = (id: string) => {
    setSelectedMcps((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const generatedPrompt = `# Antigravity 2026 Autonomous Agent Prompt
Target Model: ${selectedTier}
Active Task Goal: ${taskGoal || '<Define your objective here>'}

## Autonomous Tooling & MCP Execution Directive:
- **Autonomous Execution**: Proactively and automatically invoke any authorized tools, subagents, commands, and file operations needed to accomplish the task. Do NOT halt or ask for manual step-by-step approval unless facing irreversible destructive data operations or explicit human checkpoints.
- **Self-Directed Action**: Discover context, inspect schemas, write code, run verification test suites, and fix any errors end-to-end.

## Active Skills & Behavioral Harnesses:
${selectedSkills.map((s) => `- ${s}`).join('\n')}

## Authorized MCP Servers:
${selectedMcps.map((m) => `- ${m}`).join('\n')}

## Mandatory Execution Invariants:
1. Affirm Single-Task Delivery Contract: 1 Task -> 1 Agent Session -> 1 PR.
2. Ultra-Lean Orchestration: Primary orchestrator keeps active context <600 tokens; delegate heavy research and coding to subagents.
3. Ponytail Laziness Ladder: YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Surgical Code.
4. Karpathy Grounding Disciplines: Think before coding, surgical edits only, zero adjacent code churn.
5. Deterministic Verification: Verify locally with test suite (max 3 retry bounds) before finishing.

Proceed immediately to analyze, execute, and verify with 0 token waste.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-pink-950/30 border border-border p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Agent Prompt Builder</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Prompt Generator</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Compose custom agent workflows by mixing and matching skills, MCP servers, and model tiers into standardized Antigravity session prompts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Goal Input */}
          <div className="glass-card rounded-2xl p-5 border border-border space-y-3">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              1. Define Task Objective
            </label>
            <textarea
              rows={3}
              value={taskGoal}
              onChange={(e) => setTaskGoal(e.target.value)}
              placeholder="e.g. Implement user authentication with OAuth and pass unit tests..."
              className="w-full bg-background/80 border border-border rounded-xl p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Model Selection */}
          <div className="glass-card rounded-2xl p-5 border border-border space-y-3">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              2. Target Model & Routing Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'gemini-flash', label: 'Gemini 3.7 Flash', desc: '1.5k RPD Architect' },
                { id: 'groq-llama', label: 'Groq Llama 3.3', desc: 'Sub-second TDD' },
                { id: 'mistral-codestral', label: 'Codestral Latest', desc: 'Precision Code' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedTier(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTier === m.id
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                      : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="font-bold text-foreground text-xs">{m.label}</div>
                  <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Select Skills */}
          <div className="glass-card rounded-2xl p-5 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>3. Attach Skills & Disciplines ({selectedSkills.length})</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
              {SKILLS_DATA.map((s) => {
                const isSelected = selectedSkills.includes(s.name);
                return (
                  <button
                    key={s.name}
                    onClick={() => toggleSkill(s.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20'
                        : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select MCP Servers */}
          <div className="glass-card rounded-2xl p-5 border border-border space-y-3">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Authorize MCP Servers ({selectedMcps.length})</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {MCP_SERVERS_DATA.map((m) => {
                const isSelected = selectedMcps.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMcp(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-500/20'
                        : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & Copy */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-border space-y-3 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Generated Agent Instructions</span>
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-md shadow-purple-600/30 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>

            <pre className="bg-background/90 p-4 rounded-xl border border-border font-mono text-xs text-purple-200/90 whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed">
              {generatedPrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
