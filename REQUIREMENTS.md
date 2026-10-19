# Requirements

## 1. Mục tiêu dự án
Xây dựng nền tảng thương mại điện tử hoạt động theo mô hình trung gian (Marketplace) kết nối trực tiếp người dùng có nhu cầu chăm sóc tóc với hệ thống các salon, barbershop từ bình dân đến chuyên nghiệp tại khu vực Thành phố Hồ Chí Minh.
- **Giá trị mang lại cho khách hàng:** Khách hàng (đặc biệt là học sinh, sinh viên và nhân viên văn phòng từ 16-40 tuổi) có một không gian số tập trung minh bạch để dễ dàng tìm kiếm salon theo khu vực, tra cứu bảng giá, đối chiếu phong cách, xem lịch trống và chủ động đặt lịch hẹn kèm thợ tạo mẫu tóc mong muốn; chấm dứt tình trạng phải nhắn tin/gọi điện thủ công và chờ đợi phản hồi.
- **Giá trị mang lại cho đối tác (Salon vừa và nhỏ):** Cung cấp công cụ số hóa quy trình quản lý lịch trình, tự động khóa khung giờ đã có khách nhằm triệt tiêu hoàn toàn tình trạng trùng lặp lịch thợ, tối ưu hóa công suất các ngày trong tuần và tiếp cận tệp khách hàng trực tuyến tiềm năng mà không phải tốn chi phí xây dựng website riêng.

## 2. Phạm vi

### Trong phạm vi (Phiên bản đầu tiên - MVP)
- **Danh mục & Bộ lọc nâng cao:** Khách hàng tìm kiếm, áp dụng bộ lọc đa tiêu chí: theo Quận/Khu vực tại TP.HCM, theo phân loại salon (Salon Nam/Barbershop, Salon Nữ, Salon Unisex), theo nhóm chuyên môn (Chuyên Cắt, Chuyên Uốn/Nhuộm, Gội đầu dưỡng sinh, Phục hồi tóc); xem bảng giá và danh sách stylist của từng salon (`salon_id`).
- **Quy trình Đặt chỗ (Booking):** Khách chọn salon (`salon_id`), chọn dịch vụ, chọn chuyên viên làm tóc, chọn ngày và khung giờ còn trống để tiến hành xác nhận đặt chỗ.
- **Quản lý lịch cá nhân:** Đăng ký/đăng nhập tài khoản khách hàng để lưu trữ và theo dõi lịch sử đặt chỗ.
- **Chính sách Hủy & Đổi lịch:** Khách hàng được phép hủy lịch hẹn trực tuyến (yêu cầu thực hiện trước giờ hẹn tối thiểu 2 tiếng). Để giảm tải độ phức tạp nghiệp vụ cho MVP, hệ thống **không hỗ trợ sửa đổi trực tiếp lịch đã đặt**; khách hàng có nhu cầu đổi lịch sẽ thực hiện hủy lịch cũ và tiến hành tạo một lượt đặt chỗ mới.
- **Đánh giá & Nhận xét Salon:** Khách hàng đã hoàn thành đơn dịch vụ có quyền gửi chấm điểm sao (1–5 sao) và nhận xét công khai về chất lượng phục vụ của salon/stylist; hiển thị điểm trung bình ngoài danh sách.
- **Quản trị phân cấp (Chủ salon):** Chủ salon quản lý thông tin tiệm, menu dịch vụ, đơn giá, danh sách thợ làm tóc, thiết lập ca trực/ngày nghỉ của thợ và cập nhật trạng thái đơn hẹn của salon mình.
- **Quản trị hệ thống (Admin sàn):** Phê duyệt, quản lý danh sách salon đối tác hoạt động trên nền tảng và quản trị tài khoản người dùng.

### Ngoài phạm vi (Phát triển ở các giai đoạn tiếp theo)
- Trợ lý ảo Chatbot AI tư vấn kiểu tóc theo khuôn mặt.
- Hệ thống tích lũy điểm thưởng thành viên quy đổi voucher giảm giá liên kết đa hệ thống.
- *Lưu ý nghiệp vụ:* Hoàn toàn không áp dụng nghiệp vụ giao nhận hàng (Shipping/Vận chuyển) do đặc thù 100% là dịch vụ tại chỗ.

