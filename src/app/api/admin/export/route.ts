import { owner, failure, ApiError } from "@/lib/server";
import { analyticsData } from "@/lib/analytics";
import { csvCell, dateRange } from "@/lib/validation";
export async function GET(req: Request) {
  try {
    if (!(await owner())) throw new ApiError("Unauthorized", 401);
    let range;
    try {
      range = dateRange(new URL(req.url).searchParams);
    } catch {
      throw new ApiError("Invalid date interval.");
    }
    const data = await analyticsData(range.start, range.end);
    const rows = [
      ["timestamp", "record_type", "page", "referring_domain"],
      ...data.views.map((r) => [r.created_at, "page_view", r.path, r.referrer]),
      ...data.events.map((r) => [
        r.created_at,
        r.event_type,
        r.path,
        r.referrer,
      ]),
    ];
    return new Response(
      rows.map((r) => r.map(csvCell).join(",")).join("\r\n"),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="portfolio-analytics.csv"',
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (e) {
    return failure(e);
  }
}
