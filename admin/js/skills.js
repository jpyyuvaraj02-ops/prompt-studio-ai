// ==========================================
// PROMPT STUDIO - SKILLS ADMIN CONTROLLER
// ==========================================

function loadSkillsTable() {
  const tableBody = document.getElementById('skills-table-body');
  if (!tableBody) return;

  const skills = StorageHelper.get('ps_skills');

  // Search filter
  const searchQuery = document.getElementById('skill-search')?.value.toLowerCase() || "";
  const categoryFilter = document.getElementById('skill-category-filter')?.value || "All";

  let filtered = skills.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery) || 
                          s.description.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No skills found.</td></tr>`;
  } else {
    tableBody.innerHTML = filtered.map(s => {
      const categoryBadge = s.category === 'built-in' ? 'badge-soft-primary' : 'badge-soft-success';
      const featuresCount = s.features ? s.features.length : 0;
      return `
        <tr>
          <td><span class="font-monospace fw-bold text-secondary">${s.id}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2.5">
              <div class="bg-indigo bg-opacity-10 rounded text-indigo d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: rgba(99, 102, 241, 0.1);">
                <i class="bi bi-file-earmark-code fs-7 text-primary"></i>
              </div>
              <div>
                <span class="fw-bold text-dark d-block">${s.title}</span>
                <span class="text-muted fs-9">${s.description}</span>
              </div>
            </div>
          </td>
          <td><span class="badge ${categoryBadge} text-capitalize">${s.category}</span></td>
          <td><span class="fw-semibold text-secondary font-monospace" style="font-size: 0.8rem;">v1.0.0</span></td>
          <td><span class="badge badge-soft-success text-uppercase" style="font-size: 9.5px;">Active</span></td>
          <td>
            <div class="d-flex align-items-center gap-1.5">
              <button class="btn btn-light btn-sm action-btn-hover" onclick="editSkillModal('${s.id}')" title="Edit blueprint"><i class="bi bi-pencil text-secondary"></i></button>
              <button class="btn btn-light btn-sm action-btn-hover" onclick="duplicateSkill('${s.id}')" title="Duplicate blueprint"><i class="bi bi-copy text-info"></i></button>
              <button class="btn btn-light btn-sm action-btn-hover" onclick="exportSkill('${s.id}')" title="Export JSON"><i class="bi bi-download text-primary"></i></button>
              <button class="btn btn-light btn-sm action-btn-hover" onclick="deleteSkill('${s.id}')" title="Delete skill"><i class="bi bi-trash text-danger"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

window.deleteSkill = function(id) {
  if (confirm("Are you sure you want to permanently delete this agent skill?")) {
    const skills = StorageHelper.get('ps_skills');
    const target = skills.find(s => s.id === id);
    const updated = skills.filter(s => s.id !== id);
    StorageHelper.set('ps_skills', updated);

    StorageHelper.addLog("admin@promptstudio.ai", "Skill Deleted", "Skills", "Success", `Permanently deleted custom skill: ${target ? target.title : id}`);
    loadSkillsTable();
  }
};

window.duplicateSkill = function(id) {
  const skills = StorageHelper.get('ps_skills');
  const target = skills.find(s => s.id === id);
  if (!target) return;

  const newId = "s-" + Date.now();
  const cloned = {
    ...target,
    id: newId,
    title: `${target.title} (Copy)`,
    category: 'custom' // cloned always custom
  };

  skills.push(cloned);
  StorageHelper.set('ps_skills', skills);

  StorageHelper.addLog("admin@promptstudio.ai", "Skill Duplicated", "Skills", "Success", `Duplicated skill blueprint: ${target.title}`);
  loadSkillsTable();
};

