import crypto from 'crypto';

export type TgUser = { id: number; username?: string; first_name?: string };

export function verifyInitData(initData: string, botToken: string): TgUser | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (calculatedHash !== hash) return null;

  const userJson = params.get('user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as TgUser;
  } catch {
    return null;
  }
}

export function isAdmin(userId: number | undefined): boolean {
  if (!userId) return false;
  const ids = (process.env.ADMIN_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return ids.includes(String(userId));
}