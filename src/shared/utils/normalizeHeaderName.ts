/**
 * Normalize a header name for display and DNR matching.
 * Trims whitespace and lowercases ASCII letters (HTTP headers are case-insensitive).
 */
export function normalizeHeaderName(name: string): string {
  return name.trim().toLowerCase();
}

/** Return true when a header name looks usable for DNR set operations. */
export function isValidHeaderName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;
  // Reject control chars and whitespace inside the name.
  return /^[\w!#$%&'*+.^`|~-]+$/i.test(trimmed);
}
