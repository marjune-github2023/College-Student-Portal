import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

// scrypt parameters. N must be a power of two; the defaults use ~16 MB of memory
// per hash, which is a reasonable production baseline for a password store.
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export const MIN_PASSWORD_LENGTH = 10;

/**
 * Hash a plaintext password with a random salt.
 * Format: scrypt$N$r$p$saltBase64$hashBase64
 */
export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(password, salt, KEY_LENGTH, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("base64"), derived.toString("base64")].join("$");
}

/** Verify a plaintext password against a stored hash. Never throws. */
export async function verifyPassword(password, stored) {
  try {
    if (typeof password !== "string" || typeof stored !== "string") return false;
    const [scheme, n, r, p, saltB64, hashB64] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    if (!salt.length || !expected.length) return false;
    const derived = await scrypt(password, salt, expected.length, { N: Number(n), r: Number(r), p: Number(p) });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/** Opaque session token handed to the browser. */
export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

/** Only the hash of a session token is stored, so a database leak cannot be replayed. */
export function hashSessionToken(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}
