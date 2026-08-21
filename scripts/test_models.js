// Full Multi-Provider Comparative Benchmark (Antigravity 2026)
const prompt = "In 2 sentences, explain the primary advantage of Git worktrees for parallel AI coding agents.";

async function testGemini(apiKey) {
  if (!apiKey) return { provider: "Google AI Studio", model: "gemini-3.6-flash", status: "SKIPPED", error: "Missing key" };
  const start = Date.now();
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150 }
      })
    });
    const data = await res.json();
    const latency = Date.now() - start;
    if (data.error) throw new Error(data.error.message);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No text";
    return { provider: "Google Gemini", model: "gemini-3.6-flash", status: "SUCCESS", latencyMs: latency, text };
  } catch (err) {
    return { provider: "Google Gemini", model: "gemini-3.6-flash", status: "ERROR", latencyMs: Date.now() - start, error: err.message };
  }
}

async function testGroq(apiKey, modelId, label) {
  if (!apiKey) return { provider: "Groq LPU", model: label, status: "SKIPPED", error: "Missing key" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      })
    });
    const data = await res.json();
    const latency = Date.now() - start;
    if (data.error) throw new Error(data.error.message);
    const text = data.choices?.[0]?.message?.content?.trim() || "No text";
    return { provider: "Groq LPU", model: label, status: "SUCCESS", latencyMs: latency, text };
  } catch (err) {
    return { provider: "Groq LPU", model: label, status: "ERROR", latencyMs: Date.now() - start, error: err.message };
  }
}

async function testMistral(apiKey) {
  if (!apiKey) return { provider: "Mistral AI", model: "codestral-latest", status: "SKIPPED", error: "Missing key" };
  const start = Date.now();
  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "codestral-latest",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      })
    });
    const data = await res.json();
    const latency = Date.now() - start;
    if (data.error) throw new Error(data.error.message);
    const text = data.choices?.[0]?.message?.content?.trim() || "No text";
    return { provider: "Mistral AI", model: "codestral-latest", status: "SUCCESS", latencyMs: latency, text };
  } catch (err) {
    return { provider: "Mistral AI", model: "codestral-latest", status: "ERROR", latencyMs: Date.now() - start, error: err.message };
  }
}

async function testOpenRouter(apiKey, modelName, label) {
  if (!apiKey) return { provider: "OpenRouter Gateway", model: label, status: "SKIPPED", error: "Missing key" };
  const start = Date.now();
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150
      })
    });
    const data = await res.json();
    const latency = Date.now() - start;
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    const text = data.choices?.[0]?.message?.content?.trim() || "No text";
    return { provider: "OpenRouter Gateway", model: label, status: "SUCCESS", latencyMs: latency, text };
  } catch (err) {
    return { provider: "OpenRouter Gateway", model: label, status: "ERROR", latencyMs: Date.now() - start, error: err.message };
  }
}

async function main() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const mistralKey = process.env.MISTRAL_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;

  const results = await Promise.all([
    testGemini(geminiKey),
    testGroq(groqKey, "openai/gpt-oss-120b", "GPT-OSS 120B"),
    testMistral(mistralKey),
    testOpenRouter(openrouterKey, "openai/gpt-4o-mini", "GPT-4o Mini"),
    testOpenRouter(openrouterKey, "google/gemini-2.5-flash", "Gemini 2.5 Flash")
  ]);

  console.log(JSON.stringify(results, null, 2));
}

main();
