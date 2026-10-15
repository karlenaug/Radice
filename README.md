# Radice: sitio web

## Archivos
```
public/                  La web (lo que ven los visitantes)
  index.html             Estructura de la página
  styles.css             Diseño (modo oscuro y claro)
  script.js              Catálogo, páginas, consultas y panel de administrador
  img/placeholder.svg    Imagen para productos sin foto
netlify/functions/       Funciones de Netlify: datos, login, guardado y fotos
netlify/lib/core.mjs     Lógica compartida (contraseña, sesiones, validación)
data/data.json           Datos iniciales (se usan solo hasta el primer guardado)
netlify.toml             Configuración de Netlify
```

## Cómo funciona en Netlify
- Los datos (productos, categorías, galería, contacto) y las fotos que subís se guardan en **Netlify Blobs**.
- Al tocar "Guardar cambios" en el panel, los cambios quedan publicados al instante para todos. No hace falta subir nada a GitHub.
- Los cambios en el código (diseño, textos fijos) sí se publican haciendo push a GitHub.

## Panel de administrador
- Entrá a `https://tu-sitio.netlify.app/admin` (o 5 clics sobre el logo del pie).
- Contraseña inicial: la que te pasaron al configurar el sitio. Cambiala desde el panel (campo "Nueva contraseña", 10 o más caracteres con letras y números).
- **Recuperar el acceso:** en Netlify, Site configuration → Environment variables, creá `ADMIN_PASSWORD` con la clave que quieras y volvé a desplegar. Esa clave siempre permite entrar.
- Seguridad: la contraseña se verifica en el servidor, hay bloqueo de 15 minutos tras 5 intentos fallidos y las sesiones vencen a las 4 horas (el panel se cierra solo tras 30 minutos sin uso).

## Probarlo en tu computadora
Con Node.js 20 o superior: `npm install`, `npm install -g netlify-cli` y después `netlify dev`. Abrí http://localhost:8888.

## Notas
- El botón "Consultar" copia la foto del producto al portapapeles y abre el chat: el cliente la pega junto al mensaje.
- Las fotos se achican a 1000 px antes de subirse. Las que dejás de usar se borran solas al guardar.
