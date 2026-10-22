# Requirements

## 1. Mục tiêu dự án
Xây dựng nền tảng thương mại điện tử hoạt động theo mô hình trung gian kết nối trực tiếp người dùng có nhu cầu chăm sóc tóc với hệ thống các salon, barbershop từ bình dân đến chuyên nghiệp tại khu vực Thành phố Hồ Chí Minh.
- **Giá trị mang lại cho khách hàng:** Khách hàng (đặc biệt là học sinh, sinh viên và nhân viên văn phòng từ 16-40 tuổi) có một không gian số tập trung minh bạch để dễ dàng tìm kiếm salon theo khu vực, tra cứu bảng giá, đối chiếu phong cách, xem lịch trống và chủ động đặt lịch hẹn kèm thợ tạo mẫu tóc mong muốn; chấm dứt tình trạng phải nhắn tin/gọi điện thủ công và chờ đợi phản hồi.
- **Tính năng đột phá cho người dùng:** Hỗ trợ tính năng tải ảnh khuôn mặt cá nhân để phân tích và gợi ý các dáng kiểu tóc phù hợp nhất, đồng thời đề xuất thẳng đến các salon có thế mạnh tương ứng. Bên cạnh đó, người dùng trẻ có thể tìm kiếm cơ hội làm mẫu tóc (cắt, nhuộm mẫu) chi phí 0đ/ưu đãi từ các salon.
- **Giá trị mang lại cho đối tác (Salon vừa và nhỏ):** Cung cấp công cụ số hóa quy trình quản lý lịch trình, tự động khóa khung giờ đã có khách nhằm triệt tiêu hoàn toàn tình trạng trùng lặp lịch thợ, tối ưu hóa công suất các ngày trong tuần và tiếp cận tệp khách hàng trực tuyến tiềm năng. Ngoài ra, tính năng đăng tin tuyển mẫu giúp salon dễ dàng tìm kiếm người mẫu để đào tạo nâng cao tay nghề cho thợ hoặc chụp ảnh truyền thông thương hiệu mà không tốn chi phí tìm kiếm ngoài.


## 2. Phạm vi

### Trong phạm vi (Phiên bản đầu tiên - MVP)
- **Danh mục & Bộ lọc nâng cao:** Khách hàng tìm kiếm, áp dụng bộ lọc đa tiêu chí: theo Quận/Khu vực tại TP.HCM, theo phân loại salon (Salon Nam/Barbershop, Salon Nữ, Salon Unisex), theo nhóm chuyên môn (Chuyên Cắt, Chuyên Uốn/Nhuộm, Gội đầu dưỡng sinh, Phục hồi tóc); xem bảng giá và danh sách stylist của từng salon (`salon_id`).
- **Quy trình Đặt chỗ (Booking):** Khách chọn salon (`salon_id`), chọn dịch vụ, chọn chuyên viên làm tóc, chọn ngày và khung giờ còn trống để tiến hành xác nhận đặt chỗ.
- **Quản lý lịch cá nhân:** Đăng ký/đăng nhập tài khoản khách hàng để lưu trữ và theo dõi lịch sử đặt chỗ.
- **Chính sách Hủy & Đổi lịch:** Khách hàng được phép hủy lịch hẹn trực tuyến (yêu cầu thực hiện trước giờ hẹn tối thiểu 2 tiếng). Để giảm tải độ phức tạp nghiệp vụ cho MVP, hệ thống **không hỗ trợ sửa đổi trực tiếp lịch đã đặt**; khách hàng có nhu cầu đổi lịch sẽ thực hiện hủy lịch cũ và tiến hành tạo một lượt đặt chỗ mới.
- **Phân tích khuôn mặt & Gợi ý kiểu tóc / Salon:** Khách hàng tải ảnh chân dung/khuôn mặt lên hệ thống, lựa chọn/nhận diện dáng mặt (Mặt tròn, Mặt vuông, V-line...). Hệ thống hiển thị bộ sưu tập các kiểu tóc phù hợp kèm danh sách gợi ý các salon/stylist hàng đầu chuyên trị dáng tóc đó để đặt lịch ngay.
- **Khu vực Tiệm tóc Tuyển mẫu:** 
 Các salon đăng tải các bản tin tuyển người mẫu làm tóc (cụ thể loại dịch vụ tuyển: Cắt mẫu, Nhuộm tẩy mẫu, Uốn mẫu; yêu cầu về tóc; chi phí hỗ trợ/miễn phí).
 Khách hàng/Người dùng đăng ký ứng tuyển sau đó điền form thông tin để liên lạc.
