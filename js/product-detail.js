/* ============================================================
   SALONBOOK - XỬ LÝ TRANG CHI TIẾT & KẾT NỐI SALONCART
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Đọc ID salon từ URL (VD: product-detail.html?id=1)
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || 1;
  const product = typeof products !== "undefined" ? products.find(p => String(p.id) === String(productId)) : null;

  if (!product) return;

  // --- A. ĐỔ THÔNG TIN SALON BAN ĐẦU ---
  const titleEl = document.getElementById("detail-title");
  const descEl = document.querySelector(".detail-description");
  const addressEl = document.querySelector(".detail-address");
  const imgEl = document.querySelector(".detail-image img");

  if (titleEl) titleEl.textContent = product.name;
  if (descEl) descEl.textContent = product.description;
  if (addressEl) {
    addressEl.innerHTML = `📍 ${product.address} <a id="detail-map-link" href="${product.map || '#'}" target="_blank" style="margin-left: 8px; color: #0c513f; font-weight: 600;">[Xem Google Maps]</a>`;
  }
  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = product.name;
  }

  // Gán tên Salon & Địa điểm vào Bảng Xanh tóm tắt
  const summarySalonName = document.getElementById("summary-salon-name");
  const summarySalonLocation = document.getElementById("summary-salon-location");
  if (summarySalonName) summarySalonName.textContent = product.name;
  if (summarySalonLocation) summarySalonLocation.textContent = product.districtName || product.address;

  // Phần tử Form trái
  const serviceSelect = document.getElementById("detail-service-select");
  const stylistSelect = document.getElementById("detail-stylist-select");
  const dateInput = document.getElementById("detail-date");
  const timeGrid = document.getElementById("detail-time-grid");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  // Phần tử Bảng Xanh phải
  const summaryServiceName = document.getElementById("summary-service-name");
  const summaryStylistName = document.getElementById("summary-stylist-name");
  const summaryTime = document.getElementById("summary-time");
  const summaryPrice = document.getElementById("summary-price");
  const submitBtn = document.getElementById("btn-submit-booking");

  // Biến tạm lưu thông tin chọn ở form trái
  let currentSelection = {
    serviceId: "",
    serviceName: "",
    servicePrice: 0,
    stylistId: "",
    stylistName: "",
    date: "",
    time: ""
  };

  // --- B. NẠP DỮ LIỆU VÀO DROPDOWN SELECT ---

  // 1. Đổ Dịch vụ (Lấy từ product.servicesList)
  if (serviceSelect && product.servicesList) {
    let html = '<option value="">Chọn dịch vụ</option>';
    product.servicesList.forEach(s => {
      html += `<option value="${s.id}" data-name="${s.name}" data-price="${s.price}">${s.name} - ${s.price.toLocaleString("vi-VN")} ₫</option>`;
    });
    serviceSelect.innerHTML = html;
  }

  // 2. Đổ Chuyên viên (Lấy từ product.stylists)
  if (stylistSelect && product.stylists) {
    let html = '<option value="">Chọn chuyên viên</option>';
    product.stylists.forEach(tho => {
      html += `<option value="${tho.id}" data-name="${tho.name}">${tho.name} (${tho.experience})</option>`;
    });
    stylistSelect.innerHTML = html;
  }

  // --- C. LẮNG NGHE THAO TÁC FORM BÊN TRÁI ---

  // Khi chọn Dịch vụ
  if (serviceSelect) {
    serviceSelect.addEventListener("change", (e) => {
      const opt = e.target.options[e.target.selectedIndex];
      if (e.target.value) {
        currentSelection.serviceId = e.target.value;
        currentSelection.serviceName = opt.getAttribute("data-name");
        currentSelection.servicePrice = parseInt(opt.getAttribute("data-price"));
      } else {
        currentSelection.serviceId = "";
        currentSelection.serviceName = "";
        currentSelection.servicePrice = 0;
      }
    });
  }

  // Khi chọn Chuyên viên -> Sinh ra danh sách nút giờ trống (availableHours)
  if (stylistSelect) {
    stylistSelect.addEventListener("change", (e) => {
      const selectedStylistId = e.target.value;
      const selectedStylist = product.stylists ? product.stylists.find(st => String(st.id) === String(selectedStylistId)) : null;

      if (selectedStylist) {
        currentSelection.stylistId = selectedStylist.id;
        currentSelection.stylistName = selectedStylist.name;

        if (timeGrid && selectedStylist.availableHours) {
          timeGrid.innerHTML = selectedStylist.availableHours.map(hour => `
            <button type="button" class="btn-time-slot" data-time="${hour}" style="padding: 8px 14px; margin: 4px; border: 1px solid #0c513f; border-radius: 6px; background: #fff; cursor: pointer; font-weight: 600;">
              ${hour}
            </button>
          `).join("");

          const timeBtns = timeGrid.querySelectorAll(".btn-time-slot");
          timeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
              timeBtns.forEach(b => { b.style.background = "#fff"; b.style.color = "#000"; });
              btn.style.background = "#ffc501";
              btn.style.color = "#0c513f";
              currentSelection.time = btn.getAttribute("data-time");
            });
          });
        }
      } else {
        currentSelection.stylistId = "";
        currentSelection.stylistName = "";
        currentSelection.time = "";
        if (timeGrid) timeGrid.innerHTML = '<button type="button" disabled>Vui lòng chọn chuyên viên để xem lịch trống</button>';
      }
    });
  }

  // Khi chọn Ngày
  if (dateInput) {
    dateInput.addEventListener("change", (e) => {
      currentSelection.date = e.target.value;
    });
  }

  // --- D. BẤM "+ THÊM DỊCH VỤ ĐÃ CHỌN VÀO GIỎ" ---
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!currentSelection.serviceId) return alert("Vui lòng chọn 01. Dịch vụ!");
      if (!currentSelection.stylistName) return alert("Vui lòng chọn 02. Chuyên viên!");
      if (!currentSelection.date) return alert("Vui lòng chọn 03. Ngày dự kiến!");
      if (!currentSelection.time) return alert("Vui lòng chọn 04. Khung giờ!");

      // 1. GỌI HÀM LƯU VÀO GIỎ HÀNG CHUẨN CỦA CART.JS
      if (typeof window.SalonCart !== "undefined") {
        window.SalonCart.addToCart(product.id, currentSelection.serviceId);
      } else if (typeof window.addToCart === "function") {
        window.addToCart(product.id, currentSelection.serviceId);
      }

      // 2. CẬP NHẬT DỮ LIỆU SANG BẢNG XANH BÊN PHẢI
      if (summaryServiceName) summaryServiceName.textContent = currentSelection.serviceName;
      if (summaryStylistName) summaryStylistName.textContent = currentSelection.stylistName;
      if (summaryTime) summaryTime.textContent = `${currentSelection.time} - ${currentSelection.date}`;
      if (summaryPrice) {
        summaryPrice.textContent = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentSelection.servicePrice);
      }

      // 3. MỞ KHÓA NÚT "XÁC NHẬN ĐẶT LỊCH"
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
      }

      alert("✅ Đã thêm dịch vụ vào giỏ");
    });
  }

  // --- E. BẤM "XÁC NHẬN ĐẶT LỊCH" -> CHUYỂN SANG TRANG CART.HTML ---
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      if (submitBtn.disabled) return;
      window.location.href = "cart.html";
    });
  }
});
