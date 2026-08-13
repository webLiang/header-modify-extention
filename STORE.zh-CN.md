# Chrome 网上应用店发布指南

> 中文 · [English](./STORE.md)

## 1. 打包

```bash
cd header-modify-extention
pnpm build
pnpm zip
```

产物：`releases/header-modify-extention_v{version}.zip`（`dist/` 内容，可直接上传）。保持 `package.json` 与 `dist/manifest.json` 版本一致。

需要重做图标 / 宣传图时：

```bash
python3 scripts/generate-store-assets.py
pnpm build
```

## 2. 上传

1. 打开 [Chrome 网上应用店开发者信息中心](https://chrome.google.com/webstore/devconsole)
2. 创建 / 选择商品 → 上传 zip
3. 按 [`docs/chrome-web-store/`](./docs/chrome-web-store/) 填写商店信息

## 3. 文案与图片

| 语言 | 文件 |
|------|------|
| English | [LISTING.en.md](./docs/chrome-web-store/LISTING.en.md) |
| 中文（简体） | [LISTING.zh-CN.md](./docs/chrome-web-store/LISTING.zh-CN.md) |
| Español | [LISTING.es.md](./docs/chrome-web-store/LISTING.es.md) |
| हिन्दी | [LISTING.hi.md](./docs/chrome-web-store/LISTING.hi.md) |
| العربية | [LISTING.ar.md](./docs/chrome-web-store/LISTING.ar.md) |

图片目录：[`docs/chrome-web-store/images/`](./docs/chrome-web-store/images/)

## 4. 隐私与审核

- 隐私政策：[PRIVACY.zh-CN.md](./PRIVACY.zh-CN.md) / [PRIVACY.md](./PRIVACY.md)
- 审核说明：[REVIEW_JUSTIFICATION.md](./docs/chrome-web-store/REVIEW_JUSTIFICATION.md)
- 完整清单：[docs/chrome-web-store/README.md](./docs/chrome-web-store/README.md)

## 5. 建议填写（中文 locale）

### 名称

`请求头修改`

### 简短说明（≤132）

`开源扩展：按网站修改 HTTP 请求头，支持 iframe；可粘贴 Chrome 开发者工具复制的请求头。`

### 分类

`开发者工具`（Developer Tools）

### 官方 / 支持 / 隐私 URL

```
https://github.com/webLiang/header-modify-extention
https://github.com/webLiang/header-modify-extention/issues
https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.zh-CN.md
```

## 6. 官方网址验证（`google*.html`）

商店 **官方网址** 下拉框里，只能选你已在 [Google Search Console](https://search.google.com/search-console) 验证过的站点。Google 给你的 `google9d8d8d94157e2aa4.html` 必须能在**网站根路径**直接打开，**不要**打进扩展 zip。

本仓库已开启 GitHub Pages（`master` 分支根目录）：

```
https://webliang.github.io/header-modify-extention/
```

1. 文件放在**仓库根目录**（不要放进 `public/` / `dist/`）。
2. 提交并 push 到 `master`。文件名和那一行内容都不要改。
3. 用无痕窗口打开（必须公开、不用登录）：  
   https://webliang.github.io/header-modify-extention/google9d8d8d94157e2aa4.html
4. Search Console / 商店后台 **添加新网站** 时，验证这个 URL 前缀：  
   `https://webliang.github.io/header-modify-extention/`
5. 通过后，在 listing 的 **官方网址** 里选这个 `github.io` 地址。

HTML 文件验证**无法**证明 `https://github.com/webLiang/header-modify-extention`（你控制不了 `github.com`）。仓库链接继续写在商店详情里即可；已验证的官方网址用 Pages 站点。
