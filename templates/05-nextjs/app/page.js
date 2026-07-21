'use client';
import { useState } from 'react';

export default function Home() {
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState('');

  async function call(path, body, label) {
    setBusy(label);
    setOut('');
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      setOut(JSON.stringify(await res.json(), null, 2));
    } catch (e) {
      setOut('Request failed: ' + e.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '4rem auto', fontFamily: 'system-ui', padding: '0 1rem' }}>
      <h1>Sendable × Next.js</h1>
      <p>
        Lifecycle email through one function call. Set <code>SENDABLE_API_KEY</code> in{' '}
        <code>.env.local</code>, then trigger a flow:
      </p>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        <button
          disabled={!!busy}
          onClick={() => call('/api/signup', { email: 'sam@example.com', name: 'Sam', plan: 'pro' }, 'welcome')}
        >
          Welcome email
        </button>
        <button
          disabled={!!busy}
          onClick={() => call('/api/purchase', { to: 'sam@example.com', amount: '$99.00', item: 'Pro plan' }, 'receipt')}
        >
          Receipt
        </button>
        <button
          disabled={!!busy}
          onClick={() =>
            call('/api/reset-password', { to: 'sam@example.com', resetUrl: 'https://your-app.com/reset?token=demo' }, 'reset')
          }
        >
          Password reset (raw)
        </button>
      </div>
      {busy && <p>Sending {busy}…</p>}
      {out && (
        <pre style={{ background: '#111', color: '#eee', padding: '1rem', borderRadius: 8, overflowX: 'auto' }}>{out}</pre>
      )}
    </main>
  );
}
