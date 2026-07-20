/**
 * One endpoint, four different emails.
 *
 * This is the point of Sendable: shipped, delayed, delivered and refunded are
 * the same one line of code. Adding a fifth status needs no new template.
 */
import express from 'express';
import { send, SendableApiError } from 'sendableme';

const app = express();
app.use(express.json());

app.post('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { email, status, eta, carrier, amount } = req.body ?? {};
  if (!email || !status) return res.status(400).json({ error: 'email and status are required' });

  /*
   * Format values exactly as they should read. Sendable inserts them verbatim
   * and never rounds or reformats — `9.5` would render as "9.5", not "$9.50".
   */
  const data = { orderId: id };
  if (eta) data.eta = eta;
  if (carrier) data.carrier = carrier;
  if (amount) data.amount = amount;

  try {
    const msg = await send(email, `order_${status}`, data);
    res.json({ status: msg.status, subject: msg.subject, body: msg.body });
  } catch (err) {
    if (err instanceof SendableApiError) {
      return res.status(502).json({ error: err.code, fix: err.fix });
    }
    throw err;
  }
});

const PORT = process.env.PORT ?? 3002;
app.listen(PORT, () => console.log(`:${PORT} POST /orders/A-1042/status  {"email":"...","status":"shipped"}`));
