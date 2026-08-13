# Chrome Web Store — Review justification

> Use when filling the dashboard questionnaire or responding to reviewer questions.  
> Keep answers factual and aligned with the shipped `dist/` / source code.

## Open source

**Repository:** https://github.com/webLiang/header-modify-extention

The extension is fully open source. Reviewers (and users) can audit the package against the public repo: no obfuscation, no remote code loading, no ads. Store listing Official URL / Homepage should point at this repository, with the repo link still in the detailed description.

## Single purpose

**Purpose:** Let users define HTTP request header overrides and apply them **only on origins they explicitly enable**, for all network requests from matching tabs (including iframes), via Manifest V3 `declarativeNetRequest` `modifyHeaders` with `set` semantics.

This is a single, focused open-source developer utility. It does not replace the new tab page, inject ads, change search, download media, or provide unrelated features.

## Why broad host access (`<all_urls>`)

Modifying request headers (especially for cross-origin iframe / XHR / fetch targets) requires host permissions for the request URL. Users may enable the tool on arbitrary sites during legitimate debugging, so host access cannot be limited to a fixed allowlist of domains in the manifest.

Runtime behavior is still restricted:

- Default: **no origins enabled**
- Session DNR rules are registered only for open tabs whose origin is in the local `enabledOrigins` list
- Header list is user-authored; the extension does not scrape page content

## Permission justification

| Permission | Justification |
|------------|----------------|
| `storage` | Persist header list, enabled origins, and preferred locale. Never uploaded. |
| `tabs` | Popup needs the active tab’s URL/origin; background syncs session rules when tabs update/close. |
| `declarativeNetRequest` | Apply `modifyHeaders` (`set`) via `updateSessionRules` with `tabIds` scoping. |
| `declarativeNetRequestFeedback` | Optional diagnostics / action options for rule feedback. |
| `host_permissions: <all_urls>` | Required to modify headers on arbitrary http(s) sites and cross-origin iframe requests when the user enables that origin. |

## Data usage / privacy

- **Collected remotely:** none  
- **Stored locally:** header overrides, enabled origins, preferred locale (`chrome.storage.local`)  
- **Sold / shared / used for ads:** no  
- Privacy policy: repository `PRIVACY.md` / `PRIVACY.zh-CN.md`

## Remote code / obfuscation

- All logic ships inside the extension package (background service worker + popup)
- No remote script loading, no `eval` / `new Function` for app logic
- Production package is plain readable JS from Vite minify (no obfuscator)

## What this extension is NOT

- Not a paywall / DRM / login-wall bypass
- Not for stealing credentials or scraping private content
- Not for circumventing site ToS for piracy; intended for debugging and testing headers on pages the user can already load

## Suggested one-paragraph reply to reviewers

> Header Modify is open source (https://github.com/webLiang/header-modify-extention) with a single purpose: on user-enabled origins only, apply user-configured HTTP request header overrides to that tab’s network requests (including iframes) using declarativeNetRequest modifyHeaders. Host access is broad because header modification must cover arbitrary request URLs and cross-origin iframes, but the default is off and rules are limited to a local enabled-origins list. We do not collect or transmit user data; the shipped package is plain, auditable JS with no remote code.
