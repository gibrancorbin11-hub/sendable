#!/usr/bin/env node
/**
 * Sendable MCP server.
 *
 * Lets an agent send real transactional email from the editor. The whole
 * premise of Sendable is that a model can integrate it first try; MCP removes
 * the integration step entirely and lets the model just do it.
 *
 * Run:  SENDABLE_API_KEY=sk_live_... npx sendableme-mcp
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Sendable, SendableApiError } from 'sendableme';

const API_KEY = process.env.SENDABLE_API_KEY;
const BASE_URL = process.env.SENDABLE_BASE_URL ?? 'https://www.sendable.me';

/*
 * The client is built lazily, on the first tool call, not at startup. That lets
 * the server start and answer tools/list with no key set — which is how MCP
 * clients (and directory crawlers like Glama) introspect a server before it is
 * configured. The key is only required to actually send.
 */
let client: Sendable | null = null;
function getClient(): Sendable {
  if (!API_KEY) {
    throw new SendableApiError(
      'missing_api_key',
      'SENDABLE_API_KEY is not set.',
      'Get a free key at https://www.sendable.me/keys and add it to this server\'s env in your MCP client config.',
      'https://www.sendable.me/keys',
    );
  }
  return (client ??= new Sendable({ apiKey: API_KEY, baseUrl: BASE_URL }));
}

/**
 * A test key composes normally and delivers nothing. Surfacing that in every
 * result stops an agent reporting "email sent" when nothing left the building.
 */
const modeNote =
  API_KEY?.startsWith('sk_test_')
    ? '\n\n(test mode: composed but NOT delivered — use a sk_live_ key to actually send)'
    : '';

const server = new Server(
  { name: 'sendableme', version: '1.0.3' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'send',
      description:
        'Send a transactional email. You describe what happened; Sendable writes the copy and sends it. ' +
        'Data values are inserted verbatim and never rewritten — format them exactly as they should read ' +
        '(e.g. "$99.00", not 99). Use this for anything a user could reasonably want to unsubscribe from.',
      inputSchema: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'Email address, or a user id previously passed to identify.',
          },
          event: {
            type: 'string',
            description:
              'What happened, snake_case past tense: order_shipped, trial_ending, invite_accepted. ' +
              'Free-form — there is no list to register against.',
          },
          data: {
            type: 'object',
            description:
              'Flat key/value pairs. Strings, numbers, booleans only — never nested objects or arrays.',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
          },
        },
        required: ['to', 'event'],
      },
    },
    {
      name: 'send_raw',
      description:
        'Send an email with exact copy you supply, skipping composition. Use for password resets, ' +
        'receipts, and security alerts where wording and links must be exact. Unlike send, this ' +
        'bypasses the unsubscribe list, so a user who opted out can still get back into their account. ' +
        'Do not use it to route marketing mail around unsubscribes.',
      inputSchema: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Email address or identified user id.' },
          subject: { type: 'string' },
          body: { type: 'string', description: 'Plain text. Links are sent exactly as written.' },
        },
        required: ['to', 'subject', 'body'],
      },
    },
    {
      name: 'identify',
      description:
        'Associate a user id with an email address so you can send by id afterwards. ' +
        'Traits are merged, not replaced, so partial updates are safe.',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          email: { type: 'string' },
          traits: {
            type: 'object',
            description: 'Optional extra fields. Flat values only.',
            additionalProperties: { type: ['string', 'number', 'boolean'] },
          },
        },
        required: ['userId'],
      },
    },
  ],
}));

const ok = (text: string) => ({ content: [{ type: 'text' as const, text }] });
const err = (text: string) => ({ content: [{ type: 'text' as const, text }], isError: true });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const args = (req.params.arguments ?? {}) as Record<string, any>;
  try {
    switch (req.params.name) {
      case 'send': {
        const r = await getClient().send(args.to, args.event, args.data ?? {});
        if (r.status === 'suppressed') {
          return ok(
            `Not sent — ${args.to} unsubscribed or previously bounced. This is not an error and ` +
              `cost nothing. Sendable will keep skipping this address.`,
          );
        }
        return ok(
          `Sent to ${r.to}\n\nSubject: ${r.subject}\n\n${r.body}${modeNote}`,
        );
      }
      case 'send_raw': {
        const r = await getClient().sendRaw(args.to, args.subject, args.body);
        return ok(`Sent to ${r.to}\n\nSubject: ${r.subject}\n\n${r.body}${modeNote}`);
      }
      case 'identify': {
        const r = await getClient().identify(args.userId, {
          email: args.email,
          ...(args.traits ?? {}),
        });
        return ok(`Identified ${r.userId}${r.email ? ` as ${r.email}` : ''}.`);
      }
      default:
        return err(`Unknown tool: ${req.params.name}`);
    }
  } catch (e) {
    /*
     * Sendable's errors carry a machine-readable `fix`. Passing it straight
     * through is the point — the agent can correct itself without a human
     * reading docs.
     */
    if (e instanceof SendableApiError) {
      return err(`${e.code}: ${e.message}\n\nHow to fix: ${e.fix}`);
    }
    return err(`Unexpected error: ${(e as Error).message}`);
  }
});

await server.connect(new StdioServerTransport());
console.error(`sendableme MCP server ready (${API_KEY ? (API_KEY.startsWith("sk_test_") ? "test" : "live") : "no key — introspection only"}, ${BASE_URL})`);
