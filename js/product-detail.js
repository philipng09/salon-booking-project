document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy ID salon từ URL (VD: product-detail.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || 1;
    const product = typeof products !== "undefined" ? products.find(p => p.id == productId) : null;

    if (!product) {
        const mainEl = document.getElementById("main-content");
        if (mainEl) {
            mainEl.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2>Sản phẩm/Salon không tồn tại hoặc đã bị xóa.</h2>
                    <a href="products.html" class="btn btn-yellow" style="margin-top: 20px; display: inline-block;">Quay lại danh sách</a>
                </div>
            `;
        }
        return;
    }

    // --- A. GẮN THÔNG TIN SALON BAN ĐẦU ---
    const titleEl = document.getElementById("detail-title");
    const descEl = document.querySelector(".detail-description");
    const addressEl = document.querySelector(".detail-address");
    const imgEl = document.querySelector(".detail-image img");
    const summarySalonName = document.getElementById("summary-salon-name");
    const summarySalonLocation = document.getElementById("summary-salon-location");

    if (titleEl) titleEl.textContent = product.name;
    if (descEl) descEl.textContent = product.description;
    if (addressEl) {
        addressEl.innerHTML = `📍 ${product.address} <a id="detail-map-link" href="${product.map || '#'}" target="_blank" style="margin-left: 8px; color: #0c513f; font-weight: 600;">[Xem Google Maps]</a>`;
    }
    if (imgEl) imgEl.src = product.image;

    if (summarySalonName) summarySalonName.textContent = product.name;
    if (summarySalonLocation) summarySalonLocation.textContent = product.districtName || product.address;

    // Các thẻ select/input ở form bên trái
    const serviceSelect = document.getElementById("detail-service-select");
    const stylistSelect = document.getElementById("detail-stylist-select");
    const dateInput = document.getElementById("detail-date");
    const timeGrid = document.getElementById("detail-time-grid");
    const addToCartBtn = document.getElementById("add-to-cart-btn");

    // Các thẻ ở Bảng Xanh tóm tắt bên phải
    const summaryServiceName = document.getElementById("summary-service-name");
    const summaryStylistName = document.getElementById("summary-stylist-name");
    const summaryTime = document.getElementById("summary-time");
    const summaryPrice = document.getElementById("summary-price");
    const submitBtn = document.getElementById("btn-submit-booking");

    // Biến tạm để ghi nhận thao tác người dùng ở form trái
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

    // 1. Đổ Dịch vụ
    if (serviceSelect && product.servicesList) {
        let html = '<option value="">Chọn dịch vụ</option>';
        product.servicesList.forEach(s => {
            html += `<option value="${s.id}" data-name="${s.name}" data-price="${s.price}">${s.name} - ${s.price.toLocaleString("vi-VN")} ₫</option>`;
        });
        serviceSelect.innerHTML = html;
    }

    // 2. Đổ Chuyên viên
    if (stylistSelect && product.stylists) {
        let html = '<option value="">Chọn chuyên viên</option>';
        product.stylists.forEach(tho => {
            html += `<option value="${tho.id}" data-name="${tho.name}">${tho.name} (${tho.experience})</option>`;
        });
        stylistSelect.innerHTML = html;
    }

    // --- C. LẮNG NGHE CHỌN FORM BÊN TRÁI ---

    // Khi chọn Dịch vụ
    if (serviceSelect) {
        serviceSelect.addEventListener("change", (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (e.target.value) {
                currentSelection.serviceId = e.target.value;
                currentSelection.serviceName = opt.getAttribute("data-name");
                currentSelection.servicePrice = parseInt(opt.getAttribute("data-price"));
            } else {
                currentSelection.serviceName = "";
                currentSelection.servicePrice = 0;
            }
        });
    }

    // Khi chọn Chuyên viên -> Tạo nút Khung giờ
    if (stylistSelect) {
        stylistSelect.addEventListener("change", (e) => {
            const selectedStylistId = e.target.value;
            const selectedStylist = product.stylists ? product.stylists.find(st => st.id === selectedStylistId) : null;

            if (selectedStylist) {
                currentSelection.stylistId = selectedStylist.id;
                currentSelection.stylistName = selectedStylist.name;

                if (timeGrid && selectedStylist.availableHours) {
                    timeGrid.innerHTML = selectedStylist.availableHours.map(hour => `
                        <button type="button" class="btn-time-slot" data-time="${hour}" style="padding: 8px 14px; margin: 4px; border: 1px solid #0c513f; border-radius: 6px; background: #fff; cursor: pointer;">
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

    // --- D. BẤM "+ THÊM DỊCH VỤ ĐÃ CHỌN VÀO GIỎ" -> MỚI ĐỔ SANG BẢNG XANH ---
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", (e) => {
            e.preventDefault();

            if (!currentSelection.serviceName) {
                alert("Vui lòng chọn Dịch vụ!");
                return;
            }
            if (!currentSelection.stylistName) {
                alert("Vui lòng chọn Chuyên viên!");
                return;
            }
            if (!currentSelection.date) {
                alert("Vui lòng chọn Ngày dự kiến!");
                return;
            }
            if (!currentSelection.time) {
                alert("Vui lòng chọn Khung giờ!");
                return;
            }

            // ĐỦ 4 BƯỚC -> CẬP NHẬT LÊN BẢNG XANH BÊN PHẢI
            if (summaryServiceName) summaryServiceName.textContent = currentSelection.serviceName;
            if (summaryStylistName) summaryStylistName.textContent = currentSelection.stylistName;
            if (summaryTime) summaryTime.textContent = `${currentSelection.time} - ${currentSelection.date}`;
            if (summaryPrice) summaryPrice.textContent = currentSelection.servicePrice.toLocaleString("vi-VN") + " ₫";

            // MỞ KHÓA NÚT "XÁC NHẬN ĐẶT LỊCH"
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }

            // Gọi hàm giỏ hàng nếu nhóm có dùng cart.js
            if (typeof addToCart === "function") {
                addToCart(product.id, currentSelection);
            }

            alert("✅ Thông tin đã được lưu! Bạn có thể nhấn 'Xác nhận đặt lịch' để hoàn tất.");
        });
    }

    // --- E. BẤM "XÁC NHẬN ĐẶT LỊCH" ---
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            if (submitBtn.disabled) return;

            alert(`🎉 ĐẶT LỊCH THÀNH CÔNG!\n\n• Salon: ${product.name}\n• Dịch vụ: ${currentSelection.serviceName}\n• Chuyên viên: ${currentSelection.stylistName}\n• Thời gian: ${currentSelection.time} ngày ${currentSelection.date}\n• Giá dự kiến: ${currentSelection.servicePrice.toLocaleString("vi-VN")} ₫`);
        });
    }
});
