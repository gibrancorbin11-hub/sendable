# sendableme-mcp

MCP server for [Sendable](https://www.sendable.me). Lets Claude, Cursor, and any
MCP client send real transactional email from your app — no integration step.

```bash
npx sendableme-mcp
```

## Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "sendable": {
      "command": "npx",
      "args": ["-y", "sendableme-mcp"],
      "env": { "SENDABLE_API_KEY": "sk_live_..." }
    }
  }
}
```

Get a free key at [sendable.me/keys](https://www.sendable.me/keys) — 500 messages
a month, no card.

## Tools

**`send(to, event, data)`** — you describe what happened, Sendable writes the copy
and sends it. Your data values are inserted verbatim and never rewritten, so
format them as they should read (`"$99.00"`, not `99`).

**`send_raw(to, subject, body)`** — exact copy you supply. For password resets and
receipts where wording and links must be exact. Bypasses the unsubscribe list so a
user who opted out can still get back into their account.

**`identify(userId, email, traits)`** — associate a user id with an email so you
can send by id afterwards.

## Test mode

A key starting `sk_test_` composes normally and delivers nothing. Every result
says so explicitly, so an agent can't report "email sent" when nothing left.

MIT
