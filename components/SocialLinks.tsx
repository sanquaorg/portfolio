import { Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { GithubIcon, YoutubeIcon, MediumIcon } from "@/components/BrandIcons";

const items = [
  { key: "github", label: "GitHub", href: profile.socials.github, Icon: GithubIcon },
  { key: "medium", label: "Medium", href: profile.socials.medium, Icon: MediumIcon },
  { key: "youtube", label: "YouTube", href: profile.socials.youtube, Icon: YoutubeIcon },
  { key: "email", label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
];

export default function SocialLinks({ size = 17 }: { size?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noreferrer"
          aria-label={label}
          title={label}
          className="surface flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}
