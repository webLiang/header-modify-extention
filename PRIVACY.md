# Header Modify — Privacy Policy

> English · [中文](./PRIVACY.zh-CN.md)

**Last updated:** 2026-08-06

## Summary

Header Modify does **not** collect, store on remote servers, or transmit any personal data or browsing content.

## Data stored locally

The extension saves settings on your device using `chrome.storage.local`:

| Key / data | Purpose | Default |
|------------|---------|---------|
| Header list (`headers`) | Name / value / enabled flags for request header overrides | `[]` |
| Enabled origins (`enabledOrigins`) | Origins where rewriting is turned on | `[]` (all sites off) |
| Preferred locale (`preferred_locale`) | Popup UI language override | browser language / English |

These values never leave your browser. Declarative Net Request session rules are built only for open tabs whose origin is in `enabledOrigins`.

## What the extension does on the network

When a site is enabled and you have configured headers, the extension registers Manifest V3 `declarativeNetRequest` session rules that **set** those request headers for matching tab traffic (including iframes).

The extension does **not** read passwords, form fields, cookies, or page text for analytics. It does not phone home.

## Permissions

- **storage** — persist headers, enabled origins, and locale locally  
- **tabs** — resolve the active tab origin and keep rules in sync  
- **declarativeNetRequest** — apply header modifications  
- **declarativeNetRequestFeedback** — optional rule diagnostics  
- **host access (`<all_urls>`)** — required to modify headers on sites you enable (including cross-origin iframe requests)

## Third parties

No analytics SDKs, ad networks, or remote configuration services are included.

## Contact

Questions about privacy: open an issue at  
https://github.com/webLiang/header-modify-extention/issues
