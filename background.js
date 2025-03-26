// Listen for keyboard shortcut commands
chrome.commands.onCommand.addListener(async (command) => {
  let data = await chrome.storage.local.get("templates");
  let templates = data.templates || [];

  // Check if a template corresponds to a shortcut command
  if (command.startsWith("insert-template-")) {
    let index = parseInt(command.split("-").pop()) - 1;
    if (templates[index]) {
      insertTemplate(templates[index].text);
    }
  }
});

// Improved template insertion with better error handling
async function insertTemplate(templateText) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab found");

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        const activeElement = document.activeElement;
        if (!activeElement?.value) return false;

        const placeholders = text.match(/\{.+?\}/g) || [];
        const values = new Map();

        for (const placeholder of placeholders) {
          const key = placeholder.replace(/\{|\}/g, "");
          const value = prompt(`Enter value for ${key}`);
          if (value === null) return false; // User cancelled
          values.set(placeholder, value);
        }

        let finalText = text;
        values.forEach((value, placeholder) => {
          finalText = finalText.replace(placeholder, value);
        });

        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        activeElement.value = 
          activeElement.value.slice(0, start) +
          finalText +
          activeElement.value.slice(end);

        return true;
      },
      args: [templateText]
    });

    if (result[0].result) {
      // Update last used timestamp
      const data = await chrome.storage.local.get("templates");
      const templates = data.templates.map(t => 
        t.text === templateText ? { ...t, lastUsed: Date.now() } : t
      );
      await chrome.storage.local.set({ templates });
    }
  } catch (error) {
    console.error("Failed to insert template:", error);
  }
}

// Helper function to sanitize filenames (if needed elsewhere)
function sanitizeFileName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 32);
}
