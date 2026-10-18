# Quy trình nghiệp vụ đặt lịch SalonBook

## 1. Mục tiêu, phạm vi và căn cứ

### 1.1. Bối cảnh nghiệp vụ

SalonBook là nền tảng trung gian (marketplace) kết nối khách hàng với **nhiều salon/barbershop tại Thành phố Hồ Chí Minh**, không phải website chỉ phục vụ một salon. Các dịch vụ dự kiến gồm cắt tóc, uốn, nhuộm, gội đầu dưỡng sinh và phục hồi tóc.

Bản mô tả đề tài nêu các chức năng cốt lõi của phiên bản đầu tiên:

-   Khách hàng xem danh sách salon, tìm kiếm/lọc theo khu vực.
-   Khách hàng xem thông tin dịch vụ, đặt lịch và quản lý lịch sử đặt chỗ cá nhân.
-   Quản trị viên và chủ salon quản lý danh mục dịch vụ, cập nhật giá, theo dõi và xử lý trạng thái lịch hẹn trong ngày.
-   Thanh toán trực tuyến qua cổng điện tử là chức năng nâng cao, không đưa vào workflow MVP hiện tại.

Cùng một số chức năng phụ khác như so sánh salon theo giá, phong cách và khoảng cách, cùng hình ảnh thực tế/đánh giá.

### 1.3. Những điểm cần lưu ý trước khi triển khai

| Nội dung trong mô tả đề tài | Tình trạng trong F01--F07 hiện có | Cách xử lý trong tài liệu này |
|---|---|---|
| Marketplace có nhiều salon | F01--F07 chưa thể hiện rõ mã salon trong luồng đặt lịch | Đưa bước chọn salon vào workflow; đề nghị TV3 xác nhận trường `salon_id` và phạm vi dữ liệu |
| Tìm kiếm/lọc salon theo khu vực; so sánh giá, phong cách, khoảng cách | Chưa có F-code riêng thể hiện đầy đủ | Ghi là khoảng trống cần đối chiếu, không tự gán vào F01 nếu chưa thống nhất |
| Chủ salon quản lý dịch vụ, giá và lịch hẹn của salon mình | F05/F06 hiện mô tả quyền admin | Đề nghị xác định vai trò chủ salon và giới hạn dữ liệu theo salon |
| Lịch sử đặt chỗ cá nhân thuộc chức năng MVP | F07 ghi đăng nhập/lịch sử là tùy chọn hoặc giai đoạn sau; F04 yêu cầu tài khoản để tra cứu/hủy | Đánh dấu mâu thuẫn cần TV3 xác nhận |
| Hình ảnh và đánh giá salon | Được nhắc trong vấn đề kinh doanh/giá trị nền tảng, nhưng không nêu rõ trong danh sách MVP | Chỉ đưa vào MVP sau khi nhóm xác nhận |
| Thanh toán trực tuyến | Mô tả đề tài xếp vào chức năng nâng cao | Không đưa vào workflow bắt buộc hiện tại |

## 2. Tác nhân và trách nhiệm

| Tác nhân | Trách nhiệm trong workflow | Ghi chú về phạm vi |
|---|---|---|
| Khách chưa đăng nhập | Xem danh sách salon, tìm/lọc theo khu vực, xem dịch vụ/giá, chọn salon, dịch vụ, thợ và giờ, gửi yêu cầu đặt lịch | F03 hiện cho phép gửi booking bằng họ tên và số điện thoại; quyền tra cứu/hủy cần đối chiếu F04 |
| Khách hàng có tài khoản | Thực hiện các thao tác của khách; xem lịch sử và tra cứu/hủy lịch của chính mình theo quyền được duyệt | Mô tả đề tài coi lịch sử cá nhân là MVP nhưng F07 hiện ghi tùy chọn/giai đoạn sau |
| Chủ salon / quản lý salon | Quản lý danh mục dịch vụ, giá và theo dõi/xử lý lịch hẹn thuộc salon của mình | Vai trò này có trong mô tả đề tài nhưng chưa được F05/F06 phân quyền rõ |
| Stylist / thợ | Thực hiện dịch vụ và cập nhật trạng thái lịch theo quyền được thống nhất | Các nhãn trạng thái dành cho stylist cần đồng bộ với F06 |
| Quản trị viên nền tảng | Quản lý hoạt động theo phạm vi được phân quyền; hỗ trợ quản lý dịch vụ/lịch hẹn nếu yêu cầu được duyệt | Cần phân biệt quyền quản trị toàn nền tảng với quyền chủ salon |
| Frontend / website | Hiển thị salon, dịch vụ, lựa chọn lịch; nhận thông tin khách; hiển thị kết quả hoặc lỗi | Không tự quyết định cuối cùng rằng slot còn trống |
| Backend / hệ thống đặt lịch | Kiểm tra dữ liệu, liên kết salon--dịch vụ--stylist, thời lượng, lịch làm và xung đột; lưu booking hợp lệ | Phải kiểm tra lại khi khách gửi yêu cầu, không chỉ dựa vào dữ liệu frontend |

