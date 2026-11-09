document.addEventListener("DOMContentLoaded", () => {
    // 1. Đọc ID từ URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    // Lấy dữ liệu sản phẩm từ file products.js
    const product = typeof products !== "undefined" ? products.find(p => p.id == productId) : null;

    if (product) {
        // --- A. ĐỔ DỮ LIỆU THÔNG TIN SALON ---
        
        // Tên salon
        const titleEl = document.getElementById("detail-title");
        if (titleEl) titleEl.textContent = product.name;

        // Mô tả salon
        const descEl = document.querySelector(".detail-description");
        if (descEl) descEl.textContent = product.description;

        // Hình ảnh salon
        const imgEl = document.querySelector(".detail-image img");
        if (imgEl) {
            imgEl.src = product.image;
            imgEl.alt = product.name;
        }

        // --- B. ĐỔ DỮ LIỆU DANH SÁCH THỢ (STYLIST) VÀO DROPDOWN ---
        const stylistSelect = document.getElementById("detail-stylist-select");

        if (stylistSelect && product.stylists && product.stylists.length > 0) {
            stylistSelect.innerHTML = '<option value="">Chọn chuyên viên</option>';
            
            product.stylists.forEach(tho => {
                const opt = document.createElement("option");
                opt.value = tho.id;
                opt.textContent = `${tho.name} (${tho.experience})`; 
                stylistSelect.appendChild(opt);
            });
        }

        // --- C. XỬ LÝ NÚT VÀNG "XEM LỰA CHỌN ĐẶT LỊCH" ---
        // Giữ đúng chức năng cuộn trang xuống form đặt lịch bên dưới
        const bookingScrollBtn = document.querySelector(".detail-button");
        if (bookingScrollBtn) {
            bookingScrollBtn.onclick = (e) => {
                e.preventDefault();
                const bookingSection = document.getElementById("booking") || document.querySelector(".container.detail-booking");
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: "smooth" });
                }
            };
        }

        // --- D. GẮN NÚT THÊM VÀO GIỎ HÀNG (NẾU CÓ TRÊN FORM) ---
        const addToCartBtn = document.getElementById("add-to-cart-btn") || document.querySelector(".btn-add-cart");
        if (addToCartBtn) {
            addToCartBtn.onclick = (e) => {
                e.preventDefault();
                if (typeof addToCart === "function") {
                    addToCart(product.id);
                } else {
                    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
                }
            };
        }

    } else {
        // --- E. XỬ LÝ KHI ID KHÔNG TỒN TẠI ---
        const mainEl = document.getElementById("main-content");
        if (mainEl) {
            mainEl.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2>Sản phẩm không tồn tại hoặc đã bị xóa.</h2>
                    <a href="products.html" class="btn btn-yellow" style="margin-top: 20px; display: inline-block;">Quay lại danh sách</a>
                </div>
            `;
        }
    }
});