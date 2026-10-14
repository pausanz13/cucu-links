// Vercel Serverless Function — /api/youtube
// Devuelve { live, liveUrl, videos: [{ id, title, url, thumb, published }] }
// Sin API key: lee la página /live del canal y el feed RSS público.

const HANDLE = "wwecucu";
const CHANNEL_ID = process.env.YT_CHANNEL_ID || "UCqBn0a51GwLYv8KrdPe7E6A";
const UA = { "User-Agent": "Mozilla/5.0 (cucu-links)", "Accept-Language": "es-ES,es;q=0.9" };

const decode = (t = "") =>
  t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function getLive() {
  const html = await (await fetch(`https://www.youtube.com/@${HANDLE}/live`, { headers: UA })).text();
  const isLive = /"isLiveNow":true/.test(html) || /"style":"LIVE"/.test(html);
  const vid = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/);
  return isLive && vid ? `https://www.youtube.com/watch?v=${vid[1]}` : null;
}

async function getVideos(limit = 3) {
  const xml = await (await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { headers: UA })).text();
  return xml.split("<entry>").slice(1).map((entry) => {
    const pick = (re) => (entry.match(re) || [])[1];
    const id = pick(/<yt:videoId>([\w-]{11})<\/yt:videoId>/);
    const link = pick(/<link rel="alternate" href="([^"]+)"/) || "";
    return {
      id,
      title: decode(pick(/<title>([\s\S]*?)<\/title>/)),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published: pick(/<published>(.*?)<\/published>/),
      short: link.includes("/shorts/"),
    };
  })
  // Fuera los Shorts: en vertical quedan mal en miniaturas 16:9
  .filter((v) => v.id && !v.short)
  .slice(0, limit);
}

export default async function handler(req, res) {
  const out = { live: false, liveUrl: null, videos: [] };
  const [live, videos] = await Promise.allSettled([getLive(), getVideos(3)]);
  if (live.status === "fulfilled" && live.value) { out.live = true; out.liveUrl = live.value; }
  if (videos.status === "fulfilled") out.videos = videos.value;
  // Caché en el CDN de Vercel: 2 min, y sirve la versión anterior mientras refresca
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
  res.status(200).json(out);
}
