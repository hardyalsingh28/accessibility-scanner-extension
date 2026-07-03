// Background service worker for accessibility scanner
chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage with default values
  chrome.storage.sync.set({
    highlightIssues: true,
    autoScan: false,
    showTips: true
  });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getScanResults') {
    // Retrieve saved scan results
    chrome.storage.local.get('lastScanResults', (result) => {
      sendResponse(result.lastScanResults || null);
    });
  }
});

// Auto-scan on page load if enabled
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get('autoScan', (result) => {
      if (result.autoScan) {
        // Auto-scan is disabled for now to avoid performance issues
        // Uncomment to enable
        // chrome.tabs.sendMessage(tabId, { action: 'scanPage' });
      }
    });
  }
});
