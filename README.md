# Sendable

**One line, and your app knows how to talk to its users.**

You describe what happened; [Sendable](https://www.sendable.me) writes the message
and sends it. No templates to maintain, no dashboard step — your data is never
rewritten, only the words around it.

```bash
npm i sendableme
```

```js
import { send } from 'sendableme';

await send('sam@example.com', 'order_shipped', { orderId: 'A-1042', eta: 'Friday' });
```

That's a complete integration. Adding a new message type is a new string.

Get a free API key at [sendable.me/keys](https://www.sendable.me/keys) — 500
messages a month, no card.

## Try it in your browser

One click imports the SaaS-welcome example and runs it on Replit — add your
`SENDABLE_API_KEY` in Secrets and hit Run:

[![Run on Replit](https://replit.com/badge/github/gibrancorbin11-hub/sendable)](https://replit.com/github/gibrancorbin11-hub/sendable)

---

## What's in this repo

| Directory | What it is |
|---|---|
| [`sdk/`](./sdk) | The `sendableme` npm package — the client SDK |
| [`mcp/`](./mcp) | `sendableme-mcp` — an MCP server, so Claude and Cursor can send email by asking |
| [`templates/`](./templates) | Three runnable examples against the live API |

## Your data is never rewritten

The model that writes the copy never sees your values — only your field names. It
writes copy containing `{{placeholders}}`, and your values are substituted
afterwards, so a price, a date, or a reset link cannot be altered. A second model
checks every draft for claims your data doesn't support and refuses rather than
guess.

```js
await send(user.id, 'payment_failed', { amount: '$99.00' });
// "$99.00" appears exactly as written, always
```

## MCP

```bash
npx -y sendableme-mcp
```

Add it to Claude Desktop or Cursor and send transactional email straight from the
editor. See [`mcp/`](./mcp) for the config block.

## Docs

Full reference, written to be pasted into an AI assistant:
[sendable.me/llms.txt](https://www.sendable.me/llms.txt)

## License

MIT
