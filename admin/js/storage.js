// ==========================================
// PROMPT STUDIO STORAGE & DATA LAYER
// ==========================================

const INITIAL_CATEGORIES = [
  "Frontend", "Backend", "Full Stack", "AI", "Machine Learning", 
  "Python", "Java", "Flutter", "UI UX", "Marketing", "Resume", "Documentation"
];

const INITIAL_USERS = [
  { id: "U-801", name: "Aria Chen", email: "aria@promptstudio.ai", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", role: "Content Reviewer", status: "Active", joinedDate: "2026-01-15", posts: 8, purchases: 12 },
  { id: "U-802", name: "Devin Mercer", email: "devin@promptstudio.ai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", role: "Community Manager", status: "Active", joinedDate: "2026-02-10", posts: 14, purchases: 5 },
  { id: "U-803", name: "Marcus Thorne", email: "marcus@gmail.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", role: "User", status: "Active", joinedDate: "2026-03-01", posts: 5, purchases: 3 },
  { id: "U-804", name: "Elena Rostova", email: "elena.r@yahoo.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", role: "User", status: "Suspended", joinedDate: "2026-03-12", posts: 0, purchases: 1 },
  { id: "U-805", name: "Kenji Sato", email: "kenji@promptstudio.ai", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", role: "Support Team", status: "Active", joinedDate: "2026-04-18", posts: 9, purchases: 8 }
];

const INITIAL_ADMINS = [
  { id: "ADM-01", name: "Jane Doe", email: "admin@promptstudio.ai", role: "Admin", status: "Active", lastLogin: "2026-07-08 09:12", createdDate: "2025-12-01" },
  { id: "ADM-02", name: "Super Chief", email: "super@promptstudio.ai", role: "Super Admin", status: "Active", lastLogin: "2026-07-08 09:20", createdDate: "2025-11-15" },
  { id: "ADM-03", name: "Aria Chen", email: "aria@promptstudio.ai", role: "Content Reviewer", status: "Active", lastLogin: "2026-07-07 15:45", createdDate: "2026-01-15" }
];

const INITIAL_REPORTS = [
  { id: "R-001", type: "Community", targetId: "c1", targetTitle: "Next-Gen SaaS Spec Sheet", reportedBy: "Marcus Thorne", reason: "Copyright infringement from private repo", date: "2026-07-07", status: "Pending" },
  { id: "R-002", type: "Marketplace", targetId: "m2", targetTitle: "Claude UI Polish Blueprint", reportedBy: "Kenji Sato", reason: "Spam / Broken prompt codes", date: "2026-07-08", status: "Pending" }
];

const INITIAL_ANNOUNCEMENTS = [
  { id: "A-101", title: "Platform V2 Deployment Ready", description: "All local offline compilers have been updated to support GPT-5 context nodes directly in the browser workspace.", priority: "Critical", category: "System", date: "2026-07-08", expiryDate: "2026-08-01", status: "Published" },
  { id: "A-102", title: "Weekly Blueprint Competition", description: "Publish your best offline SaaS template to the community area. The top voted creator receives $250 credits.", priority: "Important", category: "Event", date: "2026-07-05", expiryDate: "2026-07-15", status: "Published" }
];

const INITIAL_SETTINGS = {
  websiteName: "Prompt Studio AI",
  logoText: "Prompt Studio AI",
  primaryColor: "#4f46e5",
  darkMode: false,
  maintenanceMode: false,
  communityStatus: "Enabled",
  marketplaceStatus: "Enabled",
  registration: "Enabled",
  emailVerification: "Disabled"
};

const INITIAL_LOGS = [
  { date: "2026-07-08 09:20", user: "super@promptstudio.ai", action: "Super Admin Login", module: "Security", status: "Success", ip: "192.168.1.10", details: "Logged in via root secure panel." },
  { date: "2026-07-08 09:12", user: "admin@promptstudio.ai", action: "Admin Login", module: "Security", status: "Success", ip: "192.168.1.15", details: "Logged in via standard panel." },
  { date: "2026-07-08 08:45", user: "Marcus Thorne", action: "Prompt Upload", module: "Community", status: "Success", ip: "192.168.1.121", details: "Uploaded blueprint titled 'Custom Coffee POS'." },
  { date: "2026-07-07 18:30", user: "aria@promptstudio.ai", action: "User Promotion", module: "Users", status: "Success", ip: "192.168.1.44", details: "Promoted Devin Mercer to Community Manager." },
  { date: "2026-07-07 14:15", user: "admin@promptstudio.ai", action: "Prompt Approval", module: "Community", status: "Success", ip: "192.168.1.15", details: "Approved Next-Gen SaaS spec sheet." }
];

const INITIAL_NOTIFICATIONS = [
  { id: "N-01", text: "New User Registered: Kenji Sato", type: "User", date: "2h ago", read: false },
  { id: "N-02", text: "New Prompt Uploaded: 'Custom Coffee POS'", type: "Community", date: "3h ago", read: false },
  { id: "N-03", text: "Prompt Reported by Marcus Thorne", type: "Report", date: "1d ago", read: true },
  { id: "N-04", text: "Marketplace Purchase: 'GPT-5 Full-Stack SaaS Package'", type: "Marketplace", date: "1d ago", read: true }
];

const INITIAL_ROLE_PERMISSIONS = {
  "Super Admin": { users: true, community: true, marketplace: true, skills: true, reports: true, settings: true, security: true, logs: true },
  "Admin": { users: true, community: true, marketplace: true, skills: true, reports: true, settings: true, security: false, logs: true },
  "Moderator": { users: false, community: true, marketplace: true, skills: false, reports: true, settings: false, security: false, logs: false },
  "Content Reviewer": { users: false, community: true, marketplace: false, skills: false, reports: true, settings: false, security: false, logs: false },
  "Community Manager": { users: false, community: true, marketplace: false, skills: false, reports: false, settings: false, security: false, logs: false },
  "Marketplace Manager": { users: false, community: false, marketplace: true, skills: false, reports: false, settings: false, security: false, logs: false }
};

const INITIAL_FEATURES = {
  promptGenerator: true,
  skillCenter: true,
  community: true,
  marketplace: true,
  chat: true,
  promptSelling: true,
  promptBuying: true,
  comments: true,
  likes: true,
  downloads: true,
  notifications: true,
  history: true,
  leaderboard: true,
  creatorProfiles: true,
  darkMode: false,
  announcements: true
};

// INITIALIZATION LOGIC
window.initAdminStorage = function() {
  if (!localStorage.getItem('ps_users_list')) {
    localStorage.setItem('ps_users_list', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('ps_admins_list')) {
    localStorage.setItem('ps_admins_list', JSON.stringify(INITIAL_ADMINS));
  }
  if (!localStorage.getItem('ps_categories')) {
    localStorage.setItem('ps_categories', JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem('ps_reports')) {
    localStorage.setItem('ps_reports', JSON.stringify(INITIAL_REPORTS));
  }
  if (!localStorage.getItem('ps_announcements')) {
    localStorage.setItem('ps_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem('ps_admin_settings')) {
    localStorage.setItem('ps_admin_settings', JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem('ps_audit_logs')) {
    localStorage.setItem('ps_audit_logs', JSON.stringify(INITIAL_LOGS));
  }
  if (!localStorage.getItem('ps_notifications')) {
    localStorage.setItem('ps_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem('ps_role_permissions')) {
    localStorage.setItem('ps_role_permissions', JSON.stringify(INITIAL_ROLE_PERMISSIONS));
  }
  if (!localStorage.getItem('ps_features_toggle')) {
    localStorage.setItem('ps_features_toggle', JSON.stringify(INITIAL_FEATURES));
  }
};

window.initAdminStorage();

// Storage Getters & Setters Helpers
window.StorageHelper = {
  get: (key, fallback = []) => JSON.parse(localStorage.getItem(key)) || fallback,
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  
  // Custom helper for logging audits
  addLog: (user, action, module, status, details = "") => {
    const logs = StorageHelper.get('ps_audit_logs');
    const newLog = {
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: user || "system@promptstudio.ai",
      action,
      module,
      status,
      ip: "192.168.1." + Math.floor(Math.random() * 254 + 1),
      details
    };
    logs.unshift(newLog);
    StorageHelper.set('ps_audit_logs', logs);
  },

  // Custom helper for system notifications
  addNotification: (text, type = "System") => {
    const notifications = StorageHelper.get('ps_notifications');
    const newNotif = {
      id: "N-" + Date.now(),
      text,
      type,
      date: "Just now",
      read: false
    };
    notifications.unshift(newNotif);
    StorageHelper.set('ps_notifications', notifications);
  }
};
