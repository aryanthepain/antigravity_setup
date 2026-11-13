#!/usr/bin/env node
/**
 * 🤖 Antigravity Asymmetric Subagent Runner (2026)
 * 
 * Purpose: Enables the Chief Orchestrator model to delegate token-heavy tasks 
 * (codebase surveys, multi-file scans, code generation, adversarial reviews, and log compression)
 * to fast, free submodels (Groq LPU, Mistral Codestral, Google Gemini, OpenRouter) 
 * without bloating the primary conversation context window (<600 tokens active state).
 * 
 * Features:
 *   - Groq LPU Neural Router (<150ms dynamic model arbitration)
 *   - Dynamic OpenRouter Free Model Discovery & Intelligence/Capability Scoring
 *   - Strict Zero-Cost Enforcement (Guaranteed 100% free models only)
 *   - Automatic Resilient Cascade Fallbacks (HTTP 429 rate limit tolerance)
 * 
 * Usage:
 *   node ./scripts/subagent.js --task research --query "How does auth work?" --files "src/auth.ts,src/server.ts"
 *   node ./scripts/subagent.js --task code --file "src/utils.ts" --prompt "Add UUID generator"
 *   node ./scripts/subagent.js --task review [--diff | --file "src/main.ts"]
 *   node ./scripts/subagent.js --task compress --file "build.log"
 *   node ./scripts/subagent.js --task ask --prompt "..." --tier [fast|code|reasoning|cheap]
 *   node ./scripts/subagent.js --list-models [--sort intelligence|latest|code|reasoning]
 *   node ./scripts/subagent.js --refresh-models
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cache directory setup
const CACHE_DIR = path.join(process.env.USERPROFILE || process.env.HOME || '.', '.gemini', 'config', 'cache');
const OPENROUTER_CACHE_FILE = path.join(CACHE_DIR, 'openrouter_free_models.json');

// Subagent Provider Dashboard & Usage URLs
const PROVIDER_LINKS = {
  openrouter: {
    name: 'OpenRouter',
    usageUrl: 'https://openrouter.ai/settings/profile',
    activityUrl: 'https://openrouter.ai/activity',
    creditsUrl: 'https://openrouter.ai/credits',
    docsUrl: 'https://openrouter.ai/docs'
  },
  groq: {
    name: 'Groq LPU',
    usageUrl: 'https://console.groq.com/dashboard/usage',
    limitsUrl: 'https://console.groq.com/settings/limits',
    docsUrl: 'https://console.groq.com/docs'
  },
  mistral: {
    name: 'Mistral AI',
    usageUrl: 'https://admin.mistral.ai/organization/usage',
    billingUrl: 'https://console.mistral.ai/billing/',
    docsUrl: 'https://docs.mistral.ai/'
  },
  gemini: {
    name: 'Google Gemini',
    usageUrl: 'https://aistudio.google.com/u/1/usage',
    metricsUrl: 'https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/metrics',
    quotasUrl: 'https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas'
  },
  notion: {
    name: 'Notion MCP',
    usageUrl: 'https://www.notion.so/profile/integrations',
    docsUrl: 'https://developers.notion.com/'
  }
};

function wrapResponse(content, usage) {
  return {
    content: content || '',
    usage: usage || null,
    toString: () => content || ''
  };
}

// Path Traversal Security Guard: restricts file access strictly within current working directory
function isSafePath(filePath) {
  if (!filePath || typeof filePath !== 'string') return false;
  if (filePath.indexOf('\0') !== -1) return false;
  const cwd = path.resolve(process.cwd());
  const resolved = path.resolve(cwd, filePath);
  const relative = path.relative(cwd, resolved);
  return !relative.startsWith('..') && !path.isAbsolute(relative);
}

function readSafeFile(filePath) {
  if (!isSafePath(filePath)) {
    console.warn(`⚠️ [Security Warning] Path traversal blocked: '${filePath}' is outside workspace.`);
    return null;
  }
  const resolved = path.resolve(process.cwd(), filePath);
  try {
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return fs.readFileSync(resolved, 'utf-8');
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    help: false,
    task: 'ask',
    query: '',
    prompt: '',
    files: [],
    file: '',
    diff: false,
    tier: 'fast', // fast | code | reasoning | cheap
    model: '',
    provider: '',
    maxTokens: 1024,
    json: false,
    sort: 'intelligence', // intelligence | latest | code | reasoning | context
    router: 'auto', // auto | groq | direct
    listModels: false,
    refreshModels: false,
    usage: false,
    mode: 'read', // read | write
    confirm: false,
    tool: '',
    toolArgs: ''
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') params.help = true;
    else if (arg === '--task' || arg === '-t') params.task = args[++i];
    else if (arg === '--query' || arg === '-q') params.query = args[++i];
    else if (arg === '--prompt' || arg === '-p') params.prompt = args[++i];
    else if (arg === '--files') params.files = (args[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    else if (arg === '--file' || arg === '-f') params.file = args[++i];
    else if (arg === '--diff' || arg === '-d') params.diff = true;
    else if (arg === '--tier') params.tier = args[++i];
    else if (arg === '--model' || arg === '-m') params.model = args[++i];
    else if (arg === '--provider') params.provider = args[++i];
    else if (arg === '--max-tokens') params.maxTokens = parseInt(args[++i], 10);
    else if (arg === '--json') params.json = true;
    else if (arg === '--sort' || arg === '-s') params.sort = args[++i];
    else if (arg === '--router' || arg === '-r') params.router = args[++i];
    else if (arg === '--mode') params.mode = args[++i];
    else if (arg === '--confirm') params.confirm = true;
    else if (arg === '--tool') params.tool = args[++i];
    else if (arg === '--tool-args') params.toolArgs = args[++i];
    else if (arg === '--list-models' || arg === '-l') params.listModels = true;
    else if (arg === '--refresh-models') params.refreshModels = true;
    else if (arg === '--usage' || arg === '-u' || arg === '--metrics') params.usage = true;
    else if (!arg.startsWith('-') && !params.prompt) params.prompt = arg;
  }

  return params;
}

function printHelp() {
  console.log(`
🤖 Antigravity Asymmetric Subagent Runner (2026)

Purpose:
  Delegates token-heavy tasks (research, code drafting, adversarial reviews,
  and log compression) to ultra-fast submodels without bloating the primary
  Orchestrator context window (<600 tokens active state).

Usage:
  node ./scripts/subagent.js [options]
  node ./scripts/subagent.js --task <task> [options]

Tasks:
  research, explore   Inspect code files/context and extract concise findings (<250 tokens).
  code, patch         Surgical code generation / patch drafting following Ponytail rules.
  review, adversarial Independent adversarial review on git diff or specific files.
  compress, logs      Compress verbose terminal or test runner logs down to root causes & 1-line fix.
  notion              Retrieve and compress Notion pages/databases or perform guarded mutations.
  usage, metrics      Query live subagent endpoints for token usage, account quotas, and dashboard URLs.
  ask (default)       General fast queries or lightweight assistant responses.

Options:
  -t, --task <type>       Task mode: research | code | review | compress | notion | usage | ask (default: ask)
  -q, --query <string>    Research query or search question
  -p, --prompt <string>   Prompt instructions for code, ask, or compress
  -f, --file <path>       Target file path to inspect, modify, or review
      --files <list>      Comma-separated list of file paths for multi-file research
  -d, --diff              Use git diff (HEAD / staged) as context for review task
      --tier <tier>       Model routing tier: fast | code | reasoning | cheap (default: fast)
  -m, --model <name>      Explicit model override (e.g. openai/gpt-oss-120b, codestral-latest)
      --provider <name>   Explicit provider name override (groq | mistral | gemini | openrouter)
  -r, --router <name>     Router engine: groq | auto | direct (default: auto)
  -s, --sort <criteria>   Sort OpenRouter models: intelligence | latest | code | reasoning | context
      --mode <mode>       Notion mode: read | write (default: read)
      --confirm           Confirm guarded write operations for Notion mutations
  -l, --list-models       Display discovered and ranked zero-cost models table
      --refresh-models    Force refresh of OpenRouter free models cache
  -u, --usage, --metrics  Display live usage metrics, token quotas, and dashboard URLs for all subagents
      --max-tokens <int>  Maximum output tokens (default: 1024)
      --json              Output response as structured JSON ({ provider, model, output })
  -h, --help              Show this help menu and exit

Examples:
  node ./scripts/subagent.js --usage
  node ./scripts/subagent.js --list-models --sort intelligence
  node ./scripts/subagent.js --task research --query "How does auth work?" --files "src/auth.ts,src/server.ts"
  node ./scripts/subagent.js --task code --file "src/utils.ts" --prompt "Add UUID generator"
  node ./scripts/subagent.js --task review --diff
  node ./scripts/subagent.js --task compress --file "build.log"
  node ./scripts/subagent.js --task ask --prompt "Explain the Karpathy ladder" --tier fast
`);
}

// Environment Keys
const KEYS = {
  gemini: process.env.GEMINI_API_KEY,
  groq: process.env.GROQ_API_KEY,
  mistral: process.env.MISTRAL_API_KEY,
  openrouter: process.env.OPENROUTER_API_KEY,
  // [PAID TIERS - REMOVED FROM ROTATION. Uncomment when keys are available]
  // deepseek: process.env.DEEPSEEK_API_KEY,
  // xai: process.env.XAI_API_KEY || process.env.GROK_API_KEY
};

// -------------------------------------------------------------
// Dynamic OpenRouter Free Model Discovery & Intelligence Engine
// -------------------------------------------------------------

async function getOpenRouterFreeModels(forceRefresh = false) {
  if (!forceRefresh && fs.existsSync(OPENROUTER_CACHE_FILE)) {
    try {
      const stats = fs.statSync(OPENROUTER_CACHE_FILE);
      const ageMs = Date.now() - stats.mtimeMs;
      if (ageMs < 45 * 60 * 1000) { // 45 minutes cache TTL
        const cached = JSON.parse(fs.readFileSync(OPENROUTER_CACHE_FILE, 'utf8'));
        if (cached && Array.isArray(cached.models) && cached.models.length > 0) {
          return cached;
        }
      }
    } catch (e) {}
  }

  try { fs.mkdirSync(CACHE_DIR, { recursive: true }); } catch (e) {}

  let freeModels = [];
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models');
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        freeModels = json.data.filter(m => {
          // Hard rejection if pricing is non-zero
          const promptPrice = m.pricing ? parseFloat(m.pricing.prompt || '0') : 0;
          const completionPrice = m.pricing ? parseFloat(m.pricing.completion || '0') : 0;
          if (promptPrice > 0 || completionPrice > 0) return false;

          // Must either end in :free or have verified $0.00 pricing
          const isExplicitFree = m.id.endsWith(':free');
          const isExplicitZeroPrice = m.pricing && promptPrice === 0 && completionPrice === 0;
          return isExplicitFree || isExplicitZeroPrice;
        });
      }
    }
  } catch (e) {
    if (fs.existsSync(OPENROUTER_CACHE_FILE)) {
      try { return JSON.parse(fs.readFileSync(OPENROUTER_CACHE_FILE, 'utf8')); } catch (err) {}
    }
  }

  function scoreModel(m) {
    let base = 0;
    let codeScore = 0;
    let reasoningScore = 0;
    const text = ((m.description || '') + ' ' + (m.name || '') + ' ' + m.id).toLowerCase();

    // Scale Estimation
    if (text.includes('550b') || text.includes('ultra')) base += 100;
    else if (text.includes('120b') || text.includes('super')) base += 70;
    else if (text.includes('70b')) base += 50;
    else if (text.includes('32b') || text.includes('31b') || text.includes('30b') || text.includes('27b') || text.includes('26b')) base += 35;
    else if (text.includes('14b') || text.includes('12b') || text.includes('8b') || text.includes('7b')) base += 20;
    else base += 10;

    // Reasoning capabilities
    if (m.reasoning && (m.reasoning.default_enabled || m.reasoning.mandatory)) {
      base += 30;
      reasoningScore += 40;
    }
    if (text.includes('reasoning') || text.includes('thinking') || text.includes('deepseek-r1') || text.includes('r1')) {
      base += 25;
      reasoningScore += 30;
    }

    // Code specialization
    if (text.includes('code') || text.includes('coder') || text.includes('programming')) {
      base += 30;
      codeScore += 50;
    }

    // Context length bonus
    if (m.context_length >= 1000000) base += 25;
    else if (m.context_length >= 256000) base += 15;
    else if (m.context_length >= 128000) base += 10;

    // Recency bonus: Models released in 2026 get priority boost
    if (m.created && m.created > 1767225600) {
      base += 20;
    }

    return {
      intelligenceScore: base,
      codeScore: base + codeScore,
      reasoningScore: base + reasoningScore
    };
  }

  const enriched = freeModels.map(m => {
    const s = scoreModel(m);
    return {
      id: m.id,
      name: m.name,
      created: m.created || 0,
      context_length: m.context_length || 0,
      intelligenceScore: s.intelligenceScore,
      codeScore: s.codeScore,
      reasoningScore: s.reasoningScore,
      hasReasoning: !!(m.reasoning && (m.reasoning.default_enabled || m.reasoning.mandatory)),
      description: (m.description || '').slice(0, 140)
    };
  });

  const payload = {
    updatedAt: Date.now(),
    count: enriched.length,
    models: enriched
  };

  try {
    fs.writeFileSync(OPENROUTER_CACHE_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {}

  return payload;
}

function getSortedModels(models, sortKey = 'intelligence') {
  const list = [...models];
  switch (sortKey.toLowerCase()) {
    case 'latest':
    case 'recency':
      return list.sort((a, b) => (b.created || 0) - (a.created || 0));
    case 'code':
    case 'coding':
      return list.sort((a, b) => b.codeScore - a.codeScore);
    case 'reasoning':
    case 'review':
      return list.sort((a, b) => b.reasoningScore - a.reasoningScore);
    case 'context':
      return list.sort((a, b) => b.context_length - a.context_length);
    case 'intelligence':
    default:
      return list.sort((a, b) => b.intelligenceScore - a.intelligenceScore);
  }
}

async function printModelList(sortKey = 'intelligence') {
  console.log(`🔍 Querying latest OpenRouter Zero-Cost models (Sorted by: ${sortKey})...\n`);
  const data = await getOpenRouterFreeModels(false);
  const sorted = getSortedModels(data.models, sortKey);

  console.log(`Found ${data.count} verified 100% Free models (Updated: ${new Date(data.updatedAt).toLocaleTimeString()}):\n`);
  console.log(
    'Rank'.padEnd(5) +
    'Score'.padEnd(7) +
    'Context'.padEnd(9) +
    'Release'.padEnd(12) +
    'Model ID'.padEnd(46) +
    'Capabilities'
  );
  console.log('='.repeat(100));

  sorted.forEach((m, idx) => {
    const rank = `#${idx + 1}`.padEnd(5);
    const score = `${m.intelligenceScore}`.padEnd(7);
    const ctx = `${Math.round(m.context_length / 1000)}k`.padEnd(9);
    const rel = (m.created ? new Date(m.created * 1000).toISOString().split('T')[0] : 'Unknown').padEnd(12);
    const id = m.id.padEnd(46);
    const caps = (m.hasReasoning ? '[Reasoning] ' : '') + (m.codeScore > m.intelligenceScore ? '[Code] ' : '');
    console.log(`${rank}${score}${ctx}${rel}${id}${caps}`);
  });
  console.log('\n💡 Note: All listed models have $0.00 prompt and $0.00 completion cost.');
}

// -------------------------------------------------------------
// Groq LPU Neural Router Engine (<150ms dynamic model decision)
// -------------------------------------------------------------

async function selectModelWithGroqRouter(task, prompt, candidateModels) {
  if (!KEYS.groq) return null;
  try {
    const systemPrompt = `You are the Groq LPU Neural Model Router.
Your job is to select the absolute best model id for the incoming task.
Output ONLY the chosen model id from the candidate list, nothing else.`;

    const userPrompt = `Task Type: ${task}\nInstructions: ${prompt ? prompt.slice(0, 400) : '(empty)'}\n\nCandidate Models:\n` +
      candidateModels.map(c => `- ${c.id}: ${c.desc}`).join('\n');

    // Use fast sub-second inference model on Groq LPU
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEYS.groq}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 50,
        temperature: 0.1
      })
    });

    if (res.ok) {
      const data = await res.json();
      const choice = data.choices?.[0]?.message?.content?.trim();
      if (choice && candidateModels.some(c => c.id === choice)) {
        return choice;
      }
    }
  } catch (e) {
    // Router fallback
  }
  return null;
}

// -------------------------------------------------------------
// Live Subagent Usage & Metrics Endpoints
// -------------------------------------------------------------

async function fetchOpenRouterMetrics() {
  if (!KEYS.openrouter) return { provider: 'OpenRouter', configured: false, error: 'OPENROUTER_API_KEY not set', links: PROVIDER_LINKS.openrouter };
  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: { 'Authorization': `Bearer ${KEYS.openrouter}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();
    const keyData = data.data || {};

    let creditsData = null;
    try {
      const credRes = await fetch('https://openrouter.ai/api/v1/credits', {
        headers: { 'Authorization': `Bearer ${KEYS.openrouter}` }
      });
      if (credRes.ok) creditsData = (await credRes.json())?.data;
    } catch {}

    return {
      provider: 'OpenRouter',
      configured: true,
      label: keyData.label || 'N/A',
      isFreeTier: keyData.is_free_tier ?? true,
      usageUsd: keyData.usage !== undefined ? `$${Number(keyData.usage).toFixed(4)}` : 'N/A',
      limitUsd: keyData.limit !== null && keyData.limit !== undefined ? `$${Number(keyData.limit).toFixed(4)}` : 'Unlimited',
      limitRemainingUsd: keyData.limit_remaining !== undefined ? `$${Number(keyData.limit_remaining).toFixed(4)}` : 'N/A',
      freeDailyRequests: keyData.free_model_daily_requests ? {
        used: keyData.free_model_daily_requests.used,
        limit: keyData.free_model_daily_requests.limit,
        remaining: keyData.free_model_daily_requests.remaining
      } : null,
      totalCredits: creditsData ? `$${Number(creditsData.total_credits || 0).toFixed(4)}` : null,
      links: PROVIDER_LINKS.openrouter
    };
  } catch (err) {
    return { provider: 'OpenRouter', configured: true, error: err.message, links: PROVIDER_LINKS.openrouter };
  }
}

async function fetchGroqMetrics() {
  if (!KEYS.groq) return { provider: 'Groq LPU', configured: false, error: 'GROQ_API_KEY not set', links: PROVIDER_LINKS.groq };
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${KEYS.groq}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const remainingReq = res.headers.get('x-ratelimit-remaining-requests');
    const limitReq = res.headers.get('x-ratelimit-limit-requests');
    const remainingTokens = res.headers.get('x-ratelimit-remaining-tokens');
    const limitTokens = res.headers.get('x-ratelimit-limit-tokens');
    const resetTokens = res.headers.get('x-ratelimit-reset-tokens');

    return {
      provider: 'Groq LPU',
      configured: true,
      rateLimits: {
        remainingRequests: remainingReq || 'N/A',
        limitRequests: limitReq || 'N/A',
        remainingTokens: remainingTokens || 'N/A',
        limitTokens: limitTokens || 'N/A',
        resetTokens: resetTokens || 'N/A'
      },
      links: PROVIDER_LINKS.groq
    };
  } catch (err) {
    return { provider: 'Groq LPU', configured: true, error: err.message, links: PROVIDER_LINKS.groq };
  }
}

async function fetchMistralMetrics() {
  if (!KEYS.mistral) return { provider: 'Mistral AI', configured: false, error: 'MISTRAL_API_KEY not set', links: PROVIDER_LINKS.mistral };
  try {
    const res = await fetch('https://api.mistral.ai/v1/models', {
      headers: { 'Authorization': `Bearer ${KEYS.mistral}` }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const remainingReq = res.headers.get('x-ratelimit-remaining-req-minute');
    const limitReq = res.headers.get('x-ratelimit-limit-req-minute');
    const remainingTokens = res.headers.get('x-ratelimit-remaining-tokens-minute');
    const limitTokens = res.headers.get('x-ratelimit-limit-tokens-minute');

    return {
      provider: 'Mistral AI',
      configured: true,
      rateLimits: {
        remainingRequestsMinute: remainingReq || 'N/A',
        limitRequestsMinute: limitReq || 'N/A',
        remainingTokensMinute: remainingTokens || 'N/A',
        limitTokensMinute: limitTokens || 'N/A'
      },
      links: PROVIDER_LINKS.mistral
    };
  } catch (err) {
    return { provider: 'Mistral AI', configured: true, error: err.message, links: PROVIDER_LINKS.mistral };
  }
}

async function fetchGeminiMetrics() {
  if (!KEYS.gemini) return { provider: 'Google Gemini', configured: false, error: 'GEMINI_API_KEY not set', links: PROVIDER_LINKS.gemini };
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${KEYS.gemini}`);
    const isOk = res.ok;
    return {
      provider: 'Google Gemini',
      configured: true,
      status: isOk ? 'Active (API key verified)' : `HTTP ${res.status}`,
      links: PROVIDER_LINKS.gemini
    };
  } catch (err) {
    return { provider: 'Google Gemini', configured: true, error: err.message, links: PROVIDER_LINKS.gemini };
  }
}

function fetchNotionMetrics() {
  const vaultTokenFile = path.join(
    process.env.USERPROFILE || process.env.HOME || '.',
    '.gemini', 'config', 'skills-vault', 'notion', 'token.json'
  );
  const workspaceMcpFile = path.join(process.cwd(), '.agents', 'mcp_config.json');

  let configured = false;
  let status = 'Token not found';

  if (fs.existsSync(vaultTokenFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(vaultTokenFile, 'utf-8'));
      if (data && data.access_token) {
        configured = true;
        status = 'OAuth Token Configured in Skill Vault';
      }
    } catch {}
  }

  if (!configured && fs.existsSync(workspaceMcpFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(workspaceMcpFile, 'utf-8'));
      const auth = data?.mcpServers?.notion?.headers?.Authorization;
      if (auth && auth.startsWith('Bearer ')) {
        configured = true;
        status = 'Bearer Token Configured in Workspace MCP';
      }
    } catch {}
  }

  return {
    provider: 'Notion MCP',
    configured,
    status,
    error: configured ? null : 'Notion OAuth token not found',
    links: PROVIDER_LINKS.notion
  };
}

async function fetchAllSubagentMetrics() {
  const [openrouter, groq, mistral, gemini] = await Promise.all([
    fetchOpenRouterMetrics(),
    fetchGroqMetrics(),
    fetchMistralMetrics(),
    fetchGeminiMetrics()
  ]);
  const notion = fetchNotionMetrics();
  return { openrouter, groq, mistral, gemini, notion };
}

async function printUsageMetrics(asJson = false) {
  if (!asJson) {
    console.log('🔍 Querying live subagent endpoints for usage & quota metrics...\n');
  }
  const metrics = await fetchAllSubagentMetrics();

  if (asJson) {
    console.log(JSON.stringify(metrics, null, 2));
    return;
  }

  console.log('='.repeat(80));
  console.log('📊 ANTIGRAVITY SUBAGENT USAGE & METRICS DASHBOARD');
  console.log('='.repeat(80));

  // 1. OpenRouter
  console.log('\n1. 🌐 OpenRouter (Zero-Cost Models)');
  if (!metrics.openrouter.configured) {
    console.log(`   Status: ⚠️ Not Configured (${metrics.openrouter.error})`);
  } else if (metrics.openrouter.error) {
    console.log(`   Status: ❌ Error connecting (${metrics.openrouter.error})`);
  } else {
    console.log(`   Status: ✅ Connected (Key: ${metrics.openrouter.label} | Free Tier: ${metrics.openrouter.isFreeTier})`);
    console.log('   Live Account Metrics:');
    console.log(`     • Total Usage (USD):        ${metrics.openrouter.usageUsd}`);
    console.log(`     • Spending Limit Remaining: ${metrics.openrouter.limitRemainingUsd}`);
    if (metrics.openrouter.freeDailyRequests) {
      const f = metrics.openrouter.freeDailyRequests;
      console.log(`     • Free Daily Requests:      ${f.used} used / ${f.limit} limit (${f.remaining} remaining)`);
    }
    if (metrics.openrouter.totalCredits !== null) {
      console.log(`     • Total Account Credits:    ${metrics.openrouter.totalCredits}`);
    }
  }
  console.log('   Web Dashboards & Metrics:');
  console.log(`     • Profile & Usage:          ${PROVIDER_LINKS.openrouter.usageUrl}`);
  console.log(`     • Activity:                 ${PROVIDER_LINKS.openrouter.activityUrl}`);
  console.log(`     • Credits & Billing:        ${PROVIDER_LINKS.openrouter.creditsUrl}`);

  // 2. Groq LPU
  console.log('\n2. ⚡ Groq LPU (Ultra-Fast 120B & Neural Router)');
  if (!metrics.groq.configured) {
    console.log(`   Status: ⚠️ Not Configured (${metrics.groq.error})`);
  } else if (metrics.groq.error) {
    console.log(`   Status: ❌ Error connecting (${metrics.groq.error})`);
  } else {
    console.log('   Status: ✅ Connected (API Key verified)');
    if (metrics.groq.rateLimits && metrics.groq.rateLimits.remainingRequests !== 'N/A') {
      console.log('   Live Rate Limits:');
      console.log(`     • Request Quota:            ${metrics.groq.rateLimits.remainingRequests} / ${metrics.groq.rateLimits.limitRequests} remaining`);
      console.log(`     • Token Quota:              ${metrics.groq.rateLimits.remainingTokens} / ${metrics.groq.rateLimits.limitTokens} remaining`);
      console.log(`     • Token Reset Window:       ${metrics.groq.rateLimits.resetTokens}`);
    }
  }
  console.log('   Web Dashboards & Metrics:');
  console.log(`     • Usage & Analytics:        ${PROVIDER_LINKS.groq.usageUrl}`);
  console.log(`     • Rate Limits & Quotas:     ${PROVIDER_LINKS.groq.limitsUrl}`);

  // 3. Mistral AI
  console.log('\n3. 🧠 Mistral AI (Codestral Surgical Code Generator)');
  if (!metrics.mistral.configured) {
    console.log(`   Status: ⚠️ Not Configured (${metrics.mistral.error})`);
  } else if (metrics.mistral.error) {
    console.log(`   Status: ❌ Error connecting (${metrics.mistral.error})`);
  } else {
    console.log('   Status: ✅ Connected (API Key verified)');
    if (metrics.mistral.rateLimits && metrics.mistral.rateLimits.remainingRequestsMinute !== 'N/A') {
      console.log('   Live Rate Limits:');
      console.log(`     • Requests per Minute:      ${metrics.mistral.rateLimits.remainingRequestsMinute} / ${metrics.mistral.rateLimits.limitRequestsMinute} remaining`);
      console.log(`     • Tokens per Minute:        ${metrics.mistral.rateLimits.remainingTokensMinute} / ${metrics.mistral.rateLimits.limitTokensMinute} remaining`);
    }
  }
  console.log('   Web Dashboards & Metrics:');
  console.log(`     • Usage Metrics:            ${PROVIDER_LINKS.mistral.usageUrl}`);
  console.log(`     • Billing & Quotas:         ${PROVIDER_LINKS.mistral.billingUrl}`);

  // 4. Google Gemini
  console.log('\n4. 💎 Google Gemini (Multimodal Flash & Long-Context)');
  if (!metrics.gemini.configured) {
    console.log(`   Status: ⚠️ Not Configured (${metrics.gemini.error})`);
  } else if (metrics.gemini.error) {
    console.log(`   Status: ❌ Error connecting (${metrics.gemini.error})`);
  } else {
    console.log(`   Status: ✅ ${metrics.gemini.status}`);
  }
  console.log('   Web Dashboards & Metrics:');
  console.log(`     • AI Studio Dashboard:      ${PROVIDER_LINKS.gemini.usageUrl}`);
  console.log(`     • GCP API Metrics:          ${PROVIDER_LINKS.gemini.metricsUrl}`);
  console.log(`     • Quotas & System Limits:   ${PROVIDER_LINKS.gemini.quotasUrl}`);

  // 5. Notion MCP
  console.log('\n5. 📝 Notion MCP (Researcher & Operator)');
  if (!metrics.notion.configured) {
    console.log(`   Status: ⚠️ Not Configured (${metrics.notion.error})`);
  } else {
    console.log(`   Status: ✅ Connected (${metrics.notion.status})`);
  }
  console.log('   Web Dashboards & Metrics:');
  console.log(`     • Notion Integrations:      ${PROVIDER_LINKS.notion.usageUrl}`);

  console.log('\n' + '='.repeat(80));
  console.log('💡 Note: Every subagent execution also reports real-time prompt, completion,');
  console.log('   and total token counts along with the active provider\'s dashboard link.');
  console.log('='.repeat(80));
}

// -------------------------------------------------------------
// Model Provider Implementations
// -------------------------------------------------------------

async function callGroq(prompt, systemPrompt, model = 'openai/gpt-oss-120b', maxTokens = 1024) {
  if (!KEYS.groq) throw new Error('GROQ_API_KEY not set');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEYS.groq}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'openai/gpt-oss-120b',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.2
    })
  });
  if (res.status === 429) {
    throw new Error('Groq free-tier rate limit reached (HTTP 429). Cascading to next free provider.');
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  const usage = data.usage ? {
    promptTokens: data.usage.prompt_tokens ?? null,
    completionTokens: data.usage.completion_tokens ?? null,
    totalTokens: data.usage.total_tokens ?? null
  } : null;
  return wrapResponse(content, usage);
}

async function callMistral(prompt, systemPrompt, model = 'codestral-latest', maxTokens = 1024) {
  if (!KEYS.mistral) throw new Error('MISTRAL_API_KEY not set');
  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEYS.mistral}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'codestral-latest',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.2
    })
  });
  if (res.status === 429) {
    throw new Error('Mistral free-tier rate limit reached (HTTP 429). Cascading to next free provider.');
  }
  if (res.status === 402 || res.status === 403) {
    throw new Error('Mistral free usage limit reached / payment required (HTTP ' + res.status + '). Blocked to guarantee zero charges.');
  }
  const data = await res.json();
  if (data.error) {
    const errMsg = (data.error.message || JSON.stringify(data.error)).toLowerCase();
    if (errMsg.includes('credit') || errMsg.includes('balance') || errMsg.includes('quota') || errMsg.includes('payment')) {
      throw new Error('Mistral free quota exhausted: ' + (data.error.message || 'Payment required') + '. Cascading to zero-cost fallback.');
    }
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  const usage = data.usage ? {
    promptTokens: data.usage.prompt_tokens ?? null,
    completionTokens: data.usage.completion_tokens ?? null,
    totalTokens: data.usage.total_tokens ?? null
  } : null;
  return wrapResponse(content, usage);
}

async function callGemini(prompt, systemPrompt, model = 'gemini-3.8-flash', maxTokens = 1024) {
  if (!KEYS.gemini) throw new Error('GEMINI_API_KEY not set');
  const modelName = model.includes('/') ? model.split('/')[1] : (model || 'gemini-3.8-flash');
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': KEYS.gemini
    },
    body: JSON.stringify({
      systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.2 }
    })
  });
  if (res.status === 429) {
    throw new Error('Gemini free-tier rate limit reached (HTTP 429). Cascading to next free provider.');
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  const usageMeta = data.usageMetadata;
  const usage = usageMeta ? {
    promptTokens: usageMeta.promptTokenCount ?? null,
    completionTokens: usageMeta.candidatesTokenCount ?? null,
    totalTokens: usageMeta.totalTokenCount ?? null
  } : null;
  return wrapResponse(content, usage);
}

/*
// [PAID TIER - REMOVED FROM ACTIVE ROTATION. Uncomment when keys are available]
async function callXAI(prompt, systemPrompt, model = 'grok-2-latest', maxTokens = 1024) {
  if (!KEYS.xai) throw new Error('XAI_API_KEY not set');
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEYS.xai}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'grok-2-latest',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.2
    })
  });
  if (res.status === 429) {
    throw new Error('xAI Grok rate limit reached (HTTP 429). Cascading to next free provider.');
  }
  if (res.status === 402 || res.status === 403) {
    throw new Error('xAI Grok trial credits exhausted or forbidden (HTTP ' + res.status + '). Blocked to guarantee zero charges.');
  }
  const data = await res.json();
  if (data.error) {
    const errMsg = (data.error.message || JSON.stringify(data.error)).toLowerCase();
    if (errMsg.includes('credit') || errMsg.includes('balance') || errMsg.includes('quota') || errMsg.includes('payment')) {
      throw new Error('xAI Grok credits exhausted: ' + (data.error.message || 'Payment required') + '. Cascading to zero-cost fallback.');
    }
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  return data.choices?.[0]?.message?.content?.trim() || '';
}
*/

