// ==========================================
// PROMPT STUDIO - PURE CSS ANALYTICS ENGINE
// ==========================================

window.RenderCSSCharts = {
  // Renders a beautiful bar chart inside a target container
  bar: (containerId, data, height = 150) => {
    const el = document.getElementById(containerId);
    if (!el) return;

    const maxVal = Math.max(...data.map(d => d.value)) || 1;
    
    let html = `
      <div class="d-flex align-items-end justify-content-between h-100 px-1 pt-3" style="height: ${height}px !important;">
    `;

    data.forEach(item => {
      const pct = (item.value / maxVal) * 100;
      html += `
        <div class="d-flex flex-column align-items-center flex-grow-1 group text-center cursor-pointer" style="margin: 0 4px;">
          <!-- Tooltip on Hover -->
          <div class="position-relative w-100 d-flex justify-content-center">
            <span class="badge bg-dark position-absolute mb-1 d-none group-hover-show fs-9 text-white" style="bottom: 100%; z-index: 1000; font-size: 8px;">${item.value}</span>
          </div>
          <!-- Colored Bar with grow animation -->
          <div class="w-100 rounded-top" style="
            background: linear-gradient(180deg, var(--admin-accent) 0%, rgba(var(--admin-accent-rgb), 0.4) 100%); 
            height: 0px; 
            min-height: 4px;
            animation: growBarHeight 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            --bar-height: ${pct}%;"
          ></div>
          <!-- Label -->
          <span class="text-muted mt-2 fw-medium" style="font-size: 9px; white-space: nowrap; overflow: hidden; max-width: 45px;">${item.label}</span>
        </div>
      `;
    });

    html += `
      </div>
      
      <!-- Keyframe Injector -->
      <style>
        @keyframes growBarHeight {
          from { height: 0; }
          to { height: var(--bar-height); }
        }
        .group:hover .group-hover-show {
          display: block !important;
        }
      </style>
    `;

    el.innerHTML = html;
  },

  // Renders a progress-based donut/row list chart
  progressList: (containerId, data) => {
    const el = document.getElementById(containerId);
    if (!el) return;

    const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

    let html = '<div class="d-flex flex-column gap-3">';
    
    data.forEach((item, index) => {
      const pct = ((item.value / total) * 100).toFixed(1);
      const colors = ['bg-primary', 'bg-purple', 'bg-emerald', 'bg-warning', 'bg-danger'];
      const colorClass = colors[index % colors.length];

      html += `
        <div>
          <div class="d-flex align-items-center justify-content-between mb-1 fs-9">
            <span class="fw-bold text-dark">${item.label}</span>
            <span class="text-muted">${item.value} (${pct}%)</span>
          </div>
          <div class="progress rounded-pill" style="height: 6px; background-color: #f1f5f9;">
            <div class="progress-bar ${colorClass} rounded-pill" role="progressbar" style="width: ${pct}%;" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    el.innerHTML = html;
  }
};

// Initial analytical data pipelines
const DAILY_USERS_DATA = [
  { label: "Mon", value: 450 },
  { label: "Tue", value: 620 },
  { label: "Wed", value: 580 },
  { label: "Thu", value: 840 },
  { label: "Fri", value: 710 },
  { label: "Sat", value: 920 },
  { label: "Sun", value: 1100 }
];

const WEEKLY_DOWNLOADS_DATA = [
  { label: "Wk 24", value: 1200 },
  { label: "Wk 25", value: 1540 },
  { label: "Wk 26", value: 2100 },
  { label: "Wk 27", value: 1890 },
  { label: "Wk 28", value: 2450 }
];

const SALES_REVENUE_DATA = [
  { label: "Jan", value: 4800 },
  { label: "Feb", value: 6100 },
  { label: "Mar", value: 7500 },
  { label: "Apr", value: 9200 },
  { label: "May", value: 12400 },
  { label: "Jun", value: 15800 }
];

const TOP_CATEGORIES_DATA = [
  { label: "Frontend", value: 1240 },
  { label: "AI & LLM", value: 890 },
  { label: "Database", value: 540 },
  { label: "Full Stack", value: 430 },
  { label: "Marketing", value: 210 }
];

// Initialize global auto renders if targets are present on active screen
document.addEventListener('DOMContentLoaded', () => {
  // Wait a short moment for DOM structures to mount fully
  setTimeout(() => {
    RenderCSSCharts.bar('chart-daily-users', DAILY_USERS_DATA, 140);
    RenderCSSCharts.bar('chart-sales-revenue', SALES_REVENUE_DATA, 140);
    RenderCSSCharts.progressList('chart-popular-categories', TOP_CATEGORIES_DATA);
  }, 100);
});
