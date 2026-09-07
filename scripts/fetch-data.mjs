// Build-time data fetch. Runs before `next dev` and `next build`.
// - Medium: public RSS feed, no key needed.
// - YouTube: Data API v3, needs YOUTUBE_API_KEY. Falls back to existing JSON on failure.
//
// Output: data/medium.json, data/youtube.json

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME || "prasannasanjay1";
const YOUTUBE_HANDLE = process.env.YOUTUBE_HANDLE || "Mining2003";
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";
const MAX_VIDEOS = 9;
const MAX_ARTICLES = 12;

async function keepExisting(file, label) {
  try {
    const cur = JSON.parse(await readFile(join(dataDir, file), "utf8"));
    console.warn(`! ${label}: keeping existing ${file} (${Array.isArray(cur.items) ? cur.items.length : 0} items)`);
    return cur;
  } catch {
    console.warn(`! ${label}: no existing ${file}, writing empty`);
    return { fetchedAt: null, items: [] };
  }
}

function decode(s = "") {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1].trim()) : "";
}

async function fetchMedium() {
  const url = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 portfolio-build" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    const parsed = items.slice(0, MAX_ARTICLES).map((block) => {
      const html = tag(block, "content:encoded");
      const imgMatch = html.match(/<img[^>]+src="([^"]+)"/i);
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return {
        title: tag(block, "title"),
        link: (tag(block, "link") || "").split("?")[0],
        publishedAt: new Date(tag(block, "pubDate") || Date.now()).toISOString(),
        categories: [...block.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((c) => decode(c[1].trim())),
        image: imgMatch ? imgMatch[1] : null,
        excerpt: text.slice(0, 220) + (text.length > 220 ? "…" : ""),
      };
    });
    if (parsed.length === 0) throw new Error("no items in feed");
    console.log(`✓ Medium: ${parsed.length} articles`);
    return { fetchedAt: new Date().toISOString(), items: parsed };
  } catch (e) {
    console.warn(`! Medium fetch failed: ${e.message}`);
    return keepExisting("medium.json", "Medium");
  }
}

async function ytApi(path) {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/${path}&key=${YOUTUBE_API_KEY}`);
  if (!res.ok) throw new Error(`YouTube API HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function fetchYouTube() {
  if (!YOUTUBE_API_KEY) {
    console.warn("! YOUTUBE_API_KEY not set — skipping YouTube fetch");
    return keepExisting("youtube.json", "YouTube");
  }
  try {
    // 1. resolve channel from handle
    const ch = await ytApi(`channels?part=snippet,statistics,contentDetails&forHandle=${YOUTUBE_HANDLE}`);
    const channel = ch.items?.[0];
    if (!channel) throw new Error(`channel @${YOUTUBE_HANDLE} not found`);
    const channelId = channel.id;

    // 2. most popular uploads
    const search = await ytApi(
      `search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=${MAX_VIDEOS}`
    );
    const ids = (search.items || []).map((i) => i.id.videoId).filter(Boolean);
    let stats = {};
    if (ids.length) {
      const v = await ytApi(`videos?part=snippet,statistics&id=${ids.join(",")}`);
      for (const it of v.items || []) stats[it.id] = it;
    }
    const items = ids.map((id) => {
      const it = stats[id] || {};
      const sn = it.snippet || {};
      const th = sn.thumbnails || {};
      return {
        id,
        title: sn.title || "",
        publishedAt: sn.publishedAt || null,
        thumbnail: (th.maxres || th.high || th.medium || th.default || {}).url || null,
        views: Number(it.statistics?.viewCount || 0),
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    });
    console.log(`✓ YouTube: ${items.length} videos from @${YOUTUBE_HANDLE}`);
    return {
      fetchedAt: new Date().toISOString(),
      channel: {
        id: channelId,
        title: channel.snippet?.title || YOUTUBE_HANDLE,
        url: `https://www.youtube.com/channel/${channelId}`,
        subscribers: Number(channel.statistics?.subscriberCount || 0),
        thumbnail: channel.snippet?.thumbnails?.high?.url || null,
      },
      items,
    };
  } catch (e) {
    console.warn(`! YouTube fetch failed: ${e.message}`);
    return keepExisting("youtube.json", "YouTube");
  }
}

async function main() {
  await mkdir(dataDir, { recursive: true });
  const [medium, youtube] = await Promise.all([fetchMedium(), fetchYouTube()]);
  await writeFile(join(dataDir, "medium.json"), JSON.stringify(medium, null, 2) + "\n");
  await writeFile(join(dataDir, "youtube.json"), JSON.stringify(youtube, null, 2) + "\n");
  console.log("Data written to data/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
