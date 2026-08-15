type Entry = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const globalStore = globalThis as typeof globalThis & {
  buywizFormRateLimit?: Map<string, Entry>;
};

const store =
  globalStore.buywizFormRateLimit ??
  new Map<string, Entry>();

globalStore.buywizFormRateLimit = store;

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return false;
  }

  if (existing.count >= MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  store.set(key, existing);

  return false;
}