async function isModelVerifiedFree(modelId) {
  if (!modelId || typeof modelId !== 'string') return false;
  if (modelId === 'openrouter/free') return true;

  // Immediate defensive blacklist against common paid frontier models
  const lower = modelId.toLowerCase();
  const paidKeywords = [
    'gpt-4', 'gpt-3.5', 'o1-preview', 'o1-mini', 'o3-mini',
    'claude-3', 'claude-2', 'claude-instant',
    'gemini-1.5-pro', 'gemini-1.0-pro',
    'mistral-large', 'mistral-medium',
    'command-r-plus', 'dall-e'
  ];
  for (const keyword of paidKeywords) {
    if (lower.includes(keyword) && !lower.endsWith(':free')) {
      return false;
    }
  }

  // Check verified free catalog (which guarantees prompt: 0 and completion: 0)
  const freeData = await getOpenRouterFreeModels(false);
  const found = freeData.models.find(m => m.id === modelId);
  return !!found;
}

async function callOpenRouter(prompt, systemPrompt, model = 'openrouter/free', maxTokens = 1024) {
  if (!KEYS.openrouter) throw new Error('OPENROUTER_API_KEY not set');

  const targetModel = model || 'openrouter/free';

  // Hardcoded safety barrier: strictly 100% zero-cost models allowed
  const isVerified = await isModelVerifiedFree(targetModel);
  if (!isVerified) {
    throw new Error(`[OpenRouter Safety Guard] Blocked paid/unverified model call '${targetModel}'. Only verified zero-cost free models are permitted. Zero paid tokens allowed.`);
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEYS.openrouter}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/aryanthepain/antigravity_setup',
      'X-Title': 'Antigravity Free Subagent'
    },
    body: JSON.stringify({
      model: targetModel,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.2
    })
  });

  if (res.status === 429) {
    throw new Error(`OpenRouter rate limit on ${targetModel} (HTTP 429). Cascading to next free candidate.`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  const usage = data.usage ? {
    promptTokens: data.usage.prompt_tokens ?? null,
    completionTokens: data.usage.completion_tokens ?? null,
    totalTokens: data.usage.total_tokens ?? null
  } : null;
  return wrapResponse(content, usage);
}

// OmniRoute / Local gateway check
async function callOmniRoute(prompt, systemPrompt, model, maxTokens = 1024) {
  const res = await fetch('http://127.0.0.1:20128/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model || 'auto',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  const usage = data.usage ? {
    promptTokens: data.usage.prompt_tokens ?? null,
    completionTokens: data.usage.completion_tokens ?? null,
    totalTokens: data.usage.total_tokens ?? null
  } : null;
  return wrapResponse(content, usage);
}

// -------------------------------------------------------------
// Router Dispatcher with Groq LPU Neural Router & Dynamic Cascades
// -------------------------------------------------------------

async function dispatchToSubagent(prompt, systemPrompt, tier = 'fast', preferredModel = '', maxTokens = 1024, preferredProvider = '', options = {}) {
  const tryCall = async (fn, name, modelName = '', providerKey = 'openrouter') => {
    try {
      const res = await fn();
      const output = (typeof res === 'object' && res !== null && res.content !== undefined)
        ? res.content
        : (typeof res === 'string' ? res : JSON.stringify(res));
      const usage = (typeof res === 'object' && res !== null && res.usage) ? res.usage : null;
      const dashboardUrl = PROVIDER_LINKS[providerKey]?.usageUrl || '';
      return { success: true, provider: name, model: modelName, output, usage, dashboardUrl, providerKey };
    } catch (err) {
      return { success: false, provider: name, model: modelName, error: err.message, providerKey };
    }
  };

  // 1. Try OmniRoute local proxy first if active
  if (!preferredProvider || preferredProvider.toLowerCase() === 'omniroute') {
    try {
      const omniResult = await callOmniRoute(prompt, systemPrompt, preferredModel, maxTokens);
      if (omniResult) {
        const output = typeof omniResult === 'object' && omniResult !== null && omniResult.content !== undefined ? omniResult.content : omniResult;
        const usage = typeof omniResult === 'object' && omniResult !== null && omniResult.usage ? omniResult.usage : null;
        return {
          provider: 'OmniRoute Gateway',
          model: preferredModel || 'auto',
          output,
          usage,
          dashboardUrl: 'http://127.0.0.1:20128',
          providerKey: 'omniroute'
        };
      }
    } catch (e) {
      // OmniRoute not active, proceed to direct APIs
    }
  }

  // 1b. Upfront Paid Model Barrier: Verify zero-cost compliance if user explicitly passed a model
  if (preferredModel) {
    const isDirectProvider = ['groq', 'mistral', 'gemini', 'xai'].includes(preferredProvider.toLowerCase());
    if (!isDirectProvider || preferredProvider.toLowerCase() === 'openrouter') {
      const isKnownDirectFree = preferredModel.startsWith('openai/gpt-oss-') || preferredModel.startsWith('qwen/qwen3.8-') || preferredModel === 'codestral-latest' || preferredModel === 'gemini-3.8-flash';
      if (!isKnownDirectFree) {
        const isVerified = await isModelVerifiedFree(preferredModel);
        if (!isVerified) {
          throw new Error(`[OpenRouter Safety Guard] Blocked paid/unverified model call '${preferredModel}'. Only verified zero-cost free models are permitted. Zero paid tokens allowed.`);
        }
      }
    }
  }

  // 2. Query dynamic OpenRouter free models cache
  const freeData = await getOpenRouterFreeModels(false);
  const sortCriteria = options.sort || 'intelligence';
  const sortedFreeModels = getSortedModels(freeData.models, sortCriteria);

  // 3. Dynamic candidate assembly
  let candidateList = [];
  if (KEYS.mistral) candidateList.push({ id: 'codestral-latest', provider: 'Mistral', desc: 'Surgical code intelligence & patch synthesis' });
  if (KEYS.gemini) candidateList.push({ id: 'gemini-3.8-flash', provider: 'Google Gemini', desc: '1M-context multimodal reasoning' });
  if (KEYS.groq) candidateList.push({ id: 'openai/gpt-oss-120b', provider: 'Groq LPU', desc: 'Ultra-fast 120B model (800 tokens/s)' });
  // [PAID TIER - REMOVED FROM ROTATION]
  // if (KEYS.xai) candidateList.push({ id: 'grok-2-latest', provider: 'xAI', desc: 'xAI Grok 2 frontier model' });

  // Add top OpenRouter free models
  sortedFreeModels.slice(0, 5).forEach(m => {
    candidateList.push({
      id: m.id,
      provider: 'OpenRouter',
      desc: `${m.name} (${Math.round(m.context_length / 1000)}k ctx, Score: ${m.intelligenceScore})`
    });
  });

  // 4. Groq LPU Neural Router Arbitration
  let groqChosenModel = null;
  const routerMode = options.router || 'auto';
  if ((routerMode === 'groq' || routerMode === 'auto') && !preferredModel && !preferredProvider && KEYS.groq) {
    groqChosenModel = await selectModelWithGroqRouter(options.task || tier, prompt, candidateList);
  }

  // 5. Build multi-tier attempt cascade
  let attempts = [];

  // If Groq LPU router picked a specific model, prioritize it first!
  if (groqChosenModel) {
    const candidate = candidateList.find(c => c.id === groqChosenModel);
    if (candidate) {
      if (candidate.provider === 'OpenRouter' && KEYS.openrouter) {
        attempts.push({
          fn: () => callOpenRouter(prompt, systemPrompt, candidate.id, maxTokens),
          name: `OpenRouter (${candidate.id})`,
          modelName: candidate.id,
          providerKey: 'openrouter'
        });
      } else if (candidate.id === 'codestral-latest' && KEYS.mistral) {
        attempts.push({
          fn: () => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens),
          name: 'Mistral Codestral',
          modelName: 'codestral-latest',
          providerKey: 'mistral'
        });
      } else if (candidate.id === 'gemini-3.8-flash' && KEYS.gemini) {
        attempts.push({
          fn: () => callGemini(prompt, systemPrompt, 'gemini-3.8-flash', maxTokens),
          name: 'Google Gemini Flash',
          modelName: 'gemini-3.8-flash',
          providerKey: 'gemini'
        });
      } else if (candidate.id === 'openai/gpt-oss-120b' && KEYS.groq) {
        attempts.push({
          fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
          name: 'Groq LPU (GPT-OSS 120B)',
          modelName: 'openai/gpt-oss-120b',
          providerKey: 'groq'
        });
      // [PAID TIER - REMOVED FROM ROTATION]
      // } else if (candidate.id === 'grok-2-latest' && KEYS.xai) {
      //   attempts.push({
      //     fn: () => callXAI(prompt, systemPrompt, 'grok-2-latest', maxTokens),
      //     name: 'xAI Grok',
      //     modelName: 'grok-2-latest',
      //     providerKey: 'xai'
      //   });
      }
    }
  }

  // If user requested a specific provider
  if (preferredProvider) {
    const prov = preferredProvider.toLowerCase();
    if (prov === 'openrouter') {
      const topModel = preferredModel || (sortedFreeModels[0]?.id || 'openrouter/free');
      if (KEYS.openrouter) {
        attempts.push({
          fn: () => callOpenRouter(prompt, systemPrompt, topModel, maxTokens),
          name: `OpenRouter (${topModel})`,
          modelName: topModel,
          providerKey: 'openrouter'
        });
        // Cascade to next 2 best OpenRouter free models
        sortedFreeModels.slice(1, 3).forEach(m => {
          attempts.push({
            fn: () => callOpenRouter(prompt, systemPrompt, m.id, maxTokens),
            name: `OpenRouter (${m.id})`,
            modelName: m.id,
            providerKey: 'openrouter'
          });
        });
      }
      if (KEYS.groq) attempts.push({
        fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
        name: 'Groq LPU (OpenRouter fallback)',
        modelName: 'openai/gpt-oss-120b',
        providerKey: 'groq'
      });
    } else if (prov === 'groq') {
      if (KEYS.groq) attempts.push({
        fn: () => callGroq(prompt, systemPrompt, preferredModel || 'openai/gpt-oss-120b', maxTokens),
        name: 'Groq LPU',
        modelName: preferredModel || 'openai/gpt-oss-120b',
        providerKey: 'groq'
      });
      if (KEYS.mistral) attempts.push({
        fn: () => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens),
        name: 'Mistral Codestral (Groq fallback)',
        modelName: 'codestral-latest',
        providerKey: 'mistral'
      });
      if (KEYS.gemini) attempts.push({
        fn: () => callGemini(prompt, systemPrompt, 'gemini-3.8-flash', maxTokens),
        name: 'Google Gemini Flash (Groq fallback)',
        modelName: 'gemini-3.8-flash',
        providerKey: 'gemini'
      });
    } else if (prov === 'mistral') {
      if (KEYS.mistral) attempts.push({
        fn: () => callMistral(prompt, systemPrompt, preferredModel || 'codestral-latest', maxTokens),
        name: 'Mistral Codestral',
        modelName: preferredModel || 'codestral-latest',
        providerKey: 'mistral'
      });
      if (KEYS.groq) attempts.push({
        fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
        name: 'Groq LPU (Mistral fallback)',
        modelName: 'openai/gpt-oss-120b',
        providerKey: 'groq'
      });
    } else if (prov === 'gemini') {
      if (KEYS.gemini) attempts.push({
        fn: () => callGemini(prompt, systemPrompt, preferredModel || 'gemini-3.8-flash', maxTokens),
        name: 'Google Gemini Flash',
        modelName: preferredModel || 'gemini-3.8-flash',
        providerKey: 'gemini'
      });
      if (KEYS.groq) attempts.push({
        fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
        name: 'Groq LPU (Gemini fallback)',
        modelName: 'openai/gpt-oss-120b',
        providerKey: 'groq'
      });
    // [PAID TIER - REMOVED FROM ROTATION]
    // } else if (prov === 'xai' || prov === 'grok') {
    //   if (KEYS.xai) attempts.push({
    //     fn: () => callXAI(prompt, systemPrompt, preferredModel || 'grok-2-latest', maxTokens),
    //     name: 'xAI Grok',
    //     modelName: preferredModel || 'grok-2-latest',
    //     providerKey: 'xai'
    //   });
    //   if (KEYS.groq) attempts.push({
    //     fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
    //     name: 'Groq LPU (xAI fallback)',
    //     modelName: 'openai/gpt-oss-120b',
    //     providerKey: 'groq'
    //   });
    }
  }

  // Tier-based defaults (if not already handled or during cascade)
  if (tier === 'code' || tier === 'precision_coding') {
    // Coding hierarchy: Codestral -> Top OpenRouter Code Model -> Gemini 3.8 Flash -> Groq LPU
    const topCodeModel = sortedFreeModels.find(m => m.codeScore > m.intelligenceScore)?.id || sortedFreeModels[0]?.id;
    if (KEYS.mistral) attempts.push({
      fn: () => callMistral(prompt, systemPrompt, preferredModel || 'codestral-latest', maxTokens),
      name: 'Mistral Codestral',
      modelName: 'codestral-latest',
      providerKey: 'mistral'
    });
    if (KEYS.openrouter && topCodeModel) attempts.push({
      fn: () => callOpenRouter(prompt, systemPrompt, topCodeModel, maxTokens),
      name: `OpenRouter (${topCodeModel})`,
      modelName: topCodeModel,
      providerKey: 'openrouter'
    });
    if (KEYS.gemini) attempts.push({
      fn: () => callGemini(prompt, systemPrompt, 'gemini-3.8-flash', maxTokens),
      name: 'Google Gemini Flash',
      modelName: 'gemini-3.8-flash',
      providerKey: 'gemini'
    });
    if (KEYS.groq) attempts.push({
      fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
      name: 'Groq LPU (GPT-OSS 120B)',
      modelName: 'openai/gpt-oss-120b',
      providerKey: 'groq'
    });
  } else if (tier === 'reasoning' || tier === 'review') {
    // Reasoning / Review hierarchy: Top OpenRouter Reasoning Model -> Gemini 3.8 Flash -> Mistral -> Groq LPU
    const topReasoningModel = sortedFreeModels.find(m => m.hasReasoning)?.id || sortedFreeModels[0]?.id;
    if (KEYS.openrouter && topReasoningModel) attempts.push({
      fn: () => callOpenRouter(prompt, systemPrompt, topReasoningModel, maxTokens),
      name: `OpenRouter (${topReasoningModel})`,
      modelName: topReasoningModel,
      providerKey: 'openrouter'
    });
    if (KEYS.gemini) attempts.push({
      fn: () => callGemini(prompt, systemPrompt, 'gemini-3.8-flash', maxTokens),
      name: 'Google Gemini Flash',
      modelName: 'gemini-3.8-flash',
      providerKey: 'gemini'
    });
    if (KEYS.mistral) attempts.push({
      fn: () => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens),
      name: 'Mistral Codestral',
      modelName: 'codestral-latest',
      providerKey: 'mistral'
    });
    if (KEYS.groq) attempts.push({
      fn: () => callGroq(prompt, systemPrompt, 'openai/gpt-oss-120b', maxTokens),
      name: 'Groq LPU (GPT-OSS 120B)',
      modelName: 'openai/gpt-oss-120b',
      providerKey: 'groq'
    });
  } else {
    // Fast / Research default: Groq LPU (sub-second) -> Gemini 3.8 Flash -> Top OpenRouter Free -> Mistral
    const topFree = sortedFreeModels[0]?.id;
    if (KEYS.groq) attempts.push({
      fn: () => callGroq(prompt, systemPrompt, preferredModel || 'openai/gpt-oss-120b', maxTokens),
      name: 'Groq LPU (GPT-OSS 120B)',
      modelName: preferredModel || 'openai/gpt-oss-120b',
      providerKey: 'groq'
    });
    if (KEYS.gemini) attempts.push({
      fn: () => callGemini(prompt, systemPrompt, 'gemini-3.8-flash', maxTokens),
      name: 'Google Gemini Flash',
      modelName: 'gemini-3.8-flash',
      providerKey: 'gemini'
    });
    if (KEYS.openrouter && topFree) attempts.push({
      fn: () => callOpenRouter(prompt, systemPrompt, topFree, maxTokens),
      name: `OpenRouter (${topFree})`,
      modelName: topFree,
      providerKey: 'openrouter'
    });
    if (KEYS.mistral) attempts.push({
      fn: () => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens),
      name: 'Mistral Codestral',
      modelName: 'codestral-latest',
      providerKey: 'mistral'
    });
  }

  // Execute attempts in priority order
  for (const attempt of attempts) {
    const res = await tryCall(attempt.fn, attempt.name, attempt.modelName, attempt.providerKey);
    if (res.success && res.output) {
      return {
        provider: res.provider,
        model: res.model,
        output: res.output,
        usage: res.usage,
        dashboardUrl: res.dashboardUrl,
        providerKey: res.providerKey
      };
    }
  }

  throw new Error('All model providers failed or keys not configured. Please check GEMINI_API_KEY, GROQ_API_KEY, MISTRAL_API_KEY, or OPENROUTER_API_KEY.');
}

