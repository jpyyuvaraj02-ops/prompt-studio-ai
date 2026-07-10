// ==========================================
// PROMPT STUDIO - CORE ADMIN CONTROLLER
// ==========================================

// Authenticate Admin Session
function checkAdminAuth() {
  const adminLoggedIn = localStorage.getItem('ps_admin_logged_in');
  const isLoginPage = window.location.pathname.includes('admin-login.html');
  
  if (adminLoggedIn !== 'true' && !isLoginPage) {
    window.location.href = './admin-login.html';
  }
}

// Global Logout Action
window.adminLogout = function() {
  localStorage.removeItem('ps_admin_logged_in');
  window.location.href = './admin-login.html';
};

// Toggle Sidebar Mobile
window.toggleSidebar = function() {
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebar) sidebar.classList.toggle('show');
};

// Dynamic Sidebar Renderer
function injectAdminSidebar() {
  const sidebarTarget = document.getElementById('admin-sidebar-target');
  if (!sidebarTarget) return;

  const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';

  const menuItems = [
    { name: "Dashboard", file: "dashboard.html", icon: "bi-speedometer2" },
    { name: "Users", file: "users.html", icon: "bi-people" },
    { name: "Community Control", file: "community.html", icon: "bi-chat-heart" },
    { name: "Marketplace Control", file: "marketplace.html", icon: "bi-shop" },
    { name: "Skill Center", file: "skills.html", icon: "bi-file-earmark-code" },
    { name: "Prompt Library", file: "prompt-library.html", icon: "bi-journal-code" },
    { name: "Categories", file: "categories.html", icon: "bi-tags" },
    { name: "Reports", file: "reports.html", icon: "bi-exclamation-triangle" },
    { name: "Analytics", file: "analytics.html", icon: "bi-graph-up" },
    { name: "Announcements", file: "announcements.html", icon: "bi-megaphone" },
    { name: "System Settings", file: "settings.html", icon: "bi-gear" },
    { name: "Activity Logs", file: "logs.html", icon: "bi-list-stars" }
  ];

  let sidebarHtml = `
    <div class="admin-sidebar" id="admin-sidebar">
      <div class="admin-sidebar-logo">
        <div class="bg-primary text-white rounded d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
          <i class="bi bi-sparkles"></i>
        </div>
        <span class="fs-6 fw-bold text-white tracking-tight">Prompt Studio AI</span>
      </div>
      <div class="admin-sidebar-menu">
        <p class="text-uppercase text-muted fw-bold fs-9 px-3 mb-2" style="font-size: 10px; letter-spacing: 0.05em;">Orchestration Panel</p>
  `;

  menuItems.forEach(item => {
    const isActive = currentFile === item.file ? 'active' : '';
    sidebarHtml += `
      <a href="./${item.file}" class="admin-sidebar-link ${isActive}">
        <i class="bi ${item.icon}"></i>
        <span>${item.name}</span>
      </a>
    `;
  });

  sidebarHtml += `
      </div>
      <div class="admin-sidebar-profile">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Admin" class="rounded-circle border" style="width: 36px; height: 36px; object-fit: cover;" />
            <div>
              <span class="text-white fw-semibold fs-8 d-block leading-none" style="font-size: 0.85rem;">Jane Doe</span>
              <span class="text-success fs-9" style="font-size: 0.75rem;"><i class="bi bi-circle-fill me-1" style="font-size: 6px;"></i>Online</span>
            </div>
          </div>
          <button class="btn btn-link text-danger p-1" onclick="adminLogout()" title="Logout Admin">
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  sidebarTarget.innerHTML = sidebarHtml;
}

// Dynamic Header Renderer
function injectAdminHeader() {
  const headerTarget = document.getElementById('admin-header-target');
  if (!headerTarget) return;

  const pageTitle = headerTarget.getAttribute('data-title') || "Dashboard";
  const notifications = JSON.parse(localStorage.getItem('ps_notifications')) || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  let notificationsListHtml = '';
  if (notifications.length === 0) {
    notificationsListHtml = `<li><span class="dropdown-item text-muted text-center py-2 fs-9">No new alerts</span></li>`;
  } else {
    notifications.forEach(notif => {
      const iconClass = notif.type === 'Report' ? 'text-danger bi-exclamation-triangle' : 'text-primary bi-bell';
      const readStyle = notif.read ? 'opacity-60' : 'fw-bold';
      notificationsListHtml += `
        <li>
          <a class="dropdown-item py-2 border-bottom border-light d-flex align-items-start gap-2.5 ${readStyle}" href="#" onclick="markNotificationRead('${notif.id}'); return false;">
            <i class="bi ${iconClass} fs-8 mt-0.5"></i>
            <div>
              <p class="mb-0 fs-9 leading-normal" style="font-size: 0.8rem; white-space: normal;">${notif.text}</p>
              <span class="text-muted fs-9" style="font-size: 0.7rem;">${notif.date}</span>
            </div>
          </a>
        </li>
      `;
    });
  }

  headerTarget.innerHTML = `
    <div class="admin-header w-100">
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary d-lg-none py-1 px-2" onclick="toggleSidebar()">
          <i class="bi bi-list"></i>
        </button>
        <div>
          <span class="text-muted fs-9 text-uppercase tracking-wider fw-bold mb-0.5 d-block" style="font-size: 0.7rem;">New Conversation</span>
          <h4 class="mb-0 fw-extrabold text-dark fs-5">${pageTitle}</h4>
        </div>
      </div>
      
      <!-- Top Action Controls -->
      <div class="d-flex align-items-center gap-3">
        <!-- Global Search Bar -->
        <div class="position-relative d-none d-md-block">
          <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y text-muted ms-3"></i>
          <input type="text" class="form-control rounded-pill bg-light border-0 ps-5 fs-9" placeholder="Universal Search..." style="width: 240px; font-size: 0.8rem; height: 38px;" onkeyup="handleGlobalSearch(event)" id="global-search-input" />
        </div>

        <!-- Notification Bell Dropdown -->
        <div class="dropdown">
          <button class="btn btn-light rounded-circle p-2 position-relative shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-bell-fill text-secondary"></i>
            ${unreadCount > 0 ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 8px;">${unreadCount}</span>` : ''}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-4" style="width: 300px; max-height: 400px; overflow-y: auto; z-index: 2000;">
            <li class="dropdown-header border-bottom pb-2 d-flex align-items-center justify-content-between">
              <span class="fw-bold text-dark fs-8">Notifications</span>
              <button class="btn btn-link p-0 fs-9 text-decoration-none" onclick="clearAllNotifications(); return false;">Clear all</button>
            </li>
            ${notificationsListHtml}
          </ul>
        </div>

        <!-- User Profile Avatar Quick Actions -->
        <div class="dropdown">
          <button class="btn p-0 rounded-circle border overflow-hidden" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width: 38px; height: 38px;">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Avatar" class="w-100 h-100" style="object-fit: cover;" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-4">
            <li class="px-3 py-2 border-bottom">
              <span class="fw-bold text-dark d-block fs-8">Jane Doe</span>
              <span class="text-muted fs-9">admin@promptstudio.ai</span>
            </li>
            <li><a class="dropdown-item py-2 fs-9" href="./settings.html"><i class="bi bi-gear me-2"></i>System Settings</a></li>
            <li><a class="dropdown-item py-2 fs-9 text-danger" href="#" onclick="adminLogout(); return false;"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Mark dynamic alerts as read
window.markNotificationRead = function(id) {
  const notifications = JSON.parse(localStorage.getItem('ps_notifications')) || [];
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('ps_notifications', JSON.stringify(updated));
  injectAdminHeader();
};

// Clear alerts
window.clearAllNotifications = function() {
  localStorage.setItem('ps_notifications', JSON.stringify([]));
  injectAdminHeader();
};

// Universal Global Search router
window.handleGlobalSearch = function(event) {
  if (event.key === 'Enter') {
    const query = event.target.value.trim().toLowerCase();
    if (!query) return;

    // Direct routing based on matched queries
    if (query.includes('user') || query.includes('member') || query.includes('maria') || query.includes('devin')) {
      window.location.href = `./users.html?search=${query}`;
    } else if (query.includes('skill') || query.includes('md') || query.includes('react')) {
      window.location.href = `./skills.html?search=${query}`;
    } else if (query.includes('market') || query.includes('buy') || query.includes('sell')) {
      window.location.href = `./marketplace.html?search=${query}`;
    } else {
      window.location.href = `./prompt-library.html?search=${query}`;
    }
  }
};

// Initialize Admin Shell
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  injectAdminSidebar();
  injectAdminHeader();
});
