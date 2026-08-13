# Chrome Web Store publishing guide

> English · [中文](./STORE.zh-CN.md)

## 1. Pack

```bash
cd header-modify-extention
pnpm build
pnpm zip
```

Output: `releases/header-modify-extention_v{version}.zip` containing the contents of `dist/` (ready to upload). Keep `package.json` and `dist/manifest.json` versions in sync.

Regenerate icons / promo images if needed:

```bash
python3 scripts/generate-store-assets.py
pnpm build
```

## 2. Upload

1. Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Create / select the item → upload the zip
3. Fill listing fields from [`docs/chrome-web-store/`](./docs/chrome-web-store/)

## 3. Listing copy

Use the language files under `docs/chrome-web-store/`:

| Locale | File |
|--------|------|
| English | [LISTING.en.md](./docs/chrome-web-store/LISTING.en.md) |
| 中文（简体） | [LISTING.zh-CN.md](./docs/chrome-web-store/LISTING.zh-CN.md) |
| Español | [LISTING.es.md](./docs/chrome-web-store/LISTING.es.md) |
| हिन्दी | [LISTING.hi.md](./docs/chrome-web-store/LISTING.hi.md) |
| العربية | [LISTING.ar.md](./docs/chrome-web-store/LISTING.ar.md) |

Images: [`docs/chrome-web-store/images/`](./docs/chrome-web-store/images/)

## 4. Privacy & review

- Privacy policy: [PRIVACY.md](./PRIVACY.md) / [PRIVACY.zh-CN.md](./PRIVACY.zh-CN.md)
- Review justification: [REVIEW_JUSTIFICATION.md](./docs/chrome-web-store/REVIEW_JUSTIFICATION.md)
- Full checklist: [docs/chrome-web-store/README.md](./docs/chrome-web-store/README.md)

## 5. Suggested listing fields (English primary)

### Name

`Header Modify`

### Short description (≤132)

`Open-source tool to edit HTTP request headers per site, including iframe requests. Paste from Chrome DevTools.`

### Category

`Developer Tools`

### Official / Support / Privacy URLs

```
https://github.com/webLiang/header-modify-extention
https://github.com/webLiang/header-modify-extention/issues
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.md
```

## 6. Official URL site verification (`google*.html`)

Chrome Web Store **Official URL** only lists sites you verified in [Google Search Console](https://search.google.com/search-console). The HTML file Google gave you (`google9d8d8d94157e2aa4.html`) must be served at the **website root**, not inside the extension zip.

This repo already has GitHub Pages (`master` / `/`):

```
https://webliang.github.io/header-modify-extention/
```

1. Keep `google9d8d8d94157e2aa4.html` at the **repository root** (do not move it into `public/` or `dist/`).
2. Commit and push to `master`. Do not change the filename or the one-line body.
3. Open in a private window (must be public, no login):  
   https://webliang.github.io/header-modify-extention/google9d8d8d94157e2aa4.html
4. In Search Console / CWS **Add a new site**, verify this URL prefix:  
   `https://webliang.github.io/header-modify-extention/`
5. After it succeeds, pick that URL in the listing **Official URL** dropdown.

HTML-file verification **cannot** prove `https://github.com/webLiang/header-modify-extention` — you do not control `github.com`. Keep the GitHub repo link in the listing description; use the `github.io` site as the verified Official URL.
