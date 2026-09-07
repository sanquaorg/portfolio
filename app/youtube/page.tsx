import type { Metadata } from "next";
import { Clapperboard, Users, ArrowUpRight, Play, Eye, CalendarDays } from "lucide-react";
import { profile } from "@/content/profile";
import type { YouTubeData } from "@/content/types";
import ytData from "@/data/youtube.json";
import Reveal from "@/components/Reveal";

const yt = ytData as YouTubeData;

export const metadata: Metadata = { title: "YouTube" };

function formatViews(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default function YouTubePage() {
  const { items, channel } = yt;
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Clapperboard size={18} />
          </span>
          <h1 className="text-2xl font-bold">
            YouTube
            <span className="mt-1 block h-0.5 w-10 rounded bg-brand" />
          </h1>
        </div>

        <div className="surface flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
          <div>
            <p className="font-medium">{channel?.title || "My channel"}</p>
            {channel?.subscribers ? (
              <p className="muted mt-0.5 flex items-center gap-1 text-sm">
                <Users size={14} /> {channel.subscribers.toLocaleString()} subscribers
              </p>
            ) : (
              <p className="muted mt-0.5 text-sm">Most popular uploads</p>
            )}
          </div>
          <a
            href={channel?.url || profile.socials.youtube}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand link-underline pb-0.5"
          >
            Visit channel <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="surface flex flex-col items-center gap-2 rounded-xl border-dashed p-10 text-center">
          <Play size={22} className="text-brand" />
          <p className="muted text-sm">
            Videos appear here after a deploy — the build fetches them from the YouTube Data API.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((v, i) => (
            <Reveal key={v.id} delay={i * 40}>
              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                className="group surface block overflow-hidden rounded-xl p-0 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-brand/5"
              >
                <span className="relative block">
                  {v.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnail} alt="" className="aspect-video w-full object-cover" />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black">
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                </span>
                <span className="block p-3.5">
                  <span className="line-clamp-2 text-sm font-medium">{v.title}</span>
                  <span className="muted mt-1.5 flex items-center gap-3 text-xs">
                    {v.views ? (
                      <span className="flex items-center gap-1">
                        <Eye size={13} /> {formatViews(v.views)}
                      </span>
                    ) : null}
                    {v.publishedAt ? (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} /> {new Date(v.publishedAt).getFullYear()}
                      </span>
                    ) : null}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
