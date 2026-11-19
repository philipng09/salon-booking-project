
/*
  SALONBOOK - AUTH DEMO
  Đăng ký / Đăng nhập / Đăng xuất

  Chỉ dành cho demo frontend.
  localStorage không phải cơ chế bảo mật thật.
*/

(() => {
  "use strict";

  const USERS_KEY = "salonbook_users";
  const SESSION_KEY = "currentUser";

  // Đọc danh sách người dùng
  function getUsers() {
    try {
      const users = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
      );
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  // Lấy người dùng đang đăng nhập
  function currentUser() {
    try {
      const user = JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
      );

      if (user && user.userId && user.fullName) {
        return user;
      }

      return null;
    } catch {
      return null;
    }
  }

  // Kiểm tra email
  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Kiểm tra số điện thoại Việt Nam
  function validPhone(phone) {
    return /^0\d{9}$/.test(phone);
  }

  // Tạo chuỗi ngẫu nhiên
  function randomHex(size) {
    const bytes = crypto.getRandomValues(
      new Uint8Array(size)
    );

    return Array.from(bytes, byte =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  }

  // Hash mật khẩu cho demo
  // Không thay thế bảo mật backend
  async function hashPassword(password, salt) {
    const text = `${salt}:${password}`;
    const data = new TextEncoder().encode(text);

    const hash = await crypto.subtle.digest(
      "SHA-256",
      data
    );

    return Array.from(
      new Uint8Array(hash),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  // Thông tin người dùng công khai
  function publicUser(user) {
    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
  }

  // Lưu phiên đăng nhập demo
  function setSession(user) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(publicUser(user))
    );

    document.dispatchEvent(
      new Event("salonbook:auth-changed")
    );
  }

  // ĐĂNG XUẤT
  function logout() {
    localStorage.removeItem(SESSION_KEY);

    document.dispatchEvent(
      new Event("salonbook:auth-changed")
    );

    window.location.href = "index.html";
  }

  // Kiểm tra trang quay lại sau đăng nhập
  function getReturnUrl() {
    const params = new URLSearchParams(
      window.location.search
    );

    const returnTo = params.get("returnTo");

    if (!returnTo) {
      return "index.html";
    }

    try {
      const url = new URL(
        returnTo,
        window.location.href
      );

      // Chỉ cho quay lại trang thuộc website
      if (url.origin !== window.location.origin) {
        return "index.html";
      }

      const file = url.pathname.split("/").pop();

      const allowedPages = [
        "index.html",
        "products.html",
        "product-detail.html",
        "cart.html",
        "profile.html"
      ];

      if (!allowedPages.includes(file)) {
        return "index.html";
      }

      return url.href;
    } catch {
      return "index.html";
    }
  }

  // Chuyển trang sau đăng nhập
  function goAfterLogin() {
    window.location.href = getReturnUrl();
  }

  // CẬP NHẬT HEADER
  function renderHeader() {
    const container = document.getElementById(
      "auth-action-container"
    );

    if (!container) {
      return;
    }

    container.replaceChildren();

    const user = currentUser();

    // Chưa đăng nhập
    if (!user) {
      const loginLink = document.createElement("a");

      loginLink.href = "auth.html";
      loginLink.className = "btn btn-yellow btn-top";
      loginLink.textContent = "Đăng nhập";

      container.appendChild(loginLink);
      return;
    }

    // Đã đăng nhập
    const name = document.createElement("span");

    name.textContent = `Xin chào, ${user.fullName}`;
    name.style.marginRight = "12px";

    const logoutButton = document.createElement(
      "button"
    );

    logoutButton.type = "button";
    logoutButton.textContent = "Đăng xuất";
    logoutButton.className = "btn btn-yellow btn-top";

    logoutButton.addEventListener(
      "click",
      logout
    );

    container.append(name, logoutButton);
  }

  // KHỞI TẠO TRANG AUTH
  function initAuthPage() {
    const loginForm = document.getElementById(
      "login-form"
    );

    const registerForm = document.getElementById(
      "register-form"
    );

    // Nếu không phải auth.html thì bỏ qua
    if (!loginForm || !registerForm) {
      return;
    }

    const loginTab = document.getElementById(
      "login-tab"
    );

    const registerTab = document.getElementById(
      "register-tab"
    );

    const loginPanel = document.getElementById(
      "login-panel"
    );

    const registerPanel = document.getElementById(
      "register-panel"
    );

    const message = document.getElementById(
      "auth-message"
    );

    // Hiển thị thông báo
    function showMessage(text, success = false) {
      message.textContent = text;

      message.classList.toggle(
        "success",
        success
      );
    }

    // Chuyển giữa hai tab
    function selectTab(tab) {
      const isRegister = tab === "register";

      loginPanel.hidden = isRegister;
      registerPanel.hidden = !isRegister;

      loginTab.setAttribute(
        "aria-selected",
        String(!isRegister)
      );

      registerTab.setAttribute(
        "aria-selected",
        String(isRegister)
      );

      showMessage("");
    }

    loginTab.addEventListener("click", () => {
      selectTab("login");
    });

    registerTab.addEventListener("click", () => {
      selectTab("register");
    });

    // Mở tab đăng ký qua URL
    const params = new URLSearchParams(
      window.location.search
    );

    if (params.get("tab") === "register") {
      selectTab("register");
    }

    // XỬ LÝ ĐĂNG KÝ
    registerForm.addEventListener(
      "submit",
      async function(event) {
        event.preventDefault();

        const data = Object.fromEntries(
          new FormData(registerForm)
        );

        const fullName = data.fullName
          .trim()
          .replace(/\s+/g, " ");

        const email = data.email
          .trim()
          .toLowerCase();

        const phone = data.phone.trim();
        const password = data.password;
        const confirmPassword = data.confirmPassword;

        // Kiểm tra bắt buộc
        if (
          !fullName ||
          !email ||
          !phone ||
          !password ||
          !confirmPassword
        ) {
          showMessage(
            "Vui lòng nhập đầy đủ thông tin."
          );
          return;
        }

        // Kiểm tra họ tên
        if (
          fullName.length < 2 ||
          fullName.length > 80 ||
          !/^[\p{L}\s'-]+$/u.test(fullName)
        ) {
          showMessage(
            "Họ tên phải có từ 2 đến 80 ký tự hợp lệ."
          );
          return;
        }

        // Kiểm tra email
        if (!validEmail(email)) {
          showMessage(
            "Email không đúng định dạng."
          );
          return;
        }

        // Kiểm tra số điện thoại
        if (!validPhone(phone)) {
          showMessage(
            "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0."
          );
          return;
        }

        // Kiểm tra mật khẩu
        if (password.length < 8) {
          showMessage(
            "Mật khẩu phải có ít nhất 8 ký tự."
          );
          return;
        }

        // Kiểm tra xác nhận mật khẩu
        if (password !== confirmPassword) {
          showMessage(
            "Mật khẩu xác nhận không trùng khớp."
          );
          return;
        }

        const users = getUsers();

        // Kiểm tra email trùng
        if (users.some(user => user.email === email)) {
          showMessage(
            "Email này đã được đăng ký."
          );
          return;
        }

        // Kiểm tra số điện thoại trùng
        if (users.some(user => user.phone === phone)) {
          showMessage(
            "Số điện thoại này đã được đăng ký."
          );
          return;
        }

        try {
          const salt = randomHex(16);

          const passwordHash = await hashPassword(
            password,
            salt
          );

          // Tạo tài khoản mới
          const newUser = {
            userId: crypto.randomUUID(),
            fullName: fullName,
            email: email,
            phone: phone,
            role: "customer",
            salt: salt,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
          };

          users.push(newUser);

          // Lưu danh sách tài khoản
          localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
          );

          // Tự đăng nhập sau khi đăng ký
          setSession(newUser);

          showMessage(
            "Đăng ký thành công!",
            true
          );

          goAfterLogin();

        } catch (error) {
          console.error(error);

          showMessage(
            "Không thể lưu tài khoản demo."
          );
        }
      }
    );

    // XỬ LÝ ĐĂNG NHẬP
    loginForm.addEventListener(
      "submit",
      async function(event) {
        event.preventDefault();

        const data = Object.fromEntries(
          new FormData(loginForm)
        );

        const email = data.email
          .trim()
          .toLowerCase();

        const password = data.password;

        // Kiểm tra dữ liệu
        if (!validEmail(email) || !password) {
          showMessage(
            "Vui lòng nhập email hợp lệ và mật khẩu."
          );
          return;
        }

        // Tìm tài khoản
        const users = getUsers();

        const user = users.find(
          item => item.email === email
        );

        try {
          if (!user || !user.salt || !user.passwordHash) {
            showMessage(
              "Email hoặc mật khẩu không đúng."
            );
            return;
          }

          const inputHash = await hashPassword(
            password,
            user.salt
          );

          // So sánh mật khẩu
          if (inputHash !== user.passwordHash) {
            showMessage(
              "Email hoặc mật khẩu không đúng."
            );
            return;
          }

          // Đăng nhập thành công
          setSession(user);

          showMessage(
            "Đăng nhập thành công!",
            true
          );

          goAfterLogin();

        } catch (error) {
          console.error(error);

          showMessage(
            "Không thể đăng nhập. Hãy thử lại."
          );
        }
      }
    );
  }

  // YÊU CẦU ĐĂNG NHẬP TRƯỚC BOOKING
  function requireLogin() {
    if (currentUser()) {
      return true;
    }

    // Lưu lại URL đang xem
    const currentPage =
      window.location.pathname.split("/").pop() +
      window.location.search +
      window.location.hash;

    window.location.href =
      "auth.html?returnTo=" +
      encodeURIComponent(currentPage);

    return false;
  }

  // Cho file khác sử dụng Auth
  window.SalonBookAuth = {
    currentUser,
    logout,
    renderHeader,
    requireLogin
  };

  // Chạy khi HTML tải xong
  document.addEventListener(
    "DOMContentLoaded",
    initAuthPage
  );

  document.addEventListener(
    "salonbook:auth-changed",
    renderHeader
  );

})();
