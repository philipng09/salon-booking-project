
/*
 * SALONBOOK - COMMON.JS
 * Các chức năng dùng chung:
 * 1. Menu điện thoại
 * 2. Footer
 * 3. Header đăng nhập / đăng xuất
 */

document.addEventListener("DOMContentLoaded", () => {

    // ====================================
    // 1. MENU ĐIỆN THOẠI
    // ====================================

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("is-open");

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            toggle.setAttribute(
                "aria-label",
                isOpen ? "Đóng menu" : "Mở menu"
            );
        });
    }

    // ====================================
    // 2. FOOTER DÙNG CHUNG
    // ====================================

    const footerHolder = document.querySelector(".site-footer");

    if (footerHolder) {
        fetch("components/footer.html")
            .then(response => {
                return response.ok ? response.text() : "";
            })
            .then(html => {
                if (html) {
                    footerHolder.outerHTML = html;
                }
            })
            .catch(error => {
                console.warn("Không tải được Footer:", error);
            });
    }

    // ====================================
    // 3. HEADER ĐĂNG NHẬP / ĐĂNG XUẤT
    // ====================================

    function updateAuthHeader() {

        if (
            window.SalonBookAuth &&
            typeof window.SalonBookAuth.renderHeader === "function"
        ) {
            window.SalonBookAuth.renderHeader();
        }

    }

    // Cập nhật Header khi mở trang
    updateAuthHeader();

    // ====================================
    // 4. ĐỒNG BỘ TRẠNG THÁI TÀI KHOẢN
    // ====================================

    document.addEventListener(
        "salonbook:auth-changed",
        updateAuthHeader
    );

});