## 3. Người dùng

| Vai trò | Nhiệm vụ chính | Quyền hạn được làm | Không được phép làm |
| :--- | :--- | :--- | :--- |
| **Khách vãng lai (Guest)** | Tìm hiểu thông tin, khảo sát dịch vụ salon | - Xem danh sách salon, sử dụng bộ lọc đa tiêu chí (Quận/Huyện, Nam/Nữ, chuyên cắt/nhuộm...).<br>- Xem menu dịch vụ, bảng giá, danh sách stylist và xem các đánh giá từ khách hàng trước.<br>- Xem các khung giờ còn trống của salon. | - Không xem được lịch sử đặt chỗ.<br>- Không được thực hiện đặt lịch hoặc gửi đánh giá (bắt buộc phải đăng nhập).<br>- Không có quyền chỉnh sửa bất kỳ dữ liệu nào. |
| **Khách hàng (Customer)** | Đặt chỗ, quản lý lịch và gửi đánh giá | - Toàn quyền của Khách vãng lai.<br>- Đặt lịch hẹn.<br>- Xem lịch sử đặt chỗ và trạng thái lịch đặt của bản thân.<br>- Hủy lịch hẹn trước giờ quy định (>= 2 tiếng).<br>- Gửi đánh giá sao và bình luận sau khi đơn hàng chuyển sang trạng thái "Hoàn thành". | - Tuyệt đối không được xem hoặc chỉnh sửa lịch hẹn của khách hàng khác.<br>- Không được sửa đổi lịch trực tiếp (phải hủy và đặt lại).<br>- Không có quyền truy cập vào các trang quản trị của salon và hệ thống. |
| **Chủ salon (Salon Owner / Manager)** | Quản lý thông tin salon, dịch vụ, nhân viên và lịch hẹn | - Cập nhật thông tin salon, gắn tag phân loại (Nam/Nữ, dịch vụ thế mạnh).<br>- Thêm, sửa, ẩn danh mục dịch vụ và bảng giá của salon mình.<br>- Quản lý danh sách thợ cắt tóc, phân ca trực và ngày nghỉ.<br>- Tiếp nhận, kiểm tra trạng thái đặt lịch và điều phối trạng thái lịch hẹn.<br>- Xem phản hồi, điểm đánh giá của khách hàng gửi cho salon mình. | - Chỉ được thao tác trên dữ liệu thuộc đúng `salon_id` được phân công.<br>- Tuyệt đối không được can thiệp vào đánh giá, đơn đặt, stylist hay doanh thu của salon khác.<br>- Không có quyền chỉnh sửa/xóa các nhận xét của khách hàng một cách tùy tiện; không can thiệp vào tài khoản admin sàn. |
| **Quản trị viên nền tảng (Platform Admin)** | Kiểm soát và duy trì hoạt động toàn sàn | - Quản lý danh mục đối tác salon: Phê duyệt salon mới, quản lý tag phân loại, khóa quyền salon vi phạm.<br>- Cấp và quản lý tài khoản dành cho các chủ salon.<br>-Giám sát hoạt động các salon và xử lý các đánh giá vi phạm tiêu chuẩn cộng đồng. | - Không trực tiếp thay đổi ca trực chi tiết hàng ngày của thợ thay cho từng salon. |


## 4. Yêu cầu chức năng

