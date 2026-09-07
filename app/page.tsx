import Image from "next/image";
import profilePhoto from "@/public/photo.webp";
import { ArrowUpRight, Wrench, GraduationCap, MapPin } from "lucide-react";
import { YoutubeIcon, MediumIcon } from "@/components/BrandIcons";
import { profile } from "@/content/profile";
import { experience, certifications, skills } from "@/content/resume";
import type { MediumData } from "@/content/types";
import mediumData from "@/data/medium.json";
import Reveal from "@/components/Reveal";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import SocialLinks from "@/components/SocialLinks";

const medium = mediumData as MediumData;

const cards = [
  { href: "/youtube/", title: "YouTube", desc: "Popular videos from my channel", Icon: YoutubeIcon },
  { href: "/medium/", title: "Writing", desc: "Articles on LLMs & data on Medium", Icon: MediumIcon },
  { href: "/skills-projects/", title: "Skills & Projects", desc: "What I work with and what I've built", Icon: Wrench },
  { href: "/education/", title: "Education", desc: "Degrees and certifications", Icon: GraduationCap },
];

export default function Home() {
  const current = experience[0];
  const topSkills = ["SQL", "PySpark", "Python", "Databricks", "Apache Kafka", "Power BI"];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)]">
        <div className="hero-gradient absolute inset-0 opacity-[0.14]" aria-hidden />
        <div className="relative flex flex-col gap-7 p-7 sm:flex-row sm:items-center sm:p-10">
          <Image
            src={profilePhoto}
            alt={profile.name}
            priority
            className="h-52 w-40 shrink-0 rounded-2xl object-cover ring-2 ring-brand/40 ring-offset-4 ring-offset-[var(--bg)]"
          />
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{profile.name}</h1>
              <span className="mt-2 block h-1 w-16 rounded bg-brand" />
            </div>
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-lg text-[var(--text-muted)]">
              <span className="text-[var(--text)]">{profile.title}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={15} /> {profile.location}
              </span>
            </p>
            {current && (
              <p>
                <Chip tone="brand">Currently at {current.company}</Chip>
              </p>
            )}
            <SocialLinks />
          </div>
        </div>
      </section>

      {/* About */}
      <Reveal as="section" className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-brand">About</h2>
        <div className="space-y-4 border-l-2 border-brand/30 pl-5 text-[15px] leading-relaxed">
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {topSkills.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal as="section" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { n: "1+", l: "Years as Data Analyst" },
          { n: String(certifications.length), l: "Certifications" },
          { n: medium.items.length > 0 ? String(medium.items.length) : "—", l: "Articles published" },
          { n: String(skills.reduce((a, s) => a + s.items.length, 0)), l: "Tools & skills" },
        ].map((s) => (
          <div key={s.l} className="surface rounded-xl p-4 text-center">
            <div className="font-display text-2xl font-bold text-brand">{s.n}</div>
            <div className="muted mt-1 text-xs">{s.l}</div>
          </div>
        ))}
      </Reveal>

      {/* Explore */}
      <Reveal as="section" className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.href} href={c.href} className="group flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <c.Icon size={20} />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-1 font-medium">
                {c.title}
                <ArrowUpRight size={16} className="text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-brand" />
              </span>
              <span className="muted mt-1 block text-sm">{c.desc}</span>
            </span>
          </Card>
        ))}
      </Reveal>
    </div>
  );
}
