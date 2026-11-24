
/* ==========================================
   SALONBOOK - ADMIN AUTH
   PHÂN QUYỀN QUẢN TRỊ VIÊN
   FRONTEND DEMO
   ========================================== */

(function () {

    "use strict";

    const ADMIN_EMAIL = "admin@salonbook.test";
    const ADMIN_PASSWORD = "Admin123";

    const CURRENT_KEY = "currentUser";
    const ADMIN_DATA_KEY = "salonbook.admin.v1";

    // ==========================================
    // TÀI KHOẢN ADMIN DEMO
    // ==========================================

    const adminAccount = {
        id: "U001",
        userId: "U001",
        name: "Administrator",
        fullName: "Quản trị viên SalonBook",
        email: ADMIN_EMAIL,
        role: "admin",
        status: "active"
    };

    // ==========================================
    // ĐỌC DỮ LIỆU LOCAL STORAGE
    // ==========================================

    function readStorage(key, fallback = null) {

        try {

            return JSON.parse(
                localStorage.getItem(key)
            ) ?? fallback;

        } catch {

            return fallback;

        }

    }

    // ==========================================
    // KIỂM TRA QUYỀN ADMIN
    // ==========================================

    function isAdmin(user) {

        return Boolean(
            user &&
            user.role === "admin" &&
            user.status !== "locked"
        );

    }

    // ==========================================
    // HIỂN THỊ THÔNG BÁO
    // ==========================================

    function showMessage(message, type = "error") {

        const messageBox =
            document.getElementById("auth-message");

        if (!messageBox) {

            alert(message);
            return;

        }

        messageBox.textContent = message;

        messageBox.className =
            "auth-message is-" + type;

        messageBox.hidden = false;

    }

    function clearMessage() {

        const messageBox =
            document.getElementById("auth-message");

        if (messageBox) {

            messageBox.textContent = "";
            messageBox.hidden = true;

        }

    }

    // ==========================================
    // XỬ LÝ ĐĂNG NHẬP ADMIN
    // ==========================================

    function loginAdmin(email, password) {

        const normalizedEmail = String(email || "")
            .trim()
            .toLowerCase();

        if (!normalizedEmail || !password) {

            return {
                ok: false,
                error: "Vui lòng nhập email và mật khẩu."
            };

        }

        // Kiểm tra thông tin đăng nhập

        if (
            normalizedEmail !== ADMIN_EMAIL ||
            password !== ADMIN_PASSWORD
        ) {

            return {
                ok: false,
                error: "Email hoặc mật khẩu Admin không đúng."
            };

        }

        // Kiểm tra trạng thái từ Admin Dashboard

        const adminData =
            readStorage(ADMIN_DATA_KEY, {});

        const list = Array.isArray(adminData?.users)
            ? adminData.users
            : [];

        const savedAdmin = list.find(user =>

            user.userId === adminAccount.userId ||

            String(user.email || "")
                .toLowerCase() === ADMIN_EMAIL

        );

        // Chặn tài khoản bị khóa

        if (savedAdmin?.status === "locked") {

            return {
                ok: false,
                error: "Tài khoản Admin đã bị khóa."
            };

        }

        // Chặn tài khoản đã bị thay đổi quyền

        if (
            savedAdmin &&
            savedAdmin.role !== "admin"
        ) {

            return {
                ok: false,
                error: "Tài khoản không còn quyền quản trị viên."
            };

        }

        // Lưu thông tin đăng nhập

        const session = {

            ...adminAccount,

            status: savedAdmin?.status || "active"

        };

        try {

            localStorage.setItem(
                CURRENT_KEY,
                JSON.stringify(session)
            );

            sessionStorage.removeItem(
                "salonbook_auth_return"
            );

        } catch {

            return {
                ok: false,
                error: "Không thể lưu phiên đăng nhập."
            };

        }

        return {
            ok: true,
            user: session
        };

    }

    // ==========================================
    // CSS CHO Ô CHỌN ADMIN
    // ==========================================

    function createStyles() {

        if (
            document.getElementById(
                "salonbook-admin-auth-style"
            )
        ) return;

        const style = document.createElement("style");

        style.id = "salonbook-admin-auth-style";

        style.textContent = `

            .role-options.has-admin {

                display: grid;

                grid-template-columns:
                    repeat(3, minmax(0, 1fr));

                gap: 12px;

            }

            .role-admin {

                display: block;
                cursor: pointer;
                min-width: 0;

            }

            .role-admin .role-tile {

                background: #faf1cc;

                color: #0c513f;

                border: 2px solid transparent;

                opacity: 0.8;

            }

            .role-admin input:checked + .role-tile {

                background: #ffc501;

                color: #0c513f;

                border-color: #0c513f;

                opacity: 1;

                box-shadow:
                    0 0 0 3px #ffc50130,
                    0 5px 18px #0c513f15;

                transform: translateY(-2px);

            }

            .admin-demo-hint {

                margin-top: 20px;

                padding: 18px;

                background: #faf9ef;

                color: #0c513f;

                border: 1px solid #dedfd3;

                border-left: 4px solid #ffc501;

                border-radius: 12px;

                font-size: 13px;

                line-height: 1.6;

            }

            .admin-demo-hint h4 {

                margin: 0 0 12px;

                font-size: 15px;

                color: #0c513f;

            }

            .admin-demo-row {

                display: flex;

                justify-content: space-between;

                flex-wrap: wrap;

                gap: 8px;

                margin-top: 8px;

                padding: 10px 12px;

                border: 1px solid #e0e6db;

                border-radius: 8px;

                background: white;

            }

            .admin-demo-row b {

                overflow-wrap: anywhere;

            }

            .admin-demo-hint small {

                display: block;

                margin-top: 12px;

                color: #687b72;

            }

            .admin-demo-hint[hidden] {

                display: none !important;

            }

            @media (max-width: 600px) {

                .role-options.has-admin {

                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));

                }

                .role-admin {

                    grid-column: 1 / -1;

                }

                .role-admin .role-tile {

                    min-height: 95px;

                }

            }

        `;

        document.head.appendChild(style);

    }

    // ==========================================
    // THÊM Ô CHỌN QUẢN TRỊ VIÊN
    // ==========================================

    function createAdminRole() {

        const roleOptions =
            document.querySelector(".role-options");

        if (!roleOptions) return;

        roleOptions.classList.add("has-admin");

        if (
            !roleOptions.querySelector(
                'input[value="admin"]'
            )
        ) {

            const adminRole =
                document.createElement("label");

            adminRole.className = "role-admin";

            adminRole.innerHTML = `

                <input
                    type="radio"
                    name="loginRole"
                    value="admin">

                <span class="role-tile">

                    <span class="role-icon">
                        ⚙
                    </span>

                    <span>
                        Quản trị viên
                    </span>

                    <small>
                        Quản lý hệ thống
                    </small>

                </span>

            `;

            roleOptions.appendChild(adminRole);

        }

    }

    // ==========================================
    // HIỂN THỊ TÀI KHOẢN ADMIN DEMO
    // ==========================================

    function createAdminHint() {

        const loginForm =
            document.getElementById("login-form");

        if (!loginForm) return;

        if (
            document.getElementById("admin-hint")
        ) return;

        const adminHint =
            document.createElement("div");

        adminHint.id = "admin-hint";

        adminHint.className = "admin-demo-hint";

        adminHint.hidden = true;

        adminHint.innerHTML = `

            <h4>
                🔑 Tài khoản Quản trị viên Demo
            </h4>

            <div class="admin-demo-row">

                <span>Email</span>

                <b>admin@salonbook.test</b>

            </div>

            <div class="admin-demo-row">

                <span>Mật khẩu</span>

                <b>Admin123</b>

            </div>

            <small>

                Chỉ tài khoản có vai trò admin mới
                được truy cập trang quản trị hệ thống.

                Tài khoản này chỉ dùng để demo Frontend.

            </small>

        `;

        loginForm.insertAdjacentElement(
            "afterend",
            adminHint
        );

    }

    // ==========================================
    // KIỂM TRA VAI TRÒ ĐANG CHỌN
    // ==========================================

    function selectedRole() {

        return document.querySelector(

            'input[name="loginRole"]:checked'

        )?.value || "customer";

    }

    function updateRoleUI() {

        const role = selectedRole();

        const adminHint =
            document.getElementById("admin-hint");

        const ownerHint =
            document.getElementById("owner-hint");

        const loginPanel =
            document.getElementById("login-panel");

        const isLogin =
            !loginPanel || !loginPanel.hidden;

        if (adminHint) {

            adminHint.hidden = !(
                role === "admin" && isLogin
            );

        }

        if (role === "admin" && ownerHint) {

            ownerHint.hidden = true;

        }

    }

    // ==========================================
    // XỬ LÝ FORM ĐĂNG NHẬP
    // ==========================================

    function setupAdminLogin() {

        const loginForm =
            document.getElementById("login-form");

        if (!loginForm) return;

        /*
            Chỉ xử lý khi chọn Admin.

            Customer và Salon Owner vẫn
            sử dụng auth.js hiện tại của nhóm.
        */

        loginForm.addEventListener(

            "submit",

            function (event) {

                const role = selectedRole();

                if (role !== "admin") {

                    return;

                }

                event.preventDefault();

                event.stopImmediatePropagation();

                clearMessage();

                const email =

                    document
                        .getElementById("login-email")
                        ?.value || "";

                const password =

                    document
                        .getElementById("login-password")
                        ?.value || "";

                const result =
                    loginAdmin(email, password);

                if (!result.ok) {

                    showMessage(
                        result.error,
                        "error"
                    );

                    return;

                }

                showMessage(

                    "Đăng nhập Admin thành công!",

                    "success"

                );

                // Chuyển đến trang quản trị

                window.location.replace(
                    "./admin-dashboard.html"
                );

            },

            true

        );

    }

    // ==========================================
    // KHỞI TẠO TRANG ĐĂNG NHẬP
    // ==========================================

    function init() {

        const loginForm =
            document.getElementById("login-form");

        if (!loginForm) return;

        createStyles();

        createAdminRole();

        createAdminHint();

        setupAdminLogin();

        document.addEventListener(

            "change",

            function (event) {

                if (
                    event.target.matches(
                        'input[name="loginRole"]'
                    )
                ) {

                    clearMessage();

                    updateRoleUI();

                    requestAnimationFrame(updateRoleUI);

                }

            }

        );

        const loginTab =
            document.getElementById("login-tab");

        const registerTab =
            document.getElementById("register-tab");

        loginTab?.addEventListener(

            "click",

            function () {

                requestAnimationFrame(updateRoleUI);

            }

        );

        registerTab?.addEventListener(

            "click",

            function () {

                const adminHint =
                    document.getElementById("admin-hint");

                if (adminHint) {

                    adminHint.hidden = true;

                }

            }

        );

        updateRoleUI();

    }

    // ==========================================
    // API DÙNG CHUNG CHO ADMIN
    // ==========================================

    window.SalonBookAdminAuth = {

        currentUser() {

            return readStorage(CURRENT_KEY);

        },

        isAdmin,

        login: loginAdmin,

        logout() {

            localStorage.removeItem(CURRENT_KEY);

            sessionStorage.removeItem(
                "salonbook_auth_return"
            );

            window.location.replace("./auth.html");

        }

    };

    // ==========================================
    // CHẠY KHI WEBSITE TẢI XONG
    // ==========================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
