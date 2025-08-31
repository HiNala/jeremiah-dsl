// Simple in-memory rate limiting (replace with Redis in production)
const attempts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetTime) {
    // First attempt or window expired
    const resetTime = now + windowMs;
    attempts.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: maxAttempts - 1, resetTime };
  }

  if (record.count >= maxAttempts) {
    // Rate limited
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment and allow
  record.count++;
  attempts.set(key, record);
  return { allowed: true, remaining: maxAttempts - record.count, resetTime: record.resetTime };
}

export function getRateLimitHeaders(
  remaining: number,
  resetTime: number
): Record<string, string> {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
  };
}

