import {
  SUGGESTIONS,
  BUILT_IN_SKILLS,
  INITIAL_COMMUNITY_PROMPTS,
  INITIAL_MARKETPLACE_ITEMS,
  generateOutputs
} from './data.js';

// ==========================================
// 1. STATE MANAGEMENT & STORAGE INITIALIZATION
// ==========================================
let state = {
  currentUser: JSON.parse(localStorage.getItem('ps_user')) || null,
  currentTheme: localStorage.getItem('ps_theme') || 'light',
  currentLang: localStorage.getItem('ps_lang') || 'en',
  selectedModel: localStorage.getItem('ps_selected_model') || 'GPT-5',
  selectedSkill: JSON.parse(localStorage.getItem('ps_selected_skill')) || null,
  chatMessages: JSON.parse(localStorage.getItem('ps_chat_messages')) || [],
  
  skills: JSON.parse(localStorage.getItem('ps_skills')) || [...BUILT_IN_SKILLS],
  communityPrompts: JSON.parse(localStorage.getItem('ps_community')) || [...INITIAL_COMMUNITY_PROMPTS],
  marketplaceItems: JSON.parse(localStorage.getItem('ps_marketplace')) || [...INITIAL_MARKETPLACE_ITEMS],
  creatorPrompts: JSON.parse(localStorage.getItem('ps_creator_prompts')) || [],
  creatorSales: JSON.parse(localStorage.getItem('ps_creator_sales')) || [],
  history: JSON.parse(localStorage.getItem('ps_history')) || [],
  cabinet: JSON.parse(localStorage.getItem('ps_cabinet')) || [],
  
  // Active viewing output state
  activeOutput: null,
  activeTab: 'promptMd',

  // Guest features state
  guestBannerDismissed: JSON.parse(localStorage.getItem('ps_guest_banner_dismissed')) || false,
  promptComments: JSON.parse(localStorage.getItem('ps_prompt_comments')) || {}
};

// Available Models Definition (Upgraded for Prompt Studio AI)
const MODELS = [
  { id: 'GPT-5', name: 'GPT-5', desc: 'Advanced next-generation reasoning and execution core' },
  { id: 'Claude 4', name: 'Claude 4 Opus', desc: 'Supreme creative writing, analysis, and spec precision' },
  { id: 'Gemini 2.5 Pro', name: 'Gemini 2.5 Pro', desc: 'Deep logical reasoning & massive context windows' },
  { id: 'Gemini 2.5 Flash', name: 'Gemini 2.5 Flash', desc: 'Fast, highly-efficient prompt synthesis' },
  { id: 'Grok', name: 'Grok 3', desc: 'Real-time search-grounded tech specifications' },
  { id: 'DeepSeek', name: 'DeepSeek V3', desc: 'Symmetric dual-pipe mixture-of-experts model' },
  { id: 'Qwen', name: 'Qwen 2.5 Math', desc: 'Sovereign algorithmic and scientific specs' },
  { id: 'Mistral', name: 'Mistral Large', desc: 'Slick European open-weights enterprise intelligence' },
  { id: 'Llama 3', name: 'Llama 3.3', desc: 'Open-source industrial strength offline specifications' },
  { id: 'Local AI', name: 'Local AI Core', desc: 'On-device private compilation (no cloud telemetry)' }
];

// Language String Map
const STRINGS = {
  en: {
    desk: "Orchestration Desk",
    skills: "Skill Center",
    community: "Community Arena",
    marketplace: "Marketplace Store",
    history: "Saved History",
    downloads: "Downloads Cabinet",
    settings: "Control Settings"
  },
  ta: {
    desk: "வடிவமைப்பு மையம் (Desk)",
    skills: "திறன் மையம் (Skills)",
    community: "சமூக அரங்கம் (Community)",
    marketplace: "சந்தை கடை (Marketplace)",
    history: "சேமிக்கப்பட்ட வரலாறு (History)",
    downloads: "பதிவிறக்கப் பெட்டி (Cabinet)",
    settings: "கட்டுப்பாட்டு அமைப்புகள் (Settings)"
  }
};

// State persistence utility
function saveState() {
  localStorage.setItem('ps_user', JSON.stringify(state.currentUser));
  localStorage.setItem('ps_theme', state.currentTheme);
  localStorage.setItem('ps_lang', state.currentLang);
  localStorage.setItem('ps_selected_model', state.selectedModel);
  localStorage.setItem('ps_selected_skill', JSON.stringify(state.selectedSkill));
  localStorage.setItem('ps_chat_messages', JSON.stringify(state.chatMessages));
  localStorage.setItem('ps_skills', JSON.stringify(state.skills));
  localStorage.setItem('ps_community', JSON.stringify(state.communityPrompts));
  localStorage.setItem('ps_history', JSON.stringify(state.history));
  localStorage.setItem('ps_cabinet', JSON.stringify(state.cabinet));
  localStorage.setItem('ps_guest_banner_dismissed', JSON.stringify(state.guestBannerDismissed));
  localStorage.setItem('ps_prompt_comments', JSON.stringify(state.promptComments));
  localStorage.setItem('ps_creator_prompts', JSON.stringify(state.creatorPrompts));
  localStorage.setItem('ps_creator_sales', JSON.stringify(state.creatorSales));
}

// Global Toast notification trigger
function showToast(message) {
  const toastText = document.getElementById('global-toast-text');
  if (toastText) {
    toastText.innerText = message;
    const toastEl = document.getElementById('app-global-toast');
    const toastInstance = new bootstrap.Toast(toastEl, { delay: 3500 });
    toastInstance.show();
  }
}

// ==========================================
// 2. DOM INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  lucide.createIcons();
});

function initApp() {
  // Apply persisted theme on startup
  applyTheme(state.currentTheme);
  
  // Configure Auth visibility
  updateAuthUI();

  // Load Claude-inspired workspace chat and tools
  initWorkspaceChat();
  renderSkillDropdownOptions();
  updatePillsAndBadges();

  // Load secondary standard components
  renderSkills();
  renderCommunity();
  renderMarketplace();
  renderCreatorDashboard();
  renderHistory();
  renderCabinet();

  // Register main menu action events
  bindMenuEvents();
  bindActionEvents();
}

// Check logged in user state & update widgets
function getInitials(name) {
  if (!name) return 'RT';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'RT';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function updateAuthUI() {
  const landingSection = document.getElementById('landing-view');
  const appSection = document.getElementById('app-workspace-view');

  if (state.currentUser) {
    // Hide marketing landing page, show core application
    landingSection.style.display = 'none';
    appSection.style.display = 'flex';

    // Update profile widgets
    const initials = getInitials(state.currentUser.name);
    document.querySelectorAll('.account-avatar-circle').forEach(el => {
      el.innerText = initials;
    });

    const popoverName = document.getElementById('popover-user-name-display');
    if (popoverName) popoverName.innerText = state.currentUser.name;

    document.getElementById('sidebar-user-name').innerText = state.currentUser.name;
    document.getElementById('sidebar-user-email').innerText = state.currentUser.email;
    document.getElementById('sidebar-user-avatar').src = state.currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
    
    document.getElementById('settings-profile-name').innerText = state.currentUser.name;
    document.getElementById('settings-profile-email').innerText = state.currentUser.email;
    document.getElementById('settings-profile-img').src = state.currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
    
    document.getElementById('settings-name-input').value = state.currentUser.name;
    document.getElementById('settings-email-input').value = state.currentUser.email;
  } else {
    // Display landing page, hide core workspace
    landingSection.style.display = 'block';
    appSection.style.display = 'none';
  }
  
  // Re-render community and marketplace to reflect new auth state locks/CTA
  renderCommunity();
  renderMarketplace();
  renderCreatorDashboard();
  
  lucide.createIcons();
}

// ==========================================
// 3. NAVIGATION VIEW SWITCHES
// ==========================================
function switchView(viewName) {
  // Close mobile drawer if open
  document.getElementById('sidebar-panel').classList.remove('show-mobile');
  document.getElementById('sidebar-backdrop').classList.remove('show-mobile');

  // Hide all main subviews
  const subviews = document.querySelectorAll('.subview');
  subviews.forEach(sub => {
    sub.style.display = 'none';
  });

  // Display matched active subview
  const activeSub = document.getElementById(`subview-${viewName}`);
  if (activeSub) {
    activeSub.style.display = 'block';
  }

  // Highlight active sidebar navigation buttons
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Recreate icons to ensure standard dynamic lucide load
  lucide.createIcons();
}

// Bind navbar and sidebar navigation events
function bindMenuEvents() {
  // Sidebar items
  const sidebarButtons = document.querySelectorAll('.sidebar-btn');
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = btn.getAttribute('data-view');
      switchView(view);
    });
  });

  // Landing triggers
  document.getElementById('landing-nav-comm').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('community');
  });
  document.getElementById('landing-nav-market').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('marketplace');
  });
  document.getElementById('landing-nav-skills').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('skills');
  });
  document.getElementById('footer-link-comm').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('community');
  });
  document.getElementById('footer-link-market').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('marketplace');
  });

  // Add new prompt triggers
  document.getElementById('sidebar-btn-new').addEventListener('click', () => {
    // Show Prompt compiler form block, hide outputs block
    document.getElementById('workspace-form-view').style.display = 'block';
    document.getElementById('workspace-output-view').style.display = 'none';
    switchView('workspace');
    document.getElementById('prompt-text-input').value = '';
    document.getElementById('prompt-text-input').focus();
  });

  // Landing interactive buttons
  document.getElementById('landing-btn-login').addEventListener('click', () => {
    openLoginModal('login');
  });
  document.getElementById('landing-btn-signup').addEventListener('click', () => {
    openLoginModal('signup');
  });
  document.getElementById('hero-btn-workspace').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('workspace');
  });
  document.getElementById('hero-btn-comm').addEventListener('click', () => {
    simulateGuestLogin();
    switchView('community');
  });

  // Mobile drawer controls
  document.getElementById('mobile-hamburger-btn').addEventListener('click', () => {
    document.getElementById('sidebar-panel').classList.add('show-mobile');
    document.getElementById('sidebar-backdrop').classList.add('show-mobile');
  });
  document.getElementById('mobile-sidebar-close').addEventListener('click', () => {
    document.getElementById('sidebar-panel').classList.remove('show-mobile');
    document.getElementById('sidebar-backdrop').classList.remove('show-mobile');
  });
  document.getElementById('sidebar-backdrop').addEventListener('click', () => {
    document.getElementById('sidebar-panel').classList.remove('show-mobile');
    document.getElementById('sidebar-backdrop').classList.remove('show-mobile');
  });

  // Logout trigger
  document.getElementById('sidebar-btn-logout').addEventListener('click', () => {
    const accountPopover = document.getElementById('sidebar-account-popover');
    if (accountPopover) accountPopover.classList.remove('show');
    state.currentUser = null;
    saveState();
    updateAuthUI();
    showToast("Logged out of prompt workspace successfully.");
  });

  // ChatGPT style Account Popover trigger
  const accountBtn = document.getElementById('sidebar-account-btn');
  const accountPopover = document.getElementById('sidebar-account-popover');
  
  if (accountBtn && accountPopover) {
    accountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      accountPopover.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!accountPopover.contains(e.target) && e.target !== accountBtn && !accountBtn.contains(e.target)) {
        accountPopover.classList.remove('show');
      }
    });

    // Option: Profile & Settings buttons
    const profileBtn = document.getElementById('popover-btn-profile');
    const profileViewBtn = document.getElementById('popover-btn-profile-view');
    const settingsBtn = document.getElementById('popover-btn-settings');

    const handleProfileNavigation = (e) => {
      e.stopPropagation();
      accountPopover.classList.remove('show');
      switchView('settings');
      showToast("Switched to Profile & Control Settings.");
    };

    if (profileBtn) profileBtn.addEventListener('click', handleProfileNavigation);
    if (profileViewBtn) profileViewBtn.addEventListener('click', handleProfileNavigation);
    if (settingsBtn) settingsBtn.addEventListener('click', handleProfileNavigation);

    // Try Plus Free option
    const tryPlusBtn = document.getElementById('popover-btn-try-plus');
    if (tryPlusBtn) {
      tryPlusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        accountPopover.classList.remove('show');
        showToast("Try Plus Free selected: Premium features are fully enabled in your guest sandbox!");
      });
    }

    // Personalization option
    const personalizationBtn = document.getElementById('popover-btn-personalization');
    if (personalizationBtn) {
      personalizationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        accountPopover.classList.remove('show');
        showToast("Personalization activated: Custom instruction presets applied to compiler core!");
      });
    }

    // Help option
    const helpBtn = document.getElementById('popover-btn-help');
    if (helpBtn) {
      helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        accountPopover.classList.remove('show');
        showToast("Help Center initialized: Offline support documentation is ready.");
      });
    }
  }
}

// Bypasses landing page instantly if clicked on workspace views directly
function simulateGuestLogin() {
  if (!state.currentUser) {
    state.currentUser = {
      name: "Developer Guest",
      email: "guest@promptstudio.io",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
      role: "Core AI Engineer"
    };
    saveState();
    updateAuthUI();
    showToast("Logged in securely in Guest Sandbox.");
  }
}

// ==========================================
// 4. AUTHENTICATION CONTROLS
// ==========================================
function openLoginModal(mode) {
  const modal = document.getElementById('modal-login-container');
  const title = document.getElementById('login-modal-title');
  const desc = document.getElementById('login-modal-desc');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleBtn = document.getElementById('auth-toggle-mode-btn');

  if (mode === 'login') {
    title.innerText = "Welcome back, Architect";
    desc.innerText = "Connect your secure offline portal credentials.";
    submitBtn.innerText = "Continue to Workspace";
    toggleBtn.innerText = "Don't have an account? Sign Up";
    toggleBtn.setAttribute('data-target', 'signup');
  } else {
    title.innerText = "Establish New Sandbox";
    desc.innerText = "Provision a local developer profile on this device.";
    submitBtn.innerText = "Provision Profile";
    toggleBtn.innerText = "Already registered? Sign In";
    toggleBtn.setAttribute('data-target', 'login');
  }

  modal.classList.remove('d-none');
}

