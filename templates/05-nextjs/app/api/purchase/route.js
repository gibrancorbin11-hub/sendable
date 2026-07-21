import { NextResponse } from 'next/server';
import { send, SendableApiError } from 'sendableme';

// POST /api/purchase  { to, amount, item? } -> receipt email
export async function POST(req) {
  const { to, amount, item } = await req.json().catch(() => ({}));
  if (!to || !amount) return NextResponse.json({ error: 'to and amount are required' }, { status: 400 });

  try {
    // `amount` is inserted exactly as you pass it — format it like it should read
    // ("$99.00", not 99). The composer never rewrites your values.
    const msg = await send(to, 'payment_succeeded', { amount, item: item ?? 'your order' });
    return NextResponse.json({ status: msg.status, subject: msg.subject, body: msg.body });
  } catch (err) {
    if (err instanceof SendableApiError) {
      return NextResponse.json({ error: err.code, fix: err.fix }, { status: 502 });
    }
    throw err;
  }
}
