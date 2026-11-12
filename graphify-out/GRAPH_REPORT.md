# Graph Report - Radice  (2026-11-12)

## Corpus Check
- Corpus is ~3,537 words - fits in a single context window. You may not need a graph.

## Summary
- 155 nodes · 329 edges · 15 communities
- Extraction: 93% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 120,428 input · 5,000 output

## Community Hubs (Navigation)
- Catálogo y carrito (vista)
- Documentación y arquitectura
- Estado del carrito
- Rutas y sesión del admin
- Dependencias npm
- Edición de fotos en el panel
- Validación de datos (servidor)
- Login y subida de fotos
- Fotos en Netlify Blobs
- Sesiones firmadas y contraseña
- Guardado y cambio de clave
- Bloqueo de intentos
- Limpieza de datos (cliente)
- Datos públicos /data.js
- Imagen placeholder

## God Nodes (most connected - your core abstractions)
1. `Radice: sitio web (README)` - 12 edges
2. `toast()` - 11 edges
3. `pf()` - 11 edges
4. `route()` - 11 edges
5. `esc()` - 10 edges
6. `cdraw()` - 9 edges
7. `draw()` - 9 edges
8. `db()` - 8 edges
9. `fm()` - 8 edges
10. `lb()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `public/data.js` --semantically_similar_to--> `data/data.json initial data`  [AMBIGUOUS] [semantically similar]
  public/index.html → README.md
- `/admin/ path normalization script` --conceptually_related_to--> `Panel de administrador (/admin)`  [INFERRED]
  public/index.html → README.md
- `Radice: sitio web (README)` --references--> `public/styles.css`  [EXTRACTED]
  README.md → public/index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Admin write protection flow** — readme_panel_de_administrador, readme_api_save, readme_api_upload, readme_signed_session, readme_netlify_lib_core [INFERRED 0.85]
- **Index page bootstrap assets** — public_index, public_styles, public_data, public_script, public_index_app_root [EXTRACTED 1.00]

## Communities (15 total, 0 thin omitted)

### Community 0 - "Catálogo y carrito (vista)"
Cohesion: 0.16
Nodes (25): ask(), base(), btns(), card(), CART, cdraw(), clink(), clist() (+17 more)

### Community 1 - "Documentación y arquitectura"
Cohesion: 0.15
Nodes (19): public/data.js, /admin/ path normalization script, #app root container, Cormorant Garamond + Jost fonts, public/styles.css, ADMIN_PASSWORD env variable, /api/save endpoint, /api/upload endpoint (+11 more)

### Community 2 - "Estado del carrito"
Cohesion: 0.14
Nodes (14): A, cadd(), cartUI(), cclear(), ccount(), cq(), csave(), F (+6 more)

### Community 3 - "Rutas y sesión del admin"
Cohesion: 0.19
Nodes (15): ADM(), cclose(), clone(), fc(), go(), home(), IA(), login() (+7 more)

### Community 4 - "Dependencias npm"
Cohesion: 0.18
Nodes (11): dependencies, @netlify/blobs@^11.1.4, engines, node, name, private, scripts, dev (+3 more)

### Community 5 - "Edición de fotos en el panel"
Cohesion: 0.24
Nodes (12): addg(), addp(), cig(), cpm(), draw(), isPH(), mv(), pick() (+4 more)

### Community 6 - "Validación de datos (servidor)"
Cohesion: 0.33
Nodes (4): keep(), pics(), sane(), stand()

### Community 7 - "Login y subida de fotos"
Cohesion: 0.33
Nodes (5): config, config, json(), readJson(), saveImg()

### Community 8 - "Fotos en Netlify Blobs"
Cohesion: 0.33
Nodes (5): config, imgs(), MIME, prune(), store()

### Community 9 - "Sesiones firmadas y contraseña"
Cohesion: 0.33
Nodes (6): authed(), check(), newToken(), same(), secret(), sign()

### Community 10 - "Guardado y cambio de clave"
Cohesion: 0.40
Nodes (4): config, goodPass(), rotateSecret(), setPass()

### Community 11 - "Bloqueo de intentos"
Cohesion: 0.50
Nodes (5): db(), failKey(), getFails(), setFails(), write()

### Community 12 - "Limpieza de datos (cliente)"
Cohesion: 0.50
Nodes (5): clean(), HG(), PI(), ST(), T()

### Community 13 - "Datos públicos /data.js"
Cohesion: 0.50
Nodes (3): config, load(), pub()

### Community 14 - "Imagen placeholder"
Cohesion: 0.67
Nodes (3): placeholder.svg (product image fallback), Solid kraft-tan rectangle (#c79a5b, 4:5 aspect), Product image fallback

## Ambiguous Edges - Review These
- `data/data.json initial data` → `public/data.js`  [AMBIGUOUS]
  public/index.html · relation: semantically_similar_to

## Knowledge Gaps
- **6 isolated node(s):** `ADMIN_PASSWORD env variable`, `Product photos (up to 6, resized to 1000px, viewer)`, `Local testing with netlify dev`, `Cormorant Garamond + Jost fonts`, `Solid kraft-tan rectangle (#c79a5b, 4:5 aspect)` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 31 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Radice: sitio web (README)` connect `Documentación y arquitectura` to `Estado del carrito`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `ADMIN_PASSWORD env variable`, `Product photos (up to 6, resized to 1000px, viewer)`, `Local testing with netlify dev` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Estado del carrito` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._
- **Why does `@netlify/blobs` connect `Dependencias npm` to `Validación de datos (servidor)`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Panel de administrador (/admin)` connect `Documentación y arquitectura` to `Estado del carrito`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `data/data.json initial data` and `public/data.js`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._