import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { SkillsView } from './components/SkillsView';
import { SkillDetailModal } from './components/SkillDetailModal';
import { McpView } from './components/McpView';
import { McpToolModal } from './components/McpToolModal';
import { ArchitectureView } from './components/ArchitectureView';
import { PromptGeneratorView } from './components/PromptGeneratorView';
import { SetupGuideView } from './components/SetupGuideView';
import { CommandPalette } from './components/CommandPalette';
import { SKILLS_DATA, Skill } from './data/skillsData';
import { McpServer, McpTool, TOTAL_MCP_TOOLS_COUNT } from './data/mcpData';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('skills');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedMcpServer, setSelectedMcpServer] = useState<McpServer | null>(null);
  const [selectedMcpTool, setSelectedMcpTool] = useState<McpTool | null>(null);

  // Keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme synchronization with html tag
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleSelectTool = (server: McpServer, tool: McpTool) => {
    setSelectedMcpServer(server);
    setSelectedMcpTool(tool);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        openSearch={() => setIsSearchOpen(true)}
        skillCount={SKILLS_DATA.length}
        toolCount={TOTAL_MCP_TOOLS_COUNT}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'skills' && <SkillsView onSelectSkill={(skill) => setSelectedSkill(skill)} />}
        {activeTab === 'mcp' && <McpView onSelectTool={handleSelectTool} />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'generator' && <PromptGeneratorView />}
        {activeTab === 'setup' && <SetupGuideView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/60 mt-12 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Antigravity 2026</span>
            <span>•</span>
            <span>Zero-Budget Autonomous AI Engineering</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('setup')} className="hover:text-foreground transition-colors">
              Setup Guide
            </button>
            <button onClick={() => setActiveTab('architecture')} className="hover:text-foreground transition-colors">
              Ponytail Ladder
            </button>
            <a
              href="https://github.com/aryanthepain"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              @aryanthepain
            </a>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <SkillDetailModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      <McpToolModal
        server={selectedMcpServer}
        tool={selectedMcpTool}
        onClose={() => {
          setSelectedMcpServer(null);
          setSelectedMcpTool(null);
        }}
      />
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSkill={(skill) => setSelectedSkill(skill)}
        onSelectTool={handleSelectTool}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};
