/**
 * HÀM HIỂN THỊ DANH SÁCH SALON TỪ DỮ LIỆU JS (Đã cập nhật theo cấu trúc mới)
 */

function renderProducts(list) {
  // 1. Xác định các phần tử giao diện trên trang products.html
  const salonGrid = document.getElementById("salon-grid");
  const salonCount = document.getElementById("salon-count");
  const salonEmpty = document.getElementById("salon-empty");

  if (!salonGrid) return;

  // 2. Xử lý trạng thái danh sách rỗng (khi không có salon nào phù hợp)
  if (!list || list.length === 0) {
    salonGrid.innerHTML = "";
    if (salonEmpty) salonEmpty.classList.add("show");
    if (salonCount) salonCount.textContent = "Đang hiển thị 0 salon";
    return;
  }

  // 3. Ẩn thông báo rỗng và cập nhật số lượng đang hiển thị
  if (salonEmpty) salonEmpty.classList.remove("show");
  if (salonCount) {
    salonCount.textContent = `Đang hiển thị ${list.length} salon`;
  }

  // 4. Hàm định dạng tiền tệ Việt Nam (VNĐ)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

  // 5. Tạo các thẻ salon động bằng map() và template literals
  const htmlCards = list.map((salon) => {
    // Tìm giá thấp nhất từ danh sách dịch vụ để hiển thị "Giá chỉ từ"
    let minPrice = 0;
    if (salon.servicesList && salon.servicesList.length > 0) {
      minPrice = Math.min(...salon.servicesList.map(s => s.price));
    }

 return `
      <article class="product-salon-card"
               data-id="${salon.id}"
               data-name="${salon.name}"
               data-district="${salon.district}">

        <img class="salon-image"
             src="${salon.image}"
             alt="${salon.name}"
             loading="lazy"
             onerror="this.src='images/salonbook-mark.png';">

        <div class="salon-info">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <!-- BỔ SUNG THÊM HIỂN THỊ GENDER VÀO ĐÂY -->
           <span class="salon-tag">
  ${getSalonTypeLabel(salon.salonType)} · ${salon.districtName}
</span>
            <span class="salon-rating" style="font-size: 0.9rem; font-weight: 600; color: #d97706;">
              ⭐ ${salon.rating || 5.0}
            </span>
          </div>

          <h2>${salon.name}</h2>
          <p class="salon-address">📍 ${salon.address}</p>

          <div class="salon-price" style="font-weight: 700; color: #0c513f; font-size: 1.05rem; margin: 8px 0 12px 0;">
            Giá chỉ từ: <span style="color: #d97706;">${formatCurrency(minPrice)}</span>
          </div>

          <a class="salon-detail-button"
             href="product-detail.html?salonId=${salon.id}">Xem chi tiết</a>
        </div>
      </article>
    `;
  }).join("");

  // 6. Gắn HTML đã tạo vào lưới salon-grid
  salonGrid.innerHTML = htmlCards;
}