## 3. 04.1 --- Quy trình đặt lịch chính

**Luồng tổng quát:** Truy cập website → xem danh sách salon → tìm/lọc theo khu vực → xem và chọn salon → chọn dịch vụ → chọn ngày → xem thợ/khung giờ trống → nhập thông tin và xác nhận → backend kiểm tra lần cuối → lưu lịch và trả mã lịch hẹn → salon xử lý lịch → khách theo dõi lịch sử.

| Bước | Người thực hiện | Dữ liệu đầu vào / hành động | Xử lý của hệ thống | Kết quả đầu ra |
|---|---|---|---|---|
| 1. Truy cập và xem danh sách salon | Khách | Mở website | Hiển thị danh sách salon có trong hệ thống và thông tin cơ bản đã được duyệt để công khai | Danh sách salon có thể khám phá |
| 2. Tìm kiếm/lọc salon | Khách | Chọn khu vực hoặc tiêu chí tìm kiếm được hỗ trợ | Lọc salon theo dữ liệu khu vực đã lưu; nếu không có kết quả thì hiển thị trạng thái rỗng và cho phép đổi tiêu chí | Danh sách salon phù hợp hoặc thông báo không có kết quả |
| 3. Xem và so sánh salon | Khách | Mở trang chi tiết salon; xem dịch vụ và bảng giá | Hiển thị thông tin salon, dịch vụ, giá và vị trí theo dữ liệu có sẵn. Ảnh/đánh giá chỉ là bắt buộc nếu nhóm xác nhận đưa vào MVP | Khách có đủ thông tin để chọn salon theo phạm vi chức năng đã thống nhất |
| 4. Chọn salon | Khách | Chọn một salon cụ thể | Lưu ngữ cảnh salon đã chọn cho các bước tiếp theo | `salon_id` hoặc định danh salon tương ứng được xác định cho booking |
| 5. Chọn dịch vụ | Khách | Chọn dịch vụ tại salon đã chọn | Kiểm tra dịch vụ thuộc salon đang chọn và có thể đặt; lấy giá/thời lượng từ dữ liệu hệ thống | Dịch vụ được chọn, có thời lượng dùng để tính giờ kết thúc |
| 6. Chọn ngày | Khách | Chọn ngày muốn đến salon | Tiếp nhận ngày yêu cầu và tải dữ liệu lịch làm/khả năng phục vụ liên quan đến salon, dịch vụ và thợ | Ngày được chọn |
| 7. Xem thợ và giờ trống | Hệ thống, sau đó khách | Hệ thống truy xuất lựa chọn khả dụng; khách chọn stylist và giờ bắt đầu | Theo F02, chỉ hiển thị/cho chọn slot phù hợp. Phải xét thời lượng dịch vụ, lịch hiện có và lịch làm liên quan | Stylist, giờ bắt đầu và giờ kết thúc dự kiến |
| 8. Nhập thông tin và xác nhận | Khách | Nhập họ tên, số điện thoại; kiểm tra salon, dịch vụ, thợ, ngày giờ rồi gửi yêu cầu theo F03 | Kiểm tra trường bắt buộc, định dạng dữ liệu và tính hợp lệ của lựa chọn. Không yêu cầu tài khoản để gửi booking nếu F07 vẫn là tùy chọn | Yêu cầu hợp lệ hoặc thông báo lỗi để khách sửa |
| 9. Kiểm tra khả dụng lần cuối | Backend | Nhận yêu cầu đặt lịch | Đọc lại salon, dịch vụ, stylist, thời lượng, lịch làm và lịch hẹn đã lưu; kiểm tra quan hệ giữa các mã và khoảng thời gian có bị xung đột không | Chấp nhận yêu cầu hoặc trả lỗi cụ thể |
| 10. Lưu lịch hẹn | Backend / cơ sở dữ liệu | Yêu cầu đã vượt qua mọi kiểm tra | Lưu thông tin salon, dịch vụ, stylist, khách, ngày giờ, trạng thái và thời điểm tạo theo mô hình dữ liệu được duyệt | Bản ghi lịch hẹn hợp lệ và mã lịch hẹn |
| 11. Trả kết quả đặt lịch | Website | Nhận kết quả từ backend | Nếu lưu thành công, hiển thị mã lịch hẹn và trạng thái; nếu thất bại, không hiển thị thông báo thành công | Khách biết lịch đã được ghi nhận hay cần chọn giờ khác |
| 12. Tiếp nhận và xử lý lịch | Chủ salon/nhân viên/admin có quyền | Xem lịch theo ngày/trạng thái và xử lý lịch thuộc phạm vi được phân quyền | Cập nhật trạng thái theo F06 và quyền đã thống nhất; không tạo lịch trùng cho cùng stylist | Trạng thái mới được lưu |
| 13. Xem lịch sử / tra cứu / hủy | Khách hàng | Mở lịch sử hoặc chọn lịch cần tra cứu/hủy | Lịch sử cá nhân là chức năng MVP theo mô tả đề tài, nhưng cách truy cập phải được TV3 xác nhận do F07/F04 chưa thống nhất. Nếu áp dụng F04, chỉ chủ lịch đã đăng nhập được tra cứu/hủy và chỉ hủy trước giờ hẹn ít nhất 2 giờ | Hiển thị lịch sử/trạng thái; nếu hủy hợp lệ thì slot được mở lại |

