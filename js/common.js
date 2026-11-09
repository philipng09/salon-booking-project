// js/common.js – Bật/tắt menu trên điện thoại
// Header và footer đã được chèn trực tiếp vào từng trang HTML (không dùng fetch),
// nên website hiển thị đầy đủ cả khi mở file trực tiếp bằng cách nhấp đúp.

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");

            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    // 1. Xử lý Toggle Menu Mobile
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
        });
    }

    // 2. Nạp Footer dùng chung hàng loạt cho tất cả các trang
    const footerHolder = document.querySelector(".site-footer");
    if (footerHolder) {
        fetch("components/footer.html")
            .then(res => res.ok ? res.text() : "")
            .then(html => {
                if (html) footerHolder.outerHTML = html;
            })
            .catch(() => {});
    }
});
