import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Server, Cpu, X, ArrowRight } from 'lucide-react';
import { SKILLS_DATA, Skill } from '../data/skillsData';
import { MCP_SERVERS_DATA, McpTool, McpServer } from '../data/mcpData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skill: Skill) => void;
  onSelectTool: (server: McpServer, tool: McpTool) => void;
  onNavigateTab: (tab: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectSkill,
  onSelectTool,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search Skills
  const matchingSkills = SKILLS_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(normalizedQuery) ||
      s.description.toLowerCase().includes(normalizedQuery) ||
      s.trigger.toLowerCase().includes(normalizedQuery) ||
      s.category.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5);

  // Search Tools
  const matchingTools: { server: McpServer; tool: McpTool }[] = [];
  for (const server of MCP_SERVERS_DATA) {
    if (server.tools) {
      for (const tool of server.tools) {
        if (
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.description.toLowerCase().includes(normalizedQuery) ||
          server.name.toLowerCase().includes(normalizedQuery)
        ) {
          matchingTools.push({ server, tool });
          if (matchingTools.length >= 5) break;
        }
      }
    }
    if (matchingTools.length >= 5) break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-muted/40">
          <Search className="w-5 h-5 text-blue-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, MCP tools, triggers, or routing rules..."
            className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          {!normalizedQuery && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase px-2">Quick Navigation</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onNavigateTab('skills'); onClose(); }}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted/80 text-left transition-colors border border-border/50 text-xs text-foreground"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Browse 53+ Skills</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('mcp'); onClose(); }}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted/80 text-left transition-colors border border-border/50 text-xs text-foreground"
                >
                  <Server className="w-4 h-4 text-emerald-500" />
                  <span>Inspect 104+ MCP Tools</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('architecture'); onClose(); }}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted/80 text-left transition-colors border border-border/50 text-xs text-foreground"
                >
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span>Model Router & Ponytail</span>
                </button>
                <button
                  onClick={() => { onNavigateTab('generator'); onClose(); }}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-muted/80 text-left transition-colors border border-border/50 text-xs text-foreground"
                >
                  <Search className="w-4 h-4 text-purple-500" />
                  <span>Agent Prompt Generator</span>
                </button>
              </div>
            </div>
          )}

          {/* Matching Skills */}
          {matchingSkills.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase px-2">Skills ({matchingSkills.length})</div>
              {matchingSkills.map((skill) => (
                <div
                  key={skill.name}
                  onClick={() => { onSelectSkill(skill); onClose(); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 border border-transparent cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <span>{skill.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">{skill.category}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{skill.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}

          {/* Matching MCP Tools */}
          {matchingTools.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase px-2">MCP Tools ({matchingTools.length})</div>
              {matchingTools.map(({ server, tool }) => (
                <div
                  key={`${server.id}-${tool.name}`}
                  onClick={() => { onSelectTool(server, tool); onClose(); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-transparent cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Server className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <span>{tool.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">{server.name}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{tool.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}

          {normalizedQuery && matchingSkills.length === 0 && matchingTools.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-xs">
              No matching skills or MCP tools found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-muted/60 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
