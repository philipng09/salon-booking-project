/**
 * HÀM HIỂN THỊ DANH SÁCH SALON TỪ DỮ LIỆU JS
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
  const htmlCards = list.map((salon) => `
    <article class="product-salon-card"
             data-name="${salon.name}"
             data-district="${salon.district}"
             data-services="${salon.services}">

      <img class="salon-image"
           src="${salon.image}"
           alt="${salon.name}"
           loading="lazy"
           onerror="this.src='images/salonbook-mark.png';">

      <div class="salon-info">
        <span class="salon-tag">${salon.category} · ${salon.districtName}</span>
        <h2>${salon.name}</h2>
        <p class="salon-address">📍 ${salon.address}</p>

        <div class="salon-price" style="font-weight: 700; color: #0c513f; font-size: 1.05rem; margin: 8px 0 12px 0;">
          Giá chỉ từ: <span style="color: #d97706;">${formatCurrency(salon.price)}</span>
        </div>

        <a class="salon-detail-button"
           href="product-detail.html?id=${salon.id}">Xem chi tiết</a>
      </div>
    </article>
  `).join("");

  // 6. Gắn HTML đã tạo vào lưới salon-grid
  salonGrid.innerHTML = htmlCards;
}
