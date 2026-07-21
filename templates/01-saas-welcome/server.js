/**
 * Signup -> welcome email.
 *
 * The whole Sendable integration is the two awaits in POST /signup. There is no
 * template to create and no dashboard step.
 */
import express from 'express';
import { identify, send, SendableApiError } from 'sendableme';

const app = express();
app.use(express.json());

const users = new Map();

app.post('/signup', async (req, res) => {
  const { email, name, plan = 'free' } = req.body ?? {};
  if (!email) return res.status(400).json({ error: 'email is required' });

  const userId = `user_${users.size + 1}`;
  users.set(userId, { email, name, plan });

  try {
    // Tell Sendable who this user is, once. Afterwards you send by id.
    await identify(userId, { email, name, plan });

    // Describe what happened. Sendable writes the words.
    const msg = await send(userId, 'account_created', { plan });

    res.json({ userId, emailStatus: msg.status, subject: msg.subject, body: msg.body });
  } catch (err) {
    if (err instanceof SendableApiError) {
      // Every Sendable error carries a machine-readable `fix`.
      console.error(err.code, '-', err.fix);
      // The signup itself succeeded; don't fail it because mail did.
      return res.json({ userId, emailStatus: 'failed', reason: err.code });
    }
    throw err;
  }
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () =>
  console.log(`POST http://localhost:${PORT}/signup  {"email":"you@example.com","name":"Sam"}`),
);
