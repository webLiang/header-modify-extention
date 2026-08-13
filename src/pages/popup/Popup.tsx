import React, { useEffect, useMemo, useRef, useState } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import useStorage from '@src/shared/hooks/useStorage';
import headerStorage from '@src/shared/storages/headerStorage';
import type { ActiveTabInfo, HeaderEntry } from '@src/shared/types';
import { createHeaderId } from '@src/shared/utils/headerId';
import { parseRequestHeaders } from '@src/shared/utils/parseRequestHeaders';
import { isValidHeaderName } from '@src/shared/utils/normalizeHeaderName';
import {
  getCurrentLocale,
  initI18n,
  setCurrentLocale,
  subscribeLocaleChange,
  SUPPORTED_LOCALES,
  translate,
  type SupportedLocale,
} from '@src/chrome/i18n';
import { ToastContainer, useToast } from '@pages/popup/components/Toast';

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  zh_CN: '中文',
  es: 'Español',
  ar: 'العربية',
  hi: 'हिंदी',
};

/** Ask background to rebuild DNR session rules from storage. */
async function requestSync() {
  try {
    await chrome.runtime.sendMessage({ msg: 'HM_SYNC' });
  } catch (error) {
    console.warn('[HeaderModify] sync message failed', error);
  }
}

/** Fetch the active tab metadata from the background. */
async function fetchActiveTab(): Promise<ActiveTabInfo | null> {
  try {
    const response = await chrome.runtime.sendMessage({ msg: 'HM_GET_ACTIVE_TAB' });
    return response?.tab ?? null;
  } catch (error) {
    console.warn('[HeaderModify] failed to get active tab', error);
    return null;
  }
}

