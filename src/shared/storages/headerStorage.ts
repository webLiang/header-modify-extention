import { createStorage, StorageType, type BaseStorage } from '@src/shared/storages/base';
import { STORAGE_KEY } from '@src/shared/constants';
import type { HeaderAppState, HeaderEntry, ParsedHeader } from '@src/shared/types';
import { createHeaderId } from '@src/shared/utils/headerId';
import { normalizeHeaderName } from '@src/shared/utils/normalizeHeaderName';

const DEFAULT_STATE: HeaderAppState = {
  headers: [],
  enabledOrigins: [],
};

export type HeaderStorage = BaseStorage<HeaderAppState> & {
  setHeaders: (headers: HeaderEntry[]) => Promise<void>;
  mergeParsedHeaders: (parsed: ParsedHeader[]) => Promise<HeaderEntry[]>;
  setOriginEnabled: (origin: string, enabled: boolean) => Promise<void>;
  clearHeaders: () => Promise<void>;
};

const base = createStorage<HeaderAppState>(STORAGE_KEY, DEFAULT_STATE, {
  storageType: StorageType.Local,
  liveUpdate: true,
});

/**
 * Persist header overrides and which origins have rewriting enabled.
 */
const headerStorage: HeaderStorage = {
  ...base,
  async setHeaders(headers) {
    await base.set(prev => ({
      ...(prev ?? DEFAULT_STATE),
      headers,
    }));
  },
  async mergeParsedHeaders(parsed) {
    let nextHeaders: HeaderEntry[] = [];
    await base.set(prev => {
      const state = prev ?? DEFAULT_STATE;
      const byName = new Map(state.headers.map(h => [normalizeHeaderName(h.name), h]));
      for (const item of parsed) {
        const key = normalizeHeaderName(item.name);
        const existing = byName.get(key);
        if (existing) {
          byName.set(key, { ...existing, name: item.name.trim(), value: item.value, enabled: true });
        } else {
          byName.set(key, {
            id: createHeaderId(),
            name: item.name.trim(),
            value: item.value,
            enabled: true,
          });
        }
      }
      nextHeaders = [...byName.values()];
      return { ...state, headers: nextHeaders };
    });
    return nextHeaders;
  },
  async setOriginEnabled(origin, enabled) {
    if (!origin) return;
    await base.set(prev => {
      const state = prev ?? DEFAULT_STATE;
      const set = new Set(state.enabledOrigins);
      if (enabled) set.add(origin);
      else set.delete(origin);
      return { ...state, enabledOrigins: [...set] };
    });
  },
  async clearHeaders() {
    await base.set(prev => ({
      ...(prev ?? DEFAULT_STATE),
      headers: [],
    }));
  },
};

export default headerStorage;
