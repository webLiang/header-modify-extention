import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { dnrHeaderSync } from '@pages/background/services/DnrHeaderSync';
import { getActiveTabInfo, startTabSiteTracker } from '@pages/background/services/TabSiteTracker';
import headerStorage from '@src/shared/storages/headerStorage';
import type { HmMessage } from '@src/shared/types';

reloadOnUpdate('pages/background');

startTabSiteTracker();

chrome.runtime.onInstalled.addListener(() => {
  void dnrHeaderSync.syncAll();
});

chrome.runtime.onStartup.addListener(() => {
  void dnrHeaderSync.syncAll();
});

// Rebuild rules when the service worker wakes.
void dnrHeaderSync.syncAll();

try {
  chrome.declarativeNetRequest.setExtensionActionOptions({
    displayActionCountAsBadgeText: false,
  });
} catch (error) {
  console.warn('[HeaderModify] setExtensionActionOptions unavailable', error);
}

chrome.runtime.onMessage.addListener((message: HmMessage, _sender, sendResponse) => {
  void (async () => {
    try {
      if (!message || typeof message !== 'object' || !('msg' in message)) {
        sendResponse({ ok: false, error: 'invalid_message' });
        return;
      }

      switch (message.msg) {
        case 'HM_SYNC': {
          await dnrHeaderSync.syncAll();
          sendResponse({ ok: true });
          break;
        }
        case 'HM_GET_ACTIVE_TAB': {
          const tab = await getActiveTabInfo();
          sendResponse({ ok: true, tab });
          break;
        }
        case 'HM_SET_SITE_ENABLED': {
          await headerStorage.setOriginEnabled(message.origin, message.enabled);
          await dnrHeaderSync.syncAll();
          sendResponse({ ok: true });
          break;
        }
        default: {
          sendResponse({ ok: false, error: 'unknown_message' });
        }
      }
    } catch (error) {
      console.error('[HeaderModify] message handler failed', error);
      sendResponse({ ok: false, error: String(error) });
    }
  })();
  return true;
});

console.log('[HeaderModify] background loaded');
