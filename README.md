# Enhanced Text Templates - Chrome Extension

A lightweight Chrome extension for managing and quickly inserting customizable text templates. Perfect for frequently used responses, code snippets, or any repetitive text content.

![Chrome Extension](https://img.shields.io/badge/Platform-Chrome-blue)
![Version](https://img.shields.io/badge/Version-1.0-green)

## Features

- 📝 Create and manage reusable text templates
- 📁 Organize templates with categories
- ⌨️ Keyboard shortcuts for quick template insertion
- 📤 Import/Export functionality for backup and sharing
- 🔄 Dynamic placeholder support
- 🎨 Clean, modern dark mode interface

## Installation

1. Download the latest release ZIP file
2. Extract the ZIP file to a local directory
3. Open Chrome and navigate to `chrome://extensions`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extracted extension directory
6. Click the puzzle icon in the toolbar and pin Enhanced Text Templates

## Usage

### Creating Templates
1. Click the extension icon
2. Click "New Template"
3. Enter template name, content, and optional category
4. Click "Save Template"

### Using Templates
- Click the extension icon and select a template to copy
- Use keyboard shortcuts (Ctrl+Shift+[1-9]) for quick insertion
- Templates with placeholders will prompt for values on insertion

### Managing Templates
- Export templates for backup
- Import templates from JSON files
- Delete or edit existing templates
- Organize templates with categories

## Development

### Project Structure
```
├── manifest.json
├── popup.html
├── popup.js
├── init.js
├── background.js
├── options.html
├── options.js
└── styles/
    └── options.css
```

### Tech Stack
- Vanilla JavaScript
- Chrome Extension APIs
- Tailwind CSS (via CDN)
- Font Awesome Icons

## Security

- Uses content security policy for script execution
- Implements proper permission scoping
- Sanitizes user input and file names
- Secure storage handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

Open an issue for bugs or feature requests.