// Configure Dialog overlays & forms
function bindActionEvents() {
  // Modal auth close
  document.getElementById('modal-login-close').addEventListener('click', () => {
    document.getElementById('modal-login-container').classList.add('d-none');
  });

  // Guest Modal triggers
  const guestModal = document.getElementById('modal-guest-login-container');
  const guestCloseBtn = document.getElementById('modal-guest-close');
  if (guestCloseBtn) {
    guestCloseBtn.addEventListener('click', () => {
      guestModal.classList.add('d-none');
    });
  }
  const guestLoginBtn = document.getElementById('guest-modal-login-btn');
  if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', () => {
      guestModal.classList.add('d-none');
      openLoginModal('login');
    });
  }
  const guestSignupBtn = document.getElementById('guest-modal-signup-btn');
  if (guestSignupBtn) {
    guestSignupBtn.addEventListener('click', () => {
      guestModal.classList.add('d-none');
      openLoginModal('signup');
    });
  }
  const guestContinueBtn = document.getElementById('guest-modal-continue-btn');
  if (guestContinueBtn) {
    guestContinueBtn.addEventListener('click', () => {
      guestModal.classList.add('d-none');
    });
  }

  // Auth toggle
  document.getElementById('auth-toggle-mode-btn').addEventListener('click', (e) => {
    const target = e.target.getAttribute('data-target');
    openLoginModal(target);
  });

  // Submit login auth
  document.getElementById('auth-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('auth-name-input').value.trim() || 'Anonymous Developer';
    const email = document.getElementById('auth-email-input').value.trim() || 'anon@promptstudio.io';
    const role = document.getElementById('auth-role-input').value;
    
    state.currentUser = {
      name,
      email,
      role,
      avatar: `https://images.unsplash.com/photo-${role.includes('AI') ? '1507003211169-0a1dd7228f2d' : '1534528741775-53994a69daeb'}?w=100&h=100&fit=crop&crop=faces`
    };

    saveState();
    updateAuthUI();
    document.getElementById('modal-login-container').classList.add('d-none');
    switchView('workspace');
    showToast(`Welcome ${name}! Setup compiler sandbox successfully.`);
  });

  // Custom skills modal
  const skillBtnAdd = document.getElementById('skill-btn-add-custom');
  if (skillBtnAdd) {
    skillBtnAdd.addEventListener('click', () => {
      document.getElementById('modal-skill-container').classList.remove('d-none');
    });
  }
  document.getElementById('modal-skill-close').addEventListener('click', () => {
    document.getElementById('modal-skill-container').classList.add('d-none');
  });
  document.getElementById('skill-creator-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('skill-name-input').value.trim();
    const tech = document.getElementById('skill-tech-input').value.trim();
    const description = document.getElementById('skill-desc-input').value.trim();
    const instructions = document.getElementById('skill-instructions-input').value.trim();

    const newSkill = {
      id: `s-custom-${Date.now()}`,
      title,
      description: `${tech} - ${description}`,
      category: 'custom',
      icon: 'star',
      features: [tech, 'Custom Instructions'],
      outputs: ['Skill.md'],
      instructions
    };

    state.skills.unshift(newSkill);
    saveState();
    renderSkills();
    renderSkillDropdownOptions(); // Refresh the skill dropdown options
    document.getElementById('modal-skill-container').classList.add('d-none');
    document.getElementById('skill-creator-form').reset();
    showToast(`Custom Skill "${title}" successfully integrated.`);
  });

  // Publish community prompt modal
  document.getElementById('comm-btn-publish-own').addEventListener('click', () => {
    document.getElementById('modal-publish-container').classList.remove('d-none');
  });
  document.getElementById('modal-publish-close').addEventListener('click', () => {
    document.getElementById('modal-publish-container').classList.add('d-none');
  });
  const sellPromptModalClose = document.getElementById('modal-sell-prompt-close');
  if (sellPromptModalClose) {
    sellPromptModalClose.addEventListener('click', () => {
      closeSellPromptModal();
    });
  }
  const sellPromptForm = document.getElementById('sell-prompt-form');
  if (sellPromptForm) {
    sellPromptForm.addEventListener('submit', submitSellPromptForm);
  }

  const checkoutModal = document.getElementById('modal-checkout-container');
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        closeCheckoutModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkoutModal && !checkoutModal.classList.contains('d-none')) {
      closeCheckoutModal();
    }
  });

  document.getElementById('publish-prompts-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('publish-title-input').value.trim();
    const description = document.getElementById('publish-desc-input').value.trim();
    const price = parseFloat(document.getElementById('publish-price-input').value);
    const category = document.getElementById('publish-tag-input').value;

    const newPrompt = {
      id: `c-custom-${Date.now()}`,
      title,
      description,
      creator: {
        name: state.currentUser ? state.currentUser.name : "Developer Guest",
        avatar: state.currentUser ? state.currentUser.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces"
      },
      likes: 0,
      downloads: 0,
      price,
      tags: [category, 'Custom', 'SaaS'],
      category,
      timestamp: 'Just now'
    };

    state.communityPrompts.unshift(newPrompt);
    saveState();
    renderCommunity();
    document.getElementById('modal-publish-container').classList.add('d-none');
    document.getElementById('publish-prompts-form').reset();
    showToast(`Successfully published prompt "${title}" to Community Arena.`);
  });

  // File reader lightbox modal close
  document.getElementById('modal-filereader-close').addEventListener('click', () => {
    document.getElementById('modal-filereader-container').classList.add('d-none');
  });
  document.getElementById('filereader-modal-copy-btn').addEventListener('click', () => {
    const code = document.getElementById('filereader-modal-content').innerText;
    navigator.clipboard.writeText(code).then(() => {
      showToast("Copied file content to your clipboard.");
    });
  });

  // Voice recording mock button
  const voiceBtn = document.getElementById('prompt-btn-voice');
  voiceBtn.addEventListener('click', () => {
    const textEl = document.getElementById('voice-text');
    const iconEl = document.getElementById('voice-icon');
    
    if (voiceBtn.classList.contains('btn-danger')) {
      // already listening, cancel
      voiceBtn.classList.remove('btn-danger');
      voiceBtn.classList.add('btn-light');
      textEl.innerText = "Voice Input";
      iconEl.setAttribute('data-lucide', 'mic');
      lucide.createIcons();
    } else {
      voiceBtn.classList.remove('btn-light');
      voiceBtn.classList.add('btn-danger', 'animate-pulse');
      textEl.innerText = "Listening...";
      iconEl.setAttribute('data-lucide', 'square');
      lucide.createIcons();

      setTimeout(() => {
        voiceBtn.classList.remove('btn-danger', 'animate-pulse');
        voiceBtn.classList.add('btn-light');
        textEl.innerText = "Voice Input";
        iconEl.setAttribute('data-lucide', 'mic');
        lucide.createIcons();

        const appendText = "Build a high-performance developer portfolio with custom dark-theme workspace, bento layout, and interactive Github previews.";
        const textarea = document.getElementById('prompt-text-input');
        textarea.value = textarea.value ? textarea.value + " " + appendText : appendText;
        textarea.focus();
        showToast("Voice input compiled successfully.");
      }, 2500);
    }
  });

  // File attachment mock button
  document.getElementById('prompt-btn-upload').addEventListener('click', () => {
    document.getElementById('prompt-file-hidden').click();
  });
  document.getElementById('prompt-file-hidden').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const textarea = document.getElementById('prompt-text-input');
      textarea.value = textarea.value ? textarea.value + `\n\n[Attached File: ${file.name}]` : `[Attached File: ${file.name}]`;
      textarea.focus();
      showToast(`Attached file reference: ${file.name}`);
    }
  });

  // Main Prompt Form generation submission (Upgraded with Claude-style conversation simulator)
  const generatorForm = document.getElementById('prompt-generator-form');
  const promptInput = document.getElementById('prompt-text-input');
  const atPopup = document.getElementById('at-suggestion-popup');

  // Character count and auto-expand events
  if (promptInput) {
    promptInput.addEventListener('input', () => {
      updateCharCount();
      // Auto expand textarea height (min 4 rows, max 12 rows)
      promptInput.style.height = 'auto';
      promptInput.style.height = Math.min(promptInput.scrollHeight, 280) + 'px';

      // Detect @ mentions symbol trigger
      const text = promptInput.value;
      const caretPos = promptInput.selectionStart;
      const beforeCaret = text.slice(0, caretPos);
      const atIndex = beforeCaret.lastIndexOf('@');

      if (atIndex !== -1 && atIndex >= beforeCaret.search(/\s@|^@/)) {
        const query = beforeCaret.slice(atIndex + 1).toLowerCase();
        if (!query.includes(' ')) {
          if (atPopup) {
            atPopup.style.display = 'block';
            // Simple visual filtering of suggestion items
            atPopup.querySelectorAll('.at-suggestion-item').forEach(item => {
              const tag = item.getAttribute('data-tag').toLowerCase();
              if (tag.includes(query)) {
                item.style.display = 'flex';
              } else {
                item.style.display = 'none';
              }
            });
          }
          return;
        }
      }
      if (atPopup) atPopup.style.display = 'none';
    });

    // Ctrl + Enter shortcut to trigger submit
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        generatorForm.requestSubmit();
      }
    });
  }

  // Close suggestion popup when clicking elsewhere
  document.addEventListener('click', (e) => {
    if (atPopup && !atPopup.contains(e.target) && e.target !== promptInput) {
      atPopup.style.display = 'none';
    }
  });

  // Handle @ items selection
  document.querySelectorAll('.at-suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const tag = item.getAttribute('data-tag');
      
      const text = promptInput.value;
      const caretPos = promptInput.selectionStart;
      const beforeCaret = text.slice(0, caretPos);
      const afterCaret = text.slice(caretPos);
      const atIndex = beforeCaret.lastIndexOf('@');
      
      if (atIndex !== -1) {
        promptInput.value = beforeCaret.slice(0, atIndex) + `[Attached: @${tag}] ` + afterCaret;
      } else {
        promptInput.value += ` [Attached: @${tag}] `;
      }
      
      // Auto-attach corresponding specialization skill
      let matchedSkill = null;
      if (tag === 'Frontend Website') matchedSkill = state.skills.find(s => s.id === 's1');
      else if (tag === 'Landing Page') matchedSkill = state.skills.find(s => s.id === 's2');
      else if (tag === 'JavaScript') matchedSkill = state.skills.find(s => s.id === 's6');
      else if (tag === 'Bootstrap') matchedSkill = state.skills.find(s => s.id === 's4');
      else if (tag === 'Portfolio') matchedSkill = state.skills.find(s => s.id === 's3');
      
      if (matchedSkill) {
        state.selectedSkill = matchedSkill;
        saveState();
        updatePillsAndBadges();
        showToast(`Skill Attached: ${matchedSkill.title}`);
      } else {
        showToast(`Topic tag added: @${tag}`);
      }

      if (atPopup) atPopup.style.display = 'none';
      promptInput.focus();
      updateCharCount();
    });
  });

  // Model selection dropdown action trigger
  document.querySelectorAll('#model-dropdown-options [data-model]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const model = item.getAttribute('data-model');
      state.selectedModel = model;
      saveState();
      updatePillsAndBadges();
      showToast(`Switched Active AI Core to: ${model}`);
    });
  });

  // Clear Skill removable badge action
  const removeSkillBtn = document.getElementById('btn-remove-skill');
  if (removeSkillBtn) {
    removeSkillBtn.addEventListener('click', () => {
      state.selectedSkill = null;
      saveState();
      updatePillsAndBadges();
      showToast("Cleared active skill directive.");
    });
  }

  // Clear Chat history action
  const clearChatHandler = () => {
    if (confirm("Are you sure you want to clear the active conversation stream?")) {
      state.chatMessages = [];
      saveState();
      initWorkspaceChat();
      showToast("Chat history cleared.");
    }
  };

  const clearTopBtn = document.getElementById('chat-btn-clear-top');
  if (clearTopBtn) clearTopBtn.addEventListener('click', clearChatHandler);

  const clearBottomBtn = document.getElementById('btn-input-clear');
  if (clearBottomBtn) clearBottomBtn.addEventListener('click', clearChatHandler);

  // Bottom action buttons triggers
  const templatesBtn = document.getElementById('btn-input-templates');
  if (templatesBtn) {
    templatesBtn.addEventListener('click', () => {
      switchView('skills');
      showToast("Opening Skills & Custom Blueprints list.");
    });
  }

  const historyBtn = document.getElementById('btn-input-history');
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      switchView('history');
      showToast("Opening saved prompt spec list.");
    });
  }

  // Submit flow with Typing Delay Simulation
  generatorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const promptText = promptInput.value.trim();
    if (!promptText) {
      showToast("Please describe your custom application specs first.");
      return;
    }

    // 1. Add User Prompt to Chat
    state.chatMessages.push({
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Clear input & reset
    promptInput.value = '';
    promptInput.style.height = 'auto';
    updateCharCount();

    // 2. Append simulated typing bubble
    state.chatMessages.push({
      sender: 'ai',
      text: '',
      timestamp: 'Thinking...',
      isTyping: true
    });
    renderChatMessages();

    // 3. Simulated compiler logic with timeout
    setTimeout(() => {
      // Remove typing bubble
      state.chatMessages = state.chatMessages.filter(m => !m.isTyping);

      // Generate spec results via data.js
      const runResult = generateOutputs(promptText);

      const historyItem = {
        id: `hist-${Date.now()}`,
        title: runResult.title,
        promptText,
        modelId: state.selectedModel,
        projectType: runResult.projectType,
        outputs: runResult.outputs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString()
      };

      state.history.unshift(historyItem);

      // Add to Downloads cabinet automatically for easy packaging
      const files = Object.keys(runResult.outputs).map(key => ({
        name: getTabFileName(key),
        content: runResult.outputs[key]
      }));
      state.cabinet.unshift({
        id: `cab-${Date.now()}`,
        title: `${runResult.title} Spec Pack`,
        projectTitle: runResult.title,
        fileCount: files.length,
        isBundle: true,
        files,
        timestamp: 'Unlocked Just Now'
      });

      // Render response details message block
      const activeSkillName = state.selectedSkill ? state.selectedSkill.title : 'General Prompt Optimizer';
      const responseText = `### Specs Generated Successfully! 🚀
I have compiled the architectural specifications package for **${runResult.title}** using the **${state.selectedModel}** core and the active **${activeSkillName}** skill.

The blueprint bundle includes:
- **Prompt.md**: Role-assigned system engineering prompt instructions
- **SKILL.md**: Context boundaries and constraints file
- **PRD.md**: Extensive Product Requirement Document with feature charts
- **README.md**: Environment instructions and build guidelines
- **schema.sql**: Complete SQL database tables and foreign keys
- **api_endpoints.md**: RESTful endpoints with exact JSON schemas
- **deployment.md**: Multi-stage Docker configurations

You can inspect, preview, and download these files directly inside the code viewer.
<div class="mt-3">
  <button class="btn btn-primary btn-sm fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2" onclick="window.viewHistoryItem('${historyItem.id}')">
    <i data-lucide="external-link" style="width:14px; height:14px;"></i>
    <span>Open Blueprint Workspace</span>
  </button>
</div>`;

      state.chatMessages.push({
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      saveState();
      renderChatMessages();
      renderHistory();
      renderCabinet();
      showToast(`Specifications compiled for: ${runResult.title}`);
    }, 1800);

  });

  // Output Back button
  document.getElementById('output-btn-back').addEventListener('click', () => {
    document.getElementById('workspace-form-view').style.display = 'block';
    document.getElementById('workspace-output-view').style.display = 'none';
  });

  // Tabs selectors inside active Output viewer
  const outputTabsContainer = document.getElementById('output-tabs-container');
  outputTabsContainer.addEventListener('click', (e) => {
    const button = e.target.closest('.output-tab-btn');
    if (button) {
      // Deactivate other buttons
      outputTabsContainer.querySelectorAll('.output-tab-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const fileKey = button.getAttribute('data-tab');
      state.activeTab = fileKey;
      renderActiveOutputFile();
    }
  });

  // Copy active output code tab
  document.getElementById('output-btn-copy-tab').addEventListener('click', () => {
    const activeText = document.getElementById('output-active-filecontent').innerText;
    navigator.clipboard.writeText(activeText).then(() => {
      showToast("Copied file spec content to clipboard.");
    });
  });

  // Add active single file to Downloads cabinet
  document.getElementById('output-btn-download-single').addEventListener('click', () => {
    if (!state.activeOutput) return;
    
    const fileName = getTabFileName(state.activeTab);
    const content = state.activeOutput.outputs[state.activeTab];

    const cabinetItem = {
      id: `cab-${Date.now()}`,
      title: fileName,
      projectTitle: state.activeOutput.title,
      fileCount: 1,
      isBundle: false,
      files: [{ name: fileName, content }],
      timestamp: 'Downloaded today'
    };

    state.cabinet.unshift(cabinetItem);
    saveState();
    renderCabinet();
    showToast(`Added "${fileName}" to Downloads Cabinet.`);
  });

  // Download entire package bundle to cabinet
  document.getElementById('output-btn-download-all').addEventListener('click', () => {
    if (!state.activeOutput) return;

    const files = Object.keys(state.activeOutput.outputs).map(key => ({
      name: getTabFileName(key),
      content: state.activeOutput.outputs[key]
    }));

    const cabinetItem = {
      id: `cab-${Date.now()}`,
      title: `${state.activeOutput.title} Package Bundle`,
      projectTitle: state.activeOutput.title,
      fileCount: files.length,
      isBundle: true,
      files,
      timestamp: 'Downloaded today'
    };

    state.cabinet.unshift(cabinetItem);
    saveState();
    renderCabinet();
    showToast("Downloaded entire project blueprint package successfully.");
  });

  // Saved history actions (Clear All)
  document.getElementById('history-btn-clear-all').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all historical prompt records?")) {
      state.history = [];
      saveState();
      renderHistory();
      showToast("Cleared historical compiler records.");
    }
  });

  // Downloads cabinet actions (Clear All)
  document.getElementById('downloads-btn-clear-all').addEventListener('click', () => {
    if (confirm("Are you sure you want to empty the downloads cabinet?")) {
      state.cabinet = [];
      saveState();
      renderCabinet();
      showToast("Cleared downloaded file cabinet.");
    }
  });

  // Profile Edit form settings
  document.getElementById('settings-profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('settings-name-input').value.trim();
    const email = document.getElementById('settings-email-input').value.trim();

    if (state.currentUser) {
      state.currentUser.name = name;
      state.currentUser.email = email;
    } else {
      state.currentUser = { name, email, role: 'Enterprise Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' };
    }

    saveState();
    updateAuthUI();
    showToast("Saved profile information successfully.");
  });

  // Settings theme triggers
  document.getElementById('settings-theme-light-btn').addEventListener('click', () => {
    applyTheme('light');
    showToast("Enabled Light Slate theme.");
  });
  document.getElementById('settings-theme-dark-btn').addEventListener('click', () => {
    applyTheme('dark');
    showToast("Enabled Obsidian Dark theme.");
  });

  // Settings language triggers
  document.getElementById('settings-lang-en-btn').addEventListener('click', () => {
    applyLanguage('en');
    showToast("Switched language standard to English.");
  });
  document.getElementById('settings-lang-ta-btn').addEventListener('click', () => {
    applyLanguage('ta');
    showToast("தமிழ் மொழிக்கு மாற்றப்பட்டது.");
  });

  // Search filter keyups
  document.getElementById('comm-search-input').addEventListener('input', () => {
    renderCommunity();
  });
  document.getElementById('history-search-input').addEventListener('input', () => {
    renderHistory();
  });
  document.getElementById('downloads-search-input').addEventListener('input', () => {
    renderCabinet();
  });
}

