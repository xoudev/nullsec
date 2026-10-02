/**
 * YouTube links, as the content gives them, to what the video player needs.
 * Pure helpers with no imports: the case studies (server), the player
 * (client) and next.config.ts (the CSP) all use them.
 */

/** The privacy-enhanced player: no cookie until the visitor presses play. */
export const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";
/** Where YouTube's thumbnails come from, for a video with no poster of the
 *  site's own (next.config.ts lets the image optimizer fetch them). */
const YOUTUBE_THUMBS = "https://i.ytimg.com";

export type YouTubeVideo = {
  id: string;
  /** Seconds in, from a ?t= or ?start= in the link. */
  start?: number;
  /** A Short, filmed upright. */
  vertical?: boolean;
};

const ID = /^[A-Za-z0-9_-]{11}$/;

/** "90", "90s", "1m30s", "1h2m3s" → seconds. */
function seconds(t: string | null): number | undefined {
  if (!t) return undefined;
  const m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(t);
  if (!m) return undefined;
  const s = Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
  return s > 0 ? s : undefined;
}

/**
 * A link as YouTube hands it out (watch, youtu.be, shorts, embed or live),
 * or the bare video ID. Anything else throws: a broken link fails the build,
 * not the page.
 */
export function parseYouTube(link: string): YouTubeVideo {
  const raw = link.trim();
  if (ID.test(raw)) return { id: raw };
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Not a YouTube link: "${link}"`);
  }
  const host = url.hostname.replace(/^(www|m)\./, "");
  const [, first = "", second = ""] = url.pathname.split("/");
  let id: string | null = null;
  let vertical = false;
  if (host === "youtu.be") id = first;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (first === "watch") id = url.searchParams.get("v");
    else if (first === "shorts") {
      id = second;
      vertical = true;
    } else if (first === "embed" || first === "live") id = second;
  }
  if (!id || !ID.test(id)) throw new Error(`Not a YouTube video link: "${link}"`);
  const start = seconds(url.searchParams.get("t") ?? url.searchParams.get("start"));
  return { id, ...(start ? { start } : {}), ...(vertical ? { vertical } : {}) };
}

/**
 * The embed the player loads once play is pressed: YouTube's own controls
 * off (the site's bar drives it, through the IFrame API's postMessage
 * protocol, hence enablejsapi and origin), no related videos from other
 * channels, no annotations, inline on a phone.
 */
export function youtubeEmbedUrl(v: YouTubeVideo, origin: string, lang: string): string {
  const params = new URLSearchParams({
    enablejsapi: "1",
    origin,
    autoplay: "1",
    controls: "0",
    fs: "0",
    rel: "0",
    iv_load_policy: "3",
    playsinline: "1",
    hl: lang,
  });
  if (v.start) params.set("start", String(v.start));
  return `${YOUTUBE_ORIGIN}/embed/${v.id}?${params}`;
}

/** The video on YouTube itself: the way out without JavaScript, or when YouTube will not play it here. */
export function youtubeWatchUrl(v: YouTubeVideo): string {
  return `https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ""}`;
}

/** YouTube's still for the video: 480 × 360, the 16:9 frame letterboxed in it (the player's cover crop drops the bands). */
export function youtubeThumbnail(v: YouTubeVideo): string {
  return `${YOUTUBE_THUMBS}/vi/${v.id}/hqdefault.jpg`;
}
