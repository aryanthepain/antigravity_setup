import React, { useState } from 'react';
import { X, Copy, Check, Server, Terminal, Code } from 'lucide-react';
import { McpTool, McpServer } from '../data/mcpData';

interface McpToolModalProps {
  server: McpServer | null;
  tool: McpTool | null;
  onClose: () => void;
}

export const McpToolModal: React.FC<McpToolModalProps> = ({ server, tool, onClose }) => {
  const [params, setParams] = useState<Record<string, any>>({});
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!server || !tool) return null;

  const propertyKeys = Object.keys(tool.properties || {});
  const requiredList: string[] = Array.isArray(tool.required)
    ? tool.required
    : typeof tool.required === 'string'
    ? [tool.required]
    : [];

  const handleParamChange = (key: string, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generatedPayload = {
    server: server.id,
    tool: tool.name,
    arguments: params,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(generatedPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(tool, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-lg">{tool.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {server.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{propertyKeys.length} parameters</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-foreground">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description</h4>
            <p className="text-sm text-foreground leading-relaxed bg-muted/40 p-3.5 rounded-xl border border-border">
              {tool.description || "No detailed description provided."}
            </p>
          </div>

          {/* Parameters Explorer */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>Parameter Definitions & Interactive Tester</span>
              </h4>
              <button
                onClick={handleCopySchema}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Schema Copied' : 'Copy Raw Schema'}</span>
              </button>
            </div>

            {propertyKeys.length === 0 ? (
              <div className="text-muted-foreground italic bg-muted/30 p-4 rounded-xl border border-border">
                This tool takes no required or optional arguments.
              </div>
            ) : (
              <div className="space-y-3">
                {propertyKeys.map((key) => {
                  const prop = tool.properties[key];
                  const isRequired = requiredList.includes(key);
                  return (
                    <div key={key} className="bg-muted/50 p-3.5 rounded-xl border border-border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <code className="text-emerald-400 font-semibold font-mono text-xs">{key}</code>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-background border border-border text-muted-foreground">
                            {prop.type || 'any'}
                          </span>
                          {isRequired && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                      {prop.description && (
                        <p className="text-[11px] text-muted-foreground">{prop.description}</p>
                      )}
                      {/* Input for interactive test payload */}
                      <input
                        type="text"
                        placeholder={`Enter value for ${key}...`}
                        value={params[key] || ''}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="w-full bg-background/80 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Generated MCP Call Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Code className="w-3.5 h-3.5" />
                <span>Generated Invocation JSON</span>
              </h4>
              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-background hover:bg-muted border border-border text-[11px] text-muted-foreground transition-all"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-background/90 p-4 rounded-xl border border-border font-mono text-xs text-emerald-300 overflow-x-auto">
              {JSON.stringify(generatedPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-muted/60 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Compatible with Google Antigravity & Claude MCP Client</span>
          <button
            onClick={handleCopyPayload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            {copiedPayload ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Copy Invocation Payload</span>
          </button>
        </div>
      </div>
    </div>
  );
};
