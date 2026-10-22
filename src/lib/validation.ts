import { z } from "zod";
import { projects } from "@/content/projects";
const text = (max: number) => z.string().trim().max(max);
const email = z.union([z.literal(""), z.email().max(254)]).optional();
const base = {
  name: text(100).min(2),
  email,
  message: text(3000).optional(),
  website: z.literal("").optional(),
  consent: z.literal(true),
  token: text(2048).optional(),
};
export const contactSchema = z.object({
  ...base,
  email: z.email().max(254),
  message: text(3000).min(10),
});
export const visitSchema = z.object({
  ...base,
  company: text(120).optional(),
  role: text(120).optional(),
  linkedin: z
    .union([
      z.literal(""),
      z
        .url()
        .max(300)
        .refine((v) => {
          const u = new URL(v);
          return (
            u.protocol === "https:" &&
            ["linkedin.com", "www.linkedin.com"].includes(u.hostname) &&
            u.pathname.startsWith("/in/") &&
            !u.username &&
            !u.password
          );
        }, "Use a LinkedIn profile URL"),
    ])
    .optional(),
  linkSession: z.boolean().default(false),
  sessionId: z.uuid().nullish(),
});
export const publicPaths = [
  "/",
  "/resume",
  "/privacy",
  "/guestbook",
  ...projects.map((p) => `/projects/${p.slug}`),
];
export const eventSchema = z.object({
  type: z.enum([
    "page_view",
    "resume_download",
    "contact_click",
    "linkedin_click",
    "github_click",
  ]),
  path: z.string().refine((p) => publicPaths.includes(p), "Unknown page"),
  sessionId: z.uuid(),
  referrer: z
    .string()
    .max(253)
    .regex(/^$|^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}$/),
  consent: z.literal(true),
});
export function csvCell(value: unknown) {
  const s = String(value ?? "");
  return (
    '"' + (/^[=+@\-\t\r\n]/.test(s) ? "'" : "") + s.replaceAll('"', '""') + '"'
  );
}
export function dateRange(params: URLSearchParams) {
  const range = params.get("range") || "30";
  const now = new Date();
  const end = params.get("to")
    ? new Date(params.get("to") + "T23:59:59.999Z")
    : now;
  const start = params.get("from")
    ? new Date(params.get("from") + "T00:00:00.000Z")
    : new Date(now.getTime() - (range === "7" ? 7 : 30) * 86400000);
  if (
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    end < start ||
    end.getTime() - start.getTime() > 366 * 86400000
  )
    throw new Error("Choose a valid interval of up to 366 days.");
  return { start: start.toISOString(), end: end.toISOString() };
}