- **Đánh giá & Nhận xét Salon:** Khách hàng đã hoàn thành đơn dịch vụ có quyền gửi chấm điểm sao (1–5 sao) và nhận xét công khai về chất lượng phục vụ của salon/stylist; hiển thị điểm trung bình ngoài danh sách.
- **Quản trị phân cấp (Chủ salon):** Chủ salon quản lý thông tin tiệm, menu dịch vụ, đơn giá, danh sách thợ làm tóc, thiết lập ca trực/ngày nghỉ của thợ và cập nhật trạng thái đơn hẹn của salon mình.
- **Quản trị hệ thống (Admin sàn):** Phê duyệt, quản lý danh sách salon đối tác hoạt động trên nền tảng và quản trị tài khoản người dùng.
- **Chatbot AI Tư vấn & Hỗ trợ:** Trợ lý ảo AI tích hợp trên giao diện cho phép người dùng hội thoại trực tiếp để hỏi đáp thông tin dịch vụ, tư vấn kiểu tóc/màu nhuộm phù hợp với xu hướng và gợi ý nhanh các salon đáp ứng nhu cầu.

### Ngoài phạm vi (Phát triển ở các giai đoạn tiếp theo)
- Hệ thống tích lũy điểm thưởng thành viên quy đổi voucher giảm giá liên kết đa hệ thống.
- *Lưu ý nghiệp vụ:* Hoàn toàn không áp dụng nghiệp vụ giao nhận hàng (Shipping/Vận chuyển) do đặc thù 100% là dịch vụ tại chỗ.

## 4. Yêu cầu chức năng

