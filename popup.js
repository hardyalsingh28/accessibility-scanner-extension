// Popup script for accessibility scanner
const scanBtn = document.getElementById('scanBtn');
const reportBtn = document.getElementById('reportBtn');
const settingsBtn = document.getElementById('settingsBtn');
const helpBtn = document.getElementById('helpBtn');

const loading = document.getElementById('loading');
const results = document.getElementById('results');
const noResults = document.getElementById('noResults');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

const score = document.getElementById('score');
const criticalCount = document.getElementById('criticalCount');
const warningCount = document.getElementById('warningCount');
const infoCount = document.getElementById('infoCount');
const issuesList = document.getElementById('issuesList');

const settingsModal = document.getElementById('settingsModal');
const helpModal = document.getElementById('helpModal');

let currentIssues = {
  critical: [],
  warning: [],
  info: []
};

// Event listeners
scanBtn.addEventListener('click', startScan);
reportBtn.addEventListener('click', showReport);
settingsBtn.addEventListener('click', () => openModal(settingsModal));
helpBtn.addEventListener('click', () => openModal(helpModal));

// Tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    displayIssuesByType(e.target.dataset.tab);
  });
});

// Modal controls
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.add('hidden');
  });
});

// Modal close on outside click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
});

// Settings
document.getElementById('highlightIssues').addEventListener('change', (e) => {
  chrome.storage.sync.set({ highlightIssues: e.target.checked });
});

document.getElementById('autoScan').addEventListener('change', (e) => {
  chrome.storage.sync.set({ autoScan: e.target.checked });
});

document.getElementById('showTips').addEventListener('change', (e) => {
  chrome.storage.sync.set({ showTips: e.target.checked });
});

// Load settings
chrome.storage.sync.get(['highlightIssues', 'autoScan', 'showTips'], (result) => {
  if (result.highlightIssues !== undefined) {
    document.getElementById('highlightIssues').checked = result.highlightIssues;
  }
  if (result.autoScan !== undefined) {
    document.getElementById('autoScan').checked = result.autoScan;
  }
  if (result.showTips !== undefined) {
    document.getElementById('showTips').checked = result.showTips;
  }
});

function startScan() {
  showLoading();
  hideError();

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;

    chrome.tabs.sendMessage(tabId, { action: 'scanPage' }, (response) => {
      if (chrome.runtime.lastError) {
        showError('Could not scan this page. It might be a special page.');
        hideLoading();
        return;
      }

      if (response && response.issues) {
        currentIssues = response.issues;
        displayResults();
      } else {
        showError('Failed to scan page');
        hideLoading();
      }
    });
  });
}

function displayResults() {
  hideLoading();

  const totalIssues = currentIssues.critical.length +
    currentIssues.warning.length +
    currentIssues.info.length;

  if (totalIssues === 0) {
    showNoResults();
    return;
  }

  // Update counts
  criticalCount.textContent = currentIssues.critical.length;
  warningCount.textContent = currentIssues.warning.length;
  infoCount.textContent = currentIssues.info.length;

  // Calculate and display score
  const accessibilityScore = Math.max(0, 100 - (
    currentIssues.critical.length * 10 +
    currentIssues.warning.length * 5 +
    currentIssues.info.length * 1
  ));

  score.textContent = Math.round(accessibilityScore);
  const scoreCircle = document.querySelector('.score-circle');
  scoreCircle.className = 'score-circle';

  if (accessibilityScore >= 80) {
    scoreCircle.classList.add('high');
  } else if (accessibilityScore >= 50) {
    scoreCircle.classList.add('medium');
  } else {
    scoreCircle.classList.add('low');
  }

  // Display issues
  displayIssuesByType('critical');

  // Show results
  results.classList.remove('hidden');
  noResults.classList.remove('show');
}

function displayIssuesByType(type) {
  issuesList.innerHTML = '';
  const issues = currentIssues[type] || [];

  if (issues.length === 0) {
    issuesList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No issues in this category</p>';
    return;
  }

  issues.forEach((issue, index) => {
    const issueEl = document.createElement('div');
    issueEl.className = `issue-item ${type}`;
    issueEl.innerHTML = `
      <div class="issue-title">${issue.title}</div>
      <div class="issue-description">${issue.description}</div>
      ${issue.fix ? `<div class="issue-fix"><strong>Fix:</strong> ${issue.fix}</div>` : ''}
      ${issue.element ? `<div class="issue-element" style="font-size: 11px; color: #999; margin-top: 8px; font-family: monospace; overflow: auto;">Element: ${escapeHtml(issue.element)}</div>` : ''}
    `;
    issuesList.appendChild(issueEl);
  });
}

function showReport() {
  const reportData = {
    timestamp: new Date().toLocaleString(),
    issues: currentIssues,
    totalIssues: currentIssues.critical.length + currentIssues.warning.length + currentIssues.info.length
  };

  chrome.storage.local.set({ lastReport: reportData });
  chrome.tabs.create({ url: 'report.html' });
}

function showLoading() {
  loading.classList.remove('hidden');
  results.classList.add('hidden');
  noResults.classList.remove('show');
  error.classList.remove('show');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showError(message) {
  errorMessage.textContent = message;
  error.classList.add('show');
}

function hideError() {
  error.classList.remove('show');
}

function showNoResults() {
  results.classList.add('hidden');
  noResults.classList.add('show');
  noResults.classList.remove('hidden');
}

function openModal(modal) {
  modal.classList.remove('hidden');
  modal.classList.add('show');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
