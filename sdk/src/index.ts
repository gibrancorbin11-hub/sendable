/**
 * Sendable — one line, and your app knows how to talk to its users.
 *
 *   import { send, identify } from 'sendableme';
 *   await send('sam@example.com', 'order_shipped', { orderId: 'A12', eta: 'Friday' });
 */

export interface SendableOptions {
  apiKey?: string;
  baseUrl?: string;
}

export interface SendResult {
  id: string;
  status: 'sent' | 'suppressed';
  to?: string;
  subject?: string;
  body?: string;
  reason?: string;
}

export class SendableApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly fix: string,
    readonly docs: string,
    /** Seconds to wait before retrying. Present on rate_limited, else null. */
    readonly retryAfter: number | null = null,
  ) {
    super(`${message}\n\nHow to fix: ${fix}\n${docs}`);
    this.name = 'SendableApiError';
  }
}

type Data = Record<string, string | number | boolean>;

export class Sendable {
  private apiKey: string;
  private baseUrl: string;

  constructor(opts: SendableOptions = {}) {
    const key = opts.apiKey ?? process.env.SENDABLE_API_KEY;
    if (!key)
      throw new Error(
        'No Sendable API key. Set SENDABLE_API_KEY in your environment, or pass { apiKey } to the constructor. Get a key at https://www.sendable.me/keys',
      );
    this.apiKey = key;
    this.baseUrl = opts.baseUrl ?? process.env.SENDABLE_BASE_URL ?? 'https://www.sendable.me';
  }

  /**
   * Send a message. `to` is either an email address or a user id you previously
   * passed to identify(). `event` describes what happened — Sendable writes the copy.
   */
  async send(to: string, event: string, data: Data = {}): Promise<SendResult> {
    return this.post('/v1/send', { to, event, data });
  }

  /** Send copy you wrote yourself, bypassing composition entirely. */
  async sendRaw(to: string, subject: string, body: string): Promise<SendResult> {
    return this.post('/v1/send', { to, compose: false, subject, body });
  }

  /** Tell Sendable who a user is, so you can send to them by id afterwards. */
  async identify(userId: string, traits: { email?: string; phone?: string } & Data = {}) {
    const { email, phone, ...rest } = traits;
    return this.post('/v1/identify', { userId, email, phone, traits: rest });
  }

  private async post(path: string, body: unknown): Promise<any> {
    const res = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = json?.error ?? {};
      const header = res.headers.get('retry-after');
      throw new SendableApiError(
        e.code ?? 'unknown',
        e.message ?? `Request failed with status ${res.status}`,
        e.fix ?? 'Check https://www.sendable.me/errors',
        e.docs ?? 'https://www.sendable.me/errors',
        header ? Number(header) || null : null,
      );
    }
    return json;
  }
}

/* Module-level convenience: the zero-config path most integrations use. */

let shared: Sendable | null = null;
const client = () => (shared ??= new Sendable());

export const send = (to: string, event: string, data?: Data) => client().send(to, event, data);
export const sendRaw = (to: string, subject: string, body: string) =>
  client().sendRaw(to, subject, body);
export const identify = (userId: string, traits?: { email?: string; phone?: string } & Data) =>
  client().identify(userId, traits);
