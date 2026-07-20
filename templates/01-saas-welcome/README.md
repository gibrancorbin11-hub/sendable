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
