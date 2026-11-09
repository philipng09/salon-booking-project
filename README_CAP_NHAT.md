# SalonBook — Bổ sung đủ thông tin đặt lịch vào giỏ hàng

## Điều đã sửa

1. **Trang Khám phá salon (`products.html`)**: bỏ nút `+ Thêm Cắt & tạo kiểu`; mỗi thẻ salon chỉ còn nút `Xem chi tiết`. Dữ liệu lọc/tìm kiếm/sắp xếp giữ nguyên.
2. **Trang Chi tiết salon (`js/product-detail.js`)**: khi nhấn `+ Thêm dịch vụ đã chọn vào giỏ`, lưu đủ `dịch vụ`, `chuyên viên`, `ngày`, `khung giờ`. Không cho thêm khi thiếu thông tin hoặc chọn ngày đã qua; khung giờ phải thuộc danh sách của chuyên viên được chọn.
3. **Trang Giỏ (`cart.html` + `js/cart.js` + CSS mới)**: mỗi mục có ảnh, salon, dịch vụ, chuyên viên, ngày, giờ, đơn giá, số lượng, thành tiền. Có liên kết **Chỉnh sửa/Bổ sung thông tin lịch hẹn**, mở lại đúng salon và điền sẵn lịch đã có.
4. **Dữ liệu giỏ**: lịch khác nhau của cùng một dịch vụ được giữ ở những dòng riêng, lịch giống hoàn toàn thì cộng số lượng; vẫn đọc được cart cũ chỉ có `salonId`, `serviceId`, `quantity`.
5. **Lưu trữ và badge**: tiếp tục dùng `localStorage['cart']` và badge giỏ hàng trên các trang, không tạo hệ thống giỏ thứ hai.

**Quan trọng:** Đây là nguyên mẫu học tập. Danh sách `availableHours` trong `js/products.js` là dữ liệu mẫu; không xác nhận được thợ rảnh thật hoặc lịch hẹn đã đặt. Không có thanh toán hay booking phía server.

## Cách áp dụng vào GitHub Desktop + VS Code

1. Mở GitHub Desktop, chọn repo **salon-booking-project**. Vì nhánh `feature/cart-service-buoi3` đã cũ so với `main`, hãy **Fetch/Pull** nhánh `main` mới nhất trước, rồi tạo một nhánh mới, ví dụ `feature/cart-booking-details` từ `main`. Đừng trực tiếp sửa nhánh `main` của cả nhóm.
2. Giải nén ZIP. Copy **`apply_booking_update.py`** và cả thư mục **`booking_update_assets`** vào thư mục gốc `salon-booking-project` (ngang hàng với `index.html`, `cart.html`, `js`). KHÔNG cần tự copy file thay thế vào `js`.
3. Mở repository đó trong VS Code, chọn **Terminal → New Terminal**, chạy:
   ```powershell
   python apply_booking_update.py
   ```
   Script chỉ sửa `products.html`, `js/product-detail.js`, `cart.html` và cập nhật `js/cart.js`, `css/cart-booking.css`, `tests/cart-booking.test.cjs`. Các file tồn tại trước khi sửa có bản sao `.before-booking-update.bak`.
4. Chạy kiểm thử:
   ```powershell
   node --test tests/cart.test.cjs tests/cart-booking.test.cjs
   ```
   Dự kiến **25/25 ca đạt** (13 cũ + 12 mới) trên mã nguồn phù hợp.
5. Mở `products.html` bằng **Live Server** rồi thử luồng: **Xem chi tiết → chọn dịch vụ → chọn chuyên viên → chọn ngày tương lai → chọn khung giờ → Thêm vào giỏ → mở cart.html**. Kiểm tra 4 trường, tổng tiền, xóa mục, tải lại và chỉnh sửa lịch. Kiểm tra thêm ở màn hình nhỏ.
6. GitHub Desktop → Changes: **không chọn** file `*.before-booking-update.bak`, và **không commit** cả thư mục `booking_update_assets` (chỉ là gói cài đặt). Commit các file HTML/JS/CSS/test đã cập nhật với message `feat: show complete booking details in cart`. Nhấn **Publish branch**, sau đó tạo Pull Request sang `main` để TV5 rà soát.

## Trường hợp không chạy được script

Nếu Terminal báo `Không tìm được vùng khung giờ` hoặc `Không tìm thấy lệnh lưu giỏ cũ`, nghĩa là `js/product-detail.js` của nhóm đã đổi cấu trúc kể từ bản chính mình kiểm tra ngày 09/11/2026. **Không cố chạy hoặc ghi đè file**; gửi lại mã mới để rà soát điểm tích hợp cho đúng.

## Cấu trúc giỏ hàng sau khi thêm lịch

```json
[
  {
    "key": "1:s1_1@st1_1@2026-11-20@09:00",
    "salonId": 1,
    "serviceId": "s1_1",
    "stylistId": "st1_1",
    "date": "2026-11-20",
    "time": "09:00",
    "quantity": 1
  }
]
```

Giá / tên lấy lại từ `js/products.js`, không sử dụng đơn giá lưu từ trình duyệt. Người dùng phải kiểm tra giờ trên website vào đúng ngày sử dụng. Mục từ bản giỏ cũ sẽ được giữ lại và hiển thị "Chưa chọn" cho những trường chưa có; nhấn "Bổ sung thông tin lịch hẹn" để hoàn thiện.
