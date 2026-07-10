// ==============================================
// PROMPT STUDIO - CORE SUPER ADMIN CONTROLLER
// ==============================================

// Verify Super Admin Auth
function checkSuperAdminAuth() {
  const isLoginPage = window.location.pathname.includes('login.html');
  const superLoggedIn = localStorage.getItem('ps_super_admin_logged_in');

  if (superLoggedIn !== 'true' && !isLoginPage) {
    window.location.href = './login.html';
  }
}

// Global Super Admin Logout
window.superAdminLogout = function() {
  localStorage.removeItem('ps_super_admin_logged_in');
  window.location.href = './login.html';
};

// Toggle Sidebar Mobile
window.toggleSuperSidebar = function() {
  const sidebar = document.getElementById('super-sidebar');
  if (sidebar) sidebar.classList.toggle('show');
};

// Dynamic Super Sidebar Injector
function injectSuperSidebar() {
  const sidebarTarget = document.getElementById('super-sidebar-target');
  if (!sidebarTarget) return;

  const currentFile = window.location.pathname.split('/').pop() || 'dashboard.html';

  const menuItems = [
    { name: "Dashboard", file: "dashboard.html", icon: "bi-speedometer" },
    { name: "Admin Management", file: "admins.html", icon: "bi-shield-lock" },
    { name: "Role Management", file: "roles.html", icon: "bi-shield-check" },
    { name: "User Management", file: "users.html", icon: "bi-people" },
    { name: "Community Control", file: "community.html", icon: "bi-chat-heart" },
    { name: "Marketplace Control", file: "marketplace.html", icon: "bi-shop" },
    { name: "Feature Management", file: "features.html", icon: "bi-toggle-on" },
    { name: "Broadcast Center", file: "notifications.html", icon: "bi-megaphone" },
    { name: "System Analytics", file: "analytics.html", icon: "bi-graph-up-arrow" },
    { name: "Platform Health", file: "health.html", icon: "bi-heart-pulse" },
    { name: "Backup & Restore", file: "backup.html", icon: "bi-cloud-download" },
    { name: "Security Center", file: "security.html", icon: "bi-safe" },
    { name: "Audit Logs", file: "audit-logs.html", icon: "bi-list-stars" },
    { name: "System Settings", file: "settings.html", icon: "bi-gear" }
  ];

  let sidebarHtml = `
    <div class="admin-sidebar" id="super-sidebar" style="background-color: #030712;">
      <div class="admin-sidebar-logo" style="border-bottom-color: #111827;">
        <div class="bg-violet text-white rounded d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background-color: #7c3aed;">
          <i class="bi bi-shield-fill-check"></i>
        </div>
        <span class="fs-6 fw-bold text-white tracking-tight">Super Admin</span>
        <span class="badge super-badge">Root</span>
      </div>
      <div class="admin-sidebar-menu">
        <p class="text-uppercase text-muted fw-bold fs-9 px-3 mb-2" style="font-size: 10px; letter-spacing: 0.05em; color: #4b5563 !important;">System Root Panel</p>
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
      <div class="admin-sidebar-profile" style="background-color: rgba(0, 0, 0, 0.4); border-top-color: #111827;">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Super Admin" class="rounded-circle border" style="width: 36px; height: 36px; object-fit: cover;" />
            <div>
              <span class="text-white fw-semibold fs-8 d-block leading-none" style="font-size: 0.85rem;">Super Chief</span>
              <span class="text-info fs-9" style="font-size: 0.75rem;"><i class="bi bi-circle-fill me-1" style="font-size: 6px;"></i>Sysop Online</span>
            </div>
          </div>
          <button class="btn btn-link text-danger p-1" onclick="superAdminLogout()" title="Logout Root">
            <i class="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  sidebarTarget.innerHTML = sidebarHtml;
}

// Dynamic Super Header Renderer
function injectSuperHeader() {
  const headerTarget = document.getElementById('super-header-target');
  if (!headerTarget) return;

  const pageTitle = headerTarget.getAttribute('data-title') || "Root Dashboard";

  headerTarget.innerHTML = `
    <div class="admin-header w-100">
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-outline-secondary d-lg-none py-1 px-2" onclick="toggleSuperSidebar()">
          <i class="bi bi-list"></i>
        </button>
        <div>
          <span class="text-muted fs-9 text-uppercase tracking-wider fw-bold mb-0.5 d-block" style="font-size: 0.7rem; color: #7c3aed !important;">System Core Console</span>
          <h4 class="mb-0 fw-extrabold text-dark fs-5 d-flex align-items-center gap-2">
            <span>${pageTitle}</span>
            <span class="badge bg-danger bg-opacity-10 text-danger fs-9 rounded px-2" style="font-size: 11px;">🔒 Super Secure</span>
          </h4>
        </div>
      </div>
      
      <!-- Top Action Controls -->
      <div class="d-flex align-items-center gap-3">
        <!-- System Health Quick Indicator -->
        <div class="d-none d-md-flex align-items-center gap-1.5 px-3 py-1.5 bg-success bg-opacity-10 text-success rounded-pill fs-9 fw-semibold border border-success border-opacity-20">
          <i class="bi bi-activity animate-pulse"></i>
          <span>Nodes: Healthy</span>
        </div>

        <!-- Notification / Log Alerts -->
        <a class="btn btn-light rounded-circle p-2 position-relative shadow-sm" href="./audit-logs.html">
          <i class="bi bi-journal-text text-secondary"></i>
        </a>

        <!-- User Profile Avatar Quick Actions -->
        <div class="dropdown">
          <button class="btn p-0 rounded-circle border overflow-hidden" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="width: 38px; height: 38px;">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" alt="Avatar" class="w-100 h-100" style="object-fit: cover;" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-4">
            <li class="px-3 py-2 border-bottom">
              <span class="fw-bold text-dark d-block fs-8">Super Chief</span>
              <span class="text-muted fs-9">super@promptstudio.ai</span>
            </li>
            <li><a class="dropdown-item py-2 fs-9 text-danger" href="#" onclick="superAdminLogout(); return false;"><i class="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Initialize Super Admin Shell
document.addEventListener('DOMContentLoaded', () => {
  checkSuperAdminAuth();
  injectSuperSidebar();
  injectSuperHeader();
});
