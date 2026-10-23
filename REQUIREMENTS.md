# Requirements

## 1. Mục tiêu dự án
Xây dựng nền tảng thương mại điện tử hoạt động theo mô hình trung gian kết nối trực tiếp người dùng có nhu cầu chăm sóc tóc với hệ thống các salon, barbershop từ bình dân đến chuyên nghiệp tại khu vực Thành phố Hồ Chí Minh.
Xây dựng nền tảng thương mại điện tử hoạt động theo mô hình trung gian kết nối trực tiếp người dùng có nhu cầu chăm sóc tóc với hệ thống các salon, barbershop từ bình dân đến chuyên nghiệp tại khu vực Thành phố Hồ Chí Minh.
- **Giá trị mang lại cho khách hàng:** Khách hàng (đặc biệt là học sinh, sinh viên và nhân viên văn phòng từ 16-40 tuổi) có một không gian số tập trung minh bạch để dễ dàng tìm kiếm salon theo khu vực, tra cứu bảng giá, đối chiếu phong cách, xem lịch trống và chủ động đặt lịch hẹn kèm thợ tạo mẫu tóc mong muốn; chấm dứt tình trạng phải nhắn tin/gọi điện thủ công và chờ đợi phản hồi.
- **Tính năng đột phá cho người dùng:** 
  - Hỗ trợ trợ lý ảo **Chatbot AI** hội thoại trực tiếp để hỏi đáp thông tin dịch vụ, tư vấn kiểu tóc/màu nhuộm phù hợp với xu hướng và gợi ý nhanh các salon đáp ứng nhu cầu.
  - Hỗ trợ tính năng tải ảnh khuôn mặt cá nhân để phân tích và gợi ý các dáng kiểu tóc phù hợp nhất, đồng thời đề xuất thẳng đến các salon có thế mạnh tương ứng. 
  - Người dùng trẻ có thể tìm kiếm cơ hội làm mẫu tóc (cắt, nhuộm mẫu) chi phí 0đ/ưu đãi từ các salon.
- **Giá trị mang lại cho đối tác (Salon vừa và nhỏ):** Cung cấp công cụ số hóa quy trình quản lý lịch trình, tự động khóa khung giờ đã có khách nhằm triệt tiêu hoàn toàn tình trạng trùng lặp lịch thợ, tối ưu hóa công suất các ngày trong tuần và tiếp cận tệp khách hàng trực tuyến tiềm năng. Ngoài ra, tính năng đăng tin tuyển mẫu giúp salon dễ dàng tìm kiếm người mẫu để đào tạo nâng cao tay nghề cho thợ hoặc chụp ảnh truyền thông thương hiệu mà không tốn chi phí tìm kiếm ngoài.



## 2. Phạm vi

### Trong phạm vi (Phiên bản đầu tiên - MVP)
- **Danh mục & Bộ lọc nâng cao:** Khách hàng tìm kiếm, áp dụng bộ lọc đa tiêu chí: theo Quận/Khu vực tại TP.HCM, theo phân loại salon (Salon Nam/Barbershop, Salon Nữ, Salon Unisex), theo nhóm chuyên môn (Chuyên Cắt, Chuyên Uốn/Nhuộm, Gội đầu dưỡng sinh, Phục hồi tóc); xem bảng giá và danh sách stylist của từng salon (`salon_id`).
- **Quy trình Đặt chỗ (Booking):** Khách chọn salon (`salon_id`), chọn dịch vụ, chọn chuyên viên làm tóc, chọn ngày và khung giờ còn trống để tiến hành xác nhận đặt chỗ.
- **Quản lý lịch cá nhân:** Đăng ký/đăng nhập tài khoản khách hàng để lưu trữ và theo dõi lịch sử đặt chỗ.
- **Chính sách Hủy & Đổi lịch:** Khách hàng được phép hủy lịch hẹn trực tuyến (yêu cầu thực hiện trước giờ hẹn tối thiểu 2 tiếng). Để giảm tải độ phức tạp nghiệp vụ cho MVP, hệ thống **không hỗ trợ sửa đổi trực tiếp lịch đã đặt**; khách hàng có nhu cầu đổi lịch sẽ thực hiện hủy lịch cũ và tiến hành tạo một lượt đặt chỗ mới.
- **Phân tích khuôn mặt & Gợi ý kiểu tóc / Salon:** Khách hàng tải ảnh chân dung/khuôn mặt lên hệ thống, hệ thống nhận diện dáng mặt và trả về bộ sưu tập các kiểu tóc phù hợp kèm danh sách gợi ý salon/stylist chuyên trị dáng tóc đó.
- **Khu vực Tiệm tóc Tuyển mẫu:** 
  - Các salon đăng tải bản tin tuyển người mẫu làm tóc (dịch vụ tuyển, yêu cầu chất tóc, chi phí hỗ trợ/miễn phí).
  - Khách hàng xem tin (Guest chỉ xem, Customer được điền form ứng tuyển chi tiết).
