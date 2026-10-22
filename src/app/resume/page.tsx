import { existsSync } from "node:fs";
import path from "node:path";
import { profile } from "@/content/profile";
export const metadata = { title: "Resume" };
export default function Resume() {
  const available = existsSync(
    path.join(
      process.cwd(),
      "public",
      "resume",
      "hanamaraddi-kanakannavar.pdf",
    ),
  );
  return (
    <main id="main" className="page-shell">
      <p className="eyebrow">EXPERIENCE, EDUCATION & PROJECTS</p>
      <h1>
        A closer look at
        <br />
        <span className="serif">my journey.</span>
      </h1>
      <p className="case-intro">
        AI & Data Science undergraduate · BMS College of Engineering · 2025–2029
      </p>
      {available ? (
        <>
          <a
            className="button primary"
            href="/resume/hanamaraddi-kanakannavar.pdf"
            download
            data-event="resume_download"
          >
            Download resume PDF ↓
          </a>
          <div style={{ marginTop: 30 }}>
            <iframe
              className="resume-frame"
              title="Hanamaraddi Kanakannavar resume"
              src="/resume/hanamaraddi-kanakannavar.pdf"
            />
          </div>
        </>
      ) : (
        <div className="notice">
          <h2 style={{ fontSize: 25 }}>Resume PDF coming soon</h2>
          <p>
            The downloadable resume has not been added yet. You can request the
            latest copy directly.
          </p>
          <a
            className="button"
            href={`mailto:${profile.email}?subject=Resume%20request`}
            data-event="contact_click"
          >
            Request my resume ↗
          </a>
        </div>
      )}
      <h2 style={{ fontSize: 28, marginTop: 40 }}>At a glance</h2>
      <p>
        Bengaluru, Karnataka, India · CGPA 9.1/10 · DataVerse AI Datathon 2026
        winning team.
      </p>
      <a
        className="text-link"
        href={profile.linkedin}
        data-event="linkedin_click"
      >
        Connect on LinkedIn ↗
      </a>
    </main>
  );
}
