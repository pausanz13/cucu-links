# Cucu

Web de Cucu en Vercel.

## Páginas

| URL | Archivo | Qué es |
|---|---|---|
| `/` | — | Redirige a `/links` (se cambia en `vercel.json`) |
| `/links` | `links.html` | Página de enlaces para las bios |
| `/media-kit` | `media-kit.html` | Media kit para marcas y agencias (no indexado; se comparte por enlace) |

## Funciones

- `api/youtube.js` → directo de YouTube y tus 3 últimos vídeos (sin clave).
- `api/contact.js` → formulario "Trabaja conmigo": te envía cada mensaje por email con Resend.

## Activar el formulario (una sola vez)

1. Crea una cuenta gratis en **resend.com** con `pausanz13@gmail.com`.
2. En Resend → **API Keys** → **Create API Key**. Copia la clave (empieza por `re_`).
3. En Vercel → tu proyecto → **Settings → Environment Variables**, añade:
   - `RESEND_API_KEY` = la clave que has copiado
   - `CONTACT_EMAIL` = `pausanz13@gmail.com`
4. **Deployments** → en el último, menú `⋯` → **Redeploy** (las variables solo se aplican al volver a desplegar).
5. Prueba el formulario en `/links`. El correo llega desde `onboarding@resend.dev`; pulsando "Responder" contestas directamente a la agencia.

Nota: con la dirección de pruebas de Resend solo puedes recibir en el email con el que creaste la cuenta. Si un día tienes dominio propio, verifícalo en Resend y cambia el `from` en `api/contact.js`.

## Publicar

Sube el contenido de esta carpeta a GitHub e impórtalo en Vercel (preset **Other**). Cada cambio en GitHub se publica solo.
