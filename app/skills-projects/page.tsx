import type { Metadata } from "next";
import { Wrench, Briefcase, FolderGit2, Trophy } from "lucide-react";
import { skills, experience, projects, achievements } from "@/content/resume";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Reveal from "@/components/Reveal";
import { Timeline, TimelineItem } from "@/components/Timeline";

export const metadata: Metadata = { title: "Skills & Projects" };

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[15px] leading-relaxed text-[var(--text-muted)]">
      {items.map((b, i) => (
        <li key={i} className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand/60">
          {b}
        </li>
      ))}
    </ul>
  );
}

export default function SkillsProjectsPage() {
  return (
    <div className="space-y-16">
      <Reveal>
        <Section title="Skills" icon={Wrench}>
          <div className="grid gap-5 sm:grid-cols-2">
            {skills.map((s) => (
              <div key={s.group} className="surface rounded-xl p-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-brand">{s.group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <Chip key={i}>{i}</Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section title="Experience" icon={Briefcase}>
          <Timeline>
            {experience.map((e) => (
              <TimelineItem
                key={e.company}
                title={`${e.role} · ${e.company}`}
                subtitle={[e.location, e.context].filter(Boolean).join(" — ")}
                period={e.period}
              >
                <Bullets items={e.bullets} />
              </TimelineItem>
            ))}
          </Timeline>
        </Section>
      </Reveal>

      <Reveal>
        <Section title="Projects" icon={FolderGit2}>
          <div className="space-y-4">
            {projects.map((p) => (
              <Card key={p.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-display text-base font-semibold">{p.name}</h3>
                  <span className="muted text-sm">{p.period}</span>
                </div>
                <div className="mt-3">
                  <Bullets items={p.bullets} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tools.map((t) => (
                    <Chip key={t} tone="brand">
                      {t}
                    </Chip>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section title="Achievements" icon={Trophy}>
          <ul className="space-y-2 text-[15px] leading-relaxed text-[var(--text-muted)]">
            {achievements.map((a, i) => (
              <li key={i} className="flex gap-2.5">
                <Trophy size={16} className="mt-1 shrink-0 text-brand" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>
    </div>
  );
}
