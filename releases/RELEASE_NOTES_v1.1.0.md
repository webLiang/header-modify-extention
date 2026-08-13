## v1.1.0

Compared to `v1.0.0`.

### Changes

- **feat(docs/chrome-web-store): add site verification instructions and new screenshot assets** (`9d21ef1`)
- **feat(repo): add preview images and usage instructions to README files** (`dae0e68`)

### Release highlights

### English

- User-Agent overrides strip Client Hints (Sec-CH-UA*) and now apply to Service Worker / Turbo document requests, not only in-tab XHR.
- add site verification instructions and new screenshot assets

### 简体中文

- 改写 User-Agent 时会去掉 Client Hints（Sec-CH-UA*），并覆盖 Service Worker / Turbo 的页面请求，不只是标签页内的 XHR。

### Español

- Al anular User-Agent se eliminan las Client Hints (Sec-CH-UA*) y ahora también se aplica a peticiones de documento de Service Worker / Turbo, no solo a XHR de la pestaña.

### العربية

- عند تجاوز User-Agent تُزال تلميحات العميل (Sec-CH-UA*) وتُطبَّق الآن على طلبات المستند من Service Worker / Turbo وليس فقط على XHR داخل علامة التبويب.

### हिन्दी

- User-Agent ओवरराइड Sec-CH-UA* Client Hints हटाता है, और अब केवल टैब XHR नहीं बल्कि Service Worker / Turbo दस्तावेज़ अनुरोधों पर भी लागू होता है।

### Install

Download the `.zip` from [GitHub Releases](https://github.com/webLiang/header-modify-extention/releases).

Chrome: unzip, open `chrome://extensions`, enable **Developer mode**, then **Load unpacked** and select the unzipped folder.