- **Đánh giá & Nhận xét Salon:** Khách hàng hoàn thành đơn dịch vụ được gửi chấm điểm (1–5 sao) và nhận xét công khai; hiển thị điểm trung bình ngoài danh sách.
- **Quản trị phân cấp (Chủ salon):** Chủ salon quản lý thông tin tiệm, menu dịch vụ, đơn giá, danh sách thợ, thiết lập ca trực/ngày nghỉ, quản lý tin tuyển mẫu và xử lý đơn hẹn.
- **Quản trị hệ thống (Admin sàn):** Phê duyệt salon đối tác, kiểm duyệt nội dung tin tuyển mẫu, kiểm duyệt đánh giá và quản lý tài khoản người dùng.
- **Chatbot AI Tư vấn & Hỗ trợ:** Trợ lý ảo AI tích hợp trên giao diện cho phép người dùng hội thoại trực tiếp để hỏi đáp thông tin dịch vụ, tư vấn kiểu tóc/màu nhuộm phù hợp với xu hướng và gợi ý nhanh các salon đáp ứng nhu cầu.


### Ngoài phạm vi (Phát triển ở các giai đoạn tiếp theo)
- Hệ thống tích lũy điểm thưởng thành viên quy đổi voucher giảm giá liên kết đa hệ thống.
- *Lưu ý nghiệp vụ:* Hoàn toàn không áp dụng nghiệp vụ giao nhận hàng (Shipping/Vận chuyển) do đặc thù 100% là dịch vụ tại chỗ.
  
## 3. Người dùng

