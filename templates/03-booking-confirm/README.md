# Booking confirmation + password reset

Shows both halves of Sendable.

```bash
npm install
SENDABLE_API_KEY=sk_test_... npm start

# composed — you describe it, Sendable writes it
curl -X POST localhost:3003/bookings -H 'content-type: application/json' \
  -d '{"email":"you@example.com","when":"Tuesday at 2:00 PM","withWhom":"Jordan","location":"Suite 400"}'

# raw — your exact words, link untouched
curl -X POST localhost:3003/password-reset -H 'content-type: application/json' \
  -d '{"email":"you@example.com"}'
```

Use `sendRaw` whenever a link or legal wording must be exact. It also bypasses the
unsubscribe list, so an opted-out user can still reset their password — but never
route marketing through it to dodge unsubscribes.
