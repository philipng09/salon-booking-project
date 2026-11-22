/* Đồng bộ chỉ phần tài khoản Header; giữ nguyên Auth và Cart của nhóm. */
(function () {
  "use strict";
  const holder = document.getElementById("auth-action-container");
  if (!holder || !window.SalonBookAuth) return;
  const auth = window.SalonBookAuth;
  const icon = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="9" r="3.1" fill="currentColor"/><path d="M5.5 18.5c.6-3.3 2.9-5 6.5-5s5.9 1.7 6.5 5" fill="currentColor"/></svg>';
  let updating = false;
  function sync() {
    if (updating) return;
    const user = auth.currentUser?.();
    if (!user) return;
    const row = holder.querySelector('.auth-header-actions');
    if (!row) return;
    const role = user.role;
    const label = row.querySelector('.auth-user-name');
    if (role === 'customer') {
      updating = true;
      let link = row.querySelector('.sb-profile-link');
      if (!link) {
        link = document.createElement('a');
        link.href = 'profile.html';
        link.className = 'sb-profile-link';
        link.setAttribute('aria-label', 'Thông tin tài khoản');
        link.innerHTML = '<span class="sb-profile-avatar">'+icon+'</span><span class="sb-profile-name" id="header-user-name"></span>';
        if (label) label.replaceWith(link); else row.prepend(link);
      }
      const name = link.querySelector('.sb-profile-name');
      if (name && name.textContent !== (user.fullName || 'Khách hàng')) name.textContent = user.fullName || 'Khách hàng';
      row.querySelector('.auth-logout')?.remove();
      updating = false;
    } else if (role === 'salon_owner') {
      // Chủ Salon giữ nguyên nút Quản lý và Đăng xuất của auth.js.
      // Không tự điều hướng chủ Salon sang Customer Profile.
    }
  }
  const obs = new MutationObserver(sync);
  obs.observe(holder, {childList:true, subtree:true});
  document.addEventListener('salonbook:auth-changed', sync);
  sync();
})();

/* Header quick search: Enter chuyển sang Khám phá salon trên trang Đặt lịch. */
(function () {
  'use strict';
  const input = document.getElementById('header-quick-search');
  if (!input) return;
  input.setAttribute('aria-label', 'Tìm kiếm salon theo tên hoặc khu vực');
  input.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' || event.isComposing) return;
    const term = input.value.trim();
    if (!term) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const params = new URLSearchParams({ q: term });
    window.location.assign('products.html?' + params.toString() + '#salon-grid');
  }, true);
})();
