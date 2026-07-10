// ==========================================
// PROMPT STUDIO - USER MANAGEMENT CONTROLLER
// ==========================================

let currentPage = 1;
const itemsPerPage = 5;

function loadUsersTable() {
  const tableBody = document.getElementById('users-table-body');
  if (!tableBody) return;

  let users = StorageHelper.get('ps_users_list');

  // Search filter
  const searchQuery = document.getElementById('user-search-input')?.value.toLowerCase() || "";
  const roleFilter = document.getElementById('user-role-filter')?.value || "All";
  const statusFilter = document.getElementById('user-status-filter')?.value || "All";

  // Check URL params for global search queries
  const urlParams = new URLSearchParams(window.location.search);
  const urlSearch = urlParams.get('search');
  if (urlSearch && !searchQuery) {
    document.getElementById('user-search-input').value = urlSearch;
    // Clear URL to prevent infinite override
    window.history.replaceState({}, document.title, window.location.pathname);
    loadUsersTable();
    return;
  }

  // Filter logic
  let filtered = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery);
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Render Table
  if (paginated.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">No users found matching filters.</td></tr>`;
  } else {
    tableBody.innerHTML = paginated.map(user => {
      const statusBadge = user.status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger';
      const roleBadge = user.role === 'Admin' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10' : 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10';
      return `
        <tr>
          <td><span class="font-monospace fw-bold text-secondary">${user.id}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2.5">
              <img src="${user.avatar}" class="rounded-circle border" style="width: 32px; height: 32px; object-fit: cover;" />
              <div>
                <span class="fw-bold text-dark d-block">${user.name}</span>
                <span class="text-muted fs-9" style="font-size: 0.75rem;">Joined ${user.joinedDate}</span>
              </div>
            </div>
          </td>
          <td><span class="text-muted">${user.email}</span></td>
          <td><span class="badge ${roleBadge} rounded-pill px-2.5 py-1 text-uppercase" style="font-size: 10px;">${user.role}</span></td>
          <td><span class="badge ${statusBadge} px-2 py-1 rounded" style="font-size: 11px;">${user.status}</span></td>
          <td><span class="fw-semibold text-dark">${user.posts || 0}</span></td>
          <td><span class="fw-semibold text-dark">${user.purchases || 0}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-light btn-sm action-btn-hover" onclick="viewUserDetail('${user.id}')" title="View details"><i class="bi bi-eye text-primary"></i></button>
              <button class="btn btn-light btn-sm action-btn-hover" onclick="editUserModal('${user.id}')" title="Edit account"><i class="bi bi-pencil text-secondary"></i></button>
              <button class="btn btn-light btn-sm action-btn-hover" onclick="toggleUserSuspend('${user.id}')" title="${user.status === 'Active' ? 'Suspend' : 'Activate'}"><i class="bi bi-slash-circle text-warning"></i></button>
              <button class="btn btn-light btn-sm action-btn-hover" onclick="deleteUser('${user.id}')" title="Delete account"><i class="bi bi-trash text-danger"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render pagination controls
  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  const paginationEl = document.getElementById('users-pagination');
  if (!paginationEl) return;

  let html = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <button class="page-link fs-9" onclick="changeUserPage(${currentPage - 1})"><i class="bi bi-chevron-left"></i></button>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <button class="page-link fs-9" onclick="changeUserPage(${i})">${i}</button>
      </li>
    `;
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <button class="page-link fs-9" onclick="changeUserPage(${currentPage + 1})"><i class="bi bi-chevron-right"></i></button>
    </li>
  `;

  paginationEl.innerHTML = html;
}

window.changeUserPage = function(page) {
  currentPage = page;
  loadUsersTable();
};

// Filter listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('user-search-input');
  const roleFilter = document.getElementById('user-role-filter');
  const statusFilter = document.getElementById('user-status-filter');

  if (searchInput) searchInput.addEventListener('keyup', () => { currentPage = 1; loadUsersTable(); });
  if (roleFilter) roleFilter.addEventListener('change', () => { currentPage = 1; loadUsersTable(); });
  if (statusFilter) statusFilter.addEventListener('change', () => { currentPage = 1; loadUsersTable(); });

  loadUsersTable();
});

// View detail
window.viewUserDetail = function(id) {
  const users = StorageHelper.get('ps_users_list');
  const user = users.find(u => u.id === id);
  if (!user) return;

  const modalBody = document.getElementById('user-view-detail-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="text-center mb-4">
      <img src="${user.avatar}" class="rounded-circle border border-3 shadow-sm mb-2" style="width: 80px; height: 80px; object-fit: cover;" />
      <h5 class="fw-bold mb-0 text-dark">${user.name}</h5>
      <span class="text-muted fs-9">${user.email}</span>
    </div>
    <div class="row g-2 mb-3 text-center">
      <div class="col-6">
        <div class="p-2 border rounded bg-light">
          <span class="text-muted fs-9 d-block text-uppercase fw-semibold" style="font-size: 9px;">Community Posts</span>
          <span class="fw-bold text-dark fs-7">${user.posts || 0}</span>
        </div>
      </div>
      <div class="col-6">
        <div class="p-2 border rounded bg-light">
          <span class="text-muted fs-9 d-block text-uppercase fw-semibold" style="font-size: 9px;">Purchases Done</span>
          <span class="fw-bold text-dark fs-7">${user.purchases || 0}</span>
        </div>
      </div>
    </div>
    <ul class="list-group list-group-flush fs-9">
      <li class="list-group-item d-flex justify-content-between px-0">
        <span class="text-muted">User ID:</span>
        <span class="fw-bold font-monospace text-dark">${user.id}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between px-0">
        <span class="text-muted">Role Assigned:</span>
        <span class="fw-semibold text-primary">${user.role}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between px-0">
        <span class="text-muted">Status:</span>
        <span class="badge ${user.status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger'}">${user.status}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between px-0">
        <span class="text-muted">Joined Date:</span>
        <span class="text-dark">${user.joinedDate}</span>
      </li>
    </ul>
  `;

  const myModal = new bootstrap.Modal(document.getElementById('userViewModal'));
  myModal.show();
};

// Edit details
window.editUserModal = function(id) {
  const users = StorageHelper.get('ps_users_list');
  const user = users.find(u => u.id === id);
  if (!user) return;

  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-user-name').value = user.name;
  document.getElementById('edit-user-email').value = user.email;
  document.getElementById('edit-user-role').value = user.role;
  document.getElementById('edit-user-status').value = user.status;

  const myModal = new bootstrap.Modal(document.getElementById('userEditModal'));
  myModal.show();
};

window.saveEditedUser = function() {
  const id = document.getElementById('edit-user-id').value;
  const name = document.getElementById('edit-user-name').value.trim();
  const email = document.getElementById('edit-user-email').value.trim();
  const role = document.getElementById('edit-user-role').value;
  const status = document.getElementById('edit-user-status').value;

  if (!name || !email) {
    alert("Please fill in all details.");
    return;
  }

  const users = StorageHelper.get('ps_users_list');
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index].name = name;
    users[index].email = email;
    users[index].role = role;
    users[index].status = status;
    StorageHelper.set('ps_users_list', users);
    
    StorageHelper.addLog("admin@promptstudio.ai", "User Modified", "Users", "Success", `Modified profile details for ${name} (${id})`);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('userEditModal')).hide();
    loadUsersTable();
  }
};

