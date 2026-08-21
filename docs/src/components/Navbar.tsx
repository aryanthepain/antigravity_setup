import React from 'react';
import { Zap, Server, Cpu, Sparkles, BookOpen, Sun, Moon, Search } from 'lucide-react';

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
    { id: 'skills' as ActiveTab, label: 'Skills Catalog', icon: Zap, count: skillCount },
    { id: 'mcp' as ActiveTab, label: 'MCP Tools Hub', icon: Server, count: toolCount },
    { id: 'architecture' as ActiveTab, label: 'Architecture & Router', icon: Cpu },
    { id: 'generator' as ActiveTab, label: 'Agent Builder', icon: Sparkles },
    { id: 'setup' as ActiveTab, label: 'Setup Guide', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('skills')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-foreground text-lg">Antigravity</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">2026</span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">Zero-Budget Engineering Control Center</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-blue-700/80 text-blue-100' : 'bg-background/80 text-muted-foreground'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/80 hover:bg-muted border border-border text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Search (Ctrl+K)</span>
            <kbd className="hidden sm:inline text-[10px] bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-muted/80 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-border bg-background/95 px-2 py-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                isActive ? 'text-blue-500' : 'text-muted-foreground'
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
