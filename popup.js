// popup.js

const toggle = document.getElementById('toggle-detection');
const statusText = document.getElementById('status-text');

function updateUI(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled ? 'ON' : 'OFF';
  statusText.style.color = enabled ? '#4caf50' : '#f44336';
}

// Load current status from storage
chrome.storage.local.get(['toxicityEnabled'], (result) => {
  updateUI(result.toxicityEnabled ?? true);
});

// When user toggles checkbox
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ toxicityEnabled: enabled });
  updateUI(enabled);

  // Send message to content script in active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setEnabled', enabled });
    }
  });
});