| Vai trò | Nhiệm vụ chính | Quyền hạn được làm | Không được phép làm |
| :--- | :--- | :--- | :--- |
| **Khách vãng lai** | Khảo sát thông tin, xem tin tuyển mẫu và trò chuyện Chatbot AI | - Tương tác Chatbot AI tư vấn kiểu tóc, hỏi đáp dịch vụ.<br>- Sử dụng bộ lọc nâng cao tìm kiếm salon.<br>- Xem menu, bảng giá, stylist, đánh giá và lịch trống.<br>- **Chỉ được xem** danh sách tin tuyển người mẫu tóc của các salon. | - Không xem được lịch sử đặt chỗ.<br>- Không được đặt lịch hẹn, không được điền form ứng tuyển làm mẫu, không được gửi đánh giá (bắt buộc phải đăng nhập).<br>- Không có quyền chỉnh sửa dữ liệu hệ thống. |
| **Khách hàng** | Đặt lịch, ứng tuyển mẫu tóc, quản lý lịch và gửi đánh giá | - Toàn quyền của Khách vãng lai.<br>- Đặt lịch hẹn làm dịch vụ.<br>- Ứng tuyển làm người mẫu tóc (điền form thông tin liên lạc kèm ảnh chụp chất tóc).<br>- Xem lịch sử đặt chỗ và trạng thái hồ sơ tuyển mẫu.<br>- Hủy lịch hẹn trước giờ quy định (>= 2 tiếng).<br>- Gửi đánh giá sao và bình luận sau khi đơn hoàn thành. | - Tuyệt đối không được xem/sửa lịch hẹn hoặc hồ sơ mẫu của khách khác.<br>- Không được sửa đổi lịch trực tiếp (phải hủy và đặt lại).<br>- Không được đánh giá salon chưa từng hoàn thành lịch.<br>- Không có quyền truy cập trang quản trị. |
| **Chủ salon** | Quản lý vận hành salon, thợ, dịch vụ, tuyển mẫu và đơn hẹn | - Cập nhật thông tin salon và tag phân loại.<br>- Thêm, sửa, ẩn danh mục dịch vụ và giá.<br>- Quản lý danh sách stylist, thiết lập ca làm việc và ngày nghỉ.<br>- Đăng tin tuyển mẫu tóc, tiếp nhận và xem thông tin form ứng viên đăng ký để liên hệ.<br>- Chủ động tạo booking F05 cho khách từ hồ sơ ứng viên sau khi liên hệ thành công.<br>- Tiếp nhận, kiểm tra và điều phối trạng thái lịch hẹn thuộc salon mình. | - Chỉ thao tác trên dữ liệu thuộc đúng `salon_id` được phân công.<br>- Không can thiệp dữ liệu, đơn đặt, tuyển mẫu hay stylist của salon khác.<br>- Không tự ý xóa/sửa đánh giá khách hàng hay can thiệp tài khoản admin sàn. |
| **Quản trị viên nền tảng** | Kiểm soát và duy trì hoạt động toàn sàn | - Phê duyệt salon đối tác mới, khóa quyền salon vi phạm.<br>- Kiểm duyệt tin tuyển mẫu của salon trước khi hiển thị công khai (trạng thái Chờ duyệt -> Đã duyệt / Bị từ chối).<br>- Kiểm duyệt, ẩn hoặc xóa các đánh giá/nhận xét vi phạm tiêu chuẩn cộng đồng.<br>- Cấp và quản lý tài khoản chủ salon, giám sát vận hành toàn sàn. | - Không trực tiếp can thiệp ca trực chi tiết hàng ngày của thợ thay cho từng salon. |


## 4. Yêu cầu chức năng

