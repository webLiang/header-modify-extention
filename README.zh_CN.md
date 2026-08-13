# 请求头修改（Header Modify）

**语言**

- **English**：[README.md](README.md)
- **中文**（当前）：[README.zh_CN.md](README.zh_CN.md)

用于**改写当前网站请求头**的 Chrome 扩展。启用后，该标签页内的请求（含 **iframe / XHR / fetch / 媒体**）都会应用你配置的请求头；语义为 **set**（没有则添加，有则覆盖）。

> **基于模板：** [chrome-extension-boilerplate-react-vite](https://github.com/webLiang/chrome-extension-boilerplate-react-vite) — React + **Vite 8** 的 Manifest V3 脚手架，构建更快。欢迎 **Star** 与 **Merge Request**。

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

---

## 更新日志

| 版本 | 说明 |
|---|---|
| v1.0.0 | 首个开源版本：Popup 编辑、DevTools 粘贴、按站启用、DNR 标签页作用域改写 |

---

## 许可证

MIT
