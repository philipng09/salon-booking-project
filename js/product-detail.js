/* ============================================================
   SALONBOOK - QUẢN LÝ TRANG CHI TIẾT & ĐẶT LỊCH (PRODUCT-DETAIL.JS)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Đọc đúng salon theo salonId (tương thích cả ?id= và ?salon=) và serviceId
    const params = new URLSearchParams(window.location.search);
    const rawSalonId = params.get("salonId") || params.get("id") || params.get("salon") || "1";
    const requestedServiceId = params.get("serviceId") || "";

    const product = typeof products !== "undefined"
        ? products.find(p => String(p.id) === String(rawSalonId) || String(p.slug) === String(rawSalonId))
        : null;

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
    const labelEl = document.querySelector(".detail-info .detail-label");
    const titleEl = document.getElementById("detail-title");
    const descEl = document.querySelector(".detail-description");
    const addressEl = document.getElementById("detail-address") || document.querySelector(".detail-address");
    const imgEl = document.querySelector(".detail-image img");

    if (labelEl) labelEl.textContent = `SALON TÓC · ${(product.districtName || "").toUpperCase()}`;
    if (titleEl) titleEl.textContent = product.name;
    if (descEl) descEl.textContent = product.description;

    if (addressEl) {
        addressEl.textContent = "";
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

    // Đổ tên Salon & Địa điểm lên Bảng tóm tắt xanh
    const summarySalonName = document.getElementById("summary-salon-name");
    const summarySalonLocation = document.getElementById("summary-salon-location");
    if (summarySalonName) summarySalonName.textContent = product.name;
    if (summarySalonLocation) summarySalonLocation.textContent = product.districtName || product.address;

    // --- B. KHỞI TẠO BIẾN FORM & BẢNG TÓM TẮT ---
    const serviceSelect = document.getElementById("detail-service-select");
    const stylistSelect = document.getElementById("detail-stylist-select");
    const dateInput = document.getElementById("detail-date");
    const timeGrid = document.getElementById("detail-time-grid");

    const todayDate = new Date();
    const todayLocal = new Date(todayDate.getTime() - todayDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (dateInput) dateInput.min = todayLocal;

    const summaryServiceName = document.getElementById("summary-service-name");
    const summaryStylistName = document.getElementById("summary-stylist-name");
    const summaryTime = document.getElementById("summary-time");
    const summaryPrice = document.getElementById("summary-price");

    let currentSelection = {
        serviceId: "",
        serviceName: "",
        servicePrice: 0,
        stylistName: "",
        date: "",
        time: ""
    };

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

    // --- C. NẠP DỊCH VỤ VÀO DROPDOWN 01 & GẮN SỰ KIỆN ---
    if (serviceSelect && product.servicesList) {
        let html = '<option value="">Chọn dịch vụ</option>';
        product.servicesList.forEach(s => {
            html += `<option value="${s.id}" data-name="${s.name}" data-price="${s.price}">${s.name} - ${s.price.toLocaleString("vi-VN")} ₫</option>`;
        });
        serviceSelect.innerHTML = html;

        serviceSelect.addEventListener("change", (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (e.target.value && opt) {
                currentSelection.serviceId = e.target.value;
                currentSelection.serviceName = opt.getAttribute("data-name");
                currentSelection.servicePrice = parseInt(opt.getAttribute("data-price")) || 0;
            } else {
                currentSelection.serviceId = "";
                currentSelection.serviceName = "";
                currentSelection.servicePrice = 0;
            }
            updateSummaryUI();
        });
    }

    // --- D. ĐỔ GIÁ THẬT VÀ GẮN NÚT MŨI TÊN ↗ CHO CÁC THẺ DỊCH VỤ PHẦN 2 ---
    const serviceCards = document.querySelectorAll(".detail-service-card");
    if (serviceCards.length > 0 && product.servicesList) {
        serviceCards.forEach((card, index) => {
            const serviceData = product.servicesList[index];
            if (serviceData) {
                card.style.display = "block";
                const titleNode = card.querySelector("h3");
                if (titleNode) titleNode.textContent = serviceData.name;

                const priceNode = card.querySelector(".detail-service-bottom span");
                if (priceNode) {
                    priceNode.textContent = `${serviceData.price.toLocaleString("vi-VN")} ₫`;
                    priceNode.style.fontSize = "18px";
                    priceNode.style.fontWeight = "800";
                    priceNode.style.color = "#0c513f";
                }

                // Bấm vào mũi tên ↗ -> chọn đúng dịch vụ đó xuống form & bảng tóm tắt
                const pickLink = card.querySelector(".detail-service-bottom a");
                if (pickLink && serviceSelect) {
                    pickLink.addEventListener("click", () => {
                        serviceSelect.value = String(serviceData.id);
                        serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
                    });
                }
            } else {
                card.style.display = "none";
            }
        });
    }

    // Tự động chọn sẵn dịch vụ nếu URL có ?serviceId=...
    if (requestedServiceId && serviceSelect && product.servicesList) {
        const matchedService = product.servicesList.find(
            s => String(s.id) === String(requestedServiceId) || String(s.value) === String(requestedServiceId)
        );
        if (matchedService) {
            serviceSelect.value = String(matchedService.id);
            serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    // --- E. NẠP CHUYÊN VIÊN & KHUNG GIỜ ---
    if (stylistSelect && product.stylists) {
        let html = '<option value="">Chọn chuyên viên</option>';
        product.stylists.forEach(tho => {
            html += `<option value="${tho.id}" data-name="${tho.name}">${tho.name} (${tho.experience})</option>`;
        });
        stylistSelect.innerHTML = html;
    }

    function renderTimeSlots() {
        if (!timeGrid) return;

        if (!currentSelection.stylistName) {
            timeGrid.innerHTML = '<button type="button" disabled style="padding: 10px; width: 100%; border: 1px dashed #ccc; background: #f9f9f9; color: #666; border-radius: 8px;">Vui lòng chọn 02. Chuyên viên</button>';
            return;
        }

        if (!currentSelection.date) {
            timeGrid.innerHTML = '<button type="button" disabled style="padding: 10px; width: 100%; border: 1px dashed #0c513f; background: #e5f0e8; color: #0c513f; font-weight: 600; border-radius: 8px;">Vui lòng chọn 03. Ngày dự kiến để xem khung giờ trống</button>';
            return;
        }

        const selectedStylist = product.stylists ? product.stylists.find(st => st.name === currentSelection.stylistName) : null;
        const hours = (selectedStylist && selectedStylist.availableHours) ? selectedStylist.availableHours : ["09:00", "10:30", "14:00", "16:00", "18:30"];

        timeGrid.innerHTML = hours.map(hour => `
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

    if (stylistSelect) {
        stylistSelect.addEventListener("change", (e) => {
            const selectedStylistId = e.target.value;
            const selectedStylist = product.stylists ? product.stylists.find(st => String(st.id) === String(selectedStylistId)) : null;
            currentSelection.stylistName = selectedStylist ? selectedStylist.name : "";
            currentSelection.time = "";
            renderTimeSlots();
            updateSummaryUI();
        });
    }

    if (dateInput) {
        dateInput.addEventListener("change", (e) => {
            currentSelection.date = e.target.value;
            currentSelection.time = "";
            renderTimeSlots();
            updateSummaryUI();
        });
    }

    renderTimeSlots();

    // Khôi phục lịch hẹn nếu mở từ giỏ hàng (?editKey=...)
    const cartBookingEditKey = params.get("editKey");
    const cartBookingEditItem = cartBookingEditKey && window.SalonCart
        ? window.SalonCart.getCart().find(item => item.key === cartBookingEditKey && String(item.salonId) === String(product.id))
        : null;

    if (cartBookingEditItem) {
        if (serviceSelect) {
            serviceSelect.value = String(cartBookingEditItem.serviceId);
            serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (stylistSelect && cartBookingEditItem.stylistId) {
            stylistSelect.value = cartBookingEditItem.stylistId;
            stylistSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (dateInput && cartBookingEditItem.date && cartBookingEditItem.date >= todayLocal) {
            dateInput.value = cartBookingEditItem.date;
            dateInput.dispatchEvent(new Event("change", { bubbles: true }));
            const originalSlot = timeGrid?.querySelector('.btn-time-slot[data-time="' + cartBookingEditItem.time + '"]');
            if (originalSlot) originalSlot.click();
        }
        const button = document.getElementById("add-to-cart-btn");
        if (button) button.textContent = "✓ Lưu thay đổi lịch hẹn";
    }

    // --- F. BẤM NÚT "+ THÊM DỊCH VỤ ĐÃ CHỌN VÀO GIỎ" ---
    const addToCartBtn = document.getElementById("add-to-cart-btn") || document.querySelector(".btn-outline");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!currentSelection.serviceId) return alert("Vui lòng chọn 01. Dịch vụ!");
            if (!currentSelection.stylistName) return alert("Vui lòng chọn 02. Chuyên viên!");
            if (!currentSelection.date) return alert("Vui lòng chọn 03. Ngày dự kiến!");
            if (!currentSelection.time) return alert("Vui lòng chọn 04. Khung giờ!");
            if (currentSelection.date < todayLocal) return alert("Ngày đã qua, vui lòng chọn lại ngày dự kiến!");

            const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }

            if (!window.SalonCart) return alert("Giỏ hàng chưa sẵn sàng. Vui lòng tải lại trang.");
            const booking = {
                stylistId: stylistSelect?.value,
                date: currentSelection.date,
                time: currentSelection.time
            };
            const saved = cartBookingEditItem
                ? window.SalonCart.updateBooking(cartBookingEditItem.key, { ...booking, serviceId: currentSelection.serviceId })
                : window.SalonCart.addToCart(product.id, currentSelection.serviceId, 1, booking);
            if (!saved) return alert("Không lưu được lịch hẹn. Hãy kiểm tra lại chuyên viên, ngày và giờ.");

            showToastSuccess("Đã thêm dịch vụ vào giỏ!");
        });
    }

    function showToastSuccess(message) {
        let toast = document.getElementById("cart-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cart-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
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

    // --- G. BẤM "ĐI ĐẾN GIỎ DỊCH VỤ" ---
    const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            if (submitBtn.disabled) return;
            window.location.href = "cart.html";
        });
    }
});
