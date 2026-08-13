#!/usr/bin/env node
/**
 * Build ZIP artifacts and create a GitHub Release with auto-generated notes.
 * Notes: detailed git Changes + multilingual user-facing highlights (not raw i18n key diffs).
 */
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCALES_DIR = path.join(ROOT, 'public', '_locales');
const RELEASES_DIR = path.join(ROOT, 'releases');
const REPO = 'webLiang/header-modify-extention';
const RELEASES_URL = `https://github.com/${REPO}/releases`;

/** Section headings for multilingual release summaries. */
const LOCALE_SECTION_TITLES = {
  en: 'English',
  zh_CN: '简体中文',
  es: 'Español',
  ar: 'العربية',
  hi: 'हिन्दी',
};

/** Fallback line when commits exist but no mapped highlights were detected. */
const GENERIC_IMPROVEMENTS = {
  en: 'Bug fixes and performance improvements.',
  zh_CN: '问题修复与性能优化。',
  es: 'Correcciones de errores y mejoras de rendimiento.',
  ar: 'إصلاحات للأخطاء وتحسينات في الأداء.',
  hi: 'बग फ़िक्स और प्रदर्शन में सुधार।',
};

/** Used when publishing the first tag (no previous v* tag). */
const FIRST_RELEASE_HIGHLIGHTS = {
  en: 'Initial open-source release: paste headers from Chrome DevTools, edit or toggle them in the popup, and enable rewriting per site (including iframes).',
  zh_CN: '首个开源版本：从 Chrome DevTools 粘贴请求头、在弹窗中编辑或开关，并按站点启用改写（含 iframe）。',
  es: 'Primera versión de código abierto: pega cabeceras desde Chrome DevTools, edítalas o actívalas en el popup, y habilita la reescritura por sitio (incluidos iframes).',
  ar: 'الإصدار الأولي مفتوح المصدر: الصق الترويسات من Chrome DevTools وعدّلها أو بدّل تفعيلها في النافذة المنبثقة، وفعّل إعادة الكتابة لكل موقع (بما في ذلك الإطارات).',
  hi: 'पहला ओपन-सोर्स रिलीज़: Chrome DevTools से हेडर पेस्ट करें, पॉपअप में संपादित या टॉगल करें, और प्रति साइट रीराइट चालू करें (iframe सहित)।',
};

/**
 * User-facing release bullets per theme and locale.
 * Extend when adding major UI features so multilingual sections stay accurate.
 */
