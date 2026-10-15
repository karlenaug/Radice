// POST /api/upload: guarda una foto del panel y devuelve su ruta (uploads/xxxx.jpg)
import { authed, saveImg, json, readJson } from '../lib/core.mjs';

export default async req => {
  if (!(await authed(req))) return json(401, { error: 'session' });
  try {
    const path = await saveImg((await readJson(req, 5.5e6)).img);
    return path ? json(200, { path }) : json(400, { error: 'image' });
  } catch (e) { return json(400, { error: 'request' }); }
};
export const config = { path: '/api/upload', method: 'POST' };
