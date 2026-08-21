import React, { useState } from 'react';
import { Server, Search, Terminal, ArrowUpRight } from 'lucide-react';
import { MCP_SERVERS_DATA, McpServer, McpTool } from '../data/mcpData';

interface McpViewProps {
  onSelectTool: (server: McpServer, tool: McpTool) => void;
}

export const McpView: React.FC<McpViewProps> = ({ onSelectTool }) => {
  const [selectedServerId, setSelectedServerId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServers = MCP_SERVERS_DATA.filter((server) => {
    if (selectedServerId !== 'all' && server.id !== selectedServerId) return false;
    return true;
  });

  const totalToolsCount = MCP_SERVERS_DATA.reduce((sum, s) => sum + (s.tools?.length || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/40 border border-border p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Server className="w-3.5 h-3.5" />
            <span>MCP Protocol & Tool Schemas</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            MCP Servers & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Tools Hub</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Directly connect your agent to 14 standard MCP servers and {totalToolsCount}+ specialized tools. Inspect parameter schemas, build test invocations, and copy configuration snippets.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center gap-3 bg-card/80 border border-border p-2 rounded-2xl max-w-xl shadow-lg backdrop-blur-md">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search MCP tools by name, server, or parameter..."
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

      {/* Server Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedServerId('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
            selectedServerId === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
          }`}
        >
          <span>⚡</span>
          <span>All Servers ({MCP_SERVERS_DATA.length})</span>
        </button>
        {MCP_SERVERS_DATA.map((server) => {
          const isSelected = selectedServerId === server.id;
          return (
            <button
              key={server.id}
              onClick={() => setSelectedServerId(server.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              <span>{server.icon}</span>
              <span>{server.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-background text-muted-foreground'
              }`}>
                {server.tools?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Servers & Tools List */}
      <div className="space-y-8">
        {filteredServers.map((server) => {
          const q = searchQuery.toLowerCase().trim();
          const tools = (server.tools || []).filter((tool) => {
            if (!q) return true;
            return (
              tool.name.toLowerCase().includes(q) ||
              tool.description.toLowerCase().includes(q) ||
              server.name.toLowerCase().includes(q)
            );
          });

          if (tools.length === 0) return null;

          return (
            <div key={server.id} className="space-y-4">
              {/* Server Header */}
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                    {server.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-foreground text-base tracking-tight">{server.name}</h2>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        {server.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{server.description}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground px-2.5 py-1 rounded-lg bg-muted border border-border">
                  {tools.length} Tools
                </span>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tools.map((tool) => {
                  const paramCount = Object.keys(tool.properties || {}).length;
                  return (
                    <div
                      key={`${server.id}-${tool.name}`}
                      onClick={() => onSelectTool(server, tool)}
                      className="glass-card rounded-2xl p-4 cursor-pointer flex flex-col justify-between group hover:border-emerald-500/40"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
                            <code className="text-xs font-bold text-foreground font-mono group-hover:text-emerald-400 transition-colors">
                              {tool.name}
                            </code>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground font-mono">
                            {paramCount} params
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {tool.description || "No description provided."}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400/80 font-mono text-[10px]">
                          mcp_{server.id}_{tool.name}
                        </span>
                        <span className="flex items-center gap-0.5 text-emerald-400 font-medium opacity-80 group-hover:opacity-100">
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
