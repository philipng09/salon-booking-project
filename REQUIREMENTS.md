# Requirements

## 1. Mục tiêu dự án
Xây dựng nền tảng website đặt lịch dịch vụ salon tóc trực tuyến, giúp khách hàng dễ dàng tìm kiếm dịch vụ, chọn khung giờ/chuyên viên tạo mẫu tóc phù hợp, đồng thời hỗ trợ salon quản lý lịch hẹn, giảm thiểu tình trạng trùng lịch và tối ưu hóa thời gian phục vụ.

## 2. Phạm vi
### 2.1. Trong phạm vi (Phiên bản đầu tiên)
- Xem thông tin dịch vụ, bảng giá và các chương trình ưu đãi của salon.
- Đặt lịch làm dịch vụ: Chọn gói dịch vụ, thợ cắt tóc/stylist, ngày và khung giờ trống.
- Tra cứu, theo dõi và hủy lịch hẹn (đối với khách hàng có tài khoản).
- Quản trị viên quản lý danh mục dịch vụ, thời gian làm việc của nhân viên và trạng thái lịch hẹn.

### 2.2. Ngoài phạm vi (Phát triển sau)
- Tích hợp cổng thanh toán trực tuyến đa phương thức (VNPay, MoMo, Visa/Mastercard).
- Tính năng livestream tư vấn, chatbot gợi ý kiểu tóc thông minh AI.
- Hệ thống tích điểm đổi voucher và đánh giá gắn sao sau dịch vụ.
*Lưu ý: Nghiệp vụ giao nhận hàng không áp dụng vì đây là dịch vụ đặt lịch trực tiếp tại cơ sở.*

## 3. Người dùng
| Vai trò | Nhiệm vụ chính | Quyền hạn được làm | Không được phép làm |
| :--- | :--- | :--- | :--- |
| **Khách chưa đăng nhập** | Xem thông tin dịch vụ, bảng giá salon | - Xem danh sách dịch vụ, thợ cắt tóc.<br>- Tìm kiếm khung giờ còn trống.<br>- Điền thông tin cá nhân cơ bản để đặt lịch nhanh. | - Không xem được lịch sử hẹn của người khác.<br>- Không được sửa đổi thông tin hệ thống. |
| **Khách hàng có tài khoản** | Đặt lịch, theo dõi trạng thái và quản lý lịch cá nhân | - Toàn bộ quyền của khách chưa đăng nhập.<br>- Đặt lịch hẹn kèm lưu thông tin cá nhân.<br>- Xem, chỉnh sửa hoặc hủy lịch hẹn cá nhân (trước giờ hẹn). | - Tuyệt đối không được xem hoặc chỉnh sửa lịch hẹn của khách hàng khác.<br>- Không có quyền truy cập trang quản trị. |
| **Nhân viên Salon / Stylist ** | Tiếp nhận và thực hiện lịch dịch vụ | - Xem danh sách ca làm việc và danh sách khách hẹn theo tên mình.<br>- Cập nhật trạng thái lịch hẹn ("Đang phục vụ", "Hoàn thành"). | - Không được xóa dịch vụ hoặc can thiệp doanh thu toàn hệ thống. |
| **Quản trị viên** | Điều phối toàn bộ hoạt động của hệ thống salon | - Toàn quyền thêm, sửa, xóa dịch vụ, giá tiền, thời lượng.<br>- Quản lý lịch biểu của thợ, phê duyệt hoặc điều chuyển lịch hẹn.<br>- Quản lý tài khoản người dùng và xem thống kê lịch đặt. | - Không để lộ thông tin bảo mật/mật khẩu người dùng. |

## 4. Yêu cầu chức năng
| Mã | Chức năng | Mô tả | Người sử dụng | Ưu tiên | Tiêu chí nghiệm thu |
|---|---|---|---|---|---|
| **F01** | Xem danh sách dịch vụ | Hiển thị danh mục các gói cắt tóc, uốn, nhuộm kèm hình ảnh, mô tả và giá tiền. | Khách, Khách hàng | Bắt buộc | Hiển thị đúng dữ liệu dịch vụ từ hệ thống; thông tin giá rõ ràng. |
| **F02** | Xem lịch trống và chọn thợ | Chọn ngày, hệ thống trả về danh sách thợ cắt tóc và khung giờ còn trống tương ứng. | Khách, Khách hàng | Bắt buộc | Các khung giờ đã có người đặt phải bị ẩn hoặc vô hiệu hóa không cho bấm chọn. |
| **F03** | Đặt lịch hẹn | Khách nhập thông tin liên lạc (Họ tên, SĐT), chọn dịch vụ, thợ và khung giờ để xác nhận đặt chỗ. | Khách, Khách hàng | Bắt buộc | Đặt thành công trả về mã lịch hẹn; ghi nhận ngay vào cơ sở dữ liệu. |
| **F04** | Tra cứu và hủy lịch hẹn | Khách hàng kiểm tra lịch hẹn đã đặt và thực hiện hủy lịch nếu có việc bận (trước tối thiểu 2 giờ). | Khách hàng | Bắt buộc | Lịch sau khi hủy đổi trạng thái "Đã hủy"; khung giờ đó được mở lại cho khách khác đặt. |
| **F05** | Quản lý dịch vụ | Admin thêm mới, chỉnh sửa thông tin hoặc tạm ẩn các dịch vụ không kinh doanh. | Admin | Bắt buộc | Thay đổi được lưu vào CSDL và phản ánh ngay ngoài giao diện người dùng. |
| **F06** | Quản lý và điều phối lịch hẹn | Admin xem lịch tổng quan theo ngày, lọc theo trạng thái (Chờ duyệt, Đã xếp chỗ, Hoàn tất, Hủy). | Admin | Bắt buộc | Cập nhật được trạng thái đơn hẹn, không cho phép xảy ra xung đột 2 khách cùng 1 thợ trong 1 khung giờ. |
| **F07** | Đăng ký & Đăng nhập | Tạo tài khoản khách hàng để lưu lịch sử đặt chỗ. | Khách hàng | Tùy chọn (Giai đoạn sau) | Đăng nhập thành công chuyển về trang cá nhân; mã hóa mật khẩu an toàn. |
## 5. Yêu cầu phi chức năng
- **Tính đáp ứng giao diện:** Giao diện tương thích mượt mà trên cả máy tính bàn và điện thoại di động (Mobile First vì khách thường đặt lịch trên điện thoại).
- **Kiểm tra dữ liệu:** Kiểm tra định dạng số điện thoại hợp lệ (10 chữ số tại VN), không để trống tên và thời gian hẹn.
- **Phân quyền chặt chẽ:** Chỉ tài khoản có vai trò Quản trị viên mới được truy cập các đường dẫn quản lý (`/admin`).
- **Hiệu năng & Khả năng mở rộng:** Tải trang danh mục dịch vụ trong dưới 2 giây; cấu trúc mã nguồn được phân lớp rõ ràng.
- **Bảo mật:** Không công khai các thông tin bí mật cấu hình kết nối CSDL; bảo vệ thông tin liên lạc của khách hàng.

## 6. Giới hạn và giả định
- **Giới hạn thời gian:** Triển khai trong khuôn khổ học phần môn Phát triển ứng dụng Web/TMĐT.
- **Giới hạn công nghệ:** Sử dụng HTML5, CSS3, JavaScript cho frontend; backend ASP.NET Core MVC / EF Core theo chuẩn học phần.
- **Giả định:** Khách hàng đến đúng giờ đã hẹn; salon thanh toán trực tiếp bằng tiền mặt hoặc chuyển khoản tại quầy.
