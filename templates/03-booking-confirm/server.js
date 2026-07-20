/**
 * Booking confirmation, plus a password reset that must arrive exactly as written.
 *
 * Shows both halves of Sendable: composed mail for things you describe, and raw
 * mail for things where the wording and the link cannot change.
 */
import express from 'express';
import { send, sendRaw, SendableApiError } from 'sendableme';

const app = express();
app.use(express.json());

// Composed: describe the booking, Sendable writes it.
app.post('/bookings', async (req, res) => {
  const { email, when, withWhom, location } = req.body ?? {};
  try {
    const msg = await send(email, 'booking_confirmed', {
      when,          // "Tuesday at 2:00 PM"
      withWhom,      // "Jordan"
      location,      // "Suite 400"
    });
    res.json({ subject: msg.subject, body: msg.body });
  } catch (err) {
    if (err instanceof SendableApiError) return res.status(502).json({ error: err.code, fix: err.fix });
    throw err;
  }
});

/*
 * Raw: a reset link must survive byte for byte, so we write the copy ourselves.
 * sendRaw also bypasses the unsubscribe list — someone who opted out of
 * notifications must still be able to get back into their account.
 */
app.post('/password-reset', async (req, res) => {
  const { email } = req.body ?? {};
  const url = `https://example.com/reset?token=${Math.random().toString(36).slice(2)}`;
  try {
    await sendRaw(
      email,
      'Reset your password',
      `Open this link to set a new password:\n\n${url}\n\nIt expires in one hour. ` +
        `If you did not ask for this, you can ignore this message.`,
    );
    res.json({ sent: true });
  } catch (err) {
    if (err instanceof SendableApiError) return res.status(502).json({ error: err.code, fix: err.fix });
    throw err;
  }
});

const PORT = process.env.PORT ?? 3003;
app.listen(PORT, () => console.log(`POST /bookings and POST /password-reset on :${PORT}`));
