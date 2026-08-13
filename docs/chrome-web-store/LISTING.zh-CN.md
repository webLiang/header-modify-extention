# Chrome 网上应用店 Listing 文案（中文）

> 粘贴到 [开发者信息中心](https://chrome.google.com/webstore/devconsole) → 商店信息。  
> Manifest 短描述在 `_locales/zh_CN/messages.json`（`extensionDescription`）。

**开源仓库：** [https://github.com/webLiang/header-modify-extention](https://github.com/webLiang/header-modify-extention)

---

## 名称

```
请求头修改
```

（英文主 listing 可用 `Header Modify`。）

## 简短说明（≤132 字符）

中文 locale：

```
开源扩展：按网站修改 HTTP 请求头，支持 iframe；可粘贴 Chrome 开发者工具复制的请求头。
```

英文主短描述（商店主语言常用英文）：

```
Open-source tool to edit HTTP request headers per site, including iframe requests. Paste from Chrome DevTools.
```

## 详细说明（中文，可粘贴到中文 locale）

```
请求头修改（Header Modify）是一款开源的 Chrome 扩展，用于在你启用的网站上改写 HTTP 请求头。

【开源】
本扩展完全开源，欢迎阅读源码、核对权限、提 Issue 与贡献：
https://github.com/webLiang/header-modify-extention
无混淆、无远程代码、无广告；商店安装包与公开仓库一致，可审计。

【单一用途】
本扩展只做一件事：在你启用的站点上，通过 Manifest V3 的 declarativeNetRequest modifyHeaders（set：没有则添加、有则覆盖），改写该标签页发出的网络请求头，并覆盖 iframe 内请求。

【适用人群】
• 需要调试鉴权、CORS、语言或 CDN 边界条件的前端开发者
• 需要复现特定客户端请求头的测试人员
• 临时覆盖 User-Agent / 自定义头的高级用户

【使用方法】
1. 安装后默认全部站点关闭，不影响其它网站。
2. 打开普通 http(s) 页面，点击工具栏图标，粘贴从 Chrome 开发者工具复制的请求头（或手动添加）。
3. 开启「为当前网站启用」，刷新页面后在 Network 中检查请求头是否生效。
4. 同一标签页内的跨域 iframe 请求也会被改写（session 规则使用 tabIds）。

【权限说明】
• storage — 仅在本地保存请求头、启用站点与语言偏好（不上传）
• tabs — 识别当前标签页 origin，并保持规则同步
• declarativeNetRequest — 应用请求头改写
• declarativeNetRequestFeedback — 规则诊断 / 徽标相关能力
• 主机权限（<all_urls>）— 用户可能在任意站点临时开启；修改跨域 iframe 请求也需要

【隐私】
不收集个人数据、浏览历史或页面内容，不向任何服务器发送数据。设置仅保存在本机 chrome.storage.local。详见本 listing 中的隐私政策链接。

【不适用】
不用于绕过付费墙、DRM、登录限制或任何违法用途。本工具仅按你的配置改写请求头，供正当调试与测试。

【源码与支持】
GitHub：https://github.com/webLiang/header-modify-extention
Issues：https://github.com/webLiang/header-modify-extention/issues
```

## 分类

```
Developer Tools（开发者工具）
```

## 官方网站

```
https://github.com/webLiang/header-modify-extention
```

## 支持网址

```
https://github.com/webLiang/header-modify-extention/issues
```

## 隐私政策

```
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.zh-CN.md
```

（英文版：`PRIVACY.md`）

## 图片

与 `LISTING.en.md` 相同，见 `images/`。
