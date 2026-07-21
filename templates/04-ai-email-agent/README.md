# AI email agent

**Give your AI agent the power to send real transactional email.**

You describe what happened in plain language. Claude picks the right call. Sendable
writes the copy and sends it — and the model that writes the words never sees your
data *values*, only the field names, so a price, a date, or a reset link can't be
paraphrased into something false.

```bash
npm install

ANTHROPIC_API_KEY=sk-ant-...  SENDABLE_API_KEY=sk_live_...  \
  node agent.js "Sam (sam@example.com) just upgraded to the Pro plan ($99/month)"
```

```
Connected to Sendable · tools: send, send_raw, identify

→ send({"to":"sam@example.com","event":"plan_upgraded","data":{"plan":"Pro","price":"$99/month"}})
Sent to sam@example.com

Subject: You're on Pro now
...
```

## Why this is more than a demo

The whole integration is **one block** — connecting to the Sendable MCP server:

```js
const mcp = new Client({ name: 'ai-email-agent', version: '1.0.0' });
await mcp.connect(new StdioClientTransport({
  command: 'npx', args: ['-y', 'sendableme-mcp'], env: process.env,
}));
```

After that, `send` / `send_raw` / `identify` are just tools your agent can call.
Lift that block into any agent you're already building and it can send accurate,
on-brand transactional email — with no templates to maintain and no risk of the
model inventing a policy, a price, or a feature you don't have.

## Get a key

Free at [sendable.me/keys](https://www.sendable.me/keys) — 500 messages a month, no
card. A `sk_test_` key composes without delivering (safe to experiment); `sk_live_`
actually sends.

## Try it in your browser

[![Run on Replit](https://replit.com/badge/github/gibrancorbin11-hub/sendable)](https://replit.com/github/gibrancorbin11-hub/sendable)