// Convert tab key to beautiful filenames
function getTabFileName(tabKey) {
  switch (tabKey) {
    case 'promptMd': return 'Prompt.md';
    case 'skillMd': return 'SKILL.md';
    case 'prd': return 'PRD.md';
    case 'readme': return 'README.md';
    case 'database': return 'schema.sql';
    case 'api': return 'api_endpoints.md';
    case 'deployment': return 'deployment.md';
    default: return `${tabKey}.txt`;
  }
}

// ==========================================
// 5. THEMING & TRANSLATION ENGINE
// ==========================================
function applyTheme(theme) {
  state.currentTheme = theme;
  const body = document.body;
  const lightBtn = document.getElementById('settings-theme-light-btn');
  const darkBtn = document.getElementById('settings-theme-dark-btn');

  if (theme === 'dark') {
    body.classList.add('theme-dark');
    if (darkBtn) darkBtn.classList.add('active');
    if (lightBtn) lightBtn.classList.remove('active');
  } else {
    body.classList.remove('theme-dark');
    if (lightBtn) lightBtn.classList.add('active');
    if (darkBtn) darkBtn.classList.remove('active');
  }
  saveState();
}

function applyLanguage(lang) {
  state.currentLang = lang;
  saveState();

  // Highlight button state
  const enBtn = document.getElementById('settings-lang-en-btn');
  const taBtn = document.getElementById('settings-lang-ta-btn');
  if (lang === 'ta') {
    taBtn.classList.add('btn-primary');
    taBtn.classList.remove('btn-outline-secondary');
    enBtn.classList.add('btn-outline-secondary');
    enBtn.classList.remove('btn-primary');
  } else {
    enBtn.classList.add('btn-primary');
    enBtn.classList.remove('btn-outline-secondary');
    taBtn.classList.add('btn-outline-secondary');
    taBtn.classList.remove('btn-primary');
  }

  // Translate static sidebar string blocks
  const s = STRINGS[lang];
  document.getElementById('nav-btn-workspace').querySelector('span').innerText = s.desk;
  document.getElementById('nav-btn-skills').querySelector('span').innerText = s.skills;
  document.getElementById('nav-btn-comm').querySelector('span').innerText = s.community;
  document.getElementById('nav-btn-market').querySelector('span').innerText = s.marketplace;
  document.getElementById('nav-btn-history').querySelector('span').innerText = s.history;
  document.getElementById('nav-btn-downloads').querySelector('span').innerText = s.downloads;
  document.getElementById('nav-btn-settings').querySelector('span').innerText = s.settings;
}

// ==========================================
// 6. RENDERERS GRID COMPONENTS
// ==========================================

// Models
function renderModelSelectors() {
  const container = document.getElementById('model-selector-container');
  if (!container) return;

  container.innerHTML = MODELS.map(model => `
    <div class="col-md-4">
      <div class="custom-card p-3.5 cursor-pointer h-100 d-flex flex-column justify-content-between border rounded-3 hover-scale model-selector-card ${state.selectedModel === model.id ? 'border-primary bg-primary bg-opacity-5' : ''}" data-id="${model.id}">
        <div>
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fs-8 fw-bold text-dark">${model.name}</span>
            <div class="rounded-circle d-flex align-items-center justify-content-center border" style="width: 16px; height: 16px;">
              <div class="rounded-circle bg-primary ${state.selectedModel === model.id ? '' : 'd-none'}" style="width: 8px; height: 8px;"></div>
            </div>
          </div>
          <p class="fs-9 text-secondary mb-0 leading-relaxed">${model.desc}</p>
        </div>
      </div>
    </div>
  `).join('');

  // Attach click listener
  container.querySelectorAll('.model-selector-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedModel = card.getAttribute('data-id');
      renderModelSelectors();
    });
  });
}

// Prompt suggestions starter templates
function renderSuggestions() {
  const container = document.getElementById('suggestions-starter-container');
  if (!container) return;

  container.innerHTML = SUGGESTIONS.map(sug => `
    <div class="col-md-3 col-sm-6">
      <div class="custom-card p-3 cursor-pointer h-100 d-flex flex-column justify-content-between border rounded-3 hover-scale suggestion-starter-card" data-title="${sug.title}">
        <div>
          <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-3 mb-2.5" style="width: 32px; height: 32px;">
            <i data-lucide="${sug.icon}" style="width: 15px; height: 15px;"></i>
          </div>
          <p class="fs-8 fw-bold text-dark mb-1">${sug.title}</p>
          <p class="fs-9 text-secondary mb-0 leading-relaxed">${sug.description}</p>
        </div>
      </div>
    </div>
  `).join('');

  // Attach suggestion prompt click listener
  container.querySelectorAll('.suggestion-starter-card').forEach(card => {
    card.addEventListener('click', () => {
      simulateGuestLogin();
      const title = card.getAttribute('data-title');
      const textarea = document.getElementById('prompt-text-input');
      textarea.value = `Build a premium ${title.toLowerCase()} application. Include core responsive layout, persistent LocalStorage controllers, detailed database schema, and custom mock API endpoints.`;
      textarea.focus();
      showToast(`Starter prompt loaded: ${title}`);
    });
  });
  lucide.createIcons();
}

