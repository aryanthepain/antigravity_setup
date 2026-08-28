#!/usr/bin/env node
/**
 * 🤖 Antigravity Asymmetric Subagent Runner (2026)
 * 
 * Purpose: Enables the Chief Orchestrator model to delegate token-heavy tasks 
 * (codebase surveys, multi-file scans, code generation, adversarial reviews, and log compression)
 * to fast, free submodels (Groq LPU, Mistral Codestral, Google Gemini, OpenRouter) 
 * without bloating the primary conversation context window.
 * 
 * Usage:
 *   node ./scripts/subagent.js --task research --query "How does auth work?" --files "src/auth.ts,src/server.ts"
 *   node ./scripts/subagent.js --task code --file "src/utils.ts" --prompt "Add UUID generator"
 *   node ./scripts/subagent.js --task review [--diff | --file "src/main.ts"]
 *   node ./scripts/subagent.js --task compress --file "build.log"
 *   node ./scripts/subagent.js --task ask --prompt "..." --tier [fast|code|reasoning|cheap]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
    json: false
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
  ask (default)       General fast queries or lightweight assistant responses.

Options:
  -t, --task <type>       Task mode: research | code | review | compress | ask (default: ask)
  -q, --query <string>    Research query or search question
  -p, --prompt <string>   Prompt instructions for code, ask, or compress
  -f, --file <path>       Target file path to inspect, modify, or review
      --files <list>      Comma-separated list of file paths for multi-file research
  -d, --diff              Use git diff (HEAD / staged) as context for review task
      --tier <tier>       Model routing tier: fast | code | reasoning | cheap (default: fast)
  -m, --model <name>      Explicit model override (e.g. llama-3.3-70b-versatile, codestral-latest)
      --provider <name>   Explicit provider name override
      --max-tokens <int>  Maximum output tokens (default: 1024)
      --json              Output response as structured JSON ({ provider, output })
  -h, --help              Show this help menu and exit

Examples:
  node ./scripts/subagent.js --help
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
  deepseek: process.env.DEEPSEEK_API_KEY
};

// Model provider implementations
async function callGroq(prompt, systemPrompt, model = 'llama-3.3-70b-versatile', maxTokens = 1024) {
  if (!KEYS.groq) throw new Error('GROQ_API_KEY not set');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEYS.groq}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.2
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.choices?.[0]?.message?.content?.trim() || '';
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
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callGemini(prompt, systemPrompt, model = 'gemini-2.5-flash', maxTokens = 1024) {
  if (!KEYS.gemini) throw new Error('GEMINI_API_KEY not set');
  // Use gemini-2.5-flash or gemini-1.5-flash
  const modelName = model.includes('/') ? model.split('/')[1] : (model || 'gemini-2.5-flash');
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
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

async function callOpenRouter(prompt, systemPrompt, model = 'deepseek/deepseek-r1:free', maxTokens = 1024) {
  if (!KEYS.openrouter) throw new Error('OPENROUTER_API_KEY not set');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEYS.openrouter}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'openai/gpt-4o-mini',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.2
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.choices?.[0]?.message?.content?.trim() || '';
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
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// Router dispatcher with automatic fallback cascade
async function dispatchToSubagent(prompt, systemPrompt, tier = 'fast', preferredModel = '', maxTokens = 1024) {
  // Strategy: Try OmniRoute first if running, else cascade through available providers based on tier
  const tryCall = async (fn, name) => {
    try {
      const output = await fn();
      return { success: true, provider: name, output };
    } catch (err) {
      return { success: false, provider: name, error: err.message };
    }
  };

  // 1. Try OmniRoute local proxy
  try {
    const omniResult = await callOmniRoute(prompt, systemPrompt, preferredModel, maxTokens);
    if (omniResult) return { provider: 'OmniRoute Gateway', output: omniResult };
  } catch (e) {
    // OmniRoute not running, fallback to direct APIs
  }

  // 2. Multi-tier routing order
  let attempts = [];

  if (tier === 'code' || tier === 'precision_coding') {
    // Code generation: Codestral -> Groq Llama 3.3 -> Gemini -> OpenRouter
    if (KEYS.mistral) attempts.push(() => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens), 'Mistral Codestral');
    if (KEYS.groq) attempts.push(() => callGroq(prompt, systemPrompt, 'llama-3.3-70b-versatile', maxTokens), 'Groq LPU (Llama 3.3 70B)');
    if (KEYS.gemini) attempts.push(() => callGemini(prompt, systemPrompt, 'gemini-2.5-flash', maxTokens), 'Google Gemini Flash');
    if (KEYS.openrouter) attempts.push(() => callOpenRouter(prompt, systemPrompt, 'openai/gpt-4o-mini', maxTokens), 'OpenRouter GPT-4o-mini');
  } else if (tier === 'reasoning' || tier === 'review') {
    // Review / Reasoning: OpenRouter (DeepSeek R1/GPT-4o) -> Gemini 2.5 Flash -> Mistral -> Groq
    if (KEYS.openrouter) attempts.push(() => callOpenRouter(prompt, systemPrompt, 'openai/gpt-4o-mini', maxTokens), 'OpenRouter (GPT-4o-mini)');
    if (KEYS.gemini) attempts.push(() => callGemini(prompt, systemPrompt, 'gemini-2.5-flash', maxTokens), 'Google Gemini Flash');
    if (KEYS.mistral) attempts.push(() => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens), 'Mistral Codestral');
    if (KEYS.groq) attempts.push(() => callGroq(prompt, systemPrompt, 'llama-3.3-70b-versatile', maxTokens), 'Groq LPU');
  } else {
    // Fast / Research / Cheap default: Groq (sub-second) -> Gemini Flash -> Mistral -> OpenRouter
    if (KEYS.groq) attempts.push(() => callGroq(prompt, systemPrompt, 'llama-3.3-70b-versatile', maxTokens), 'Groq LPU (Llama 3.3 70B)');
    if (KEYS.gemini) attempts.push(() => callGemini(prompt, systemPrompt, 'gemini-2.5-flash', maxTokens), 'Google Gemini Flash');
    if (KEYS.mistral) attempts.push(() => callMistral(prompt, systemPrompt, 'codestral-latest', maxTokens), 'Mistral Codestral');
    if (KEYS.openrouter) attempts.push(() => callOpenRouter(prompt, systemPrompt, 'openai/gpt-4o-mini', maxTokens), 'OpenRouter');
  }

  for (let i = 0; i < attempts.length; i += 2) {
    const fn = attempts[i];
    const name = attempts[i + 1];
    const res = await tryCall(fn, name);
    if (res.success && res.output) {
      return { provider: res.provider, output: res.output };
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

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'fast', params.model, params.maxTokens);
  
  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Research]`);
    console.log(result.output);
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

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'code', params.model, params.maxTokens);

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Code Generation]`);
    console.log(result.output);
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

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'review', params.model, params.maxTokens);

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Adversarial Review]`);
    console.log(result.output);
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

  // Truncate if extreme (keep last 4000 lines)
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

  const result = await dispatchToSubagent(userPrompt, systemPrompt, 'fast', params.model, 300);

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Task: Log Compression]`);
    console.log(result.output);
  }
}

// 5. GENERAL FAST SUBAGENT ASK
async function handleAsk(params) {
  const prompt = params.prompt || params.query;
  if (!prompt) {
    console.error('Error: --prompt or query text is required');
    process.exit(1);
  }

  const result = await dispatchToSubagent(prompt, 'You are an ultra-fast worker subagent. Give direct, accurate, concise answers.', params.tier, params.model, params.maxTokens);

  if (params.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`[🤖 Worker Subagent: ${result.provider} | Tier: ${params.tier}]`);
    console.log(result.output);
  }
}

// Main CLI dispatch
async function main() {
  const params = parseArgs();

  if (params.help) {
    printHelp();
    process.exit(0);
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

main();
