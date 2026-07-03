// Content script for accessibility scanning
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanPage') {
    const issues = scanForAccessibilityIssues();
    sendResponse({ issues });
  }
});

function scanForAccessibilityIssues() {
  const issues = {
    critical: [],
    warning: [],
    info: []
  };

  // Check for images without alt text
  checkImagesAltText(issues);

  // Check for form inputs without labels
  checkFormLabels(issues);

  // Check for color contrast
  checkColorContrast(issues);

  // Check for keyboard accessibility
  checkKeyboardAccessibility(issues);

  // Check for heading hierarchy
  checkHeadingHierarchy(issues);

  // Check for ARIA attributes
  checkAriaAttributes(issues);

  // Check for video captions
  checkVideoCaptions(issues);

  // Check for link text
  checkLinkText(issues);

  // Check for button accessibility
  checkButtonAccessibility(issues);

  // Check for page language
  checkPageLanguage(issues);

  // Highlight issues if enabled
  chrome.storage.sync.get('highlightIssues', (result) => {
    if (result.highlightIssues !== false) {
      highlightIssues(issues);
    }
  });

  return issues;
}

function checkImagesAltText(issues) {
  const images = document.querySelectorAll('img');

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    const title = img.getAttribute('title');

    if (!alt && !title) {
      issues.critical.push({
        title: 'Image Missing Alt Text',
        description: 'Images must have descriptive alt text for screen reader users.',
        fix: 'Add an alt attribute with a descriptive text that explains the image content.',
        element: img.outerHTML.substring(0, 100)
      });
    } else if (alt && alt.length < 5) {
      issues.warning.push({
        title: 'Alt Text Too Short',
        description: 'The alt text appears to be too brief to describe the image.',
        fix: 'Provide a more descriptive alt text (at least 5 characters).',
        element: img.outerHTML.substring(0, 100)
      });
    }
  });
}

function checkFormLabels(issues) {
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');

  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    const name = input.getAttribute('name');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const placeholder = input.getAttribute('placeholder');

    // Check if there's a label associated with this input
    let hasLabel = false;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label && label.textContent.trim()) {
        hasLabel = true;
      }
    }

    if (!hasLabel && !ariaLabel && !ariaLabelledBy && !placeholder) {
      issues.critical.push({
        title: 'Form Input Missing Label',
        description: 'Form inputs must have associated labels for screen reader users.',
        fix: 'Add a <label> element with the "for" attribute, or use aria-label.',
        element: input.outerHTML.substring(0, 100)
      });
    }
  });
}

function checkColorContrast(issues) {
  const elements = document.querySelectorAll('*');

  let checkedCount = 0;
  elements.forEach((el) => {
    if (checkedCount > 50) return; // Limit checks for performance

    const text = el.textContent?.trim();
    if (!text || text.length < 3) return;

    const style = window.getComputedStyle(el);
    const bgColor = style.backgroundColor;
    const color = style.color;

    // Simple check: if background is white and text is very light
    if (bgColor === 'rgba(255, 255, 255, 0)' || bgColor === 'transparent') {
      return;
    }

    if (isLowContrast(color, bgColor)) {
      issues.warning.push({
        title: 'Low Color Contrast',
        description: 'Text color and background color have insufficient contrast.',
        fix: 'Ensure a contrast ratio of at least 4.5:1 for normal text.',
        element: el.tagName
      });
      checkedCount++;
    }
  });
}

function isLowContrast(color, bgColor) {
  // Simple contrast check (simplified)
  const colorLum = getRelativeLuminance(color);
  const bgLum = getRelativeLuminance(bgColor);

  const ratio = (Math.max(colorLum, bgLum) + 0.05) / (Math.min(colorLum, bgLum) + 0.05);
  return ratio < 4.5;
}

function getRelativeLuminance(color) {
  // Parse color and calculate luminance (simplified)
  return 0.5; // Simplified for demo
}

function checkKeyboardAccessibility(issues) {
  // Check for interactive elements without keyboard access
  const buttons = document.querySelectorAll('button, a[href], input, select, textarea');

  let inaccessibleCount = 0;
  buttons.forEach((el) => {
    if (el.getAttribute('tabindex') === '-1' && !el.hasAttribute('aria-hidden')) {
      inaccessibleCount++;
    }
  });

  if (inaccessibleCount > 0) {
    issues.info.push({
      title: 'Keyboard Accessibility Review',
      description: 'Some interactive elements may not be keyboard accessible.',
      fix: 'Ensure all interactive elements can be accessed via keyboard navigation.'
    });
  }
}