// Skills Grid
function renderSkills() {
  const container = document.getElementById('skills-grid-container');
  if (!container) return;

  container.innerHTML = state.skills.map((skill, index) => {
    // Generate beautiful colorful gradients for the icon wrapper
    const colors = [
      { bg: 'rgba(79, 70, 229, 0.08)', text: '#4f46e5' },   // Indigo
      { bg: 'rgba(16, 185, 129, 0.08)', text: '#10b981' },  // Emerald
      { bg: 'rgba(59, 130, 246, 0.08)', text: '#3b82f6' },   // Blue
      { bg: 'rgba(245, 158, 11, 0.08)', text: '#f59e0b' },   // Amber
      { bg: 'rgba(236, 72, 153, 0.08)', text: '#ec4899' },   // Pink
      { bg: 'rgba(6, 182, 212, 0.08)', text: '#06b6d4' },    // Cyan
    ];
    const color = colors[index % colors.length];

    return `
      <div class="col-xl-3 col-lg-4 col-md-6">
        <div class="custom-card h-100 d-flex flex-column justify-content-between hover-scale">
          <div>
            <div class="d-flex align-items-start justify-content-between mb-3">
              <div class="d-flex align-items-center justify-content-center rounded-3" style="width: 42px; height: 42px; background-color: ${color.bg}; color: ${color.text};">
                <i data-lucide="${skill.icon || 'star'}" style="width: 18px; height: 18px;"></i>
              </div>
              <span class="badge ${skill.category === 'built-in' ? 'bg-secondary' : 'bg-primary'} fs-9 rounded-pill text-uppercase px-2.5 py-1" style="font-size: 8.5px;">${skill.category}</span>
            </div>

            <h5 class="fw-bold text-dark fs-8 mb-1.5">${skill.title}</h5>
            <p class="fs-9 text-secondary mb-3 leading-relaxed" style="min-height: 48px; font-size: 11.5px;">${skill.description}</p>

            <div class="mb-3">
              <label class="fs-9 text-uppercase tracking-wider text-muted fw-bold d-block mb-1.5" style="font-size: 9px;">Key Features</label>
              <div class="d-flex flex-wrap gap-1">
                ${skill.features.slice(0, 3).map(f => `<span class="badge border border-light text-secondary bg-light fs-9 px-2 py-1" style="font-size: 9px;">${f}</span>`).join('')}
              </div>
            </div>
          </div>

          <div class="border-top pt-3 mt-2">
            <label class="fs-9 text-uppercase tracking-wider text-muted fw-bold d-block mb-1.5" style="font-size: 9px;">Generated Files</label>
            <div class="d-flex flex-wrap gap-1">
              ${skill.outputs.map(o => `<span class="badge bg-light text-secondary font-monospace fs-9 px-2 py-1" style="font-size: 9px; letter-spacing: -0.02em;">${o}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// Auth and Guest State Helpers
window.isUserLoggedIn = function() {
  return !!state.currentUser && state.currentUser.name !== "Developer Guest";
};

window.showGuestLoginRequiredModal = function(customMessage, customTitle) {
  const modal = document.getElementById('modal-guest-login-container');
  if (!modal) return;
  const titleEl = document.getElementById('guest-modal-title');
  const msgEl = document.getElementById('guest-modal-message');
  if (titleEl) {
    titleEl.innerText = customTitle || "🔒 Login Required";
  }
  if (msgEl) {
    msgEl.innerHTML = customMessage || "Please sign in to access premium specs.";
  }
  modal.classList.remove('d-none');
  lucide.createIcons();
};

function getCtaCardHtml() {
  return `
    <div class="col-xl-3 col-lg-4 col-md-6">
      <div class="custom-card h-100 d-flex flex-column justify-content-between text-white p-4 overflow-hidden relative border-0 shadow" style="border-radius: 20px; background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%); min-height: 380px; border: 1px solid rgba(99, 102, 241, 0.25);">
        <!-- Ambient glow inside card -->
        <div class="position-absolute rounded-circle" style="background: rgba(99, 102, 241, 0.15); width: 120px; height: 120px; filter: blur(40px); top: -20px; right: -20px; pointer-events: none;"></div>
        
        <div class="relative z-2">
          <div class="d-inline-flex align-items-center justify-content-center bg-white bg-opacity-10 text-white rounded-3 mb-3" style="width: 36px; height: 36px;">
            <i data-lucide="sparkles" class="text-warning animate-pulse" style="width: 18px; height: 18px;"></i>
          </div>
          <h4 class="fw-bold fs-6 mb-2 text-white" style="font-size: 14.5px;">Unlock Unlimited Specs</h4>
          <p class="fs-9 text-white text-opacity-80 leading-relaxed mb-4" style="font-size: 11.5px; line-height: 1.4;">Create an account to save, download, like, and share custom prompt specifications instantly.</p>
        </div>
        
        <div class="relative z-2">
          <button class="btn btn-primary btn-sm w-100 fw-bold py-2 rounded-2 shadow-sm mb-2" onclick="openLoginModal('signup')">Create Free Account</button>
          <button class="btn btn-link btn-sm w-100 text-white text-opacity-60 text-decoration-none fs-9" onclick="openLoginModal('login')">Already have an account? Sign in</button>
        </div>
      </div>
    </div>
  `;
}

// Community Prompts Arena Grid
function renderCommunity() {
  const container = document.getElementById('community-prompts-grid');
  if (!container) return;

  const isGuest = !window.isUserLoggedIn();
  
  // Toggle the guest warning banner at top of Community Page
  const guestBanner = document.getElementById('community-guest-banner');
  if (guestBanner) {
    if (isGuest && !state.guestBannerDismissed) {
      guestBanner.style.setProperty('display', 'flex', 'important');
    } else {
      guestBanner.style.setProperty('display', 'none', 'important');
    }
  }

  // Update Top Publish Button
  const publishOwnBtn = document.getElementById('comm-btn-publish-own');
  if (publishOwnBtn) {
    if (isGuest) {
      publishOwnBtn.innerHTML = `<i data-lucide="lock" style="width: 14px; height: 14px;"></i> <span>🔒 Sell Prompt</span>`;
      publishOwnBtn.title = "Login required";
    } else {
      publishOwnBtn.innerHTML = `<i data-lucide="share" style="width: 14px; height: 14px;"></i> <span>Publish to Community</span>`;
      publishOwnBtn.removeAttribute('title');
    }
  }

  const query = document.getElementById('comm-search-input').value.toLowerCase();
  
  // Filter prompts matching search query
  const filtered = state.communityPrompts.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.description.toLowerCase().includes(query) ||
    item.tags.some(t => t.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 py-5 text-center">
        <i data-lucide="search-slash" class="text-secondary opacity-25 mb-3" style="width: 48px; height: 48px;"></i>
        <p class="fs-7 text-secondary mb-0">No matching community prompts found.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const cardsHtml = [];

  filtered.forEach((item, index) => {
    // Generate beautiful dynamic parameters
    const rating = ((item.likes * 7) % 5) / 10 + 4.5; // Always beautiful rating between 4.5 and 4.9
    const reviewsCount = Math.round(item.likes / 3.5) + 3;
    const badges = ['Featured', 'Trending', 'Editor Choice', 'SaaS Elite', 'Top Spec'];
    const badge = badges[index % badges.length];
    
    // Choose beautiful gradient combinations based on index for the mock thumbnail browser background
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo Purple
      'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald Blue
      'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink Rose
      'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)', // Amber Red
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan Blue
    ];
    const grad = gradients[index % gradients.length];
    
    // Abstract icons based on category
    let mockIcon = 'sparkles';
    if (item.title.toLowerCase().includes('coffee')) mockIcon = 'coffee';
    else if (item.title.toLowerCase().includes('hospital') || item.title.toLowerCase().includes('medical')) mockIcon = 'activity';
    else if (item.title.toLowerCase().includes('portfolio') || item.title.toLowerCase().includes('cv')) mockIcon = 'user';
    else if (item.title.toLowerCase().includes('e-commerce') || item.title.toLowerCase().includes('shop') || item.title.toLowerCase().includes('store')) mockIcon = 'shopping-bag';
    else if (item.title.toLowerCase().includes('chatbot') || item.title.toLowerCase().includes('assistant')) mockIcon = 'message-square';

    // Premium prompt variables
    const isPremium = item.price > 0;
    const activeBadge = isPremium ? 'Premium' : badge;
    const badgeBgClass = isPremium ? 'bg-warning text-dark' : 'bg-white text-primary';

    let lockOverlayHtml = '';
    if (isGuest && isPremium) {
      lockOverlayHtml = `
        <div class="premium-lock-overlay">
          <i data-lucide="lock" style="width: 22px; height: 22px;"></i>
          <span class="premium-lock-title">🔒 Premium Prompt</span>
          <span class="premium-lock-subtitle">Login to Unlock</span>
        </div>
      `;
    }

    // Interactive button markup depending on guest status
    let chatHtml = '';
    let buyBtnHtml = '';
    let saveBtnHtml = '';
    let commentBtnHtml = '';

    if (isGuest) {
      chatHtml = `
        <button class="btn btn-link p-0 text-primary text-decoration-none fs-9 fw-bold d-flex align-items-center gap-0.5" onclick="chatWithCreator('${item.creator.name}'); event.stopPropagation();" title="Login required">
          <i data-lucide="lock" style="width: 10px; height: 10px;"></i><span>🔒 Chat</span>
        </button>
      `;
      buyBtnHtml = `
        <button class="btn btn-primary btn-sm fw-bold fs-9 px-2.5 py-1.5 rounded-2 d-flex align-items-center gap-1" style="font-size: 10.5px;" onclick="downloadCommunityPrompt('${item.id}', '${item.title}')" title="Login required">
          <i data-lucide="lock" style="width: 11px; height: 11px;"></i>
          <span>🔒 Buy ${item.price === 0 ? 'Spec' : `$${item.price}`}</span>
        </button>
      `;
      saveBtnHtml = `
        <button class="btn btn-link p-0 d-flex align-items-center gap-1 text-secondary text-decoration-none fs-9 fw-semibold" onclick="saveCommunityPrompt('${item.id}')" title="Login required">
          <i data-lucide="lock" style="width: 11px; height: 11px;"></i>
          <span>🔒 Save</span>
        </button>
      `;
      commentBtnHtml = `
        <button class="btn btn-link p-0 d-flex align-items-center gap-1 text-secondary text-decoration-none fs-9 fw-semibold" onclick="commentCommunityPrompt('${item.id}')" title="Login required">
          <i data-lucide="lock" style="width: 11px; height: 11px;"></i>
          <span>🔒 Comment</span>
        </button>
      `;
    } else {
      chatHtml = `
        <button class="btn btn-link p-0 text-primary text-decoration-none fs-9 fw-bold d-flex align-items-center gap-0.5" onclick="chatWithCreator('${item.creator.name}'); event.stopPropagation();">
          <i data-lucide="message-square" style="width: 11px; height: 11px;"></i><span>Chat</span>
        </button>
      `;
      buyBtnHtml = `
        <button class="btn btn-primary btn-sm fw-bold fs-9 px-2.5 py-1.5 rounded-2 d-flex align-items-center gap-1" style="font-size: 10.5px;" onclick="downloadCommunityPrompt('${item.id}', '${item.title}')">
          <i data-lucide="arrow-down-to-line" style="width: 11px; height: 11px;"></i>
          <span>${item.price === 0 ? 'Load Spec' : `Buy $${item.price}`}</span>
        </button>
      `;
      saveBtnHtml = `
        <button class="btn btn-link p-0 d-flex align-items-center gap-1 text-secondary text-decoration-none fs-9 fw-semibold" onclick="saveCommunityPrompt('${item.id}')" title="Save Favorite">
          <i data-lucide="bookmark" class="text-warning-hover" style="width: 11px; height: 11px;"></i>
          <span>Save</span>
        </button>
      `;
      commentBtnHtml = `
        <button class="btn btn-link p-0 d-flex align-items-center gap-1 text-secondary text-decoration-none fs-9 fw-semibold" onclick="commentCommunityPrompt('${item.id}')" title="View Comments">
          <i data-lucide="message-circle" class="text-primary-hover" style="width: 11px; height: 11px;"></i>
          <span>${reviewsCount}</span>
        </button>
      `;
    }

    const cardMarkup = `
      <div class="col-xl-3 col-lg-4 col-md-6">
        <div class="custom-card h-100 d-flex flex-column justify-content-between hover-scale p-0 overflow-hidden relative border-0 shadow-sm bg-white" style="border-radius: 20px;">
          
          <!-- Mock Website Browser Thumbnail Container -->
          <div class="browser-thumbnail relative overflow-hidden" style="background: ${grad}; height: 130px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            ${lockOverlayHtml}
            <!-- Browser Header -->
            <div class="d-flex align-items-center justify-content-between bg-white bg-opacity-20 rounded-pill px-2.5 py-1" style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);">
              <div class="d-flex gap-1 align-items-center">
                <span class="rounded-circle bg-danger" style="width: 5px; height: 5px; display: inline-block;"></span>
                <span class="rounded-circle bg-warning" style="width: 5px; height: 5px; display: inline-block;"></span>
                <span class="rounded-circle bg-success" style="width: 5px; height: 5px; display: inline-block;"></span>
              </div>
              <span class="text-white text-opacity-90 text-truncate font-monospace" style="max-width: 140px; font-size: 9px;">promptstudio.ai/spec</span>
              <div style="width: 15px;"></div>
            </div>
            
            <!-- Abstract Web Content Preview -->
            <div class="d-flex align-items-center justify-content-center text-white my-auto flex-column gap-1">
              <i data-lucide="${mockIcon}" class="text-white animate-pulse" style="width: 22px; height: 22px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));"></i>
              <span class="fw-bold text-uppercase tracking-wider text-truncate px-2" style="max-width: 200px; font-size: 9px; letter-spacing: 0.1em; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));">${item.category || 'BLUEPRINT'}</span>
            </div>
            
            <!-- Badge overlay -->
            <span class="position-absolute badge ${badgeBgClass} fw-bold rounded-pill shadow" style="top: 12px; left: 12px; font-size: 8.5px; padding: 4px 8px; border: 1px solid rgba(79, 70, 229, 0.1); z-index: 5;">
              ${activeBadge}
            </span>
          </div>

          <!-- Card Main Body -->
          <div class="p-3 flex-grow-1 d-flex flex-column justify-content-between">
            <div>
              <!-- Creator and Timestamp -->
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2 cursor-pointer" onclick="viewCreatorProfile('${item.creator.name}', '${item.creator.avatar}')">
                  <img src="${item.creator.avatar}" alt="Creator" class="rounded-circle border" style="width: 24px; height: 24px; object-fit: cover;">
                  <span class="fs-9 fw-semibold text-secondary text-truncate text-primary-hover" style="max-width: 90px;">${item.creator.name}</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                  ${chatHtml}
                  <span class="text-muted mx-0.5" style="font-size: 9px;">•</span>
                  <span class="fs-9 text-muted" style="font-size: 10px;">${item.timestamp}</span>
                </div>
              </div>

              <!-- Title & Description -->
              <h5 class="fw-bold text-dark fs-8 mb-1.5 text-decoration-none cursor-pointer text-truncate-2-lines line-clamp-2" style="min-height: 36px; line-height: 1.3;" onclick="openPromptPreview('${item.id}')">${item.title}</h5>
              <p class="fs-9 text-secondary mb-2 leading-relaxed line-clamp-3" style="min-height: 42px; font-size: 11.5px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${item.description}</p>

              <!-- Star Rating -->
              <div class="d-flex align-items-center gap-1.5 mb-2.5">
                <div class="d-flex gap-0.5 text-warning align-items-center">
                  <i data-lucide="star" style="width: 11px; height: 11px; fill: currentColor;"></i>
                </div>
                <span class="fs-9 fw-bold text-dark" style="font-size: 10.5px;">${rating.toFixed(1)}</span>
                <span class="fs-9 text-muted" style="font-size: 10px;">(${reviewsCount} reviews)</span>
              </div>

              <!-- Tags -->
              <div class="d-flex flex-wrap gap-1 mb-2.5">
                ${item.tags.slice(0, 2).map(t => `<span class="badge border bg-light text-secondary fs-9 rounded-pill px-2 py-0.5" style="font-size: 10px;">${t}</span>`).join('')}
              </div>
            </div>

            <!-- Stats and Load button -->
            <div class="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
              <div class="d-flex align-items-center gap-2.5">
                <!-- Like Trigger -->
                <button class="btn btn-link p-0 d-flex align-items-center gap-1 text-secondary text-decoration-none fs-9 fw-semibold" onclick="likeCommunityPrompt('${item.id}')">
                  <i data-lucide="heart" class="text-danger-hover" style="width: 12px; height: 12px;"></i>
                  <span>${item.likes}</span>
                </button>
                ${commentBtnHtml}
                ${saveBtnHtml}
              </div>

              ${buyBtnHtml}
            </div>
          </div>
          
        </div>
      </div>
    `;

    cardsHtml.push(cardMarkup);

    // Every 8 cards, inject CTA Card if guest
    if (isGuest && (index + 1) % 8 === 0) {
      cardsHtml.push(getCtaCardHtml());
    }
  });

  container.innerHTML = cardsHtml.join('');

  lucide.createIcons();
}

// Marketplace store cards
function formatCurrency(amount, currency = 'INR') {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `₹${amount.toFixed(0)}`;
}

const MARKETPLACE_CTA_PRICE_INR = 499;
const CHECKOUT_PRICING = {
  originalPrice: 2499,
  platformFee: 50,
  gst: 90
};

function getCheckoutTotals() {
  const total = CHECKOUT_PRICING.originalPrice + CHECKOUT_PRICING.platformFee + CHECKOUT_PRICING.gst;
  return {
    originalPrice: CHECKOUT_PRICING.originalPrice,
    platformFee: CHECKOUT_PRICING.platformFee,
    gst: CHECKOUT_PRICING.gst,
    total
  };
}

function SellPromptBanner() {
  const bannerRow = document.getElementById('marketplace-banner-row');
  if (!bannerRow) return;

  bannerRow.innerHTML = `
    <div class="col-12 col-xl-7">
      <div class="marketplace-sell-banner marketplace-sell-banner-compact d-flex align-items-center gap-3 p-2.5 rounded-4 position-relative overflow-hidden">
        <div class="d-flex align-items-center justify-content-center marketplace-sell-icon flex-shrink-0">
          <i data-lucide="rocket" style="width: 20px; height: 20px;"></i>
        </div>
        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-center gap-2 mb-1.5">
            <span class="badge bg-white bg-opacity-20 text-white fs-9 rounded-pill px-2.5 py-1">Creator Marketplace</span>
          </div>
          <h4 class="fw-bold text-white mb-1 fs-7">Sell Your Prompt</h4>
          <p class="fs-9 text-white text-opacity-90 mb-2">Share your AI prompts and earn from your expertise.</p>
          <div class="d-flex flex-wrap gap-1.5 mb-1 marketplace-banner-stats">
            <span class="fs-8 text-white opacity-90">Creators <strong>350+</strong></span>
            <span class="fs-8 text-white opacity-90">Prompts Sold <strong>5000+</strong></span>
            <span class="fs-8 text-white opacity-90">Revenue Share <strong>80%</strong></span>
          </div>
        </div>
        <div class="marketplace-banner-actions d-flex flex-column flex-sm-row gap-2 align-self-end align-self-sm-center">
          <button class="btn btn-white btn-sm fw-bold px-3 py-1.5 rounded-pill shadow-sm" onclick="openSellPromptModal()">Start Selling</button>
          <button class="btn btn-outline-white btn-sm fw-bold px-3 py-1.5 rounded-pill shadow-sm" onclick="switchView('creator-dashboard')">Creator Dashboard</button>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

function PaymentMethodSelector(selectedMethod = 'UPI') {
  const methods = [
    { name: 'UPI', icon: 'smartphone' },
    { name: 'Credit Card', icon: 'credit-card' },
    { name: 'Debit Card', icon: 'wallet-cards' },
    { name: 'Net Banking', icon: 'landmark' },
    { name: 'Wallet', icon: 'wallet' }
  ];

  return methods.map(method => `
    <label class="form-check d-flex align-items-center justify-content-between gap-3 p-2.5 rounded-3 border payment-method-card ${selectedMethod === method.name ? 'is-selected' : ''}">
      <div class="d-flex align-items-center gap-2">
        <i data-lucide="${method.icon}" style="width: 14px; height: 14px;"></i>
        <span class="fs-9 fw-semibold">${method.name}</span>
      </div>
      <input class="form-check-input" type="radio" name="checkout-payment-method" value="${method.name}" ${selectedMethod === method.name ? 'checked' : ''}>
    </label>
  `).join('');
}

function OrderSuccess(order) {
  const title = document.getElementById('checkout-success-title');
  const details = document.getElementById('checkout-success-details');
  if (!title || !details) return;

  title.innerText = 'Payment Successful ✓';
  details.innerHTML = `
    <p class="fs-8 text-secondary mb-2">Order ID: <strong>${order.id}</strong></p>
    <p class="fs-8 text-secondary mb-2">Purchased Prompt: <strong>${order.title}</strong></p>
    <p class="fs-8 text-secondary mb-2">Amount Paid: <strong>${formatCurrency(order.total, 'INR')}</strong></p>
    <p class="fs-8 text-secondary mb-0">Payment Method: <strong>${order.paymentMethod}</strong></p>
  `;

  const container = document.getElementById('checkout-success-container');
  if (container) container.classList.remove('d-none');
}

window.CheckoutModal = function(itemId) {
  return openCheckoutModal(itemId);
};

function openCheckoutModal(itemIdOrObj) {
  const modal = document.getElementById('modal-checkout-container');
  if (!modal) return;

  const titleEl = document.getElementById('checkout-product-title');
  const creatorEl = document.getElementById('checkout-product-creator');
  const ratingEl = document.getElementById('checkout-product-rating');
  const descEl = document.getElementById('checkout-product-description');
  const priceEl = document.getElementById('checkout-product-price');
  const amountEl = document.getElementById('checkout-order-amount');
  const platformFeeEl = document.getElementById('checkout-platform-fee');
  const gstEl = document.getElementById('checkout-gst');
  const finalAmountEl = document.getElementById('checkout-final-amount');
  const paymentMethodsContainer = document.getElementById('checkout-payment-methods');
  const iconContainer = document.getElementById('checkout-product-icon');

  if (!titleEl || !creatorEl || !ratingEl || !descEl || !priceEl || !amountEl || !platformFeeEl || !gstEl || !finalAmountEl || !paymentMethodsContainer || !iconContainer) return;

  const item = typeof itemIdOrObj === 'string'
    ? state.marketplaceItems.find(m => m.id === itemIdOrObj)
    : itemIdOrObj;
  if (!item) return;

  const totals = getCheckoutTotals();

  titleEl.innerText = item.title;
  creatorEl.innerText = `by ${item.creator.name}`;
  ratingEl.innerText = `${(item.rating || 4.8).toFixed(1)} ★`;
  descEl.innerText = item.description;
  priceEl.innerText = formatCurrency(totals.originalPrice, 'INR');
  amountEl.innerText = formatCurrency(totals.originalPrice, 'INR');
  platformFeeEl.innerText = formatCurrency(totals.platformFee, 'INR');
  gstEl.innerText = formatCurrency(totals.gst, 'INR');
  finalAmountEl.innerText = formatCurrency(totals.total, 'INR');

  iconContainer.innerHTML = item.creator?.avatar
    ? `<img src="${item.creator.avatar}" alt="Creator" class="rounded-3" style="width: 44px; height: 44px; object-fit: cover;">`
    : `<i data-lucide="rocket" style="width: 20px; height: 20px;"></i>`;

  lucide.createIcons();

  paymentMethodsContainer.innerHTML = PaymentMethodSelector('UPI');
  lucide.createIcons();

  paymentMethodsContainer.onchange = () => {
    const selectedMethod = paymentMethodsContainer.querySelector('input[name="checkout-payment-method"]:checked')?.value || 'UPI';
    paymentMethodsContainer.innerHTML = PaymentMethodSelector(selectedMethod);
    lucide.createIcons();
  };

  const successContainer = document.getElementById('checkout-success-container');
  if (successContainer) {
    successContainer.classList.add('d-none');
  }

  modal.dataset.checkoutItemId = item.id;
  modal.dataset.checkoutPurchased = '';
  modal.classList.remove('d-none');
  requestAnimationFrame(() => {
    modal.classList.add('is-visible');
  });
}

function renderMarketplace() {
  SellPromptBanner();
  const container = document.getElementById('marketplace-grid-container');
  if (!container) return;

  const isGuest = !window.isUserLoggedIn();

  container.innerHTML = state.marketplaceItems.map((item, index) => {
    const colors = [
      'rgba(79, 70, 229, 0.08)',   // Indigo
      'rgba(6, 182, 212, 0.08)',    // Cyan
      'rgba(236, 72, 153, 0.08)',   // Pink
      'rgba(16, 185, 129, 0.08)',  // Emerald
    ];
    const colorBg = colors[index % colors.length];

    // Blurrable long description HTML
    let descHtml = '';
    if (isGuest) {
      descHtml = `
        <div class="position-relative">
          <p class="fs-9 text-secondary border rounded-3 p-3 bg-light mb-3 font-monospace" style="font-size: 10.5px; line-height: 1.4; filter: blur(3px); opacity: 0.45; select-events: none; user-select: none;">
            ${item.longDescription.slice(0, 45)}... [Description locked for guests. Sign in to view full specs]
          </p>
          <div class="position-absolute top-50 start-50 translate-middle text-center w-100 px-2" style="z-index: 3;">
            <span class="badge bg-dark bg-opacity-95 text-white fs-9 px-2 py-1.5 rounded border border-secondary border-opacity-20 shadow-sm">
              <i data-lucide="lock" class="me-1" style="width: 11px; height: 11px; display: inline-block; vertical-align: middle;"></i>
              <span class="align-middle">🔒 Spec Locked</span>
            </span>
          </div>
        </div>
      `;
    } else {
      descHtml = `
        <p class="fs-9 text-secondary border rounded-3 p-3 bg-light mb-3 font-monospace" style="font-size: 10.5px; line-height: 1.4;">${item.longDescription}</p>
      `;
    }

    // Interactive button markup depending on guest status
    let marketBuyBtn = '';
    let marketWishlistBtn = '';
    let marketPreviewBtn = '';
    let contactHtml = '';

    if (isGuest) {
      contactHtml = `
        <a href="#" onclick="contactMarketplaceSeller('${item.id}'); return false;" class="fs-9 text-decoration-none text-muted hover-text-primary d-flex align-items-center gap-0.5" title="Login required">
          <i data-lucide="lock" style="width: 10px; height: 10px;"></i> <span>🔒 Contact</span>
        </a>
      `;
      marketWishlistBtn = `
        <button class="btn btn-outline-secondary btn-sm p-1.5 rounded-2" onclick="showMarketplaceWishlist('${item.id}')" title="Login required">
          <i data-lucide="lock" style="width: 13px; height: 13px;"></i>
        </button>
      `;
      marketPreviewBtn = `
        <button class="btn btn-outline-secondary btn-sm p-1.5 rounded-2" onclick="showMarketplacePreview('${item.id}')" title="Login required">
          <i data-lucide="eye" style="width: 13px; height: 13px;"></i>
        </button>
      `;
      marketBuyBtn = `
        <button class="btn btn-primary btn-sm fw-bold fs-9 px-3 py-1.5 rounded-2" onclick="CheckoutModal('${item.id}')" title="Login required">
          Buy Now ₹${MARKETPLACE_CTA_PRICE_INR}
        </button>
      `;
    } else {
      contactHtml = `
        <a href="#" onclick="contactMarketplaceSeller('${item.id}'); return false;" class="fs-9 text-decoration-none text-muted hover-text-primary d-flex align-items-center gap-0.5">
          <i data-lucide="mail" style="width: 11px; height: 11px;"></i> <span>Contact Seller</span>
        </a>
      `;
      marketWishlistBtn = `
        <button class="btn btn-outline-secondary btn-sm p-1.5 rounded-2" onclick="showMarketplaceWishlist('${item.id}')" title="Add to Wishlist">
          <i data-lucide="heart" style="width: 13px; height: 13px;"></i>
        </button>
      `;
      marketPreviewBtn = `
        <button class="btn btn-outline-secondary btn-sm p-1.5 rounded-2" onclick="showMarketplacePreview('${item.id}')" title="View Full Preview">
          <i data-lucide="eye" style="width: 13px; height: 13px;"></i>
        </button>
      `;
      marketBuyBtn = `
        <button class="btn btn-primary btn-sm fw-bold fs-9 px-3 py-1.5 rounded-2" onclick="CheckoutModal('${item.id}')">
          Buy Now ₹${MARKETPLACE_CTA_PRICE_INR}
        </button>
      `;
    }

    return `
      <div class="col-xl-3 col-lg-4 col-md-6">
        <div class="custom-card h-100 d-flex flex-column justify-content-between hover-scale">
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <span class="badge fs-9 rounded-pill text-uppercase px-2.5 py-1 text-primary" style="background-color: ${colorBg}; font-size: 8.5px;">${item.category} Pack</span>
              <div class="d-flex align-items-center gap-1 text-warning">
                <i data-lucide="star" style="width: 12px; height: 12px; fill: currentColor;"></i>
                <span class="fs-9 fw-bold text-dark" style="font-size: 10px;">${item.rating}</span>
              </div>
            </div>

            <!-- Creator info -->
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center gap-2 cursor-pointer" onclick="viewCreatorProfile('${item.creator.name}', '${item.creator.avatar}')">
                  <img src="${item.creator.avatar}" alt="Creator" class="rounded-circle border" style="width: 24px; height: 24px; object-fit: cover;">
                  <div>
                    <span class="fs-9 fw-semibold text-secondary text-truncate text-primary-hover" style="max-width: 120px; display: inline-block;">${item.creator.name}</span>
                    <div class="fs-9 text-secondary">Created by ${item.creator.name}</div>
                  </div>
                </div>
                <div class="mt-2 d-flex align-items-center gap-2">
                  <span class="badge bg-light text-secondary fs-8 rounded-pill px-2 py-1">${item.rating} ★</span>
                  ${item.verified ? '<span class="badge bg-primary bg-opacity-15 text-white fs-9 rounded-pill px-2 py-1">Verified Creator</span>' : ''}
                </div>
              </div>
              ${contactHtml}
            </div>

            <h5 class="fw-bold text-dark fs-8 mb-2 cursor-pointer text-primary-hover" onclick="openPromptPreview('${item.id}')">${item.title}</h5>
            <p class="fs-9 text-secondary mb-3 leading-relaxed" style="min-height: 48px; font-size: 11.5px;">${item.description}</p>
            ${descHtml}

            <div class="d-flex flex-wrap gap-1 mb-2">
              ${item.tags.map(t => `<span class="badge border bg-white text-secondary fs-9 rounded-2 px-2.5 py-1" style="font-size: 9.5px;">${t}</span>`).join('')}
            </div>
          </div>

          <div class="d-flex align-items-center justify-content-between border-top pt-3 mt-2">
            <span class="fs-8 fw-extrabold text-dark" style="font-size: 13.5px;">${item.price === 0 ? 'FREE' : formatCurrency(item.price)}</span>
            <div class="d-flex align-items-center gap-1.5">
              ${marketWishlistBtn}
              ${marketPreviewBtn}
              ${marketBuyBtn}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderCreatorDashboard() {
  const listingsCount = document.getElementById('creator-listings-count');
  const totalSales = document.getElementById('creator-total-sales');
  const totalRevenue = document.getElementById('creator-total-revenue');
  const totalDownloads = document.getElementById('creator-total-downloads');
  const avgRating = document.getElementById('creator-average-rating');
  const listingsContainer = document.getElementById('creator-prompt-list');
  const salesContainer = document.getElementById('creator-sales-history');
  const withdrawAmount = document.getElementById('creator-withdraw-amount');

  const prompts = state.creatorPrompts || [];
  const sales = state.creatorSales || [];

  const totalSalesCount = sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0);
  const totalRevenueValue = sales.reduce((sum, sale) => sum + (sale.creatorRevenue || 0), 0);
  const totalDownloadsValue = prompts.reduce((sum, item) => sum + (item.downloads || 0), 0);
  const averageRatingValue = prompts.length ? (prompts.reduce((sum, item) => sum + (item.rating || 4.8), 0) / prompts.length).toFixed(1) : '4.9';

  if (listingsCount) listingsCount.innerText = `${prompts.length} Listings`;
  if (totalSales) totalSales.innerText = `${totalSalesCount}`;
  if (totalRevenue) totalRevenue.innerText = `₹${totalRevenueValue}`;
  if (totalDownloads) totalDownloads.innerText = `${totalDownloadsValue}`;
  if (avgRating) avgRating.innerText = `${averageRatingValue}`;
  if (withdrawAmount) withdrawAmount.innerText = `${totalRevenueValue}`;

  if (listingsContainer) {
    listingsContainer.innerHTML = prompts.length === 0 ? `
      <div class="py-5 text-center bg-white border rounded-4">
        <p class="fs-8 text-secondary mb-0">No creator listings yet. Start selling your first prompt.</p>
      </div>
    ` : prompts.map(item => `
      <div class="custom-card p-3.5 mb-3 rounded-4 shadow-sm d-flex align-items-center justify-content-between gap-3">
        <div>
          <h6 class="fw-bold text-dark fs-7 mb-1">${item.title}</h6>
          <p class="fs-9 text-secondary mb-1">${item.description}</p>
          <div class="d-flex flex-wrap gap-2 align-items-center fs-8 text-secondary">
            <span>${item.category}</span>
            <span>₹${item.price}</span>
            <span>${item.rating || 4.8} ★</span>
            <span>${item.downloads || 0} downloads</span>
          </div>
        </div>
        <div class="d-flex flex-column gap-2 align-items-end">
          <button class="btn btn-outline-secondary btn-sm rounded-3" onclick="editCreatorPrompt('${item.id}')">Edit Listing</button>
          <button class="btn btn-light btn-sm rounded-3" onclick="deleteCreatorPrompt('${item.id}')">Remove</button>
        </div>
      </div>
    `).join('');
  }

  if (salesContainer) {
    salesContainer.innerHTML = sales.length === 0 ? `
      <div class="py-4 text-center bg-white border rounded-4">
        <p class="fs-8 text-secondary mb-0">No sales history yet. Your first prompt sold will appear here.</p>
      </div>
    ` : sales.map(sale => `
      <div class="d-flex align-items-center justify-content-between py-3 border-bottom">
        <div>
          <h6 class="fw-semibold fs-8 mb-1">${sale.title}</h6>
          <p class="fs-9 text-secondary mb-0">${sale.timestamp} · ${sale.paymentMethod}</p>
        </div>
        <div class="text-end">
          <div class="fw-bold">₹${sale.creatorRevenue}</div>
          <div class="fs-8 text-secondary">${sale.status}</div>
        </div>
      </div>
    `).join('');
  }
}

window.openSellPromptModal = function(promptId = '') {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to submit a creator prompt listing and access the creator dashboard.", "🔒 Creator Access Required");
    return;
  }

  const modal = document.getElementById('modal-sell-prompt-container');
  const form = document.getElementById('sell-prompt-form');
  const promptIdField = document.getElementById('sell-prompt-id');
  const titleInput = document.getElementById('sell-title-input');
  const categoryInput = document.getElementById('sell-category-input');
  const descInput = document.getElementById('sell-description-input');
  const reqInput = document.getElementById('sell-requirements-input');
  const previewInput = document.getElementById('sell-preview-input');
  const contentInput = document.getElementById('sell-content-input');
  const priceInput = document.getElementById('sell-price-input');
  const creatorNameInput = document.getElementById('sell-creator-name-input');
  const creatorAvatarInput = document.getElementById('sell-creator-avatar-input');
  const creatorBioInput = document.getElementById('sell-creator-bio-input');
  const creatorSocialInput = document.getElementById('sell-creator-social-input');

  if (!modal || !form || !promptIdField || !titleInput || !categoryInput || !descInput || !reqInput || !previewInput || !contentInput || !priceInput || !creatorNameInput || !creatorAvatarInput || !creatorBioInput || !creatorSocialInput) return;

  promptIdField.value = promptId;
  if (promptId) {
    const existing = state.creatorPrompts.find(p => p.id === promptId);
    if (existing) {
      titleInput.value = existing.title;
      categoryInput.value = existing.category;
      descInput.value = existing.description;
      reqInput.value = existing.skillRequirements || '';
      previewInput.value = existing.preview || '';
      contentInput.value = existing.fullPrompt || '';
      priceInput.value = existing.price;
      creatorNameInput.value = existing.creator.name;
      creatorAvatarInput.value = existing.creator.avatar;
      creatorBioInput.value = existing.creator.bio || '';
      creatorSocialInput.value = existing.creator.social || '';
    }
  } else {
    form.reset();
    titleInput.value = '';
    categoryInput.value = 'AI';
    priceInput.value = '';
    creatorNameInput.value = state.currentUser ? state.currentUser.name : '';
    creatorAvatarInput.value = state.currentUser ? state.currentUser.avatar : '';
  }

  modal.classList.remove('d-none');
};

window.closeSellPromptModal = function() {
  document.getElementById('modal-sell-prompt-container').classList.add('d-none');
};

window.withdrawCreatorEarnings = function() {
  const earnings = state.creatorSales.reduce((sum, sale) => sum + (sale.creatorRevenue || 0), 0);
  if (!earnings) {
    showToast('No withdrawable earnings available yet.');
    return;
  }
  showToast(`Withdraw request submitted for ₹${earnings}. Payout will be processed soon.`);
};

window.editCreatorPrompt = function(promptId) {
  openSellPromptModal(promptId);
};

window.deleteCreatorPrompt = function(promptId) {
  state.creatorPrompts = state.creatorPrompts.filter(item => item.id !== promptId);
  saveState();
  renderCreatorDashboard();
  renderMarketplace();
  showToast('Creator listing removed.');
};

window.submitSellPromptForm = function(e) {
  e.preventDefault();
  const promptIdField = document.getElementById('sell-prompt-id');
  const titleInput = document.getElementById('sell-title-input');
  const categoryInput = document.getElementById('sell-category-input');
  const descInput = document.getElementById('sell-description-input');
  const reqInput = document.getElementById('sell-requirements-input');
  const previewInput = document.getElementById('sell-preview-input');
  const contentInput = document.getElementById('sell-content-input');
  const priceInput = document.getElementById('sell-price-input');
  const creatorNameInput = document.getElementById('sell-creator-name-input');
  const creatorAvatarInput = document.getElementById('sell-creator-avatar-input');
  const creatorBioInput = document.getElementById('sell-creator-bio-input');
  const creatorSocialInput = document.getElementById('sell-creator-social-input');

  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const description = descInput.value.trim();
  const requirements = reqInput.value.trim();
  const preview = previewInput.value.trim();
  const fullPrompt = contentInput.value.trim();
  const price = parseInt(priceInput.value, 10) || 0;
  const creatorName = creatorNameInput.value.trim();
  const creatorAvatar = creatorAvatarInput.value.trim();
  const creatorBio = creatorBioInput.value.trim();
  const creatorSocial = creatorSocialInput.value.trim();
  const promptId = promptIdField.value;

  if (!title || !description || !preview || !fullPrompt || !price || !creatorName || !creatorAvatar) {
    showToast('Please complete all required fields before submitting.');
    return;
  }

  const newItem = {
    id: promptId || `creator-${Date.now()}`,
    title,
    description,
    longDescription: fullPrompt,
    creator: {
      name: creatorName,
      avatar: creatorAvatar,
      bio: creatorBio,
      social: creatorSocial
    },
    category,
    tags: [category, 'Creator', 'Prompt'],
    rating: 4.8,
    verified: true,
    price,
    downloads: 0,
    reviewsCount: 0,
    skillRequirements: requirements,
    preview,
    fullPrompt,
    status: 'Pending Approval'
  };

  const existingIndex = state.creatorPrompts.findIndex(item => item.id === promptId);
  if (existingIndex >= 0) {
    state.creatorPrompts[existingIndex] = newItem;
  } else {
    state.creatorPrompts.unshift(newItem);
  }

  const marketplaceItemIndex = state.marketplaceItems.findIndex(item => item.id === newItem.id);
  if (marketplaceItemIndex >= 0) {
    state.marketplaceItems[marketplaceItemIndex] = newItem;
  } else {
    state.marketplaceItems.unshift(newItem);
  }

  saveState();
  closeSellPromptModal();
  renderMarketplace();
  renderCreatorDashboard();
  showToast('Your prompt has been submitted successfully. Status: Pending Approval');
};

// Saved History
function renderHistory() {
  const container = document.getElementById('history-items-list');
  if (!container) return;

  const query = document.getElementById('history-search-input').value.toLowerCase();
  
  // Filter matching
  const filtered = state.history.filter(item => 
    item.title.toLowerCase().includes(query) || 
    item.promptText.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-5 text-center bg-white border rounded-4">
        <i data-lucide="history" class="text-secondary opacity-25 mb-3" style="width: 44px; height: 44px;"></i>
        <p class="fs-7 text-secondary mb-0">No compiled prompt specifications history found.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="custom-card p-3.5 hover-scale">
      <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
        <div class="d-flex gap-3 align-items-center flex-grow-1 overflow-hidden">
          <div class="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-3" style="width: 40px; height: 40px; flex-shrink: 0;">
            <i data-lucide="file-code" style="width: 18px; height: 18px;"></i>
          </div>
          <div class="overflow-hidden">
            <h6 class="fw-bold text-dark fs-7 mb-1 text-truncate">${item.title}</h6>
            <p class="fs-9 text-muted mb-0 font-monospace text-truncate" style="max-width: 500px;">Prompt: ${item.promptText}</p>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="fs-9 text-muted">${item.timestamp}</span>
          <button class="btn btn-light border btn-sm fs-9 fw-semibold px-2.5 py-1" onclick="viewHistoryItem('${item.id}')">Mount Spec</button>
          <button class="btn btn-light border btn-sm fs-9 text-danger px-2 py-1" onclick="deleteHistoryItem('${item.id}')">
            <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Downloads Cabinet list
function renderCabinet() {
  const container = document.getElementById('downloads-grid-container');
  if (!container) return;

  const query = document.getElementById('downloads-search-input').value.toLowerCase();
  
  // Filter cabinet items
  const filtered = state.cabinet.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.projectTitle.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 py-5 text-center bg-white border rounded-4">
        <i data-lucide="download" class="text-secondary opacity-25 mb-3" style="width: 44px; height: 44px;"></i>
        <p class="fs-7 text-secondary mb-0">No downloaded specs or bundles inside your cabinet.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="col-md-6">
      <div class="custom-card p-3.5 hover-scale h-100 d-flex flex-column justify-content-between">
        <div>
          <div class="d-flex align-items-start justify-content-between mb-3">
            <div class="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-3" style="width: 38px; height: 38px;">
              <i data-lucide="${item.isBundle ? 'folder-archive' : 'file-code'}" style="width: 18px; height: 18px;"></i>
            </div>
            <span class="fs-9 text-muted">${item.timestamp}</span>
          </div>

          <h6 class="fw-bold text-dark fs-7 mb-1 text-truncate">${item.title}</h6>
          <p class="fs-8 text-secondary mb-3 text-truncate">Source: ${item.projectTitle}</p>
        </div>

        <div class="d-flex align-items-center justify-content-between border-top pt-3 mt-2">
          <span class="fs-9 text-secondary font-monospace">${item.fileCount} file(s) available</span>
          <div class="d-flex gap-1.5">
            <!-- View file overlay -->
            <button class="btn btn-light border btn-sm fs-9 fw-semibold px-2.5 py-1" onclick="viewCabinetItem('${item.id}')">View Code</button>
            <button class="btn btn-outline-danger btn-sm fs-9 px-2 py-1" onclick="deleteCabinetItem('${item.id}')">
              <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// ==========================================
// 6.5 CLAUDE-INSPIRED CORE CHAT HANDLERS
// ==========================================

function formatMessage(text) {
  if (!text) return '';
  // Convert standard markdown markers to semantic tags
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-light px-1.5 py-0.5 rounded text-danger">$1</code>')
    .replace(/\n/g, '<br>');
  return html;
}

function QuickAccessCard(icon, title, desc, buttonId) {
  return `
    <button type="button" class="quick-access-card hover-scale" id="${buttonId}">
      <div class="quick-access-card-icon">
        <i data-lucide="${icon}" style="width: 18px; height: 18px;"></i>
      </div>
      <div class="quick-access-card-content text-start">
        <div class="fw-bold fs-7 text-white mb-1">${title}</div>
        <p class="fs-8 text-white text-opacity-85 mb-0">${desc}</p>
      </div>
      <div class="quick-access-card-button text-white fw-bold fs-8">Explore</div>
    </button>
  `;
}

function QuickAccessBar() {
  return `
    <div class="quick-access-bar">
      ${QuickAccessCard('users', 'Community Arena', 'Connect with AI developers, share prompts and discover ideas.', 'quick-access-community')}
      ${QuickAccessCard('shopping-bag', 'Marketplace Store', 'Buy and sell premium AI prompts and Skill.md templates.', 'quick-access-marketplace')}
    </div>
  `;
}

function initWorkspaceChat() {
  const messagesArea = document.getElementById('workspace-chat-messages');
  if (!messagesArea) return;

  if (state.chatMessages.length === 0) {
    state.chatMessages.push({
      sender: 'ai',
      text: 'Hi! I am your **Prompt Engineering Orchestrator**. Describe any application or feature, and I\'ll generate extensive development specs, product requirement documents, SQL schemas, and deployment workflows for you instantly.\n\nType `@` in the input below to quick-attach specialized compiler skills!',
      timestamp: 'System',
      isWelcome: true
    });
    saveState();
  }

  renderChatMessages();
}

function renderChatMessages() {
  const messagesArea = document.getElementById('workspace-chat-messages');
  if (!messagesArea) return;

  let html = state.chatMessages.map(msg => {
    const isUser = msg.sender === 'user';
    const name = isUser ? 'You' : 'Orchestrator AI';
    const avatar = isUser 
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces';
    
    return `
      <div class="chat-bubble ${isUser ? 'chat-bubble-user' : ''}">
        <img src="${avatar}" class="chat-avatar" alt="${name}">
        <div class="chat-bubble-content">
          <div class="chat-bubble-header">
            <span class="chat-sender-name">${name}</span>
            <span class="chat-timestamp">${msg.timestamp}</span>
          </div>
          <div class="chat-bubble-body">
            ${formatMessage(msg.text)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // If only welcome message exists, append a quick-starter template list inside the chat!
  if (state.chatMessages.length === 1) {
    html += `
      <div class="mt-4 ms-0 ms-md-5 ps-0 ps-md-3 animate-fade-in-up">
        ${QuickAccessBar()}

        <!-- Welcome Banner Card -->
        <div class="custom-card border-0 text-white mb-4 shadow-sm relative overflow-hidden" style="background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);">
          <div class="floating-shape shape-1 opacity-10" style="width: 150px; height: 150px; filter: blur(40px); top:-20px; right:-20px;"></div>
          <div class="p-4 relative z-2">
            <h4 class="fw-bold mb-1 text-white">Welcome back to your Prompt Engineering Cabinet! 👋</h4>
            <p class="fs-8 text-white text-opacity-90 mb-0">Create, test, and optimize production-grade system prompts and deployment specifications instantly.</p>
          </div>
        </div>
        
        <!-- Dynamic Stats Grid -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="custom-card p-3 d-flex align-items-center gap-3">
              <div class="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style="width: 42px; height: 42px; flex-shrink: 0;">
                <i data-lucide="file-code" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <span class="fs-9 text-muted d-block text-uppercase fw-bold">Compiled Specs</span>
                <span class="fs-7 fw-bold text-dark d-block" id="stats-compiled-specs">${state.history.length} Blueprints</span>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="custom-card p-3 d-flex align-items-center gap-3">
              <div class="rounded-3 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style="width: 42px; height: 42px; flex-shrink: 0;">
                <i data-lucide="cpu" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <span class="fs-9 text-muted d-block text-uppercase fw-bold">Active Skills</span>
                <span class="fs-7 fw-bold text-dark d-block" id="stats-active-skills">${state.skills.length} Specialties</span>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="custom-card p-3 d-flex align-items-center gap-3">
              <div class="rounded-3 bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style="width: 42px; height: 42px; flex-shrink: 0;">
                <i data-lucide="download-cloud" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <span class="fs-9 text-muted d-block text-uppercase fw-bold">Cabinet Items</span>
                <span class="fs-7 fw-bold text-dark d-block" id="stats-cabinet-items">${state.cabinet.length} Unlocked</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Suggested Prompts bento-grid -->
        <p class="fs-8 fw-bold text-uppercase tracking-wider text-secondary mb-3 d-flex align-items-center gap-1.5">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          <span>Popular Starter Blueprints:</span>
        </p>
        <div class="row g-3">
          <div class="col-md-6">
            <div class="custom-card p-3.5 cursor-pointer h-100 d-flex flex-column justify-content-between quick-start-prompt" data-prompt="Build a responsive Coffee Shop Ordering website with LocalStorage cart calculating totals.">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="fs-5">☕</span>
                  <h6 class="fw-bold mb-0 text-dark fs-7">Coffee Shop Ordering Platform</h6>
                </div>
                <p class="fs-9 text-secondary mb-0 leading-relaxed">Interactive web ordering app featuring instant totals, LocalStorage persistence, and beautiful animations.</p>
              </div>
              <div class="mt-3.5 d-flex align-items-center gap-1 text-primary fw-bold fs-9">
                <span>Deploy Spec</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-card p-3.5 cursor-pointer h-100 d-flex flex-column justify-content-between quick-start-prompt" data-prompt="Build a SaaS Pricing Landing Page with custom pricing tier selectors, FAQ accordion, and dark-theme style.">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="fs-5">🚀</span>
                  <h6 class="fw-bold mb-0 text-dark fs-7">SaaS Pricing Landing Page</h6>
                </div>
                <p class="fs-9 text-secondary mb-0 leading-relaxed">Modern web pricing card structures featuring custom tier sliders, responsive FAQ accordion panels, and Obsidian theme.</p>
              </div>
              <div class="mt-3.5 d-flex align-items-center gap-1 text-primary fw-bold fs-9">
                <span>Deploy Spec</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-card p-3.5 cursor-pointer h-100 d-flex flex-column justify-content-between quick-start-prompt" data-prompt="Build an interactive Developer Portfolio with bento-grid layouts, dark theme overrides, and a working Contact form.">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="fs-5">💼</span>
                  <h6 class="fw-bold mb-0 text-dark fs-7">Modern Developer Portfolio</h6>
                </div>
                <p class="fs-9 text-secondary mb-0 leading-relaxed">Highly responsive bento-grid portfolio layouts with smooth floating-glowing background visual highlights.</p>
              </div>
              <div class="mt-3.5 d-flex align-items-center gap-1 text-primary fw-bold fs-9">
                <span>Deploy Spec</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-card p-3.5 cursor-pointer h-100 d-flex flex-column justify-content-between quick-start-prompt" data-prompt="Build an AI Resume Analyzer with resume score metrics, keyword checklist, and a secure mock file-uploader feedback panel.">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="fs-5">📄</span>
                  <h6 class="fw-bold mb-0 text-dark fs-7">AI Resume Analyzer Console</h6>
                </div>
                <p class="fs-9 text-secondary mb-0 leading-relaxed">System dashboard with scoring algorithms, drag-and-drop resume upload mock containers, and action feedback checklist.</p>
              </div>
              <div class="mt-3.5 d-flex align-items-center gap-1 text-primary fw-bold fs-9">
                <span>Deploy Spec</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  messagesArea.innerHTML = html;
  messagesArea.scrollTop = messagesArea.scrollHeight;

  const communityQuickAccess = messagesArea.querySelector('#quick-access-community');
  const marketplaceQuickAccess = messagesArea.querySelector('#quick-access-marketplace');

  if (communityQuickAccess) {
    communityQuickAccess.addEventListener('click', () => {
      switchView('community');
      showToast('Opened Community Arena.');
    });
  }

  if (marketplaceQuickAccess) {
    marketplaceQuickAccess.addEventListener('click', () => {
      switchView('marketplace');
      showToast('Opened Marketplace Store.');
    });
  }

  // Attach quick-start listeners
  messagesArea.querySelectorAll('.quick-start-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      const textarea = document.getElementById('prompt-text-input');
      textarea.value = prompt;
      textarea.focus();
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      updateCharCount();
      showToast("Loaded application template into composer.");
    });
  });

  lucide.createIcons();
}

function renderSkillDropdownOptions() {
  const menu = document.getElementById('skill-dropdown-options');
  if (!menu) return;

  let html = '';
  
  // General Prompt Optimizer (Default option to clear skill)
  html += `
    <li>
      <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#" data-skill-clear="true">
        <div class="d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 text-secondary rounded-circle" style="width: 28px; height: 28px;">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
        </div>
        <div>
          <div class="fw-bold fs-8 text-dark">General Prompt Optimizer</div>
          <div class="fs-9 text-muted">Standard spec engine for generic code queries</div>
        </div>
      </a>
    </li>
    <li><hr class="dropdown-divider"></li>
    <h6 class="dropdown-header text-uppercase tracking-wider fs-9 py-1">Built-in Specializations</h6>
  `;

  // Built-in skills
  const builtIn = state.skills.filter(s => s.category === 'built-in');
  html += builtIn.map(s => `
    <li>
      <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#" data-skill-id="${s.id}">
        <div class="d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle" style="width: 28px; height: 28px;">
          <i data-lucide="${s.icon || 'book-open'}" style="width: 14px; height: 14px;"></i>
        </div>
        <div>
          <div class="fw-bold fs-8 text-dark">${s.title}</div>
          <div class="fs-9 text-muted">${s.description.slice(0, 52)}...</div>
        </div>
      </a>
    </li>
  `).join('');

  // Custom skills
  const custom = state.skills.filter(s => s.category === 'custom');
  html += `
    <li><hr class="dropdown-divider"></li>
    <h6 class="dropdown-header text-uppercase tracking-wider fs-9 py-1">Custom Blueprints</h6>
  `;
  if (custom.length === 0) {
    html += `<li class="px-3 py-1.5 text-muted fs-9">No custom skills created yet</li>`;
  } else {
    html += custom.map(s => `
      <li>
        <a class="dropdown-item d-flex align-items-center gap-2 py-2" href="#" data-skill-id="${s.id}">
          <div class="d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle" style="width: 28px; height: 28px;">
            <i data-lucide="star" style="width: 14px; height: 14px;"></i>
          </div>
          <div>
            <div class="fw-bold fs-8 text-dark">${s.title}</div>
            <div class="fs-9 text-muted">${s.description.slice(0, 52)}...</div>
          </div>
        </a>
      </li>
    `).join('');
  }

  // Action footer
  html += `
    <li><hr class="dropdown-divider"></li>
    <li>
      <a class="dropdown-item text-primary fw-bold fs-8 py-2 d-flex align-items-center gap-2" href="#" id="dropdown-btn-create-custom-skill">
        <i data-lucide="plus-circle" style="width:14px; height:14px;"></i>
        <span>Create Custom Skill</span>
      </a>
    </li>
  `;

  menu.innerHTML = html;

  // Attach click listeners to skill items
  menu.querySelectorAll('[data-skill-id]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const id = item.getAttribute('data-skill-id');
      state.selectedSkill = state.skills.find(s => s.id === id) || null;
      saveState();
      updatePillsAndBadges();
      showToast(`Attached Active Skill: ${state.selectedSkill.title}`);
    });
  });

  const clearBtn = menu.querySelector('[data-skill-clear]');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      state.selectedSkill = null;
      saveState();
      updatePillsAndBadges();
      showToast("Switched back to General Spec compiler.");
    });
  }

  const createBtn = document.getElementById('dropdown-btn-create-custom-skill');
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.getElementById('modal-skill-container').classList.remove('d-none');
    });
  }

  lucide.createIcons();
}