### 3.1. Dữ liệu đầu vào và đầu ra

| Nhóm dữ liệu | Đầu vào | Đầu ra / dữ liệu được lưu |
|---|---|---|
| Salon | Định danh salon được khách chọn | Salon gắn với booking; cần xác nhận trường `salon_id` trong yêu cầu và mô hình dữ liệu |
| Dịch vụ | Mã dịch vụ do khách chọn | Tên dịch vụ, giá và thời lượng lấy từ dữ liệu hệ thống; dịch vụ phải thuộc salon đã chọn |
| Stylist | Mã thợ do khách chọn | Stylist được phân công; cần thuộc salon phù hợp và khả dụng trong toàn bộ thời gian phục vụ |
| Lịch | Ngày, giờ bắt đầu mong muốn | Giờ kết thúc tính từ thời lượng dịch vụ; kết quả kiểm tra khả dụng |
| Khách | Họ tên, số điện thoại; tài khoản nếu khách đã đăng nhập | Thông tin liên hệ cần thiết và liên kết tài khoản nếu có; chỉ lưu dữ liệu cần cho nghiệp vụ |
| Booking | Salon + dịch vụ + stylist + ngày/giờ + thông tin khách | Mã lịch hẹn, dữ liệu lịch đã lưu, trạng thái và thời điểm tạo |
| Lỗi | Thiếu/sai dữ liệu, dịch vụ không thuộc salon, slot hết chỗ hoặc lỗi lưu | Thông báo cụ thể; không tạo bản ghi thành công nếu kiểm tra thất bại |

### 3.2. Quy tắc kiểm tra trùng lịch

-   Tính giờ kết thúc từ thời lượng dịch vụ đang lưu trong hệ thống; không tin thời lượng do trình duyệt tự gửi.
-   Hai lịch của cùng stylist bị xem là trùng nếu khoảng thời gian giao nhau: **giờ bắt đầu yêu cầu \< giờ kết thúc lịch hiện có** và **giờ kết thúc yêu cầu \> giờ bắt đầu lịch hiện có**.
-   Phải xác nhận stylist và dịch vụ thuộc đúng salon trong booking; không chấp nhận tổ hợp mã salon/dịch vụ/stylist không hợp lệ.
-   Hai lịch của cùng stylist không được giao nhau. Nếu khác stylist thì vẫn phải kiểm tra các điều kiện khác trước khi cho đặt.
-   Backend phải kiểm tra lại ngay lúc gửi/lưu lịch. Nếu hai khách gửi yêu cầu gần như đồng thời cho cùng slot, chỉ một yêu cầu được lưu; yêu cầu còn lại nhận thông báo slot không còn trống.
-   Khi hủy hợp lệ theo F04, trạng thái phải đổi sang nhãn hủy đã thống nhất và khung giờ được mở lại.
-   Không tự đặt thêm thời gian đệm, bước nhảy slot hoặc giờ đóng cửa cụ thể nếu nhóm chưa định nghĩa trong yêu cầu/cấu hình.

