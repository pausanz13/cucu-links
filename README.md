# Cucu · Links

Landing de enlaces de Cucu, lista para Vercel.

## Estructura

- `index.html` — la página (HTML + CSS + JS en un solo archivo)
- `api/youtube.js` — función serverless que detecta si hay directo en YouTube y saca tus 3 últimos vídeos (sin API key; los Shorts se excluyen)
- `assets/` — avatar, logos de proyectos y de colaboraciones
- `vercel.json` — URLs limpias

## Publicar en Vercel

1. Crea un repo en GitHub y sube esta carpeta.
2. En vercel.com → **Add New → Project** → importa el repo.
3. Framework preset: **Other**. Sin build command. Deploy.
4. Te queda en `cucu.vercel.app` (o el nombre que esté libre; se cambia en Settings → Domains).

Alternativa sin GitHub: `npm i -g vercel` y luego `vercel` dentro de la carpeta.

## Opcional

- **ID de canal**: ya va puesto (`UCqBn0a51GwLYv8KrdPe7E6A`). Si algún día cambia, añade en Vercel → Settings → Environment Variables `YT_CHANNEL_ID`.
- **Estadísticas**: activa Vercel Analytics en el proyecto y añade `?utm_source=instagram` (o tiktok, youtube…) al enlace de cada bio para saber de dónde llegan las visitas.

## Cómo funciona el directo

`/api/youtube` mira `youtube.com/@wwecucu/live`. Si hay directo, aparece el banner rojo y la etiqueta "EN DIRECTO" en el avatar. El resultado se cachea 2 minutos en el CDN de Vercel.