| Mã | Tên chức năng | Mô tả | Người sử dụng | Mức độ ưu tiên | Tiêu chí nghiệm thu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F01** | Tìm kiếm & Bộ lọc salon đa tiêu chí | Cho phép lọc danh sách salon theo nhiều tiêu chí kết hợp: theo Quận/Huyện tại TP.HCM, đối tượng phục vụ (Nam / Nữ / Unisex), và nhóm chuyên môn nổi bật (chuyên Cắt, Uốn, Nhuộm/Tẩy, Phục hồi...). | Guest, Customer | Bắt buộc (MVP) | Kết quả trả về chính xác theo các tiêu chí đã chọn; hiển thị rõ tên salon, địa chỉ, hình ảnh đại diện, tag chuyên môn và điểm đánh giá trung bình. |
| **F02** | Xem chi tiết thông tin, Menu & Stylist | Hiển thị thông tin một salon cụ thể: danh mục gói dịch vụ, bảng giá, danh sách stylist và không gian tiệm theo đúng `salon_id`. | Guest, Customer | Bắt buộc (MVP) | Dữ liệu dịch vụ, mức giá và thợ hiển thị đúng theo salon được chọn, không bị nhầm lẫn giữa các cơ sở. |
| **F03** | Phân tích ảnh khuôn mặt & Gợi ý kiểu tóc | Khách hàng tải ảnh chân dung/khuôn mặt, hệ thống nhận diện/gợi ý dáng mặt và trả về danh sách các kiểu tóc phù hợp nhất kèm gợi ý các salon chuyên làm dáng tóc đó. | Guest, Customer | Bắt buộc (MVP) | Tải ảnh thành công, phân tích trả về từ 3-5 gợi ý kiểu tóc chuẩn dáng mặt; từ kiểu tóc chọn ra ngay danh sách salon đáp ứng. |
| **F04** | Đăng tin & Đăng ký tuyển mẫu tóc | Chủ salon tạo tin tuyển người mẫu làm tóc. Admin sàn kiểm duyệt công khai; Khách hàng xem và điền form thông tin liên lạc để đăng ký ứng tuyển. | Customer, Salon Owner, Admin | Bắt buộc (MVP) | Tin tuyển mẫu hiển thị đầy đủ thông tin; Khách hàng điền form gửi thông tin liên lạc thành công; Chủ salon xem được danh sách ứng viên đăng ký để liên hệ. |
| **F05** | Đặt lịch làm dịch vụ (Booking) | Khách hàng chọn dịch vụ, stylist, ngày và khung giờ còn trống tại salon đã chọn; xác nhận đặt chỗ. | Customer | Bắt buộc (MVP) | Bản ghi Booking lưu đúng `salon_id`, `stylist_id`, `service_id`; khung giờ đã có khách hoặc thợ nghỉ tự động bị vô hiệu hóa; sinh mã booking hợp lệ. |
| **F06** | Quản lý lịch sử & Hủy lịch hẹn | Khách hàng theo dõi danh sách các lượt đặt chỗ cá nhân kèm trạng thái; thực hiện thao tác Hủy lịch nếu đáp ứng quy định thời gian. | Customer | Bắt buộc (MVP) | Chỉ hiển thị đơn của tài khoản đang đăng nhập; cho phép hủy nếu thời gian hiện tại cách giờ hẹn >= 2 tiếng; hủy xong mở lại slot giờ cho khách khác. |
| **F07** | Đánh giá & Nhận xét Salon | Khách hàng gửi điểm đánh giá (1-5 sao) và nhận xét trải nghiệm sau khi đơn hẹn chuyển sang trạng thái "Hoàn thành". Khách xem được tổng hợp đánh giá tại trang chi tiết salon. | Customer, Guest | Bắt buộc (MVP) | Chỉ những lịch hẹn có trạng thái "Hoàn thành" mới kích hoạt nút đánh giá; hệ thống tự động cập nhật lại điểm số trung bình của salon ngay sau khi có nhận xét mới. |
| **F08** | Đăng ký & Đăng nhập (Auth) | Cung cấp luồng xác thực tài khoản cho Khách hàng, Chủ salon và Admin sàn; phân quyền truy cập theo vai trò. | Mọi người dùng | Bắt buộc (MVP) | Đăng nhập đúng điều hướng theo vai trò; bảo vệ các URL quản trị; mật khẩu người dùng được mã hóa an toàn. |
| **F09** | Quản lý dịch vụ & Thông tin salon | Chủ salon cập nhật mô tả tiệm, tag phân loại (nam/nữ, cắt/nhuộm...), thêm mới, điều chỉnh giá hoặc tạm ẩn dịch vụ của riêng salon mình. | Salon Owner | Bắt buộc (MVP) | Dữ liệu được lưu với đúng `salon_id` của tài khoản đăng nhập; thay đổi hiển thị ngay lập tức ra giao diện khách hàng. |
| **F10** | Quản lý lịch làm việc & Ngày nghỉ thợ | Chủ salon thiết lập khung giờ làm việc, phân ca trực và đánh dấu ngày nghỉ phép cho từng stylist trong tuần. | Salon Owner | Bắt buộc (MVP) | Stylist có trạng thái nghỉ ca/nghỉ ngày sẽ tự động không hiển thị khung giờ trống trên màn hình đặt chỗ (F05) của khách hàng. |
| **F11** | Tiếp nhận & Điều phối trạng thái lịch hẹn | Chủ salon theo dõi danh sách khách đặt theo ngày và cập nhật trạng thái đơn hẹn theo chu trình dịch vụ. | Salon Owner | Bắt buộc (MVP) | Cho phép lọc theo ngày và trạng thái; chuyển đổi trạng thái đúng quy chuẩn (Chờ xác nhận -> Đã xác nhận -> Đang phục vụ -> Hoàn thành / Hủy); chặn thao tác trên đơn hàng salon khác. |
| **F12** | Quản lý danh sách đối tác & Kiểm duyệt sàn | Admin sàn phê duyệt salon mới, quản lý trạng thái salon (Kích hoạt/Khóa), duyệt tin tuyển mẫu và kiểm duyệt/xóa các nhận xét đánh giá vi phạm tiêu chuẩn. | Platform Admin | Bắt buộc (MVP) | Salon bị vô hiệu hóa sẽ không xuất hiện trên bộ lọc F01; tin tuyển mẫu rác/vi phạm bị khóa không cho hiển thị. |

