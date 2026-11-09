// --- E. BẤM "+ THÊM DỊCH VỤ VÀO GIỎ" ---
    const addToCartBtn = document.getElementById("add-to-cart-btn") || document.querySelector(".btn-outline");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation(); // Ngăn sự kiện bị trùng lặp với file JS khác

            // 1. Kiểm tra đủ 4 điều kiện
            if (!currentSelection.serviceId) return alert("Vui lòng chọn 01. Dịch vụ!");
            if (!currentSelection.stylistName) return alert("Vui lòng chọn 02. Chuyên viên!");
            if (!currentSelection.date) return alert("Vui lòng chọn 03. Ngày dự kiến!");
            if (!currentSelection.time) return alert("Vui lòng chọn 04. Khung giờ!");

            // 2. Cập nhật Bảng Xanh bên phải
            if (summaryServiceName) summaryServiceName.textContent = currentSelection.serviceName;
            if (summaryStylistName) summaryStylistName.textContent = currentSelection.stylistName;
            if (summaryTime) summaryTime.textContent = `${currentSelection.time} - ${currentSelection.date}`;
            if (summaryPrice) {
                summaryPrice.textContent = currentSelection.servicePrice.toLocaleString("vi-VN") + " ₫";
            }

            // 3. Mở khóa nút "Xác nhận đặt lịch"
            const submitBtn = document.getElementById("btn-submit-booking") || document.querySelector(".detail-confirm");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            }

            // 4. Lưu vào giỏ hàng
            if (typeof window.SalonCart !== "undefined" && typeof window.SalonCart.addToCart === "function") {
                window.SalonCart.addToCart(product.id, currentSelection.serviceId);
            }

            // 5. BẮN TOAST THÀNH CÔNG VÀO GIAO DIỆN (TỰ DỰNG THẺ TRỰC TIẾP)
            showToastSuccess();
        });
    }

    // Hàm hiển thị Toast chắc chắn 100% không phụ thuộc CSS bên ngoài
    function showToastSuccess() {
        let toast = document.getElementById("cart-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "cart-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = "Đã thêm dịch vụ vào giỏ!";
        
        // Gán trực tiếp Style để không bị bất kỳ file CSS nào ghi đè
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

        // Tự ẩn sau 2.5 giây
        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(12px)";
            setTimeout(() => {
                toast.style.display = "none";
            }, 300);
        }, 2500);
    }
