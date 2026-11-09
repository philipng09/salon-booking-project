document.addEventListener("DOMContentLoaded", () => {
    // 1. Lấy ID salon từ URL (VD: product-detail.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || 1;
    const product = typeof products !== "undefined" ? products.find(p => p.id == productId) : null;

    if (!product) return;

    // --- A. ĐỔ DỮ LIỆU BAN ĐẦU SANG BẢNG XANH CÓ SẴN BÊN PHẢI ---
    const summaryItems = document.querySelectorAll(".detail-summary-item strong");
    // summaryItems[0]: Salon, summaryItems[1]: Địa điểm, summaryItems[2]: Dịch vụ, summaryItems[3]: Chuyên viên, summaryItems[4]: Thời gian, summaryItems[5]: Giá
    
    if (summaryItems.length >= 2) {
        summaryItems[0].textContent = product.name;
        summaryItems[1].textContent = product.districtName || product.address;
    }

    const serviceSelect = document.getElementById("detail-service-select");
    const stylistSelect = document.getElementById("detail-stylist-select");
    const dateInput = document.getElementById("detail-date");
    const timeGrid = document.querySelector(".detail-time-grid");
    const addToCartBtn = document.querySelector(".btn-add-cart") || document.getElementById("add-to-cart-btn");
    const submitBtn = document.querySelector(".detail-confirm");

    // Biến tạm lưu dữ liệu form bên trái
    let currentSelection = {
        serviceName: "",
        servicePrice: 0,
        stylistName: "",
        date: "",
        time: ""
    };

    // --- B. ĐỔ DỮ LIỆU DROPDOWN SELECT ---
    if (serviceSelect && product.servicesList) {
        let html = '<option value="">Chọn dịch vụ</option>';
        product.servicesList.forEach(s => {
            html += `<option value="${s.id}" data-name="${s.name}" data-price="${s.price}">${s.name} - ${s.price.toLocaleString("vi-VN")} ₫</option>`;
        });
        serviceSelect.innerHTML = html;
    }

    if (stylistSelect && product.stylists) {
        let html = '<option value="">Chọn chuyên viên</option>';
        product.stylists.forEach(tho => {
            html += `<option value="${tho.id}" data-name="${tho.name}">${tho.name} (${tho.experience})</option>`;
        });
        stylistSelect.innerHTML = html;
    }

    // --- C. LẮNG NGHE CHỌN FORM BÊN TRÁI ---
    if (serviceSelect) {
        serviceSelect.addEventListener("change", (e) => {
            const opt = e.target.options[e.target.selectedIndex];
            if (e.target.value) {
                currentSelection.serviceName = opt.getAttribute("data-name");
                currentSelection.servicePrice = parseInt(opt.getAttribute("data-price"));
            } else {
                currentSelection.serviceName = "";
                currentSelection.servicePrice = 0;
            }
        });
    }

    if (stylistSelect) {
        stylistSelect.addEventListener("change", (e) => {
            const selectedStylistId = e.target.value;
            const selectedStylist = product.stylists ? product.stylists.find(st => st.id === selectedStylistId) : null;

            if (selectedStylist) {
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

    if (dateInput) {
        dateInput.addEventListener("change", (e) => {
            currentSelection.date = e.target.value;
        });
    }

    // --- D. BẤM "+ THÊM DỊCH VỤ VÀO GIỎ" -> ĐỔ DỮ LIỆU SANG BẢNG XANH BÊN PHẢI ---
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", (e) => {
            e.preventDefault();

            if (!currentSelection.serviceName) return alert("Vui lòng chọn Dịch vụ!");
            if (!currentSelection.stylistName) return alert("Vui lòng chọn Chuyên viên!");
            if (!currentSelection.date) return alert("Vui lòng chọn Ngày dự kiến!");
            if (!currentSelection.time) return alert("Vui lòng chọn Khung giờ!");

            // Đổ vào đúng các dòng strong của Bảng Xanh bên phải có sẵn
            if (summaryItems.length >= 6) {
                summaryItems[2].textContent = currentSelection.serviceName;
                summaryItems[3].textContent = currentSelection.stylistName;
                summaryItems[4].textContent = `${currentSelection.time} - ${currentSelection.date}`;
                summaryItems[5].textContent = currentSelection.servicePrice.toLocaleString("vi-VN") + " ₫";
            }

            // Mở khóa nút "Xác nhận đặt lịch"
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }

            // Lưu vào localStorage cho giỏ hàng
            let cart = JSON.parse(localStorage.getItem("salonbook_cart")) || [];
            cart.push({
                salonName: product.name,
                serviceName: currentSelection.serviceName,
                price: currentSelection.servicePrice,
                stylistName: currentSelection.stylistName,
                date: currentSelection.date,
                time: currentSelection.time
            });
            localStorage.setItem("salonbook_cart", JSON.stringify(cart));

            alert("✅ Đã cập nhật vào Bảng thông tin đặt lịch bên phải!");
        });
    }

    // --- E. BẤM "XÁC NHẬN ĐẶT LỊCH" -> SANG CART.HTML ---
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            if (submitBtn.disabled) return;
            window.location.href = "cart.html";
        });
    }
});
