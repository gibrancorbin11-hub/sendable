import { NextResponse } from 'next/server';
import { identify, send, SendableApiError } from 'sendableme';

// POST /api/signup  { email, name, plan? } -> welcome email
export async function POST(req) {
  const { email, name, plan = 'free' } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 });

  const userId = `user_${Date.now()}`;
  try {
    // Tell Sendable who this user is, once. Afterwards you can send by id.
    await identify(userId, { email, name, plan });

    // Describe the event. Sendable writes the copy around your data.
    const msg = await send(userId, 'account_created', { plan });

    return NextResponse.json({ userId, status: msg.status, subject: msg.subject, body: msg.body });
  } catch (err) {
    // The signup succeeded — never fail it because mail did. Sendable errors
    // carry a machine-readable `fix`.
    if (err instanceof SendableApiError) {
      return NextResponse.json({ userId, emailStatus: 'failed', reason: err.code, fix: err.fix });
    }
    throw err;
  }
}
