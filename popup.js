const DEFAULT_SETTINGS = { enabled: true, autoRtl: true, forceRtl: false };

const elEnabled   = document.getElementById('toggle-enabled');
const elAutoRtl   = document.getElementById('toggle-auto-rtl');
const elForceRtl  = document.getElementById('toggle-force-rtl');
const elNotice    = document.getElementById('disabled-notice');

chrome.storage.sync.get(DEFAULT_SETTINGS, (s) => {
  elEnabled.checked  = s.enabled;
  elAutoRtl.checked  = s.autoRtl;
  elForceRtl.checked = s.forceRtl;
  updateUI(s.enabled);
});

elEnabled.addEventListener('change', () => save({ enabled: elEnabled.checked }));
elAutoRtl.addEventListener('change', () => save({ autoRtl: elAutoRtl.checked }));
elForceRtl.addEventListener('change', () => {
  // forceRtl overrides autoRtl
  if (elForceRtl.checked) elAutoRtl.checked = false;
  save({ forceRtl: elForceRtl.checked, autoRtl: elAutoRtl.checked });
});

function save(patch) {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (current) => {
    const next = { ...current, ...patch };
    chrome.storage.sync.set(next);
    updateUI(next.enabled);
  });
}

function updateUI(enabled) {
  elAutoRtl.disabled  = !enabled;
  elForceRtl.disabled = !enabled;
  elNotice.classList.toggle('show', !enabled);
}
