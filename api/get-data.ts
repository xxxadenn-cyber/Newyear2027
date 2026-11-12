import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await kv.get('event-content');
    return res.status(200).json(data || null);
  } catch {
    return res.status(200).json(null);
  }
}