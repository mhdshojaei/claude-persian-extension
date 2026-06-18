const STYLE_ID = 'claude-rtl-vazir-styles';
const FONT_ID  = 'claude-rtl-vazir-font';
const FA_RE    = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

const DEFAULT_SETTINGS = { enabled: true, autoRtl: true, forceRtl: false };
let currentSettings = { ...DEFAULT_SETTINGS };

// ── Font ──────────────────────────────────────────────────────────────────────

function injectFont() {
  if (document.getElementById(FONT_ID)) return;
  const link = document.createElement('link');
  link.id   = FONT_ID;
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&display=swap';
  (document.head || document.documentElement).appendChild(link);
}

// ── CSS — ONLY targets message content, nothing else ─────────────────────────

function buildCSS({ forceRtl }) {
  // Precise selectors discovered from Claude.ai's actual DOM
  const contentSels = [
    '[data-testid="user-message"]',
    '[data-testid="user-message"] p',
    '.font-claude-response',
    '.font-claude-response-body',
    '.standard-markdown',
    '.standard-markdown p',
    '.standard-markdown li',
    '.standard-markdown h1',
    '.standard-markdown h2',
    '.standard-markdown h3',
    '.standard-markdown h4',
    '.standard-markdown blockquote',
    '.standard-markdown td',
    '.standard-markdown th',
    '[data-testid="chat-input"]',
    '[data-testid="chat-input"] *',
  ].join(',\n    ');

  return `
    /* Vazirmatn — ONLY on message content */
    ${contentSels} {
      font-family: 'Vazirmatn', system-ui, sans-serif !important;
    }

    /* Auto-RTL class applied by JS on elements with Persian text */
    .cvr-rtl {
      direction: rtl !important;
      text-align: right !important;
      unicode-bidi: plaintext !important;
    }

    /* Override placeholder text via CSS — immune to React re-renders */
    [data-testid="chat-input"] p[data-placeholder]::before {
      content: 'در این قسمت بنویسید...' !important;
    }

    /* RTL for input area */
    [data-testid="chat-input"],
    [data-testid="chat-input"] p,
    [data-testid="chat-input"] .tiptap {
      direction: rtl !important;
      text-align: right !important;
    }

    ${forceRtl ? `
    /* Force RTL on all message content */
    [data-testid="user-message"],
    [data-testid="user-message"] p,
    .font-claude-response-body,
    .standard-markdown p,
    .standard-markdown li,
    [data-testid="chat-input"] {
      direction: rtl !important;
      text-align: right !important;
      unicode-bidi: plaintext !important;
    }
    ` : ''}
  `;
}

function applyStyles(settings) {
  injectFont();
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    (document.head || document.documentElement).appendChild(el);
  }
  el.textContent = settings.enabled ? buildCSS(settings) : '';
}

// ── RTL detection — only inside message containers ───────────────────────────

// Leaf text elements INSIDE message containers only
const SCAN_SEL = [
  '[data-testid="user-message"] p',
  '.font-claude-response-body',
  '.standard-markdown p',
  '.standard-markdown li',
  '.standard-markdown h1',
  '.standard-markdown h2',
  '.standard-markdown h3',
  '.standard-markdown blockquote',
  '[data-testid="chat-input"]',
].join(', ');

function applyRtlToEl(el) {
  const text = el.innerText || el.textContent || '';
  if (FA_RE.test(text)) {
    el.classList.add('cvr-rtl');
    el.setAttribute('dir', 'rtl');
  } else {
    el.classList.remove('cvr-rtl');
    el.removeAttribute('dir');
  }
}

function scanAll() {
  if (!currentSettings.enabled || !currentSettings.autoRtl || currentSettings.forceRtl) return;
  document.querySelectorAll(SCAN_SEL).forEach(applyRtlToEl);
}

// ── MutationObserver ──────────────────────────────────────────────────────────

let scanTimer = null;
const observer = new MutationObserver(() => {
  clearTimeout(scanTimer);
  scanTimer = setTimeout(scanAll, 150);
});

function startObserver() {
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

// ── Init ──────────────────────────────────────────────────────────────────────

chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
  currentSettings = settings;
  applyStyles(settings);

  const go = () => { scanAll(); startObserver(); };
  if (document.body) go();
  else document.addEventListener('DOMContentLoaded', go);
});

chrome.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach(k => { currentSettings[k] = changes[k].newValue; });
  applyStyles(currentSettings);

  if (!currentSettings.autoRtl || currentSettings.forceRtl) {
    document.querySelectorAll('.cvr-rtl').forEach(el => {
      el.classList.remove('cvr-rtl');
      el.removeAttribute('dir');
    });
  }
  scanAll();
});
