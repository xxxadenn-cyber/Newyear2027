import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyInitData, isAdmin } from './_telegram.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const initData = String(req.body?.initData || '');
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

  const user = verifyInitData(initData, botToken);
  return res.status(200).json({ isAdmin: isAdmin(user?.id) });
}