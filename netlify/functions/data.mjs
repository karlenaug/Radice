// GET /data.js: datos públicos del sitio (sin la contraseña)
import { load, pub } from '../lib/core.mjs';

export default async () => {
  const js = 'window.RADICE_DATA=' + JSON.stringify(pub(await load())).replace(/</g, '\\u003c') + ';window.RADICE_SERVER=1;';
  return new Response(js, { headers: { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' } });
};
export const config = { path: '/data.js', method: ['GET', 'HEAD'] };
