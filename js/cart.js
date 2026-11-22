
/*
 * SALONBOOK - CART.JS
 * Giỏ dịch vụ dùng chung
 *
 * - Lưu ID salon và dịch vụ
 * - Đọc tên/giá từ products.js
 * - Không tăng giảm số lượng
 * - Không gộp nhiều salon vào một booking
 * - Lưu lựa chọn của một salon để chuyển Booking
 * - Không thanh toán, không tạo Booking thật
 */

(function (window) {
  "use strict";

  const STORAGE_KEY = "cart";
  const BOOKING_KEY = "salonbook_pending_booking";

  // ==========================================
  // 1. LẤY DỮ LIỆU SALON
  // ==========================================

  function getCatalog() {
    if (typeof products !== "undefined" &&
        Array.isArray(products)) {
      return products;
    }

    if (Array.isArray(window.products)) {
      return window.products;
    }

    return [];
  }

  function getSalon(salonId) {
    return getCatalog().find(
      salon => String(salon.id) === String(salonId)
    );
  }

  function getService(salonId, serviceId) {
    const salon = getSalon(salonId);

    if (!salon || !Array.isArray(salon.servicesList)) {
      return null;
    }

    const service = salon.servicesList.find(
      item => String(item.id) === String(serviceId)
    );

    if (!service || !Number.isFinite(Number(service.price)) ||
        Number(service.price) < 0) {
      return null;
    }

    return { salon, service };
  }

  function formatMoney(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  }

  // ==========================================
  // 2. CHUẨN HÓA GIỎ HÀNG CŨ
  // ==========================================

  function normalizeCart(data) {
    if (!Array.isArray(data)) return [];

    const result = new Map();

    data.forEach(raw => {
      if (!raw || typeof raw !== "object") return;

      const salonId = Number(raw.salonId);
      const serviceId = String(raw.serviceId ?? "");

      if (!Number.isSafeInteger(salonId) ||
          salonId <= 0 || !serviceId) {
        return;
      }

      // Chỉ giữ dịch vụ có trong dữ liệu gốc
      if (!getService(salonId, serviceId)) return;

      // Một dịch vụ chỉ xuất hiện một lần
      const key = `${salonId}:${serviceId}`;

      const item = {
        key,
        salonId,
        serviceId,
        quantity: 1
      };

      // Giữ lịch dự kiến hợp lệ từ giỏ cũ
      if (raw.stylistId && raw.date && raw.time) {
        const salon = getSalon(salonId);

        const stylist = salon?.stylists?.find(
          st => String(st.id) === String(raw.stylistId)
        );

        if (stylist &&
            /^\d{4}-\d{2}-\d{2}$/.test(raw.date) &&
            /^\d{2}:\d{2}$/.test(raw.time) &&
            stylist.availableHours?.includes(raw.time)) {
          item.stylistId = String(raw.stylistId);
          item.date = raw.date;
          item.time = raw.time;
        }
      }

      // Ưu tiên dữ liệu đã có lịch khi bị trùng
      const previous = result.get(key);

      if (!previous || (!previous.date && item.date)) {
        result.set(key, item);
      }
    });

    return Array.from(result.values());
  }

  function loadCart() {
    try {
      return normalizeCart(
        JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      );
    } catch (error) {
      console.warn("Dữ liệu giỏ không hợp lệ:", error);
      return [];
    }
  }

  function getCart() {
    return loadCart().map(item => ({ ...item }));
  }

  function saveCart(items) {
    const cleaned = normalizeCart(items);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cleaned)
      );
    } catch (error) {
      console.warn("Không thể lưu giỏ:", error);
      return false;
    }

    refreshCart();

    window.dispatchEvent(new CustomEvent(
      "saloncart:change",
      { detail: getTotals() }
    ));

    return true;
  }

  // ==========================================
  // 3. THÊM DỊCH VỤ
  // ==========================================

  function addToCart(
    salonId,
    serviceId,
    quantity = 1,
    booking = null
  ) {
    const found = getService(salonId, serviceId);

    if (!found) return false;

    const items = getCart();

    const key = `${found.salon.id}:${found.service.id}`;

    const existing = items.find(item => item.key === key);

    if (existing) {
      // Dịch vụ đã tồn tại thì không nhân số lượng
      // Nhưng vẫn có thể bổ sung lịch dự kiến mới
      if (booking?.stylistId && booking.date && booking.time) {
        existing.stylistId = String(booking.stylistId);
        existing.date = booking.date;
        existing.time = booking.time;
      }
    } else {
      const item = {
        key,
        salonId: Number(found.salon.id),
        serviceId: String(found.service.id),
        quantity: 1
      };

      if (booking?.stylistId && booking.date && booking.time) {
        item.stylistId = String(booking.stylistId);
        item.date = booking.date;
        item.time = booking.time;
      }

      items.push(item);
    }

    return saveCart(items);
  }

  // ==========================================
  // 4. XÓA DỊCH VỤ
  // ==========================================

  function removeFromCart(key) {
    const items = getCart();

    const remaining = items.filter(
      item => item.key !== String(key)
    );

    if (remaining.length === items.length) {
      return false;
    }

    return saveCart(remaining);
  }

  // Hàm giữ để tương thích code cũ
  // Không cho số lượng vượt quá 1
  function updateQuantity(key, quantity) {
    if (Number(quantity) === 0) {
      return removeFromCart(key);
    }

    const exists = getCart().some(
      item => item.key === String(key)
    );

    return exists && Number(quantity) === 1;
  }

  // ==========================================
  // 5. CẬP NHẬT LỊCH DỰ KIẾN
  // ==========================================

  function updateBooking(key, selection) {
    const items = getCart();

    const item = items.find(
      entry => entry.key === String(key)
    );

    if (!item || !selection) return false;

    const targetServiceId = String(
      selection.serviceId || item.serviceId
    );

    const found = getService(
      item.salonId,
      targetServiceId
    );

    if (!found) return false;

    const stylist = found.salon.stylists?.find(
      st => String(st.id) === String(selection.stylistId)
    );

    if (!stylist ||
        !/^\d{4}-\d{2}-\d{2}$/.test(selection.date || "") ||
        !stylist.availableHours?.includes(selection.time)) {
      return false;
    }

    item.serviceId = targetServiceId;
    item.key = `${item.salonId}:${targetServiceId}`;
    item.stylistId = String(selection.stylistId);
    item.date = selection.date;
    item.time = selection.time;

    return saveCart(items);
  }

  // ==========================================
  // 6. TÍNH GIÁ TỪ PRODUCTS.JS
  // ==========================================

  function getTotals() {
    const items = getCart().map(item => {
      const found = getService(
        item.salonId,
        item.serviceId
      );

      if (!found) return null;

      const stylist = found.salon.stylists?.find(
        st => String(st.id) === String(item.stylistId)
      );

      const price = Number(found.service.price);

      return {
        ...item,
        salonName: found.salon.name,
        serviceName: found.service.name,
        image: found.salon.image,
        duration: found.service.duration,
        stylistName: stylist?.name || "",
        bookingDate: item.date || "",
        bookingTime: item.time || "",
        isComplete: Boolean(
          stylist && item.date && item.time
        ),
        price,
        lineTotal: price
      };
    }).filter(Boolean);

    return {
      items,
      distinctItems: items.length,
      totalQuantity: items.length,
      totalAmount: items.reduce(
        (sum, item) => sum + item.price,
        0
      ),
      completeBookings: items.filter(
        item => item.isComplete
      ).length
    };
  }

  // ==========================================
  // 7. NHÓM DỊCH VỤ THEO SALON
  // ==========================================

  function groupBySalon(items) {
    const groups = new Map();

    items.forEach(item => {
      const id = String(item.salonId);

      if (!groups.has(id)) {
        groups.set(id, {
          salonId: item.salonId,
          salonName: item.salonName,
          items: [],
          total: 0
        });
      }

      const group = groups.get(id);

      group.items.push(item);
      group.total += item.price;
    });

    return Array.from(groups.values());
  }

  // ==========================================
  // 8. CHUYỂN MỘT SALON SANG BOOKING
  // ==========================================

  function bookSalon(salonId) {
    const items = getTotals().items.filter(
      item => String(item.salonId) === String(salonId)
    );

    if (items.length === 0) {
      showToast("Salon này chưa có dịch vụ trong giỏ.");
      return false;
    }

    const first = items[0];

    // Chỉ lưu ID và thông tin lịch dự kiến.
    // Giá sẽ phải được đọc lại từ dữ liệu nguồn.
    const draft = {
      salonId: first.salonId,
      serviceIds: items.map(item => item.serviceId),
      selections: items.map(item => ({
        serviceId: item.serviceId,
        stylistId: item.stylistId || "",
        date: item.bookingDate || "",
        time: item.bookingTime || ""
      })),
      source: "cart",
      createdAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem(
        BOOKING_KEY,
        JSON.stringify(draft)
      );
    } catch (error) {
      showToast("Không lưu được lựa chọn Booking.");
      return false;
    }

    // Repository đang có màn chọn lịch ở trang chi tiết.
    // Chuyển sang đó để tiếp tục chọn lịch.
    // Nhóm Booking sẽ tích hợp đọc BOOKING_KEY.
    const url =
      "product-detail.html?salonId=" +
      encodeURIComponent(first.salonId) +
      "&serviceId=" +
      encodeURIComponent(first.serviceId) +
      "#booking";

    window.location.href = url;

    // Không xóa dịch vụ ở các salon khác.
    // Giỏ không tự coi là booking thành công.
    return true;
  }

  // ==========================================
  // 9. HIỂN THỊ GIỎ DỊCH VỤ
  // ==========================================

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  function renderCart() {
    const root = document.getElementById("cart-items");

    if (!root) return;

    const totals = getTotals();
    const groups = groupBySalon(totals.items);

    const empty = document.getElementById("cart-empty");
    const filled = document.getElementById("cart-filled");

    if (empty) {
      empty.hidden = totals.items.length > 0;
    }

    if (filled) {
      filled.hidden = totals.items.length === 0;
    }

    root.replaceChildren();

    groups.forEach(group => {
      const section = createElement(
        "section",
        "cart-salon-group"
      );

      const heading = createElement(
        "h3",
        "cart-salon-title",
        group.salonName
      );

      section.appendChild(heading);

      group.items.forEach(item => {
        const row = createElement(
          "article",
          "cart-service-row"
        );

        const info = createElement(
          "div",
          "cart-service-info"
        );

        const name = createElement(
          "h4",
          "",
          item.serviceName
        );

        const duration = createElement(
          "p",
          "",
          item.duration
            ? `Thời lượng: ${item.duration}`
            : "Dịch vụ tại salon"
        );

        const bookingInfo = createElement(
          "p",
          "cart-service-schedule",
          item.isComplete
            ? `Dự kiến: ${item.stylistName} · ${item.bookingDate} · ${item.bookingTime}`
            : "Chưa chọn đầy đủ lịch dự kiến"
        );

        info.append(name, duration, bookingInfo);

        const actions = createElement(
          "div",
          "cart-service-actions"
        );

        const price = createElement(
          "strong",
          "",
          formatMoney(item.price)
        );

        const remove = createElement(
          "button",
          "cart-remove",
          "Xóa dịch vụ"
        );

        remove.type = "button";
        remove.dataset.cartAction = "remove";
        remove.dataset.key = item.key;

        actions.append(price, remove);
        row.append(info, actions);
        section.appendChild(row);
      });

      const footer = createElement(
        "div",
        "cart-salon-footer"
      );

      const groupTotal = createElement(
        "strong",
        "",
        `Tổng salon: ${formatMoney(group.total)}`
      );

      const bookingButton = createElement(
        "button",
        "cart-book-salon",
        "Đặt lịch tại salon này"
      );

      bookingButton.type = "button";
      bookingButton.dataset.bookSalon = group.salonId;

      footer.append(groupTotal, bookingButton);
      section.appendChild(footer);
      root.appendChild(section);
    });

    const count = document.getElementById(
      "cart-total-quantity"
    );

    const money = document.getElementById(
      "cart-total-money"
    );

    if (count) {
      count.textContent = String(totals.totalQuantity);
    }

    if (money) {
      money.textContent = formatMoney(totals.totalAmount);
    }
  }

  // ==========================================
  // 10. CẬP NHẬT SỐ DỊCH VỤ Ở HEADER
  // ==========================================

  function updateBadge() {
    const count = getTotals().totalQuantity;

    const host = document.querySelector(".nav-actions");
    const nav = document.querySelector(".main-nav");

    if (host && !host.querySelector("[data-cart-link]")) {
      const link = createElement(
        "a",
        "cart-nav-link"
      );

      link.href = "cart.html";
      link.dataset.cartLink = "";

      link.innerHTML =
        '<svg class="cart-nav-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg> Giỏ dịch vụ <span class="cart-badge" data-cart-badge>0</span>';

      const search = host.querySelector(
        ".header-search-box"
      );

      if (search) {
        search.insertAdjacentElement("afterend", link);
      } else {
        host.appendChild(link);
      }
    }

    if (nav && !nav.querySelector("[data-cart-mobile-link]")) {
      const link = createElement(
        "a",
        "cart-mobile-link"
      );

      link.href = "cart.html";
      link.dataset.cartMobileLink = "";

      link.innerHTML =
        '<svg class="cart-nav-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg> Giỏ dịch vụ (<span data-cart-badge>0</span>)';

      nav.appendChild(link);
    }

    document.querySelectorAll("[data-cart-badge]")
      .forEach(badge => {
        badge.textContent = String(count);
      });
  }

  function refreshCart() {
    updateBadge();
    renderCart();
  }

  // ==========================================
  // 11. THÔNG BÁO
  // ==========================================

  function showToast(message) {
    let toast = document.getElementById("cart-toast");

    if (!toast) {
      toast = createElement("div");
      toast.id = "cart-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("is-visible");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2500);
  }

  // ==========================================
  // 12. NÚT ĐẶT LỊCH NGAY Ở TRANG CHI TIẾT
  // ==========================================

  function setupDirectBooking() {
    const addButton = document.getElementById(
      "add-to-cart-btn"
    );

    if (!addButton ||
        document.getElementById("direct-booking-btn")) {
      return;
    }

    const button = createElement(
      "button",
      "btn btn-yellow",
      "Đặt lịch ngay"
    );

    button.id = "direct-booking-btn";
    button.type = "button";
    button.style.cssText =
      "width:100%;margin-top:10px;padding:13px;border-radius:10px;cursor:pointer";

    addButton.insertAdjacentElement("afterend", button);

    button.addEventListener("click", () => {
      const params = new URLSearchParams(
        window.location.search
      );

      const salonId =
        params.get("salonId") ||
        params.get("id") ||
        params.get("salon") ||
        "1";

      const serviceId = document.getElementById(
        "detail-service-select"
      )?.value;

      const stylistId = document.getElementById(
        "detail-stylist-select"
      )?.value || "";

      const date = document.getElementById(
        "detail-date"
      )?.value || "";

      const selectedTime = document.querySelector(
        '.btn-time-slot[style*="255, 197, 1"]'
      );

      if (!serviceId || !getService(salonId, serviceId)) {
        showToast("Vui lòng chọn dịch vụ trước.");
        return;
      }

      const draft = {
        salonId: Number(salonId),
        serviceIds: [String(serviceId)],
        selections: [{
          serviceId: String(serviceId),
          stylistId,
          date,
          time: selectedTime?.dataset.time || ""
        }],
        source: "direct",
        createdAt: new Date().toISOString()
      };

      try {
        sessionStorage.setItem(
          BOOKING_KEY,
          JSON.stringify(draft)
        );

        showToast(
          "Đã lưu lựa chọn. Bạn có thể tiếp tục hoàn tất lịch hẹn."
        );

        // Không chuyển qua giỏ.
        // Vẫn ở giao diện chọn ngày/giờ hiện tại.
        document.getElementById("booking")
          ?.scrollIntoView({ behavior: "smooth" });

      } catch (error) {
        showToast("Không lưu được lựa chọn.");
      }
    });
  }

  // ==========================================
  // 13. XỬ LÝ NÚT BẤM
  // ==========================================

  function handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const addButton = target.closest("[data-cart-add]");

    if (addButton) {
      const saved = addToCart(
        addButton.dataset.salonId,
        addButton.dataset.serviceId
      );

      showToast(saved
        ? "Đã thêm dịch vụ vào giỏ."
        : "Không tìm thấy dịch vụ.");
      return;
    }

    const removeButton = target.closest(
      '[data-cart-action="remove"]'
    );

    if (removeButton) {
      removeFromCart(removeButton.dataset.key);
      return;
    }

    const bookingButton = target.closest(
      "[data-book-salon]"
    );

    if (bookingButton) {
      bookSalon(bookingButton.dataset.bookSalon);
    }
  }

  // ==========================================
  // 14. API DÙNG CHUNG
  // ==========================================

  const api = Object.freeze({
    STORAGE_KEY,
    BOOKING_KEY,
    getCart,
    loadCart,
    saveCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateBooking,
    getTotals,
    groupBySalon,
    bookSalon,
    renderCart,
    formatMoney
  });

  window.SalonCart = api;
  window.addToCart = addToCart;

  function init() {
    refreshCart();
    setupDirectBooking();

    document.addEventListener("click", handleClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) {
      refreshCart();
    }
  });

})(window);
