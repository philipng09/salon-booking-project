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