// -------------------------------------------------------------
// Task Implementations
// -------------------------------------------------------------

// 1. RESEARCH & CODE EXPLORATION TASK
async function handleResearch(params) {
  const query = params.query || params.prompt;
  if (!query) {
    console.error('Error: --query or --prompt is required for research task');
    process.exit(1);
  }

  let fileContents = '';
  const fileList = params.files.length > 0 ? params.files : (params.file ? [params.file] : []);

  for (const f of fileList) {
    const content = readSafeFile(f);
    if (content !== null) {
      fileContents += `\n--- FILE: ${f} ---\n${content}\n`;
    }
  }

  const systemPrompt = `You are an ultra-concise Codebase Research Subagent.
Your goal is to inspect the provided code files or context and extract ONLY the exact answers, data structures, signatures, and invariants requested.
DO NOT return entire re-written files or verbose fluff.
Keep your response dense, structured, and under 250 tokens so the Chief Orchestrator stays lean.`;

  const userPrompt = `Research Question: ${query}\n\nFiles Context:\n${fileContents || '(No specific files attached, answer conceptually based on query)'}\n\nDeliverables:\n1. Key Findings & Invariants\n2. Relevant Signatures / Types\n3. Potential Edge Cases or Gotchas`;

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'fast', params.model, params.maxTokens, params.provider, {
    router: params.router,
    sort: params.sort,
    task: 'research'
  });

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Research]`);
    console.log(result.output);
    if (result.usage && (result.usage.totalTokens !== null || result.usage.promptTokens !== null)) {
      console.log(`\n📊 [Usage Metrics] Tokens: Prompt: ${result.usage.promptTokens ?? 0} | Completion: ${result.usage.completionTokens ?? 0} | Total: ${result.usage.totalTokens ?? 0}`);
    }
    if (result.dashboardUrl) {
      console.log(`🔗 [Usage Dashboard] ${result.dashboardUrl}`);
    }
  }
}

// 2. SURGICAL CODE GENERATION TASK
async function handleCode(params) {
  const instructions = params.prompt || params.query;
  const targetFile = params.file;

  let existingCode = '';
  if (targetFile) {
    const content = readSafeFile(targetFile);
    if (content !== null) {
      existingCode = content;
    }
  }

  const systemPrompt = `You are an expert Surgical Code Generator Subagent.
