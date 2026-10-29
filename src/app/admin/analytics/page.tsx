import Link from "next/link";
import { redirect } from "next/navigation";
import { owner } from "@/lib/server";
import { analyticsData, counts, RecordRow } from "@/lib/analytics";
import { dateRange } from "@/lib/validation";
import { ViewsChart } from "@/components/views-chart";
import { Logout } from "@/components/login";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private analytics",
  robots: { index: false, follow: false },
};
function CountTable({
  title,
  rows,
}: {
  title: string;
  rows: [string, number][];
}) {
  return (
    <section>
      <h2>{title}</h2>
      {rows.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, count]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty">No records in this interval.</p>
      )}
    </section>
  );
}
function PeopleTable({ rows, visit }: { rows: RecordRow[]; visit?: boolean }) {
  return rows.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Submitted (UTC)</th>
            <th>Name / email</th>
            {visit && (
              <>
                <th>Company / role</th>
                <th>LinkedIn</th>
                <th>Session link consent</th>
              </>
            )}
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 100).map((r) => (
            <tr key={r.id}>
              <td>
                {new Date(r.created_at)
                  .toISOString()
                  .slice(0, 16)
                  .replace("T", " ")}
              </td>
              <td>
                {r.name}
                <br />
                {r.email || "No email shared"}
              </td>
              {visit && (
                <>
                  <td>
                    {r.company}
                    <br />
                    {r.role}
                  </td>
                  <td>
                    {r.linkedin ? (
                      <a href={r.linkedin} rel="noreferrer">
                        Profile ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{r.link_consent ? "Yes" : "No"}</td>
                </>
              )}
              <td>{r.message || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="empty">No submissions in this interval.</p>
  );
}
export default async function Analytics({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await owner())) redirect("/admin/login");
  const q = await searchParams;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q))
    if (typeof v === "string") params.set(k, v);
  let range;
  try {
    range = dateRange(params);
  } catch {
    return (
      <main id="main" className="page-shell">
        <h1>Invalid date range</h1>
        <p>Choose an interval of up to 366 days.</p>
        <a className="button" href="/admin/analytics">
          Reset filters
        </a>
      </main>
    );
  }
  let data;
  try {
    data = await analyticsData(range.start, range.end);
  } catch {
    return (
      <main id="main" className="page-shell">
        <h1>Analytics unavailable</h1>
        <p>
          The database could not be read. Check migrations and credentials, or
          choose a narrower date interval. No fabricated metrics are shown.
        </p>
        <Logout />
      </main>
    );
  }
  const { views, events, visitors, contacts } = data;
  const introductions = new Map(
    visitors
      .filter((v) => v.link_consent && v.session_id)
      .map((v) => [v.session_id!, v]),
  );
  const daily = new Map<string, number>();
  for (
    let t = new Date(range.start).getTime();
    t <= new Date(range.end).getTime();
    t += 86400000
  )
    daily.set(new Date(t).toISOString().slice(0, 10), 0);
  for (const r of views) {
    const day = r.created_at.slice(0, 10);
    daily.set(day, (daily.get(day) || 0) + 1);
  }
  const chart = [...daily].sort().map(([date, views]) => ({ date, views }));
  const metrics = [
    ["Page views", views.length],
    ["Unique browser sessions", new Set(views.map((r) => r.session_id)).size],
    ["Identified visit submissions", visitors.length],
    ["Resume page views", views.filter((r) => r.path === "/resume").length],
    [
      "Resume download clicks",
      events.filter((r) => r.event_type === "resume_download").length,
    ],
    [
      "Project page views",
      views.filter((r) => r.path?.startsWith("/projects/")).length,
    ],
    [
      "Contact CTA clicks",
      events.filter((r) => r.event_type === "contact_click").length,
    ],
    ["Contact submissions", contacts.length],
  ];
  return (
    <main id="main" className="page-shell dashboard">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">OWNER WORKSPACE / PRIVATE</p>
          <h1>
            Portfolio <span className="serif">insights.</span>
          </h1>
        </div>
        <div className="hero-actions">
          <Link className="button" href="/admin/messages">
            Open message inbox ↗
          </Link>
          <Logout />
        </div>
      </div>
      <p>
        Only consented visits are counted. Browser sessions and self-submitted
        identities are not verified unique people. Authenticated owner traffic
        is excluded.
      </p>
      <div className="analytics-explainer">
        <strong>
          {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true"
            ? "Tracking is enabled"
            : "Tracking is disabled in this deployment"}
        </strong>
        <p>
          Visits appear after a visitor allows analytics. Names appear when
          someone submits a professional introduction and agrees to link it to
          their visit. Other visits are shown as anonymous; contact names appear
          in your inbox.
        </p>
        <Link className="text-link" href="/guestbook">
          Open the visitor introduction form ↗
        </Link>
      </div>
      <form className="filters">
        <label>
          Quick range
          <select name="range" defaultValue={params.get("range") || "30"}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </label>
        <label>
          From (optional)
          <input
            type="date"
            name="from"
            defaultValue={params.get("from") || ""}
          />
        </label>
        <label>
          To (optional)
          <input type="date" name="to" defaultValue={params.get("to") || ""} />
        </label>
        <button className="button">Apply filters</button>
        <a className="button" href={`/api/admin/export?${params}`}>
          Export events CSV ↓
        </a>
      </form>
      <div className="metrics">
        {metrics.map(([label, value]) => (
          <div className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <section className="chart-panel">
        <h2>Views over time</h2>
        {views.length ? (
          <>
            <ViewsChart data={chart} />
            <details>
              <summary>Accessible daily counts</summary>
              <table>
                <thead>
                  <tr>
                    <th>Date (UTC)</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.map((d) => (
                    <tr key={d.date}>
                      <td>{d.date}</td>
                      <td>{d.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </>
        ) : (
          <p className="empty">
            No page views yet. Counts appear after consented visitors arrive.
          </p>
        )}
      </section>
      <div className="dashboard-pair">
        <CountTable title="Top pages" rows={counts(views, "path")} />
        <CountTable title="Referral domains" rows={counts(views, "referrer")} />
      </div>
      <CountTable
        title="Project engagement"
        rows={counts(
          views.filter((r) => r.path?.startsWith("/projects/")),
          "path",
        )}
      />
      <h2>Recent website visits</h2>
      {views.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Visited (UTC)</th>
                <th>Visitor</th>
                <th>Page</th>
                <th>Referral</th>
              </tr>
            </thead>
            <tbody>
              {views.slice(0, 100).map((view) => {
                const person = introductions.get(view.session_id || "");
                return (
                  <tr key={view.id}>
                    <td>
                      {new Date(view.created_at)
                        .toISOString()
                        .slice(0, 16)
                        .replace("T", " ")}
                    </td>
                    <td>
                      {person?.name || "Anonymous visitor"}
                      {person?.company && (
                        <>
                          <br />
                          {person.company}
                        </>
                      )}
                    </td>
                    <td>{view.path}</td>
                    <td>{view.referrer || "Direct / unknown"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty">
          No consented visits in this date range yet. Owner visits are excluded.
        </p>
      )}
      <h2>Visitors who introduced themselves</h2>
      <p>
        Latest 100 submissions in the selected interval. Details remain private.
      </p>
      <PeopleTable rows={visitors} visit />
      <h2>Recent contact messages</h2>
      <PeopleTable rows={contacts} />
    </main>
  );
}