| Mã | Tên chức năng | Mô tả | Người sử dụng | Mức độ ưu tiên | Tiêu chí nghiệm thu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F01** | Tìm kiếm & Bộ lọc salon đa tiêu chí | Cho phép lọc danh sách salon theo nhiều tiêu chí kết hợp: theo Quận/Huyện tại TP.HCM, đối tượng phục vụ (Nam / Nữ / Unisex), và nhóm chuyên môn nổi bật (chuyên Cắt, Uốn, Nhuộm/Tẩy, Phục hồi...). | Guest, Customer | Bắt buộc (MVP) | Kết quả trả về chính xác theo các tiêu chí đã chọn; hiển thị rõ tên salon, địa chỉ, hình ảnh đại diện, tag chuyên môn và điểm đánh giá trung bình. |
| **F02** | Xem chi tiết thông tin, Menu & Stylist | Hiển thị thông tin một salon cụ thể: danh mục gói dịch vụ, bảng giá, danh sách stylist và không gian tiệm theo đúng `salon_id`. | Guest, Customer | Bắt buộc (MVP) | Dữ liệu dịch vụ, mức giá và thợ hiển thị đúng theo salon được chọn, không bị nhầm lẫn giữa các cơ sở. |
| **F03** | Phân tích ảnh khuôn mặt & Gợi ý kiểu tóc | Khách hàng tải ảnh chân dung/khuôn mặt, hệ thống nhận diện dáng mặt (Mặt tròn, Vuông, V-line...) và trả về từ 3–5 kiểu tóc phù hợp kèm danh sách salon/stylist hàng đầu chuyên trị dáng tóc đó (dựa trên thuật toán khớp tag chuyên môn của salon). | Guest, Customer | Bắt buộc (MVP) | Xử lý ảnh thành công dưới 3 giây; trả về danh sách kiểu tóc kèm các salon có tag chuyên môn tương ứng. Nếu nhận diện không thành công, hệ thống hiển thị thông báo lỗi và cung cấp lựa chọn thủ công (chọn dáng mặt bằng tay). |
| **F04** | Đăng tin & Ứng tuyển tuyển mẫu tóc | Chủ salon đăng tin tuyển mẫu (có trạng thái Chờ duyệt -> Đã duyệt / Từ chối). Guest chỉ xem danh sách. Customer điền form ứng tuyển (Họ tên, SĐT, Email, Ảnh chụp tình trạng tóc hiện tại). Giới hạn tối đa 1 Customer chỉ được gửi 1 hồ sơ ứng tuyển cho mỗi tin tuyển mẫu đang mở. | Customer, Salon Owner, Admin | Bắt buộc (MVP) | Tin mới tạo ở trạng thái "Chờ duyệt"; Admin duyệt xong mới hiển thị công khai. Khách hàng gửi form thành công lưu vào CSDL; hệ thống chặn gửi lần 2 nếu đã tồn tại hồ sơ của user đó cho tin tương ứng. |
| **F05** | Đặt lịch làm dịch vụ | Khách hàng chọn dịch vụ, stylist, ngày và khung giờ còn trống tại salon đã chọn để đặt chỗ. Chủ salon có quyền tạo booking trực tiếp từ hồ sơ ứng viên sau khi liên hệ thành công. | Customer, Salon Owner | Bắt buộc (MVP) | Booking lưu đúng `salon_id`, `stylist_id`, `service_id`. Nếu Chủ salon tạo hộ từ hồ sơ mẫu, hệ thống phải chạy cơ chế kiểm tra xung đột thời gian trước khi xác nhận slot. |
| **F06** | Quản lý lịch sử & Hủy lịch hẹn | Khách hàng theo dõi danh sách lịch hẹn cá nhân; thực hiện hủy lịch trước giờ hẹn tối thiểu 2 tiếng. | Customer | Bắt buộc (MVP) | Chỉ hiển thị đơn của tài khoản đang đăng nhập; hủy thành công đổi trạng thái thành "Đã hủy" và mở lại khung giờ cho khách khác. |
| **F07** | Đánh giá & Nhận xét Salon | Khách gửi chấm điểm (1–5 sao) và nhận xét sau khi đơn hàng chuyển sang trạng thái "Hoàn thành". Mỗi booking chỉ được gửi đánh giá duy nhất 1 lần và **không hỗ trợ chỉnh sửa** sau khi đã gửi. Điểm trung bình salon được tính bằng trung bình cộng các điểm số hợp lệ; khi Admin gỡ một đánh giá vi phạm, hệ thống tự động loại bỏ điểm số đó và tính toán lại điểm trung bình ngay lập tức. | Customer | Bắt buộc (MVP) | Chỉ đơn "Hoàn thành" mới được đánh giá; chặn gửi đánh giá lần 2; Admin gỡ đánh giá làm cập nhật lại điểm trung bình thời gian thực trên giao diện. |
| **F08** | Đăng ký & Đăng nhập | Cung cấp luồng xác thực tài khoản cho Khách hàng, Chủ salon và Admin sàn; phân quyền truy cập theo vai trò. | Mọi người dùng | Bắt buộc (MVP) | Đăng nhập đúng điều hướng theo vai trò; bảo vệ URL quản trị; mật khẩu mã hóa an toàn. |
| **F09** | Quản lý dịch vụ & Thông tin salon | Chủ salon cập nhật mô tả tiệm, tag phân loại, thêm mới, sửa hoặc ẩn dịch vụ của salon mình. | Salon Owner | Bắt buộc (MVP) | Dữ liệu lưu đúng `salon_id`; thay đổi phản hồi tức thì ra giao diện. |
| **F10** | Quản lý lịch làm việc & Ngày nghỉ thợ | Chủ salon thiết lập khung giờ làm việc, phân ca trực và ngày nghỉ phép cho từng stylist. | Salon Owner | Bắt buộc (MVP) | Stylist nghỉ ca/nghỉ ngày tự động bị khóa khung giờ trống trên màn hình đặt chỗ (F05). |
| **F11** | Tiếp nhận & Điều phối trạng thái lịch hẹn | Chủ salon theo dõi đơn theo ngày và cập nhật trạng thái (Chờ xác nhận -> Đã xác nhận -> Đang phục vụ -> Hoàn thành / Hủy). | Salon Owner | Bắt buộc (MVP) | Chuyển đổi trạng thái đúng quy chuẩn; chặn tuyệt đối thao tác trên đơn của salon khác. |
| **F12** | Quản lý danh sách đối tác & Kiểm duyệt sàn | Admin sàn phê duyệt salon, quản lý trạng thái, kiểm duyệt tin tuyển mẫu và xử lý/gỡ bỏ đánh giá vi phạm. | Platform Admin | Bắt buộc (MVP) | Salon bị khóa không xuất hiện ở F01; tin tuyển mẫu vi phạm bị gỡ bỏ vĩnh viễn khỏi danh sách công khai. |
| **F13** | Chatbot AI hỗ trợ tư vấn kiểu tóc | Trợ lý ảo AI hội thoại trực tiếp giải đáp thắc mắc, tư vấn kiểu tóc và điều hướng salon. | Guest, Customer | Bắt buộc (MVP) | Phản hồi dưới 3 giây; trả về gợi ý chính xác theo từ khóa truy vấn. |


