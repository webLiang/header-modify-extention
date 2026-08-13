# 请求头修改（Header Modify）— 隐私政策

> 中文 · [English](./PRIVACY.md)

**最近更新：** 2026-08-06

## 摘要

Header Modify **不会**收集、上传到远程服务器或传输任何个人数据或浏览内容。

## 本地存储的数据

扩展使用 `chrome.storage.local` 仅在你的设备上保存设置：

| 数据 | 用途 | 默认 |
|------|------|------|
| 请求头列表（`headers`） | 改写用的名称 / 值 / 启用开关 | `[]` |
| 启用站点（`enabledOrigins`） | 已开启改写的 origin | `[]`（全部关闭） |
| 语言偏好（`preferred_locale`） | Popup 界面语言 | 浏览器语言 / 英语 |

这些数据不会离开你的浏览器。仅当标签页的 origin 位于 `enabledOrigins` 时，才会注册 declarativeNetRequest session 规则。

## 网络行为

在你启用站点并配置请求头后，扩展会注册 Manifest V3 `declarativeNetRequest` session 规则，对匹配标签页的流量（含 iframe）执行请求头 **set**（无则添加、有则覆盖）。

扩展**不会**为分析目的读取密码、表单、Cookie 或页面正文，也不会向外部服务器上报。

## 权限

- **storage** — 本地保存请求头、启用站点与语言  
- **tabs** — 识别当前标签页 origin 并同步规则  
- **declarativeNetRequest** — 应用请求头改写  
- **declarativeNetRequestFeedback** — 可选的规则诊断  
- **主机权限（`<all_urls>`）** — 修改你启用站点上的请求头（含跨域 iframe）所必需  

## 第三方

不包含分析 SDK、广告网络或远程配置服务。

## 联系

隐私相关问题请在仓库提 Issue：  
https://github.com/webLiang/header-modify-extention/issues
