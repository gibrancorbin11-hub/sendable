# SaaS welcome email

A signup endpoint that welcomes the user. The integration is two lines.

```bash
npm install
SENDABLE_API_KEY=sk_test_... npm start

curl -X POST localhost:3001/signup \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","name":"Sam","plan":"pro"}'
```

The response includes the exact copy Sendable wrote, so you can see it without
opening an inbox.

Note the error handling: if mail fails, the signup still succeeds. A messaging
outage should never cost you a customer.

## Run it on Replit

This repo is Replit-ready — the root `.replit` boots this template directly.

1. On Replit: **Create Repl → Import from GitHub →**
   `https://github.com/gibrancorbin11-hub/sendable`
2. Open the **Secrets** panel (lock icon) and set `SENDABLE_API_KEY` to a key
   from [sendable.me/keys](https://www.sendable.me/keys). `sk_test_` composes
   without delivering; `sk_live_` actually sends.
3. Press **Run**. Then in the Shell:

   ```bash
   curl -X POST localhost:3001/signup \
     -H 'content-type: application/json' \
     -d '{"email":"you@example.com","name":"Sam","plan":"pro"}'
   ```

The response body is the exact copy Sendable wrote — no inbox needed to see it.