const THEME_HIGHLIGHTS = {
  devtoolsPaste: {
    en: 'Paste request headers copied from Chrome DevTools (name/value lines, Name: Value, or cURL -H).',
    zh_CN: '支持从 Chrome DevTools 粘贴请求头（交替名称/值、Name: Value 或 cURL -H）。',
    es: 'Pega cabeceras copiadas de Chrome DevTools (líneas nombre/valor, Name: Value o cURL -H).',
    ar: 'الصق ترويسات الطلب المنسوخة من Chrome DevTools (أسطر الاسم/القيمة أو Name: Value أو cURL -H).',
    hi: 'Chrome DevTools से कॉपी किए गए अनुरोध हेडर पेस्ट करें (नाम/मान पंक्तियाँ, Name: Value, या cURL -H)।',
  },
  perSiteEnable: {
    en: 'Enable header rewriting per site; the setting is remembered by origin.',
    zh_CN: '按站点启用请求头改写，并按 origin 记住开关。',
    es: 'Activa la reescritura de cabeceras por sitio; el ajuste se recuerda por origen.',
    ar: 'فعّل إعادة كتابة الترويسات لكل موقع؛ يُحفظ الإعداد حسب الأصل.',
    hi: 'प्रति साइट हेडर रीराइट चालू करें; सेटिंग origin के अनुसार याद रहती है।',
  },
  iframeRewrite: {
    en: 'Applies to the current tab’s requests, including cross-origin iframes, XHR, fetch, and media.',
    zh_CN: '作用于当前标签页的请求，包括跨域 iframe、XHR、fetch 与媒体请求。',
    es: 'Se aplica a las solicitudes de la pestaña actual, incluidos iframes de otro origen, XHR, fetch y medios.',
    ar: 'يُطبَّق على طلبات علامة التبويب الحالية بما في ذلك إطارات iframe عبر الأصول وXHR وfetch والوسائط.',
    hi: 'वर्तमान टैब के अनुरोधों पर लागू, क्रॉस-ऑरिजिन iframe, XHR, fetch और मीडिया सहित।',
  },
  headerEditor: {
    en: 'Add, toggle, or delete individual headers in the popup editor.',
    zh_CN: '在弹窗中新增、开关或删除单条请求头。',
    es: 'Añade, activa o elimina cabeceras individuales en el editor del popup.',
    ar: 'أضف الترويسات الفردية أو بدّل تفعيلها أو احذفها في محرر النافذة المنبثقة.',
    hi: 'पॉपअप एडिटर में अलग-अलग हेडर जोड़ें, टॉगल करें या हटाएँ।',
  },
  exportImport: {
    en: 'Export and import header profiles as JSON.',
    zh_CN: '支持以 JSON 导出 / 导入请求头配置。',
    es: 'Exporta e importa perfiles de cabeceras en JSON.',
    ar: 'صدّر واستورد ملفات الترويسات بتنسيق JSON.',
    hi: 'हेडर प्रोफ़ाइल को JSON के रूप में निर्यात और आयात करें।',
  },
  i18n: {
    en: 'UI languages: English, 中文, Español, العربية, हिन्दी.',
    zh_CN: '界面语言：English、中文、Español、العربية、हिन्दी。',
    es: 'Idiomas de la interfaz: English, 中文, Español, العربية, हिन्दी.',
    ar: 'لغات الواجهة: English و中文 وEspañol والعربية وहिन्दी.',
    hi: 'UI भाषाएँ: English, 中文, Español, العربية, हिन्दी।',
  },
  userAgent: {
    en: 'User-Agent overrides strip Client Hints (Sec-CH-UA*) and now apply to Service Worker / Turbo document requests, not only in-tab XHR.',
    zh_CN: '改写 User-Agent 时会去掉 Client Hints（Sec-CH-UA*），并覆盖 Service Worker / Turbo 的页面请求，不只是标签页内的 XHR。',
    es: 'Al anular User-Agent se eliminan las Client Hints (Sec-CH-UA*) y ahora también se aplica a peticiones de documento de Service Worker / Turbo, no solo a XHR de la pestaña.',
    ar: 'عند تجاوز User-Agent تُزال تلميحات العميل (Sec-CH-UA*) وتُطبَّق الآن على طلبات المستند من Service Worker / Turbo وليس فقط على XHR داخل علامة التبويب.',
    hi: 'User-Agent ओवरराइड Sec-CH-UA* Client Hints हटाता है, और अब केवल टैब XHR नहीं बल्कि Service Worker / Turbo दस्तावेज़ अनुरोधों पर भी लागू होता है।',
  },
};

/** Map i18n message keys to release themes (used with locale diffs vs previous tag). */
const KEY_TO_THEME = {
  pasteSectionTitle: 'devtoolsPaste',
  pastePlaceholder: 'devtoolsPaste',
  parseMerge: 'devtoolsPaste',
  enableForSite: 'perSiteEnable',
  enabledHint: 'perSiteEnable',
  disabledHint: 'perSiteEnable',
  addHeader: 'headerEditor',
  headersSectionTitle: 'headerEditor',
  deleteHeader: 'headerEditor',
  toggleHeader: 'headerEditor',
  exportJson: 'exportImport',
  importJson: 'exportImport',
  language: 'i18n',
  userAgentHint: 'userAgent',
};

