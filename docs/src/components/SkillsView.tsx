import React, { useState } from 'react';
import { Search, Zap, ArrowUpRight, Filter } from 'lucide-react';
import { SKILLS_DATA, SKILL_CATEGORIES, Skill } from '../data/skillsData';

interface SkillsViewProps {
  onSelectSkill: (skill: Skill) => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ onSelectSkill }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSkills = SKILLS_DATA.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      skill.name.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q) ||
      skill.trigger.toLowerCase().includes(q) ||
      skill.details.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleQuickFilter = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 border border-border/80 p-6 sm:p-8 glass-panel">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Capabilities Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Antigravity <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Skills Catalog</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Curated repository of 53+ specialized engineering workflows, behavioral constraints, and verification protocols. All skills execute seamlessly under global invariants.
          </p>
        </div>

        {/* Search Bar inside Hero */}
        <div className="mt-6 flex items-center gap-3 bg-card/80 border border-border/80 p-2 rounded-2xl max-w-xl shadow-lg backdrop-blur-md">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, trigger keywords, or workflow..."
            className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quick Match Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div
          onClick={() => handleQuickFilter('grill')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-cyan-500/50 group"
        >
          <div className="text-2xl mb-2">📋</div>
          <h4 className="text-xs font-bold text-foreground group-hover:text-cyan-400 transition-colors">Need to Clarify or Plan?</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">grill-me, write-a-prd, write-a-brief</p>
        </div>

        <div
          onClick={() => handleQuickFilter('ponytail')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-amber-500/50 group"
        >
          <div className="text-2xl mb-2">✂️</div>
          <h4 className="text-xs font-bold text-foreground group-hover:text-amber-400 transition-colors">Writing Minimal Code?</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">ponytail, global_rules, karpathy</p>
        </div>

        <div
          onClick={() => handleQuickFilter('loop')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-emerald-500/50 group"
        >
          <div className="text-2xl mb-2">🧪</div>
          <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-400 transition-colors">Verifying & Fixing Bugs?</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">tdd, dart-fix-runtime-errors, verify.ps1</p>
        </div>

        <div
          onClick={() => handleQuickFilter('security')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-rose-500/50 group"
        >
          <div className="text-2xl mb-2">🛡️</div>
          <h4 className="text-xs font-bold text-foreground group-hover:text-rose-400 transition-colors">Auditing Security?</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">accidental-data-loss, gcs-security</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </div>
        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.name}
            onClick={() => onSelectSkill(skill)}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Row */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-sm">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm group-hover:text-cyan-400 transition-colors">
                    {skill.name}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  {skill.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                {skill.description}
              </p>
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground font-mono truncate max-w-[180px]">
                {skill.command || skill.category}
              </span>
              <span className="flex items-center gap-1 text-cyan-400 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Inspect</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No skills found matching your search or category filter.
        </div>
      )}
    </div>
  );
};
