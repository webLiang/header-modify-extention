import { dnrHeaderSync } from '@pages/background/services/DnrHeaderSync';
import type { ActiveTabInfo } from '@src/shared/types';
import { originFromUrl } from '@src/shared/utils/parseRequestHeaders';

/**
 * Listen for tab lifecycle changes and keep DNR session rules in sync.
 */
export function startTabSiteTracker(): void {
  const schedule = () => {
    void dnrHeaderSync.syncAll();
  };

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
    if (changeInfo.status === 'loading' || changeInfo.url) {
      schedule();
    }
  });

  chrome.tabs.onRemoved.addListener(() => {
    schedule();
  });

  chrome.tabs.onReplaced.addListener(() => {
    schedule();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.header_modify_state) {
      schedule();
    }
  });
}

/**
 * Resolve the currently active tab in the focused window.
 */
export async function getActiveTabInfo(): Promise<ActiveTabInfo | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || typeof tab.id !== 'number' || !tab.url) return null;

  const origin = originFromUrl(tab.url);
  if (!origin) {
    return {
      tabId: tab.id,
      url: tab.url,
      origin: '',
      hostname: '',
      favIconUrl: tab.favIconUrl,
      title: tab.title,
    };
  }

  let hostname = '';
  try {
    hostname = new URL(tab.url).hostname;
  } catch {
    hostname = '';
  }

  return {
    tabId: tab.id,
    url: tab.url,
    origin,
    hostname,
    favIconUrl: tab.favIconUrl,
    title: tab.title,
  };
}
