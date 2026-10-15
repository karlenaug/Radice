// GET /uploads/<archivo>: entrega las fotos subidas desde el panel
import { imgs, MIME } from '../lib/core.mjs';

export default async req => {
  const name = new URL(req.url).pathname.split('/').pop(), ext = name.split('.').pop();
  if (!/^[0-9a-f]{16}\.(jpg|png|webp)$/.test(name)) return new Response('No encontrado', { status: 404 });
  const b = await imgs().get(name, { type: 'arrayBuffer' });
  if (!b) return new Response('No encontrado', { status: 404 });
  return new Response(b, { headers: { 'Content-Type': MIME[ext], 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
};
export const config = { path: '/uploads/*', method: ['GET', 'HEAD'] };
