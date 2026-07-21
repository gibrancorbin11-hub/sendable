import { NextResponse } from 'next/server';
import { sendRaw, SendableApiError } from 'sendableme';

// POST /api/reset-password  { to, resetUrl } -> exact-copy reset email
export async function POST(req) {
  const { to, resetUrl } = await req.json().catch(() => ({}));
  if (!to || !resetUrl) return NextResponse.json({ error: 'to and resetUrl are required' }, { status: 400 });

  try {
    // Password resets must be byte-exact AND must reach the user even if they
    // unsubscribed from marketing. sendRaw skips composition and the suppression
    // list — use it for resets, receipts, and security alerts, never marketing.
    const msg = await sendRaw(
      to,
      'Reset your password',
      `Someone requested a password reset for your account.\n\n` +
        `Reset it here (link expires in 1 hour):\n${resetUrl}\n\n` +
        `If this wasn't you, you can safely ignore this email.`,
    );
    return NextResponse.json({ status: msg.status });
  } catch (err) {
    if (err instanceof SendableApiError) {
      return NextResponse.json({ error: err.code, fix: err.fix }, { status: 502 });
    }
    throw err;
  }
}
