import Link from "next/link";
import { redirect } from "next/navigation";
import { database, owner } from "@/lib/server";
import { Logout } from "@/components/login";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private message inbox",
  robots: { index: false, follow: false },
};
export default async function Inbox() {
  if (!(await owner())) redirect("/admin/login");
  const { data, error } = await database()
    .from("contact_submissions")
    .select("id,name,email,message,status,created_at,last_activity")
    .order("last_activity", { ascending: false })
    .limit(100);
  return (
    <main id="main" className="page-shell dashboard">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">OWNER WORKSPACE / PRIVATE</p>
          <h1>
            Your <span className="serif">inbox.</span>
          </h1>
        </div>
        <Logout />
      </div>
      <div className="hero-actions">
        <Link className="button" href="/admin/analytics">
          Viewer analytics
        </Link>
        <Link className="button" href="/admin/messages">
          Refresh inbox
        </Link>
      </div>
      <p>
        Latest 100 conversations. Open a thread to read and reply. New visitor
        replies return to “Awaiting reply.”
      </p>
      {error ? (
        <div className="notice">
          The inbox could not be loaded. Check database configuration and the
          messaging migration.
        </div>
      ) : !data?.length ? (
        <p className="empty">
          No messages yet. New contact submissions will appear here.
        </p>
      ) : (
        <div className="inbox-list">
          {data.map((c) => (
            <Link
              className="inbox-item"
              href={"/admin/messages/" + c.id}
              key={c.id}
            >
              <div>
                <strong>{c.name}</strong>
                <span className={"thread-status " + c.status}>
                  {c.status === "new"
                    ? "Awaiting reply"
                    : c.status === "replied"
                      ? "Replied"
                      : "Closed"}
                </span>
              </div>
              <p>
                {c.message.slice(0, 150)}
                {c.message.length > 150 ? "…" : ""}
              </p>
              <small>
                {c.email} ·{" "}
                {new Date(c.last_activity || c.created_at).toLocaleString(
                  "en-IN",
                  { timeZone: "Asia/Kolkata" },
                )}{" "}
                IST
              </small>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
