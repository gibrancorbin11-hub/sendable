#!/usr/bin/env node
/**
 * AI email agent — give an AI agent the power to send real transactional email.
 *
 * You describe what happened in plain language ("Sam upgraded to Pro"). Claude
 * picks the right Sendable tool call. Sendable writes the copy and sends it — and
 * because the model that writes the words never sees your data *values* (only the
 * field names), a price, a date, or a reset link can never be paraphrased into
 * something false.
 *
 * The entire integration is connecting to the Sendable MCP server (one block
 * below). After that, `send` / `send_raw` / `identify` are just tools your agent
 * can call. Drop this connection into any agent you're already building.
 *
 *   ANTHROPIC_API_KEY=sk-ant-...  SENDABLE_API_KEY=sk_live_...  \
 *     node agent.js "Sam (sam@example.com) just upgraded to the Pro plan ($99/mo)"
 */
import Anthropic from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Cheap + fast is fine: Sendable writes the actual email, so the agent only has to
// map "what happened" to a tool call. Swap for any Claude model you prefer.
const MODEL = 'claude-haiku-4-5-20251001';

async function main() {
  const request =
    process.argv.slice(2).join(' ').trim() ||
    'A user named Sam (sam@example.com) just upgraded to the Pro plan ($99/month).';

  if (!process.env.ANTHROPIC_API_KEY)
    fail('Set ANTHROPIC_API_KEY — get one at https://console.anthropic.com/');
  if (!process.env.SENDABLE_API_KEY)
    fail('Set SENDABLE_API_KEY — free at https://www.sendable.me/keys (500 msgs/mo, no card)');

  // ── The whole integration: connect to the Sendable MCP server over stdio. ──
  // Your agent now has send / send_raw / identify as callable tools.
  const mcp = new Client({ name: 'ai-email-agent', version: '1.0.0' });
  await mcp.connect(
    new StdioClientTransport({
      command: 'npx',
      args: ['-y', 'sendableme-mcp'],
      env: process.env, // passes SENDABLE_API_KEY through
    }),
  );

  const { tools } = await mcp.listTools();
  const toolDefs = tools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema,
  }));
  console.log(`Connected to Sendable · tools: ${tools.map((t) => t.name).join(', ')}\n`);

  // ── Agent loop: Claude reads the event and calls the tools until it's done. ──
  const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY
  const messages = [
    {
      role: 'user',
      content:
        'You send transactional email through the Sendable tools. Given an event ' +
        'in plain language, call `send` with a snake_case event name (e.g. ' +
        'order_shipped, plan_upgraded) and the relevant data fields. Sendable ' +
        'writes the copy — you only choose the recipient, the event name, and the ' +
        'data. Format each value exactly as it should read (e.g. "$99.00", not 99). ' +
        'Call `identify` first only if you were given a user id rather than an ' +
        `email. Here is what happened:\n\n${request}`,
    },
  ];

  for (let turn = 0; turn < 6; turn++) {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      tools: toolDefs,
      messages,
    });
    messages.push({ role: 'assistant', content: res.content });

    for (const block of res.content) {
      if (block.type === 'text' && block.text.trim()) console.log(block.text.trim());
    }

    const toolUses = res.content.filter((b) => b.type === 'tool_use');
    if (toolUses.length === 0) break;

    const toolResults = [];
    for (const call of toolUses) {
      console.log(`\n→ ${call.name}(${JSON.stringify(call.input)})`);
      const out = await mcp.callTool({ name: call.name, arguments: call.input });
      const text = (out.content || []).map((c) => c.text ?? '').join('\n');
      console.log(text);
      toolResults.push({
        type: 'tool_result',
        tool_use_id: call.id,
        content: text,
        is_error: Boolean(out.isError),
      });
    }
    messages.push({ role: 'user', content: toolResults });
  }

  await mcp.close();
  process.exit(0);
}

function fail(msg) {
  console.error('✗ ' + msg);
  process.exit(1);
}

main().catch((e) => fail(e?.message ?? String(e)));