| Mã | Tên chức năng | Mô tả | Người sử dụng | Mức độ ưu tiên | Tiêu chí nghiệm thu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F01** | Tìm kiếm & Bộ lọc salon đa tiêu chí | Cho phép lọc danh sách salon theo nhiều tiêu chí kết hợp: theo Quận/Huyện tại TP.HCM, đối tượng phục vụ (Nam / Nữ / Unisex), và nhóm chuyên môn nổi bật (chuyên Cắt, Uốn, Nhuộm/Tẩy, Phục hồi...). | Guest, Customer | Bắt buộc (MVP) | Kết quả trả về chính xác theo các tiêu chí đã chọn; hiển thị rõ tên salon, địa chỉ, hình ảnh đại diện, tag chuyên môn và điểm đánh giá trung bình. |
| **F02** | Xem chi tiết thông tin, Menu & Stylist | Hiển thị thông tin một salon cụ thể: danh mục gói dịch vụ, bảng giá, danh sách stylist và không gian tiệm theo đúng `salon_id`. | Guest, Customer | Bắt buộc (MVP) | Dữ liệu dịch vụ, mức giá và thợ hiển thị đúng theo salon được chọn, không bị nhầm lẫn giữa các cơ sở. |
| **F03** | Đặt lịch làm dịch vụ (Booking) | Khách hàng chọn dịch vụ, stylist, ngày và khung giờ còn trống tại salon đã chọn; xác nhận đặt chỗ. | Customer | Bắt buộc (MVP) | Bản ghi Booking lưu đúng `salon_id`, `stylist_id`, `service_id`; khung giờ đã có khách hoặc thợ nghỉ tự động bị vô hiệu hóa; sinh mã booking hợp lệ. |
| **F04** | Quản lý lịch sử & Hủy lịch hẹn | Khách hàng theo dõi danh sách các lượt đặt chỗ cá nhân kèm trạng thái; thực hiện thao tác Hủy lịch nếu đáp ứng quy định thời gian. | Customer | Bắt buộc (MVP) | Chỉ hiển thị đơn của tài khoản đang đăng nhập; cho phép hủy nếu thời gian hiện tại cách giờ hẹn >= 2 tiếng; hủy xong mở lại slot giờ cho khách khác. |
| **F05** | Đánh giá & Nhận xét Salon | Khách hàng gửi điểm đánh giá (1-5 sao) và nhận xét trải nghiệm sau khi đơn hẹn chuyển sang trạng thái "Hoàn thành". Khách xem được tổng hợp đánh giá tại trang chi tiết salon. | Customer, Guest | Bắt buộc (MVP) | Chỉ những lịch hẹn có trạng thái "Hoàn thành" mới kích hoạt nút đánh giá; hệ thống tự động cập nhật lại điểm số trung bình của salon ngay sau khi có nhận xét mới. |
| **F06** | Đăng ký & Đăng nhập (Auth) | Cung cấp luồng xác thực tài khoản cho Khách hàng, Chủ salon và Admin sàn; phân quyền truy cập theo vai trò. | Mọi người dùng | Bắt buộc (MVP) | Đăng nhập đúng điều hướng theo vai trò; bảo vệ các URL quản trị; mật khẩu người dùng được mã hóa an toàn. |
| **F07** | Quản lý dịch vụ & Thông tin salon | Chủ salon cập nhật mô tả tiệm, tag phân loại (nam/nữ, cắt/nhuộm...), thêm mới, điều chỉnh giá hoặc tạm ẩn dịch vụ của riêng salon mình. | Salon Owner | Bắt buộc (MVP) | Dữ liệu được lưu với đúng `salon_id` của tài khoản đăng nhập; thay đổi hiển thị ngay lập tức ra giao diện khách hàng. |
| **F08** | Quản lý lịch làm việc & Ngày nghỉ thợ | Chủ salon thiết lập khung giờ làm việc, phân ca trực và đánh dấu ngày nghỉ phép cho từng stylist trong tuần. | Salon Owner | Bắt buộc (MVP) | Stylist có trạng thái nghỉ ca/nghỉ ngày sẽ tự động không hiển thị khung giờ trống trên màn hình đặt chỗ (F03) của khách hàng. |
| **F09** | Tiếp nhận & Điều phối trạng thái lịch hẹn | Chủ salon theo dõi danh sách khách đặt theo ngày và cập nhật trạng thái đơn hẹn theo chu trình dịch vụ. | Salon Owner | Bắt buộc (MVP) | Cho phép lọc theo ngày và trạng thái; chuyển đổi trạng thái đúng quy chuẩn (Chờ xác nhận -> Đã xác nhận -> Đang phục vụ -> Hoàn thành / Hủy); chặn thao tác trên đơn hàng salon khác. |
| **F10** | Quản lý danh sách đối tác & Kiểm duyệt sàn | Admin sàn phê duyệt salon mới, quản lý trạng thái salon (Kích hoạt/Khóa) và kiểm duyệt/xóa các nhận xét đánh giá vi phạm tiêu chuẩn. | Platform Admin | Bắt buộc (MVP) | Salon bị vô hiệu hóa sẽ không xuất hiện trên bộ lọc F01; nhận xét vi phạm bị gỡ sẽ không hiển thị trên trang salon. |

