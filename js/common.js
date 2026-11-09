// js/common.js – Xử lý dùng chung cho mọi trang SalonBook
// Sửa lỗi BUG-01 (kiểm thử Buổi 3): trước đây tệp có HAI khối DOMContentLoaded
// cùng gắn sự kiện click cho nút menu, nên mỗi lần bấm menu bị mở rồi đóng ngay.
// Nay gộp thành MỘT khối duy nhất.

document.addEventListener("DOMContentLoaded", () => {
    // 1. Bật/tắt menu trên điện thoại (chỉ gắn sự kiện một lần)
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
        });
    }

    // 2. Nạp footer dùng chung từ components/footer.html
    //    (khi mở file trực tiếp bằng file://, trình duyệt chặn fetch nên giữ footer có sẵn trong trang)
    const footerHolder = document.querySelector(".site-footer");
    if (footerHolder) {
        fetch("components/footer.html")
            .then(res => (res.ok ? res.text() : ""))
            .then(html => {
                if (html) footerHolder.outerHTML = html;
            })
            .catch(() => {});
    }
});
