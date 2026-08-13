# Chrome Web Store listing copy (English)

> Paste into [Developer Dashboard](https://chrome.google.com/webstore/devconsole) → Store listing.  
> Manifest short description lives in `_locales/en/messages.json` (`extensionDescription`).

**Open source:** [https://github.com/webLiang/header-modify-extention](https://github.com/webLiang/header-modify-extention)

---

## Item name

```
Header Modify
```

## Short description (≤132 characters)

```
Open-source tool to edit HTTP request headers per site, including iframe requests. Paste from Chrome DevTools.
```

Character count: **112** (within limit).

## Detailed description

```
Header Modify is an open-source Chrome extension that rewrites HTTP request headers for websites you enable.

OPEN SOURCE
Fully open source on GitHub — read the code, audit permissions, file issues, and contribute:
https://github.com/webLiang/header-modify-extention
No obfuscation, no remote code, no ads. What you install matches the public repository.

SINGLE PURPOSE
This extension does one thing: on origins you enable, it applies your header overrides to network requests from that tab (including iframes) using Manifest V3 declarativeNetRequest modifyHeaders with set semantics (add if missing, replace if present).

WHO IT IS FOR
• Front-end developers debugging auth, CORS, locale, or CDN edge cases
• QA engineers reproducing client header conditions
• Power users who need temporary User-Agent / custom header overrides

HOW TO USE
1. After install, rewriting is OFF for every site by default.
2. Open a normal http(s) page, click the toolbar icon, and paste headers copied from Chrome DevTools (or add them manually).
3. Turn on “Enable for this site”. Reload the page and inspect Network — requests should show your headers.
4. Cross-origin iframe requests in the same tab are included (session rules use tabIds).

PERMISSIONS
• storage — save headers, enabled origins, and language preference locally (never uploaded)
• tabs — read the active tab URL/origin so rules stay in sync
• declarativeNetRequest — apply header modifications
• declarativeNetRequestFeedback — optional rule diagnostics / badge support
• host access (<all_urls>) — required to modify headers on arbitrary sites and iframe requests you enable

PRIVACY
No personal data, browsing history, or page content is collected or sent to any server. Settings stay in chrome.storage.local on your device. See the Privacy Policy linked on this listing.

NOT FOR
Bypassing paywalls, DRM, account gates, or any unlawful use. This tool only rewrites request headers you configure for legitimate debugging and testing.

SOURCE & SUPPORT
GitHub: https://github.com/webLiang/header-modify-extention
Issues: https://github.com/webLiang/header-modify-extention/issues
```

## Category

```
Developer Tools
```

## Language

Primary: English  
Also provide Chinese, Spanish, Hindi, and Arabic listings (see sibling `LISTING.*.md` files).

## Official URL

```
https://github.com/webLiang/header-modify-extention
```

## Support URL

```
https://github.com/webLiang/header-modify-extention/issues
```

## Privacy policy URL

```
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.md
```

## Promo video (optional)

Leave empty unless you publish a short YouTube demo (paste DevTools headers → enable site → Network shows overrides).

## Images to upload

| Field | File |
|-------|------|
| Store icon | `images/icon-128.png` |
| Small promo tile | `images/promo-small-440x280.png` |
| Marquee promo tile | `images/promo-marquee-1400x560.png` |
| Screenshots (1–5) | `images/screenshot-01` … `screenshot-05` |

## Visibility / distribution

Public · Chrome Web Store (and optionally other Chromium stores with the same package).