function updatePillsAndBadges() {
  // Model Pill Label
  const modelPillLabel = document.getElementById('selected-model-pill-label');
  if (modelPillLabel) {
    modelPillLabel.innerText = `Model: ${state.selectedModel}`;
  }

  // Active Indicators Row (above textarea)
  const activeModelText = document.getElementById('active-model-text');
  if (activeModelText) {
    activeModelText.innerText = state.selectedModel;
  }

  const skillBadge = document.getElementById('active-skill-badge');
  const skillText = document.getElementById('active-skill-text');
  const skillDropdownLabel = document.getElementById('selected-skill-pill-label');

  if (state.selectedSkill) {
    if (skillBadge) skillBadge.classList.remove('d-none');
    if (skillText) skillText.innerText = state.selectedSkill.title;
    if (skillDropdownLabel) skillDropdownLabel.innerText = state.selectedSkill.title;
  } else {
    if (skillBadge) skillBadge.classList.add('d-none');
    if (skillDropdownLabel) skillDropdownLabel.innerText = "📘 Skill";
  }
}

function updateCharCount() {
  const textarea = document.getElementById('prompt-text-input');
  const charDisplay = document.getElementById('char-count-display');
  if (textarea && charDisplay) {
    const len = textarea.value.length;
    charDisplay.innerText = len > 0 ? `${len} character${len === 1 ? '' : 's'}` : '';
  }
}