Follow the Ponytail Laziness Ladder (prefer stdlib, minimal code, zero bloat, no unused classes).
Return ONLY the surgical patch, function, or code block required to satisfy the instructions.
If modifying an existing file, specify the exact lines or function to replace.`;

  const userPrompt = `Target File: ${targetFile || 'Net new code'}\nInstructions: ${instructions}\n\nExisting Code:\n${existingCode || '(None)'}`;

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'code', params.model, params.maxTokens, params.provider, {
    router: params.router,
    sort: params.sort,
    task: 'code'
  });

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Code Generation]`);
    console.log(result.output);
    if (result.usage && (result.usage.totalTokens !== null || result.usage.promptTokens !== null)) {
      console.log(`\n📊 [Usage Metrics] Tokens: Prompt: ${result.usage.promptTokens ?? 0} | Completion: ${result.usage.completionTokens ?? 0} | Total: ${result.usage.totalTokens ?? 0}`);
    }
    if (result.dashboardUrl) {
      console.log(`🔗 [Usage Dashboard] ${result.dashboardUrl}`);
    }
  }
}

// 3. INDEPENDENT ADVERSARIAL REVIEW TASK
async function handleReview(params) {
  let diffContent = '';

  if (params.diff) {
    try {
      diffContent = execSync('git diff HEAD', { encoding: 'utf-8' });
      if (!diffContent.trim()) {
        diffContent = execSync('git diff --staged', { encoding: 'utf-8' });
      }
    } catch (e) {
      diffContent = '(Unable to get git diff, reviewing target file)';
    }
  }

  if (!diffContent.trim() && params.file) {
    const content = readSafeFile(params.file);
    if (content !== null) {
      diffContent = `File: ${params.file}\n` + content;
    }
  }

  if (!diffContent.trim()) {
    diffContent = params.prompt || 'No diff or code provided for review.';
  }

  const systemPrompt = `You are an Adversarial Code Reviewer Subagent.
Review the provided diff or code against:
1. Logic bugs & unhandled edge cases
2. Security issues or memory leaks
3. Ponytail anti-bloat violations (unnecessary dependencies, premature abstractions)
4. Type safety and invariant violations

Format output as a compact markdown table or bullet points:
- Status: [PASS | CAUTION | REJECT]
- Key Findings (max 3 bullet points)
- Actionable Recommendations`;

  const userPrompt = `Code / Diff for Review:\n${diffContent}`;

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'review', params.model, params.maxTokens, params.provider, {
    router: params.router,
    sort: params.sort,
    task: 'review'
  });

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Adversarial Review]`);
    console.log(result.output);
    if (result.usage && (result.usage.totalTokens !== null || result.usage.promptTokens !== null)) {
      console.log(`\n📊 [Usage Metrics] Tokens: Prompt: ${result.usage.promptTokens ?? 0} | Completion: ${result.usage.completionTokens ?? 0} | Total: ${result.usage.totalTokens ?? 0}`);
    }
    if (result.dashboardUrl) {
      console.log(`🔗 [Usage Dashboard] ${result.dashboardUrl}`);
    }
  }
}

// 4. LOG / TRACE COMPRESSION TASK
async function handleCompress(params) {
  let logContent = '';
  if (params.file) {
    const content = readSafeFile(params.file);
    if (content !== null) {
      logContent = content;
    } else {
      logContent = params.prompt || params.query;
    }
  } else {
    logContent = params.prompt || params.query;
  }

  const lines = logContent.split('\n');
  if (lines.length > 4000) {
    logContent = lines.slice(-4000).join('\n');
  }

  const systemPrompt = `You are a Log & Stacktrace Compression Subagent.
