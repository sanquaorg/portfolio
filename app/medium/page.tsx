import type { Metadata } from "next";
import { PenLine, CalendarDays, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import type { MediumData } from "@/content/types";
import mediumData from "@/data/medium.json";
import Reveal from "@/components/Reveal";
import Chip from "@/components/Chip";

const medium = mediumData as MediumData;

export const metadata: Metadata = { title: "Writing" };

export default function MediumPage() {
  const { items } = medium;
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <PenLine size={18} />
          </span>
          <h1 className="text-2xl font-bold">
            Writing
            <span className="mt-1 block h-0.5 w-10 rounded bg-brand" />
          </h1>
        </div>
        <p className="muted max-w-prose text-[15px]">
          Articles on{" "}
          <a className="text-brand link-underline pb-0.5" href={profile.socials.medium} target="_blank" rel="noreferrer">
            Medium
          </a>
          , mostly about Large Language Models and data engineering.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="surface flex flex-col items-center gap-2 rounded-xl border-dashed p-10 text-center">
          <PenLine size={22} className="text-brand" />
          <p className="muted text-sm">Articles appear here after a deploy — the build reads them from the Medium RSS feed.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((a, i) => (
            <Reveal as="li" key={a.link} delay={i * 40}>
              <a
                href={a.link}
                target="_blank"
                rel="noreferrer"
                className="group surface block rounded-xl border-l-2 border-l-brand/40 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:border-l-brand hover:shadow-lg hover:shadow-brand/5"
              >
                <h2 className="font-display text-lg font-semibold">{a.title}</h2>
                <p className="muted mt-1 flex items-center gap-1 text-sm">
                  <CalendarDays size={14} />
                  {new Date(a.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                {a.categories?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.categories.slice(0, 4).map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </div>
                )}
                {a.excerpt && <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">{a.excerpt}</p>}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                  Read on Medium
                  <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