// ==========================================
// 7. INTERNAL UTILITY HANDLERS
// ==========================================

// Load prompt text from community directly into form
window.loadCommunityPromptText = function(title) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to view full specifications, edit files, and compile prompt packages in the workspace.", "🔒 Premium Preview Locked");
    return;
  }
  simulateGuestLogin();
  switchView('workspace');
  document.getElementById('prompt-text-input').value = `Build a high-performance ${title.toLowerCase()} application. Include core responsive layout, persistent LocalStorage controllers, detailed database schema, and custom mock API endpoints.`;
  document.getElementById('prompt-text-input').focus();
  showToast(`Loaded details for: ${title}`);
};

// Mount output blueprints inside code tabs panel
function mountOutputViewer(historyItem) {
  state.activeOutput = historyItem;
  state.activeTab = 'promptMd'; // Reset default active tab

  // Configure output details
  document.getElementById('output-project-title').innerText = historyItem.title;
  document.getElementById('output-badge-model').innerText = MODELS.find(m => m.id === historyItem.modelId)?.name || 'Gemini Core';

  // Toggle visible sections inside workspace subview
  document.getElementById('workspace-form-view').style.display = 'none';
  document.getElementById('workspace-output-view').style.display = 'block';

  // Activate default output tab button
  const outputTabsContainer = document.getElementById('output-tabs-container');
  outputTabsContainer.querySelectorAll('.output-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === 'promptMd') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderActiveOutputFile();
  showToast("Prompt specs compiled successfully!");
}

// View history item back inside compiler code tabs
window.viewHistoryItem = function(id) {
  const item = state.history.find(h => h.id === id);
  if (item) {
    switchView('workspace');
    mountOutputViewer(item);
  }
};

// Render the active code file inside code pre box
function renderActiveOutputFile() {
  if (!state.activeOutput) return;

  document.getElementById('output-active-filename').innerText = getTabFileName(state.activeTab);
  
  if (!window.isUserLoggedIn()) {
    document.getElementById('output-active-filecontent').innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center text-center p-4 my-3 animate-fade-in-up" style="min-height: 250px;">
        <div class="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mb-3 animate-pulse" style="width: 52px; height: 52px;">
          <i data-lucide="lock" style="width: 24px; height: 24px;"></i>
        </div>
        <h5 class="fw-bold text-dark fs-7 mb-1.5">🔒 Premium Specification Locked</h5>
        <p class="fs-9 text-secondary max-w-xs mb-4" style="max-width: 250px; font-size: 11.5px; line-height: 1.4;">Login to view complete prompt package and unlock high-fidelity files.</p>
        <button class="btn btn-primary btn-sm fw-bold px-4 py-2 rounded-2 shadow-sm" onclick="openLoginModal('login')">Login to Unlock</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const content = state.activeOutput.outputs[state.activeTab];
  document.getElementById('output-active-filecontent').innerText = content || '// No content compiled for this tab.';
}

// Like Community prompt
window.likeCommunityPrompt = function(id) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to save favorites, like prompts, and join the community.", "🔒 Interaction Locked");
    return;
  }
  const item = state.communityPrompts.find(c => c.id === id);
  if (item) {
    item.likes++;
    saveState();
    renderCommunity();
    showToast(`Liked: "${item.title}"`);
  }
};

