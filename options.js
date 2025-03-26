// Clear cache functionality with confirmation
document.getElementById('clearCache')?.addEventListener('click', async () => {
  // Show confirmation dialog
  const isConfirmed = confirm('Are you sure you want to clear all templates? This action cannot be undone.');
  
  if (isConfirmed) {
    try {
      await chrome.storage.local.clear();
      alert('Cache cleared successfully');
    } catch (error) {
      alert('Failed to clear cache: ' + error.message);
    }
  }
});

// Export templates functionality
document.getElementById('exportTemplates')?.addEventListener('click', async () => {
  try {
    const result = await chrome.storage.local.get('templates');
    
    // Check if templates exist and are not empty
    if (!result.templates || Object.keys(result.templates).length === 0) {
      alert('No templates to export. Please create some templates first.');
      return;
    }

    // Format current date as YYYY-MM-DD
    const date = new Date().toISOString().split('T')[0];
    const filename = `templates_${date}.json`;

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Failed to export templates: ' + error.message);
  }
});

// Import templates functionality
document.getElementById('importTemplates')?.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = async (e) => {
    try {
      const file = e.target.files[0];
      const text = await file.text();
      const templates = JSON.parse(text);
      await chrome.storage.local.set(templates);
      alert('Templates imported successfully');
    } catch (error) {
      alert('Failed to import templates: ' + error.message);
    }
  };
  
  input.click();
});