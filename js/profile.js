
/*
 * SALONBOOK - CUSTOMER PROFILE
 * Tương thích Auth demo của nhóm.
 *
 * Không sử dụng Cart làm lịch sử Booking.
 * Booking, thông báo và tư vấn cần nguồn dữ liệu chính thức.
 * Backend phải xác minh quyền sở hữu trước khi trả dữ liệu.
 */

(() => {
  "use strict";

  const AUTH_KEY = "currentUser";
  const USERS_KEY = "salonbook_users";
  const auth = window.SalonBookAuth;

  if (!auth || !auth.requireLogin()) return;

  const signedIn = auth.currentUser();
  if (!signedIn) return;

  const $ = id => document.getElementById(id);
  const root = $("profile-main");
  const tabs = [...document.querySelectorAll("[data-panel]")];

  const statuses = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn tất",
    cancelled: "Đã hủy"
  };

  const genders = [
    "female", "male", "other", "undisclosed"
  ];

  let bookings = [];
  let bookingLoaded = false;
  let consultationLoaded = false;
  let selectedBooking = null;
  let pendingAvatar = null;

  const dataSource = () => window.SalonBookProfileData;

  /* CÁC HÀM CHUNG */

  function create(tag, content = "", className = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;

    element.textContent =
      content == null ? "—" : String(content);

    return element;
  }

  function readUsers() {
    try {
      const data = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
      );
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function currentAccount() {
    return readUsers().find(user =>
      String(user.userId) === String(signedIn.userId)
    ) || null;
  }

  function showMessage(message, success = false) {
    const element = $("profile-alert");
    if (!element) return;

    element.textContent = message;
    element.classList.toggle("is-success", success);
    element.hidden = false;

    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function clearMessage() {
    $("profile-alert").hidden = true;
  }

  function formatMoney(value) {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) {
      return "Chưa có";
    }

    return new Intl.NumberFormat("vi-VN")
      .format(Number(value)) + " ₫";
  }

  function getUserId(item) {
    return item.userId ?? item.user_id;
  }

  function belongsToCurrentUser(item) {
    return item &&
      getUserId(item) != null &&
      String(getUserId(item)) === String(signedIn.userId);
  }

  function userStillValid() {
    const user = auth.currentUser();

    return Boolean(
      user &&
      String(user.userId) === String(signedIn.userId)
    );
  }

  /* ẢNH ĐẠI DIỆN */

  function paintAvatar(element, image, name) {
    if (!element) return;

    element.replaceChildren();

    const validImage =
      typeof image === "string" &&
      /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i
        .test(image);

    if (validImage) {
      const img = document.createElement("img");
      img.src = image;
      img.alt = "";
      element.append(img);
    } else {
      // Biểu tượng tài khoản giống Figma khi chưa có ảnh đại diện.
      element.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="3.2" fill="currentColor"/><path d="M5.6 18.4c.6-3.4 3-5.2 6.4-5.2s5.8 1.8 6.4 5.2" fill="currentColor"/></svg>`;
    }
  }

  /* HIỂN THỊ THÔNG TIN TÀI KHOẢN */

  function displayProfile() {
    if (!userStillValid()) {
      window.location.replace(
        "auth.html?returnTo=profile.html"
      );
      return;
    }

    const session = auth.currentUser();
    const record = currentAccount() || session;

    $("profile-display-name").textContent =
      session.fullName || "Khách hàng";

    $("profile-display-role").textContent = "Khách hàng";

    $("header-user-name").textContent =
      session.fullName || "Khách hàng";

    $("profile-fullname").value = session.fullName || "";
    $("profile-phone").value = session.phone || "";
    $("profile-email").value = session.email || "";

    $("profile-birthdate").value =
      record.birthDate || "";

    $("profile-gender").value =
      genders.includes(record.gender) ? record.gender : "";

    paintAvatar(
      $("profile-avatar"),
      record.avatarData,
      session.fullName
    );

    paintAvatar(
      $("profile-avatar-preview"),
      record.avatarData,
      session.fullName
    );
  }

  /* CHUYỂN TAB */

  function openPanel(name) {
    const panel = $(`panel-${name}`);
    if (!panel) return;

    tabs.forEach(button => {
      const active = button.dataset.panel === name;

      button.classList.toggle("is-active", active);

      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    document.querySelectorAll(".profile-panel")
      .forEach(section => {
        section.hidden = section !== panel;
      });

    clearMessage();

    if (name === "bookings" && !bookingLoaded) {
      loadBookings();
    }

    if (name === "notifications") {
      loadNotifications();
    }

    if (name === "consultations" && !consultationLoaded) {
      loadConsultations();
    }
  }

  tabs.forEach(button => {
    button.addEventListener("click", () => {
      openPanel(button.dataset.panel);
    });
  });

  /* ĐĂNG XUẤT */

  $("profile-logout").addEventListener("click", () => {
    auth.logout();
  });

  /* NGÀY SINH */

  function getToday() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");
  }

  $("profile-birthdate").max = getToday();

  /* CHỌN ẢNH ĐẠI DIỆN */

  $("profile-avatar-upload").addEventListener(
    "change",
    event => {
      const file = event.target.files?.[0];
      if (!file) return;

      const types = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];

      if (
        !types.includes(file.type) ||
        file.size > 2 * 1024 * 1024
      ) {
        showMessage(
          "Ảnh phải có định dạng JPG, PNG hoặc WebP " +
          "và không vượt quá 2 MB."
        );
        event.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") return;

        pendingAvatar = reader.result;

        paintAvatar(
          $("profile-avatar-preview"),
          pendingAvatar,
          $("profile-fullname").value
        );
      };

      reader.onerror = () => {
        showMessage("Không thể đọc ảnh được chọn.");
      };

      reader.readAsDataURL(file);
    }
  );

  /* VALIDATION THÔNG TIN */

  function validName(value) {
    return (
      value.length >= 2 &&
      value.length <= 80 &&
      /^[\p{L}\s'-]+$/u.test(value)
    );
  }

  function validPhone(value) {
    return /^0\d{9}$/.test(value);
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validBirthDate(value) {
    if (!value) return true;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const normalized = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");

    return normalized === value && value <= getToday();
  }

  /* LƯU HỒ SƠ */

  $("profile-form").addEventListener("submit", event => {
    event.preventDefault();

    if (!userStillValid()) {
      showMessage("Phiên đăng nhập đã thay đổi.");
      return;
    }

    const fullName = $("profile-fullname").value
      .trim().replace(/\s+/g, " ");

    const phone = $("profile-phone").value.trim();

    const email = $("profile-email").value
      .trim().toLowerCase();

    const birthDate = $("profile-birthdate").value;
    const gender = $("profile-gender").value;

    if (!validName(fullName)) {
      showMessage(
        "Họ tên phải gồm 2–80 ký tự và không chứa số " +
        "hoặc ký tự đặc biệt không hợp lệ."
      );
      return;
    }

    if (!validPhone(phone)) {
      showMessage(
        "Số điện thoại phải có 10 chữ số, bắt đầu bằng số 0."
      );
      return;
    }

    if (!validEmail(email)) {
      showMessage("Email không hợp lệ.");
      return;
    }

    if (!validBirthDate(birthDate)) {
      showMessage(
        "Ngày sinh không hợp lệ hoặc nằm trong tương lai."
      );
      return;
    }

    if (gender && !genders.includes(gender)) {
      showMessage("Giới tính không hợp lệ.");
      return;
    }

    const users = readUsers();

    const index = users.findIndex(user =>
      String(user.userId) === String(signedIn.userId)
    );

    if (index < 0) {
      showMessage(
        "Không tìm thấy tài khoản trong dữ liệu demo. " +
        "Vui lòng đăng nhập lại."
      );
      return;
    }

    const emailUsed = users.some((user, i) =>
      i !== index &&
      String(user.email || "").toLowerCase() === email
    );

    if (emailUsed) {
      showMessage(
        "Email này đã được một tài khoản khác sử dụng."
      );
      return;
    }

    const phoneUsed = users.some((user, i) =>
      i !== index && user.phone === phone
    );

    if (phoneUsed) {
      showMessage(
        "Số điện thoại này đã được một tài khoản khác sử dụng."
      );
      return;
    }

    const updated = {
      ...users[index],
      fullName,
      phone,
      email,
      birthDate,
      gender
    };

    if (pendingAvatar) {
      updated.avatarData = pendingAvatar;
    }

    const session = {
      userId: updated.userId,
      fullName: updated.fullName,
      phone: updated.phone,
      email: updated.email,
      role: updated.role
    };

    try {
      // Lưu dữ liệu account demo và phiên đăng nhập.
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([
          ...users.slice(0, index),
          updated,
          ...users.slice(index + 1)
        ])
      );

      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify(session)
      );

      pendingAvatar = null;

      // Báo cho Header cập nhật tên tài khoản.
      document.dispatchEvent(
        new Event("salonbook:auth-changed")
      );

      displayProfile();

      showMessage(
        "Đã cập nhật hồ sơ trong bản demo trên trình duyệt này.",
        true
      );
    } catch (error) {
      console.warn(error);
      showMessage(
        "Không thể lưu hồ sơ. Hãy thử dùng ảnh nhỏ hơn " +
        "hoặc kiểm tra dung lượng lưu trữ của trình duyệt."
      );
    }
  });

  /* MẬT KHẨU DEMO */

  async function hashPassword(password, salt) {
    const input = new TextEncoder()
      .encode(`${salt}:${password}`);

    const result = await crypto.subtle.digest(
      "SHA-256",
      input
    );

    return Array.from(
      new Uint8Array(result),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  $("password-form").addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      if (!userStillValid()) {
        showMessage("Phiên đăng nhập đã thay đổi.");
        return;
      }

      const form = event.currentTarget;
      const values = Object.fromEntries(new FormData(form));

      const oldPassword = values.currentPassword;
      const newPassword = values.newPassword;
      const confirmPassword = values.confirmPassword;

      if (
        !oldPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        showMessage("Vui lòng nhập đủ ba trường mật khẩu.");
        return;
      }

      if (newPassword.length < 8) {
        showMessage(
          "Mật khẩu mới phải có ít nhất 8 ký tự."
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        showMessage(
          "Mật khẩu xác nhận không khớp."
        );
        return;
      }

      if (newPassword === oldPassword) {
        showMessage(
          "Mật khẩu mới phải khác mật khẩu hiện tại."
        );
        return;
      }

      const users = readUsers();

      const index = users.findIndex(user =>
        String(user.userId) === String(signedIn.userId)
      );

      if (index < 0) {
        showMessage("Không tìm thấy tài khoản.");
        return;
      }

      const user = users[index];

      if (!user.salt || !user.passwordHash) {
        showMessage(
          "Không có thông tin mật khẩu demo của tài khoản."
        );
        return;
      }

      try {
        const oldHash = await hashPassword(
          oldPassword, user.salt
        );

        if (oldHash !== user.passwordHash) {
          showMessage("Mật khẩu hiện tại không chính xác.");
          return;
        }

        const newHash = await hashPassword(
          newPassword, user.salt
        );

        users[index] = {
          ...user,
          passwordHash: newHash
        };

        localStorage.setItem(
          USERS_KEY,
          JSON.stringify(users)
        );

        form.reset();

        showMessage(
          "Đã thay đổi mật khẩu demo thành công.",
          true
        );
      } catch (error) {
        console.warn(error);
        showMessage(
          "Không thể đổi mật khẩu. Hãy chạy website " +
          "bằng localhost hoặc HTTPS."
        );
      }
    }
  );

  /* HIỂN THỊ DỊCH VỤ */

  function serviceText(booking) {
    const services =
      booking.services ?? booking.bookingServices;

    if (!Array.isArray(services)) {
      return booking.serviceName || "Chưa có";
    }

    const names = services.map(service => {
      if (typeof service === "string") return service;

      return (
        service.name ??
        service.serviceName ??
        service.service?.name ??
        "Dịch vụ"
      );
    });

    return names.join(", ") || "Chưa có";
  }

  /* LOAD BOOKING */

  async function loadBookings() {
    const box = $("bookings-message");
    const provider = dataSource();

    if (typeof provider?.getBookings !== "function") {
      box.hidden = false;
      box.textContent =
        "Chưa kết nối nguồn Booking chính thức. " +
        "Các dịch vụ đang nằm trong Cart không được tính là lịch hẹn.";
      return;
    }

    box.hidden = false;
    box.textContent = "Đang tải lịch hẹn…";

    try {
      const data = await provider.getBookings();

      if (!Array.isArray(data)) {
        throw new Error("Booking data không hợp lệ.");
      }

      bookings = data.filter(belongsToCurrentUser);
      bookingLoaded = true;

      renderBookings();
    } catch (error) {
      console.warn(error);
      box.textContent =
        "Không thể tải lịch hẹn từ hệ thống Booking.";
    }
  }

  /* HIỂN THỊ BOOKING */

  function renderBookings() {
    const list = $("booking-list");
    const box = $("bookings-message");

    list.replaceChildren();

    const status = $("booking-status").value;

    const filtered = bookings.filter(booking =>
      status === "all" || booking.status === status
    );

    box.hidden = filtered.length > 0;

    if (!filtered.length) {
      box.textContent = bookings.length
        ? "Không có lịch hẹn thuộc trạng thái này."
        : "Bạn chưa có lịch hẹn trong hệ thống Booking.";
    }

    filtered.forEach(booking => {
      const card = create("article", "", "booking-card");
      const top = create("div", "", "booking-top");

      const salonName =
        booking.salonName ??
        booking.salon?.name ??
        "Salon chưa cập nhật";

      top.append(
        create("h3", salonName),
        create(
          "span",
          statuses[booking.status] || "Không rõ trạng thái",
          `booking-status ${booking.status || ""}`
        )
      );

      const meta = create("div", "", "booking-meta");

      const rows = [
        `Dịch vụ: ${serviceText(booking)}`,
        `Chuyên viên: ${
          booking.stylistName ??
          booking.stylist?.name ??
          "Chưa chọn"
        }`,
        `Ngày: ${
          booking.date ??
          booking.bookingDate ??
          booking.booking_date ??
          "—"
        }`,
        `Giờ: ${
          booking.time ??
          booking.startTime ??
          booking.start_time ??
          "—"
        }`,
        `Giá dự kiến: ${
          formatMoney(
            booking.totalPrice ?? booking.total_price
          )
        }`
      ];

      rows.forEach(row => {
        meta.append(create("span", row));
      });

      const detailButton = create(
        "button",
        "Xem chi tiết",
        "profile-secondary"
      );

      detailButton.type = "button";
      detailButton.addEventListener("click", () => {
        openBooking(booking);
      });

      card.append(top, meta, detailButton);
      list.append(card);
    });
  }

  $("booking-status").addEventListener(
    "change",
    renderBookings
  );

  /* CHI TIẾT BOOKING */

  function openBooking(booking) {
    selectedBooking = booking;

    const content = $("booking-dialog-body");
    content.replaceChildren();

    const rows = [
      ["Mã lịch", booking.id],
      [
        "Salon",
        booking.salonName ?? booking.salon?.name
      ],
      ["Dịch vụ", serviceText(booking)],
      [
        "Chuyên viên",
        booking.stylistName ??
        booking.stylist?.name ??
        "Chưa chọn"
      ],
      [
        "Ngày",
        booking.date ??
        booking.bookingDate ??
        booking.booking_date
      ],
      [
        "Giờ",
        booking.time ??
        booking.startTime ??
        booking.start_time
      ],
      [
        "Tổng giá dự kiến",
        formatMoney(
          booking.totalPrice ?? booking.total_price
        )
      ],
      [
        "Trạng thái",
        statuses[booking.status] ?? "Không rõ"
      ]
    ];

    const dl = document.createElement("dl");

    rows.forEach(([title, value]) => {
      const row = document.createElement("div");

      row.append(
        create("dt", title),
        create("dd", value)
      );

      dl.append(row);
    });

    content.append(dl);

    // Booking đã hoàn tất/đã hủy không được hủy.
    // Chỉ bật nút khi chính nguồn Booking cho phép.
    const canCancel =
      ["pending", "confirmed"].includes(booking.status) &&
      booking.canCancel === true &&
      typeof dataSource()?.cancelBooking === "function";

    $("dialog-cancel-booking").hidden = !canCancel;
    $("dialog-message").textContent = "";

    $("booking-dialog").showModal();
  }

  function closeBooking() {
    $("booking-dialog").close();
    selectedBooking = null;
  }

  $("dialog-close").addEventListener(
    "click",
    closeBooking
  );

  $("dialog-dismiss").addEventListener(
    "click",
    closeBooking
  );

  $("booking-dialog").addEventListener("click", event => {
    if (event.target === $("booking-dialog")) {
      closeBooking();
    }
  });

  /* HỦY LỊCH */

  $("dialog-cancel-booking").addEventListener(
    "click",
    async () => {
      const booking = selectedBooking;

      if (
        !booking ||
        !belongsToCurrentUser(booking) ||
        !["pending", "confirmed"].includes(booking.status) ||
        booking.canCancel !== true ||
        typeof dataSource()?.cancelBooking !== "function"
      ) {
        return;
      }

      const agreed = confirm(
        "Bạn có chắc chắn muốn yêu cầu hủy lịch này?"
      );

      if (!agreed) return;

      const button = $("dialog-cancel-booking");
      button.disabled = true;

      try {
        await dataSource().cancelBooking(booking.id);

        closeBooking();
        bookingLoaded = false;
        await loadBookings();

        showMessage(
          "Đã gửi yêu cầu hủy lịch. " +
          "Trạng thái mới được cập nhật từ Booking.",
          true
        );
      } catch (error) {
        console.warn(error);

        $("dialog-message").textContent =
          "Không thể hủy lịch. Vui lòng kiểm tra " +
          "điều kiện hủy hoặc thử lại.";
      } finally {
        button.disabled = false;
      }
    }
  );

  /* THÔNG BÁO */

  async function loadNotifications() {
    const box = $("notifications-message");
    const list = $("notifications-list");
    const provider = dataSource();

    list.replaceChildren();

    if (typeof provider?.getNotifications !== "function") {
      box.hidden = false;
      box.textContent =
        "Chưa kết nối nguồn thông báo của tài khoản.";
      return;
    }

    box.hidden = false;
    box.textContent = "Đang tải thông báo…";

    try {
      const data = await provider.getNotifications();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu thông báo không hợp lệ.");
      }

      const mine = data.filter(belongsToCurrentUser);

      mine.forEach(item => {
        const card = create(
          "article", "", "consultation-card"
        );

        card.append(
          create("h3", item.title || "Thông báo"),
          create("p", item.message || item.content || ""),
          create(
            "small",
            item.createdAt || item.created_at || ""
          )
        );

        list.append(card);
      });

      box.hidden = mine.length > 0;

      if (!mine.length) {
        box.textContent = "Bạn chưa có thông báo.";
      }
    } catch (error) {
      console.warn(error);
      box.textContent = "Không thể tải thông báo.";
    }
  }

  /* LỊCH SỬ TƯ VẤN */

  async function loadConsultations() {
    const box = $("consultations-message");
    const list = $("consultations-list");
    const provider = dataSource();

    list.replaceChildren();

    if (typeof provider?.getConsultations !== "function") {
      box.hidden = false;
      box.textContent =
        "Chưa kết nối nguồn lịch sử tư vấn. " +
        "Không sử dụng dữ liệu giả.";
      return;
    }

    box.hidden = false;
    box.textContent = "Đang tải lịch sử tư vấn…";

    try {
      const data = await provider.getConsultations();

      if (!Array.isArray(data)) {
        throw new Error("Lịch sử tư vấn không hợp lệ.");
      }

      const mine = data.filter(belongsToCurrentUser);
      consultationLoaded = true;

      mine.forEach(item => {
        const card = create(
          "article", "", "consultation-card"
        );

        card.append(
          create("h3", item.title || "Lần tư vấn"),
          create(
            "p",
            item.summary || "Chưa có tóm tắt tư vấn"
          ),
          create(
            "small",
            item.createdAt || item.created_at || ""
          )
        );

        list.append(card);
      });

      box.hidden = mine.length > 0;

      if (!mine.length) {
        box.textContent = "Bạn chưa có lịch sử tư vấn.";
      }
    } catch (error) {
      console.warn(error);
      box.textContent = "Không thể tải lịch sử tư vấn.";
    }
  }

  /* THEO DÕI PHIÊN ĐĂNG NHẬP */

  window.addEventListener("storage", event => {
    if (event.key !== AUTH_KEY) return;

    if (!userStillValid()) {
      window.location.replace(
        "auth.html?returnTo=profile.html"
      );
      return;
    }

    displayProfile();
  });

  /* KHỞI TẠO */

  displayProfile();
  openPanel("personal");
  root.hidden = false;
})();
