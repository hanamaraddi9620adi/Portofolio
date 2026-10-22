import { PublicForm } from "@/components/forms";
export const metadata = { title: "Leave a professional visit" };
export default function Guestbook() {
  return (
    <main id="main" className="page-shell prose">
      <p className="eyebrow">A PROFESSIONAL HELLO</p>
      <h1>
        Nice to <span className="serif">meet you.</span>
      </h1>
      <p>
        Visiting from a company, a college, or just following your curiosity?
        You’re welcome to introduce yourself. Your details are private to me and
        will never appear in a public guestbook.
      </p>
      <p>
        This is completely optional. Browsing never requires identification.
        Linking a visit to analytics is a separate choice and only works after
        analytics consent.
      </p>
      <PublicForm kind="visit" />
    </main>
  );
}
