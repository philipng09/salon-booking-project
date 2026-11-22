
/*
  SALONBOOK AUTH
  Đăng ký, đăng nhập, đăng xuất và phân quyền.
  DEMO FRONTEND - KHÔNG PHẢI BẢO MẬT THẬT.
*/

(function () {
  "use strict";

  const USERS_KEY = "salonbook_users";
  const CURRENT_KEY = "currentUser";
  const RETURN_KEY = "salonbook_auth_return";

  const DEMO_EMAIL = "owner@salonbook.demo";
  const DEMO_PASSWORD = "Salon@123";

  // =========================
  // LOCAL STORAGE
  // =========================

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function users() {
    const data = read(USERS_KEY, []);
    return Array.isArray(data) ? data : [];
  }

  function saveUsers(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  // Chỉ là checksum mô phỏng, không an toàn.
  function hashDemo(value) {
    let result = 2166136261;

    for (let i = 0; i < value.length; i++) {
      result ^= value.charCodeAt(i);
      result = Math.imul(result, 16777619);
    }

    return (result >>> 0).toString(16);
  }

  // =========================
  // TÀI KHOẢN CHỦ SALON DEMO
  // =========================

  function seedOwner() {
    const list = users();

    const index = list.findIndex(user =>
      String(user.email || "").toLowerCase() === DEMO_EMAIL
    );

    const demo = {
      id: "salon-owner-demo-1",
      userId: "salon-owner-demo-1",
      fullName: "Chủ Salon Demo",
      email: DEMO_EMAIL,
      phone: "0900000000",
      role: "salon_owner",
      passwordDemoHash: hashDemo(DEMO_PASSWORD)
    };

    if (index === -1) {
      list.push(demo);
      saveUsers(list);
    } else if (list[index].id === demo.id) {
      list[index] = demo;
      saveUsers(list);
    }
  }

  function publicUser(user) {
    const id = user.id || user.userId;

    return {
      id: id,
      userId: id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
  }

  function currentUser() {
    const user = read(CURRENT_KEY, null);

    if (
      user &&
      (user.id || user.userId) &&
      ["customer", "salon_owner"].includes(user.role)
    ) {
      return user;
    }

    return null;
  }

  // =========================
  // VALIDATE
  // =========================

  function emailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function phoneValid(value) {
    return /^0[35789]\d{8}$/.test(value);
  }

  function validateRegistration(input) {
    const errors = {};

    if (!input.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên.";
    }

    if (!input.email) {
      errors.email = "Vui lòng nhập email.";
    } else if (!emailValid(input.email)) {
      errors.email = "Email không đúng định dạng.";
    }

    if (!input.phone) {
      errors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!phoneValid(input.phone)) {
      errors.phone =
        "Số điện thoại cần có 10 chữ số và đầu số hợp lệ.";
    }

    if (!input.password) {
      errors.password = "Vui lòng nhập mật khẩu.";
    } else if (
      input.password.length < 8 ||
      !/[A-Za-z]/.test(input.password) ||
      !/\d/.test(input.password)
    ) {
      errors.password =
        "Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.";
    }

    if (!input.confirmPassword) {
      errors.confirmPassword =
        "Vui lòng xác nhận mật khẩu.";
    } else if (
      input.password !== input.confirmPassword
    ) {
      errors.confirmPassword =
        "Mật khẩu xác nhận không khớp.";
    }

    return errors;
  }

  // =========================
  // ĐĂNG KÝ
  // =========================

  function register(data) {
    const input = {
      fullName: String(data.fullName || "").trim(),
      email: String(data.email || "").trim().toLowerCase(),
      phone: String(data.phone || "").trim(),
      password: String(data.password || ""),
      confirmPassword: String(data.confirmPassword || "")
    };

    const errors = validateRegistration(input);

    if (Object.keys(errors).length) {
      return { ok: false, errors };
    }

    const list = users();

    if (
      list.some(user =>
        String(user.email).toLowerCase() === input.email
      )
    ) {
      return {
        ok: false,
        errors: {
          email: "Email này đã được đăng ký."
        }
      };
    }

    const id =
      window.crypto?.randomUUID?.() ||
      `customer-${Date.now()}`;

    const user = {
      id: id,
      userId: id,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      role: "customer",
      passwordDemoHash: hashDemo(input.password)
    };

    list.push(user);
    saveUsers(list);

    localStorage.setItem(
      CURRENT_KEY,
      JSON.stringify(publicUser(user))
    );

    window.dispatchEvent(
      new Event("salonbook:auth-changed")
    );

    return {
      ok: true,
      user: publicUser(user)
    };
  }

  // =========================
  // ĐĂNG NHẬP
  // =========================

  function login(email, password, selectedRole = "customer") {
    const normalized = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalized || !password) {
      return {
        ok: false,
        error: "Vui lòng nhập đầy đủ email và mật khẩu."
      };
    }

    if (!emailValid(normalized)) {
      return {
        ok: false,
        error: "Email không đúng định dạng."
      };
    }

    if (
      !["customer", "salon_owner"].includes(selectedRole)
    ) {
      return {
        ok: false,
        error: "Vai trò đăng nhập không hợp lệ."
      };
    }

    seedOwner();

    const user = users().find(item =>
      String(item.email).toLowerCase() === normalized
    );

    if (
      !user ||
      user.passwordDemoHash !== hashDemo(password)
    ) {
      return {
        ok: false,
        error: "Email hoặc mật khẩu không đúng."
      };
    }

    // Kiểm tra quyền đăng nhập
    if (user.role !== selectedRole) {
      return {
        ok: false,
        error:
          selectedRole === "salon_owner"
            ? "Tài khoản này không có quyền Chủ Salon. Vui lòng chọn Khách hàng."
            : "Đây là tài khoản Chủ Salon. Vui lòng chọn chế độ Chủ Salon."
      };
    }

    const session = publicUser(user);

    localStorage.setItem(
      CURRENT_KEY,
      JSON.stringify(session)
    );

    window.dispatchEvent(
      new Event("salonbook:auth-changed")
    );

    return {
      ok: true,
      user: session
    };
  }

  // =========================
  // ĐĂNG XUẤT
  // =========================

  function logout() {
    localStorage.removeItem(CURRENT_KEY);
    sessionStorage.removeItem(RETURN_KEY);

    window.dispatchEvent(
      new Event("salonbook:auth-changed")
    );

    if (
      location.pathname.endsWith("/salon-owner.html")
    ) {
      location.assign("index.html");
    }
  }

  // =========================
  // ĐIỀU HƯỚNG
  // =========================

  function safeReturn(value) {
    if (
      !value ||
      /[\\\r\n]/.test(value) ||
      value.startsWith("//")
    ) {
      return null;
    }

    try {
      const url = new URL(value, location.href);

      if (
        url.origin !== location.origin ||
        /\/(auth|salon-owner)\.html$/.test(url.pathname)
      ) {
        return null;
      }

      return url.href;
    } catch {
      return null;
    }
  }

  function requireLogin() {
    const user = currentUser();

    if (user?.role === "customer") {
      return true;
    }

    if (user?.role === "salon_owner") {
      alert(
        "Chỉ tài khoản Khách hàng mới có thể xác nhận đặt lịch."
      );
      return false;
    }

    sessionStorage.setItem(
      RETURN_KEY,
      location.href
    );

    const returnPath =
      location.pathname.split("/").pop() +
      location.search +
      location.hash;

    location.assign(
      "auth.html?next=" + encodeURIComponent(returnPath)
    );

    return false;
  }

  function navigateAfterLogin(user) {
    if (user.role === "salon_owner") {
      sessionStorage.removeItem(RETURN_KEY);

      location.assign("salon-owner.html");
      return;
    }

    const query = new URLSearchParams(
      location.search
    ).get("next");

    const target =
      safeReturn(sessionStorage.getItem(RETURN_KEY)) ||
      safeReturn(query);

    sessionStorage.removeItem(RETURN_KEY);

    location.assign(target || "index.html");
  }

  // =========================
  // HEADER
  // =========================

  function renderHeader() {
    const user = currentUser();

    document
      .querySelectorAll("#auth-action-container")
      .forEach(holder => {

        holder.replaceChildren();

        if (!user) {
          const link = document.createElement("a");

          link.href = "auth.html";
          link.className = "btn btn-yellow btn-top";
          link.textContent = "Đăng ký/Đăng nhập";

          holder.append(link);
          return;
        }

        const row = document.createElement("div");
        row.className = "auth-header-actions";

        const name = document.createElement("span");
        name.className = "auth-user-name";
        name.textContent = user.fullName;
        row.append(name);

        if (user.role === "salon_owner") {
          const link = document.createElement("a");

          link.href = "salon-owner.html";
          link.className = "auth-owner-link";
          link.textContent = "Quản lý Salon";

          row.append(link);
        }

        const button = document.createElement("button");

        button.type = "button";
        button.className = "auth-logout";
        button.textContent = "Đăng xuất";

        button.addEventListener("click", logout);

        row.append(button);
        holder.append(row);
      });
  }

  // =========================
  // HIỂN THỊ THÔNG BÁO
  // =========================

  function showMessage(message = "", type = "error") {
    const element = document.getElementById(
      "auth-message"
    );

    if (!element) return;

    element.textContent = message;
    element.hidden = !message;
    element.className = "auth-message is-" + type;
  }

  function showErrors(prefix, errors = {}) {
    document
      .querySelectorAll(
        `#${prefix}-form .field-error`
      )
      .forEach(element => {
        element.textContent = "";
      });

    document
      .querySelectorAll(
        `#${prefix}-form .is-invalid`
      )
      .forEach(element => {
        element.classList.remove("is-invalid");
        element.removeAttribute("aria-invalid");
      });

    Object.entries(errors).forEach(([field, text]) => {
      const id = `${prefix}-${field}`;

      const input = document.getElementById(id);
      const error = document.querySelector(
        `[data-error="${id}"]`
      );

      if (input) {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
      }

      if (error) {
        error.textContent = text;
      }
    });
  }

  // =========================
  // XỬ LÝ FORM
  // =========================

  function initForm() {
    const loginForm = document.getElementById(
      "login-form"
    );

    const registerForm = document.getElementById(
      "register-form"
    );

    if (!loginForm || !registerForm) return;

    seedOwner();

    const loginPanel = document.getElementById(
      "login-panel"
    );

    const registerPanel = document.getElementById(
      "register-panel"
    );

    const ownerHint = document.getElementById(
      "owner-hint"
    );

    // Lấy vai trò đang chọn
    function selectedRole() {
      return document.querySelector(
        'input[name="loginRole"]:checked'
      )?.value || "customer";
    }

    // Hiện / ẩn tài khoản demo
    function syncDemo() {
      if (ownerHint) {
        ownerHint.hidden =
          loginPanel.hidden ||
          selectedRole() !== "salon_owner";
      }
    }

    // Chuyển tab
    function switchTab(tab) {
      loginPanel.hidden = tab !== "login";
      registerPanel.hidden = tab !== "register";

      document
        .querySelectorAll("[data-tab]")
        .forEach(button => {
          const active = button.dataset.tab === tab;

          button.classList.toggle(
            "is-active",
            active
          );

          button.setAttribute(
            "aria-selected",
            String(active)
          );
        });

      showMessage("");
      syncDemo();
    }

    // Sự kiện chuyển tab
    document
      .querySelectorAll("[data-tab]")
      .forEach(button => {
        button.addEventListener("click", () => {
          switchTab(button.dataset.tab);
        });
      });

    // Sự kiện chọn vai trò
    document
      .querySelectorAll('input[name="loginRole"]')
      .forEach(radio => {
        radio.addEventListener("change", () => {
          showMessage("");
          syncDemo();
        });
      });

    // =========================
    // NHẤN NÚT ĐĂNG NHẬP
    // =========================

    loginForm.addEventListener("submit", event => {
      event.preventDefault();

      showMessage("");
      showErrors("login");

      const email = document
        .getElementById("login-email")
        .value.trim();

      const password = document
        .getElementById("login-password")
        .value;

      const errors = {};

      if (!email) {
        errors.email = "Vui lòng nhập email.";
      } else if (!emailValid(email)) {
        errors.email = "Email không đúng định dạng.";
      }

      if (!password) {
        errors.password = "Vui lòng nhập mật khẩu.";
      }

      if (Object.keys(errors).length) {
        showErrors("login", errors);

        showMessage(
          "Vui lòng kiểm tra thông tin đăng nhập."
        );

        return;
      }

      const result = login(
        email,
        password,
        selectedRole()
      );

      if (!result.ok) {
        showMessage(result.error);
        return;
      }

      showMessage(
        "Đăng nhập thành công! Đang chuyển trang…",
        "success"
      );

      navigateAfterLogin(result.user);
    });

    // =========================
    // NHẤN NÚT ĐĂNG KÝ
    // =========================

    registerForm.addEventListener("submit", event => {
      event.preventDefault();

      showMessage("");

      const fields = [
        "fullName",
        "email",
        "phone",
        "password",
        "confirmPassword"
      ];

      const input = Object.fromEntries(
        fields.map(name => [
          name,
          document.getElementById(
            "register-" + name
          ).value
        ])
      );

      const result = register(input);

      showErrors(
        "register",
        result.errors || {}
      );

      if (!result.ok) {
        showMessage(
          "Vui lòng kiểm tra các trường được đánh dấu."
        );

        return;
      }

      showMessage(
        "Đăng ký thành công!",
        "success"
      );

      navigateAfterLogin(result.user);
    });

    // Mặc định mở tab Đăng nhập
    switchTab("login");
  }

  // =========================
  // CUNG CẤP CHỨC NĂNG CHO
  // BOOKING / PROFILE
  // =========================

  window.SalonBookAuth = {
    currentUser,
    requireLogin,
    logout,
    renderHeader,
    validateRegistration,
    register,
    login,
    users,
    seedOwner
  };

  // KHỞI TẠO
  function boot() {
    renderHeader();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      boot
    );
  } else {
    boot();
  }

  window.addEventListener(
    "salonbook:auth-changed",
    renderHeader
  );

})();
