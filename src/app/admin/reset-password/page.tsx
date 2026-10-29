import { PasswordRecovery } from "@/components/password-recovery";
export const metadata = {
  title: "Reset your owner password",
  robots: { index: false, follow: false },
};
export default function ResetPasswordPage() {
  return (
    <main id="main" className="page-shell">
      <p className="eyebrow">PRIVATE WORKSPACE</p>
      <h1>
        Choose a <span className="serif">new password.</span>
      </h1>
      <PasswordRecovery />
    </main>
  );
}
