/** Resource types covered so iframe / XHR / media requests are all rewritten. */
/** Widely supported DNR resource types (avoid newer enums that older Chrome rejects). */
export const ALL_RESOURCE_TYPES = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'font',
  'object',
  'xmlhttprequest',
  'ping',
  'csp_report',
  'media',
  'websocket',
  'other',
] as chrome.declarativeNetRequest.ResourceType[];

/** Stable base for session rule ids (one rule per tab). */
export const DNR_RULE_ID_BASE = 10_000;

/** Session rules keyed by enabled origin host (covers Service Worker requests, which have no tabId). */
export const DNR_ORIGIN_RULE_ID_BASE = 200_000;

export const STORAGE_KEY = 'header_modify_state';
