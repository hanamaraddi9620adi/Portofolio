import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/manrope/latin-500.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { profile } from "@/content/profile";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Hanamaraddi Kanakannavar — AI & Data Science",
    template: "%s — Hanamaraddi Kanakannavar",
  },
  description:
    "AI & Data Science undergraduate at BMSCE, Bengaluru. Building practical machine learning, data analysis and software projects.",
  openGraph: {
    title: "Hanamaraddi Kanakannavar",
    description: "Turning data, models, and code into useful applications.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.webmanifest",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <footer className="footer">
          <div>
            <Link className="brand" href="/">
              hk<span>.</span>
            </Link>
            <p>Curiosity → code → something useful.</p>
          </div>
          <div className="footer-links">
            <a href={profile.github} data-event="github_click">
              GitHub ↗
            </a>
            <a href={profile.linkedin} data-event="linkedin_click">
              LinkedIn ↗
            </a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/guestbook">Leave a visit</Link>
            <Link href="/admin/analytics">Owner dashboard</Link>
          </div>
          <span className="micro">
            © {new Date().getFullYear()} HANAMARADDI K.
          </span>
        </footer>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