window.exportSkill = function(id) {
  const skills = StorageHelper.get('ps_skills');
  const target = skills.find(s => s.id === id);
  if (!target) return;

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(target, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `skill_${target.title.toLowerCase().replace(/\s+/g, '_')}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  StorageHelper.addLog("admin@promptstudio.ai", "Skill Exported", "Skills", "Success", `Exported skill: ${target.title}`);
};

// Import Skill trigger
window.triggerImportSkill = function() {
  document.getElementById('skill-import-file').click();
};

window.handleImportSkillFile = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.title || !parsed.description) {
        throw new Error("Missing mandatory fields: title or description");
      }

      const skills = StorageHelper.get('ps_skills');
      parsed.id = "s-" + Date.now();
      parsed.category = 'custom';
      skills.unshift(parsed);
      StorageHelper.set('ps_skills', skills);

      StorageHelper.addLog("admin@promptstudio.ai", "Skill Imported", "Skills", "Success", `Imported custom skill: ${parsed.title}`);
      StorageHelper.addNotification(`New custom skill imported: ${parsed.title}`, "Skills");
      loadSkillsTable();
    } catch (err) {
      alert("Invalid skill template file format: " + err.message);
    }
  };
  reader.readAsText(file);
};

// Create Modal Triggers
window.createNewSkill = function() {
  const title = document.getElementById('add-skill-title').value.trim();
  const description = document.getElementById('add-skill-description').value.trim();
  const featuresText = document.getElementById('add-skill-features').value.trim();

  if (!title || !description) {
    alert("Please enter a Title and Description for the Skill.");
    return;
  }

  const features = featuresText ? featuresText.split('\n').map(f => f.trim()).filter(Boolean) : [];
  const skills = StorageHelper.get('ps_skills');
  const newId = "s-" + Date.now();

  const newSkill = {
    id: newId,
    title,
    description,
    category: 'custom',
    features,
    outputs: ['index.html', 'style.css']
  };

  skills.unshift(newSkill);
  StorageHelper.set('ps_skills', skills);

  StorageHelper.addLog("admin@promptstudio.ai", "Skill Created", "Skills", "Success", `Created custom skill: ${title}`);
  StorageHelper.addNotification(`New custom skill created: ${title}`, "Skills");

  document.getElementById('add-skill-form').reset();
  bootstrap.Modal.getInstance(document.getElementById('skillAddModal')).hide();
  loadSkillsTable();
};

// Edit Modal
window.editSkillModal = function(id) {
  const skills = StorageHelper.get('ps_skills');
  const skill = skills.find(s => s.id === id);
  if (!skill) return;

  document.getElementById('edit-skill-id').value = skill.id;
  document.getElementById('edit-skill-title').value = skill.title;
  document.getElementById('edit-skill-description').value = skill.description;
  document.getElementById('edit-skill-features').value = skill.features ? skill.features.join('\n') : "";

  const myModal = new bootstrap.Modal(document.getElementById('skillEditModal'));
  myModal.show();
};

window.saveEditedSkill = function() {
  const id = document.getElementById('edit-skill-id').value;
  const title = document.getElementById('edit-skill-title').value.trim();
  const description = document.getElementById('edit-skill-description').value.trim();
  const featuresText = document.getElementById('edit-skill-features').value.trim();

  if (!title || !description) {
    alert("Please enter a Title and Description.");
    return;
  }

  let skills = StorageHelper.get('ps_skills');
  const index = skills.findIndex(s => s.id === id);
  if (index !== -1) {
    skills[index].title = title;
    skills[index].description = description;
    skills[index].features = featuresText ? featuresText.split('\n').map(f => f.trim()).filter(Boolean) : [];
    StorageHelper.set('ps_skills', skills);

    StorageHelper.addLog("admin@promptstudio.ai", "Skill Edited", "Skills", "Success", `Edited metadata for skill blueprint: ${title}`);
    bootstrap.Modal.getInstance(document.getElementById('skillEditModal')).hide();
    loadSkillsTable();
  }
};

// Setup listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('skill-search');
  const categoryFilter = document.getElementById('skill-category-filter');

  if (searchInput) searchInput.addEventListener('keyup', loadSkillsTable);
  if (categoryFilter) categoryFilter.addEventListener('change', loadSkillsTable);

  loadSkillsTable();
});