Analyze the raw terminal/test output and output ONLY:
1. Root Cause / Core Error Message
2. Failing Test Case / File and Line Number
3. Recommended 1-line Fix
Keep output under 100 tokens.`;

  const userPrompt = `Raw Logs:\n${logContent}`;

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'fast', params.model, 300, params.provider, {
    router: params.router,
    sort: params.sort,
    task: 'compress'
  });

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Log Compression]`);
    console.log(result.output);
    if (result.usage && (result.usage.totalTokens !== null || result.usage.promptTokens !== null)) {
      console.log(`\n📊 [Usage Metrics] Tokens: Prompt: ${result.usage.promptTokens ?? 0} | Completion: ${result.usage.completionTokens ?? 0} | Total: ${result.usage.totalTokens ?? 0}`);
    }
    if (result.dashboardUrl) {
      console.log(`🔗 [Usage Dashboard] ${result.dashboardUrl}`);
    }
  }
}

// 5. GENERAL FAST SUBAGENT ASK
async function handleAsk(params) {
  const prompt = params.prompt || params.query;
  if (!prompt) {
    console.error('Error: --prompt or query text is required');
    process.exit(1);
  }

  const result = await dispatchToSubagent(
    prompt,
    'You are an ultra-fast worker subagent. Give direct, accurate, concise answers.',
    params.tier,
    params.model,
    params.maxTokens,
    params.provider,
    {
      router: params.router,
      sort: params.sort,
      task: 'ask'
    }
  );

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Tier: ${params.tier}]`);
    console.log(result.output);
    if (result.usage && (result.usage.totalTokens !== null || result.usage.promptTokens !== null)) {
      console.log(`\n📊 [Usage Metrics] Tokens: Prompt: ${result.usage.promptTokens ?? 0} | Completion: ${result.usage.completionTokens ?? 0} | Total: ${result.usage.totalTokens ?? 0}`);
    }
    if (result.dashboardUrl) {
      console.log(`🔗 [Usage Dashboard] ${result.dashboardUrl}`);
    }
  }
}

// 6. NOTION WORKER SUBAGENT TASK
async function handleNotion(params) {
  const query = params.query || params.prompt;
  const mode = (params.mode || 'read').toLowerCase();

  // Resolve OAuth Token from skills-vault/notion/token.json or .agents/mcp_config.json
  const vaultTokenFile = path.join(
    process.env.USERPROFILE || process.env.HOME || '.',
    '.gemini', 'config', 'skills-vault', 'notion', 'token.json'
  );
  const workspaceMcpFile = path.join(process.cwd(), '.agents', 'mcp_config.json');

  let accessToken = null;

  if (fs.existsSync(vaultTokenFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(vaultTokenFile, 'utf-8'));
      if (data && data.access_token) accessToken = data.access_token;
    } catch {}
  }

  if (!accessToken && fs.existsSync(workspaceMcpFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(workspaceMcpFile, 'utf-8'));
      const auth = data?.mcpServers?.notion?.headers?.Authorization;
      if (auth && auth.startsWith('Bearer ')) {
        accessToken = auth.slice(7).trim();
      }
    } catch {}
  }

  if (!accessToken) {
    console.error('❌ Notion OAuth token not found.');
    console.error('Run: pwsh -File .\\scripts\\Manage-WorkspaceSkills.ps1 -Action Add -Pack notion');
    process.exit(1);
  }

  async function callNotionMcp(toolName, toolArgs) {
    return new Promise((resolve, reject) => {
      const https = require('https');
      const payload = JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: toolArgs
        }
      });

      const req = https.request({
        hostname: 'mcp.notion.com',
        path: '/mcp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 400) {
            return reject(new Error(`Notion MCP returned HTTP ${res.statusCode}: ${body}`));
          }
          try {
            let jsonStr = body;
            if (body.includes('data: ')) {
              const lines = body.split('\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  jsonStr = line.slice(6).trim();
                  break;
                }
              }
            }
            const parsed = JSON.parse(jsonStr);
            const content = parsed?.result?.content?.[0]?.text;
            if (content) {
              try {
                return resolve(JSON.parse(content));
              } catch {
                return resolve(content);
              }
            }
            resolve(parsed.result || parsed);
          } catch (e) {
            resolve(body);
          }
        });
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  if (mode === 'write') {
    if (!params.confirm) {
      console.log('⚠️ [STRICT CONFIRMATION REQUIRED]');
      console.log(`Action: Mutate Notion`);
      console.log(`Instruction: ${query || params.tool || '(No query provided)'}`);
      console.log('To execute this mutation, re-run with --confirm:');
      console.log(`  node ./scripts/subagent.js --task notion --mode write --query "${query || ''}" --confirm`);
      return;
    }

    if (params.tool) {
      let argsObj = {};
      if (params.toolArgs) {
        try {
          argsObj = JSON.parse(params.toolArgs);
        } catch (e) {
          console.error(`❌ Invalid --tool-args JSON: ${e.message}`);
          process.exit(1);
        }
      }
      console.log(`⏳ Executing Notion MCP mutation tool: ${params.tool}...`);
      try {
        const res = await callNotionMcp(params.tool, argsObj);
        console.log(`✅ [Notion Operator] Mutation Succeeded:`);
        console.log(typeof res === 'object' ? JSON.stringify(res, null, 2) : res);
        return;
      } catch (err) {
        console.error(`❌ Notion MCP mutation failed: ${err.message}`);
        process.exit(1);
      }
    }

    console.log(`⏳ Executing Notion mutation: "${query}"...`);
    const systemPrompt = `You are the Notion Operator Subagent.
