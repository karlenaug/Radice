// Lógica compartida de las funciones de Netlify: datos en Netlify Blobs, contraseña, sesiones y validación.
import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import seed from '../../data/data.json' with { type: 'json' };

const store = name => getStore({ name, consistency: 'strong' });
export const db = () => store('radice-data');        // datos del sitio, clave secreta y bloqueos
export const imgs = () => store('radice-uploads');   // fotos subidas desde el panel

export const load = async () => (await db().get('data', { type: 'json' })) || structuredClone(seed);
export const write = d => db().setJSON('data', d);
export const pub = d => { const x = structuredClone(d); delete x.cfg.ph; delete x.cfg.salt; return x; };

// ---- contraseña ----
const hash = (pw, salt) => crypto.pbkdf2Sync(pw, Buffer.from(salt, 'hex'), 150000, 32, 'sha256').toString('hex');
const same = (a, b) => { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && crypto.timingSafeEqual(a, b); };
export const setPass = (d, pw) => { const s = crypto.randomBytes(16).toString('hex'); d.cfg.salt = s; d.cfg.ph = hash(pw, s); };
export const check = (d, pw) => {
  const env = process.env.ADMIN_PASSWORD;                       // la variable de Netlify siempre sirve para entrar (recuperación)
  if (env && same(pw, env)) return true;
  return !!(d.cfg.ph && d.cfg.salt && same(hash(pw, d.cfg.salt), d.cfg.ph));
};
export const goodPass = np => typeof np === 'string' && np.length >= 10 && /[a-z]/i.test(np) && /\d/.test(np);

// ---- sesiones firmadas (sin estado), duran 4 horas ----
async function secret() {
  const s = db(); let k = await s.get('secret');
  if (!k) { k = crypto.randomBytes(32).toString('hex'); await s.set('secret', k); }
  return k;
}
const sign = async v => crypto.createHmac('sha256', await secret()).update(v).digest('hex');
export const newToken = async () => { const exp = String(Date.now() + 4 * 3600e3); return exp + '.' + await sign(exp); };
export async function authed(req) {
  const [exp, sig] = (req.headers.get('authorization') || '').replace('Bearer ', '').split('.');
  return !!(exp && sig && +exp > Date.now() && same(sig, await sign(exp)));
}

// ---- límite de intentos de login por IP ----
const failKey = ip => 'fail-' + crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 24);
export const getFails = async ip => (await db().get(failKey(ip), { type: 'json' })) || { n: 0, t: 0 };
export const setFails = (ip, f) => f ? db().setJSON(failKey(ip), f) : db().delete(failKey(ip));

// ---- fotos ----
const IMG = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+\/=]+)$/, OK = /^(img|uploads)\/[\w.\-]+\.(jpe?g|png|webp|svg)$/;
export const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export async function saveImg(s) {
  if (OK.test(s)) return s;
  const m = IMG.exec(s || ''); if (!m) return null;
  const b = Buffer.from(m[2], 'base64'); if (b.length > 4e6) return null;
  const name = crypto.createHash('sha1').update(b).digest('hex').slice(0, 16) + '.' + (m[1] === 'jpeg' ? 'jpg' : m[1]);
  await imgs().set(name, b.buffer.slice(b.byteOffset, b.byteOffset + b.length));
  return 'uploads/' + name;
}

// ---- validación de lo que llega desde el panel ----
const str = (s, n) => String(s ?? '').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').slice(0, n);
const keep = s => OK.test(s) ? s : null;               // las fotos nuevas ya llegan subidas por /api/upload
export function sane(x, old) {
  const c = x.cfg || {};
  return {
    updated: Date.now(),
    cfg: { wa: String(c.wa || '').replace(/\D/g, '').slice(0, 16), ig: String(c.ig || '').replace(/^@/, '').replace(/[^\w.]/g, '').slice(0, 30), ch: ['wa', 'ig', 'both'].includes(c.ch) ? c.ch : 'both', msg: str(c.msg, 600), msg2: str(c.msg2, 600), ph: old.cfg.ph, salt: old.cfg.salt },
    cats: [...new Set((x.cats || []).map(v => str(v, 40).trim()).filter(Boolean))].slice(0, 40),
    prods: (x.prods || []).slice(0, 300).map(p => ({ id: String(p.id).replace(/[^a-z0-9]/gi, '').slice(0, 20) || Date.now().toString(36), name: str(p.name, 80), cat: str(p.cat, 40), price: Math.min(Math.max(Number(p.price) || 0, 0), 1e9), desc: str(p.desc, 300), stock: (p.stock == null || p.stock === '' || isNaN(p.stock)) ? null : Math.min(Math.max(Math.floor(+p.stock), 0), 99999), img: keep(p.img) || 'img/placeholder.svg' })),
    gallery: (x.gallery || []).map(keep).filter(Boolean).slice(0, 30)
  };
}

// borra las fotos subidas que ya no usa ningún producto ni la galería
export async function prune(d) {
  const used = new Set([...d.prods.map(p => p.img), ...d.gallery].filter(s => s.startsWith('uploads/')).map(s => s.slice(8)));
  const s = imgs(), { blobs } = await s.list();
  await Promise.all(blobs.filter(b => !used.has(b.key)).map(b => s.delete(b.key)));
}

export const json = (code, obj) => new Response(JSON.stringify(obj), { status: code, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
export const readJson = async (req, max) => {
  const t = await req.text(); if (t.length > max) throw new Error('big');
  return JSON.parse(t);
};
