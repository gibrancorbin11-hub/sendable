# Sendable templates

Four runnable examples. Each is a real integration against the live API — not a
demo stub. Clone one, add a key, and it sends actual email.

| Template | What it shows |
|---|---|
| [`01-saas-welcome`](./01-saas-welcome) | Signup → welcome email in two lines. Boots on Replit. |
| [`02-order-status`](./02-order-status) | Order events (`order_shipped`, etc.) → status email. |
| [`03-booking-confirm`](./03-booking-confirm) | Booking confirmation with date/time passed through verbatim. |
| [`04-ai-email-agent`](./04-ai-email-agent) | **Give an AI agent the power to send email.** Describe an event in plain language; Claude calls Sendable over MCP and it sends. |

```bash
cd 01-saas-welcome
npm install
SENDABLE_API_KEY=sk_test_... npm start
```

Get a free key at https://www.sendable.me/keys — 500 messages a month, no card.

Start with a `sk_test_` key: messages are composed exactly as they would be but
never delivered, so you can see the copy before anything reaches a real inbox.
Switch to `sk_live_` when you're ready.

## Your app profile shapes every message

Sendable composes from the app description you set at signup (editable at
`/app/settings`). It is the difference between good copy and confused copy: a
`booking_confirmed` event on an account described as "order tracking for
e-commerce" will read oddly, because the composer is told the wrong thing about
your product.

Set it to what your product actually does, in one plain sentence, before judging
the output.