const Popup = () => {
  const state = useStorage(headerStorage);
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();
  const [locale, setLocale] = useState<SupportedLocale>(getCurrentLocale());
  const [tab, setTab] = useState<ActiveTabInfo | null>(null);
  const [pasteText, setPasteText] = useState('');
  const importRef = useRef<HTMLInputElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const [headers, setHeaders] = useState<HeaderEntry[]>(state.headers);

  useEffect(() => {
    void initI18n().then(setLocale);
    return subscribeLocaleChange(setLocale);
  }, []);

  useEffect(() => {
    void fetchActiveTab().then(setTab);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh_CN' ? 'zh-CN' : locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  useEffect(() => {
    // Accept storage updates only when the user is not mid-edit.
    if (dirtyRef.current) return;
    setHeaders(state.headers);
  }, [state.headers]);

  const siteEnabled = Boolean(tab?.origin && state.enabledOrigins.includes(tab.origin));
  const activeCount = useMemo(() => headers.filter(h => h.enabled).length, [headers]);

  /** Persist header list and debounce a sync + toast. */
  const persistHeaders = (next: HeaderEntry[], notify = true) => {
    void headerStorage.setHeaders(next).then(() => {
      dirtyRef.current = false;
      void requestSync();
      if (!notify) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => showSuccess(translate('saved')), 280);
    });
  };

  /** Update UI immediately; debounce storage writes while typing. */
  const schedulePersist = (next: HeaderEntry[]) => {
    dirtyRef.current = true;
    setHeaders(next);
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => persistHeaders(next), 220);
  };

  const handleToggleSite = async (enabled: boolean) => {
    if (!tab?.origin) return;
    await headerStorage.setOriginEnabled(tab.origin, enabled);
    await requestSync();
  };

  const handleParseMerge = () => {
    if (!pasteText.trim()) {
      showInfo(translate('parseEmpty'));
      return;
    }
    const parsed = parseRequestHeaders(pasteText);
    if (parsed.length === 0) {
      showError(translate('parseFailed'));
      return;
    }
    void headerStorage.mergeParsedHeaders(parsed).then(merged => {
      dirtyRef.current = false;
      setHeaders(merged);
      void requestSync();
      setPasteText('');
      showSuccess(translate('parseSuccess', String(parsed.length)));
    });
  };

  const handleAddHeader = () => {
    const next: HeaderEntry[] = [...headers, { id: createHeaderId(), name: '', value: '', enabled: true }];
    dirtyRef.current = true;
    setHeaders(next);
    persistHeaders(next, false);
  };

  const updateHeader = (id: string, patch: Partial<HeaderEntry>) => {
    const next = headers.map(h => (h.id === id ? { ...h, ...patch } : h));
    schedulePersist(next);
  };

  const removeHeader = (id: string) => {
    const next = headers.filter(h => h.id !== id);
    dirtyRef.current = true;
    setHeaders(next);
    persistHeaders(next);
  };

  const handleClearAll = () => {
    dirtyRef.current = false;
    setHeaders([]);
    void headerStorage.clearHeaders().then(() => {
      void requestSync();
      showSuccess(translate('cleared'));
    });
  };

  const handleExport = () => {
    const payload = {
      version: 1,
      headers: headers.map(({ name, value, enabled }) => ({ name, value, enabled })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'header-modify-extention-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text) as { headers?: Array<{ name?: string; value?: string; enabled?: boolean }> };
      if (!Array.isArray(data.headers)) throw new Error('invalid');
      const imported: HeaderEntry[] = data.headers
        .filter(h => typeof h?.name === 'string' && isValidHeaderName(h.name))
        .map(h => ({
          id: createHeaderId(),
          name: String(h.name).trim(),
          value: String(h.value ?? ''),
          enabled: h.enabled !== false,
        }));
      dirtyRef.current = false;
      setHeaders(imported);
      await headerStorage.setHeaders(imported);
      await requestSync();
      showSuccess(translate('importSuccess', String(imported.length)));
    } catch {
      showError(translate('importFailed'));
    }
  };

  return (
    <div className="hm-app">
      <header className="hm-header">
        <div className="hm-brand">
          <img className="hm-logo" src={logo} alt="" />
          <div className="hm-brand-text">
            <h1 className="hm-title">{translate('popupTitle')}</h1>
            <div className="hm-site-row">
              {tab?.favIconUrl ? <img className="hm-favicon" src={tab.favIconUrl} alt="" /> : null}
              <span className="hm-hostname">{tab?.hostname || translate('siteUnsupported')}</span>
            </div>
          </div>
        </div>
        <div className="hm-muted" style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <label htmlFor="hm-locale-select">{translate('language')}</label>
          <select
            id="hm-locale-select"
            className="hm-locale"
            value={locale}
            onChange={e => void setCurrentLocale(e.target.value as SupportedLocale)}>
            {SUPPORTED_LOCALES.map(code => (
              <option key={code} value={code}>
                {LOCALE_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="hm-card hm-toggle-card">
        <div className="hm-toggle-copy">
          <h2>{translate('enableForSite')}</h2>
          <p>
            {!tab?.origin
              ? translate('siteUnsupported')
              : siteEnabled
                ? translate('enabledHint')
                : translate('disabledHint')}
          </p>
        </div>
        <label className="hm-switch" htmlFor="hm-site-enable">
          <span className="hm-sr-only">{translate('enableForSite')}</span>
          <input
            id="hm-site-enable"
            type="checkbox"
            checked={siteEnabled}
            disabled={!tab?.origin}
            onChange={e => void handleToggleSite(e.target.checked)}
          />
          <span className="hm-switch-slider" aria-hidden />
        </label>
      </section>

      <section className="hm-card">
        <div className="hm-section-title">
          <h2>{translate('pasteSectionTitle')}</h2>
        </div>
        <textarea
          className="hm-textarea"
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder={translate('pastePlaceholder')}
          spellCheck={false}
        />
        <div className="hm-actions">
          <button type="button" className="hm-btn hm-btn-primary" onClick={handleParseMerge}>
            {translate('parseMerge')}
          </button>
        </div>
      </section>

      <section className="hm-card" style={{ flex: 1, minHeight: 0 }}>
        <div className="hm-section-title">
          <h2>{translate('headersSectionTitle')}</h2>
          <span className="hm-muted">{translate('activeCount', String(activeCount))}</span>
        </div>

        {headers.length === 0 ? (
          <div className="hm-empty">{translate('emptyHeaders')}</div>
        ) : (
          <div className="hm-header-list">
            {headers.map(header => (
              <div className="hm-header-row" key={header.id}>
                <input
                  className="hm-check"
                  type="checkbox"
                  checked={header.enabled}
                  title={translate('toggleHeader')}
                  aria-label={translate('toggleHeader')}
                  onChange={e => updateHeader(header.id, { enabled: e.target.checked })}
                />
                <input
                  className="hm-input"
                  value={header.name}
                  placeholder={translate('headerNamePlaceholder')}
                  spellCheck={false}
                  onChange={e => updateHeader(header.id, { name: e.target.value })}
                />
                <input
                  className="hm-input"
                  value={header.value}
                  placeholder={translate('headerValuePlaceholder')}
                  spellCheck={false}
                  onChange={e => updateHeader(header.id, { value: e.target.value })}
                />
                <button
                  type="button"
                  className="hm-icon-btn"
                  title={translate('deleteHeader')}
                  aria-label={translate('deleteHeader')}
                  onClick={() => removeHeader(header.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="hm-actions">
          <button type="button" className="hm-btn hm-btn-ghost" onClick={handleAddHeader}>
            {translate('addHeader')}
          </button>
        </div>
      </section>

      <footer className="hm-footer">
        <button type="button" className="hm-btn hm-btn-ghost" onClick={handleExport}>
          {translate('exportJson')}
        </button>
        <button type="button" className="hm-btn hm-btn-ghost" onClick={() => importRef.current?.click()}>
          {translate('importJson')}
        </button>
        <button type="button" className="hm-btn hm-btn-danger" onClick={handleClearAll}>
          {translate('clearAll')}
        </button>
        <input
          ref={importRef}
          className="hm-hidden-file"
          type="file"
          accept="application/json,.json"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = '';
          }}
        />
      </footer>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default withErrorBoundary(
  withSuspense(Popup, <div className="hm-app">{translate('loading')}</div>),
  <div className="hm-app">{translate('errorBoundary')}</div>,
);