## 4. 04.2 --- Ngoại lệ và quy tắc nghiệp vụ

| Tình huống | Điều kiện | Hệ thống xử lý | Trạng thái / kết quả |
|---|---|---|---|
| Không tìm thấy salon theo khu vực | Bộ lọc không trả về kết quả | Hiển thị thông báo không có salon phù hợp và cho phép đổi bộ lọc | Không tạo booking |
| Salon/dịch vụ không hợp lệ | Mã salon hoặc dịch vụ không tồn tại; dịch vụ không thuộc salon đã chọn | Từ chối yêu cầu và yêu cầu khách chọn lại từ dữ liệu hợp lệ | Không tạo booking |
| Thiếu họ tên hoặc số điện thoại | Trường bắt buộc bị bỏ trống hoặc dữ liệu không hợp lệ | Hiển thị trường cần sửa; kiểm tra định dạng dữ liệu. Không gửi/lưu booking | Không tạo lịch |
| Stylist không thuộc salon đã chọn | Mã stylist không liên kết với salon trong yêu cầu | Từ chối tổ hợp dữ liệu; tải lại stylist phù hợp | Không tạo booking |
| Thợ/slot không khả dụng | Thợ không làm ngày đó hoặc slot đã có lịch | Cập nhật danh sách thợ/giờ trống theo F02; yêu cầu chọn slot khác | Không tạo lịch mới |
| Thời lượng dịch vụ gây giao nhau | Giờ bắt đầu còn trống nhưng giờ kết thúc tính theo thời lượng chồng lên lịch khác của cùng thợ | Từ chối slot; kiểm tra theo toàn bộ khoảng thời gian, không chỉ giờ bắt đầu | Không tạo lịch mới |
| Ngoài thời gian làm việc | Slot không nằm trong lịch làm hợp lệ của salon/thợ | Không hiển thị hoặc vô hiệu hóa slot. Cần TV3 xác nhận cách cấu hình giờ làm/ngày nghỉ vì F01--F07 chưa nêu rõ chức năng quản lý lịch làm | Không tạo lịch mới |
| Hai khách gửi cùng slot gần như đồng thời | Slot có thể đã bị đặt sau lần hiển thị lịch trống | Backend kiểm tra lại và bảo đảm chỉ một booking được lưu cho khoảng thời gian xung đột | Chỉ một lịch được lưu |
| Chủ salon truy cập lịch của salon khác | Tài khoản chủ salon không có quyền với salon trong yêu cầu | Từ chối truy cập. Đây là nguyên tắc phân quyền đề xuất cho marketplace, cần nhóm xác nhận trong ma trận quyền | Không lộ dữ liệu salon khác |
| Khách hủy trước giờ hẹn ít nhất 2 giờ | Khách đã đăng nhập, lịch thuộc về chính khách đó và còn đủ thời gian theo F04 | Xác minh quyền sở hữu và thời điểm hẹn; cập nhật trạng thái hủy, mở lại slot | Hủy thành công; slot khả dụng lại |
| Khách hủy khi còn dưới 2 giờ | Không đáp ứng điều kiện tối thiểu 2 giờ của F04 | Từ chối hủy theo quy tắc hiện tại và hiển thị lý do; không đổi dữ liệu lịch | Giữ nguyên trạng thái |
| Khách chưa đăng nhập muốn xem lịch sử/tra cứu/hủy | Mô tả đề tài yêu cầu lịch sử cá nhân trong MVP, nhưng F04 yêu cầu tài khoản và F07 để đăng nhập/lịch sử ở giai đoạn sau | Không tự thêm cách tra cứu bằng mã lịch hẹn. Chuyển mâu thuẫn cho TV3 xác nhận | Áp dụng quy tắc sau khi nhóm thống nhất |
| Hủy lặp hoặc hủy lịch đã hoàn tất | Lịch đã ở trạng thái hủy hoặc hoàn tất | Không xử lý chuyển trạng thái lần nữa; hiển thị trạng thái hiện tại | Trạng thái cũ không đổi |
| Cập nhật trạng thái trái quyền/sai thứ tự | Vai trò không có quyền hoặc chuyển từ trạng thái không hợp lệ | Từ chối cập nhật và giữ dữ liệu hiện tại | Trạng thái không đổi |
| Lỗi máy chủ/cơ sở dữ liệu | Không thể lưu an toàn | Báo lỗi, không thông báo đặt thành công; tránh để lại bản ghi một phần | Không có lịch mới hoặc không có thay đổi trạng thái |

