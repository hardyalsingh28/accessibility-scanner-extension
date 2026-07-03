# Accessibility Scanner Extension 🚀

A powerful Chrome/Chromium browser extension for scanning websites and detecting accessibility issues. Get actionable insights to make your web pages accessible to everyone.

## ✨ Features

### 🔍 Comprehensive Scanning
- **Image Alt Text** - Detects missing or inadequate alt text
- **Form Accessibility** - Checks for labels on form inputs
- **Color Contrast** - Identifies low contrast text
- **Heading Hierarchy** - Validates proper heading structure
- **ARIA Attributes** - Reviews ARIA usage
- **Link Text** - Checks for descriptive link text
- **Button Accessibility** - Validates button accessibility
- **Video Captions** - Detects missing captions
- **Keyboard Navigation** - Checks keyboard accessibility
- **Page Language** - Verifies language specification

### 📊 Detailed Reports
- **Accessibility Score** - Get a quick score of your page
- **Issue Categorization** - Critical, Warning, and Info levels
- **Actionable Recommendations** - Get specific fixes for each issue
- **Detailed Report** - Export to a comprehensive HTML report
- **Print Support** - Print reports for sharing

### ⚙️ Customizable Settings
- **Highlight Issues** - Visually highlight issues on the page
- **Auto Scan** - Automatically scan pages on load
- **Show Tips** - Display improvement recommendations

### 📱 User-Friendly Interface
- **Clean Popup UI** - Easy-to-use scan interface
- **Issue Filtering** - View issues by severity level
- **Recent Issues Tracking** - Keep track of scan history
- **Responsive Design** - Works on all screen sizes

## 🚀 Installation

### From Chrome Web Store
Coming soon!

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open `chrome://extensions/` in your browser
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the extension folder
6. The extension will appear in your extensions list

## 📖 How to Use

### Basic Scanning
1. Navigate to any website
2. Click the extension icon in your browser toolbar
3. Click "Scan Page"
4. Review the results

### Understanding Results
- **Critical Issues** 🚨 - Must be fixed for accessibility
- **Warnings** ⚠️ - Should be addressed
- **Tips** ℹ️ - Best practice recommendations

### Viewing Detailed Reports
1. After scanning, click "View Report"
2. A new tab opens with a comprehensive report
3. Use "Print" button to save as PDF

### Adjusting Settings
1. Click the ⚙️ settings icon in the popup
2. Configure your preferences:
   - Highlight issues on page
   - Auto-scan on page load
   - Show improvement tips

## 📁 File Structure

```
accessibility-scanner-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.js              # Popup logic
├── styles.css            # Popup styling
├── content.js            # Page scanning logic
├── background.js         # Service worker
├── report.html           # Report viewer
├── README.md             # Documentation
└── images/               # Extension icons
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## 🔧 Technical Details

### Permissions Used
- `activeTab` - Access current tab
- `scripting` - Run scanning scripts
- `tabs` - Tab management
- `storage` - Save settings and results

### Technologies
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No dependencies
- **Chrome Storage API** - For persistent data
- **Chrome Tabs API** - For tab management

## 📊 Accessibility Checks

### Critical Issues
- Missing alt text on images
- Form inputs without labels
- Missing H1 heading
- Links without descriptive text
- Buttons without accessible text

### Warnings
- Alt text too short
- Broken heading hierarchy
- Low color contrast
- Missing video captions
- Non-descriptive link text

### Tips
- Keyboard accessibility
- ARIA role usage
- Page language specification
- Best practices

## 🎯 WCAG Compliance

This extension checks for compliance with Web Content Accessibility Guidelines (WCAG) 2.1:
- **Level A** - Critical issues
- **Level AA** - Warnings
- **Best Practices** - Tips

## 🐛 Known Limitations

- Color contrast checking is simplified for performance
- Dynamic content may require manual re-scan
- Some JavaScript-heavy pages may need additional checks
- Complex ARIA structures may need manual review

## 🔐 Privacy

- No data is sent to external servers
- All scanning happens locally in your browser
- No tracking or analytics
- No personal information collection
- Full source code is available for review

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report issues
- Suggest improvements
- Submit pull requests
- Share feedback

## 📚 Resources

- [W3C Web Accessibility Initiative](https://www.w3.org/WAI/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [A11ycasts by Google Chrome](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9Xc-RgEu6c6ZwM7aJ)

## 📄 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

- Built with accessibility best practices
- Inspired by WCAG guidelines
- Community feedback and suggestions

## 📞 Support

For issues, questions, or suggestions:
1. Check existing issues in the repository
2. Create a new issue with details
3. Include page URL and expected behavior
4. Provide browser version information

---

**Making the web accessible for everyone!** ♿✨
