import "server-only";
import { database } from "./server";
export type RecordRow = {
  id: string;
  created_at: string;
  path?: string;
  session_id?: string;
  referrer?: string;
  event_type?: string;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  linkedin?: string;
  message?: string;
  link_consent?: boolean;
};
export async function analyticsData(start: string, end: string) {
  const db = database();
  async function rows(table: string) {
    const all: RecordRow[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await db
        .from(table)
        .select("*")
        .gte("created_at", start)
        .lte("created_at", end)
        .order("created_at", { ascending: false })
        .order("id")
        .range(offset, offset + 999);
      if (error) throw new Error("Database query failed");
      all.push(...data);
      if (data.length < 1000) break;
      if (all.length >= 100000)
        throw new Error("Choose a narrower date interval");
    }
    return all;
  }
  const [views, events, visitors, contacts] = await Promise.all([
    rows("page_views"),
    rows("analytics_events"),
    rows("identified_visitors"),
    rows("contact_submissions"),
  ]);
  return { views, events, visitors, contacts };
}
export function counts(rows: RecordRow[], key: "path" | "referrer") {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = r[key] || "Direct / unknown";
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map].sort((a, b) => b[1] - a[1]);
}