## 5. Trạng thái lịch hẹn

`REQUIREMENTS.md` dùng các nhãn trong F06: **Chờ duyệt, Đã xếp chỗ, Hoàn tất, Hủy**. F04 lại dùng **Đã hủy**; bảng vai trò cho stylist có **Đang phục vụ, Hoàn thành**. Bản mô tả đề tài cũng nói chủ salon theo dõi và xử lý trạng thái lịch, nhưng chưa nêu bộ trạng thái cụ thể. Vì vậy, bảng dưới đây ghi nhận các nhãn hiện có và đánh dấu điểm cần TV3 chuẩn hóa, không tự sửa `REQUIREMENTS.md`.

| Trạng thái/nhãn trong tài liệu hiện tại | Ý nghĩa nghiệp vụ | Chuyển tiếp dự kiến | Ghi chú |
|---|---|---|---|
| Chờ duyệt | Booking đã được ghi nhận, chờ salon xử lý/phê duyệt | Đã xếp chỗ hoặc Hủy/Đã hủy nếu hủy được phép | Trạng thái khởi tạo đề xuất; TV3 xác nhận |
| Đã xếp chỗ | Salon đã chấp nhận/điều phối lịch | Đang phục vụ, hoặc Hủy/Đã hủy nếu đáp ứng quy tắc hủy | Cần thống nhất xem nhãn này tương đương "Đã xác nhận" hay không |
| Đang phục vụ | Stylist đang thực hiện dịch vụ | Hoàn tất/Hoàn thành | Có trong quyền của stylist nhưng chưa có trong danh sách trạng thái F06 |
| Hoàn tất / Hoàn thành | Dịch vụ đã hoàn thành | Không chuyển tiếp trong luồng thông thường | F06 ghi "Hoàn tất", bảng vai trò ghi "Hoàn thành"; cần chọn một nhãn chuẩn |
| Hủy / Đã hủy | Booking đã bị hủy | Không chuyển tiếp trong luồng thông thường | F06 ghi "Hủy", F04 ghi "Đã hủy"; cần chọn một nhãn chuẩn |

**Nguyên tắc:** Chỉ vai trò được cấp quyền mới được cập nhật trạng thái. Không đánh dấu hoàn tất trước khi dịch vụ kết thúc. Lịch hủy/hoàn tất không được chuyển ngược bằng cập nhật thông thường. Không thêm trạng thái "Từ chối", "Đã thanh toán" hoặc trạng thái khác khi chưa có quyết định của nhóm.

## 6. 04.3 --- Đối chiếu workflow với F-code của TV3

