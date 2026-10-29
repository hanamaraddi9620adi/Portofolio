import Link from "next/link";
import { ArrowDown, ArrowUpRight, Code2, MapPin, Trophy } from "lucide-react";
import { profile, skills } from "@/content/profile";
import { projects, repositoryNotes } from "@/content/projects";
import { Terrain } from "@/components/terrain";
import { ProjectArt } from "@/components/project-art";
import { PublicForm } from "@/components/forms";
import { HeroPortrait, PhotoGallery } from "@/components/portrait";
export default function Home() {
  return (
    <main id="main">
      <section className="hero hero-with-portrait">
        <div className="hero-top micro">
          <span>
            <i className="status-dot" /> OPEN TO ML & DATA INTERNSHIPS
          </span>
          <span>
            <MapPin size={12} /> BENGALURU, INDIA
          </span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">AI & DATA SCIENCE / ENGINEERING WITH INTENT</p>
          <h1>
            Turning data
            <br />
            into <span className="serif">possibility.</span>
          </h1>
          <p className="hero-description">
            I’m Hanamaraddi, an AI & Data Science undergraduate turning data,
            models, and code into useful applications.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="#work">
              Explore my work <ArrowDown size={17} />
            </Link>
            <Link className="button outline" href="/resume">
              Download resume <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-social">
            <a href={profile.linkedin} data-event="linkedin_click">
              Connect on LinkedIn <ArrowUpRight size={13} />
            </a>
            <a href={profile.github} data-event="github_click">
              <Code2 size={15} /> GitHub
            </a>
          </div>
        </div>
        <div className="hero-art">
          <Terrain />
          <span className="scene-caption micro">
            FIG. 01 — A LANDSCAPE OF POSSIBILITIES
          </span>
          <span className="scene-axis micro">INPUT → INSIGHT</span>
        </div>
        <HeroPortrait />
        <div className="hero-bottom">
          <span className="micro">STUDENT BY TITLE. BUILDER BY INSTINCT.</span>
          <a href="#work" className="micro">
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </a>
        </div>
      </section>
      <div className="credentials">
        <div>
          <Trophy size={19} />
          <span>
            <strong>DataVerse AI 2026</strong>
            <small>Winning team · PRIME</small>
          </span>
        </div>
        <div>
          <strong className="credential-number">
            9.1<span>/10</span>
          </strong>
          <span>
            BMSCE
            <br />
            <small>Current CGPA</small>
          </span>
        </div>
        <div>
          <strong className="credential-number">2029</strong>
          <span>
            BE, AI & Data Science
            <br />
            <small>Expected graduation</small>
          </span>
        </div>
      </div>
      <section className="section" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>
              Built to <span className="serif">figure things out.</span>
            </h2>
          </div>
          <p>
            Practical problems. Thoughtful experiments.
            <br />A growing body of work.
          </p>
        </div>
        <div className="projects-grid">
          {projects.slice(0, 3).map((p, i) => (
            <Link
              href={`/projects/${p.slug}`}
              key={p.slug}
              className={`project-card ${i === 0 ? "featured" : ""}`}
            >
              <ProjectArt kind={p.art} image={p.image} />
              <div className="project-info">
                <div className="micro project-category">
                  <span>
                    {String(i + 1).padStart(2, "0")} / {p.category}
                  </span>
                  <ArrowUpRight size={22} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <div className="tags">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="more-projects">
          {projects.slice(3).map((p) => (
            <Link href={`/projects/${p.slug}`} key={p.slug}>
              <span className="micro">{p.category}</span>
              <h3>{p.title}</h3>
              <span>
                {p.status} <ArrowUpRight size={18} />
              </span>
            </Link>
          ))}
        </div>
        <details className="repo-exploration">
          <summary>
            More explorations on GitHub{" "}
            <span>
              {String(repositoryNotes.length).padStart(2, "0")} repositories ↗
            </span>
          </summary>
          <div className="repo-list">
            {repositoryNotes.map((r) => (
              <a href={r.repo} key={r.name} data-event="github_click">
                <strong>{r.name} ↗</strong>
                <p>{r.text}</p>
              </a>
            ))}
          </div>
        </details>
      </section>
      <section className="section about" id="about">
        <div>
          <p className="eyebrow">02 / THE PERSON BEHIND THE PROJECTS</p>
          <PhotoGallery />
        </div>
        <div>
          <h2>
            Curiosity is the start.
            <br />
            <span className="serif">Building is the answer.</span>
          </h2>
          <p className="large-copy">
            I like the point where an idea becomes something you can actually
            use.
          </p>
          <p>
            I’m pursuing Artificial Intelligence and Data Science at BMS College
            of Engineering, Bengaluru. My work spans predictive analytics,
            financial research tools, backend systems and AI-powered
            applications.
          </p>
          <p>
            I learn by preparing data, questioning results, connecting systems
            and iterating. Right now, I’m looking for Machine Learning and Data
            Analysis internships where I can contribute and keep growing.
          </p>
          <a className="text-link" href="#contact" data-event="contact_click">
            Have an opportunity in mind? <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
      <section className="section" id="expertise">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / MY TOOLKIT</p>
            <h2>
              From exploration
              <br />
              to <span className="serif">implementation.</span>
            </h2>
          </div>
          <p>
            Tools I’ve used and concepts I’m developing.
            <br />
            Always a work in progress.
          </p>
        </div>
        <div className="skill-grid">
          {skills.map((s) => (
            <article key={s.title}>
              <span className="micro accent">{s.label}</span>
              <h3>{s.title}</h3>
              <div className="tags">
                {s.items.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section education">
        <div>
          <p className="eyebrow">04 / FOUNDATIONS & MILESTONES</p>
          <h2>
            Learning with
            <br />
            <span className="serif">momentum.</span>
          </h2>
          <div className="achievement">
            <Trophy />
            <p>
              <strong>DataVerse AI Datathon 2026</strong>
              <br />
              Winning Team PRIME
            </p>
          </div>
          <div className="achievement">
            <span className="rank">3256</span>
            <p>KCET Engineering Rank</p>
          </div>
        </div>
        <div className="timeline">
          <article>
            <span className="micro">2025 — 2029</span>
            <h3>BMS College of Engineering</h3>
            <p>BE · Artificial Intelligence and Data Science</p>
            <strong className="accent">9.1 / 10 CGPA</strong>
          </article>
          <article>
            <span className="micro">PRE-UNIVERSITY</span>
            <h3>Vidyaniketan PU College, Hubballi</h3>
            <p>Science · 577 / 600 marks</p>
            <strong>96.16%</strong>
          </article>
          <article>
            <span className="micro">SECONDARY SCHOOL</span>
            <h3>SSLC</h3>
            <p>615 / 625 marks</p>
            <strong>98.4%</strong>
          </article>
        </div>
      </section>
      <section className="section experiences">
        <p className="eyebrow">05 / LEARNING OUTSIDE THE CLASSROOM</p>
        <div className="experience-row">
          <span className="micro">21–25 SEP 2026</span>
          <h3>Java Full Stack Skill Lab</h3>
          <p>BMSCE · Angular, Spring Boot, REST APIs, MySQL and Tomcat.</p>
        </div>
        <div className="experience-row">
          <span className="micro">HACKATHON</span>
          <h3>AMD Developer Hackathon: ACT II</h3>
          <p>NAVIA · Team project exploring AI-assisted financial analysis.</p>
        </div>
        <div className="experience-row">
          <span className="micro">24 HOURS</span>
          <h3>Zynex Hackathon</h3>
          <p>PhishShield AI · Project development and team presentation.</p>
        </div>
      </section>
      <section className="section contact" id="contact">
        <div>
          <p className="eyebrow">06 / LET’S CONNECT</p>
          <h2>
            Good things start
            <br />
            with a <span className="serif">conversation.</span>
          </h2>
          <p>
            Have an ML internship, a data problem, or an idea worth exploring?
            I’d love to hear about it.
          </p>
          <a
            className="email-link"
            href={`mailto:${profile.email}`}
            data-event="contact_click"
          >
            {profile.email} <ArrowUpRight size={17} />
          </a>
          <div className="hero-social">
            <a href={profile.linkedin} data-event="linkedin_click">
              LinkedIn ↗
            </a>
            <a href={profile.github} data-event="github_click">
              GitHub ↗
            </a>
          </div>
          <span className="micro">
            <i className="status-dot" /> BASED IN BENGALURU · OPEN TO
            OPPORTUNITIES
          </span>
        </div>
        <PublicForm />
      </section>
    </main>
  );
}
