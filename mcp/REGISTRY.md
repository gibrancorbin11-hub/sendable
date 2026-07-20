# Registry submission pack — sendableme-mcp

Copy-paste metadata for every MCP directory. All fields verified against the
live package and site on 20 July 2026.

## Canonical fields

| Field | Value |
|---|---|
| **Name** | Sendable |
| **npm package** | `sendableme-mcp` |
| **Install** | `npx -y sendableme-mcp` |
| **Version** | 1.0.0 |
| **Homepage** | https://www.sendable.me |
| **Docs** | https://www.sendable.me/llms.txt |
| **License** | MIT |
| **Category** | Communication / Email |
| **Auth** | `SENDABLE_API_KEY` env var (free key at sendable.me/keys) |
| **Transport** | stdio |
| **Tools** | `send`, `send_raw`, `identify` |

## One-liner (≤ 100 chars)

```
Send transactional email from your editor. Describe the event; Sendable writes and sends it.
```

## Short description (≤ 300 chars)

```
Send transactional email straight from Claude or Cursor. You describe what
happened — order_shipped, trial_ending — and Sendable writes the subject and
body and sends it. Your data values are never rewritten. Free tier: 500
messages/month, no card.
```

## Long description

```
Sendable turns one tool call into a finished, sent email. Instead of writing and
maintaining templates, you describe the event and Sendable composes the copy
around your data.

The model that writes the copy never sees your values — only your field names —
so a price, a date, or a reset link cannot be altered. A second model checks
every draft for claims your data doesn't support and refuses rather than guess.

Tools:
- send(to, event, data) — composed transactional email
- send_raw(to, subject, body) — exact copy you supply, for password resets and receipts
- identify(userId, email, traits) — send by user id afterwards

Test keys (sk_test_) compose without delivering, and every result says so, so an
agent can't report a send that didn't happen. Get a free key at
sendable.me/keys — 500 messages a month, no card.
```

## Client config block (Claude Desktop / Cursor)

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

## Tags / keywords

```
email, transactional-email, notifications, sendable, communication, smtp,
claude, cursor, mcp
```

## awesome-mcp-servers list entry (Markdown)

```
- [Sendable](https://github.com/gibrancorbin11-hub/sendable) 📇 ☁️ - Send transactional email
  from your editor. Describe the event; Sendable writes and sends it, without
  rewriting your data.
```
(📇 = TypeScript, ☁️ = cloud service. Replace OWNER once the repo is public.)
