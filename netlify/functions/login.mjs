// POST /api/login: verifica la contraseña y entrega una sesión
import { load, check, newToken, getFails, setFails, json, readJson } from '../lib/core.mjs';

export default async (req, context) => {
  try {
    const ip = context.ip, f = await getFails(ip);
    if (f.t > Date.now()) return json(429, { error: 'locked' });
    const { password } = await readJson(req, 1e4);
    await new Promise(r => setTimeout(r, 400 + 300 * f.n));
    if (typeof password === 'string' && check(await load(), password)) {
      if (f.n || f.t) await setFails(ip, null);
      return json(200, { token: await newToken() });
    }
    f.n++; if (f.n >= 5) { f.n = 0; f.t = Date.now() + 9e5; } await setFails(ip, f);
    return json(401, { error: 'bad' });
  } catch (e) { return json(400, { error: 'request' }); }
};
export const config = { path: '/api/login', method: 'POST' };
