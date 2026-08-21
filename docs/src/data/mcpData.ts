import rawMcpData from '../../mcp_data.json';

export interface McpToolProperty {
  type: string;
  description?: string | null;
  enum?: string[];
  items?: {
    type?: string;
    description?: string;
  };
}

export interface McpTool {
  name: string;
  description: string;
  required?: string | string[] | null;
  properties: Record<string, McpToolProperty>;
}

export interface McpServer {
  id: string;
  name: string;
  toolCount: number;
  tools: McpTool[];
  icon?: string;
  description?: string;
  category?: string;
}

const SERVER_METADATA: Record<string, { icon: string; description: string; category: string }> = {
  'filesystem': {
    icon: '📁',
    description: 'Direct local filesystem operations: read, write, edit, search, and directory tree management.',
    category: 'System'
  },
  'github': {
    icon: '🐙',
    description: 'GitHub REST & GraphQL API operations: issues, pull requests, commits, branches, reviews, and code search.',
    category: 'DevOps'
  },
  'sequential-thinking': {
    icon: '🧠',
    description: 'Dynamic multi-step cognitive reasoning tool for breaking complex problems into structured hypotheses.',
    category: 'Cognitive'
  },
  'memory': {
    icon: '💾',
    description: 'Graph-based long-term memory: create entities, relations, observations, and retrieve associative context.',
    category: 'Cognitive'
  },
  'sqlite': {
    icon: '🗄️',
    description: 'Direct SQLite database query and schema inspection tool with automatic insight generation.',
    category: 'Database'
  },
  'fetch': {
    icon: '🌐',
    description: 'High-speed web content fetching and HTML-to-markdown conversion without browser overhead.',
    category: 'Network'
  },
  'playwright': {
    icon: '🎭',
    description: 'Full browser automation engine: navigation, screenshots, click, type, DOM inspection, and PDF export.',
    category: 'Testing'
  },
  'notion': {
    icon: '📝',
    description: 'Notion workspace integration: query databases, append blocks, update pages, and sync task boards.',
    category: 'Productivity'
  },
  'notebooks': {
    icon: '📓',
    description: 'Jupyter notebook cell management: insert markdown/code cells, read cell outputs, and execute code.',
    category: 'Data Science'
  },
  'visualization': {
    icon: '📊',
    description: 'Dynamic interactive chart renderer supporting bar, line, scatter, heatmap, and pie charts.',
    category: 'Data Science'
  },
  'data-agent-kit': {
    icon: '☁️',
    description: 'Google Cloud data platform inspection: active editor context, GCP connections, and cloud resource URIs.',
    category: 'Cloud'
  },
  'brave-search': {
    icon: '🦁',
    description: 'Real-time web search and local point of interest queries via Brave Search API.',
    category: 'Search'
  },
  'antimetal': {
    icon: '⚡',
    description: 'System telemetry, execution trace analysis, and crash diagnostics.',
    category: 'DevOps'
  }
};

export const MCP_SERVERS_DATA: McpServer[] = (rawMcpData as any[]).map(server => {
  const meta = SERVER_METADATA[server.id] || {
    icon: '🔌',
    description: `Official MCP server providing ${server.toolCount} tools for autonomous agent execution.`,
    category: 'Tools'
  };
  return {
    ...server,
    icon: meta.icon,
    description: meta.description,
    category: meta.category
  };
});

export const TOTAL_MCP_TOOLS_COUNT = MCP_SERVERS_DATA.reduce((acc, s) => acc + (s.tools?.length || 0), 0);