## 5. Yêu cầu phi chức năng

- **Bảo mật và phân vùng dữ liệu:** Kiểm soát phân quyền chặt chẽ từ Backend (ASP.NET Core/EF Core). Khóa quyền truy cập chéo giữa các salon; ngăn chặn triệt để lỗ hổng IDOR.
- **Quy định nguồn dữ liệu & Xử lý khi AI lỗi:** 
  - Nguồn dữ liệu huấn luyện/gợi ý của Chatbot AI và Phân tích khuôn mặt lấy từ cơ sở dữ liệu hệ thống (danh mục dịch vụ, tag chuyên môn salon, bộ sưu tập kiểu tóc chuẩn).
  - Khi API AI hoặc mô hình xử lý ảnh/chatbot gặp lỗi (timeout, lỗi phản hồi), hệ thống phải tự động bật cơ chế dự phòng: Hiển thị thông báo thân thiện *"Hệ thống phân tích tạm bận, vui lòng chọn thủ công"*, đồng thời điều hướng người dùng chọn dáng mặt/danh mục dịch vụ qua bộ lọc truyền thống mà không làm gián đoạn trải nghiệm.
- **Quy định xử lý Dữ liệu ảnh khuôn mặt & Ảnh chất tóc:**
  - **Thời gian lưu trữ:** Ảnh tải lên được lưu trữ tạm thời trên hệ thống lưu trữ đám mây trong vòng tối đa **24 giờ** kể từ thời điểm phân tích xong, sau đó hệ thống tự động xóa vĩnh viễn để bảo vệ quyền riêng tư.
  - **Thông báo & Đồng ý:** Trước khi tải ảnh lên, giao diện bắt buộc hiển thị hộp thoại thông báo rõ ràng kèm nút đồng ý: *"Chúng tôi chỉ sử dụng hình ảnh của bạn cho mục đích phân tích dáng mặt/chất tóc và sẽ tự động xóa sau 24 giờ. Bạn có đồng ý không?"*.
- **Tiêu chuẩn xếp hạng Salon/Stylist “Hàng đầu” & Khớp tag:**
  - Salon/stylist được xếp vào nhóm “phù hợp/hàng đầu” dựa trên sự khớp giữa **Tag chuyên môn của salon** (ví dụ: `Chuyên uốn nhuộm`, `Barbershop nam`) với kết quả phân tích dáng tóc, kết hợp với **Điểm đánh giá trung bình cao (>= 4.5 sao)** và lượng booking hoàn thành nhiều.
- **Quy trình Kiểm duyệt Tin tuyển mẫu:**
  - Tin mới đăng nằm ở trạng thái **Chờ duyệt (Pending)**. Admin sàn có quyền duyệt (chuyển sang **Đã duyệt / Public**) hoặc từ chối (trạng thái **Bị từ chối** kèm lý do). Salon được chỉnh sửa và gửi lại tin bị từ chối. Tiêu chí gỡ/ẩn tin: Tin hết hạn, vi phạm thuần phong mỹ tục hoặc chứa thông tin lừa đảo.