| Bước / nghiệp vụ | F-code | Mức độ khớp | Ghi chú kiểm tra |
|---|---|---|---|
| Xem danh sách salon, tìm/lọc theo khu vực | Chưa có F-code riêng rõ ràng | **Thiếu / cần xác nhận** | Đây là chức năng MVP trong mô tả đề tài nhưng F01--F07 chưa thể hiện rõ |
| Xem/so sánh salon theo giá, phong cách, khoảng cách | F01 chỉ mô tả xem dịch vụ, mô tả và giá | **Khớp một phần** | Cần xác nhận phạm vi so sánh; ảnh và đánh giá được nhắc trong mô tả kinh doanh nhưng chưa rõ có bắt buộc ở MVP hay không |
| Xem dịch vụ, mô tả và giá | F01 | **Khớp một phần** | F01 phù hợp với thông tin dịch vụ nhưng cần làm rõ dịch vụ thuộc salon nào và giá nào được hiển thị |
| Chọn ngày, xem thợ và slot còn trống | F02 | **Khớp một phần** | Cần giữ ngữ cảnh salon; xét thời lượng dịch vụ và lịch hiện có theo `AGENTS.md`; cách quản lý lịch làm/ngày nghỉ chưa rõ |
| Gửi yêu cầu với họ tên, SĐT, dịch vụ, thợ và giờ; trả mã lịch hẹn | F03 | **Khớp một phần** | Luồng tạo booking phù hợp, nhưng mô hình marketplace cần xác nhận `salon_id` và kiểm tra dịch vụ/stylist thuộc salon đã chọn |
| Tra cứu/hủy lịch cá nhân; hủy trước ít nhất 2 giờ; mở lại slot | F04 | **Có quy tắc nhưng mâu thuẫn phạm vi** | F04 giới hạn ở khách có tài khoản; mô tả đề tài yêu cầu lịch sử đặt chỗ trong MVP, trong khi F07 để đăng nhập/lịch sử là tùy chọn/giai đoạn sau |
| Admin thêm/sửa/tạm ẩn dịch vụ | F05 | **Khớp một phần** | Mô tả đề tài yêu cầu chủ salon cũng quản lý danh mục và giá. Cần phân quyền chủ salon với admin nền tảng và giới hạn dữ liệu theo salon |
| Admin xem lịch theo ngày/trạng thái; cập nhật trạng thái; chống trùng lịch | F06 | **Khớp một phần** | Quy tắc chống trùng được thể hiện; cần bổ sung/đối chiếu quyền chủ salon, phạm vi lịch của từng salon và chuẩn hóa trạng thái |
| Đăng ký/đăng nhập, lưu lịch sử | F07 | **Mâu thuẫn với MVP** | F07 ghi tùy chọn/giai đoạn sau nhưng mô tả đề tài liệt kê lịch sử đặt chỗ cá nhân trong chức năng bắt buộc của phiên bản đầu |
| Quản lý lịch làm/ngày nghỉ của salon và stylist | Chưa có F-code riêng rõ ràng | **Cần TV3 xác nhận** | F02 cần dữ liệu lịch làm để tính slot trống; cần xác định ai quản lý và qua chức năng nào |
| Quản lý hình ảnh/đánh giá salon | Chưa có F-code riêng rõ ràng | **Cần xác nhận phạm vi** | Được nhắc trong vấn đề kinh doanh/giải pháp nhưng chưa có trong danh sách MVP; không tự thêm vào phạm vi |
| Thanh toán trực tuyến | Ngoài phạm vi bắt buộc theo mô tả đề tài | **Không đưa vào MVP** | Chỉ xem xét ở giai đoạn sau nếu nhóm thống nhất |

### 6.1. Các câu hỏi/phản hồi gửi TV3 --- không tự sửa REQUIREMENTS

1.  **Xác nhận mô hình marketplace:** SalonBook là nền tảng nhiều salon tại TP.HCM. F01--F07 có cần bổ sung luồng danh sách salon và lọc theo khu vực không?
2.  **Dữ liệu booking:** F03 hiện chưa nêu rõ `salon_id`. Mỗi booking có cần lưu salon và kiểm tra dịch vụ/stylist thuộc salon đó không?
3.  **Tìm kiếm và so sánh:** Phạm vi MVP có bao gồm lọc salon theo khu vực, so sánh giá/phong cách/khoảng cách không? Hình ảnh và đánh giá là bắt buộc hay để giai đoạn sau?
4.  **Vai trò chủ salon:** Chủ salon có được quản lý dịch vụ, giá và lịch hẹn của salon mình không? Admin nền tảng có quyền khác gì? Có cần giới hạn chủ salon chỉ xem dữ liệu của salon được phân công không?
5.  **Lịch sử và tài khoản:** Mô tả đề tài ghi lịch sử đặt chỗ là MVP, nhưng F07 để đăng nhập/lịch sử ở giai đoạn sau. Cần chốt lịch sử có bắt buộc ở phiên bản đầu không và khách đặt nhanh sẽ tra cứu/hủy như thế nào.
6.  **Chuẩn hóa trạng thái:** F06 liệt kê "Chờ duyệt, Đã xếp chỗ, Hoàn tất, Hủy"; bảng vai trò có "Đang phục vụ, Hoàn thành"; F04 có "Đã hủy". Hãy xác nhận bộ trạng thái chính thức và các chuyển tiếp hợp lệ.
7.  **Lịch làm/ngày nghỉ:** Ai quản lý giờ làm, ngày nghỉ và lịch stylist? Chức năng này thuộc F02, F06 hay cần F-code riêng?
8.  **Đổi lịch:** Bảng vai trò hiện tại có đề cập khách có thể chỉnh sửa lịch cá nhân, nhưng F04 chỉ mô tả tra cứu và hủy. Xác nhận đổi lịch có nằm trong phạm vi hay không.
9.  **Phạm vi triển khai:** Xác nhận thanh toán trực tuyến vẫn ở giai đoạn sau theo mô tả đề tài, không phải tiêu chí nghiệm thu MVP.
