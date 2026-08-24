import React from 'react';
import { Zap, Server, Cpu, Sparkles, BookOpen, Sun, Moon, Search, GitBranch } from 'lucide-react';

export type ActiveTab = 'skills' | 'mcp' | 'architecture' | 'generator' | 'setup';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  openSearch: () => void;
  skillCount: number;
  toolCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  openSearch,
  skillCount,
  toolCount,
}) => {
  const tabs = [
    { id: 'generator' as ActiveTab, label: 'Agent Builder', icon: Sparkles, badge: 'Expanded' },
    { id: 'skills' as ActiveTab, label: 'Skills Catalog', icon: Zap, count: skillCount },
    { id: 'mcp' as ActiveTab, label: 'MCP Tools Hub', icon: Server, count: toolCount },
    { id: 'architecture' as ActiveTab, label: 'Architecture & Router', icon: Cpu },
    { id: 'setup' as ActiveTab, label: 'Setup Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Branch Badge */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('generator')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-foreground text-lg bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">
                Antigravity
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                2026.1
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <GitBranch className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[10px]">feature/reimagined-control-center</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/80 p-1.5 rounded-2xl border border-border/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/20 text-white' : 'bg-background/80 text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted/80 hover:bg-muted border border-border/80 text-xs text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-[10px] bg-background px-1.5 py-0.5 rounded border border-border">Ctrl+K</kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-muted/80 hover:bg-muted border border-border/80 text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-border/80 bg-background/95 px-2 py-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
