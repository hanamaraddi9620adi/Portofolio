import { Login } from "@/components/login";
import { configured, owner } from "@/lib/server";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Owner sign-in",
  robots: { index: false, follow: false },
};
export default async function LoginPage() {
  if (await owner()) redirect("/admin/analytics");
  return (
    <main id="main" className="page-shell">
      <p className="eyebrow">PRIVATE WORKSPACE</p>
      <h1>
        Welcome <span className="serif">back.</span>
      </h1>
      <p>Sign in with the verified, allowlisted owner account.</p>
      {!configured() && (
        <div className="notice">
          Supabase is not configured yet. Follow the setup instructions in
          README.md. No analytics records are available publicly.
        </div>
      )}
      <Login />
    </main>
  );
}
