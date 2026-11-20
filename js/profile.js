
/*
 * SALONBOOK PROFILE - FIGMA v15
 * Tương thích với Auth demo của nhóm.
 *
 * Booking và lịch sử tư vấn phải được tích hợp
 * với nguồn dữ liệu chính thức.
 *
 * window.SalonBookProfileData = {
 *   getBookings: async () => [...],
 *   getConsultations: async () => [...],
 *   getNotifications: async () => [...],
 *   cancelBooking: async (id) => {...}
 * };
 *
 * Không lấy Cart làm lịch sử Booking.
 * Backend phải xác thực quyền sở hữu lịch.
 */

(() => {
  "use strict";

  const SESSION = "currentUser";
  const USERS = "salonbook_users";
  const auth = window.SalonBookAuth;

  if (!auth || !auth.requireLogin()) return;

  const current = auth.currentUser();
  if (!current) return;

  const $ = id => document.getElementById(id);
  const root = $("profile-main");
  const tabs = [...document.querySelectorAll("[data-panel]")];

  const validEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validPhone = phone =>
    /^0\d{9}$/.test(phone);

  const validName = name =>
    name.length >= 2 &&
    name.length <= 80 &&
    /^[\p{L}\s'-]+$/u.test(name);

  const money = price =>
    Number.isFinite(Number(price))
      ? new Intl.NumberFormat("vi-VN").format(Number(price)) + " ₫"
      : "Chưa có";

  const statuses = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn tất",
    cancelled: "Đã hủy"
  };

  let bookings = [];
  let consultations = [];
  let bookingLoaded = false;
  let consultationLoaded = false;
  let selectedBooking = null;

  /* THÔNG BÁO */

  function notify(message, ok = false) {
    const box = $("profile-alert");

    box.textContent = message;
    box.classList.toggle("is-success", ok);
    box.hidden = false;

    box.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function clearNotice() {
    $("profile-alert").hidden = true;
  }

  /* TÀI KHOẢN */

  function getStoredUsers() {
    try {
      const users = JSON.parse(
        localStorage.getItem(USERS) || "[]"
      );

      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  function writeAccountSession(user) {
    const session = {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    };

    localStorage.setItem(SESSION, JSON.stringify(session));

    document.dispatchEvent(
      new Event("salonbook:auth-changed")
    );
  }

  function getCurrentRecord() {
    return getStoredUsers().find(
      user => String(user.userId) === String(current.userId)
    ) || null;
  }

  /* ẢNH ĐẠI DIỆN */

  function paintAvatar(container, data, name) {
    container.replaceChildren();

    const validImage =
      typeof data === "string" &&
      /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(data);

    if (validImage) {
      const img = document.createElement("img");

      img.src = data;
      img.alt = "";

      container.append(img);
    } else {
      container.textContent =
        (name || "S").trim().charAt(0).toUpperCase();
    }
  }

  /* HIỂN THỊ THÔNG TIN NGƯỜI DÙNG */

  function drawUser() {
    const user = auth.currentUser();

    if (
      !user ||
      String(user.userId) !== String(current.userId)
    ) {
      location.replace("auth.html?returnTo=profile.html");
      return;
    }

    const record = getCurrentRecord() || user;

    $("profile-display-name").textContent = user.fullName;
    $("profile-display-role").textContent = "Khách hàng";
    $("header-user-name").textContent = user.fullName;

    paintAvatar(
      $("profile-avatar"),
      record.avatarData,
      user.fullName
    );

    paintAvatar(
      $("profile-avatar-preview"),
      record.avatarData,
      user.fullName
    );

    $("profile-fullname").value = user.fullName;
    $("profile-email").value = user.email;
    $("profile-phone").value = user.phone || "";
    $("profile-birthdate").value = record.birthDate || "";

    $("profile-gender").value =
      ["female", "male", "other", "undisclosed"].includes(
        record.gender
      ) ? record.gender : "";
  }

  /* CHUYỂN MỤC SIDEBAR */

  function openPanel(panel) {
    if (!$(`panel-${panel}`)) return;

    tabs.forEach(button => {
      const active = button.dataset.panel === panel;

      button.classList.toggle("is-active", active);

      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    document.querySelectorAll(".profile-panel")
      .forEach(element => {
        element.hidden =
          element.id !== `panel-${panel}`;
      });

    clearNotice();

    if (panel === "bookings" && !bookingLoaded) {
      loadBookings();
    }

    if (panel === "consultations" && !consultationLoaded) {
      loadConsultations();
    }

    if (panel === "notifications") {
      loadNotifications();
    }
  }

  tabs.forEach(button => {
    button.addEventListener("click", () => {
      openPanel(button.dataset.panel);
    });
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      openPanel(button.dataset.go);
    });
  });

  /* ĐĂNG XUẤT */

  $("profile-logout").addEventListener("click", () => {
    auth.logout();
  });

  /* GIỚI HẠN NGÀY SINH */

  const today = new Date();

  $("profile-birthdate").max =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  /* UPLOAD AVATAR */

  let pendingAvatar = null;

  $("profile-avatar-upload").addEventListener(
    "change",
    event => {
      const file = event.target.files?.[0];
      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
      ];

      if (
        !allowedTypes.includes(file.type) ||
        file.size > 2 * 1024 * 1024
      ) {
        notify(
          "Ảnh phải là JPG, PNG hoặc WebP và không vượt quá 2 MB."
        );

        event.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          pendingAvatar = reader.result;

          paintAvatar(
            $("profile-avatar-preview"),
            pendingAvatar,
            $("profile-fullname").value
          );
        }
      };

      reader.onerror = () => {
        notify("Không thể đọc ảnh đã chọn.");
      };

      reader.readAsDataURL(file);
    }
  );

  /* CẬP NHẬT HỒ SƠ */

  $("profile-form").addEventListener("submit", event => {
    event.preventDefault();

    const fullName = $("profile-fullname")
      .value.trim().replace(/\s+/g, " ");

    const email = $("profile-email")
      .value.trim().toLowerCase();

    const phone = $("profile-phone").value.trim();
    const birthDate = $("profile-birthdate").value;
    const gender = $("profile-gender").value;

    if (
      birthDate &&
      (
        !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) ||
        birthDate > $("profile-birthdate").max
      )
    ) {
      return notify(
        "Ngày sinh không hợp lệ hoặc nằm trong tương lai."
      );
    }

    if (
      gender &&
      !["female", "male", "other", "undisclosed"].includes(gender)
    ) {
      return notify("Giới tính không hợp lệ.");
    }

    if (!validName(fullName)) {
      return notify(
        "Họ tên phải có 2–80 ký tự, chỉ gồm chữ, " +
        "khoảng trắng, dấu nháy hoặc gạch nối."
      );
    }

    if (!validEmail(email)) {
      return notify("Vui lòng nhập email hợp lệ.");
    }

    if (!validPhone(phone)) {
      return notify(
        "Số điện thoại Việt Nam phải có 10 chữ số và bắt đầu bằng 0."
      );
    }

    const users = getStoredUsers();

    const index = users.findIndex(
      user => String(user.userId) === String(current.userId)
    );

    if (index < 0) {
      return notify(
        "Không tìm thấy tài khoản trong dữ liệu demo. " +
        "Vui lòng đăng nhập lại."
      );
    }

    if (
      users.some((user, i) =>
        i !== index && user.email === email
      )
    ) {
      return notify(
        "Email này đã được tài khoản khác sử dụng."
      );
    }

    if (
      users.some((user, i) =>
        i !== index && user.phone === phone
      )
    ) {
      return notify(
        "Số điện thoại này đã được tài khoản khác sử dụng."
      );
    }

    users[index] = {
      ...users[index],
      fullName,
      email,
      phone,
      birthDate,
      gender,
      ...(pendingAvatar
        ? { avatarData: pendingAvatar }
        : {})
    };

    try {
      localStorage.setItem(
        USERS,
        JSON.stringify(users)
      );

      writeAccountSession(users[index]);

      pendingAvatar = null;
      drawUser();

      notify(
        "Đã cập nhật hồ sơ trong bản demo trên trình duyệt này.",
        true
      );
    } catch {
      notify(
        "Không thể lưu hồ sơ trên trình duyệt."
      );
    }
  });

  /* ĐỔI MẬT KHẨU */

  async function sha256(password, salt) {
    const bytes = new TextEncoder()
      .encode(`${salt}:${password}`);

    const digest = await crypto.subtle.digest(
      "SHA-256",
      bytes
    );

    return Array.from(
      new Uint8Array(digest),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  $("password-form").addEventListener(
    "submit",
    async event => {
      event.preventDefault();

      const form = event.currentTarget;
      const fields = Object.fromEntries(
        new FormData(form)
      );

      if (
        !fields.currentPassword ||
        !fields.newPassword ||
        !fields.confirmPassword
      ) {
        return notify(
          "Vui lòng nhập đủ ba trường mật khẩu."
        );
      }

      if (fields.newPassword.length < 8) {
        return notify(
          "Mật khẩu mới phải có ít nhất 8 ký tự."
        );
      }

      if (
        fields.newPassword !== fields.confirmPassword
      ) {
        return notify(
          "Mật khẩu xác nhận không khớp."
        );
      }

      if (
        fields.currentPassword === fields.newPassword
      ) {
        return notify(
          "Mật khẩu mới phải khác mật khẩu hiện tại."
        );
      }

      const users = getStoredUsers();

      const index = users.findIndex(
        user =>
          String(user.userId) === String(current.userId)
      );

      const user = users[index];

      if (!user?.salt || !user?.passwordHash) {
        return notify(
          "Không tìm thấy thông tin mật khẩu demo."
        );
      }

      try {
        const oldHash = await sha256(
          fields.currentPassword,
          user.salt
        );

        if (oldHash !== user.passwordHash) {
          return notify(
            "Mật khẩu hiện tại không đúng."
          );
        }

        const newHash = await sha256(
          fields.newPassword,
          user.salt
        );

        users[index] = {
          ...user,
          passwordHash: newHash
        };

        localStorage.setItem(
          USERS,
          JSON.stringify(users)
        );

        form.reset();

        notify(
          "Đã đổi mật khẩu demo thành công.",
          true
        );
      } catch {
        notify(
          "Không thể cập nhật mật khẩu. " +
          "Hãy mở website qua localhost/HTTPS."
        );
      }
    }
  );

  /* NGUỒN DỮ LIỆU BOOKING */

  const dataSource = () => window.SalonBookProfileData;

  async function loadBookings() {
    const node = $("bookings-message");

    if (
      typeof dataSource()?.getBookings !== "function"
    ) {
      node.hidden = false;

      node.textContent =
        "Chưa kết nối nguồn Booking chính thức. " +
        "Lịch dự kiến trong giỏ hàng sẽ không hiển thị tại đây.";

      return;
    }

    node.hidden = false;
    node.textContent = "Đang tải lịch hẹn…";

    try {
      const result =
        await dataSource().getBookings();

      if (!Array.isArray(result)) {
        throw new Error(
          "Booking response is not an array"
        );
      }

      bookings = result.filter(item =>
        item &&
        String(item.userId ?? item.user_id) ===
          String(current.userId)
      );

      bookingLoaded = true;
      renderBookings();
    } catch (error) {
      console.warn(
        "Profile: Booking unavailable",
        error
      );

      node.textContent =
        "Không thể tải dữ liệu Booking. " +
        "Vui lòng thử lại khi hệ thống hoạt động.";
    }
  }

  /* THÔNG BÁO */

  function loadNotifications() {
    const box = $("notifications-message");
    const provider = dataSource();

    if (
      typeof provider?.getNotifications !== "function"
    ) {
      box.textContent =
        "Chưa kết nối nguồn thông báo của tài khoản.";

      box.hidden = false;
      return;
    }

    box.textContent = "Đang tải thông báo…";
    box.hidden = false;

    Promise.resolve(
      provider.getNotifications()
    ).then(data => {
      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid notifications"
        );
      }

      const mine = data.filter(item =>
        item &&
        String(item.userId ?? item.user_id) ===
          String(current.userId)
      );

      const list = $("notifications-list");
      list.replaceChildren();

      mine.forEach(item => {
        const card = make(
          "article",
          "",
          "consultation-card"
        );

        card.append(
          make("h3", item.title || "Thông báo"),
          make(
            "p",
            item.message || item.content || ""
          ),
          make(
            "small",
            item.createdAt || item.created_at || ""
          )
        );

        list.append(card);
      });

      box.hidden = mine.length > 0;

      if (!mine.length) {
        box.textContent =
          "Bạn chưa có thông báo nào.";
      }
    }).catch(() => {
      box.hidden = false;
      box.textContent =
        "Không thể tải thông báo.";
    });
  }

  /* HÀM TẠO ELEMENT AN TOÀN */

  function make(tag, text, cls) {
    const element = document.createElement(tag);

    if (cls) {
      element.className = cls;
    }

    element.textContent =
      text == null ? "—" : String(text);

    return element;
  }

  function serviceText(item) {
    const services =
      item.services ?? item.bookingServices;

    if (Array.isArray(services)) {
      return services.map(service =>
        typeof service === "string"
          ? service
          : (
              service.name ??
              service.serviceName ??
              service.service?.name ??
              "Dịch vụ"
            )
      ).join(", ") || "Chưa có";
    }

    return item.serviceName || "Chưa có";
  }

  /* DANH SÁCH BOOKING */

  function renderBookings() {
    const list = $("booking-list");
    list.replaceChildren();

    const filter =
      $("booking-status").value;

    const filtered = bookings.filter(item =>
      filter === "all" ||
      item.status === filter
    );

    $("bookings-message").hidden =
      filtered.length > 0;

    if (!filtered.length) {
      $("bookings-message").textContent =
        bookings.length
          ? "Không có lịch hẹn thuộc trạng thái này."
          : "Bạn chưa có lịch hẹn nào trong hệ thống Booking.";
    }

    filtered.forEach(item => {
      const card = make(
        "article",
        "",
        "booking-card"
      );

      const top = make(
        "div",
        "",
        "booking-top"
      );

      top.append(
        make(
          "h3",
          item.salonName ??
          item.salon?.name ??
          "Salon chưa cập nhật"
        )
      );

      top.append(
        make(
          "span",
          statuses[item.status] ||
            "Không rõ trạng thái",
          `booking-status ${item.status || ""}`
        )
      );

      const meta = make(
        "div",
        "",
        "booking-meta"
      );

      const values = [
        `Dịch vụ: ${serviceText(item)}`,
        `Chuyên viên: ${
          item.stylistName ??
          item.stylist?.name ??
          "Chưa chọn"
        }`,
        `Ngày: ${
          item.date ??
          item.bookingDate ??
          item.booking_date ??
          "—"
        }`,
        `Giờ: ${
          item.time ??
          item.startTime ??
          item.start_time ??
          "—"
        }`,
        `Giá dự kiến: ${
          money(
            item.totalPrice ??
            item.total_price
          )
        }`
      ];

      values.forEach(value => {
        meta.append(
          make("span", value)
        );
      });

      const button = make(
        "button",
        "Xem chi tiết",
        "profile-secondary"
      );

      button.type = "button";

      button.addEventListener(
        "click",
        () => openBooking(item)
      );

      card.append(top, meta, button);
      list.append(card);
    });
  }

  $("booking-status").addEventListener(
    "change",
    renderBookings
  );

  /* CHI TIẾT LỊCH HẸN */

  function openBooking(item) {
    selectedBooking = item;

    const body = $("booking-dialog-body");
    body.replaceChildren();

    const dl = document.createElement("dl");

    const rows = [
      ["Mã lịch", item.id],
      [
        "Salon",
        item.salonName ?? item.salon?.name
      ],
      [
        "Dịch vụ",
        serviceText(item)
      ],
      [
        "Chuyên viên",
        item.stylistName ??
        item.stylist?.name ??
        "Chưa chọn"
      ],
      [
        "Ngày",
        item.date ??
        item.bookingDate ??
        item.booking_date
      ],
      [
        "Giờ",
        item.time ??
        item.startTime ??
        item.start_time
      ],
      [
        "Tổng giá dự kiến",
        money(
          item.totalPrice ??
          item.total_price
        )
      ],
      [
        "Trạng thái",
        statuses[item.status] ?? "Không rõ"
      ]
    ];

    rows.forEach(([name, value]) => {
      const row = document.createElement("div");

      row.append(
        make("dt", name),
        make("dd", value)
      );

      dl.append(row);
    });

    body.append(dl);

    // Chỉ cho phép hủy khi nguồn Booking
    // xác nhận lịch này đủ điều kiện hủy.

    $("dialog-cancel-booking").hidden = !(
      ["pending", "confirmed"].includes(item.status) &&
      item.canCancel === true &&
      typeof dataSource()?.cancelBooking === "function"
    );

    $("dialog-message").textContent = "";

    $("booking-dialog").showModal();
  }

  function closeDialog() {
    $("booking-dialog").close();
  }

  $("dialog-close").addEventListener(
    "click",
    closeDialog
  );

  $("dialog-dismiss").addEventListener(
    "click",
    closeDialog
  );

  $("booking-dialog").addEventListener(
    "click",
    event => {
      if (
        event.target === $("booking-dialog")
      ) {
        closeDialog();
      }
    }
  );

  /* HỦY LỊCH */

  $("dialog-cancel-booking").addEventListener(
    "click",
    async () => {
      const booking = selectedBooking;

      if (
        !booking ||
        !["pending", "confirmed"].includes(booking.status) ||
        booking.canCancel !== true ||
        typeof dataSource()?.cancelBooking !== "function"
      ) {
        return;
      }

      if (
        !confirm(
          "Bạn chắc chắn muốn gửi yêu cầu hủy lịch này?"
        )
      ) {
        return;
      }

      const button =
        $("dialog-cancel-booking");

      button.disabled = true;

      try {
        await dataSource().cancelBooking(
          booking.id
        );

        closeDialog();

        bookingLoaded = false;

        await loadBookings();

        notify(
          "Yêu cầu hủy lịch đã được gửi. " +
          "Trạng thái mới được lấy từ hệ thống Booking.",
          true
        );
      } catch (error) {
        console.warn(error);

        $("dialog-message").textContent =
          "Không thể hủy lịch. " +
          "Vui lòng kiểm tra điều kiện hủy và thử lại.";
      } finally {
        button.disabled = false;
      }
    }
  );

  /* LỊCH SỬ TƯ VẤN */

  async function loadConsultations() {
    const box =
      $("consultations-message");

    if (
      typeof dataSource()?.getConsultations !== "function"
    ) {
      box.hidden = false;

      box.textContent =
        "Chưa kết nối lịch sử tư vấn của tài khoản. " +
        "Không có dữ liệu mẫu được tự tạo.";

      return;
    }

    box.hidden = false;
    box.textContent =
      "Đang tải lịch sử tư vấn…";

    try {
      const result =
        await dataSource().getConsultations();

      if (!Array.isArray(result)) {
        throw new Error(
          "Invalid consultation response"
        );
      }

      consultations = result.filter(item =>
        item &&
        String(item.userId ?? item.user_id) ===
          String(current.userId)
      );

      consultationLoaded = true;

      const list =
        $("consultations-list");

      list.replaceChildren();

      box.hidden =
        consultations.length > 0;

      if (!consultations.length) {
        box.textContent =
          "Bạn chưa có lịch sử tư vấn nào.";
      }

      consultations.forEach(item => {
        const card = make(
          "article",
          "",
          "consultation-card"
        );

        card.append(
          make(
            "h3",
            item.title ?? "Lần tư vấn"
          )
        );

        card.append(
          make(
            "p",
            item.summary ??
            "Chưa có tóm tắt tư vấn"
          )
        );

        card.append(
          make(
            "small",
            item.createdAt ??
            item.created_at ??
            ""
          )
        );

        list.append(card);
      });
    } catch (error) {
      console.warn(error);

      box.textContent =
        "Không thể tải lịch sử tư vấn.";
    }
  }

  /* KIỂM TRA THAY ĐỔI PHIÊN ĐĂNG NHẬP */

  window.addEventListener(
    "storage",
    event => {
      if (event.key === SESSION) {
        const user =
          auth.currentUser();

        if (
          !user ||
          String(user.userId) !==
            String(current.userId)
        ) {
          location.replace(
            "auth.html?returnTo=profile.html"
          );
        } else {
          drawUser();
        }
      }
    }
  );

  /* KHỞI TẠO */

  drawUser();
  root.hidden = false;
})();
