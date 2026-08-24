import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Cpu,
  Layers,
  Terminal,
  FileCode,
  Zap,
  CheckCircle2,
  Bug,
  Database,
  Dna,
  Layout,
  Info
} from 'lucide-react';
import { SKILLS_DATA } from '../data/skillsData';
import { MCP_SERVERS_DATA } from '../data/mcpData';
import { SITUATIONS_DATA, PONYTAIL_LADDER, MODEL_TIERS, SituationArchetype, DEFAULT_ACTIVE_SKILLS, DEFAULT_ACTIVE_MCPS } from '../data/situationsData';

export const PromptGeneratorView: React.FC = () => {
  // Situation Archetype
  const [activeSituationId, setActiveSituationId] = useState<string>('swarm-orchestrator');

  // Core Configuration State
  const [taskGoal, setTaskGoal] = useState<string>(
    'Orchestrate a complex multi-file architectural refactor across services while delegating file inspection and drafting to CLI workers.'
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(DEFAULT_ACTIVE_SKILLS);
  const [selectedMcps, setSelectedMcps] = useState<string[]>(DEFAULT_ACTIVE_MCPS);
  const [selectedTier, setSelectedTier] = useState<string>('gemini-flash');
  const [ponytailLevel, setPonytailLevel] = useState<number>(6);
  const [subagentPolicy, setSubagentPolicy] = useState<'lean-orchestrator' | 'fast-path' | 'swarm-workers'>('lean-orchestrator');
  
  // Behavioral Gates
  const [gate1Grilling, setGate1Grilling] = useState<boolean>(true);
  const [gate2Review, setGate2Review] = useState<boolean>(true);
  const [audioAlarm, setAudioAlarm] = useState<boolean>(true);
  const [boundedLoops, setBoundedLoops] = useState<boolean>(true);

  // Skill filter category in UI
  const [skillCategory, setSkillCategory] = useState<string>('all');

  // Output format tab: 'prompt' | 'json' | 'skill' | 'cli'
  const [outputTab, setOutputTab] = useState<'prompt' | 'json' | 'skill' | 'cli'>('prompt');
  const [copied, setCopied] = useState<boolean>(false);

  // Switch Situation preset
  const handleSelectSituation = (situation: SituationArchetype) => {
    setActiveSituationId(situation.id);
    setTaskGoal(situation.defaultGoal);
    setSelectedSkills(situation.skills);
    setSelectedMcps(situation.mcps);
    setSelectedTier(situation.modelTier);
    setPonytailLevel(situation.ponytailLevel);
    setSubagentPolicy(situation.subagentPolicy);
    setGate1Grilling(situation.gate1Grilling);
    setGate2Review(situation.gate2Review);
    setAudioAlarm(situation.audioAlarm);
  };

  const toggleSkill = (name: string) => {
    if (selectedSkills.includes(name)) {
      setSelectedSkills(selectedSkills.filter(s => s !== name));
    } else {
      setSelectedSkills([...selectedSkills, name]);
    }
  };

  const toggleMcp = (id: string) => {
    if (selectedMcps.includes(id)) {
      setSelectedMcps(selectedMcps.filter(m => m !== id));
    } else {
      setSelectedMcps([...selectedMcps, id]);
    }
  };

  // Generate output texts based on active configuration
  const generatePromptMarkdown = (): string => {
    const activeSit = SITUATIONS_DATA.find(s => s.id === activeSituationId);
    const ladderInfo = PONYTAIL_LADDER.find(l => l.level === ponytailLevel);
    const tierInfo = MODEL_TIERS.find(t => t.id === selectedTier);

    return `# Antigravity Autonomous Agent Execution Contract (2026)

## 1. Primary Objective & Context
${taskGoal.trim() || 'Execute bounded task according to architectural guidelines.'}

## 2. Model Tier & Strategy
- **Primary Model**: ${tierInfo?.name || selectedTier} (${tierInfo?.provider || 'Native'})
- **Subagent Policy**: ${
      subagentPolicy === 'lean-orchestrator'
        ? 'Ultra-Lean Orchestrator (<600 tokens active context, mandatory subagent delegation)'
        : subagentPolicy === 'swarm-workers'
        ? 'Multi-Agent Swarm with specialized Codestral/Groq LPU worker processes'
        : 'Direct Fast-Path Execution with surgical patches'
    }
- **Anti-Bloat Laziness Standard**: ${ladderInfo?.name} (${ladderInfo?.desc})

## 3. Human & Deterministic Verification Gates
${gate1Grilling ? '- **Gate 1 (Mandatory User Grilling)**: Stop and grill the human with Socratic trade-off questions before modifying code.\n' : ''}${gate2Review ? '- **Gate 2 (PR Review)**: Require explicit human confirmation before opening or merging pull requests.\n' : ''}${boundedLoops ? '- **Bounded Verification Loop**: Maximum 3 deterministic test-fix cycles. Stop immediately on attempt 3 failure.\n' : ''}${audioAlarm ? '- **Audio Alarm Alert**: Trigger `pwsh -File .\\scripts\\agent-alarm.ps1 -Type Success` upon completion.\n' : ''}
## 4. Activated Skills (${selectedSkills.length})
${selectedSkills.length > 0 ? selectedSkills.map(s => `- \`${s}\``).join('\n') : '- None'}

## 5. Connected MCP Servers (${selectedMcps.length})
${selectedMcps.length > 0 ? selectedMcps.map(m => `- \`${m}\``).join('\n') : '- None'}

${activeSit ? `## 6. Situational Guidelines (${activeSit.name})\n` + activeSit.guidelines.map(g => `- ${g}`).join('\n') : ''}
`;
  };

  const generateAgentJson = (): string => {
    const payload = {
      name: `agent-${activeSituationId}`,
      version: '2026.1.0',
      description: taskGoal,
      model: selectedTier,
      strategy: {
        subagentPolicy,
        ponytailLevel,
        maxLoops: boundedLoops ? 3 : 10
      },
      gates: {
        gate1Grilling,
        gate2Review,
        audioAlarm
      },
      skills: selectedSkills,
      mcpServers: selectedMcps
    };
    return JSON.stringify(payload, null, 2);
  };

  const generateSkillMd = (): string => {
    const sit = SITUATIONS_DATA.find(s => s.id === activeSituationId);
    return `---
name: custom-${activeSituationId}
description: Autonomous agent playbook for ${sit?.name || 'custom workflows'}.
version: 2026.1.0
skills:
${selectedSkills.map(s => `  - ${s}`).join('\n')}
mcp:
${selectedMcps.map(m => `  - ${m}`).join('\n')}
---

# ${sit?.name || 'Custom Agent Workflow'}

## Objectives
${taskGoal}

## Execution Invariants
- Ponytail Ladder Level: ${ponytailLevel} (${PONYTAIL_LADDER.find(l => l.level === ponytailLevel)?.name})
- Subagent Policy: ${subagentPolicy}
- Gate 1 Planning Grilling: ${gate1Grilling ? 'Enforced' : 'Disabled'}
- Gate 2 Review: ${gate2Review ? 'Enforced' : 'Disabled'}
`;
  };

  const generateCliCommand = (): string => {
    if (subagentPolicy === 'lean-orchestrator' || subagentPolicy === 'swarm-workers') {
      return `node .\\scripts\\subagent.js --task code --prompt "${taskGoal.replace(/"/g, '\\"')}"`;
    }
    return `pwsh -Command "node .\\scripts\\subagent.js --task research --query '${taskGoal.replace(/'/g, "''")}'"`;
  };

  const getActiveOutputText = (): string => {
    switch (outputTab) {
      case 'prompt':
        return generatePromptMarkdown();
      case 'json':
        return generateAgentJson();
      case 'skill':
        return generateSkillMd();
      case 'cli':
        return generateCliCommand();
      default:
        return generatePromptMarkdown();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveOutputText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const defaultSit = SITUATIONS_DATA.find(s => s.id === 'swarm-orchestrator') || SITUATIONS_DATA[0];
    handleSelectSituation(defaultSit);
  };

  const filteredSkills = SKILLS_DATA.filter(skill => {
    if (skillCategory === 'all') return true;
    return skill.category === skillCategory;
  });

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'core', label: 'Core & Rules' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'cloud', label: 'Data & ML' },
    { id: 'science', label: 'Science' },
    { id: 'flutter', label: 'Dart/Flutter' }
  ];

  // Token estimate helper
  const estimatedTokens = Math.round(getActiveOutputText().length / 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 glass-panel border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>2026 Situation & Prompt Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">
              Agent Builder & Prompt Architect
            </h1>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl">
              Construct high-performance, bounded agent specifications tailored for distinct real-world situations with deterministic verification gates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Active Output'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Situation Archetypes Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Select Situation Archetype</span>
          </label>
          <span className="text-xs text-slate-400">
            6 Specialized Workflows
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SITUATIONS_DATA.map(situation => {
            const isSelected = activeSituationId === situation.id;
            return (
              <div
                key={situation.id}
                onClick={() => handleSelectSituation(situation)}
                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'glass-card-selected'
                    : 'glass-card hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${situation.color} text-white shadow-md`}>
                      {situation.iconName === 'Layout' && <Layout className="w-4 h-4" />}
                      {situation.iconName === 'Bug' && <Bug className="w-4 h-4" />}
                      {situation.iconName === 'Database' && <Database className="w-4 h-4" />}
                      {situation.iconName === 'Dna' && <Dna className="w-4 h-4" />}
                      {situation.iconName === 'ShieldAlert' && <ShieldAlert className="w-4 h-4" />}
                      {situation.iconName === 'Zap' && <Zap className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{situation.name}</h4>
                      <span className="text-[11px] font-medium text-cyan-400 uppercase tracking-wider">{situation.badge}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {situation.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Pane Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Configuration Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Goal & Task Input */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Task Goal & Prompt Instruction</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {taskGoal.length} chars
              </span>
            </label>
            <textarea
              rows={3}
              value={taskGoal}
              onChange={e => setTaskGoal(e.target.value)}
              placeholder="Define the task objective, scope, and expected outcome..."
              className="w-full bg-slate-900/90 text-slate-100 text-sm rounded-xl p-3.5 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Model Engine & Subagent Strategy */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Model Tier & Subagent Execution Strategy</span>
              </label>
            </div>

            {/* Model Tier Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MODEL_TIERS.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    selectedTier === tier.id
                      ? 'border-indigo-500/80 bg-indigo-950/40 text-indigo-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200 truncate">{tier.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tier.speed}</div>
                </button>
              ))}
            </div>

            {/* Subagent Policy Radio Pills */}
            <div className="pt-2">
              <span className="text-xs text-slate-400 mb-2 block font-medium">Orchestration & Subagent Delegation:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'lean-orchestrator', label: 'Ultra-Lean (<600 tok)', desc: 'Mandatory worker subagents' },
                  { id: 'swarm-workers', label: 'Multi-Agent Swarm', desc: 'Codestral & Groq LPU' },
                  { id: 'fast-path', label: 'Direct Fast-Path', desc: 'Solo surgical patches' }
                ].map(policy => (
                  <button
                    key={policy.id}
                    onClick={() => setSubagentPolicy(policy.id as any)}
                    className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                      subagentPolicy === policy.id
                        ? 'border-cyan-500/80 bg-cyan-950/30 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{policy.label}</div>
                    <div className="text-[10px] text-slate-400">{policy.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ponytail Laziness Anti-Bloat Ladder */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Ponytail Laziness Anti-Bloat Ladder</span>
              </label>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {PONYTAIL_LADDER.find(l => l.level === ponytailLevel)?.name}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={ponytailLevel}
              onChange={e => setPonytailLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <strong className="text-slate-200">Rule: </strong>
              {PONYTAIL_LADDER.find(l => l.level === ponytailLevel)?.desc}
            </p>
          </div>

          {/* Verification Gates & Checkpoints */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Behavioral Invariants & Verification Gates</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: 'Gate 1 Planning Grilling', state: gate1Grilling, setter: setGate1Grilling, desc: 'Socratic trade-off interview' },
                { label: 'Gate 2 PR Review Approval', state: gate2Review, setter: setGate2Review, desc: 'Explicit human checkpoint' },
                { label: 'Bounded Loop (Max 3 Fixes)', state: boundedLoops, setter: setBoundedLoops, desc: 'Stops token waste on loop 3' },
                { label: 'Audio Alarm Alerts', state: audioAlarm, setter: setAudioAlarm, desc: 'Chimes on task completion' }
              ].map(gate => (
                <div
                  key={gate.label}
                  onClick={() => gate.setter(!gate.state)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    gate.state
                      ? 'border-rose-500/40 bg-rose-950/20 text-slate-200'
                      : 'border-slate-800 bg-slate-900/40 text-slate-500'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold">{gate.label}</div>
                    <div className="text-[10px] text-slate-400">{gate.desc}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      gate.state ? 'bg-rose-500 border-rose-400' : 'border-slate-700'
                    }`}
                  >
                    {gate.state && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Matrix */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Skills Capability Matrix ({selectedSkills.length} Selected)</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSkillCategory(cat.id)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                      skillCategory === cat.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill.name);
                return (
                  <button
                    key={skill.name}
                    onClick={() => toggleSkill(skill.name)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-cyan-500/80 bg-cyan-950/40 text-cyan-200 shadow-sm shadow-cyan-500/20'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span>{skill.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MCP Servers Matrix */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Connected MCP Servers ({selectedMcps.length} Selected)</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MCP_SERVERS_DATA.map(mcp => {
                const isSelected = selectedMcps.includes(mcp.id);
                return (
                  <button
                    key={mcp.id}
                    onClick={() => toggleMcp(mcp.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-950/30 text-amber-200 shadow-sm shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-200 truncate">{mcp.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{mcp.tools.length} tools</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & Export Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Format Tabs & Telemetry */}
          <div className="p-5 rounded-2xl glass-panel space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'prompt', label: 'Prompt' },
                  { id: 'json', label: 'JSON Config' },
                  { id: 'skill', label: 'SKILL.md' },
                  { id: 'cli', label: 'CLI Command' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOutputTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      outputTab === tab.id
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                ~{estimatedTokens} tok
              </span>
            </div>

            {/* Live Output View */}
            <div className="relative">
              <pre className="w-full bg-slate-950/90 text-slate-200 text-xs font-mono rounded-xl p-4 border border-slate-800 h-[480px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {getActiveOutputText()}
              </pre>

              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all hover:scale-105 active:scale-95 shadow-md"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Action Bar Footer */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ready to inject into Antigravity session</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
