import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";
import { profile } from "@/content/profile";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-display" });

const siteUrl = "https://sanquaorg.github.io/portfolio/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.summary,
  keywords: [
    "Sanjaybalaji Prasanna",
    "Data Analyst",
    "Data Engineering",
    "PySpark",
    "SQL",
    "Databricks",
    "Azure",
    "Analytics",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — ${profile.title}`,
    description: profile.summary,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.summary,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <Nav />
        <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">{children}</main>
        <footer className="border-t border-[var(--border)]">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display font-semibold">{profile.name}</p>
              <p className="muted mt-0.5">
                © {new Date().getFullYear()} ·{" "}
                <a className="link-underline pb-0.5" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </p>
            </div>
            <SocialLinks />
          </div>
        </footer>
      </body>
    </html>
  );
}