function checkHeadingHierarchy(issues) {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  if (headings.length === 0) {
    issues.warning.push({
      title: 'No Headings Found',
      description: 'Page should have heading elements to structure content.',
      fix: 'Add heading elements (h1-h6) to organize page content.'
    });
    return;
  }

  let previousLevel = 0;
  let foundH1 = false;

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);

    if (level === 1) {
      foundH1 = true;
    }

    if (previousLevel && level > previousLevel + 1) {
      issues.warning.push({
        title: 'Heading Hierarchy Broken',
        description: `Heading hierarchy skipped from H${previousLevel} to H${level}.`,
        fix: 'Use proper heading hierarchy (h1 > h2 > h3, etc.).',
        element: heading.outerHTML.substring(0, 100)
      });
    }

    previousLevel = level;
  });

  if (!foundH1) {
    issues.critical.push({
      title: 'Missing H1 Heading',
      description: 'Page should have exactly one H1 heading.',
      fix: 'Add a single H1 heading that describes the main topic of the page.'
    });
  }
}

function checkAriaAttributes(issues) {
  // Check for improper ARIA usage
  const ariaElements = document.querySelectorAll('[role], [aria-label], [aria-describedby]');

  ariaElements.forEach((el) => {
    const role = el.getAttribute('role');

    // Check if role is valid
    const validRoles = ['button', 'link', 'navigation', 'main', 'contentinfo', 'search', 'region', 'alert', 'status', 'tab', 'menuitem'];

    if (role && !validRoles.includes(role)) {
      issues.info.push({
        title: 'Review ARIA Role',
        description: `ARIA role "${role}" might not be appropriate.`,
        fix: 'Review ARIA role documentation and use standard roles when possible.'
      });
    }
  });
}

function checkVideoCaptions(issues) {
  const videos = document.querySelectorAll('video');

  videos.forEach((video) => {
    const tracks = video.querySelectorAll('track[kind="captions"]');

    if (tracks.length === 0) {
      issues.warning.push({
        title: 'Video Missing Captions',
        description: 'Videos should have captions for deaf and hard of hearing users.',
        fix: 'Add a <track> element with kind="captions" to your <video> tag.'
      });
    }
  });
}

function checkLinkText(issues) {
  const links = document.querySelectorAll('a[href]');

  links.forEach((link) => {
    const text = link.textContent?.trim();
    const ariaLabel = link.getAttribute('aria-label');

    if (!text && !ariaLabel) {
      issues.critical.push({
        title: 'Link Missing Text',
        description: 'Links must have descriptive text or aria-label.',
        fix: 'Add descriptive text to the link or use aria-label attribute.',
        element: link.outerHTML.substring(0, 100)
      });
    } else if (text === 'click here' || text === 'read more' || text === 'link') {
      issues.warning.push({
        title: 'Link Text Not Descriptive',
        description: 'Link text should describe the destination or action.',
        fix: `Change link text from "${text}" to something more descriptive.`,
        element: link.outerHTML.substring(0, 100)
      });
    }
  });
}

function checkButtonAccessibility(issues) {
  const buttons = document.querySelectorAll('button, [role="button"]');

  buttons.forEach((button) => {
    const text = button.textContent?.trim();
    const ariaLabel = button.getAttribute('aria-label');

    if (!text && !ariaLabel) {
      issues.critical.push({
        title: 'Button Missing Text',
        description: 'Buttons must have accessible text or aria-label.',
        fix: 'Add text content to the button or use aria-label.',
        element: button.outerHTML.substring(0, 100)
      });
    }
  });
}

function checkPageLanguage(issues) {
  const html = document.documentElement;
  const lang = html.getAttribute('lang');

  if (!lang) {
    issues.info.push({
      title: 'Page Language Not Specified',
      description: 'The page language should be specified in the HTML element.',
      fix: 'Add lang="en" (or appropriate language code) to the <html> tag.'
    });
  }
}

function highlightIssues(issues) {
  const allIssues = [...issues.critical, ...issues.warning, ...issues.info];

  allIssues.forEach((issue) => {
    if (issue.element && issue.element.startsWith('<')) {
      // Try to find the element and highlight it
      const temp = document.createElement('div');
      temp.innerHTML = issue.element;
      const element = temp.firstElementChild;

      if (element) {
        const selector = `${element.tagName.toLowerCase()}[id="${element.id}"]`;
        const targetElement = document.querySelector(selector) || document.querySelector(element.tagName.toLowerCase());

        if (targetElement) {
          targetElement.style.outline = '2px solid red';
          targetElement.setAttribute('data-accessibility-issue', 'true');
        }
      }
    }
  });
}
