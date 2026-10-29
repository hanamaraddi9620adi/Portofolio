import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/content/projects";
import { ProjectArt } from "@/components/project-art";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return { title: p?.title || "Project not found", description: p?.summary };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <main id="main" className="page-shell">
      <Link className="back-link" href="/#work">
        ← Back to selected work
      </Link>
      <p className="eyebrow">{p.category} / CASE STUDY</p>
      <h1>{p.title}</h1>
      <p className="case-intro">{p.summary}</p>
      <div className="tags">
        {p.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      {(p.demo || p.video) && (
        <div className="hero-actions project-actions">
          {p.demo && (
            <a
              className="button primary"
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open live app ↗
            </a>
          )}
          {p.video && (
            <a className="button outline" href="#walkthrough">
              Watch walkthrough ↓
            </a>
          )}
        </div>
      )}
      <div className="case-banner">
        <ProjectArt kind={p.art} image={p.image} />
      </div>
      {p.video && (
        <section
          className="video-walkthrough"
          id="walkthrough"
          aria-labelledby="walkthrough-title"
        >
          <div className="walkthrough-heading">
            <div>
              <p className="eyebrow">
                PRODUCT IN PRACTICE / {p.video.duration} MIN
              </p>
              <h2 id="walkthrough-title">
                A closer look at <span className="serif">{p.title}.</span>
              </h2>
            </div>
            <a className="text-link" href={p.video.src} download>
              Download walkthrough ↓
            </a>
          </div>
          <p>{p.video.description}</p>
          <video
            controls
            playsInline
            preload="none"
            poster={p.video.poster}
            aria-label={`${p.title} project walkthrough`}
            aria-describedby="walkthrough-description"
          >
            <source src={p.video.src} type="video/mp4" />
            Your browser does not support embedded video.{" "}
            <a href={p.video.src}>Open the walkthrough video</a>.
          </video>
          <p className="video-description" id="walkthrough-description">
            Recorded product demonstration · Full audio retained · Playback
            starts when you press play.
          </p>
          {p.demoAccessNote && (
            <p className="demo-access-note">{p.demoAccessNote}</p>
          )}
        </section>
      )}
      <div className="case-grid">
        <div className="case-body">
          <section>
            <h2>The objective</h2>
            <p>{p.objective}</p>
          </section>
          <section>
            <h2>What I built</h2>
            <p>{p.built}</p>
          </section>
          <section>
            <h2>My contribution</h2>
            <p>{p.contribution}</p>
          </section>
          <section>
            <h2>Inside the implementation</h2>
            <ul>
              {p.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Results & observations</h2>
            <p>{p.results}</p>
            {p.slug === "bangalore-house-prices" && (
              <div className="metric">
                <p>LINEAR REGRESSION · COEFFICIENT OF DETERMINATION</p>
                <strong>
                  0.6323 <small>R²</small>
                </strong>
                <div className="metric-track">
                  <span />
                </div>
                <p>
                  Verified score from the supplied profile. Not an accuracy
                  percentage.
                </p>
              </div>
            )}
          </section>
          <section>
            <h2>What to keep in mind</h2>
            <p>{p.limitations}</p>
          </section>
        </div>
        <aside className="case-aside">
          <p className="eyebrow">PROJECT NOTES</p>
          <h3>Status</h3>
          <p>{p.status}</p>
          <h3>Architecture</h3>
          <div className="architecture">
            {p.architecture.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          {p.repo ? (
            <a className="button" href={p.repo} data-event="github_click">
              View source on GitHub ↗
            </a>
          ) : (
            <p>Source link not available yet.</p>
          )}
          {p.demo && (
            <a
              className="button"
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live demo ↗
            </a>
          )}
          {p.video && (
            <a className="button" href="#walkthrough">
              Watch walkthrough ↓
            </a>
          )}
          <p style={{ marginTop: 24 }}>
            {p.image
              ? "Project image captured from the supplied product recording."
              : "Technical artwork is an original conceptual illustration, not a screenshot or measured project output."}
          </p>
        </aside>
      </div>
      <Link className="text-link" href="/#contact" data-event="contact_click">
        Let’s build something useful ↗
      </Link>
    </main>
  );
}