// Toggle suspension
window.toggleUserSuspend = function(id) {
  const users = StorageHelper.get('ps_users_list');
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    const prevStatus = users[index].status;
    const nextStatus = prevStatus === 'Active' ? 'Suspended' : 'Active';
    users[index].status = nextStatus;
    StorageHelper.set('ps_users_list', users);

    StorageHelper.addLog("admin@promptstudio.ai", `User ${nextStatus}`, "Users", "Success", `${nextStatus} user account ${users[index].name} (${id})`);
    loadUsersTable();
  }
};

// Delete user
window.deleteUser = function(id) {
  if (confirm("Are you absolutely sure you want to delete this user? This action cannot be undone.")) {
    const users = StorageHelper.get('ps_users_list');
    const user = users.find(u => u.id === id);
    const updated = users.filter(u => u.id !== id);
    StorageHelper.set('ps_users_list', updated);

    StorageHelper.addLog("admin@promptstudio.ai", "User Deleted", "Users", "Success", `Permanently purged user ${user ? user.name : id}`);
    loadUsersTable();
  }
};

// Add new user
window.addNewUser = function() {
  const name = document.getElementById('add-user-name').value.trim();
  const email = document.getElementById('add-user-email').value.trim();
  const role = document.getElementById('add-user-role').value;
  const status = document.getElementById('add-user-status').value;

  if (!name || !email) {
    alert("Please enter Name and Email Address.");
    return;
  }

  const users = StorageHelper.get('ps_users_list');
  const newId = "U-" + (Math.floor(Math.random() * 900) + 100);
  const newUser = {
    id: newId,
    name,
    email,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    role,
    status,
    joinedDate: new Date().toISOString().split('T')[0],
    posts: 0,
    purchases: 0
  };

  users.unshift(newUser);
  StorageHelper.set('ps_users_list', users);

  StorageHelper.addLog("admin@promptstudio.ai", "User Registered", "Users", "Success", `Manually created user account for ${name} (${newId})`);
  StorageHelper.addNotification(`New user manually registered: ${name}`, "User");

  // Reset Form & Hide Modal
  document.getElementById('add-user-form').reset();
  bootstrap.Modal.getInstance(document.getElementById('userAddModal')).hide();
  loadUsersTable();
};
