import type { HeaderEntry } from '@src/shared/types';
import { isValidHeaderName } from '@src/shared/utils/normalizeHeaderName';

/**
 * Map enabled header entries to DNR ModifyHeaderInfo list (set = add or replace).
 */
export function buildModifyHeaderInfos(headers: HeaderEntry[]): chrome.declarativeNetRequest.ModifyHeaderInfo[] {
  const result: chrome.declarativeNetRequest.ModifyHeaderInfo[] = [];
  const seen = new Set<string>();

  for (const entry of headers) {
    if (!entry.enabled) continue;
    if (!isValidHeaderName(entry.name)) continue;
    const key = entry.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      header: entry.name.trim(),
      operation: 'set' as chrome.declarativeNetRequest.HeaderOperation,
      value: entry.value ?? '',
    });
  }

  return result;
}
