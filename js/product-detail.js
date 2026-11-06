document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const container = document.getElementById("product-detail-container");

    if (!productId) {
        container.innerHTML = `
            <div class="container detail-info" style="text-align:center; padding: 50px 0;">
                <h2>Không tìm thấy mã sản phẩm/salon.</h2>
                <a href="products.html" class="btn btn-yellow" style="margin-top:20px;">Quay lại danh sách</a>
            </div>`;
        return;
    }

    // Chú ý: Dùng => (dấu bằng và lớn hơn)
    const product = products.find(p => p.id == productId);

    if (product) {
        container.innerHTML = `
            <section class="container detail-hero">
                <div class="detail-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" style="border-radius: 12px; width: 100%;">
                </div>
                <div class="detail-info">
                    <p class="detail-label">${product.category}</p>
                    <h1 id="detail-title">${product.name}</h1>
                    <div class="detail-divider"></div>
                    <h2>Thông tin chi tiết</h2>
                    <p class="detail-description">${product.description || product.address || "Đang cập nhật..."}</p>
                    <h2 style="margin-top: 15px; color: #b98e14;">${product.price.toLocaleString('vi-VN')} đ</h2>
                    
                    <div style="margin-top: 30px;">
                        <!-- Nút gọi hàm thêm vào giỏ hàng của TV4 -->
                        <button class="btn btn-yellow detail-button" onclick="addToCart(${product.id})">
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </section>
            
            <div class="container detail-back" style="margin-top: 30px;">
                <a href="products.html">← Quay lại danh sách</a>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="container detail-info" style="text-align:center; padding: 50px 0;">
                <h2>Sản phẩm không tồn tại hoặc đã bị xóa.</h2>
                <a href="products.html" class="btn btn-yellow" style="margin-top:20px;">Quay lại danh sách</a>
            </div>`;
    }
});