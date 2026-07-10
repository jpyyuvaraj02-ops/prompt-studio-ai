// ==========================================
// PROMPT STUDIO - COMMUNITY ADMIN CONTROLLER
// ==========================================

let selectedPrompts = new Set();

function loadCommunityTable() {
  const tableBody = document.getElementById('community-table-body');
  if (!tableBody) return;

  let prompts = StorageHelper.get('ps_community');

  // Set default statuses if absent
  let stateChanged = false;
  prompts = prompts.map(p => {
    if (!p.status) {
      p.status = 'approved';
      stateChanged = true;
    }
    return p;
  });
  if (stateChanged) {
    StorageHelper.set('ps_community', prompts);
  }

  // Get search & filter values
  const searchQuery = document.getElementById('community-search')?.value.toLowerCase() || "";
  const categoryFilter = document.getElementById('community-category-filter')?.value || "All";
  const statusFilter = document.getElementById('community-status-filter')?.value || "All";

  // Filter
  let filtered = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery) || 
                          p.description.toLowerCase().includes(searchQuery) || 
                          (p.creator?.name || "").toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Render rows
  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No community posts found.</td></tr>`;
  } else {
    tableBody.innerHTML = filtered.map(p => {
      const isChecked = selectedPrompts.has(p.id) ? 'checked' : '';
      
      let statusClass = 'badge-soft-success';
      if (p.status === 'pending') statusClass = 'badge-soft-warning';
      if (p.status === 'rejected') statusClass = 'badge-soft-danger';

      const pinnedBadge = p.pinned ? `<span class="badge bg-danger ms-1" style="font-size: 8px;"><i class="bi bi-pin-angle-fill me-0.5"></i>Pinned</span>` : '';
      const featuredBadge = p.featured ? `<span class="badge bg-warning text-dark ms-1" style="font-size: 8px;"><i class="bi bi-star-fill me-0.5"></i>Featured</span>` : '';
      const hiddenBadge = p.hidden ? `<span class="badge bg-secondary ms-1" style="font-size: 8px;"><i class="bi bi-eye-slash-fill me-0.5"></i>Hidden</span>` : '';

      return `
        <tr>
          <td>
            <input type="checkbox" class="form-check-input prompt-select-row" value="${p.id}" ${isChecked} onchange="toggleSelectPrompt('${p.id}')" />
          </td>
          <td><span class="font-monospace fw-bold text-secondary" style="font-size: 0.8rem;">${p.id}</span></td>
          <td>
            <div style="max-width: 320px;">
              <span class="fw-bold text-dark d-block text-truncate" title="${p.title}">${p.title}</span>
              <p class="text-muted fs-9 mb-0 text-truncate" style="font-size: 0.75rem;">${p.description}</p>
              <div class="mt-1 d-flex gap-1 flex-wrap">
                ${pinnedBadge} ${featuredBadge} ${hiddenBadge}
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${p.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}" class="rounded-circle border" style="width: 26px; height: 26px; object-fit: cover;" />
              <span class="fs-9 fw-semibold text-dark">${p.creator?.name || 'Anonymous'}</span>
            </div>
          </td>
          <td><span class="badge bg-light text-dark border rounded px-2 py-0.5 fs-9">${p.category}</span></td>
          <td><span class="fw-semibold text-dark">$${p.price || 0}</span></td>
          <td><span class="badge ${statusClass} px-2 py-1 rounded text-uppercase" style="font-size: 10px;">${p.status}</span></td>
          <td>
            <div class="dropdown">
              <button class="btn btn-light btn-sm rounded" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 fs-9">
                ${p.status !== 'approved' ? `<li><a class="dropdown-item py-2" href="#" onclick="approvePrompt('${p.id}'); return false;"><i class="bi bi-check-circle text-success me-2"></i>Approve</a></li>` : ''}
                ${p.status !== 'rejected' ? `<li><a class="dropdown-item py-2" href="#" onclick="rejectPrompt('${p.id}'); return false;"><i class="bi bi-x-circle text-warning me-2"></i>Reject</a></li>` : ''}
                <li><a class="dropdown-item py-2" href="#" onclick="editPromptModal('${p.id}'); return false;"><i class="bi bi-pencil me-2"></i>Edit</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item py-2" href="#" onclick="togglePinPrompt('${p.id}'); return false;"><i class="bi bi-pin-angle me-2"></i>${p.pinned ? 'Unpin' : 'Pin Prompt'}</a></li>
                <li><a class="dropdown-item py-2" href="#" onclick="toggleFeaturePrompt('${p.id}'); return false;"><i class="bi bi-star me-2"></i>${p.featured ? 'Unfeature' : 'Feature'}</a></li>
                <li><a class="dropdown-item py-2" href="#" onclick="toggleHidePrompt('${p.id}'); return false;"><i class="bi bi-eye-slash me-2"></i>${p.hidden ? 'Show' : 'Hide'}</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item py-2 text-danger" href="#" onclick="deletePrompt('${p.id}'); return false;"><i class="bi bi-trash me-2"></i>Delete</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

