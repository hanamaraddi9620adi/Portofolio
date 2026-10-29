import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const lifetimeSeconds = 15 * 60;
const signatureFor = (payload: string, secret: string) =>
  createHmac("sha256", secret)
    .update(`portfolio-form:${payload}`)
    .digest("base64url");

export function issueFormToken(secret: string, now = Date.now()) {
  const payload = `${Math.floor(now / 1000)}.${randomBytes(24).toString("base64url")}`;
  return `${payload}.${signatureFor(payload, secret)}`;
}

export function validFormToken(
  token: string,
  secret: string,
  now = Date.now(),
) {
  const match = /^(\d{10})\.([A-Za-z0-9_-]{32})\.([A-Za-z0-9_-]{43})$/.exec(
    token,
  );
  if (!match) return false;
  const age = Math.floor(now / 1000) - Number(match[1]);
  if (age < -5 || age > lifetimeSeconds) return false;
  const actual = Buffer.from(match[3]);
  const expected = Buffer.from(signatureFor(`${match[1]}.${match[2]}`, secret));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const formTokenBucket = (token: string) =>
  createHash("sha256").update(`one-time-form:${token}`).digest("hex");
