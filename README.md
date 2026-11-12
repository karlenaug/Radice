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
- Primera entrada: con la variable `ADMIN_PASSWORD` de Netlify (Site configuration → Environment variables). Después fijá tu propia contraseña desde el panel (campo "Nueva contraseña", 12 caracteres o más recomendado).
- **Recuperar el acceso:** cambiá `ADMIN_PASSWORD` en Netlify y volvé a desplegar. Esa clave siempre permite entrar, así que usá una larga y aleatoria y no la compartas.
- Seguridad: la contraseña se verifica en el servidor, hay bloqueo de 15 minutos tras 5 intentos fallidos y las sesiones vencen a las 4 horas (el panel se cierra solo tras 30 minutos sin uso). Al cambiar la contraseña se cierran todas las demás sesiones abiertas.
- Cualquiera puede abrir `/admin` y ver el formulario, pero sin la contraseña no puede guardar nada: todo lo que modifica el sitio pasa por `/api/save` y `/api/upload`, que exigen una sesión firmada por el servidor.
- **Nunca subas al repositorio** contraseñas, hashes (`ph`, `salt`) ni archivos `.env`. `data/data.json` no debe llevar `ph` ni `salt`.

## Probarlo en tu computadora
Con Node.js 20 o superior: `npm install`, `npm install -g netlify-cli` y después `netlify dev`. Abrí http://localhost:8888.

## Notas
- El botón "Consultar" copia la foto del producto al portapapeles y abre el chat: el cliente la pega junto al mensaje.
- Cada producto admite hasta 6 fotos (la 1.ª es la portada). En el panel se agregan con "+", se ordenan con ‹ › y se quitan con ×. En la web, el visor permite pasar entre fotos con flechas, miniaturas, teclado o deslizando.
- Carrito: el visitante junta productos y los envía por WhatsApp (o copia la lista para Instagram). El mensaje se edita en el panel ("Mensaje del carrito") con `{lista}`, `{total}` y `{link}`; `{link}` abre una página (`/#pedido=...`) con las fotos de todo lo elegido. No es una compra: solo arma la consulta.
- Las fotos se achican a 1000 px antes de subirse. Las que dejás de usar se borran solas al guardar.
