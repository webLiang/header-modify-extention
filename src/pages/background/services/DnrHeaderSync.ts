import { ALL_RESOURCE_TYPES, DNR_ORIGIN_RULE_ID_BASE, DNR_RULE_ID_BASE } from '@src/shared/constants';
import type { HeaderAppState } from '@src/shared/types';
import { hostnameFromOrigin, originFromUrl } from '@src/shared/utils/parseRequestHeaders';
import { buildModifyHeaderInfos } from '@pages/background/services/buildModifyHeaderInfos';

/**
 * Map a Chrome tab id to a stable session rule id.
 * Chrome rule ids must be positive integers.
 */
export function ruleIdForTab(tabId: number): number {
  return DNR_RULE_ID_BASE + Math.abs(tabId);
}

/** Build a modifyHeaders session rule with shared action/resource types. */
function makeHeaderRule(
  id: number,
  requestHeaders: chrome.declarativeNetRequest.ModifyHeaderInfo[],
  extraCondition: chrome.declarativeNetRequest.RuleCondition,
): chrome.declarativeNetRequest.Rule {
  return {
    id,
    priority: 1,
    action: {
      type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
      requestHeaders,
    },
    condition: {
      urlFilter: '*',
      resourceTypes: ALL_RESOURCE_TYPES,
      ...extraCondition,
    },
  };
}

/**
 * Single writer for declarativeNetRequest session rules.
 * Rebuilds rules for every open http(s) tab whose origin is enabled.
 */
export class DnrHeaderSync {
  private syncing = false;
  private pending = false;

  /** Schedule a full sync; coalesces concurrent calls. */
  async syncAll(): Promise<void> {
    if (this.syncing) {
      this.pending = true;
      return;
    }
    this.syncing = true;
    try {
      do {
        this.pending = false;
        await this.performSync();
      } while (this.pending);
    } finally {
      this.syncing = false;
    }
  }

  private async performSync(): Promise<void> {
    const state = await this.readState();
    const requestHeaders = buildModifyHeaderInfos(state.headers);
    const enabledSet = new Set(state.enabledOrigins);

    const existing = await chrome.declarativeNetRequest.getSessionRules();
    const removeRuleIds = existing.map(rule => rule.id);

    const tabs = await chrome.tabs.query({});
    const addRules: chrome.declarativeNetRequest.Rule[] = [];

    if (requestHeaders.length > 0 && enabledSet.size > 0) {
      for (const tab of tabs) {
        if (typeof tab.id !== 'number') continue;
        const origin = originFromUrl(tab.url);
        if (!origin || !enabledSet.has(origin)) continue;

        addRules.push(
          makeHeaderRule(ruleIdForTab(tab.id), requestHeaders, {
            tabIds: [tab.id],
          }),
        );
      }

      // Service Worker / Turbo HTML fetches have no tabId, so tabIds rules miss them.
      // initiatorDomains still matches requests started by that site (including its SW).
      const hosts = [
        ...new Set(
          [...enabledSet].map(hostnameFromOrigin).filter(Boolean),
        ),
      ];
      hosts.forEach((host, index) => {
        addRules.push(
          makeHeaderRule(DNR_ORIGIN_RULE_ID_BASE + index, requestHeaders, {
            initiatorDomains: [host],
          }),
        );
      });
    }

    try {
      await chrome.declarativeNetRequest.updateSessionRules({
        removeRuleIds,
        addRules,
      });
    } catch (error) {
      console.error('[HeaderModify] Failed to update session rules', error);
      // Some Chrome versions reject remove of Sec-CH-UA*; retry with SET-only headers.
      const fallbackRules: chrome.declarativeNetRequest.Rule[] = [];
      for (const rule of addRules) {
        const headers = rule.action.requestHeaders?.filter(h => h.operation !== 'remove') ?? [];
        if (!headers.length) continue;
        fallbackRules.push({
          id: rule.id,
          priority: rule.priority,
          condition: rule.condition,
          action: {
            type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
            requestHeaders: headers,
          },
        });
      }
      if (!fallbackRules.length) return;
      try {
        await chrome.declarativeNetRequest.updateSessionRules({
          removeRuleIds,
          addRules: fallbackRules,
        });
        console.warn('[HeaderModify] Session rules applied without UA Client Hint removals');
      } catch (fallbackError) {
        console.error('[HeaderModify] Fallback session rules also failed', fallbackError);
      }
    }

    await this.updateBadges(tabs, enabledSet, requestHeaders.length > 0);
  }

  private async readState(): Promise<HeaderAppState> {
    const { header_modify_state } = await chrome.storage.local.get('header_modify_state');
    if (header_modify_state && typeof header_modify_state === 'object') {
      return header_modify_state as HeaderAppState;
    }
    return { headers: [], enabledOrigins: [] };
  }

  /** Show ON badge on tabs where rewriting is active. */
  private async updateBadges(tabs: chrome.tabs.Tab[], enabledSet: Set<string>, hasHeaders: boolean): Promise<void> {
    await Promise.all(
      tabs.map(async tab => {
        if (typeof tab.id !== 'number') return;
        const origin = originFromUrl(tab.url);
        const active = Boolean(hasHeaders && origin && enabledSet.has(origin));
        try {
          await chrome.action.setBadgeText({
            tabId: tab.id,
            text: active ? 'ON' : '',
          });
          if (active) {
            await chrome.action.setBadgeBackgroundColor({
              tabId: tab.id,
              color: '#0F766E',
            });
          }
        } catch {
          // Tab may have closed between query and badge update.
        }
      }),
    );
  }
}

export const dnrHeaderSync = new DnrHeaderSync();