Report exact updated properties, status, and URL for the mutation instruction.`;
    const result = await dispatchToSubagent(
      `Mutation Instruction: ${query}`,
      systemPrompt,
      'fast',
      params.model,
      params.maxTokens,
      params.provider,
      { router: params.router, sort: params.sort, task: 'notion-operator' }
    );
    console.log(`[🤖 Worker Subagent: Notion Operator]`);
    console.log(result.output);
    return;
  }

  if (!query) {
    console.error('Error: --query or --prompt is required for Notion search/read.');
    process.exit(1);
  }

  console.log(`🔍 [Notion Subagent] Querying Notion for: "${query}"...`);
  let searchResult;
  try {
    searchResult = await callNotionMcp('notion-search', { query });
  } catch (err) {
    console.error(`❌ Notion MCP call failed: ${err.message}`);
    process.exit(1);
  }

  const rawJson = typeof searchResult === 'object' ? JSON.stringify(searchResult, null, 2) : String(searchResult);

  const systemPrompt = `You are the Notion Researcher Subagent.
Analyze the raw Notion search results and extract ONLY the facts and context relevant to the query: "${query}".
Formatting Rules:
1. Synthesize concise findings into bullet points or a markdown table.
2. Include direct Notion URLs for all relevant pages/databases.
3. Keep the total response dense, actionable, and strictly under 250 tokens.
4. Do NOT dump raw JSON.`;

  const userPrompt = `Query: ${query}\n\nRaw Notion MCP Output:\n${rawJson}`;

  const result = await dispatchToSubagent(
    userPrompt,
    systemPrompt,
    'fast',
    params.model,
    params.maxTokens,
    params.provider,
    {
      router: params.router,
      sort: params.sort,
      task: 'notion-researcher'
    }
  );

  if (params.json) {
    console.log(JSON.stringify({ query, result: result.output, raw: searchResult, usage: result.usage, dashboardUrl: PROVIDER_LINKS.notion.usageUrl }, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Notion Context Extraction]`);
    console.log(result.output);
    if (result.usage && (result.usage.totalTokens !== null || result.usage.promptTokens !== null)) {
      console.log(`\n📊 [Usage Metrics] Tokens: Prompt: ${result.usage.promptTokens ?? 0} | Completion: ${result.usage.completionTokens ?? 0} | Total: ${result.usage.totalTokens ?? 0}`);
    }
    console.log(`🔗 [Usage Dashboard] ${PROVIDER_LINKS.notion.usageUrl}`);
  }
}

