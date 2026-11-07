/* SalonBook | Giỏ DỊCH VỤ dùng chung cho trang danh sách, chi tiết và giỏ hàng.
 * Nguồn giá: products.js -> salon.servicesList[].price (không dùng salon.price).
 * API: SalonCart.addToCart, updateQuantity, removeFromCart, renderCart,
 *      getTotals, loadCart, saveCart, getCart. Dữ liệu chỉ lưu ở trình duyệt.
 */
(function (global) {
  "use strict";
  const STORAGE_KEY = "cart";
  const MAX_QUANTITY = 99;
  let memoryCart = null;

  function catalog() {
    if (typeof products !== "undefined" && Array.isArray(products)) return products;
    return Array.isArray(global.products) ? global.products : [];
  }

  function resolveService(salonId, serviceId) {
    const salon = catalog().find(item => String(item.id) === String(salonId));
    if (!salon || !Array.isArray(salon.servicesList)) return null;
    const service = salon.servicesList.find(item => String(item.id) === String(serviceId));
    if (!service || !Number.isSafeInteger(service.price) || service.price < 0) return null;
    return { salon, service };
  }

  function keyOf(salonId, serviceId) {
    return `${salonId}:${serviceId}`;
  }

  function normalizeCart(value) {
    if (!Array.isArray(value)) return [];
    const unique = new Map();
    value.forEach(raw => {
      if (!raw || typeof raw !== "object") return;
      const salonId = Number(raw.salonId);
      const serviceId = String(raw.serviceId || "");
      const quantity = Number(raw.quantity);
      if (!Number.isSafeInteger(salonId) || salonId <= 0 ||
          !Number.isSafeInteger(quantity) || quantity <= 0 || !resolveService(salonId, serviceId)) return;
      const key = keyOf(salonId, serviceId);
      const previous = unique.get(key);
      unique.set(key, {
        key, salonId, serviceId,
        quantity: Math.min(MAX_QUANTITY, (previous ? previous.quantity : 0) + quantity)
      });
    });
    return Array.from(unique.values());
  }

  function loadCart() {
    try {
      const raw = global.localStorage && global.localStorage.getItem(STORAGE_KEY);
      memoryCart = normalizeCart(raw ? JSON.parse(raw) : []);
    } catch (_) {
      memoryCart = normalizeCart(memoryCart || []);
    }
    return memoryCart.map(item => ({ ...item }));
  }

  function getCart() {
    if (memoryCart === null) loadCart();
    return memoryCart.map(item => ({ ...item }));
  }

  function saveCart(items) {
    memoryCart = normalizeCart(items === undefined ? getCart() : items);
    try {
      if (global.localStorage) global.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCart));
    } catch (_) { /* Nếu trình duyệt chặn localStorage, giữ giỏ ở bộ nhớ phiên. */ }
    refresh();
    return getCart();
  }

  function addToCart(salonId, serviceId, quantity = 1) {
    const salon = catalog().find(item => String(item.id) === String(salonId));
    if (!salon) return false;
    // Khi danh sách salon chỉ truyền id, dùng dịch vụ đầu tiên được liệt kê.
    const requestedServiceId = serviceId || (salon.servicesList && salon.servicesList[0]?.id);
    if (!resolveService(salon.id, requestedServiceId) || !Number.isSafeInteger(quantity) || quantity <= 0) return false;
    const items = getCart();
    const key = keyOf(salon.id, requestedServiceId);
    const existing = items.find(item => item.key === key);
    if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + quantity);
    else items.push({ key, salonId: Number(salon.id), serviceId: String(requestedServiceId), quantity: Math.min(MAX_QUANTITY, quantity) });
    saveCart(items);
    return true;
  }

  function updateQuantity(key, quantity) {
    const nextQuantity = Number(quantity);
    if (!Number.isSafeInteger(nextQuantity) || nextQuantity < 0) return false;
    if (nextQuantity === 0) return removeFromCart(key);
    const items = getCart();
    const target = items.find(item => item.key === String(key));
    if (!target) return false;
    target.quantity = Math.min(MAX_QUANTITY, nextQuantity);
    saveCart(items);
    return true;
  }

  function removeFromCart(key) {
    const current = getCart();
    const remaining = current.filter(item => item.key !== String(key));
    if (remaining.length === current.length) return false;
    saveCart(remaining);
    return true;
  }

  function getTotals() {
    const items = getCart().map(item => {
      const found = resolveService(item.salonId, item.serviceId);
      if (!found) return null;
      return {
        ...item, salonName: found.salon.name, serviceName: found.service.name,
        image: found.salon.image, duration: found.service.duration,
        price: found.service.price, lineTotal: found.service.price * item.quantity
      };
    }).filter(Boolean);
    return {
      items, distinctItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: items.reduce((sum, item) => sum + item.lineTotal, 0)
    };
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  }

  function updateBadge() {
    if (typeof document === "undefined") return;
    const host = document.querySelector(".nav-actions");
    const mobileNav = document.querySelector(".main-nav");
    let link = host?.querySelector("[data-cart-link]");
    if (host && !link) {
      link = document.createElement("a");
      link.href = "cart.html";
      link.className = "cart-nav-link";
      link.setAttribute("data-cart-link", "");
      link.innerHTML = '<span aria-hidden="true">🛍</span> Giỏ dịch vụ <span class="cart-badge" data-cart-badge>0</span>';
      host.insertBefore(link, host.firstChild);
    }
    let mobileLink = mobileNav?.querySelector("[data-cart-mobile-link]");
    if (mobileNav && !mobileLink) {
      mobileLink = document.createElement("a");
      mobileLink.href = "cart.html";
      mobileLink.className = "cart-mobile-link";
      mobileLink.setAttribute("data-cart-mobile-link", "");
      mobileLink.innerHTML = '🛍 Giỏ dịch vụ (<span data-cart-badge>0</span>)';
      mobileNav.appendChild(mobileLink);
    }
    const count = getTotals().totalQuantity;
    [link, mobileLink].filter(Boolean).forEach(item => {
      item.querySelector("[data-cart-badge]").textContent = String(count);
      item.setAttribute("aria-label", `Giỏ dịch vụ: ${count} mục`);
    });
  }

  function renderCart() {
    if (typeof document === "undefined") return;
    const root = document.getElementById("cart-items");
    if (!root) return;
    const totals = getTotals();
    root.replaceChildren();
    const empty = document.getElementById("cart-empty");
    const filled = document.getElementById("cart-filled");
    if (empty) empty.hidden = totals.items.length !== 0;
    if (filled) filled.hidden = totals.items.length === 0;

    totals.items.forEach(item => {
      const row = document.createElement("article");
      row.className = "cart-item";
      row.dataset.key = item.key;
      row.innerHTML = `
        <img class="cart-item-image" alt="" loading="lazy">
        <div class="cart-item-details">
          <span class="cart-item-salon"></span><h3 class="cart-item-name"></h3>
          <p class="cart-item-duration"></p>
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
      const img = row.querySelector(".cart-item-image");
      img.src = item.image;
      img.alt = item.salonName;
      img.onerror = () => { img.onerror = null; img.src = "images/salonbook-mark.png"; };
      row.querySelector(".cart-item-salon").textContent = item.salonName;
      row.querySelector(".cart-item-name").textContent = item.serviceName;
      row.querySelector(".cart-item-duration").textContent = item.duration || "Dịch vụ tại salon";
      row.querySelector(".cart-item-price").textContent = `Đơn giá: ${formatMoney(item.price)}`;
      row.querySelector(".cart-quantity-value").textContent = String(item.quantity);
      row.querySelector(".cart-line-total").textContent = formatMoney(item.lineTotal);
      row.querySelector('[data-cart-action="decrease"]').disabled = item.quantity === 1;
      row.querySelector('[data-cart-action="increase"]').disabled = item.quantity === MAX_QUANTITY;
      root.appendChild(row);
    });
    const quantity = document.getElementById("cart-total-quantity");
    const money = document.getElementById("cart-total-money");
    if (quantity) quantity.textContent = String(totals.totalQuantity);
    if (money) money.textContent = formatMoney(totals.totalAmount);
  }

  function refresh() {
    updateBadge();
    renderCart();
    if (typeof global.dispatchEvent === "function" && typeof global.CustomEvent === "function") {
      global.dispatchEvent(new global.CustomEvent("saloncart:change", { detail: getTotals() }));
    }
  }

  function showToast(message) {
    if (typeof document === "undefined") return;
    let el = document.getElementById("cart-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "cart-toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    global.clearTimeout(showToast.timeout);
    showToast.timeout = global.setTimeout(() => el.classList.remove("is-visible"), 2200);
  }

  function onClick(event) {
    const add = event.target.closest("[data-cart-add]");
    if (add) {
      const salonId = add.dataset.salonId;
      const serviceId = add.dataset.serviceId;
      if (addToCart(salonId, serviceId)) showToast("Đã thêm dịch vụ vào giỏ!");
      else showToast("Không tìm thấy dịch vụ phù hợp.");
      return;
    }
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const row = button.closest("[data-key]");
    if (!row) return;
    const item = getCart().find(entry => entry.key === row.dataset.key);
    if (!item) return;
    if (button.dataset.cartAction === "remove") removeFromCart(item.key);
    if (button.dataset.cartAction === "increase") updateQuantity(item.key, item.quantity + 1);
    if (button.dataset.cartAction === "decrease" && item.quantity > 1) updateQuantity(item.key, item.quantity - 1);
  }

  const api = Object.freeze({
    STORAGE_KEY, MAX_QUANTITY, addToCart, updateQuantity, removeFromCart,
    renderCart, getTotals, saveCart, loadCart, getCart, formatMoney
  });
  global.SalonCart = api;
  // Tương thích cách gọi addToCart(id) từ các thành viên khác.
  if (typeof global.addToCart !== "function") global.addToCart = addToCart;
  if (typeof document !== "undefined") {
    const init = () => { loadCart(); refresh(); document.addEventListener("click", onClick); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
    global.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY) { loadCart(); refresh(); }
    });
  }
})(typeof window !== "undefined" ? window : globalThis);