window.toggleSelectPrompt = function(id) {
  if (selectedPrompts.has(id)) {
    selectedPrompts.delete(id);
  } else {
    selectedPrompts.add(id);
  }
  updateBulkActionVisibility();
};

window.toggleSelectAllPrompts = function(event) {
  const checkboxes = document.querySelectorAll('.prompt-select-row');
  selectedPrompts.clear();
  checkboxes.forEach(chk => {
    chk.checked = event.target.checked;
    if (event.target.checked) {
      selectedPrompts.add(chk.value);
    }
  });
  updateBulkActionVisibility();
};

function updateBulkActionVisibility() {
  const bulkBar = document.getElementById('bulk-actions-bar');
  const countEl = document.getElementById('selected-count');
  if (!bulkBar) return;

  if (selectedPrompts.size > 0) {
    bulkBar.classList.remove('d-none');
    if (countEl) countEl.innerText = selectedPrompts.size;
  } else {
    bulkBar.classList.add('d-none');
  }
}

// Prompt actions
window.approvePrompt = function(id) {
  let prompts = StorageHelper.get('ps_community');
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index].status = 'approved';
    StorageHelper.set('ps_community', prompts);
    StorageHelper.addLog("admin@promptstudio.ai", "Prompt Approved", "Community", "Success", `Approved community prompt: ${prompts[index].title}`);
    StorageHelper.addNotification(`Prompt Approved: "${prompts[index].title}"`, "Community");
    loadCommunityTable();
  }
};

window.rejectPrompt = function(id) {
  let prompts = StorageHelper.get('ps_community');
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index].status = 'rejected';
    StorageHelper.set('ps_community', prompts);
    StorageHelper.addLog("admin@promptstudio.ai", "Prompt Rejected", "Community", "Success", `Rejected community prompt: ${prompts[index].title}`);
    loadCommunityTable();
  }
};

window.togglePinPrompt = function(id) {
  let prompts = StorageHelper.get('ps_community');
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index].pinned = !prompts[index].pinned;
    StorageHelper.set('ps_community', prompts);
    loadCommunityTable();
  }
};

window.toggleFeaturePrompt = function(id) {
  let prompts = StorageHelper.get('ps_community');
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index].featured = !prompts[index].featured;
    StorageHelper.set('ps_community', prompts);
    loadCommunityTable();
  }
};

window.toggleHidePrompt = function(id) {
  let prompts = StorageHelper.get('ps_community');
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index].hidden = !prompts[index].hidden;
    StorageHelper.set('ps_community', prompts);
    loadCommunityTable();
  }
};

window.deletePrompt = function(id) {
  if (confirm("Are you sure you want to delete this community prompt?")) {
    let prompts = StorageHelper.get('ps_community');
    const target = prompts.find(p => p.id === id);
    const updated = prompts.filter(p => p.id !== id);
    StorageHelper.set('ps_community', updated);
    
    StorageHelper.addLog("admin@promptstudio.ai", "Prompt Deleted", "Community", "Success", `Deleted prompt: ${target ? target.title : id}`);
    selectedPrompts.delete(id);
    updateBulkActionVisibility();
    loadCommunityTable();
  }
};

