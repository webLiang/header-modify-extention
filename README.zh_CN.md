# 请求头修改（Header Modify）

**语言**

- **English**：[README.md](README.md)
- **中文**（当前）：[README.zh_CN.md](README.zh_CN.md)

<p align="center">
  <img src="docs/chrome-web-store/images/promo-marquee-1400x560.png" alt="Header Modify — 为当前网站改写 HTTP 请求头" width="840">
</p>

用于**改写当前网站请求头**的 Chrome 扩展。启用后，该标签页内的请求（含 **iframe / XHR / fetch / 媒体**）都会应用你配置的请求头；语义为 **set**（没有则添加，有则覆盖）。

> **基于模板：** [chrome-extension-boilerplate-react-vite](https://github.com/webLiang/chrome-extension-boilerplate-react-vite) — React + **Vite 8** 的 Manifest V3 脚手架，构建更快。欢迎 **Star** 与 **Merge Request**。

---

## Chrome 网上应用店

发布指南、可粘贴的五语商店文案、隐私政策、审核说明与宣传图：

- [STORE.zh-CN.md](STORE.zh-CN.md) · [STORE.md](STORE.md)
- [docs/chrome-web-store/](docs/chrome-web-store/) — 文案、图片、提交清单
- [PRIVACY.zh-CN.md](PRIVACY.zh-CN.md) · [PRIVACY.md](PRIVACY.md)

```bash
pnpm build
pnpm zip   # → releases/header-modify-extention_v{version}.zip
```

重新生成图标 / 商店图：

```bash
pnpm assets:store
pnpm build
```

---

## 界面演示

**为当前网站启用** — 按 origin 打开改写。下面列表里的请求头按 *set* 语义生效（没有则添加，有则覆盖）。

<p align="center">
  <img src="docs/chrome-web-store/images/screenshot-01-popup-enabled.png" alt="弹窗：已为当前站点启用，并列出 user-agent / x-debug / accept-language" width="840">
</p>

**从 DevTools 粘贴** — 从 Chrome Network 复制请求头（名称/值交替行、`Name: Value` 或 cURL `-H`），粘贴后点 **Parse & Merge**。

<p align="center">
  <img src="docs/chrome-web-store/images/screenshot-02-paste-devtools.png" alt="弹窗：粘贴 DevTools 请求头并 Parse & Merge" width="840">
</p>

**包含 iframe** — session 规则按 `tabIds` 作用在当前标签页，主文档、跨域 iframe、XHR、fetch、媒体请求都会带上同一套请求头。

<p align="center">
  <img src="docs/chrome-web-store/images/screenshot-05-iframe-scope.png" alt="示意图：同一标签页内主页面与跨域 iframe 请求都应用相同规则" width="840">
</p>

---

## 功能

- **按网站启用**（按 origin 记忆）。
- 作用域为**当前标签页全部请求**，包含跨域 **iframe**（`declarativeNetRequest` session 规则 + `tabIds`）。
- 支持粘贴 Chrome 开发者工具复制的请求头（名称/值交替行）、`Name: Value`，以及 cURL `-H`。
- Popup 内编辑 / 开关 / 删除单项请求头。
- JSON 导入导出。
- 界面语言：English、中文、Español、हिन्दी、العربية。

---

## 原理

Manifest V3 不能使用阻塞式 `webRequest`。本扩展使用：

`chrome.declarativeNetRequest.updateSessionRules`

`modifyHeaders` + `operation: "set"`。

通过 `condition.tabIds` 覆盖该标签页内各类资源。请求头与启用站点存于 `chrome.storage.local`；标签页或配置变化时重建 session 规则。

**说明：** 部分受保护请求头可能无法被 Chrome 修改，具体以浏览器版本为准。

---

## 安装（开发）

```bash
pnpm install
pnpm build
```

1. 打开 `chrome://extensions/`
2. 打开 **开发者模式**
3. **加载已解压的扩展程序**，选择 `dist/` 目录

开发热更新：

```bash
pnpm dev
```

---

## 使用

<p align="center">
  <img src="docs/chrome-web-store/images/screenshot-04-how-it-works.png" alt="使用步骤：打开页面、粘贴请求头、为当前站点启用、刷新并在 Network 中检查" width="840">
</p>

1. 打开普通 `http(s)` 页面。
2. 点击扩展图标。
3. 粘贴开发者工具中的请求头（或手动添加）。
4. 打开 **为当前网站启用**。
5. 刷新页面，在 Network 中检查请求头是否生效。

### 开发者工具粘贴示例

```text
sec-fetch-user
?1
upgrade-insecure-requests
1
user-agent
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
```

---

## 权限说明

| 权限 | 用途 |
|---|---|
| `storage` | 持久化请求头、启用站点、语言 |
| `tabs` | 识别当前标签页 / origin 并同步规则 |
| `declarativeNetRequest` | 改写请求头 |
| `declarativeNetRequestFeedback` | 规则诊断相关能力 |
| `<all_urls>` | 修改页面与 iframe 请求头所需 |

---

## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 监听构建 |
| `pnpm build` | 类型检查 + 生产构建 → `dist/` |
| `pnpm test` | Vitest（watch） |
| `pnpm test:run` | Vitest 单次 |
| `pnpm lint` | ESLint |
| `pnpm zip` | 打包 `dist/` → `releases/header-modify-extention_v*.zip` |
| `pnpm build:zip` | 生产构建 + zip |
| `pnpm release:github:dry` | 构建 zip 并预览 GitHub Release 说明（不打 tag / 不推送） |
| `pnpm release:github:full` | 构建、提交、打 tag、`gh release create`、推送 |
| `pnpm assets:store` | 重新生成图标与商店宣传图/截图 |

---

## 更新日志

| 版本 | 说明 |
|---|---|
| v1.0.0 | 首个开源版本：Popup 编辑、DevTools 粘贴、按站启用、DNR 标签页作用域改写 |

---

## 许可证

MIT
