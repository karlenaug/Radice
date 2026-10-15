// POST /api/save: guarda los cambios del panel
import { authed, load, write, sane, setPass, goodPass, prune, json, readJson } from '../lib/core.mjs';

export default async req => {
  if (!(await authed(req))) return json(401, { error: 'session' });
  try {
    const { data, np } = await readJson(req, 5.5e6), nd = sane(data || {}, await load());
    if (np) { if (!goodPass(np)) return json(400, { error: 'password' }); setPass(nd, np); }
    await write(nd);
    await prune(nd).catch(() => {});
    return json(200, { ok: true });
  } catch (e) { return json(400, { error: 'request' }); }
};
export const config = { path: '/api/save', method: 'POST' };