## 5. Yêu cầu phi chức năng

- **Bảo mật và toàn vẹn dữ liệu phân vùng:** Kiểm soát phân quyền chặt chẽ từ Backend (ASP.NET Core/EF Core). Khóa quyền truy cập chéo giữa các salon; ngăn chặn triệt để lỗ hổng IDOR (chủ salon thay đổi tham số ID trên URL/API để xem hoặc thao tác trên đơn của salon khác).
- **Ngăn chặn xung đột đặt chỗ:** Đảm bảo cơ chế khóa dữ liệu (locking/transaction) để không xảy ra hiện tượng "Double Booking" (hai khách hàng cùng thao tác đặt trùng một thợ trong cùng một khung giờ tại một salon).
- **Kiểm tra dữ liệu đầu vào:** Kiểm tra định dạng số điện thoại Việt Nam hợp lệ (10 chữ số), trường họ tên không chứa ký tự đặc biệt độc hại; ngày đặt hẹn bắt buộc phải ở thời gian tương lai và nằm trong khung giờ làm việc của salon; số sao đánh giá nằm trong thang điểm từ 1 đến 5.
- **Tính đáp ứng giao diện:** Thiết kế tối ưu hóa hiển thị mượt mà trên cả máy tính bàn và thiết bị di động, đảm bảo trải nghiệm thao tác lọc salon và đặt lịch trên màn hình cảm ứng điện thoại thuận tiện, trực quan.
- **Bảo vệ thông tin cá nhân:** Không lưu trữ mật khẩu dưới dạng văn bản thô (phải băm mật khẩu bằng thuật toán an toàn); bảo mật toàn bộ chuỗi kết nối cơ sở dữ liệu và khóa cấu hình trong tệp môi trường bí mật.

## 6. Giới hạn và giả định

- **Giới hạn thời gian và nhân lực:** Toàn bộ hệ thống được xây dựng và hoàn thiện trong phạm vi 1 học phần môn Phát triển ứng dụng Web/TMĐT bởi nhóm 7 thành viên.
- **Giới hạn công nghệ:** Frontend sử dụng chuẩn HTML5, CSS3, JavaScript; Backend xây dựng bằng ASP.NET Core MVC kết hợp Entity Framework Core và cơ sở dữ liệu quan hệ (SQL Server/SQLite).
- **Phạm vi địa lý thử nghiệm:** Nền tảng tập trung triển khai và dữ liệu thử nghiệm giới hạn cho các salon đối tác tại khu vực nội thành Thành phố Hồ Chí Minh.
- **Giả định thanh toán:** Hệ thống chưa tích hợp cổng trung gian tài chính trong giai đoạn này; giả định khách hàng đến salon đúng lịch hẹn và thực hiện thanh toán trực tiếp tại quầy bằng tiền mặt hoặc chuyển khoản ngân hàng sau khi nghiệm thu dịch vụ.
- **Giả định lịch hẹn:** Khách hàng chủ động có mặt trước giờ hẹn tối thiểu 10 phút; nếu trễ quá 15 phút mà không liên hệ trước, salon có quyền từ chối hoặc chuyển đơn sang trạng thái Đã hủy.
```[cite: 1, 2, 13, 14, 27, 28]

