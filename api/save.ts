import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { verifyInitData, isAdmin } from './_telegram';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const initData = String(req.body?.initData || '');
  const payload = req.body?.data;
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

  const user = verifyInitData(initData, botToken);
  if (!user || !isAdmin(user.id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await kv.set('event-content', payload);
  return res.status(200).json({ ok: true });
}