/* SalonBook — Giỏ dịch vụ + thông tin lịch hẹn dùng chung toàn website.
 * Bảng giá: products.js -> servicesList[].price. Lịch là DỰ KIẾN, không đặt chỗ thật.
 * Tương thích cart cũ và API: addToCart/updateQuantity/removeFromCart/renderCart/getTotals.
 */
(function (global) {
  'use strict';
  const STORAGE_KEY = 'cart';
  const MAX_QUANTITY = 99;
  let memoryCart = null;

  function catalog() {
    if (typeof products !== 'undefined' && Array.isArray(products)) return products;
    return Array.isArray(global.products) ? global.products : [];
  }
  function resolveService(salonId, serviceId) {
    const salon = catalog().find(p => String(p.id) === String(salonId));
    if (!salon || !Array.isArray(salon.servicesList)) return null;
    const service = salon.servicesList.find(s => String(s.id) === String(serviceId));
    if (!service || !Number.isSafeInteger(service.price) || service.price < 0) return null;
    return {salon, service};
  }
  function localToday() {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  function validISODate(date) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const dateObj = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(dateObj.getTime()) && dateObj.toISOString().slice(0, 10) === date;
  }
  function validBooking(salonId, booking, requireFuture = false) {
    if (!booking || typeof booking !== 'object') return false;
    const salon = catalog().find(p => String(p.id) === String(salonId));
    if (!salon || !Array.isArray(salon.stylists)) return false;
    const stylist = salon.stylists.find(s => String(s.id) === String(booking.stylistId));
    if (!stylist || !validISODate(booking.date) ||
        typeof booking.time !== 'string' || !/^\d{2}:\d{2}$/.test(booking.time) ||
        !Array.isArray(stylist.availableHours) || !stylist.availableHours.includes(booking.time)) return false;
    return !requireFuture || booking.date >= localToday();
  }
  function bookingData(booking) {
    return {stylistId: String(booking.stylistId), date: booking.date, time: booking.time};
  }
  function keyOf(salonId, serviceId, booking) {
    // Mục cũ giữ nguyên khóa cũ để không làm hỏng dữ liệu và kiểm thử Buổi 3.
    const base = `${salonId}:${serviceId}`;
    return booking ? `${base}@${booking.stylistId}@${booking.date}@${booking.time}` : base;
  }
  function normalizeCart(value) {
    if (!Array.isArray(value)) return [];
    const unique = new Map();
    value.forEach(raw => {
      if (!raw || typeof raw !== 'object') return;
      const salonId = Number(raw.salonId);
      const serviceId = String(raw.serviceId || '');
      const quantity = Number(raw.quantity);
      if (!Number.isSafeInteger(salonId) || salonId < 1 ||
          !Number.isSafeInteger(quantity) || quantity < 1 || !resolveService(salonId, serviceId)) return;
      // Các bản ghi cart cũ không có lịch vẫn giữ được và có liên kết bổ sung lịch.
      const booking = validBooking(salonId, raw) ? bookingData(raw) : null;
      const key = keyOf(salonId, serviceId, booking);
      const old = unique.get(key);
      const item = {key, salonId, serviceId, quantity: Math.min(MAX_QUANTITY, quantity + (old ? old.quantity : 0))};
      if (booking) Object.assign(item, booking);
      unique.set(key, item);
    });
    return Array.from(unique.values());
  }
  function loadCart() {
    try {
      const stored = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
      memoryCart = normalizeCart(stored ? JSON.parse(stored) : []);
    } catch (_) {
      memoryCart = normalizeCart(memoryCart || []);
    }
    return getCart();
  }
  function getCart() {
    if (memoryCart === null) loadCart();
    return memoryCart.map(item => ({...item}));
  }
  function saveCart(items) {
    memoryCart = normalizeCart(items === undefined ? getCart() : items);
    try {
      if (global.localStorage) global.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCart));
    } catch (_) { /* Browser không cho lưu: vẫn thao tác được trong phiên. */ }
    refresh();
    return getCart();
  }
  function addToCart(salonId, serviceId, quantity = 1, booking = null) {
    const salon = catalog().find(p => String(p.id) === String(salonId));
    if (!salon) return false;
    const requested = serviceId || salon.servicesList?.[0]?.id;
    if (!resolveService(salon.id, requested) || !Number.isSafeInteger(quantity) || quantity < 1) return false;
    if (booking !== null && !validBooking(salon.id, booking, true)) return false;
    const info = booking ? bookingData(booking) : null;
    const key = keyOf(salon.id, requested, info);
    const items = getCart();
    const old = items.find(item => item.key === key);
    if (old) old.quantity = Math.min(MAX_QUANTITY, old.quantity + quantity);
    else {
      const item = {key, salonId: Number(salon.id), serviceId: String(requested), quantity: Math.min(MAX_QUANTITY, quantity)};
      if (info) Object.assign(item, info);
      items.push(item);
    }
    saveCart(items);
    return true;
  }
  function updateQuantity(key, quantity) {
    const amount = Number(quantity);
    if (!Number.isSafeInteger(amount) || amount < 0) return false;
    if (amount === 0) return removeFromCart(key);
    const items = getCart();
    const target = items.find(item => item.key === String(key));
    if (!target) return false;
    target.quantity = Math.min(MAX_QUANTITY, amount);
    saveCart(items);
    return true;
  }
  function removeFromCart(key) {
    const items = getCart();
    const remaining = items.filter(item => item.key !== String(key));
    if (items.length === remaining.length) return false;
    saveCart(remaining);
    return true;
  }
  function updateBooking(key, selection) {
    const items = getCart();
    const index = items.findIndex(item => item.key === String(key));
    if (index === -1) return false;
    const item = items[index];
    const serviceId = String(selection?.serviceId || item.serviceId);
    if (!resolveService(item.salonId, serviceId) || !validBooking(item.salonId, selection, true)) return false;
    const booking = bookingData(selection);
    const nextKey = keyOf(item.salonId, serviceId, booking);
    const quantity = item.quantity;
    items.splice(index, 1);
    const existing = items.find(other => other.key === nextKey);
    if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + quantity);
    else items.push({key: nextKey, salonId: item.salonId, serviceId, quantity, ...booking});
    saveCart(items);
    return true;
  }
  function getTotals() {
    const items = getCart().map(item => {
      const found = resolveService(item.salonId, item.serviceId);
      if (!found) return null;
      const stylist = found.salon.stylists?.find(s => String(s.id) === String(item.stylistId));
      const hasBooking = Boolean(stylist && item.date && item.time);
      const isPast = Boolean(hasBooking && item.date < localToday());
      return {
        ...item,
        salonName: found.salon.name,
        serviceName: found.service.name,
        image: found.salon.image,
        duration: found.service.duration,
        stylistName: stylist?.name || '',
        bookingDate: hasBooking ? item.date : '',
        bookingTime: hasBooking ? item.time : '',
        isComplete: hasBooking && !isPast,
        isPast,
        price: found.service.price,
        lineTotal: found.service.price * item.quantity
      };
    }).filter(Boolean);
    return {
      items,
      distinctItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce((sum, item) => sum + item.lineTotal, 0),
      completeBookings: items.filter(item => item.isComplete).length
    };
  }
  function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount);
  }
  function formatDate(date) {
    if (!validISODate(date)) return 'Chưa chọn';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }
  function updateBadge() {
    if (typeof document === 'undefined') return;
    const host = document.querySelector('.nav-actions');
    const mobileNav = document.querySelector('.main-nav');
    let link = host?.querySelector('[data-cart-link]');
    if (host && !link) {
      link = document.createElement('a');
      link.href = 'cart.html';
      link.className = 'cart-nav-link';
      link.setAttribute('data-cart-link', '');
      link.innerHTML = '<span aria-hidden="true">🛍</span> Giỏ dịch vụ <span class="cart-badge" data-cart-badge>0</span>';
      host.insertBefore(link, host.firstChild);
    }
    let mobileLink = mobileNav?.querySelector('[data-cart-mobile-link]');
    if (mobileNav && !mobileLink) {
      mobileLink = document.createElement('a');
      mobileLink.href = 'cart.html';
      mobileLink.className = 'cart-mobile-link';
      mobileLink.setAttribute('data-cart-mobile-link', '');
      mobileLink.innerHTML = '🛍 Giỏ dịch vụ (<span data-cart-badge>0</span>)';
      mobileNav.appendChild(mobileLink);
    }
    const count = getTotals().totalQuantity;
    [link, mobileLink].filter(Boolean).forEach(el => {
      el.querySelector('[data-cart-badge]').textContent = String(count);
      el.setAttribute('aria-label', `Giỏ dịch vụ: ${count} lượt`);
    });
  }
  function renderCart() {
    if (typeof document === 'undefined') return;
    const root = document.getElementById('cart-items');
    if (!root) return;
    const totals = getTotals();
    root.replaceChildren();
    const empty = document.getElementById('cart-empty');
    const filled = document.getElementById('cart-filled');
    if (empty) empty.hidden = totals.items.length !== 0;
    if (filled) filled.hidden = totals.items.length === 0;

    totals.items.forEach(item => {
      const row = document.createElement('article');
      row.className = 'cart-item';
      row.dataset.key = item.key;
      row.innerHTML = `
        <img class="cart-item-image" alt="" loading="lazy">
        <div class="cart-item-details">
          <span class="cart-item-salon"></span>
          <h3 class="cart-item-name"></h3>
          <p class="cart-item-duration"></p>
          <div class="cart-booking-info" aria-label="Chi tiết thông tin đặt lịch">
            <p class="cart-booking-heading">THÔNG TIN LỊCH HẸN DỰ KIẾN</p>
            <dl class="cart-booking-grid">
              <div><dt>Dịch vụ</dt><dd class="cart-booking-service"></dd></div>
              <div><dt>Chuyên viên</dt><dd class="cart-booking-stylist"></dd></div>
              <div><dt>Ngày</dt><dd class="cart-booking-date"></dd></div>
              <div><dt>Khung giờ</dt><dd class="cart-booking-time"></dd></div>
            </dl>
            <p class="cart-booking-warning" hidden></p>
            <a class="cart-edit-booking">✎ Chỉnh sửa lịch hẹn</a>
          </div>
          <p class="cart-item-price"></p>
          <button type="button" class="cart-remove" data-cart-action="remove">Xóa dịch vụ</button>
        </div>
        <div class="cart-item-side">
          <div class="cart-quantity" aria-label="Chỉnh số lượng">
            <button type="button" data-cart-action="decrease" aria-label="Giảm số lượng">−</button>
            <output class="cart-quantity-value"></output>
            <button type="button" data-cart-action="increase" aria-label="Tăng số lượng">+</button>
          </div>
          <strong class="cart-line-total"></strong>
        </div>`;
      const image = row.querySelector('.cart-item-image');
      image.src = item.image;
      image.alt = item.salonName;
      image.onerror = () => { image.onerror = null; image.src = 'images/salonbook-mark.png'; };
      const set = (selector, value) => { row.querySelector(selector).textContent = value; };
      set('.cart-item-salon', item.salonName);
      set('.cart-item-name', item.serviceName);
      set('.cart-item-duration', item.duration || 'Dịch vụ tại salon');
      set('.cart-booking-service', item.serviceName);
      set('.cart-booking-stylist', item.stylistName || 'Chưa chọn');
      set('.cart-booking-date', item.bookingDate ? formatDate(item.bookingDate) : 'Chưa chọn');
      set('.cart-booking-time', item.bookingTime || 'Chưa chọn');
      set('.cart-item-price', `Đơn giá: ${formatMoney(item.price)}`);
      set('.cart-quantity-value', String(item.quantity));
      set('.cart-line-total', formatMoney(item.lineTotal));
      row.querySelector('[data-cart-action="decrease"]').disabled = item.quantity === 1;
      row.querySelector('[data-cart-action="increase"]').disabled = item.quantity === MAX_QUANTITY;
      const edit = row.querySelector('.cart-edit-booking');
      edit.href = `product-detail.html?id=${encodeURIComponent(item.salonId)}&editKey=${encodeURIComponent(item.key)}#booking`;
      edit.textContent = item.isComplete ? '✎ Chỉnh sửa lịch hẹn' : '✎ Bổ sung thông tin lịch hẹn';
      if (!item.isComplete) {
        const warning = row.querySelector('.cart-booking-warning');
        warning.hidden = false;
        warning.textContent = item.isPast
          ? 'Ngày dự kiến đã qua. Vui lòng chọn lại ngày và khung giờ.'
          : 'Lịch hẹn chưa đủ thông tin. Hãy chọn chuyên viên, ngày và giờ.';
        row.classList.add('cart-item-incomplete');
      }
      root.appendChild(row);
    });
    const count = document.getElementById('cart-total-quantity');
    const money = document.getElementById('cart-total-money');
    if (count) count.textContent = String(totals.totalQuantity);
    if (money) money.textContent = formatMoney(totals.totalAmount);
  }
  function refresh() {
    updateBadge();
    renderCart();
    if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
      global.dispatchEvent(new global.CustomEvent('saloncart:change', {detail: getTotals()}));
    }
  }
  function showToast(message) {
    if (typeof document === 'undefined') return;
    let el = document.getElementById('cart-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cart-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-visible');
    global.clearTimeout(showToast.timeout);
    showToast.timeout = global.setTimeout(() => el.classList.remove('is-visible'), 2200);
  }
  function onClick(event) {
    const add = event.target.closest('[data-cart-add]');
    if (add) {
      const ok = addToCart(add.dataset.salonId, add.dataset.serviceId);
      showToast(ok ? 'Đã thêm dịch vụ vào giỏ!' : 'Không tìm thấy dịch vụ phù hợp.');
      return;
    }
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;
    const row = button.closest('[data-key]');
    if (!row) return;
    const item = getCart().find(entry => entry.key === row.dataset.key);
    if (!item) return;
    if (button.dataset.cartAction === 'remove') removeFromCart(item.key);
    if (button.dataset.cartAction === 'increase') updateQuantity(item.key, item.quantity + 1);
    if (button.dataset.cartAction === 'decrease' && item.quantity > 1) updateQuantity(item.key, item.quantity - 1);
  }
  const api = Object.freeze({
    STORAGE_KEY, MAX_QUANTITY, addToCart, updateQuantity, removeFromCart, updateBooking,
    renderCart, getTotals, saveCart, loadCart, getCart, formatMoney
  });
  global.SalonCart = api;
  if (typeof global.addToCart !== 'function') global.addToCart = addToCart;
  if (typeof document !== 'undefined') {
    const init = () => { loadCart(); refresh(); document.addEventListener('click', onClick); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
    else init();
    global.addEventListener('storage', event => { if (event.key === STORAGE_KEY) { loadCart(); refresh(); } });
  }
})(typeof window !== 'undefined' ? window : globalThis);