// Comment Community prompt
window.commentCommunityPrompt = function(id) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to comment or participate in community discussions.", "🔒 Discussions Locked");
    return;
  }
  showToast("Opening community discussions thread...");
};

// Save Community prompt to history/cabinet
window.saveCommunityPrompt = function(id) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to save prompts to your cabinet.", "🔒 Favorites Locked");
    return;
  }
  const item = state.communityPrompts.find(c => c.id === id);
  if (item) {
    const outputs = generateOutputs(item.title).outputs;
    const files = Object.keys(outputs).map(key => ({
      name: getTabFileName(key),
      content: outputs[key]
    }));

    const cabinetItem = {
      id: `cab-comm-${Date.now()}`,
      title: `${item.title} Saved Spec`,
      projectTitle: item.title,
      fileCount: files.length,
      isBundle: true,
      files,
      timestamp: 'Saved today'
    };

    state.cabinet.unshift(cabinetItem);
    saveState();
    renderCabinet();
    showToast(`Saved prompt "${item.title}" to Cabinet.`);
  }
};

// Download community prompt directly as file bundle in cabinet
window.downloadCommunityPrompt = function(id, title) {
  const item = state.communityPrompts.find(c => c.id === id);
  if (!window.isUserLoggedIn()) {
    const isPremium = item && item.price > 0;
    const msg = isPremium 
      ? "Please login to purchase this prompt package." 
      : "Please login to download prompt packs and join the community.";
    const titleText = isPremium ? "🔒 Premium Purchase Required" : "🔒 Download Locked";
    window.showGuestLoginRequiredModal(msg, titleText);
    return;
  }
  simulateGuestLogin();
  if (item) {
    item.downloads++;

    // Generate output files corresponding to item category
    const outputs = generateOutputs(item.title).outputs;
    const files = Object.keys(outputs).map(key => ({
      name: getTabFileName(key),
      content: outputs[key]
    }));

    const cabinetItem = {
      id: `cab-comm-${Date.now()}`,
      title: `${item.title} Bundle Pack`,
      projectTitle: item.title,
      fileCount: files.length,
      isBundle: true,
      files,
      timestamp: 'Downloaded today'
    };

    state.cabinet.unshift(cabinetItem);
    saveState();
    renderCommunity();
    renderCabinet();
    
    // Automatically switch view to active output workspace
    mountOutputViewer({
      id: `hist-comm-${Date.now()}`,
      title: item.title,
      promptText: item.description,
      modelId: 'gemini-2.5-flash',
      projectType: 'generic',
      outputs,
      timestamp: 'Mounted from Community'
    });

    showToast(`Loaded community spec for "${title}" inside Orchestrator.`);
  }
};

// Acquire premium marketplace bundles
window.processCheckout = function() {
  const modal = document.getElementById('modal-checkout-container');
  if (!modal) return;
  const itemId = modal.dataset.checkoutItemId;
  const item = state.marketplaceItems.find(m => m.id === itemId);
  if (!item) return;

  const totals = getCheckoutTotals();

  const order = {
    id: `order-${Date.now()}`,
    title: item.title,
    creator: item.creator.name,
    amount: totals.originalPrice,
    currency: 'INR',
    platformFee: totals.platformFee,
    gst: totals.gst,
    total: totals.total,
    paymentMethod: document.querySelector('input[name="checkout-payment-method"]:checked')?.value || 'UPI',
    status: 'success',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  state.history.unshift({
    id: `hist-order-${Date.now()}`,
    title: `${item.title} Purchase Receipt`,
    promptText: item.description,
    modelId: state.selectedModel,
    projectType: 'checkout',
    outputs: {},
    timestamp: 'Payment Successful'
  });

  modal.dataset.checkoutPurchased = 'true';

  saveState();
  renderMarketplace();
  renderHistory();
  OrderSuccess(order);
};

function closeCheckoutModal() {
  const modal = document.getElementById('modal-checkout-container');
  if (!modal) return;
  modal.classList.remove('is-visible');
  setTimeout(() => {
    modal.classList.add('d-none');
    const successContainer = document.getElementById('checkout-success-container');
    if (successContainer) {
      successContainer.classList.add('d-none');
    }
  }, 220);
}

window.closeCheckoutModal = closeCheckoutModal;

window.downloadPurchasedPrompt = function() {
  const modal = document.getElementById('modal-checkout-container');
  if (!modal) return;

  const itemId = modal.dataset.checkoutItemId;
  const item = state.marketplaceItems.find(m => m.id === itemId);
  if (!item) return;

  const outputs = generateOutputs(item.title).outputs;
  const files = Object.keys(outputs).map(key => ({
    name: getTabFileName(key),
    content: outputs[key]
  }));

  state.cabinet.unshift({
    id: `cab-market-${Date.now()}`,
    title: `${item.title} Bundle Pack`,
    projectTitle: item.title,
    fileCount: files.length,
    isBundle: true,
    files,
    timestamp: 'Downloaded from checkout'
  });

  item.downloads = (item.downloads || 0) + 1;
  saveState();
  renderMarketplace();
  renderCabinet();
  closeCheckoutModal();
  showToast(`Downloaded prompt bundle: ${item.title}`);
};

window.goToDownloadsFromCheckout = function() {
  closeCheckoutModal();
  switchView('downloads');
};

// Marketplace Wishlist
window.showMarketplaceWishlist = function(id) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to add this prompt package to your wishlist.", "🔒 Wishlist Locked");
    return;
  }
  showToast("Added to Wishlist successfully.");
};

// Marketplace Full Preview
window.showMarketplacePreview = function(id) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to view the full preview of this prompt package.", "🔒 Full Preview Locked");
    return;
  }
  showToast("Full Preview opened in safe compilation sandbox.");
};

// Contact Marketplace Seller
window.contactMarketplaceSeller = function(id) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to contact the seller of this package.", "🔒 Contact Seller Locked");
    return;
  }
  showToast("Opening secure seller chat window.");
};

