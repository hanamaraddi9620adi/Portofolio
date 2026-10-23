import "server-only";
export function scopedStorageFetch(base: string, secret: string): typeof fetch {
  return async (input, init) => {
    const url = new URL(
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url,
    );
    if (
      url.origin !== new URL(base).origin ||
      !url.pathname.startsWith("/rest/v1/")
    )
      throw new Error("Only portfolio data requests are allowed.");
    const headers: Record<string, string> = {};
    new Headers(init?.headers).forEach((value, key) => {
      if (
        ["accept", "content-type", "prefer", "range", "range-unit"].includes(
          key,
        )
      )
        headers[key] = value;
    });
    return fetch(base + "/functions/v1/portfolio-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + secret,
      },
      body: JSON.stringify({
        path: url.pathname.slice("/rest/v1/".length) + url.search,
        method: init?.method || "GET",
        headers,
        body: typeof init?.body === "string" ? init.body : undefined,
      }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
  };
}
