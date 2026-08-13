# Chrome Web Store — Review justification

> Use when filling the dashboard questionnaire or responding to reviewer questions.  
> Keep answers factual and aligned with the shipped `dist/` / source code.

## Open source

**Repository:** https://github.com/webLiang/header-modify-extention

The extension is fully open source. Reviewers (and users) can audit the package against the public repo: no obfuscation, no remote code loading, no ads. Store listing Official URL / Homepage should point at this repository, with the repo link still in the detailed description.

## Single purpose

**Purpose:** Let users define HTTP request header overrides and apply them **only on origins they explicitly enable**, for all network requests from matching tabs (including iframes), via Manifest V3 `declarativeNetRequest` `modifyHeaders` with `set` semantics.

This is a single, focused open-source developer utility. It does not replace the new tab page, inject ads, change search, download media, or provide unrelated features.

### 商店后台在哪填？

Chrome 开发者信息中心 **没有** 名叫「单一用途」的独立输入框。你看到的是 [单一用途政策](https://developer.chrome.com/docs/webstore/program-policies/quality-guidelines-faq#single-purpose) 提示，审核会对照下面几处是否只讲一件事：

| 后台位置 | 贴哪段 |
|---|---|
| **商店信息 → 详细说明**（必填，审核主要看这里） | `LISTING.zh-CN.md` / `LISTING.en.md` 里的 **【单一用途】 / SINGLE PURPOSE** 整段 |
| **商店信息 → 名称 / 简短说明** | 名称：`请求头修改` / `Header Modify`；短描述见同文件（只写改请求头） |
| **隐私权 / 权限说明**（若有自由文本） | 下面「可贴中文」 |
| 审核邮件回复 | 文末 one-paragraph reply |

分类选 **Developer Tools（开发者工具）**。

### 可贴中文（问卷 / 权限说明自由文本）

```
本扩展只有一个用途：在用户明确启用的网站上，通过 Manifest V3 declarativeNetRequest modifyHeaders（set：没有则添加、有则覆盖），改写该标签页发出的 HTTP 请求头（含 iframe）。默认全部站点关闭。不做新标签页替换、广告、搜索劫持、媒体下载或其它无关功能。开源仓库：https://github.com/webLiang/header-modify-extention
```

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