// Delete single history item
window.deleteHistoryItem = function(id) {
  state.history = state.history.filter(h => h.id !== id);
  saveState();
  renderHistory();
  showToast("History entry deleted.");
};

// Delete single downloads cabinet item
window.deleteCabinetItem = function(id) {
  state.cabinet = state.cabinet.filter(c => c.id !== id);
  saveState();
  renderCabinet();
  showToast("File removed from Downloads Cabinet.");
};

// View single downloaded cabinet file or package files listing inside lightbox modal
window.viewCabinetItem = function(id) {
  const item = state.cabinet.find(c => c.id === id);
  if (item) {
    const modal = document.getElementById('modal-filereader-container');
    const pathSpan = document.getElementById('filereader-modal-path');
    const contentPre = document.getElementById('filereader-modal-content');

    pathSpan.innerText = `Cabinet Reader > ${item.title}`;
    
    if (item.isBundle) {
      // It's a package bundle containing multiple files
      const fileListing = item.files.map(file => {
        return `==========================================\n[FILE: ${file.name}]\n==========================================\n${file.content}\n\n`;
      }).join('\n');
      contentPre.innerText = fileListing;
    } else {
      // Single file
      contentPre.innerText = item.files[0]?.content || '// Empty File';
    }

    modal.classList.remove('d-none');
  }
};

// ==========================================
// GUEST MODE & VISITOR INTERACTION HELPERS
// ==========================================

// Complete source specification helper
function getCompletePromptText(item) {
  return `// PROMPT STUDIO SPECIFICATION FORMULARY
// TITLE: ${item.title}
// CREATOR: ${item.creator?.name || "Aria Chen"}
// GENERATED: ${new Date().toISOString().split('T')[0]}

# CONTEXT & OBJECTIVE
You are an elite software architect focused on offline-first SaaS execution. Build a fully responsive application centered on "${item.title}".

# KEY CONSTRAINTS
- Strict offline local storage integration
- Custom responsive grids and mobile scaling
- Zero dependencies on remote tracking services
- Elegant visual interface featuring fluid transitions

# SOURCE INSTRUCTIONS
${item.description || "Synthesize complete developer blueprints."}
`;
}

// Guest banner dismissal
window.dismissGuestBanner = function() {
  state.guestBannerDismissed = true;
  saveState();
  renderCommunity();
  showToast("Banner dismissed. You can still login anytime via the sign in button.");
};

// Direct chat with creator trigger
window.chatWithCreator = function(creatorName) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to chat directly with our expert prompt engineers.", "🔒 Creator Chat Locked");
    return;
  }
  showToast(`Initiating private developer pipeline with ${creatorName}...`);
};

// View detailed creator profile
window.viewCreatorProfile = function(name, avatar) {
  const isGuest = !window.isUserLoggedIn();
  const modal = document.getElementById('modal-creator-profile-container');
  const body = document.getElementById('creator-profile-body');
  if (!modal || !body) return;

  // Synthesize attractive profile details
  const promptCount = Math.floor((name.charCodeAt(0) * 3) % 12) + 4;
  const rating = (((name.charCodeAt(1) * 7) % 5) / 10 + 4.5).toFixed(1);
  const totalDownloads = Math.floor((name.charCodeAt(0) * 123) % 1800) + 200;
  
  // Follower count and state
  const isFollowing = state.followingCreators && state.followingCreators[name];
  const followBtnText = isGuest ? "🔒 Follow Creator" : (isFollowing ? "Following" : "Follow Creator");
  const followBtnClass = isGuest ? "btn-outline-primary" : (isFollowing ? "btn-success" : "btn-primary");

  body.innerHTML = `
    <div class="text-center mb-4">
      <img src="${avatar}" class="rounded-circle border border-3 border-light shadow-sm mb-3" style="width: 80px; height: 80px; object-fit: cover;" />
      <h4 class="fw-bold text-dark mb-1 fs-5">${name}</h4>
      <span class="badge bg-primary bg-opacity-10 text-primary fs-9 rounded-pill px-2.5 py-1 text-uppercase tracking-wider">Verified Creator</span>
    </div>

    <!-- Stats Row -->
    <div class="row g-2 text-center mb-4">
      <div class="col-4">
        <div class="p-2 border rounded-3 bg-light">
          <span class="fs-9 text-muted d-block text-uppercase fw-semibold" style="font-size: 8.5px;">Blueprints</span>
          <span class="fs-7 fw-bold text-dark">${promptCount}</span>
        </div>
      </div>
      <div class="col-4">
        <div class="p-2 border rounded-3 bg-light">
          <span class="fs-9 text-muted d-block text-uppercase fw-semibold" style="font-size: 8.5px;">Rating</span>
          <span class="fs-7 fw-bold text-dark"><i data-lucide="star" style="width: 11px; height: 11px; fill: currentColor;" class="text-warning me-0.5"></i>${rating}</span>
        </div>
      </div>
      <div class="col-4">
        <div class="p-2 border rounded-3 bg-light">
          <span class="fs-9 text-muted d-block text-uppercase fw-semibold" style="font-size: 8.5px;">Downloads</span>
          <span class="fs-7 fw-bold text-dark">${totalDownloads}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="mb-4">
      <h6 class="fs-9 text-uppercase tracking-wider text-muted fw-bold mb-2" style="font-size: 9px;">Biography & Stack</h6>
      <p class="fs-8 text-secondary mb-0 leading-relaxed">
        Expert Prompt Architect specialized in zero-telemetry offline SaaS templates. Active contributor compiling enterprise-grade specifications for OpenAI, Claude, and Gemini engines.
      </p>
    </div>

    <!-- Dynamic Actions -->
    <div class="d-flex gap-2">
      <button class="btn ${followBtnClass} w-100 fw-bold fs-8 py-2.5 rounded-3 shadow-sm" onclick="toggleFollowCreator('${name}')">
        ${followBtnText}
      </button>
      <button class="btn btn-outline-secondary w-100 fw-bold fs-8 py-2.5 rounded-3" onclick="chatWithCreator('${name}')">
        ${isGuest ? '🔒 Message' : 'Message'}
      </button>
    </div>
  `;

  modal.classList.remove('d-none');
  lucide.createIcons();
};

// Toggle follow creator status
window.toggleFollowCreator = function(name) {
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to follow creators and customize your feeds.", "🔒 Follow Feature Locked");
    return;
  }
  if (!state.followingCreators) state.followingCreators = {};
  if (state.followingCreators[name]) {
    delete state.followingCreators[name];
    showToast(`Unfollowed ${name}.`);
  } else {
    state.followingCreators[name] = true;
    showToast(`Successfully followed ${name}!`);
  }
  saveState();
  // Refresh modal if open
  const avatar = document.querySelector(`#creator-profile-body img`)?.getAttribute('src') || '';
  window.viewCreatorProfile(name, avatar);
};

// Open interactive prompt preview modal
window.openPromptPreview = function(id) {
  // Find in community prompts or marketplace items
  const item = state.communityPrompts.find(p => p.id === id) || state.marketplaceItems.find(m => m.id === id);
  if (!item) return;

  const isGuest = !window.isUserLoggedIn();
  const modal = document.getElementById('modal-prompt-preview-container');
  const body = document.getElementById('prompt-preview-body');
  if (!modal || !body) return;

  const priceDisplay = item.price === 0 ? 'FREE' : `$${item.price}`;
  const promptBodyContent = item.longDescription || item.description;
  const fullSpecContent = getCompletePromptText(item);

  let specBlockHtml = '';
  if (isGuest) {
    specBlockHtml = `
      <div class="position-relative border rounded-3 p-3 bg-light overflow-hidden" style="min-height: 140px;">
        <div style="filter: blur(5px); opacity: 0.3; user-select: none; pointer-events: none;" class="font-monospace fs-9">
          ${fullSpecContent.slice(0, 150)}<br>
          DEVELOPER_PRESET_CONFIG = {<br>
            API_VERSION: "v5.2.0-beta",<br>
            SECURE_TELEMETRY: false,<br>
            LOCAL_COMPILED_HASH: "0x8fa9c2"<br>
          }<br>
          // Fully formatted custom code generator outputs locked...
        </div>
        <div class="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
          <div class="p-3 bg-dark bg-opacity-95 text-white rounded-3 shadow border border-secondary border-opacity-30 d-inline-block">
            <h6 class="fw-bold fs-8 mb-1.5"><i data-lucide="lock" class="me-1" style="width: 14px; height: 14px; display: inline-block;"></i> Source Prompt Code Locked</h6>
            <p class="fs-9 text-white text-opacity-80 mb-2 leading-relaxed" style="font-size: 11px;">You must sign in to view, copy, or download this full blueprint specification.</p>
            <button class="btn btn-primary btn-sm fw-bold fs-9 px-3 py-1.5 rounded-2" onclick="closePromptPreview(); openLoginModal('login');">Login to Unlock</button>
          </div>
        </div>
      </div>
    `;
  } else {
    specBlockHtml = `
      <div class="border rounded-3 p-3 bg-light">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="fs-9 text-uppercase tracking-wider text-muted fw-bold font-monospace">Compiled Source Blueprint</span>
          <button class="btn btn-link p-0 text-primary text-decoration-none fs-9 fw-semibold" onclick="navigator.clipboard.writeText(\`${fullSpecContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`); showToast('Copied full prompt text to clipboard!');">
            <i data-lucide="copy" style="width: 11px; height: 11px;" class="me-1"></i>Copy Prompt
          </button>
        </div>
        <pre class="fs-9 text-dark mb-0 font-monospace leading-relaxed" style="white-space: pre-wrap; word-break: break-all; max-height: 250px; overflow-y: auto;">${fullSpecContent}</pre>
      </div>
    `;
  }

  body.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2.5">
      <div class="d-flex align-items-center gap-2 cursor-pointer" onclick="closePromptPreview(); viewCreatorProfile('${item.creator?.name || 'Aria Chen'}', '${item.creator?.avatar || ''}')">
        <img src="${item.creator?.avatar || ''}" class="rounded-circle border" style="width: 32px; height: 32px; object-fit: cover;" />
        <div>
          <span class="fw-bold text-dark fs-8 d-block leading-none mb-1 text-primary-hover">${item.creator?.name || 'Aria Chen'}</span>
          <span class="fs-9 text-muted" style="font-size: 10px;">Creator • Contributor</span>
        </div>
      </div>
      <div class="text-end">
        <span class="badge bg-warning text-dark fs-9 rounded-pill px-2.5 py-1 text-uppercase">${priceDisplay}</span>
      </div>
    </div>

    <h4 class="fw-extrabold text-dark fs-6 mb-2">${item.title}</h4>
    <p class="fs-8 text-secondary mb-3 leading-relaxed">${promptBodyContent}</p>

    <!-- Specs block -->
    <div class="mb-4">
      <h6 class="fs-9 text-uppercase tracking-wider text-muted fw-bold mb-2" style="font-size: 9px;">Prompt Specification Preview</h6>
      ${specBlockHtml}
    </div>

    <div class="d-flex gap-2">
      <button class="btn btn-primary w-100 fw-bold fs-8 py-2.5 rounded-3" onclick="closePromptPreview(); downloadCommunityPrompt('${item.id}', '${item.title}');">
        ${isGuest ? '🔒 Acquire & Compile' : 'Compile to Workspace'}
      </button>
    </div>
  `;

  modal.classList.remove('d-none');
  lucide.createIcons();
};

// View and manage comments
window.commentCommunityPrompt = function(id) {
  const isGuest = !window.isUserLoggedIn();
  const modal = document.getElementById('modal-comments-container');
  const listBody = document.getElementById('comments-list-body');
  if (!modal || !listBody) return;

  // Set active prompt id as a data attribute on the form
  const form = document.getElementById('comments-post-form');
  if (form) form.setAttribute('data-prompt-id', id);

  // Initialize initial mock comments for this prompt if not already present
  if (!state.promptComments[id]) {
    state.promptComments[id] = [
      { author: "Devin Mercer", text: "Truly spectacular specs. Compiles perfectly in GPT-5 core without any prompt alignment leakage.", time: "2h ago" },
      { author: "Aria Chen", text: "Added the offline sync local variables manually. Works beautifully on mobile layout constraints.", time: "4h ago" }
    ];
  }

  const comments = state.promptComments[id];

  // Render comments
  listBody.innerHTML = comments.map(c => `
    <div class="mb-3 border-bottom pb-2.5">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <span class="fw-bold text-dark fs-8">${c.author}</span>
        <span class="fs-9 text-muted" style="font-size: 10px;">${c.time}</span>
      </div>
      <p class="fs-9 text-secondary mb-0 leading-relaxed" style="font-size: 11.5px;">${c.text}</p>
    </div>
  `).join('');

  // Handle guest input restriction
  const commentInput = document.getElementById('comment-text-input');
  const commentBtn = document.getElementById('comment-submit-btn');
  if (isGuest) {
    if (commentInput) {
      commentInput.value = "";
      commentInput.disabled = true;
      commentInput.placeholder = "🔒 Login required to post comments...";
    }
    if (commentBtn) {
      commentBtn.innerText = "🔒 Post";
      commentBtn.classList.add('disabled');
    }
  } else {
    if (commentInput) {
      commentInput.disabled = false;
      commentInput.placeholder = "Write a constructive developer feedback...";
    }
    if (commentBtn) {
      commentBtn.innerText = "Post";
      commentBtn.classList.remove('disabled');
    }
  }

  modal.classList.remove('d-none');
};

// Post comment function
window.postNewComment = function(event) {
  event.preventDefault();
  if (!window.isUserLoggedIn()) {
    window.showGuestLoginRequiredModal("Please login to post comments and participate in community discussions.", "🔒 Discussions Locked");
    return;
  }
  const form = document.getElementById('comments-post-form');
  const id = form.getAttribute('data-prompt-id');
  const input = document.getElementById('comment-text-input');
  if (!id || !input) return;

  const text = input.value.trim();
  if (!text) return;

  if (!state.promptComments[id]) {
    state.promptComments[id] = [];
  }

  state.promptComments[id].push({
    author: state.currentUser?.name || "Developer Hero",
    text,
    time: "Just now"
  });

  saveState();
  input.value = "";
  commentCommunityPrompt(id); // re-render list
  showToast("Comment published safely in community thread.");
};

// Modal close triggers
window.closePromptPreview = function() {
  document.getElementById('modal-prompt-preview-container').classList.add('d-none');
};
window.closeCreatorProfile = function() {
  document.getElementById('modal-creator-profile-container').classList.add('d-none');
};
window.closeCommentsModal = function() {
  document.getElementById('modal-comments-container').classList.add('d-none');
};

// Global show guest modal
window.showGuestLoginRequiredModal = function(message, title) {
  const modal = document.getElementById('modal-guest-login-container');
  if (modal) {
    const titleEl = document.getElementById('guest-modal-title');
    const msgEl = document.getElementById('guest-modal-message');
    if (titleEl && title) titleEl.innerText = title;
    if (msgEl && message) msgEl.innerHTML = message;
    modal.classList.remove('d-none');
    lucide.createIcons();
  }
};
