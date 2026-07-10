import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          // Admin Pages
          'admin-login': path.resolve(__dirname, 'admin/admin-login.html'),
          'admin-dashboard': path.resolve(__dirname, 'admin/dashboard.html'),
          'admin-users': path.resolve(__dirname, 'admin/users.html'),
          'admin-community': path.resolve(__dirname, 'admin/community.html'),
          'admin-marketplace': path.resolve(__dirname, 'admin/marketplace.html'),
          'admin-skills': path.resolve(__dirname, 'admin/skills.html'),
          'admin-prompts': path.resolve(__dirname, 'admin/prompt-library.html'),
          'admin-categories': path.resolve(__dirname, 'admin/categories.html'),
          'admin-reports': path.resolve(__dirname, 'admin/reports.html'),
          'admin-analytics': path.resolve(__dirname, 'admin/analytics.html'),
          'admin-announcements': path.resolve(__dirname, 'admin/announcements.html'),
          'admin-settings': path.resolve(__dirname, 'admin/settings.html'),
          'admin-logs': path.resolve(__dirname, 'admin/logs.html'),
          // Super Admin Pages
          'super-login': path.resolve(__dirname, 'super-admin/login.html'),
          'super-dashboard': path.resolve(__dirname, 'super-admin/dashboard.html'),
          'super-admins': path.resolve(__dirname, 'super-admin/admins.html'),
          'super-roles': path.resolve(__dirname, 'super-admin/roles.html'),
          'super-users': path.resolve(__dirname, 'super-admin/users.html'),
          'super-community': path.resolve(__dirname, 'super-admin/community.html'),
          'super-marketplace': path.resolve(__dirname, 'super-admin/marketplace.html'),
          'super-features': path.resolve(__dirname, 'super-admin/features.html'),
          'super-analytics': path.resolve(__dirname, 'super-admin/analytics.html'),
          'super-health': path.resolve(__dirname, 'super-admin/health.html'),
          'super-backup': path.resolve(__dirname, 'super-admin/backup.html'),
          'super-notifications': path.resolve(__dirname, 'super-admin/notifications.html'),
          'super-security': path.resolve(__dirname, 'super-admin/security.html'),
          'super-audit-logs': path.resolve(__dirname, 'super-admin/audit-logs.html'),
          'super-settings': path.resolve(__dirname, 'super-admin/settings.html')
        }
      }
    }
  };
});
