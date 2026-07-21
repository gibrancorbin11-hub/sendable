# Sendable × Next.js

All your lifecycle email through one function call — in Next.js App Router API routes.
Fork it, add a key, and welcome / receipt / password-reset emails just work.

| Route | Sendable call | Why |
|---|---|---|
| `POST /api/signup` | `identify` + `send('account_created')` | Composed welcome email |
| `POST /api/purchase` | `send('payment_succeeded')` | Receipt — amount inserted verbatim |
| `POST /api/reset-password` | `sendRaw(...)` | Byte-exact copy that reaches the user even if they unsubscribed |

The split is the point: **composed `send` for the soft lifecycle emails** (welcome,
trial-ending, re-engagement) where copy quality matters, and **`sendRaw` for the
exact ones** (resets, receipts, security) where wording and links must be perfect.
Your data values are never rewritten in either case.

## Setup

```bash
npm install
cp .env.example .env.local        # add your SENDABLE_API_KEY
npm run dev                        # http://localhost:3000
```

The home page has three buttons that hit the routes so you can see the copy Sendable
wrote without opening an inbox. Use a `sk_test_` key to compose without delivering.

Get a free key at [sendable.me/keys](https://www.sendable.me/keys) — 500 messages a
month, no card.

## Wire it into a real app

Call the same functions from your existing handlers — a Stripe webhook, a NextAuth
`events.createUser` callback, a cron:

```js
import { send } from 'sendableme';

// in your Stripe webhook, on invoice.payment_succeeded:
await send(customerEmail, 'payment_succeeded', { amount: '$99.00', item: 'Pro plan' });
```

No template to design, no dashboard step — a new message type is a new string.
