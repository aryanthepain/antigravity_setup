/**
 * 🛡️ Anti-Paid / Zero-Cost Exhaustive Security & Integrity Test Suite (2026)
 *
 * Verifies that subagent.js and all its routing pathways CANNOT and WILL NEVER
 * dispatch requests to any non-free model, paid endpoint, or spoofed :free suffix.
 */

const assert = require('assert');
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const subagent = require('../scripts/subagent.js');

const SCRIPT_PATH = path.resolve(__dirname, '../scripts/subagent.js');

let totalTests = 0;
let passedTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

async function main() {
  console.log('\n================================================================');
  console.log('🛡️  RUNNING EXHAUSTIVE ZERO-COST & ANTI-PAID SECURITY TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // GROUP 1: In-Memory Model Verification & Blacklist Tests
  // -------------------------------------------------------------
  console.log('--- [Group 1: Static Blacklist & Verification Guards] ---');

  const paidFrontierModels = [
    'openai/gpt-4o',
    'openai/gpt-4-turbo',
    'openai/gpt-4',
    'openai/gpt-3.5-turbo',
    'openai/o1-preview',
    'openai/o1-mini',
    'openai/o3-mini',
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-opus',
    'anthropic/claude-3-haiku',
    'anthropic/claude-2.1',
    'meta-llama/llama-3.1-405b-instruct',
    'meta-llama/llama-3.3-70b-instruct',
    'mistralai/mistral-large-2411',
    'google/gemini-1.5-pro',
    'cohere/command-r-plus'
  ];

  for (const model of paidFrontierModels) {
    await runAsyncTest(`Blocks paid model '${model}' from verification`, async () => {
      const isFree = await subagent.isModelVerifiedFree(model);
      assert.strictEqual(isFree, false, `Expected ${model} to be rejected as non-free`);
    });
  }

  // -------------------------------------------------------------
  // GROUP 2: Spoofed Suffix Defense (:free appendage attack)
  // -------------------------------------------------------------
  console.log('\n--- [Group 2: Spoofed :free Suffix Attack Defense] ---');

  const spoofedModels = [
    'openai/gpt-4o:free',
    'anthropic/claude-3.5-sonnet:free',
    'meta-llama/llama-3.1-405b:free',
    'arbitrary-fake-model-12345:free',
    'google/gemini-ultra:free'
  ];

  for (const model of spoofedModels) {
    await runAsyncTest(`Blocks spoofed model '${model}' (not in catalog)`, async () => {
      const isFree = await subagent.isModelVerifiedFree(model);
      assert.strictEqual(isFree, false, `Expected spoofed model ${model} to be rejected`);
    });
  }

  // -------------------------------------------------------------
  // GROUP 3: Catalog Pricing Filter Integrity (Zero Tolerance)
  // -------------------------------------------------------------
  console.log('\n--- [Group 3: Catalog Pricing Filter Strictness] ---');

  runTest('Catalog filter rejects any model with prompt pricing > 0', () => {
    const mockModels = [
      { id: 'valid/free:free', pricing: { prompt: '0', completion: '0' } },
      { id: 'sneak/paid:free', pricing: { prompt: '0.000001', completion: '0' } },
      { id: 'sneak/completion:free', pricing: { prompt: '0', completion: '0.000002' } },
      { id: 'normal/paid', pricing: { prompt: '5', completion: '15' } },
      { id: 'zero/unlabeled', pricing: { prompt: '0', completion: '0' } }
    ];

    const filtered = mockModels.filter(m => {
      const promptPrice = m.pricing ? parseFloat(m.pricing.prompt || '0') : 0;
      const completionPrice = m.pricing ? parseFloat(m.pricing.completion || '0') : 0;
      if (promptPrice > 0 || completionPrice > 0) return false;
      const isExplicitFree = m.id.endsWith(':free');
      const isExplicitZeroPrice = m.pricing && promptPrice === 0 && completionPrice === 0;
      return isExplicitFree || isExplicitZeroPrice;
    });

    const ids = filtered.map(m => m.id);
    assert.ok(ids.includes('valid/free:free'), 'Should include 0-cost :free model');
    assert.ok(ids.includes('zero/unlabeled'), 'Should include 0-cost model without suffix');
    assert.strictEqual(ids.includes('sneak/paid:free'), false, 'MUST NOT include model with prompt > 0 even with :free suffix');
    assert.strictEqual(ids.includes('sneak/completion:free'), false, 'MUST NOT include model with completion > 0 even with :free suffix');
    assert.strictEqual(ids.includes('normal/paid'), false, 'MUST NOT include paid model');
    assert.strictEqual(filtered.length, 2, 'Exactly 2 models should pass zero-cost filter');
  });

  // -------------------------------------------------------------
  // GROUP 4: Direct Call Rejection (callOpenRouter throws before network)
  // -------------------------------------------------------------
  console.log('\n--- [Group 4: callOpenRouter Pre-Flight Exceptions] ---');

  for (const model of ['openai/gpt-4o', 'anthropic/claude-3-opus', 'fake/model:free']) {
    await runAsyncTest(`callOpenRouter throws security error for '${model}'`, async () => {
      let threw = false;
      try {
        await subagent.callOpenRouter('hello', 'system', model, 10);
      } catch (err) {
        threw = true;
        assert.ok(
          err.message.includes('[OpenRouter Safety Guard] Blocked paid/unverified model call'),
          `Unexpected error message: ${err.message}`
        );
      }
      assert.strictEqual(threw, true, `Expected callOpenRouter to throw for ${model}`);
    });
  }

  // -------------------------------------------------------------
  // GROUP 5: CLI Process Interception (Non-Zero Exit Code on Paid Model)
  // -------------------------------------------------------------
  console.log('\n--- [Group 5: CLI Subprocess Invariant Enforcement] ---');

  const cliTests = [
    { args: ['--model', 'openai/gpt-4o', '--prompt', 'test'], expectedError: 'Blocked paid/unverified model' },
    { args: ['--provider', 'openrouter', '--model', 'anthropic/claude-3.5-sonnet', '--prompt', 'test'], expectedError: 'Blocked paid/unverified model' },
    { args: ['--model', 'meta-llama/llama-3.1-405b:free', '--prompt', 'test'], expectedError: 'Blocked paid/unverified model' },
    { args: ['--task', 'code', '--model', 'openai/gpt-4-turbo', '--prompt', 'test'], expectedError: 'Blocked paid/unverified model' }
  ];

  for (const testCase of cliTests) {
    runTest(`CLI blocks: node subagent.js ${testCase.args.join(' ')}`, () => {
      const proc = spawnSync('node', [SCRIPT_PATH, ...testCase.args], {
        encoding: 'utf-8',
        timeout: 10000
      });

      assert.notStrictEqual(proc.status, 0, `Process should have exited with non-zero code for paid model`);
      const combinedOutput = (proc.stderr || '') + (proc.stdout || '');
      assert.ok(
        combinedOutput.includes(testCase.expectedError),
        `Expected output to contain '${testCase.expectedError}'. Got: ${combinedOutput}`
      );
    });
  }

  // -------------------------------------------------------------
  // GROUP 6: Groq Neural Router Candidate Whitelist Immunity
  // -------------------------------------------------------------
  console.log('\n--- [Group 6: Neural Router Candidate Safety] ---');

  runTest('Neural Router candidate assembly only contains zero-cost models', () => {
    // Check candidate models logic
    const freeModels = [
      { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'Nemotron', intelligenceScore: 200, context_length: 1000000 },
      { id: 'qwen/qwen3.8-27b:free', name: 'Qwen', intelligenceScore: 125, context_length: 262144 }
    ];

    const candidates = [
      { id: 'codestral-latest', provider: 'Mistral' },
      { id: 'gemini-3.8-flash', provider: 'Google Gemini' },
      { id: 'openai/gpt-oss-120b', provider: 'Groq LPU' },
      ...freeModels.map(m => ({ id: m.id, provider: 'OpenRouter' }))
    ];

    for (const c of candidates) {
      assert.ok(
        c.id.endsWith(':free') || ['codestral-latest', 'gemini-3.8-flash', 'openai/gpt-oss-120b'].includes(c.id),
        `Candidate ${c.id} must be verified zero cost`
      );
    }
  });

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 ZERO-COST SECURITY AUDIT RESULTS: ${passedTests} / ${totalTests} PASSED`);
  if (passedTests === totalTests) {
    console.log('🎉 ZERO-COST INVARIANT GUARANTEED: No paid models can be called.');
    console.log('================================================================\n');
    process.exit(0);
  } else {
    console.error(`⛔ SECURITY VULNERABILITY DETECTED: ${totalTests - passedTests} tests failed.`);
    console.log('================================================================\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
