# SalonBook — hợp nhất Salon Owner vào trang hiện có

## Phạm vi
- **Trang quản lý chính duy nhất:** `salon-owner.html`. Không tạo thêm `salon-dashboard.html`.
- Giữ nguyên giao diện/sidebar/logic quản lý Tổng quan, Lịch hẹn, Dịch vụ, Stylist, Thông tin Salon của dự án gốc.
- Bổ sung tab **Khung giờ Stylist**, **Tuyển mẫu tóc**, bộ lọc lịch theo ngày và thao tác xóa stylist (chặn khi có lịch đã xác nhận).
- **Dữ liệu mẫu:** The Hair Space (`salonId = 1`) từ `js/products.js`, danh sách tin từ `js/hairmodels.js`; danh sách ứng tuyển hiện là dữ liệu giả lập nội bộ.
- **Tài khoản demo bổ sung:** `owner1@salonbook.test` / `Salon@123` (phải chọn Chủ Salon), vẫn giữ tài khoản `owner@salonbook.demo` trước đây.
- `localStorage` key được giữ như phiên bản cũ: `salonbook.owner.<userId>`, không xóa dữ liệu đã sửa trên máy người dùng.

## Test nhanh
1. Chạy bằng Live Server/HTTP server, mở `auth.html`, đăng nhập chủ salon.
2. Mở `salon-owner.html`, xác minh các tab cũ còn hoạt động.
3. Chọn **Khung giờ Stylist**, chọn ngày, bật/tắt giờ hoặc chọn ca; tải lại trang, xác minh dữ liệu được lưu.
4. Giờ có booking `confirmed` cho đúng ngày/thợ sẽ bị khóa. Booking khác trạng thái không bị khóa.
5. Trong **Lịch hẹn**, lọc theo ngày và trạng thái; cập nhật booking từ `confirmed` sang `completed` hoặc `cancelled`.
6. Trong **Tuyển mẫu tóc**, sửa, đóng/mở tin; duyệt/từ chối đơn mẫu; tải lại trang để xác minh lưu.
7. Kiểm tra khi chưa đăng nhập/đăng nhập khách hàng: không vào được trang owner.

## Cấu trúc dữ liệu dự kiến khi kết nối API
- `salon`: `{salonId, ownerId, name, address, phone, opening, closing, description}`
- `stylists[]`: `{stylistId, salonId, name, specialty, status, availableHours[], availabilityByDate: {"YYYY-MM-DD": ["HH:mm"]}}`
- `services[]`: `{serviceId, salonId, name, price, duration}`
- `appointments[]`: `{bookingId, salonId, stylistId, serviceId, customer, service, date, time, status}`
- `hair_models[]`: `{hairModelId, salonId, title, serviceName, requirement, cost, slots, deadline, status}`
- `hair_model_applications[]`: `{applicationId, salonId, hairModelId, applicantName, date, status}`

`availableHours` là khung giờ mặc định; `availabilityByDate` lưu ghi đè cho từng ngày. Khi tích hợp Laravel cần thống nhất `bookingId`, `stylistId`, `serviceId` với ID cơ sở dữ liệu và triển khai API xác thực/phân quyền phía server.

## Giới hạn trung thực
- Đây là **dashboard demo Front-end**, không phải kết nối Laravel, không có đồng bộ hai chiều với trang khách đặt lịch; không có thanh toán.
- Kiểm tra role trong `localStorage` không phải bảo mật. API thật phải lấy salon sở hữu từ phiên đăng nhập phía server và kiểm tra authorization cho mọi thao tác.
- Với người dùng đã có `salonbook.owner.<userId>`, code giữ dữ liệu đã lưu và chỉ thêm trường mới còn thiếu; ID cũ trong state không bị tự ý thay đổi.
- Không chỉnh sửa `products.js` hay `hairmodels.js`; các thay đổi trong dashboard không cập nhật danh sách công khai cho khách hàng.