- **Cấu hình thời gian (Time Slots & Business Rules):**
  - Các thông số: **Bước nhảy slot** (thường là 30 phút hoặc 60 phút tùy dịch vụ), **Thời gian đệm** (Buffer time giữa 2 ca của stylist để dọn dẹp: 10–15 phút), **Thời lượng dịch vụ** (định nghĩa sẵn theo từng `service_id`) và **Khung giờ làm việc chuẩn** được định nghĩa tập trung tại bảng cấu hình cơ sở dữ liệu (`SalonSettings` / `ServiceConfigurations`) và quản lý trực tiếp bởi Chủ salon ở trang quản trị.
  - *Điều kiện cắt ngang ca làm/giờ nghỉ:* Nếu Chủ salon thay đổi giờ làm việc hoặc Stylist được xếp lịch nghỉ đột xuất vào khung giờ đã có khách đặt trước (Booking ở trạng thái *Đã xác nhận*), hệ thống sẽ từ chối thay đổi hoặc cảnh báo bắt buộc Chủ salon phải liên hệ khách hàng dời lịch trước khi thực hiện khóa ca/đổi giờ.
- **Xử lý Booking khi có biến động hệ thống (Owner đổi giờ, Stylist nghỉ, Thay đổi giá, Salon bị khóa):**
  - Nếu salon bị Admin khóa hoặc Chủ salon hủy ca làm việc đột xuất, các booking đã được xác nhận trước đó sẽ chuyển tự động sang trạng thái cảnh báo, gửi thông báo khẩn qua hệ thống/SĐT cho khách hàng, đồng thời Chủ salon có trách nhiệm gọi điện hỗ trợ giải quyết trực tiếp. Giá dịch vụ được chốt cố định theo thời điểm khách tạo đơn thành công (không bị ảnh hưởng nếu salon đổi giá sau đó).
- **Chính sách Bảo mật Dữ liệu cá nhân (GDPR-compliant basic):**
  - Thông tin liên hệ booking/ứng tuyển, lịch sử chatbot và tệp ảnh được bảo vệ bằng mã hóa truyền tải (HTTPS), mã hóa cơ sở dữ liệu, phân quyền truy cập nghiêm ngặt và tuân thủ chính sách tự động xóa ảnh sau 24h như đã cam kết.



## 6. Giới hạn và giả định

- **Giới hạn thời gian và nhân lực:** Toàn bộ hệ thống được xây dựng và hoàn thiện trong phạm vi 1 học phần môn Phát triển ứng dụng Web/TMĐT bởi nhóm 7 thành viên.
- **Giới hạn công nghệ:** Frontend sử dụng chuẩn HTML5, CSS3, JavaScript; Backend xây dựng bằng ASP.NET Core MVC kết hợp Entity Framework Core và cơ sở dữ liệu quan hệ (SQL Server/SQLite).
- **Phạm vi địa lý thử nghiệm:** Nền tảng tập trung triển khai và dữ liệu thử nghiệm giới hạn cho các salon đối tác tại khu vực nội thành Thành phố Hồ Chí Minh.
- **Giả định thanh toán & Thỏa thuận tuyển mẫu:** Hệ thống hoàn toàn không tích hợp hoặc quản lý bất kỳ luồng thanh toán giao dịch tiền tệ nào. Nền tảng đóng vai trò kết nối giữ chỗ lịch hẹn và hỗ trợ form kết nối giữa salon tuyển mẫu với ứng viên. Khách hàng và salon tự thỏa thuận các dịch vụ/chi phí phát sinh riêng với nhau tại salon.
- **Giả định lịch hẹn:** Khách hàng chủ động có mặt trước giờ hẹn tối thiểu 10 phút; nếu trễ quá 15 phút mà không liên hệ trước, salon có quyền từ chối hoặc chuyển đơn sang trạng thái Đã hủy.