// Main CLI dispatch
async function main() {
  const params = parseArgs();

  if (params.help) {
    printHelp();
    process.exitCode = 0;
    return;
  }

  if (params.usage || params.task === 'usage' || params.task === 'metrics') {
    await printUsageMetrics(params.json);
    process.exitCode = 0;
    return;
  }

  if (params.refreshModels) {
    console.log('🔄 Refreshing OpenRouter free models cache...');
    const data = await getOpenRouterFreeModels(true);
    console.log(`✅ Discovered and cached ${data.count} free models successfully.`);
    process.exitCode = 0;
    return;
  }

  if (params.listModels) {
    await printModelList(params.sort);
    process.exitCode = 0;
    return;
  }

  try {
    switch (params.task.toLowerCase()) {
      case 'research':
      case 'explore':
        await handleResearch(params);
        break;
      case 'code':
      case 'patch':
        await handleCode(params);
        break;
      case 'review':
      case 'adversarial':
        await handleReview(params);
        break;
      case 'compress':
      case 'logs':
        await handleCompress(params);
        break;
      case 'notion':
        await handleNotion(params);
        break;
      case 'usage':
      case 'metrics':
        await printUsageMetrics(params.json);
        break;
      case 'ask':
      default:
        await handleAsk(params);
        break;
    }
  } catch (err) {
    console.error(`❌ Subagent Execution Error: ${err.message}`);
    process.exit(1);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseArgs,
    isSafePath,
    getOpenRouterFreeModels,
    getSortedModels,
    selectModelWithGroqRouter,
    callGroq,
    callMistral,
    callGemini,
    // callXAI, // [PAID TIER - REMOVED FROM ROTATION]
    callOpenRouter,
    callOmniRoute,
    dispatchToSubagent,
    isModelVerifiedFree,
    fetchOpenRouterMetrics,
    fetchGroqMetrics,
    fetchMistralMetrics,
    fetchGeminiMetrics,
    fetchNotionMetrics,
    fetchAllSubagentMetrics,
    printUsageMetrics,
    PROVIDER_LINKS,
    KEYS
  };
}

if (require.main === module) {
  main();
}
