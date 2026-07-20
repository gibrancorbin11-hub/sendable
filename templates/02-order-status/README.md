# Order status updates

Four emails, one line of code. Shipped, delayed, delivered, refunded — same call,
different event name.

```bash
npm install
SENDABLE_API_KEY=sk_test_... npm start

curl -X POST localhost:3002/orders/A-1042/status -H 'content-type: application/json' \
  -d '{"email":"you@example.com","status":"shipped","eta":"Friday","carrier":"UPS"}'

curl -X POST localhost:3002/orders/A-1042/status -H 'content-type: application/json' \
  -d '{"email":"you@example.com","status":"delayed","eta":"Monday"}'

curl -X POST localhost:3002/orders/A-1042/status -H 'content-type: application/json' \
  -d '{"email":"you@example.com","status":"refunded","amount":"$40.00"}'
```

Adding a fifth status is a new string, not a new template.

Note `amount: "$40.00"` — pass money pre-formatted. Sendable never reformats your
values, so `40` would appear as "40".
