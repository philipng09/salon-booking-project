
/*
 * SALONBOOK - BOOKING BRIDGE
 *
 * Kết nối:
 * product-detail.js ↔ cart.js ↔ auth.js
 *
 * Không ghi Booking thật.
 * Không thay đổi dữ liệu salon.
 * Không ghi nhận thanh toán.
 */

(function () {
  "use strict";

  const BOOKING_KEY = "salonbook_pending_booking";

  function byId(id) {
    return document.getElementById(id);
  }

  function notify(message, error = false) {
    const notice = byId("booking-bridge-notice");

    if (!notice) {
      alert(message);
      return;
    }

    notice.hidden = false;
    notice.textContent = message;
    notice.classList.toggle("error", error);
  }

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

  function getSalon() {
    const params = new URLSearchParams(
      window.location.search
    );

    const id =
      params.get("salonId") ||
      params.get("id") ||
      params.get("salon") ||
      "1";

    return getCatalog().find(salon =>
      String(salon.id) === String(id) ||
      String(salon.slug) === String(id)
    );
  }

  function findService(salon, id) {
    if (!salon) return null;

    return (salon.servicesList || []).find(service =>
      String(service.id) === String(id) ||
      String(service.value) === String(id)
    );
  }

  function findStylist(salon, id) {
    if (!salon) return null;

    return (salon.stylists || []).find(stylist =>
      String(stylist.id) === String(id)
    );
  }

  function todayLocal() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Đọc bản nháp Booking
  function getDraft() {
    try {
      const raw = sessionStorage.getItem(
        BOOKING_KEY
      );

      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(
        "Không đọc được bản nháp Booking:",
        error
      );
      return null;
    }
  }

  // Lưu bản nháp Booking
  function saveDraft(draft) {
    try {
      sessionStorage.setItem(
        BOOKING_KEY,
        JSON.stringify(draft)
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Lấy khung giờ đang được chọn
  function getSelectedTime() {
    const buttons = document.querySelectorAll(
      "#detail-time-grid .btn-time-slot"
    );

    for (const button of buttons) {
      const background = button.style.backgroundColor;

      if (
        background === "rgb(255, 197, 1)" ||
        background === "#ffc501" ||
        button.getAttribute("aria-pressed") === "true"
      ) {
        return button.dataset.time || "";
      }
    }

    return "";
  }

  // Lấy lựa chọn từ form
  function getSelection() {
    const salon = getSalon();

    if (!salon) return null;

    const serviceId = byId(
      "detail-service-select"
    )?.value || "";

    const stylistId = byId(
      "detail-stylist-select"
    )?.value || "";

    const date = byId("detail-date")?.value || "";

    return {
      salonId: salon.id,
      serviceId,
      stylistId,
      date,
      time: getSelectedTime()
    };
  }

  // Kiểm tra dữ liệu lịch dự kiến
  function validSchedule(salon, selection) {
    if (!selection.stylistId ||
        !selection.date ||
        !selection.time) {
      return false;
    }

    const stylist = findStylist(
      salon,
      selection.stylistId
    );

    if (!stylist) return false;

    if (selection.date < todayLocal()) {
      return false;
    }

    if (
      !Array.isArray(stylist.availableHours) ||
      !stylist.availableHours.includes(
        selection.time
      )
    ) {
      return false;
    }

    const start = new Date(
      `${selection.date}T${selection.time}:00`
    );

    return !Number.isNaN(start.getTime()) &&
      start.getTime() > Date.now();
  }

  // Chọn một giá trị rồi phát sự kiện change
  // để product-detail.js cập nhật bảng tóm tắt
  function changeSelect(element, value) {
    if (!element) return false;

    const exists = Array.from(
      element.options
    ).some(option =>
      option.value === String(value)
    );

    if (!exists) return false;

    element.value = String(value);

    element.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    return true;
  }

  // Khôi phục một lựa chọn từ bản nháp
  function restoreSelection(salon, selection) {
    if (!selection) return;

    const service = findService(
      salon,
      selection.serviceId
    );

    if (service) {
      changeSelect(
        byId("detail-service-select"),
        service.id
      );
    }

    const stylist = findStylist(
      salon,
      selection.stylistId
    );

    if (stylist) {
      changeSelect(
        byId("detail-stylist-select"),
        stylist.id
      );
    }

    if (
      selection.date &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        selection.date
      ) &&
      selection.date >= todayLocal()
    ) {
      const dateInput = byId("detail-date");

      if (dateInput) {
        dateInput.value = selection.date;

        dateInput.dispatchEvent(
          new Event("change", {
            bubbles: true
          })
        );
      }
    }

    // Chỉ khôi phục giờ còn hợp lệ
    if (
      validSchedule(salon, selection)
    ) {
      const timeButtons = document.querySelectorAll(
        "#detail-time-grid .btn-time-slot"
      );

      const matching = Array.from(
        timeButtons
      ).find(button =>
        button.dataset.time === selection.time
      );

      if (matching && !matching.disabled) {
        matching.click();
      }
    }
  }

  // Hiển thị số dịch vụ từ giỏ
  function displayDraftInfo(salon, draft) {
    const info = byId("booking-draft-info");

    if (!info) return;

    const serviceIds = Array.isArray(
      draft.serviceIds
    ) ? draft.serviceIds : [];

    const services = serviceIds
      .map(id => findService(salon, id))
      .filter(Boolean);

    if (!services.length) {
      info.hidden = true;
      return;
    }

    const total = services.reduce(
      (sum, service) =>
        sum + Number(service.price || 0),
      0
    );

    const formatted = new Intl.NumberFormat(
      "vi-VN"
    ).format(total);

    info.hidden = false;

    // textContent tránh chèn HTML từ dữ liệu
    info.textContent =
      `Đã chuyển ${services.length} dịch vụ ` +
      `của ${salon.name} từ giỏ. ` +
      `Tổng giá dự kiến: ${formatted} ₫. ` +
      `Bạn đang xem lựa chọn đầu tiên; ` +
      `danh sách đầy đủ được giữ trong bản nháp Booking.`;
  }

  // Đọc lại Booking khi trở về từ giỏ/Auth
  function restoreDraft(salon) {
    const draft = getDraft();

    if (!draft) return;

    // Không áp dụng dữ liệu của salon khác
    if (
      String(draft.salonId) !==
      String(salon.id)
    ) {
      return;
    }

    if (
      !Array.isArray(draft.selections) ||
      draft.selections.length === 0
    ) {
      return;
    }

    const params = new URLSearchParams(
      window.location.search
    );

    const urlServiceId = params.get(
      "serviceId"
    );

    const selected =
      draft.selections.find(item =>
        String(item.serviceId) ===
        String(urlServiceId)
      ) || draft.selections[0];

    restoreSelection(salon, selected);

    if (draft.source === "cart") {
      displayDraftInfo(salon, draft);
    }

    if (draft.source === "direct") {
      notify(
        "Lựa chọn đặt lịch đã được khôi phục. " +
        "Vui lòng kiểm tra và tiếp tục khi " +
        "nhóm tích hợp màn hình xác nhận Booking."
      );
    }
  }

  // =====================================
  // THÊM VÀO GIỎ
  // Không bắt buộc chọn thợ/ngày/giờ
  // =====================================

  function handleAddCart() {
    const salon = getSalon();
    const selection = getSelection();

    if (!salon || !selection) {
      notify(
        "Không tìm thấy thông tin salon.",
        true
      );
      return;
    }

    const service = findService(
      salon,
      selection.serviceId
    );

    if (!service) {
      notify(
        "Vui lòng chọn dịch vụ trước.",
        true
      );
      return;
    }

    if (!window.SalonCart) {
      notify(
        "Giỏ dịch vụ chưa sẵn sàng.",
        true
      );
      return;
    }

    // Chỉ lưu lịch khi đã chọn đầy đủ,
    // đúng thời gian và stylist của salon.
    const booking = validSchedule(
      salon,
      selection
    ) ? {
      stylistId: selection.stylistId,
      date: selection.date,
      time: selection.time
    } : null;

    const saved = window.SalonCart.addToCart(
      salon.id,
      service.id,
      1,
      booking
    );

    notify(
      saved
        ? "Đã thêm dịch vụ vào giỏ! " +
          "Bạn có thể chọn lịch sau."
        : "Không thể lưu dịch vụ vào giỏ.",
      !saved
    );
  }

  // =====================================
  // ĐẶT LỊCH NGAY
  // Lưu bản nháp, không qua giỏ
  // =====================================

  function handleDirectBooking() {
    const salon = getSalon();
    const selection = getSelection();

    if (!salon || !selection) {
      notify(
        "Không tìm thấy thông tin salon.",
        true
      );
      return;
    }

    const service = findService(
      salon,
      selection.serviceId
    );

    if (!service) {
      notify(
        "Vui lòng chọn dịch vụ.",
        true
      );
      return;
    }

    if (!selection.stylistId) {
      notify(
        "Vui lòng chọn chuyên viên.",
        true
      );
      return;
    }

    if (!selection.date) {
      notify(
        "Vui lòng chọn ngày dự kiến.",
        true
      );
      return;
    }

    if (!selection.time) {
      notify(
        "Vui lòng chọn khung giờ.",
        true
      );
      return;
    }

    if (!validSchedule(salon, selection)) {
      notify(
        "Khung giờ không hợp lệ hoặc đã qua. " +
        "Vui lòng chọn lại.",
        true
      );
      return;
    }

    const existing = getDraft();

    // Nếu khách đi từ giỏ của cùng salon,
    // giữ danh sách nhiều dịch vụ đã chọn.
    const sameCartDraft =
      existing &&
      existing.source === "cart" &&
      String(existing.salonId) ===
      String(salon.id) &&
      Array.isArray(existing.serviceIds) &&
      existing.serviceIds.some(id =>
        String(id) === String(service.id)
      );

    let serviceIds = [String(service.id)];
    let selections = [{
      serviceId: String(service.id),
      stylistId: selection.stylistId,
      date: selection.date,
      time: selection.time
    }];

    if (sameCartDraft) {
      serviceIds = existing.serviceIds.filter(id =>
        Boolean(findService(salon, id))
      );

      selections = serviceIds.map(id => {
        if (String(id) === String(service.id)) {
          return {
            serviceId: String(id),
            stylistId: selection.stylistId,
            date: selection.date,
            time: selection.time
          };
        }

        return (existing.selections || [])
          .find(item =>
            String(item.serviceId) ===
            String(id)
          ) || {
            serviceId: String(id),
            stylistId: "",
            date: "",
            time: ""
          };
      });
    }

    const draft = {
      salonId: salon.id,
      serviceIds,
      selections,
      source: sameCartDraft ? "cart" : "direct",
      createdAt: new Date().toISOString()
    };

    if (!saveDraft(draft)) {
      notify(
        "Không lưu được bản nháp Booking.",
        true
      );
      return;
    }

    // Yêu cầu đăng nhập trước Booking
    if (
      window.SalonBookAuth &&
      !window.SalonBookAuth.currentUser()
    ) {
      notify(
        "Vui lòng đăng nhập để tiếp tục đặt lịch."
      );

      window.SalonBookAuth.requireLogin();
      return;
    }

    // Chưa có màn xác nhận Booking được tích hợp.
    // Không thông báo đặt lịch thành công giả.
    notify(
      "Đã lưu lựa chọn đặt lịch cho " +
      salon.name +
      ". Đây là bản nháp, chưa phải lịch hẹn " +
      "đã xác nhận. Cần tích hợp bước xác nhận Booking."
    );
  }

  // =====================================
  // KHỞI TẠO
  // =====================================

  function init() {
    const salon = getSalon();

    if (!salon) return;

    const addButton = byId(
      "add-to-cart-btn"
    );

    if (!addButton) return;

    // cart.js đã tạo nút này.
    // Nếu không có thì tạo mới.
    let directButton = byId(
      "direct-booking-btn"
    );

    if (!directButton) {
      directButton = document.createElement(
        "button"
      );

      directButton.id = "direct-booking-btn";
      directButton.type = "button";
      directButton.className = "btn btn-yellow";

      directButton.textContent =
        "Đặt lịch ngay";

      directButton.style.cssText =
        "width:100%;margin-top:10px;padding:13px;border-radius:10px;cursor:pointer";

      addButton.insertAdjacentElement(
        "afterend",
        directButton
      );
    }

    // Đảm bảo dữ liệu trang chi tiết đã render
    restoreDraft(salon);
  }

  // Chặn các xử lý click cũ của hai nút.
  // Event capture chạy trước listener ở button.
  // Nhờ đó không bị thêm giỏ hai lần.
  document.addEventListener(
    "click",
    function (event) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const addButton = target.closest(
        "#add-to-cart-btn"
      );

      const directButton = target.closest(
        "#direct-booking-btn"
      );

      if (!addButton && !directButton) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (addButton) {
        handleAddCart();
      } else {
        handleDirectBooking();
      }
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
