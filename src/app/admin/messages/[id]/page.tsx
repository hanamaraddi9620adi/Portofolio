import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { z } from "zod";
import { owner } from "@/lib/server";
import { Conversation } from "@/components/conversation";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private conversation",
  robots: { index: false, follow: false },
};
export default async function Thread({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await owner())) redirect("/admin/login");
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  return (
    <main id="main" className="page-shell prose">
      <Link href="/admin/messages" className="back-link">
        ← Back to inbox
      </Link>
      <p className="eyebrow">OWNER WORKSPACE / PRIVATE</p>
      <h1>
        A <span className="serif">conversation.</span>
      </h1>
      <Conversation ownerId={id} />
    </main>
  );
}
