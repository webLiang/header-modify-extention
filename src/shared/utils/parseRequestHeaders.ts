import type { ParsedHeader } from '@src/shared/types';
import { isValidHeaderName, normalizeHeaderName } from '@src/shared/utils/normalizeHeaderName';

const CURL_H_RE = /(?:^|\s)-H\s+(?:'([^']+)'|"([^"]+)")/g;
const NAME_VALUE_COLON_RE = /^([^\s:][^:]*?)\s*:\s*(.*)$/;

/**
 * Detect whether a line looks like an HTTP header name (DevTools alternate-line dump).
 */
function looksLikeHeaderName(line: string): boolean {
  if (!line || line.includes(' ')) return false;
  return isValidHeaderName(line);
}

/**
 * Parse Chrome DevTools "Copy request headers" alternate name/value lines.
 * Example:
 *   sec-fetch-user
 *   ?1
 *   user-agent
 *   Mozilla/5.0 ...
 */
function parseAlternateLines(lines: string[]): ParsedHeader[] | null {
  if (lines.length < 2 || lines.length % 2 !== 0) return null;

  const pairs: ParsedHeader[] = [];
  for (let i = 0; i < lines.length; i += 2) {
    const name = lines[i];
    const value = lines[i + 1] ?? '';
    if (!looksLikeHeaderName(name)) return null;
    pairs.push({ name: name.trim(), value });
  }
  return pairs.length > 0 ? pairs : null;
}

/**
 * Parse classic `Name: Value` header blocks (one header per line).
 */
function parseColonSeparated(lines: string[]): ParsedHeader[] {
  const pairs: ParsedHeader[] = [];
  for (const line of lines) {
    const match = NAME_VALUE_COLON_RE.exec(line);
    if (!match) continue;
    const name = match[1].trim();
    if (!isValidHeaderName(name)) continue;
    pairs.push({ name, value: match[2] ?? '' });
  }
  return pairs;
}

/**
 * Extract `-H 'Name: Value'` pairs from a cURL command string.
 */
function parseCurlHeaders(text: string): ParsedHeader[] {
  const pairs: ParsedHeader[] = [];
  let match: RegExpExecArray | null;
  CURL_H_RE.lastIndex = 0;
  while ((match = CURL_H_RE.exec(text)) !== null) {
    const raw = (match[1] ?? match[2] ?? '').trim();
    const colonIdx = raw.indexOf(':');
    if (colonIdx <= 0) continue;
    const name = raw.slice(0, colonIdx).trim();
    const value = raw.slice(colonIdx + 1).trim();
    if (!isValidHeaderName(name)) continue;
    pairs.push({ name, value });
  }
  return pairs;
}

/**
 * Deduplicate by normalized header name; later entries win.
 */
export function mergeParsedHeaders(headers: ParsedHeader[]): ParsedHeader[] {
  const map = new Map<string, ParsedHeader>();
  for (const header of headers) {
    const key = normalizeHeaderName(header.name);
    if (!key) continue;
    map.set(key, { name: header.name.trim(), value: header.value });
  }
  return [...map.values()];
}

/**
 * Parse pasted request headers from DevTools alternate lines, Name: Value, or cURL -H.
 */
export function parseRequestHeaders(text: string): ParsedHeader[] {
  const trimmed = text.replace(/^\uFEFF/, '').trim();
  if (!trimmed) return [];

  const curlPairs = parseCurlHeaders(trimmed);
  if (curlPairs.length > 0) {
    return mergeParsedHeaders(curlPairs);
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .filter(line => line.length > 0);

  const alternate = parseAlternateLines(lines);
  if (alternate) {
    return mergeParsedHeaders(alternate);
  }

  return mergeParsedHeaders(parseColonSeparated(lines));
}

/**
 * Extract a stable origin from a tab URL, or empty string for unsupported schemes.
 */
export function originFromUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.origin;
  } catch {
    return '';
  }
}

/** Hostname for DNR initiatorDomains (no port). */
export function hostnameFromOrigin(origin: string): string {
  try {
    return new URL(origin).hostname;
  } catch {
    return '';
  }
}