// Bulk Actions
window.bulkApproveSelected = function() {
  let prompts = StorageHelper.get('ps_community');
  prompts = prompts.map(p => {
    if (selectedPrompts.has(p.id)) {
      p.status = 'approved';
    }
    return p;
  });
  StorageHelper.set('ps_community', prompts);
  StorageHelper.addLog("admin@promptstudio.ai", "Bulk Approval", "Community", "Success", `Bulk approved ${selectedPrompts.size} items.`);
  selectedPrompts.clear();
  document.getElementById('select-all-checkbox').checked = false;
  updateBulkActionVisibility();
  loadCommunityTable();
};

window.bulkRejectSelected = function() {
  let prompts = StorageHelper.get('ps_community');
  prompts = prompts.map(p => {
    if (selectedPrompts.has(p.id)) {
      p.status = 'rejected';
    }
    return p;
  });
  StorageHelper.set('ps_community', prompts);
  StorageHelper.addLog("admin@promptstudio.ai", "Bulk Rejection", "Community", "Success", `Bulk rejected ${selectedPrompts.size} items.`);
  selectedPrompts.clear();
  document.getElementById('select-all-checkbox').checked = false;
  updateBulkActionVisibility();
  loadCommunityTable();
};

window.bulkDeleteSelected = function() {
  if (confirm(`Are you sure you want to bulk-delete ${selectedPrompts.size} selected items?`)) {
    let prompts = StorageHelper.get('ps_community');
    const updated = prompts.filter(p => !selectedPrompts.has(p.id));
    StorageHelper.set('ps_community', updated);
    StorageHelper.addLog("admin@promptstudio.ai", "Bulk Deletion", "Community", "Success", `Bulk deleted ${selectedPrompts.size} items.`);
    selectedPrompts.clear();
    document.getElementById('select-all-checkbox').checked = false;
    updateBulkActionVisibility();
    loadCommunityTable();
  }
};

// Edit Modal
window.editPromptModal = function(id) {
  const prompts = StorageHelper.get('ps_community');
  const prompt = prompts.find(p => p.id === id);
  if (!prompt) return;

  document.getElementById('edit-prompt-id').value = prompt.id;
  document.getElementById('edit-prompt-title').value = prompt.title;
  document.getElementById('edit-prompt-description').value = prompt.description;
  document.getElementById('edit-prompt-category').value = prompt.category;
  document.getElementById('edit-prompt-price').value = prompt.price || 0;

  const myModal = new bootstrap.Modal(document.getElementById('promptEditModal'));
  myModal.show();
};

window.saveEditedPrompt = function() {
  const id = document.getElementById('edit-prompt-id').value;
  const title = document.getElementById('edit-prompt-title').value.trim();
  const description = document.getElementById('edit-prompt-description').value.trim();
  const category = document.getElementById('edit-prompt-category').value;
  const price = parseFloat(document.getElementById('edit-prompt-price').value) || 0;

  if (!title || !description) {
    alert("Please fill in all prompt metadata.");
    return;
  }

  let prompts = StorageHelper.get('ps_community');
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index].title = title;
    prompts[index].description = description;
    prompts[index].category = category;
    prompts[index].price = price;
    StorageHelper.set('ps_community', prompts);

    StorageHelper.addLog("admin@promptstudio.ai", "Prompt Edited", "Community", "Success", `Edited metadata for prompt: ${title}`);
    bootstrap.Modal.getInstance(document.getElementById('promptEditModal')).hide();
    loadCommunityTable();
  }
};

// Initialize listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('community-search');
  const categoryFilter = document.getElementById('community-category-filter');
  const statusFilter = document.getElementById('community-status-filter');

  if (searchInput) searchInput.addEventListener('keyup', loadCommunityTable);
  if (categoryFilter) categoryFilter.addEventListener('change', loadCommunityTable);
  if (statusFilter) statusFilter.addEventListener('change', loadCommunityTable);

  // Check URL query parameters for custom initial pending filters
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam === 'pending' && statusFilter) {
    statusFilter.value = 'pending';
  }

  loadCommunityTable();
});
