import type { Metadata } from "next";
import { GraduationCap, Award } from "lucide-react";
import { education, certifications } from "@/content/resume";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Reveal from "@/components/Reveal";
import { Timeline, TimelineItem } from "@/components/Timeline";

export const metadata: Metadata = { title: "Education & Certifications" };

export default function EducationPage() {
  return (
    <div className="space-y-16">
      <Reveal>
        <Section title="Education" icon={GraduationCap}>
          <Timeline>
            {education.map((e, i) => (
              <TimelineItem key={i} title={e.credential} subtitle={`${e.school} · ${e.detail}`} period={e.year} />
            ))}
          </Timeline>
        </Section>
      </Reveal>

      <Reveal>
        <Section title="Certifications" icon={Award}>
          <div className="grid gap-4 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <Card key={i} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Award size={18} />
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{c.name}</span>
                  <span className="muted mt-0.5 block text-sm">{c.issuer}</span>
                  {c.note && (
                    <span className="mt-2 inline-block">
                      <Chip tone="brand">{c.note}</Chip>
                    </span>
                  )}
                </span>
              </Card>
            ))}
          </div>
        </Section>
      </Reveal>
    </div>
  );
}
