// Radice - servidor sin dependencias. Uso:  node server.js   (Node 16 o superior)
// Sirve la web (carpeta /public), entrega los datos públicos y guarda los cambios del administrador.
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = process.env.PORT || 3000, ROOT = path.join(__dirname, 'public'), DB = path.join(__dirname, 'data', 'data.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const sessions = new Map(), fails = new Map();

const load = () => JSON.parse(fs.readFileSync(DB, 'utf8'));
const write = d => { const t = DB + '.tmp'; fs.writeFileSync(t, JSON.stringify(d, null, 1)); fs.renameSync(t, DB); };
const hash = (pw, salt) => crypto.pbkdf2Sync(pw, Buffer.from(salt, 'hex'), 150000, 32, 'sha256').toString('hex');
const setPass = (d, pw) => { const s = crypto.randomBytes(16).toString('hex'); d.cfg.salt = s; d.cfg.ph = hash(pw, s); };
const same = (a, b) => { a = Buffer.from(a); b = Buffer.from(b); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const check = (d, pw) => { const c = d.cfg; if (!c.ph) return false; return same(c.salt ? hash(pw, c.salt) : crypto.createHash('sha256').update(pw).digest('hex'), c.ph); };
const pub = d => { const x = JSON.parse(JSON.stringify(d)); delete x.cfg.ph; delete x.cfg.salt; return x; };

if (process.env.ADMIN_PASSWORD) { const d = load(); setPass(d, process.env.ADMIN_PASSWORD); write(d); console.log('Contraseña de administrador actualizada.'); }

// ---- validación de lo que llega desde el panel ----
const IMG = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+\/=]+)$/, OK = /^(img|uploads)\/[\w.\-]+\.(jpe?g|png|webp|svg)$/;
const str = (s, n) => String(s ?? '').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '').slice(0, n);
function img(s) {                                   // guarda las fotos subidas como archivos
  if (OK.test(s)) return s;
  const m = IMG.exec(s || ''); if (!m) return null;
  const b = Buffer.from(m[2], 'base64'); if (b.length > 8e6) return null;
  const n = 'uploads/' + crypto.createHash('sha1').update(b).digest('hex').slice(0, 16) + '.' + (m[1] === 'jpeg' ? 'jpg' : m[1]);
  fs.mkdirSync(path.join(ROOT, 'uploads'), { recursive: true }); fs.writeFileSync(path.join(ROOT, n), b); return n;
}
function sane(x, old) {
  const c = x.cfg || {};
  return {
    updated: Date.now(),
    cfg: { wa: String(c.wa || '').replace(/\D/g, '').slice(0, 16), ig: String(c.ig || '').replace(/^@/, '').replace(/[^\w.]/g, '').slice(0, 30), ch: ['wa', 'ig', 'both'].includes(c.ch) ? c.ch : 'both', msg: str(c.msg, 600), msg2: str(c.msg2, 600), ph: old.cfg.ph, salt: old.cfg.salt },
    cats: [...new Set((x.cats || []).map(v => str(v, 40).trim()).filter(Boolean))].slice(0, 40),
    prods: (x.prods || []).slice(0, 300).map(p => ({ id: String(p.id).replace(/[^a-z0-9]/gi, '').slice(0, 20) || Date.now().toString(36), name: str(p.name, 80), cat: str(p.cat, 40), price: Math.min(Math.max(Number(p.price) || 0, 0), 1e9), desc: str(p.desc, 300), stock: (p.stock == null || p.stock === '' || isNaN(p.stock)) ? null : Math.min(Math.max(Math.floor(+p.stock), 0), 99999), img: img(p.img) || 'img/placeholder.svg' })),
    gallery: (x.gallery || []).map(img).filter(Boolean).slice(0, 30)
  };
}

const HEAD = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" };

http.createServer(async (req, res) => {
  const send = (c, b, t = 'application/json', x = {}) => { res.writeHead(c, { ...HEAD, 'Content-Type': t, ...x }); res.end(b); };
  const body = max => new Promise((ok, no) => { let n = 0; const c = []; req.on('data', d => { n += d.length; if (n > max) { no(new Error('big')); req.destroy(); } else c.push(d); }); req.on('end', () => ok(Buffer.concat(c).toString())); req.on('error', no); });
  try {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const ip = (process.env.TRUST_PROXY && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress;

    if (req.method === 'GET' && p === '/data.js')
      return send(200, 'window.RADICE_DATA=' + JSON.stringify(pub(load())).replace(/</g, '\\u003c') + ';', MIME['.js'], { 'Cache-Control': 'no-store' });

    if (req.method === 'POST' && p === '/api/login') {
      const f = fails.get(ip) || { n: 0, t: 0 };
      if (f.t > Date.now()) return send(429, '{"error":"locked"}');
      const { password } = JSON.parse(await body(1e4));
      await new Promise(r => setTimeout(r, 400 + 300 * f.n));
      const d = load();
      if (typeof password === 'string' && check(d, password)) {
        fails.delete(ip);
        if (!d.cfg.salt) { setPass(d, password); write(d); }          // actualiza contraseñas antiguas
        const tk = crypto.randomBytes(32).toString('hex'); sessions.set(tk, Date.now() + 18e5);
        return send(200, JSON.stringify({ token: tk }));
      }
      f.n++; if (f.n >= 5) { f.n = 0; f.t = Date.now() + 9e5; } fails.set(ip, f);
      return send(401, '{"error":"bad"}');
    }

    if (req.method === 'POST' && p === '/api/save') {
      const tk = (req.headers.authorization || '').replace('Bearer ', ''), ex = sessions.get(tk);
      if (!ex || ex < Date.now()) { sessions.delete(tk); return send(401, '{"error":"session"}'); }
      sessions.set(tk, Date.now() + 18e5);
      const { data, np } = JSON.parse(await body(30e6)), nd = sane(data || {}, load());
      if (np) { if (typeof np !== 'string' || np.length < 10 || !/[a-z]/i.test(np) || !/\d/.test(np)) return send(400, '{"error":"password"}'); setPass(nd, np); }
      write(nd); return send(200, '{"ok":true}');
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, '{}');
    const f = path.normalize(path.join(ROOT, p === '/' || /^\/admin\/?$/.test(p) ? 'index.html' : p));
    if (!f.startsWith(ROOT + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) return send(404, 'No encontrado', 'text/plain');
    const ext = path.extname(f).toLowerCase(); if (!MIME[ext]) return send(404, 'No encontrado', 'text/plain');
    send(200, fs.readFileSync(f), MIME[ext], { 'Cache-Control': /^\/(img|uploads)\//.test(p) ? 'public, max-age=86400' : 'no-cache' });
  } catch (e) { send(400, '{"error":"request"}'); }
}).listen(PORT, () => console.log('Radice funcionando en http://localhost:' + PORT));
