document.addEventListener("DOMContentLoaded", () => {
    // 1. Đọc ID salon từ URL (?id=1)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || 1;
    const product = typeof products !== "undefined" ? products.find(p => String(p.id) === String(productId)) : null;

    if (!product) return;

    // --- A. CẬP NHẬT THÔNG TIN SALON BAN ĐẦU ---
    const titleEl = document.getElementById("detail-title");
    const descEl = document.querySelector(".detail-description");
    const addressEl = document.getElementById("detail-address") || document.querySelector(".detail-address");
    const mapLinkEl = document.getElementById("detail-map-link");
    const imgEl = document.querySelector(".detail-image img");

    if (titleEl) titleEl.textContent = product.name;
    if (descEl) descEl.textContent = product.description;
    if (addressEl) {
        if (addressEl.tagName === "P") {
            addressEl.innerHTML = `📍 ${product.address} <a id="detail-map-link" href="${product.map || '#'}" target="_blank" style="margin-left: 8px; color: #0c513f; font-weight: 600;">[Xem Google Maps]</a>`;
        } else {
            addressEl.textContent = product.address;
            if (mapLinkEl && product.map) mapLinkEl.href = product.map;
        }
    }
    if (imgEl) imgEl.src = product.image;

    // Gán thông tin sang Bảng Xanh
    const summarySalonName = document.getElementById("summary-salon-name");
    const summarySalonLocation = document.getElementById("summary-salon-location");
    if (summarySalonName) summarySalonName.textContent = product.name;
    if (summarySalonLocation) summarySalonLocation.textContent = product.districtName || product.address;

    // --- B. ĐỔ GIÁ THẬT VÀO 4 THẺ DỊCH VỤ Ở PHẦN 2 ---
    const serviceCards = document.querySelectorAll(".detail-service-card");
    if (serviceCards.length > 0 && product.servicesList) {
        serviceCards.forEach((card, index) => {
            const serviceData = product.servicesList[index];
            if (serviceData) {
                // Đổi tên dịch vụ nếu muốn khớp 100%
                const titleNode = card.querySelector("h3");
                if (titleNode) titleNode.textContent = serviceData.name;

                // Đổi chữ "Giá đang cập nhật" -> Giá thật
                const priceNode = card.querySelector(".detail-service-bottom span");
                if (priceNode) {
                    priceNode.textContent = `${serviceData.price.toLocaleString("vi-VN")} ₫`;
                    priceNode.style.fontWeight = "700";
                    priceNode.style.color = "#0c513f";
                }
            }
        });
    }

    // --- C. ĐỔ DỮ LIỆU FORM CHỌN (BÊN TRÁI) ---
    const serviceSelect = document.getElementById("detail-service-select");
    const stylistSelect = document.getElementById("detail-stylist-select");
    const dateInput = document.getElementById("detail-date");
    const timeGrid = document.getElementById("detail-time-grid");

    let currentSelection = {
        serviceId: "",
        serviceName: "",
        servicePrice: 0,
        stylistName: "",
        date: "",
        time: ""
    };

    // 1. Đổ Dropdown Dịch vụ
    if (serviceSelect && product.servicesList) {
        let html = '<option value="">Chọn dịch vụ</option>';
        product.servicesList.forEach(s => {
            html += `<option value="${s.id}" data-name="${s.name}" data-price="${s.price}">${s.name} - ${s.price.toLocaleString("vi-VN")} ₫</option>`;
        });
        serviceSelect.innerHTML = html;
    }

    // 2. Đổ Dropdown Chuyên viên
    if (stylistSelect && product.stylists) {
        let html = '<option value="">Chọn chuyên viên</option>';
        product.stylists.forEach(tho => {
            html += `<option value="${tho.id}" data-name="${tho.name}">${tho.name} (${tho.experience})</option>`;
        });
        stylistSelect.innerHTML = html;
    }

    // --- D. LẮNG NGHE SỰ KIỆN FORM BÊN TRÁI ---

    // Chọn Dịch vụ
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

    // Chọn Chuyên viên -> Tạo các nút khung giờ
    if (stylistSelect) {
        stylistSelect.addEventListener("change", (e) => {
            const selectedStylistId = e.target.value;
            const selectedStylist = product.stylists ? product.stylists.find(st => String(st.id) === String(selectedStylistId)) : null;

            if (selectedStylist) {
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
                currentSelection.stylistName = "";
                currentSelection.time = "";
                if (timeGrid) timeGrid.innerHTML = '<button type="button" disabled>Vui lòng chọn chuyên viên để xem lịch trống</button>';
            }
        });
    }

    // Chọn Ngày
    if (dateInput) {
        dateInput.addEventListener("change", (e) => {
            currentSelection.date = e.target.value;
        });
    }

    // --- E. BẤM "+ THÊM DỊCH VỤ VÀO GIỎ" -> ĐỔ SANG BẢNG XANH ---
    const addToCartBtn = document.getElementById("add-to-cart-btn") || document.querySelector(".btn-outline");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", (e) => {
            e.preventDefault();

            if (!currentSelection.serviceId) return alert("Vui lòng chọn 01. Dịch vụ!");
            if (!currentSelection.stylistName) return alert("Vui lòng chọn 02. Chuyên viên!");
            if (!currentSelection.date) return alert("Vui lòng chọn 03. Ngày dự kiến!");
            if (!currentSelection.time) return alert("Vui lòng chọn 04. Khung giờ!");

            // 1. Cập nhật Bảng Xanh bên phải
            const summaryServiceName = document.getElementById("summary-service-name");
            const summaryStylistName = document.getElementById("summary-stylist-name");
            const summaryTime = document.getElementById("summary-time");
            const summaryPrice = document.getElementById("summary-price");

            if (summaryServiceName) summaryServiceName.textContent = currentSelection.serviceName;
            if (summaryStylistName) summaryStylistName.textContent = currentSelection.stylistName;
            if (summaryTime) summaryTime.textContent = `${currentSelection.time} - ${currentSelection.date}`;
            if (summaryPrice) {
                summaryPrice.textContent = currentSelection.servicePrice.toLocaleString("vi-VN") + " ₫";
            }

            // 2. Mở khóa nút "Xác nhận đặt lịch"
            const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }

            // 3. Gọi lưu vào giỏ hàng của cart.js
            if (typeof window.SalonCart !== "undefined") {
                window.SalonCart.addToCart(product.id, currentSelection.serviceId);
            } else if (typeof window.addToCart === "function") {
                window.addToCart(product.id, currentSelection.serviceId);
            }

            alert("✅ Đã thêm dịch vụ vào giỏ!");
        });
    }

    // --- F. BẤM "XÁC NHẬN ĐẶT LỊCH" -> SANG CART.HTML ---
    const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            if (submitBtn.disabled) return;
            window.location.href = "cart.html";
        });
    }
});
