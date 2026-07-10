// ==========================================
// PROMPT STUDIO SUPER ADMIN STORAGE ROUTER
// ==========================================

// Make sure the shared storage helper functions are accessible
if (typeof StorageHelper === 'undefined') {
  // Re-import initialization if loaded directly
  console.log("Initializing root secure Super Admin state.");
}

// Redirect helpers
window.checkSuperAdminAuth = function() {
  const adminLoggedIn = localStorage.getItem('ps_super_admin_logged_in');
  if (adminLoggedIn !== 'true') {
    window.location.href = './login.html';
  }
};
