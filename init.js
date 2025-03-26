document.addEventListener('DOMContentLoaded', async () => {
  // Load and render templates first
  const { templates: storedTemplates = [] } = await chrome.storage.local.get('templates');
  await renderTemplates(storedTemplates);

  // Template creation button handlers
  const newTemplateBtn = document.getElementById('newTemplateBtn');
  const createFirstTemplate = document.getElementById('createFirstTemplate');
  const templateForm = document.getElementById('templateForm');
  const editSection = document.querySelector('.edit-template-section');
  const cancelEdit = document.getElementById('cancelEdit');

  // Make sure edit section is hidden initially
  if (editSection) {
    editSection.classList.add('hidden');
    editSection.style.display = 'none';
  }

  // Function to show edit section
  const showEditSection = () => {
    if (editSection) {
      editSection.classList.remove('hidden');
      editSection.style.display = 'block';
      // Clear any existing form data
      if (templateForm) templateForm.reset();
    }
  };

  if (newTemplateBtn) {
    newTemplateBtn.addEventListener('click', showEditSection);
  }

  if (createFirstTemplate) {
    createFirstTemplate.addEventListener('click', showEditSection);
  }

  if (cancelEdit) {
    cancelEdit.addEventListener('click', () => {
      if (editSection) {
        editSection.classList.add('hidden');
        editSection.style.display = 'none';
      }
    });
  }

  if (templateForm) {
    templateForm.addEventListener('submit', handleTemplateSubmit);
  }

  // Add options page link handler
  const openOptions = document.getElementById('openOptions');
  if (openOptions) {
    openOptions.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }
}); 