# Radice: sitio web

## Archivos
```
server.js            Servidor (Node, sin instalar nada) con login y guardado seguros
package.json
data/data.json       Datos reales del sitio cuando usás el servidor (privado)
public/
  index.html         Estructura de la página
  styles.css         Diseño (modo oscuro y claro)
  script.js          Funcionamiento: catálogo, páginas, consultas, panel de administrador
  data.js            Datos iniciales (productos, categorías, contacto, mensajes)
  img/               Fotos de productos y galería
  uploads/           Fotos que subas desde el panel (se crea sola)
```

## Opción A: con servidor (recomendada, todo funciona)
1. Instalá Node.js 16 o superior (nodejs.org).
2. En esta carpeta ejecutá: `node server.js`
3. Abrí http://localhost:3000
4. Panel de administrador: http://localhost:3000/#a7476bef06b8a2feedcd3292
   (si el navegador no abre el panel con ese link, hacé 5 clics seguidos sobre el logo del pie de la página).
5. Para poner o resetear la contraseña: `ADMIN_PASSWORD=TuClaveSegura123 node server.js` (Windows PowerShell: `$env:ADMIN_PASSWORD="TuClaveSegura123"; node server.js`). Usá 10 o más caracteres, con letras y números.

Para publicarlo en internet, subí la carpeta a un hosting que ejecute Node (Render, Railway, un VPS, etc.) con el comando de inicio `node server.js`. Si el hosting guarda archivos de forma persistente, los cambios del panel quedan en `data/` y `public/uploads/`.
En el servidor la contraseña se verifica del lado del servidor, hay límite de intentos y las sesiones vencen a los 30 minutos.

## Opción B: sin servidor (hosting estático)
Subí solo la carpeta `public` a Netlify, GitHub Pages o similar (o abrí `index.html` con doble clic).
En Netlify con el repositorio vinculado no hace falta configurar nada: `netlify.toml` ya indica que se publica `public` sin paso de build.
El catálogo y las páginas funcionan igual, pero el panel no puede guardar para todos los visitantes:
al tocar "Guardar cambios" se guarda en tu navegador y se descarga un `data.js` nuevo; reemplazá el `data.js` de tu hosting por ese archivo (las fotos nuevas quedan dentro de ese archivo).
En este modo la contraseña solo se verifica en el navegador, así que no es una protección real: usá la Opción A si querés seguridad.

## Notas
- El botón "Consultar" copia la foto del producto al portapapeles y abre el chat: el cliente la pega junto al mensaje. Necesita que el sitio se abra desde `http://localhost` o `https://`.
- Stock: cada producto guarda un número en `stock`, listo para conectarlo a una base de datos más adelante (`/api/login` y `/api/save` de `server.js` son el punto de conexión).