/** Match commit subject/body text to release themes. */
const COMMIT_THEME_RULES = [
  { theme: 'devtoolsPaste', test: /devtools|paste|parse.*header|cURL|\b-H\b/i },
  { theme: 'perSiteEnable', test: /per.?site|enable.*site|origin|按站/i },
  { theme: 'iframeRewrite', test: /iframe|dnr|declarativeNetRequest|modifyHeaders|tabIds/i },
  { theme: 'headerEditor', test: /header.*edit|toggle.*header|addHeader|popup/i },
  { theme: 'exportImport', test: /export|import.*json/i },
  { theme: 'i18n', test: /i18n|locale|language|_locales/i },
  { theme: 'userAgent', test: /user-agent|sec-ch-ua|client hint|initiatorDomains|service worker/i },
];

/** @typedef {{ notesFile?: string, bodyFile?: string, assets: string[], dryRun: boolean, publish: boolean, skipBuild: boolean, commit: boolean, push: boolean, title?: string, commitMessage?: string }} CliOptions */

/** Parse CLI flags for release workflow. */
function parseArgs(argv) {
  /** @type {CliOptions} */
  const options = {
    assets: [],
    dryRun: false,
    publish: false,
    skipBuild: false,
    commit: false,
    push: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--publish') {
      options.publish = true;
    } else if (arg === '--full') {
      options.publish = true;
      options.commit = true;
      options.push = true;
    } else if (arg === '--commit') {
      options.commit = true;
    } else if (arg === '--push') {
      options.push = true;
    } else if (arg === '--skip-build') {
      options.skipBuild = true;
    } else if (arg === '--notes-file') {
      options.notesFile = argv[i + 1];
      i += 1;
    } else if (arg === '--body-file') {
      options.bodyFile = argv[i + 1];
      i += 1;
    } else if (arg === '--title') {
      options.title = argv[i + 1];
      i += 1;
    } else if (arg === '--commit-message') {
      options.commitMessage = argv[i + 1];
      i += 1;
    } else if (arg === '--asset') {
      options.assets.push(argv[i + 1]);
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  if (options.publish && options.dryRun) {
    console.error('Use either --dry-run or --publish, not both.');
    process.exit(1);
  }

  return options;
}

/** Print usage help. */
function printHelp() {
  console.log(`Usage: node scripts/github-release.mjs [options]

Options:
  --dry-run              Build + write release notes only (default when --publish omitted)
  --publish              Create git tag and GitHub release (requires gh CLI)
  --full                 Shorthand: --publish --commit --push (one-shot release)
  --commit               git add -A && git commit before tagging (use with --publish)
  --push                 git push current branch + release tag after publish
  --skip-build           Skip pnpm build:zip
  --body-file <path>     Use this markdown as the full release notes (skip auto-generation)
  --notes-file <path>    Append custom markdown to auto-generated release notes
  --commit-message <msg> Commit message (default: chore: release v<version>)
  --title <text>         Override release title (default: v<package.json version>)
  --asset <path>         Extra file to attach (repeatable)

Examples:
  node scripts/github-release.mjs --dry-run
  node scripts/github-release.mjs --full
  node scripts/github-release.mjs --publish --commit --push
  node scripts/github-release.mjs --publish --body-file ./releases/RELEASE_NOTES_v1.0.0.md --skip-build
  node scripts/github-release.mjs --publish --notes-file ./docs/extra-notes.md
  node scripts/github-release.mjs --publish --asset ./docs/install-guide.pdf
`);
}

/** Run shell command and return stdout. */
function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: opts.inherit ? 'inherit' : ['pipe', 'pipe', 'pipe'],
    ...opts,
  }).trim();
}

