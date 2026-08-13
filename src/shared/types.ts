/** A single request header override entry shown in the popup. */
export type HeaderEntry = {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
};

/** Persisted extension state for headers and per-origin enablement. */
export type HeaderAppState = {
  headers: HeaderEntry[];
  /** Origins (e.g. https://example.com) where header rewriting is enabled. */
  enabledOrigins: string[];
};

export type ParsedHeader = {
  name: string;
  value: string;
};

/** Messages exchanged between popup and background. */
export type HmMessage =
  | { msg: 'HM_SYNC' }
  | { msg: 'HM_GET_ACTIVE_TAB' }
  | { msg: 'HM_SET_SITE_ENABLED'; enabled: boolean; origin: string };

export type ActiveTabInfo = {
  tabId: number;
  url: string;
  origin: string;
  hostname: string;
  favIconUrl?: string;
  title?: string;
};
