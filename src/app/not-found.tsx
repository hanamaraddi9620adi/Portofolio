import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="page-shell">
      <p className="eyebrow">404 / OFF THE MAP</p>
      <h1>
        No signal <span className="serif">here.</span>
      </h1>
      <p>This page does not exist. There’s plenty to explore back home.</p>
      <Link href="/" className="button primary">
        Return home →
      </Link>
    </main>
  );
}
