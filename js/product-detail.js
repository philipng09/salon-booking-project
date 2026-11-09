/* ============================================================
   SALONBOOK - QUẢN LÝ TRANG CHI TIẾT & ĐẶT LỊCH (PRODUCT-DETAIL.JS)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Đọc ID salon từ URL (?id=1)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || 1;
    const product = typeof products !== "undefined" ? products.find(p => String(p.id) === String(productId)) : null;

    if (!product) {
        const mainEl = document.getElementById("main-content");
        if (mainEl) {
            mainEl.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <h2>Salon không tồn tại hoặc đã bị xóa.</h2>
                    <a href="products.html" class="btn btn-yellow" style="margin-top: 20px; display: inline-block;">Quay lại danh sách</a>
                </div>
            `;
        }
        return;
    }

// --- A. GẮN THÔNG TIN SALON BAN ĐẦU ---
    const titleEl = document.getElementById("detail-title");
    const descEl = document.querySelector(".detail-description");
    const addressEl = document.getElementById("detail-address") || document.querySelector(".detail-address");
    const imgEl = document.querySelector(".detail-image img");

    if (titleEl) titleEl.textContent = product.name;
    if (descEl) descEl.textContent = product.description;

    // THAY THẾ TOÀN BỘ NỘI DUNG ĐỊA CHỈ (SẠCH SẼ, KHÔNG BỊ DẮM LẠI CHỮ CŨ)
    if (addressEl) {
        addressEl.innerHTML = `
            <div style="font-size: 14px; color: #0a4336; margin-bottom: 12px; font-weight: 500;">
                📍 ${product.address}
            </div>
            <div>
                <a href="${product.map || '#'}" target="_blank" class="btn-map-highlight">
                    📍 Xem vị trí trên Google Maps ↗
                </a>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
                <span style="font-size: 12px; background: #fefbf0; border: 1px solid #ffc501; color: #0c513f; padding: 4px 10px; border-radius: 12px; font-weight: 700;">✨ Xác nhận ngay</span>
                <span style="font-size: 12px; background: #f2f7f1; color: #587269; padding: 4px 10px; border-radius: 12px; font-weight: 600;">🅿️ Giữ xe miễn phí</span>
                <span style="font-size: 12px; background: #f2f7f1; color: #587269; padding: 4px 10px; border-radius: 12px; font-weight: 600;">📶 Wi-Fi tốc độ cao</span>
            </div>
        `;
    }

    if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
    }
    // Đổ tên Salon & Địa điểm ban đầu lên Bảng Xanh
    const summarySalonName = document.getElementById("summary-salon-name");
    const summarySalonLocation = document.getElementById("summary-salon-location");
    if (summarySalonName) summarySalonName.textContent = product.name;
    if (summarySalonLocation) summarySalonLocation.textContent = product.districtName || product.address;

   // --- B. ĐỔ GIÁ THẬT VÀO CÁC THẺ DỊCH VỤ Ở PHẦN 2 ---
    const serviceCards = document.querySelectorAll(".detail-service-card");
    if (serviceCards.length > 0 && product.servicesList) {
        serviceCards.forEach((card, index) => {
            const serviceData = product.servicesList[index];
            if (serviceData) {
                card.style.display = "block"; // Hiện thẻ nếu salon có dịch vụ này
                const titleNode = card.querySelector("h3");
                if (titleNode) titleNode.textContent = serviceData.name;

                const priceNode = card.querySelector(".detail-service-bottom span");
                if (priceNode) {
                    priceNode.textContent = `${serviceData.price.toLocaleString("vi-VN")} ₫`;
                    priceNode.style.fontSize = "18px";
                    priceNode.style.fontWeight = "800";
                    priceNode.style.color = "#0c513f";
                }
            } else {
                card.style.display = "none"; // Tự ẩn thẻ nếu salon không làm dịch vụ này
            }
        });
    }
    // --- C. KHỞI TẠO BIẾN THÀNH PHẦN FORM & BẢNG XANH ---
    const serviceSelect = document.getElementById("detail-service-select");
    const stylistSelect = document.getElementById("detail-stylist-select");
    const dateInput = document.getElementById("detail-date");
    const timeGrid = document.getElementById("detail-time-grid");

    const summaryServiceName = document.getElementById("summary-service-name");
    const summaryStylistName = document.getElementById("summary-stylist-name");
    const summaryTime = document.getElementById("summary-time");
    const summaryPrice = document.getElementById("summary-price");

    // Dữ liệu lựa chọn hiện tại
    let currentSelection = {
        serviceId: "",
        serviceName: "",
        servicePrice: 0,
        stylistName: "",
        date: "",
        time: ""
    };

    // Hàm cập nhật Bảng Xanh bên phải thời gian thực (Real-time)
    function updateSummaryUI() {
        if (summaryServiceName) {
            summaryServiceName.textContent = currentSelection.serviceName || "Chưa xác nhận";
        }
        if (summaryStylistName) {
            summaryStylistName.textContent = currentSelection.stylistName || "Chưa có dữ liệu";
        }
        if (summaryTime) {
            if (currentSelection.time && currentSelection.date) {
                summaryTime.textContent = `${currentSelection.time} - ${currentSelection.date}`;
            } else if (currentSelection.date) {
                summaryTime.textContent = currentSelection.date;
            } else {
                summaryTime.textContent = "Chưa xác nhận";
            }
        }
        if (summaryPrice) {
            summaryPrice.textContent = currentSelection.servicePrice > 0 
                ? currentSelection.servicePrice.toLocaleString("vi-VN") + " ₫" 
                : "Đang cập nhật";
        }
    }

    // Nạp danh sách Dịch vụ vào dropdown 01
    if (serviceSelect && product.servicesList) {
        let html = '<option value="">Chọn dịch vụ</option>';
        product.servicesList.forEach(s => {
            html += `<option value="${s.id}" data-name="${s.name}" data-price="${s.price}">${s.name} - ${s.price.toLocaleString("vi-VN")} ₫</option>`;
        });
        serviceSelect.innerHTML = html;
    }

    // Nạp danh sách Chuyên viên vào dropdown 02
    if (stylistSelect && product.stylists) {
        let html = '<option value="">Chọn chuyên viên</option>';
        product.stylists.forEach(tho => {
            html += `<option value="${tho.id}" data-name="${tho.name}">${tho.name} (${tho.experience})</option>`;
        });
        stylistSelect.innerHTML = html;
    }

    // --- D. LẮNG NGHE CHỌN FORM (LOGIC: CHỌN NGÀY XONG MỚI HIỆN GIỜ) ---

    // 1. Chọn Dịch vụ
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
            updateSummaryUI();
        });
    }

    // Hàm render danh sách nút Khung giờ trống
    function renderTimeSlots() {
        if (!timeGrid) return;

        // Chưa chọn Chuyên viên
        if (!currentSelection.stylistName) {
            timeGrid.innerHTML = '<button type="button" disabled style="padding: 10px; width: 100%; border: 1px dashed #ccc; background: #f9f9f9; color: #666; border-radius: 8px;">Vui lòng chọn 02. Chuyên viên</button>';
            return;
        }

        // Chưa chọn Ngày
        if (!currentSelection.date) {
            timeGrid.innerHTML = '<button type="button" disabled style="padding: 10px; width: 100%; border: 1px dashed #0c513f; background: #e5f0e8; color: #0c513f; font-weight: 600; border-radius: 8px;">Vui lòng chọn 03. Ngày dự kiến để xem khung giờ trống</button>';
            return;
        }

        // Đã đủ Chuyên viên + Ngày -> Vẽ danh sách nút giờ
        const selectedStylist = product.stylists ? product.stylists.find(st => st.name === currentSelection.stylistName) : null;

        if (selectedStylist && selectedStylist.availableHours) {
            timeGrid.innerHTML = selectedStylist.availableHours.map(hour => `
                <button type="button" class="btn-time-slot" data-time="${hour}" style="padding: 8px 14px; margin: 4px; border: 1px solid #0c513f; border-radius: 6px; background: ${currentSelection.time === hour ? '#ffc501' : '#fff'}; color: #0c513f; cursor: pointer; font-weight: 600;">
                    ${hour}
                </button>
            `).join("");

            const timeBtns = timeGrid.querySelectorAll(".btn-time-slot");
            timeBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    timeBtns.forEach(b => { 
                        b.style.background = "#fff"; 
                        b.style.color = "#0c513f"; 
                    });
                    btn.style.background = "#ffc501";
                    btn.style.color = "#0c513f";
                    currentSelection.time = btn.getAttribute("data-time");
                    updateSummaryUI();
                });
            });
        }
    }

    // 2. Chọn Chuyên viên
    if (stylistSelect) {
        stylistSelect.addEventListener("change", (e) => {
            const selectedStylistId = e.target.value;
            const selectedStylist = product.stylists ? product.stylists.find(st => String(st.id) === String(selectedStylistId)) : null;

            if (selectedStylist) {
                currentSelection.stylistName = selectedStylist.name;
            } else {
                currentSelection.stylistName = "";
            }
            currentSelection.time = ""; // Reset giờ khi đổi thợ
            renderTimeSlots();
            updateSummaryUI();
        });
    }

    // 3. Chọn Ngày -> KÍCH HOẠT HIỆN GIỜ
    if (dateInput) {
        dateInput.addEventListener("change", (e) => {
            currentSelection.date = e.target.value;
            currentSelection.time = ""; // Reset giờ khi đổi ngày
            renderTimeSlots();
            updateSummaryUI();
        });
    }

    // Khởi tạo trạng thái ô giờ ban đầu
    renderTimeSlots();

    // --- E. BẤM NÚT "+ THÊM DỊCH VỤ ĐÃ CHỌN VÀO GIỎ" ---
    const addToCartBtn = document.getElementById("add-to-cart-btn") || document.querySelector(".btn-outline");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 1. Kiểm tra từng điều kiện chọn
            if (!currentSelection.serviceId) return alert("Vui lòng chọn 01. Dịch vụ!");
            if (!currentSelection.stylistName) return alert("Vui lòng chọn 02. Chuyên viên!");
            if (!currentSelection.date) return alert("Vui lòng chọn 03. Ngày dự kiến!");
            if (!currentSelection.time) return alert("Vui lòng chọn 04. Khung giờ!");

            // 2. Mở khóa nút "Xác nhận đặt lịch"
            const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }

            // 3. Gọi lưu giỏ hàng của SalonCart trong cart.js
            if (typeof window.SalonCart !== "undefined" && typeof window.SalonCart.addToCart === "function") {
                window.SalonCart.addToCart(product.id, currentSelection.serviceId);
            } else if (typeof window.addToCart === "function") {
                window.addToCart(product.id, currentSelection.serviceId);
            }

            // 4. BẮN TOAST THÔNG BÁO XANH Ở GÓC DƯỚI BÊN PHẢI MÀN HÌNH
            showToastSuccess("Đã thêm dịch vụ vào giỏ!");
        });
    }

    // Hàm tạo và phát Toast trực tiếp (Cam kết 100% hiển thị)
    function showToastSuccess(message) {
        let toast = document.getElementById("cart-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cart-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;

        // Ép Style trực tiếp tránh bị ẩn/đè
        toast.style.cssText = `
            position: fixed !important;
            right: 24px !important;
            bottom: 24px !important;
            background-color: #0c513f !important;
            color: #ffffff !important;
            padding: 14px 22px !important;
            border-radius: 14px !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
            z-index: 999999 !important;
            display: block !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: all 0.3s ease !important;
        `;

        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(12px)";
            setTimeout(() => { toast.style.display = "none"; }, 300);
        }, 2500);
    }

    // --- F. BẤM "XÁC NHẬN ĐẶT LỊCH" -> CHUYỂN TRANG CART.HTML ---
    const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            if (submitBtn.disabled) return;
            window.location.href = "cart.html";
        });
    }
});
