/* ============================================================
   SALONBOOK - QUẢN LÝ TRANG CHI TIẾT SALON / DỊCH VỤ
   - Bước 1: Giữ bảng tóm tắt; lấy đúng salon theo salonId & dịch vụ theo serviceId
   - Bước 2: Hiển thị ảnh, địa chỉ, giờ hoạt động, dịch vụ, giá, đánh giá từ products.js
   - Bước 6: Tuyển mẫu tóc của salon (hairmodels.js) & Nhận xét khách hàng
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    // 1. Lấy đúng salonId và serviceId từ URL (hỗ trợ cả ?salonId=, ?id=, ?salon=)
    const rawSalonId = params.get("salonId") || params.get("id") || params.get("salon") || "1";
    const requestedServiceId = params.get("serviceId") || "";

    const catalog = (typeof products !== "undefined" && Array.isArray(products)) ? products : [];
    const product = catalog.find(
        p => String(p.id) === String(rawSalonId) || String(p.slug) === String(rawSalonId)
    );

    if (!product) {
        const mainEl = document.getElementById("main-content");
        if (mainEl) {
            mainEl.innerHTML = `
                <div style="text-align: center; padding: 80px 20px;">
                    <h2>Salon không tồn tại hoặc đã bị xóa.</h2>
                    <p style="color:#587269; margin: 10px 0 20px;">Vui lòng quay lại danh sách để chọn salon khác.</p>
                    <a href="products.html" class="btn btn-yellow" style="display: inline-block;">Quay lại danh sách</a>
                </div>
            `;
        }
        return;
    }

    document.title = `${product.name || "Chi tiết salon"} | SalonBook`;

    // --- BƯỚC 2: HIỂN THỊ ẢNH, ĐỊA CHỈ, GIỜ HOẠT ĐỘNG, ĐÁNH GIÁ TỪ PRODUCTS.JS ---
    const labelEl = document.getElementById("detail-category-district");
    const titleEl = document.getElementById("detail-title");
    const ratingSummaryEl = document.getElementById("detail-rating-summary");
    const descEl = document.querySelector(".detail-description");
    const addressEl = document.getElementById("detail-address");
    const imgEl = document.querySelector(".detail-image img");

    const typeMap = { nam: "SALON NAM / BARBERSHOP", nu: "SALON NỮ", unisex: "SALON UNISEX" };
    const typeLabel = typeMap[product.salonType] || (product.category || "SALON TÓC").toUpperCase();

    if (labelEl) {
        labelEl.textContent = `${typeLabel} · ${(product.districtName || "TP.HCM").toUpperCase()}`;
    }
    if (titleEl) {
        titleEl.textContent = product.name || "Đang cập nhật tên salon";
    }
    if (descEl) {
        descEl.textContent = product.description || "Chưa có mô tả chi tiết cho salon này.";
    }
    if (imgEl) {
        imgEl.src = product.image || "images/salonbook-mark.png";
        imgEl.alt = product.name || "Hình ảnh salon";
        imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = "images/salonbook-mark.png"; };
    }

    // Hiển thị Giờ hoạt động & Địa chỉ an toàn (không lỗi nếu thiếu openingHours)
    const hours = product.openingHours || {};
    const openDays = hours.days || "Thứ Hai - Chủ Nhật";
    const openRange = (hours.open && hours.close) ? `${hours.open} – ${hours.close}` : "Đang cập nhật giờ mở cửa";
    const closedNote = Array.isArray(hours.closedDays) && hours.closedDays.length > 0
        ? ` (Nghỉ: ${hours.closedDays.join(", ")})`
        : "";

    if (addressEl) {
        addressEl.innerHTML = `
            <div style="font-size: 14px; color: #0a4336; margin-bottom: 8px; font-weight: 600;">
                📍 ${product.address || "Địa chỉ đang cập nhật"}
            </div>
            <div style="font-size: 14px; color: #0c513f; margin-bottom: 12px; font-weight: 600;">
                🕒 Giờ hoạt động: <span style="font-weight: 500;">${openDays} (${openRange})${closedNote}</span>
            </div>
            <div>
                <a href="${product.map || '#'}" target="_blank" rel="noopener noreferrer" class="btn-map-highlight">
                    📍 Xem vị trí trên Google Maps ↗
                </a>
            </div>
        `;
    }

    function renderTopRating(reviewsArr) {
        if (!ratingSummaryEl) return;
        const count = Array.isArray(reviewsArr) ? reviewsArr.length : (product.reviewCount || 0);
        const avg = (Array.isArray(reviewsArr) && reviewsArr.length > 0)
            ? (reviewsArr.reduce((s, r) => s + Number(r.rating || 5), 0) / reviewsArr.length).toFixed(1)
            : (product.rating || "Chưa có");
        ratingSummaryEl.innerHTML = `⭐ ${avg} / 5.0 <span style="color:#587269; font-weight:500;">(${count} nhận xét)</span>`;
    }

    // Đổ thông tin salon ban đầu vào Bảng tóm tắt xanh
    const summarySalonName = document.getElementById("summary-salon-name");
    const summarySalonLocation = document.getElementById("summary-salon-location");
    if (summarySalonName) summarySalonName.textContent = product.name || "Đang cập nhật";
    if (summarySalonLocation) summarySalonLocation.textContent = product.districtName || product.address || "TP.HCM";

    // --- BƯỚC 1 & 2: RENDER DỊCH VỤ, GIÁ VÀ ĐỒNG BỘ BẢNG TÓM TẮT ---
    const serviceGrid = document.getElementById("detail-service-grid");
    const serviceSelect = document.getElementById("detail-service-select");
    const stylistSelect = document.getElementById("detail-stylist-select");
    const dateInput = document.getElementById("detail-date");
    const timeGrid = document.getElementById("detail-time-grid");

    const summaryServiceName = document.getElementById("summary-service-name");
    const summaryStylistName = document.getElementById("summary-stylist-name");
    const summaryTime = document.getElementById("summary-time");
    const summaryPrice = document.getElementById("summary-price");

    const servicesList = Array.isArray(product.servicesList) ? product.servicesList : [];
    const stylistsList = Array.isArray(product.stylists) ? product.stylists : [];

    const todayDate = new Date();
    const todayLocal = new Date(todayDate.getTime() - todayDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (dateInput) dateInput.min = todayLocal;

    let currentSelection = {
        salonId: product.id,
        serviceId: "",
        serviceName: "",
        servicePrice: 0,
        stylistId: "",
        stylistName: "",
        date: "",
        time: ""
    };

    function updateSummaryUI() {
        if (summaryServiceName) summaryServiceName.textContent = currentSelection.serviceName || "Chưa chọn dịch vụ";
        if (summaryStylistName) summaryStylistName.textContent = currentSelection.stylistName || "Chưa chọn chuyên viên";
        if (summaryTime) {
            if (currentSelection.time && currentSelection.date) {
                summaryTime.textContent = `${currentSelection.time} · ${currentSelection.date}`;
            } else if (currentSelection.date) {
                summaryTime.textContent = `${currentSelection.date} · Chưa chọn giờ`;
            } else {
                summaryTime.textContent = "Chưa chọn ngày/giờ";
            }
        }
        if (summaryPrice) {
            summaryPrice.textContent = currentSelection.servicePrice > 0
                ? `${currentSelection.servicePrice.toLocaleString("vi-VN")} ₫`
                : "Đang cập nhật";
        }
    }

    function selectServiceById(targetServiceId) {
        const found = servicesList.find(
            s => String(s.id) === String(targetServiceId) || String(s.value) === String(targetServiceId)
        );
        if (found) {
            currentSelection.serviceId = String(found.id);
            currentSelection.serviceName = found.name;
            currentSelection.servicePrice = Number(found.price) || 0;
            if (serviceSelect) serviceSelect.value = String(found.id);
        } else {
            currentSelection.serviceId = "";
            currentSelection.serviceName = "";
            currentSelection.servicePrice = 0;
            if (serviceSelect) serviceSelect.value = "";
        }
        updateSummaryUI();
    }

    // Render động thẻ dịch vụ ở Phần 2
    if (serviceGrid) {
        if (servicesList.length === 0) {
            serviceGrid.innerHTML = `<p style="color:#587269;">Salon hiện chưa cập nhật bảng giá dịch vụ.</p>`;
        } else {
            serviceGrid.innerHTML = servicesList.map((srv, idx) => `
                <article class="detail-service-card" data-service-id="${srv.id}">
                    <span class="detail-service-number">0${idx + 1} · ${srv.duration ? srv.duration + " PHÚT" : "DỊCH VỤ"}</span>
                    <h3>${srv.name}</h3>
                    <p>Dịch vụ chuyên nghiệp tại ${product.name}. Bấm nút bên dưới để chọn vào bảng tóm tắt.</p>
                    <div class="detail-service-bottom">
                        <span style="font-size:18px; font-weight:800; color:#0c513f;">${Number(srv.price).toLocaleString("vi-VN")} ₫</span>
                        <a href="#booking" class="btn-pick-service" data-service-id="${srv.id}" title="Chọn dịch vụ này">↗</a>
                    </div>
                </article>
            `).join("");

            serviceGrid.querySelectorAll(".btn-pick-service").forEach(btn => {
                btn.addEventListener("click", () => {
                    selectServiceById(btn.getAttribute("data-service-id"));
                });
            });
        }
    }

    // Nạp Dropdown 01. Dịch vụ
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Chọn dịch vụ</option>' +
            servicesList.map(s => `<option value="${s.id}">${s.name} - ${Number(s.price).toLocaleString("vi-VN")} ₫</option>`).join("");
        serviceSelect.addEventListener("change", (e) => selectServiceById(e.target.value));
    }

    // Tự động chọn dịch vụ nếu URL truyền ?serviceId=...
    if (requestedServiceId) {
        selectServiceById(requestedServiceId);
    }

    // Nạp Dropdown 02. Chuyên viên
    if (stylistSelect) {
        stylistSelect.innerHTML = '<option value="">Chọn chuyên viên</option>' +
            stylistsList.map(st => `<option value="${st.id}">${st.name}${st.experience ? ` (${st.experience})` : ""}</option>`).join("");
    }

    function renderTimeSlots() {
        if (!timeGrid) return;
        if (!currentSelection.stylistId) {
            timeGrid.innerHTML = '<button type="button" disabled style="padding:10px; width:100%; border:1px dashed #ccc; background:#f9f9f9; color:#666; border-radius:8px;">Vui lòng chọn 02. Chuyên viên</button>';
            return;
        }
        if (!currentSelection.date) {
            timeGrid.innerHTML = '<button type="button" disabled style="padding:10px; width:100%; border:1px dashed #0c513f; background:#e5f0e8; color:#0c513f; font-weight:600; border-radius:8px;">Vui lòng chọn 03. Ngày dự kiến để xem khung giờ</button>';
            return;
        }
        const stObj = stylistsList.find(s => String(s.id) === String(currentSelection.stylistId));
        const slots = (stObj && Array.isArray(stObj.availableHours) && stObj.availableHours.length > 0)
            ? stObj.availableHours
            : ["09:00", "10:30", "14:00", "16:00", "18:30"];

        timeGrid.innerHTML = slots.map(hour => `
            <button type="button" class="btn-time-slot" data-time="${hour}" style="padding:8px 14px; margin:4px; border:1px solid #0c513f; border-radius:6px; background:${currentSelection.time === hour ? '#ffc501' : '#fff'}; color:#0c513f; cursor:pointer; font-weight:600;">
                ${hour}
            </button>
        `).join("");

        timeGrid.querySelectorAll(".btn-time-slot").forEach(btn => {
            btn.addEventListener("click", () => {
                timeGrid.querySelectorAll(".btn-time-slot").forEach(b => { b.style.background = "#fff"; });
                btn.style.background = "#ffc501";
                currentSelection.time = btn.getAttribute("data-time");
                updateSummaryUI();
            });
        });
    }

    if (stylistSelect) {
        stylistSelect.addEventListener("change", (e) => {
            const stObj = stylistsList.find(s => String(s.id) === String(e.target.value));
            currentSelection.stylistId = stObj ? String(stObj.id) : "";
            currentSelection.stylistName = stObj ? stObj.name : "";
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

    // Hỗ trợ chỉnh sửa từ Giỏ dịch vụ (?editKey=...)
    const editKey = params.get("editKey");
    const editItem = (editKey && window.SalonCart)
        ? window.SalonCart.getCart().find(item => item.key === editKey && String(item.salonId) === String(product.id))
        : null;

    if (editItem) {
        selectServiceById(editItem.serviceId);
        if (stylistSelect && editItem.stylistId) {
            stylistSelect.value = editItem.stylistId;
            stylistSelect.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (dateInput && editItem.date && editItem.date >= todayLocal) {
            dateInput.value = editItem.date;
            dateInput.dispatchEvent(new Event("change", { bubbles: true }));
            const slotBtn = timeGrid?.querySelector(`.btn-time-slot[data-time="${editItem.time}"]`);
            if (slotBtn) slotBtn.click();
        }
        const addBtn = document.getElementById("add-to-cart-btn");
        if (addBtn) addBtn.textContent = "✓ Lưu thay đổi lịch hẹn vào giỏ";
    }

    // --- CHUYỂN DỮ LIỆU SANG GIỎ DỊCH VỤ (CART.JS) ---
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (!currentSelection.serviceId) return alert("Vui lòng chọn 01. Dịch vụ!");
            if (!currentSelection.stylistId) return alert("Vui lòng chọn 02. Chuyên viên!");
            if (!currentSelection.date) return alert("Vui lòng chọn 03. Ngày dự kiến!");
            if (!currentSelection.time) return alert("Vui lòng chọn 04. Khung giờ!");
            if (currentSelection.date < todayLocal) return alert("Ngày đã qua, vui lòng chọn lại ngày dự kiến!");
            if (!window.SalonCart) return alert("Giỏ hàng chưa sẵn sàng. Vui lòng tải lại trang.");

            const booking = {
                stylistId: currentSelection.stylistId,
                date: currentSelection.date,
                time: currentSelection.time
            };
            const saved = editItem
                ? window.SalonCart.updateBooking(editItem.key, { ...booking, serviceId: currentSelection.serviceId })
                : window.SalonCart.addToCart(product.id, currentSelection.serviceId, 1, booking);

            if (!saved) return alert("Không lưu được vào giỏ. Hãy kiểm tra lại thông tin đã chọn.");
            showToastSuccess("Đã thêm dịch vụ & lịch dự kiến vào giỏ!");
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
            position: fixed !important; right: 24px !important; bottom: 24px !important;
            background-color: #0c513f !important; color: #ffffff !important;
            padding: 14px 22px !important; border-radius: 14px !important;
            font-weight: 700 !important; font-size: 14px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
            z-index: 999999 !important; display: block !important; opacity: 1 !important;
        `;
        clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => { toast.style.display = "none"; }, 2500);
    }

    // --- BƯỚC 6A: MỤC TUYỂN MẪU TÓC CỦA SALON (HAIRMODELS.JS) ---
    const hairModelsContainer = document.getElementById("hair-models-list");
    if (hairModelsContainer) {
        const allModels = (typeof hairModels !== "undefined" && Array.isArray(hairModels)) ? hairModels : [];
        const salonModels = allModels.filter(m => String(m.salonId) === String(product.id));

        if (salonModels.length === 0) {
            hairModelsContainer.innerHTML = `
                <div style="background:#fff; border:1px dashed #dce7df; border-radius:18px; padding:24px; color:#587269;">
                    Hiện tại <strong>${product.name}</strong> chưa có tin tuyển mẫu tóc mới.
                </div>
            `;
        } else {
            hairModelsContainer.innerHTML = salonModels.map(model => `
                <article style="background:#fff; border:1px solid #dce7df; border-radius:20px; padding:24px; display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:800; color:#0c513f; background:#e5f0e8; padding:4px 10px; border-radius:999px;">
                            ${model.serviceName || "Tuyển mẫu"}
                        </span>
                        <span style="font-size:12px; font-weight:700; color:#d97706;">
                            ${model.status || "Đang tuyển"} · Còn ${model.slots || 1} suất
                        </span>
                    </div>
                    <h3 style="margin:4px 0; font-size:19px; color:#0a4336;">${model.title}</h3>
                    <p style="margin:0; font-size:14px; color:#587269; line-height:1.6;">
                        <strong>Yêu cầu:</strong> ${model.requirement || "Trao đổi trực tiếp với salon"}
                    </p>
                    <p style="margin:0; font-size:14px; color:#0c513f; font-weight:700;">
                        💰 Chi phí: ${model.cost || "Miễn phí"}
                    </p>
                    <small style="color:#587269;">Hạn đăng ký: ${model.deadline || "Đang mở"}</small>
                    <button type="button" class="btn btn-yellow btn-apply-model" data-model-title="${model.title}" style="margin-top:auto; padding:11px 16px; border-radius:12px;">
                        Đăng ký làm mẫu tóc ↗
                    </button>
                </article>
            `).join("");

            hairModelsContainer.querySelectorAll(".btn-apply-model").forEach(btn => {
                btn.addEventListener("click", () => {
                    const modelTitle = btn.getAttribute("data-model-title");
                    const applicantName = prompt(`Đăng ký: "${modelTitle}"\nNhập họ và tên của bạn:`);
                    if (!applicantName || !applicantName.trim()) return;
                    const applicantPhone = prompt("Nhập số điện thoại liên hệ của bạn:");
                    if (!applicantPhone || !applicantPhone.trim()) return;

                    showToastSuccess(`Đã gửi hồ sơ ứng tuyển "${modelTitle}" tới ${product.name}!`);
                });
            });
        }
    }

    // --- BƯỚC 6B: MỤC NHẬN XÉT & ĐÁNH GIÁ CỦA SALON ---
    const reviewsListEl = document.getElementById("salon-reviews-list");
    const reviewForm = document.getElementById("review-form");
    const storageReviewKey = `salonbook_reviews_${product.id}`;

    function getCombinedReviews() {
        const baseReviews = Array.isArray(product.reviewsList) ? product.reviewsList : [];
        let extraReviews = [];
        try {
            const raw = localStorage.getItem(storageReviewKey);
            if (raw) extraReviews = JSON.parse(raw);
        } catch (_) {}
        return [...extraReviews, ...baseReviews];
    }

    function renderReviews() {
        const allReviews = getCombinedReviews();
        renderTopRating(allReviews);

        if (!reviewsListEl) return;
        if (allReviews.length === 0) {
            reviewsListEl.innerHTML = `
                <div style="background:#fff; border:1px dashed #dce7df; border-radius:18px; padding:24px; color:#587269;">
                    Chưa có nhận xét nào cho salon này. Hãy là người đầu tiên để lại đánh giá!
                </div>
            `;
            return;
        }

        reviewsListEl.innerHTML = allReviews.map(rev => {
            const stars = "⭐".repeat(Math.max(1, Math.min(5, Number(rev.rating) || 5)));
            return `
                <article style="background:#fff; border:1px solid #dce7df; border-radius:18px; padding:20px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <strong style="color:#0a4336; font-size:15px;">${rev.userName || "Khách hàng"}</strong>
                        <span style="font-size:12px; color:#587269;">${rev.date || ""}</span>
                    </div>
                    <div style="margin-bottom:8px; font-size:13px;">${stars}</div>
                    <p style="margin:0; font-size:14px; color:#1f2937; line-height:1.6;">${rev.comment || ""}</p>
                </article>
            `;
        }).join("");
    }

    renderReviews();

    if (reviewForm) {
        reviewForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const nameInput = document.getElementById("review-user-name");
            const ratingInput = document.getElementById("review-rating");
            const commentInput = document.getElementById("review-comment");

            const userName = nameInput.value.trim();
            const rating = Number(ratingInput.value) || 5;
            const comment = commentInput.value.trim();
            if (!userName || !comment) return;

            let savedList = [];
            try {
                savedList = JSON.parse(localStorage.getItem(storageReviewKey) || "[]");
            } catch (_) {}

            savedList.unshift({
                id: "rev_" + Date.now(),
                userName,
                rating,
                comment,
                date: todayLocal
            });

            try {
                localStorage.setItem(storageReviewKey, JSON.stringify(savedList));
            } catch (_) {}

            reviewForm.reset();
            renderReviews();
            showToastSuccess("Cảm ơn bạn đã gửi nhận xét!");
        });
    }
});
