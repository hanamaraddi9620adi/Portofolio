"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="error-page">
      <h1>Something interrupted the signal.</h1>
      <p>Please try again. If this continues, reach out by email.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
