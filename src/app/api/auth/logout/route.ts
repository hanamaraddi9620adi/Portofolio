import { cookies } from "next/headers";
import { failure, originGuard } from "@/lib/server";
export async function POST(req: Request) {
  try {
    originGuard(req);
    (await cookies()).delete("portfolio-owner");
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
