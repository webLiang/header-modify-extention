import type { HeaderEntry } from '@src/shared/types';
import { isValidHeaderName } from '@src/shared/utils/normalizeHeaderName';

/** Hop-by-hop / browser-owned names that DNR cannot SET (may fail the whole rule). */
const DNR_UNSETTABLE_REQUEST_HEADERS = new Set([
  'host',
  'content-length',
  'transfer-encoding',
  'te',
  'trailer',
  'upgrade',
  'keep-alive',
  'connection',
]);

/**
 * UA Client Hints Chrome still sends after User-Agent is rewritten.
 * Sites that read these ignore the spoofed User-Agent string.
 */
export const UA_CLIENT_HINT_HEADERS = [
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
  'sec-ch-ua-arch',
  'sec-ch-ua-bitness',
  'sec-ch-ua-model',
  'sec-ch-ua-full-version',
  'sec-ch-ua-full-version-list',
  'sec-ch-ua-wow64',
  'sec-ch-ua-form-factors',
] as const;

/** True when Chrome will refuse a DNR SET for this request header name. */
export function isDnrUnsettableRequestHeader(name: string): boolean {
  const key = name.trim().toLowerCase();
  if (!key) return true;
  if (DNR_UNSETTABLE_REQUEST_HEADERS.has(key)) return true;
  if (key.startsWith('proxy-')) return true;
  // Fetch metadata is browser-controlled. sec-ch-* is stripped separately when UA is set.
  if (key.startsWith('sec-fetch-')) return true;
  return false;
}

/**
 * Map enabled header entries to DNR ModifyHeaderInfo list (set = add or replace).
 * Skips headers Chrome will not SET. When User-Agent is set, also removes UA Client Hints.
 */
export function buildModifyHeaderInfos(headers: HeaderEntry[]): chrome.declarativeNetRequest.ModifyHeaderInfo[] {
  const result: chrome.declarativeNetRequest.ModifyHeaderInfo[] = [];
  const seen = new Set<string>();
  let setsUserAgent = false;

  for (const entry of headers) {
    if (!entry.enabled) continue;
    if (!isValidHeaderName(entry.name)) continue;
    if (isDnrUnsettableRequestHeader(entry.name)) {
      console.warn('[HeaderModify] skip header Chrome cannot SET', entry.name);
      continue;
    }
    const key = entry.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (key === 'user-agent') setsUserAgent = true;
    result.push({
      header: entry.name.trim(),
      operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
      value: entry.value ?? '',
    });
  }

  if (setsUserAgent) {
    for (const header of UA_CLIENT_HINT_HEADERS) {
      if (seen.has(header)) continue;
      seen.add(header);
      result.push({
        header,
        operation: 'remove' as chrome.declarativeNetRequest.HeaderOperation,
      });
    }
  }

  return result;
}