/** Run shell command; exit on failure. */
function runOrExit(cmd, opts = {}) {
  const result = spawnSync(cmd, {
    cwd: ROOT,
    shell: true,
    stdio: opts.inherit ? 'inherit' : ['pipe', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    const stderr = result.stderr?.toString() || '';
    console.error(stderr || `Command failed: ${cmd}`);
    process.exit(result.status || 1);
  }
  return result.stdout?.toString().trim() ?? '';
}

/** Read package.json name and version. */
function readPackageMeta() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  return { name: pkg.name, version: pkg.version };
}

/** List version tags sorted newest first (v*). */
function listVersionTags() {
  try {
    const out = run("git tag -l 'v*' --sort=-v:refname");
    return out ? out.split('\n').filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** Previous release tag relative to target version (latest tag strictly older). */
function getPreviousTag(version, tags) {
  const currentTag = `v${version}`;
  const older = tags.filter(tag => tag !== currentTag);
  return older[0] || null;
}

/** Load messages.json at git ref; null if missing. */
function loadMessagesAtRef(ref, locale) {
  const filePath = `public/_locales/${locale}/messages.json`;
  try {
    const raw = run(`git show ${ref}:${filePath}`);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Load messages.json from working tree. */
function loadMessagesFromDisk(locale) {
  const filePath = path.join(LOCALES_DIR, locale, 'messages.json');
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/** Diff locale messages between previous tag and HEAD (working tree). */
function diffLocaleMessages(prevTag, locale) {
  const before = loadMessagesAtRef(prevTag, locale);
  const after = loadMessagesFromDisk(locale);
  if (!after) return null;

  const beforeKeys = new Set(before ? Object.keys(before) : []);
  const afterKeys = new Set(Object.keys(after));
  const added = [...afterKeys].filter(key => !beforeKeys.has(key));
  const removed = [...beforeKeys].filter(key => !afterKeys.has(key));
  const changed = [...afterKeys].filter(key => {
    if (!beforeKeys.has(key)) return false;
    return before[key].message !== after[key].message;
  });

  if (!added.length && !removed.length && !changed.length) {
    return null;
  }

  return { added, removed, changed, after, before };
}

/** Collect i18n keys added or changed in en since previous tag. */
function collectChangedMessageKeys(prevTag) {
  if (!prevTag) return [];
  const diff = diffLocaleMessages(prevTag, 'en');
  if (!diff) return [];
  return [...new Set([...diff.added, ...diff.changed])];
}

/** Detect release themes from locale diffs and commit messages. */
function detectReleaseThemes(prevTag, commits) {
  const themes = new Set();
  for (const key of collectChangedMessageKeys(prevTag)) {
    const theme = KEY_TO_THEME[key];
    if (theme) themes.add(theme);
  }
  for (const commit of commits) {
    const text = `${commit.subject} ${commit.body}`;
    for (const rule of COMMIT_THEME_RULES) {
      if (rule.test.test(text)) themes.add(rule.theme);
    }
  }
  return [...themes];
}

/** Collect git commits with hash, subject, and body since previous tag. */
function collectDetailedCommits(prevTag) {
  if (!prevTag) return [];
  try {
    const out = run(`git log ${prevTag}..HEAD --no-merges --format=%H%x09%s%x09%b%x1e`);
    return out
      .split('\x1e')
      .map(block => block.trim())
      .filter(Boolean)
      .map(block => {
        const [hash, subject, ...bodyParts] = block.split('\t');
        return {
          hash: (hash || '').slice(0, 7),
          subject: subject || '',
          body: bodyParts.join('\t').trim(),
        };
      })
      .filter(commit => commit.subject);
  } catch {
    return [];
  }
}

/** True when commit should be excluded from release notes. */
function isExcludedCommit(subject) {
  if (/^chore(\([^)]*\))?:\s*release\b/i.test(subject)) return true;
  if (/^chore(\([^)]*\))?:\s*bump version/i.test(subject)) return true;
  return false;
}

/** True when commit subject is worth an English user-facing bullet. */
function isUserFacingCommit(subject) {
  if (/^(docs|style)(\(|:)/i.test(subject)) return false;
  if (/documentation|comments and documentation|readme/i.test(subject)) return false;
  return true;
}

/** Strip conventional-commit prefix for English summary bullets. */
function commitToSummary(subject) {
  const match = subject.match(/^(?:feat|fix|perf|refactor|style|docs)(?:\([^)]*\))?:\s*(.+)$/i);
  if (match) return match[1];
  if (/^chore/i.test(subject)) return null;
  return subject;
}

/** Format detailed Changes section from commit list. */
function formatChangesSection(commits, isFirstRelease) {
  if (isFirstRelease) {
    return ['- Initial open-source release.'];
  }

  const releaseCommits = commits.filter(commit => !isExcludedCommit(commit.subject));
  if (!releaseCommits.length) {
    return ['- No commits since previous tag (or first release).'];
  }

  const lines = [];
  for (const commit of releaseCommits.slice(0, 40)) {
    lines.push(`- **${commit.subject}** (\`${commit.hash}\`)`);
    if (commit.body) {
      for (const line of commit.body.split('\n')) {
        const trimmed = line.trim();
        if (trimmed) lines.push(`  ${trimmed}`);
      }
    }
  }
  if (releaseCommits.length > 40) {
    lines.push(`- … and ${releaseCommits.length - 40} more commits`);
  }
  return lines;
}

/** Build multilingual user-facing highlight sections (not raw i18n key diffs). */
function buildMultilingualSections(prevTag, commits) {
  const isFirstRelease = !prevTag;
  const themes = isFirstRelease ? [] : detectReleaseThemes(prevTag, commits);
  const releaseCommits = commits.filter(commit => !isExcludedCommit(commit.subject));
  if (!themes.length && !releaseCommits.length && !isFirstRelease) return [];

  const localeOrder = ['en', 'zh_CN', 'es', 'ar', 'hi'];
  const sections = [];

  for (const locale of localeOrder) {
    const bullets = [];
    const seen = new Set();

    if (isFirstRelease) {
      const first = FIRST_RELEASE_HIGHLIGHTS[locale] || FIRST_RELEASE_HIGHLIGHTS.en;
      bullets.push(`- ${first}`);
      seen.add(first);
    }

    for (const theme of themes) {
      const text = THEME_HIGHLIGHTS[theme]?.[locale];
      if (text && !seen.has(text)) {
        bullets.push(`- ${text}`);
        seen.add(text);
      }
    }

    if (locale === 'en') {
      for (const commit of releaseCommits) {
        if (!isUserFacingCommit(commit.subject)) continue;
        const summary = commitToSummary(commit.subject);
        if (summary && !seen.has(summary)) {
          bullets.push(`- ${summary}`);
          seen.add(summary);
        }
      }
    }

    if (!bullets.length && releaseCommits.length) {
      bullets.push(`- ${GENERIC_IMPROVEMENTS[locale] || GENERIC_IMPROVEMENTS.en}`);
    }
    if (!bullets.length) continue;

    const title = LOCALE_SECTION_TITLES[locale] || locale;
    sections.push(`### ${title}`, '', ...bullets, '');
  }

  return sections;
}

/** Build default ZIP/CRX artifact paths from package metadata. */
function defaultArtifactPaths(name, version) {
  return {
    zip: path.join(RELEASES_DIR, `${name}_v${version}.zip`),
    crx: path.join(RELEASES_DIR, `${name}_v${version}.crx`),
  };
}

/** Collect existing release assets (ZIP required; CRX attached when present). */
function collectReleaseAssets(artifacts, extraAssets) {
  if (!fs.existsSync(artifacts.zip)) {
    console.error(`Missing artifact: ${artifacts.zip}`);
    process.exit(1);
  }

  const assets = [artifacts.zip];
  if (fs.existsSync(artifacts.crx)) {
    assets.push(artifacts.crx);
  }
  assets.push(...extraAssets.map(p => path.resolve(ROOT, p)));

  for (const file of assets) {
    if (!fs.existsSync(file)) {
      console.error(`Asset not found: ${file}`);
      process.exit(1);
    }
  }
  return assets;
}

/** Generate full release notes markdown. */
function buildReleaseNotes({ version, prevTag, customNotesPath, commits, multilingualSections }) {
  const lines = [`## v${version}`, ''];

  if (prevTag) {
    lines.push(`Compared to \`${prevTag}\`.`, '');
  }

  lines.push('### Changes', '');
  lines.push(...formatChangesSection(commits, !prevTag), '');

  if (multilingualSections.length) {
    lines.push('### Release highlights', '', ...multilingualSections);
  }

  if (customNotesPath) {
    const abs = path.resolve(ROOT, customNotesPath);
    if (!fs.existsSync(abs)) {
      console.error(`Notes file not found: ${abs}`);
      process.exit(1);
    }
    lines.push('### Additional notes', '', fs.readFileSync(abs, 'utf8').trim(), '');
  }

  lines.push('### Install', '');
  lines.push(`Download the \`.zip\` from [GitHub Releases](${RELEASES_URL}).`, '');
  lines.push(
    'Chrome: unzip, open `chrome://extensions`, enable **Developer mode**, then **Load unpacked** and select the unzipped folder.',
    '',
  );

  return `${lines.join('\n').trim()}\n`;
}

/** Ensure gh CLI is installed and authenticated before publish/commit steps. */
function assertGhReady() {
  let ghMissing = false;
  try {
    run('gh --version');
  } catch {
    ghMissing = true;
  }

  if (ghMissing) {
    console.error('\nGitHub CLI (gh) is required for --publish / --full.\n');
    console.error('Install:');
    console.error('  macOS:   brew install gh');
    console.error('  Windows: winget install GitHub.cli');
    console.error('  Linux:   see https://github.com/cli/cli#installation');
    console.error('\nThen authenticate:');
    console.error('  gh auth login');
    console.error('\nDocs: https://cli.github.com/\n');
    process.exit(1);
  }

  try {
    run('gh auth status --hostname github.com');
  } catch {
    console.error('\ngh is installed but not authenticated.\n');
    console.error('Run:  gh auth login\n');
    process.exit(1);
  }
}

/** Return true when the working tree has staged or unstaged changes. */
function hasWorkingTreeChanges() {
  return Boolean(run('git status --porcelain'));
}

/** Stage all changes and commit; no-op when tree is clean. */
function commitRelease(version, commitMessage) {
  if (!hasWorkingTreeChanges()) {
    console.log('Working tree clean; skipping commit.');
    return false;
  }

  const message = commitMessage || `chore: release v${version}`;
  runOrExit('git add -A');
  runOrExit(`git commit -m ${JSON.stringify(message)}`);
  console.log(`Committed: ${message}`);
  return true;
}

/** Push current branch and release tag to origin. */
function pushRelease(tag) {
  const branch = run('git rev-parse --abbrev-ref HEAD');
  runOrExit(`git push origin ${branch}`, { inherit: true });

  const tagPush = spawnSync(`git push origin ${tag}`, {
    cwd: ROOT,
    shell: true,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  if (tagPush.status === 0) {
    console.log(`Pushed branch ${branch} and tag ${tag} to origin.`);
    return;
  }

  const stderr = tagPush.stderr?.toString() || '';
  if (stderr.includes('already exists') || stderr.includes('rejected')) {
    console.warn(`Tag ${tag} already exists on origin; branch push succeeded, skipping tag push.`);
    return;
  }

  console.error(stderr || `git push origin ${tag} failed`);
  process.exit(tagPush.status || 1);
}

/** Create annotated tag locally if missing. */
function ensureTag(tag, version) {
  const tags = listVersionTags();
  if (tags.includes(tag)) {
    console.log(`Tag ${tag} already exists, reusing it.`);
    return;
  }

  if (hasWorkingTreeChanges()) {
    console.warn('Warning: working tree has uncommitted changes; tag will point at current HEAD.');
  }

  runOrExit(`git tag -a ${tag} -m "Release v${version}"`);
  console.log(`Created tag ${tag}`);
}

/** Upload release via gh CLI (assets are positional file args in gh 2.x+). */
function publishRelease({ tag, title, notesPath, assets }) {
  const parts = [
    'gh release create',
    tag,
    `--repo ${REPO}`,
    `--title ${JSON.stringify(title)}`,
    `--notes-file ${JSON.stringify(notesPath)}`,
    ...assets.map(file => JSON.stringify(file)),
  ];
  runOrExit(parts.join(' '), { inherit: true });
  console.log(`\nRelease published: ${RELEASES_URL}/tag/${tag}`);
}

/** Main entry. */
function main() {
  const options = parseArgs(process.argv.slice(2));
  const { name, version } = readPackageMeta();
  const tag = `v${version}`;
  const title = options.title || tag;
  const tags = listVersionTags();

  if (tags.includes(tag) && options.publish) {
    const existing = run(`gh release view ${tag} --repo ${REPO} --json url -q .url 2>/dev/null || true`);
    if (existing) {
      console.error(`Release ${tag} already exists: ${existing}`);
      console.error('Bump package.json version before publishing a new release.');
      process.exit(1);
    }
  }

  const prevTag = getPreviousTag(version, tags);
  console.log(`Version: ${version}`);
  console.log(`Previous tag: ${prevTag || '(none — first release)'}`);

  if (!options.skipBuild) {
    console.log('\nRunning pnpm build:zip …');
    runOrExit('pnpm build:zip', { inherit: true });
  }

  const artifacts = defaultArtifactPaths(name, version);
  const commits = prevTag ? collectDetailedCommits(prevTag) : [];
  const multilingualSections = buildMultilingualSections(prevTag, commits);
  let notes;
  if (options.bodyFile) {
    const abs = path.resolve(ROOT, options.bodyFile);
    if (!fs.existsSync(abs)) {
      console.error(`Body file not found: ${abs}`);
      process.exit(1);
    }
    notes = fs.readFileSync(abs, 'utf8').trim() + '\n';
  } else {
    notes = buildReleaseNotes({
      version,
      prevTag,
      customNotesPath: options.notesFile,
      commits,
      multilingualSections,
    });
  }

  fs.mkdirSync(RELEASES_DIR, { recursive: true });
  const notesPath = path.join(RELEASES_DIR, `RELEASE_NOTES_v${version}.md`);
  fs.writeFileSync(notesPath, notes, 'utf8');
  console.log(`\nRelease notes written: ${notesPath}\n`);
  console.log(notes);

  const assets = collectReleaseAssets(artifacts, options.assets);

  if (!options.publish) {
    console.log('\nDry run complete. To publish:');
    console.log(`  pnpm release:github:full`);
    console.log('Or step by step:');
    console.log(
      `  node scripts/github-release.mjs --publish --commit --push --body-file ${path.relative(ROOT, notesPath)}`,
    );
    return;
  }

  // Check gh before commit so a failed publish does not leave a release commit without a tag.
  assertGhReady();

  if (options.commit) {
    commitRelease(version, options.commitMessage);
  } else if (hasWorkingTreeChanges()) {
    console.warn('Warning: uncommitted changes remain; tag will not include them unless you use --commit.');
  }

  ensureTag(tag, version);
  publishRelease({ tag, title, notesPath, assets });

  if (options.push) {
    pushRelease(tag);
  } else {
    console.log('\nPush when ready:');
    console.log(`  git push origin HEAD && git push origin ${tag}`);
  }
}

main();
