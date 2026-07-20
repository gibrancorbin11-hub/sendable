# Sendable

One line, and your app knows how to talk to its users.

```bash
npm i sendableme
```

```js
import { send } from 'sendableme';

await send('sam@example.com', 'order_shipped', { orderId: 'A-1042', eta: 'Friday' });
```

That is a complete integration. No templates, no dashboard step. You describe what
happened; Sendable writes the message and sends it.

Set `SENDABLE_API_KEY` in your environment — the SDK reads it automatically. Get a
key at [sendable.me](https://www.sendable.me): 500 messages a month, free, no card.

## Your data is never rewritten

The composer never sees your values, only your field names. It writes copy around
`{{placeholders}}` and the values are substituted afterwards, so a price or a date
cannot be paraphrased into something false.

```js
await send(user.id, 'payment_failed', { amount: '$99.00' });
// "$99.00" appears exactly as you wrote it, always
```

Format values as you want them read — Sendable never rounds, reformats, or rephrases.

## API

```js
import { send, sendRaw, identify, Sendable, SendableApiError } from 'sendableme';
```

**`send(to, event, data?)`** — `to` is an email address or a user id you have
identified. `event` is snake_case past tense. `data` is flat: strings, numbers, booleans.

**`sendRaw(to, subject, body)`** — your own exact copy, no composition. Use for
password resets and receipts, where the wording must not change.

**`identify(userId, traits)`** — associate a user id with an email. Traits merge.

**`new Sendable({ apiKey, baseUrl? })`** — explicit client, for multi-tenant servers
or tests where the key isn't in the environment.

## Errors

`SendableApiError` carries `.code`, `.fix`, `.docs`, and `.retryAfter`. The `fix`
field states the correction in plain language.

```js
try {
  await send(user.id, 'order_shipped', { orderId: 'A-1042' });
} catch (err) {
  if (err instanceof SendableApiError) console.error(err.code, err.fix);
}
```

## Suppression

Every composed message carries an unsubscribe link, and unsubscribes and bounces are
suppressed permanently. Sending to a suppressed address is not an error — it returns
`{ status: 'suppressed' }` and costs nothing.

`sendRaw()` deliberately bypasses suppression, so a user who unsubscribed can still
receive a password reset.

## Full reference

[www.sendable.me/llms.txt](https://www.sendable.me/llms.txt) — written to be pasted into
Claude, Cursor, or any coding agent.

MIT
