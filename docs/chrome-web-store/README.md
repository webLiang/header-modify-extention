# Chrome Web Store — 上架资源包

> 本目录为 **Header Modify** 提交 Chrome 网上应用店所需的**完整素材**（文案 + 图标 + 介绍图）。  
> 上传步骤见仓库根目录 [STORE.zh-CN.md](../../STORE.zh-CN.md) / [STORE.md](../../STORE.md)。

**开源项目** — 商店文案与官方网址应突出开源，并导向仓库：  
[https://github.com/webLiang/header-modify-extention](https://github.com/webLiang/header-modify-extention)

## 提交时常用 URL（复制）

| 字段 | URL |
|------|-----|
| 官方网址 / 主页（突出开源） | https://github.com/webLiang/header-modify-extention |
| 支持网址 | https://github.com/webLiang/header-modify-extention/issues |
| 隐私政策 | https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.md |
| 隐私政策（中文） | https://github.com/webLiang/header-modify-extention/blob/master/PRIVACY.zh-CN.md |

> 详细说明里须包含仓库链接（见 `LISTING.*.md` 的「OPEN SOURCE / 开源」段）。

## 目录

```
docs/chrome-web-store/
├── README.md                 ← 本说明 + 提交清单
├── LISTING.en.md             ← 英文商店文案
├── LISTING.zh-CN.md          ← 中文商店文案
├── LISTING.es.md             ← 西班牙语文案
├── LISTING.hi.md             ← 印地语文案
├── LISTING.ar.md             ← 阿拉伯语文案
├── REVIEW_JUSTIFICATION.md   ← 审核说明（单一用途 / 权限理由）
└── images/
    ├── icon-128.png
    ├── promo-small-440x280.png
    ├── promo-marquee-1400x560.png
    ├── screenshot-01-popup-enabled.png
    ├── screenshot-02-paste-devtools.png
    ├── screenshot-03-headers-list.png
    ├── screenshot-04-how-it-works.png
    └── screenshot-05-iframe-scope.png
```

## 图片规格对照

| 资源 | 尺寸 | 必填 | 文件 |
|------|------|:----:|------|
| 扩展图标 | 128×128 | ✅ | `images/icon-128.png`（`public/icon-128.png` 同源） |
| 小宣传图 | 440×280 | ✅ | `images/promo-small-440x280.png` |
| Marquee | 1400×560 | 推荐 | `images/promo-marquee-1400x560.png` |
| 截图 | 1280×800 | ✅≥1，最多 5 | `images/screenshot-0*.png` |

格式：PNG。宣传图为 RGB 扁平图。

> 截图为**功能示意合成图**（品牌色 + 真实 popup 文案）。若审核偏好「真实浏览器截图」，可用本机 popup 再拍 1～2 张替换 01 / 03。

## 语言与 `_locales` 对齐

| 商店 locale | Listing 文件 | Manifest `_locales` |
|-------------|--------------|---------------------|
| English | `LISTING.en.md` | `en` |
| 中文（简体） | `LISTING.zh-CN.md` | `zh_CN` |
| Español | `LISTING.es.md` | `es` |
| हिन्दी | `LISTING.hi.md` | `hi` |
| العربية | `LISTING.ar.md` | `ar` |

短描述须与各语言 `extensionDescription` 保持一致（≤132）。

## 提交前清单

### A. 包体

- [ ] `pnpm build && pnpm zip` → `releases/header-modify-extention_v{version}.zip`
- [ ] `package.json` 与 `dist/manifest.json` 版本一致
- [ ] 干净环境加载 zip：开关、粘贴解析、Network 改头正常

### B. 商店 Listing

- [ ] 名称：`Header Modify`（中文 locale 可用「请求头修改」）
- [ ] 简短说明 ≤132（见 `LISTING.*.md`）
- [ ] 详细说明含开源段 + GitHub 链接
- [ ] 官方 / 支持 / 隐私 URL 如上表
- [ ] 分类：**Developer Tools**
- [ ] 语言：与 `_locales` 五种一致
- [ ] 上传 icon / 小宣传图 / 截图（建议 5）/ Marquee

### C. 隐私与权限问卷

- [ ] 声明：**不收集**用户数据（仅本地存储设置）
- [ ] 权限理由见 `REVIEW_JUSTIFICATION.md`
- [ ] 单一用途说明见同文件

### D. 合规自检（摘要）

- [ ] 单一用途：按站改写 HTTP 请求头
- [ ] 文案突出开源并含仓库链接
- [ ] 不绕过付费墙 / DRM / 登录墙
- [ ] 无远程代码、无混淆、无广告/挖矿
- [ ] 默认全站 OFF，按 origin 白名单生效

## 推荐上传顺序（截图）

1. `screenshot-01-popup-enabled.png` — 核心：按站开关  
2. `screenshot-02-paste-devtools.png` — DevTools 粘贴  
3. `screenshot-03-headers-list.png` — 列表编辑  
4. `screenshot-04-how-it-works.png` — 用法 + 隐私  
5. `screenshot-05-iframe-scope.png` — iframe 作用域  

## 重新生成图片

```bash
# 需本机 Python3 + Pillow
pip3 install Pillow
python3 scripts/generate-store-assets.py
```

生成结果写入 `public/`、`src/assets/img/logo.svg` 与本目录 `images/`。
