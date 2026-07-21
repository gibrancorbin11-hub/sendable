# Installing the Sendable MCP server

This file tells an AI agent (Cline, Cursor, Claude) how to set up Sendable.

## What it is
An MCP server that sends transactional email. You describe an app event and
Sendable writes and sends the message. Tools: `send`, `send_raw`, `identify`.

## Install
No build step — it runs the published npm package over stdio via npx.

Add this to the MCP server config (Cline: `cline_mcp_settings.json`; Claude
Desktop: `claude_desktop_config.json`; Cursor: `.mcp.json`):

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

## API key (required)
Get a free key at https://www.sendable.me/keys — 500 messages/month, no card.
Put it in `SENDABLE_API_KEY`. A key starting `sk_test_` composes messages but
delivers nothing (safe for testing); `sk_live_` sends real email.

## Verify
The server starts and lists its three tools even without a key set
(introspection). It only needs the key to actually send. After adding the
config, ask the agent to list its tools — you should see `send`, `send_raw`,
`identify`.