## 5. Yêu cầu phi chức năng

- **Bảo mật và toàn vẹn dữ liệu phân vùng:** Kiểm soát phân quyền chặt chẽ từ Backend (ASP.NET Core/EF Core). Khóa quyền truy cập chéo giữa các salon; ngăn chặn triệt để lỗ hổng IDOR (chủ salon thay đổi tham số ID trên URL/API để xem hoặc thao tác trên đơn / thông tin tuyển mẫu của salon khác).
- **Xử lý hình ảnh & Dữ liệu form an toàn:** Tệp ảnh tải lên (ảnh khuôn mặt cá nhân) bắt buộc kiểm tra định dạng (JPG/PNG/WEBP), giới hạn dung lượng dưới 5MB. Thông tin form đăng ký tuyển mẫu được kiểm tra định dạng dữ liệu (số điện thoại, email) trước khi lưu.
- **Ngăn chặn xung đột đặt chỗ:** Đảm bảo cơ chế khóa dữ liệu (locking/transaction) để không xảy ra hiện tượng "Double Booking" (hai khách hàng cùng thao tác đặt trùng một thợ trong cùng một khung giờ tại một salon).
- **Kiểm tra dữ liệu đầu vào:** Kiểm tra định dạng số điện thoại Việt Nam hợp lệ (10 chữ số), trường họ tên không chứa ký tự đặc biệt độc hại; ngày đặt hẹn bắt buộc phải ở thời gian tương lai và nằm trong khung giờ làm việc của salon; số sao đánh giá nằm trong thang điểm từ 1 đến 5.
- **Tính đáp ứng giao diện:** Thiết kế tối ưu hóa hiển thị mượt mà trên cả máy tính bàn và thiết bị di động, đảm bảo trải nghiệm thao tác lọc salon, tải ảnh gợi ý kiểu tóc và đặt lịch trên màn hình cảm ứng điện thoại thuận tiện, trực quan.
- **Bảo vệ thông tin cá nhân:** Không lưu trữ mật khẩu dưới dạng văn bản thô (phải băm mật khẩu bằng thuật toán an toàn); bảo mật toàn bộ chuỗi kết nối cơ sở dữ liệu và khóa cấu hình trong tệp môi trường bí mật.

## 6. Giới hạn và giả định

- **Giới hạn thời gian và nhân lực:** Toàn bộ hệ thống được xây dựng và hoàn thiện trong phạm vi 1 học phần môn Phát triển ứng dụng Web/TMĐT bởi nhóm 7 thành viên.
- **Giới hạn công nghệ:** Frontend sử dụng chuẩn HTML5, CSS3, JavaScript; Backend xây dựng bằng ASP.NET Core MVC kết hợp Entity Framework Core và cơ sở dữ liệu quan hệ (SQL Server/SQLite).
- **Phạm vi địa lý thử nghiệm:** Nền tảng tập trung triển khai và dữ liệu thử nghiệm giới hạn cho các salon đối tác tại khu vực nội thành Thành phố Hồ Chí Minh.
- **Giả định thanh toán & Thỏa thuận tuyển mẫu:** Hệ thống hoàn toàn không tích hợp hoặc quản lý bất kỳ luồng thanh toán giao dịch tiền tệ nào. Nền tảng đóng vai trò kết nối giữ chỗ lịch hẹn và hỗ trợ form kết nối giữa salon tuyển mẫu với ứng viên. Khách hàng và salon tự thỏa thuận các dịch vụ/chi phí phát sinh riêng với nhau tại salon.
- **Giả định lịch hẹn:** Khách hàng chủ động có mặt trước giờ hẹn tối thiểu 10 phút; nếu trễ quá 15 phút mà không liên hệ trước, salon có quyền từ chối hoặc chuyển đơn sang trạng thái Đã hủy.

