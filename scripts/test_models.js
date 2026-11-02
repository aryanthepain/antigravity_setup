// Full Multi-Provider & Tooling Keys Benchmark (Antigravity 2026)
const prompt = "In one short sentence, describe why parallel AI worker subagents increase coding velocity.";

// Helper: safe masked preview
function maskKey(key) {
  if (!key) return '(not set)';
  return key.slice(0, 4) + '...' + key.slice(-3);
}

// 1. Google Gemini
async function testGemini(apiKey) {
  if (!apiKey) return { provider: "Google Gemini", target: "gemini-flash-latest", status: "MISSING", latencyMs: 0, detail: "GEMINI_API_KEY not set" };
  const models = ["gemini-flash-latest", "gemini-3-flash-preview", "gemini-3.8-flash"];
  const start = Date.now();
  let lastError = null;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 60 }
        })
      });
      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          provider: "Google Gemini",
          target: model,
          status: "ONLINE (200 OK)",
          latencyMs: Date.now() - start,
          detail: data.candidates[0].content.parts[0].text.trim().replace(/\n/g, ' ').slice(0, 80)
        };
      }
      lastError = data.error?.message || `HTTP ${res.status}`;
    } catch (err) {
      lastError = err.message;
    }
  }
  return { provider: "Google Gemini", target: models[0], status: "ERROR", latencyMs: Date.now() - start, detail: lastError };
}

