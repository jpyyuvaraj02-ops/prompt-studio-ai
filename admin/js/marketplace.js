// ==========================================
// PROMPT STUDIO - MARKETPLACE ADMIN CONTROLLER
// ==========================================

function loadMarketplaceTable() {
  const tableBody = document.getElementById('marketplace-table-body');
  if (!tableBody) return;

  let items = StorageHelper.get('ps_marketplace');

  // Fill in default status fields if not present
  let stateChanged = false;
  items = items.map(m => {
    if (!m.status) {
      m.status = 'approved';
      stateChanged = true;
    }
    return m;
  });
  if (stateChanged) {
    StorageHelper.set('ps_marketplace', items);
  }

  // Filters
  const searchQuery = document.getElementById('market-search')?.value.toLowerCase() || "";
  const categoryFilter = document.getElementById('market-category-filter')?.value || "All";
  const statusFilter = document.getElementById('market-status-filter')?.value || "All";

  let filtered = items.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery) || 
                          (m.creator?.name || "").toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">No marketplace packages found.</td></tr>`;
  } else {
    tableBody.innerHTML = filtered.map(m => {
      let statusClass = 'badge-soft-success';
      if (m.status === 'pending') statusClass = 'badge-soft-warning';
      if (m.status === 'rejected') statusClass = 'badge-soft-danger';

      const discountLabel = m.discount ? `<span class="badge bg-danger ms-1" style="font-size: 8px;">-${m.discount}% Off</span>` : '';
      const featuredLabel = m.featured ? `<span class="badge bg-warning text-dark ms-1" style="font-size: 8px;"><i class="bi bi-star-fill me-0.5"></i>Featured</span>` : '';

      return `
        <tr>
          <td><span class="font-monospace fw-bold text-secondary">${m.id}</span></td>
          <td>
            <div class="d-flex align-items-center gap-2.5">
              <div class="bg-primary bg-opacity-10 rounded text-primary d-flex align-items-center justify-content-center border" style="width: 36px; height: 36px; min-width: 36px;">
                <i class="bi bi-shop fs-8"></i>
              </div>
              <div style="max-width: 240px;">
                <span class="fw-bold text-dark d-block text-truncate" title="${m.title}">${m.title}</span>
                <span class="text-muted fs-9 text-truncate d-block" style="font-size: 0.75rem;">${m.description}</span>
                <div class="mt-1 d-flex gap-1 flex-wrap">
                  ${discountLabel} ${featuredLabel}
                </div>
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center gap-2">
              <img src="${m.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}" class="rounded-circle border" style="width: 24px; height: 24px; object-fit: cover;" />
              <span class="fs-9 fw-semibold text-dark">${m.creator?.name || 'Anonymous'}</span>
            </div>
          </td>
          <td><span class="badge bg-light text-dark border rounded px-2 py-0.5 fs-9">${m.category}</span></td>
          <td><span class="fw-bold text-dark">$${(m.price || 0).toFixed(2)}</span></td>
          <td><span class="fw-semibold text-dark">${m.downloads || 0}</span></td>
          <td><span class="fw-semibold text-warning"><i class="bi bi-star-fill me-1" style="font-size: 10px;"></i>${m.rating || '4.5'}</span></td>
          <td><span class="badge ${statusClass} px-2 py-1 rounded text-uppercase" style="font-size: 10px;">${m.status}</span></td>
          <td>
            <div class="dropdown">
              <button class="btn btn-light btn-sm rounded" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 fs-9">
                ${m.status !== 'approved' ? `<li><a class="dropdown-item py-2" href="#" onclick="approveProduct('${m.id}'); return false;"><i class="bi bi-check-circle text-success me-2"></i>Approve</a></li>` : ''}
                ${m.status !== 'rejected' ? `<li><a class="dropdown-item py-2" href="#" onclick="rejectProduct('${m.id}'); return false;"><i class="bi bi-x-circle text-warning me-2"></i>Reject</a></li>` : ''}
                <li><a class="dropdown-item py-2" href="#" onclick="editProductModal('${m.id}'); return false;"><i class="bi bi-pencil me-2"></i>Edit Product</a></li>
                <li><a class="dropdown-item py-2" href="#" onclick="discountModal('${m.id}'); return false;"><i class="bi bi-percent me-2"></i>Apply Discount</a></li>
                <li><a class="dropdown-item py-2" href="#" onclick="toggleFeatureProduct('${m.id}'); return false;"><i class="bi bi-star me-2"></i>${m.featured ? 'Remove Featured' : 'Feature Product'}</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item py-2 text-danger" href="#" onclick="deleteProduct('${m.id}'); return false;"><i class="bi bi-trash me-2"></i>Delete</a></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

window.approveProduct = function(id) {
  let items = StorageHelper.get('ps_marketplace');
  const index = items.findIndex(m => m.id === id);
  if (index !== -1) {
    items[index].status = 'approved';
    StorageHelper.set('ps_marketplace', items);
    StorageHelper.addLog("admin@promptstudio.ai", "Product Approved", "Marketplace", "Success", `Approved marketplace package: ${items[index].title}`);
    StorageHelper.addNotification(`Marketplace Product Approved: "${items[index].title}"`, "Marketplace");
    loadMarketplaceTable();
  }
};

window.rejectProduct = function(id) {
  let items = StorageHelper.get('ps_marketplace');
  const index = items.findIndex(m => m.id === id);
  if (index !== -1) {
    items[index].status = 'rejected';
    StorageHelper.set('ps_marketplace', items);
    StorageHelper.addLog("admin@promptstudio.ai", "Product Rejected", "Marketplace", "Success", `Rejected marketplace package: ${items[index].title}`);
    loadMarketplaceTable();
  }
};

window.toggleFeatureProduct = function(id) {
  let items = StorageHelper.get('ps_marketplace');
  const index = items.findIndex(m => m.id === id);
  if (index !== -1) {
    items[index].featured = !items[index].featured;
    StorageHelper.set('ps_marketplace', items);
    loadMarketplaceTable();
  }
};

window.deleteProduct = function(id) {
  if (confirm("Are you sure you want to delete this marketplace product?")) {
    let items = StorageHelper.get('ps_marketplace');
    const target = items.find(m => m.id === id);
    const updated = items.filter(m => m.id !== id);
    StorageHelper.set('ps_marketplace', updated);
    
    StorageHelper.addLog("admin@promptstudio.ai", "Product Deleted", "Marketplace", "Success", `Deleted product: ${target ? target.title : id}`);
    loadMarketplaceTable();
  }
};

// Discount Modal triggers
window.discountModal = function(id) {
  const items = StorageHelper.get('ps_marketplace');
  const item = items.find(m => m.id === id);
  if (!item) return;

  document.getElementById('discount-product-id').value = item.id;
  document.getElementById('discount-product-title').innerText = item.title;
  document.getElementById('discount-percentage').value = item.discount || 0;

  const myModal = new bootstrap.Modal(document.getElementById('productDiscountModal'));
  myModal.show();
};

window.saveProductDiscount = function() {
  const id = document.getElementById('discount-product-id').value;
  const percentage = parseInt(document.getElementById('discount-percentage').value) || 0;

  if (percentage < 0 || percentage > 99) {
    alert("Please enter a valid discount percentage (0 - 99%).");
    return;
  }

  let items = StorageHelper.get('ps_marketplace');
  const index = items.findIndex(m => m.id === id);
  if (index !== -1) {
    items[index].discount = percentage;
    StorageHelper.set('ps_marketplace', items);

    StorageHelper.addLog("admin@promptstudio.ai", "Product Discount Applied", "Marketplace", "Success", `Applied ${percentage}% discount on: ${items[index].title}`);
    bootstrap.Modal.getInstance(document.getElementById('productDiscountModal')).hide();
    loadMarketplaceTable();
  }
};

// Edit Product Modal
window.editProductModal = function(id) {
  const items = StorageHelper.get('ps_marketplace');
  const item = items.find(m => m.id === id);
  if (!item) return;

  document.getElementById('edit-product-id').value = item.id;
  document.getElementById('edit-product-title').value = item.title;
  document.getElementById('edit-product-description').value = item.description;
  document.getElementById('edit-product-category').value = item.category;
  document.getElementById('edit-product-price').value = item.price || 0;

  const myModal = new bootstrap.Modal(document.getElementById('productEditModal'));
  myModal.show();
};

window.saveEditedProduct = function() {
  const id = document.getElementById('edit-product-id').value;
  const title = document.getElementById('edit-product-title').value.trim();
  const description = document.getElementById('edit-product-description').value.trim();
  const category = document.getElementById('edit-product-category').value;
  const price = parseFloat(document.getElementById('edit-product-price').value) || 0;

  if (!title || !description) {
    alert("Please fill in all product fields.");
    return;
  }

  let items = StorageHelper.get('ps_marketplace');
  const index = items.findIndex(m => m.id === id);
  if (index !== -1) {
    items[index].title = title;
    items[index].description = description;
    items[index].category = category;
    items[index].price = price;
    StorageHelper.set('ps_marketplace', items);

    StorageHelper.addLog("admin@promptstudio.ai", "Product Edited", "Marketplace", "Success", `Edited metadata for product: ${title}`);
    bootstrap.Modal.getInstance(document.getElementById('productEditModal')).hide();
    loadMarketplaceTable();
  }
};

// Initialize listeners
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('market-search');
  const categoryFilter = document.getElementById('market-category-filter');
  const statusFilter = document.getElementById('market-status-filter');

  if (searchInput) searchInput.addEventListener('keyup', loadMarketplaceTable);
  if (categoryFilter) categoryFilter.addEventListener('change', loadMarketplaceTable);
  if (statusFilter) statusFilter.addEventListener('change', loadMarketplaceTable);

  loadMarketplaceTable();
});
