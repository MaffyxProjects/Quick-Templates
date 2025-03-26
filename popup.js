// Add this at the top level
let templates = [];
let editingTemplateIndex = null;

async function renderTemplates(templates) {
  const templateList = document.getElementById('templateList');
  if (!templateList) return;
  
  templateList.innerHTML = '';
  
  if (!templates?.length) {
    // Show empty state
    templateList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-content">
          <i class="fas fa-file-alt empty-state-icon"></i>
          <span>No templates yet</span>
        </div>
        <button id="createFirstTemplate" class="empty-state-button">
          Create your first template
        </button>
      </div>
    `;
    
    // Re-attach event listener to the newly created button
    const createFirstTemplate = document.getElementById('createFirstTemplate');
    if (createFirstTemplate) {
      createFirstTemplate.addEventListener('click', () => {
        const editSection = document.querySelector('.edit-template-section');
        if (editSection) {
          editSection.classList.remove('hidden');
          editSection.style.display = 'block';
          const templateForm = document.getElementById('templateForm');
          if (templateForm) templateForm.reset();
        }
      });
    }
    return;
  }

  templates.forEach((template, index) => {
    const li = document.createElement('li');
    li.className = 'template-item p-4 hover:bg-white/5 rounded-lg transition-colors';
    li.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="template-name">${template.name}</span>
          ${template.category ? `<span class="category-tag">${template.category}</span>` : ''}
        </div>
        <div class="flex gap-2">
          <button class="action-btn copy-btn" title="Copy template">
            <i class="fas fa-copy"></i>
          </button>
          <button class="action-btn edit-btn" title="Edit template">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete-btn" title="Delete template">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;

    // Add event listeners for the buttons
    const copyBtn = li.querySelector('.copy-btn');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(template.text)
        .then(() => showToast('Template copied to clipboard'))
        .catch(() => showToast('Failed to copy template', 'error'));
    });

    editBtn?.addEventListener('click', () => {
      editingTemplateIndex = index;
      const editSection = document.querySelector('.edit-template-section');
      if (editSection) {
        editSection.classList.remove('hidden');
        editSection.style.display = 'block';
        
        // Fill form with template data
        document.getElementById('templateName').value = template.name;
        document.getElementById('newTemplate').value = template.text;
        document.getElementById('newCategory').value = template.category || '';
      }
    });

    deleteBtn?.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this template?')) {
        templates.splice(index, 1);
        await chrome.storage.local.set({ templates });
        await renderTemplates(templates);
        showToast('Template deleted');
      }
    });

    templateList.appendChild(li);
  });
}

// Add this function to handle form submissions
async function handleTemplateSubmit(event) {
  event.preventDefault();
  
  const templateName = document.getElementById('templateName')?.value?.trim();
  const templateText = document.getElementById('newTemplate')?.value?.trim();
  const category = document.getElementById('newCategory')?.value?.trim();
  const editSection = document.querySelector('.edit-template-section');

  if (!templateName || !templateText) {
    showToast('Name and template content are required', 'error');
    return;
  }

  try {
    const { templates: existingTemplates = [] } = await chrome.storage.local.get('templates');
    const newTemplate = {
      name: templateName,
      text: templateText,
      category: category || '',
      lastUsed: Date.now()
    };

    if (editingTemplateIndex !== null) {
      existingTemplates[editingTemplateIndex] = newTemplate;
    } else {
      existingTemplates.push(newTemplate);
    }

    await chrome.storage.local.set({ templates: existingTemplates });
    await renderTemplates(existingTemplates);
    
    // Clear form and hide edit section
    clearForm();
    hideEditForm(editSection);
    showToast('Template saved successfully');
  } catch (error) {
    console.error('Save error:', error);
    showToast('Failed to save template', 'error');
  }
}

// Add helper functions
function clearForm() {
  const form = document.getElementById('templateForm');
  form?.reset();
  editingTemplateIndex = null;
}

function hideEditForm(editSection) {
  if (editSection) {
    editSection.classList.add('hidden');
    editSection.style.display = 'none';
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) return;
  
  toast.className = `px-4 py-2 rounded-lg shadow-lg text-white text-center ${
    type === 'success' ? 'bg-green-500' : 
    type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
  }`;
  
  toast.style.cssText = `
    width: fit-content;
    max-width: calc(100% - 32px);
    opacity: 0;
    transform: translateY(10px);
    transition: all 300ms ease-out;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  `;
  
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  // Animate in from below
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  
  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2700);
}

// Make functions available globally
window.renderTemplates = renderTemplates;
window.handleTemplateSubmit = handleTemplateSubmit;
window.showToast = showToast;