// 2. Groq LPU
async function testGroq(apiKey) {
  const model = "openai/gpt-oss-120b";
  if (!apiKey) return { provider: "Groq LPU", target: model, status: "MISSING", latencyMs: 0, detail: "GROQ_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning || "OK";
    return {
      provider: "Groq LPU",
      target: model,
      status: "ONLINE (200 OK)",
      latencyMs: Date.now() - start,
      detail: text.trim().replace(/\n/g, ' ').slice(0, 80)
    };
  } catch (err) {
    return { provider: "Groq LPU", target: model, status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

// 3. Mistral AI
async function testMistral(apiKey) {
  const model = "codestral-latest";
  if (!apiKey) return { provider: "Mistral AI", target: model, status: "MISSING", latencyMs: 0, detail: "MISTRAL_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    const text = data.choices?.[0]?.message?.content || "OK";
    return {
      provider: "Mistral AI",
      target: model,
      status: "ONLINE (200 OK)",
      latencyMs: Date.now() - start,
      detail: text.trim().replace(/\n/g, ' ').slice(0, 80)
    };
  } catch (err) {
    return { provider: "Mistral AI", target: model, status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

// 4. OpenRouter Free Gateway
async function testOpenRouter(apiKey) {
  const model = "nvidia/nemotron-3-ultra-550b-a55b:free";
  if (!apiKey) return { provider: "OpenRouter Gateway", target: model, status: "MISSING", latencyMs: 0, detail: "OPENROUTER_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/aryanthepain/antigravity_setup",
        "X-Title": "Antigravity Key Benchmark"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.message?.reasoning || "OK";
    return {
      provider: "OpenRouter Gateway",
      target: model,
      status: "ONLINE (200 OK)",
      latencyMs: Date.now() - start,
      detail: text.trim().replace(/\n/g, ' ').slice(0, 80)
    };
  } catch (err) {
    return { provider: "OpenRouter Gateway", target: model, status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

/*
// [PAID TIER - REMOVED FROM ACTIVE BENCHMARK. Uncomment when funded]
// 5. Anthropic Claude
async function testAnthropic(apiKey) {
  const model = "claude-3-5-haiku-20241022";
  if (!apiKey) return { provider: "Anthropic", target: model, status: "MISSING", latencyMs: 0, detail: "ANTHROPIC_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 50,
        messages: [{ role: "user", content: "Hi" }]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    const text = data.content?.[0]?.text || "OK";
    return {
      provider: "Anthropic",
      target: model,
      status: "ONLINE (200 OK)",
      latencyMs: Date.now() - start,
      detail: text.trim().replace(/\n/g, ' ').slice(0, 80)
    };
  } catch (err) {
    return { provider: "Anthropic", target: model, status: "INVALID KEY (401)", latencyMs: Date.now() - start, detail: err.message };
  }
}
*/

// 6. GitHub Personal Access Token (MCP)
async function testGitHub(token) {
  if (!token) return { provider: "GitHub Token (MCP)", target: "api.github.com/user", status: "MISSING", latencyMs: 0, detail: "GITHUB_TOKEN not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "Antigravity-Key-Benchmark"
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return {
      provider: "GitHub Token (MCP)",
      target: "api.github.com/user",
      status: "ONLINE (200 OK)",
      latencyMs: Date.now() - start,
      detail: `Authenticated as @${data.login} (${data.public_repos} public repos)`
    };
  } catch (err) {
    return { provider: "GitHub Token (MCP)", target: "api.github.com/user", status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

// 7. Notion Integration Token (MCP)
async function testNotion(token) {
  if (!token) return { provider: "Notion Token (MCP)", target: "api.notion.com/v1/users/me", status: "MISSING", latencyMs: 0, detail: "NOTION_API_TOKEN not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.notion.com/v1/users/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28"
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return {
      provider: "Notion Token (MCP)",
      target: "api.notion.com/v1/users/me",
      status: "ONLINE (200 OK)",
      latencyMs: Date.now() - start,
      detail: `Connected bot: '${data.name}' (${data.type})`
    };
  } catch (err) {
    return { provider: "Notion Token (MCP)", target: "api.notion.com/v1/users/me", status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

/*
// [PAID TIERS - REMOVED FROM ACTIVE BENCHMARK. Uncomment when funded]
// 8. xAI Grok
async function testXAI(apiKey) {
  const model = "grok-2-latest";
  if (!apiKey) return { provider: "xAI (Grok)", target: model, status: "MISSING", latencyMs: 0, detail: "XAI_API_KEY / GROK_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 30
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    const text = data.choices?.[0]?.message?.content || "OK";
    return { provider: "xAI (Grok)", target: model, status: "ONLINE (200 OK)", latencyMs: Date.now() - start, detail: text.trim().slice(0, 80) };
  } catch (err) {
    return { provider: "xAI (Grok)", target: model, status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

// 9. DeepSeek
async function testDeepSeek(apiKey) {
  const model = "deepseek-chat";
  if (!apiKey) return { provider: "DeepSeek", target: model, status: "MISSING", latencyMs: 0, detail: "DEEPSEEK_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 30
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    return { provider: "DeepSeek", target: model, status: "ONLINE (200 OK)", latencyMs: Date.now() - start, detail: data.choices[0].message.content.trim().slice(0, 80) };
  } catch (err) {
    return { provider: "DeepSeek", target: model, status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}

// 10. OpenAI
async function testOpenAI(apiKey) {
  const model = "gpt-4o-mini";
  if (!apiKey) return { provider: "OpenAI", target: model, status: "MISSING", latencyMs: 0, detail: "OPENAI_API_KEY not set" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 30
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    return { provider: "OpenAI", target: model, status: "ONLINE (200 OK)", latencyMs: Date.now() - start, detail: data.choices[0].message.content.trim().slice(0, 80) };
  } catch (err) {
    return { provider: "OpenAI", target: model, status: "ERROR", latencyMs: Date.now() - start, detail: err.message };
  }
}
*/

async function main() {
  console.log("\n==========================================================================================");
  console.log(" 🛰️  Antigravity Comprehensive API Keys & Live Service Benchmark (2026)");
  console.log("==========================================================================================\n");

  const results = await Promise.all([
    testGemini(process.env.GEMINI_API_KEY),
    testGroq(process.env.GROQ_API_KEY),
    testMistral(process.env.MISTRAL_API_KEY),
    testOpenRouter(process.env.OPENROUTER_API_KEY),
    testGitHub(process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN),
    testNotion(process.env.NOTION_API_TOKEN || process.env.NOTION_API_KEY)
    // [PAID TIERS - COMMENTED OUT FROM ROTATION. Uncomment when keys are funded]
    // testAnthropic(process.env.ANTHROPIC_API_KEY),
    // testXAI(process.env.XAI_API_KEY || process.env.GROK_API_KEY),
    // testDeepSeek(process.env.DEEPSEEK_API_KEY),
    // testOpenAI(process.env.OPENAI_API_KEY)
  ]);

  console.log(
    "Provider".padEnd(23) +
    "Target / Model".padEnd(25) +
    "Status".padEnd(20) +
    "Latency".padEnd(10) +
    "Live Diagnostics / Message"
  );
  console.log("-".repeat(110));

  for (const r of results) {
    const prov = r.provider.padEnd(23);
    const target = r.target.padEnd(25);
    const status = r.status.padEnd(20);
    const lat = (r.latencyMs ? `${r.latencyMs}ms` : "-").padEnd(10);
    console.log(`${prov}${target}${status}${lat}${r.detail}`);
  }

  console.log("\n" + "=".repeat(110));
  const activeCount = results.filter(r => r.status.startsWith("ONLINE")).length;
  console.log(`Summary: ${activeCount}/${results.length} services verified ONLINE and actively operational.\n`);
}

main();
