import { Conversation } from "@/components/conversation";
export const metadata = {
  title: "Your private conversation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default function Messages() {
  return (
    <main id="main" className="page-shell prose">
      <p className="eyebrow">A DIRECT CONNECTION</p>
      <h1>
        Let’s keep <span className="serif">talking.</span>
      </h1>
      <p>
        Read my replies and continue our conversation here. Keep your private
        link safe: anyone with it can access this thread. No email notifications
        are sent; revisit this page to check for replies.
      </p>
      <Conversation />
    </main>
  );
}
