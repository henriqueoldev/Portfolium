const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Normalizes a site URL that may or may not include the protocol. */
export function normalizeSiteUrl(url: string): string {
  const value = url.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/** Builds an absolute URL for canonical/Open Graph tags. */
export function absoluteUrl(base: string, path = "/"): string {
  try {
    return new URL(path, normalizeSiteUrl(base)).toString();
  } catch {
    return normalizeSiteUrl(base);
  }
}

/**
 * Formats a collection date in UTC.
 * Dates in frontmatter are stored as UTC (`2025-09-28T00:00:00Z`), so reading
 * them with local getters would shift the day for negative timezones.
 */
export function formatDate(date?: Date | string | null): string {
  if (!date) return "";
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const day = String(parsed.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCFullYear()}`;
}

/** Machine readable date for the `datetime` attribute. */
export function toISODate(date?: Date | string | null): string | undefined {
  if (!date) return undefined;
  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}
