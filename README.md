# Header Modify

**Languages**

- **English** (current)：[README.md](README.md)
- **中文**：[README.zh_CN.md](README.zh_CN.md)

Chrome extension that **rewrites request headers** for the current site. When enabled, every request from that tab — including **iframe / XHR / fetch / media** — gets your headers applied with **set** semantics (add if missing, replace if present).

> **Built with:** [chrome-extension-boilerplate-react-vite](https://github.com/webLiang/chrome-extension-boilerplate-react-vite) — a React + **Vite 8** Manifest V3 boilerplate with **faster builds**. This extension is developed on top of that template. **Stars** and **Merge Requests** are welcome.

---

## Features

- Enable rewriting **per site** (remembered by origin).
- Applies to the **current tab’s requests**, including cross-origin **iframes** (via `declarativeNetRequest` session rules + `tabIds`).
- Paste headers copied from Chrome DevTools (alternate name/value lines), `Name: Value` blocks, or cURL `-H` flags.
- Edit / toggle / delete individual headers in the popup.
- Export / import JSON profiles.
- UI languages: English, 中文, Español, हिन्दी, العربية.

---

## How it works

Manifest V3 cannot use blocking `webRequest`. This extension uses:

`chrome.declarativeNetRequest.updateSessionRules`

with `action.type = "modifyHeaders"` and `operation: "set"`.

Rules are scoped with `condition.tabIds` so all resource types inside the enabled tab are covered. Header lists and enabled origins persist in `chrome.storage.local`; session rules are rebuilt when tabs or settings change.

**Note:** Chrome may still reject modification of some protected headers. Behavior can vary by browser version.

---

## Install (development)

```bash
pnpm install
pnpm build
```

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder

Dev mode with reload:

```bash
pnpm dev
```

---

## Usage

1. Open a normal `http(s)` page.
2. Click the extension icon.
3. Paste DevTools request headers (or add them manually).
4. Turn on **Enable for this site**.
5. Reload the page and inspect Network — requests should show your headers.

### DevTools paste example

```text
sec-fetch-user
?1
upgrade-insecure-requests
1
user-agent
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
```

---

## Permissions

| Permission | Why |
|---|---|
| `storage` | Persist headers, enabled origins, language |
| `tabs` | Resolve the active tab / origin and keep rules in sync |
| `declarativeNetRequest` | Apply header modifications |
| `declarativeNetRequestFeedback` | Optional feedback APIs for rule diagnostics |
| `<all_urls>` host permission | Required to modify headers on page / iframe requests |

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Watch build + HMR helpers |
| `pnpm build` | Typecheck + production build → `dist/` |
| `pnpm test` | Vitest (watch) |
| `pnpm test:run` | Vitest once |
| `pnpm lint` | ESLint |

---

## Changelog

| Version | Notes |
|---|---|
| v1.0.0 | Initial open-source release: popup editor, DevTools paste, per-site enable, DNR tab-scoped rewrite |

---

## License

MIT
