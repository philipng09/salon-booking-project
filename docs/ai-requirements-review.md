
# PHÂN TÍCH VÀ PHẢN BIỆN YÊU CẦU BẰNG AI – SALONBOOK

**Học phần:** Phát triển ứng dụng WEB/TMĐT  
**Đề tài:** SalonBook – Website đặt lịch cắt tóc và quản lý lịch hẹn salon  
**Nhóm đề tài:** B – Ứng dụng đặt dịch vụ  
**Quy mô nhóm:** 7 thành viên  
**Nhiệm vụ:** 3 – Phân tích yêu cầu bằng AI; 4 – Sử dụng AI khác để phản biện  
**AI thứ nhất:** ChatGPT  
**AI thứ hai:** Claude  

> Lưu ý: Tài liệu này biên tập, hệ thống hóa các kết quả đã nhận từ ChatGPT và Claude. Phần nhận xét tổng hợp không được xem là câu trả lời nguyên văn của từng AI. Quyết định cuối cùng thuộc về nhóm.

## 1. Thông tin đầu vào của dự án

| Nội dung | Thông tin |
|---|---|
| Tên dự án | SalonBook |
| Sản phẩm/dịch vụ | Website đặt lịch cắt tóc và quản lý lịch hẹn salon |
| Khách hàng mục tiêu | Người có nhu cầu đặt lịch cắt tóc và chăm sóc tóc; phân khúc cụ thể chưa xác nhận |
| Vấn đề kinh doanh | Khách có thể khó xác định giờ trống; salon có nguy cơ trùng lịch hoặc quản lý lịch thủ công không hiệu quả |
| Mô hình đề xuất | Một salon có nhiều nhân viên, chờ nhóm xác nhận |
| Quy mô nhóm | 7 sinh viên |
| Thời gian | Chưa xác nhận thời hạn toàn đồ án |
| Website khảo sát | 30Shine, Fresha, KiotViet Salon |

**Tài liệu khảo sát:** [Phân tích ba website tương tự](competitor-analysis.md)

Các vấn đề kinh doanh trên là giả thuyết làm cơ sở phân tích yêu cầu; nhóm chưa có kết quả khảo sát khách hàng để xác nhận.

---

## 2. AI thứ nhất – ChatGPT

### 2.1. Mục đích

Sử dụng ChatGPT để hỗ trợ phân tích nghiệp vụ và đề xuất yêu cầu phát triển website SalonBook theo tám nội dung trong Prompt 1 của giảng viên.

### 2.2. Prompt 1 đã sử dụng

> Bạn là chuyên gia phân tích nghiệp vụ cho dự án thương mại điện tử.
>
> Thông tin dự án:
>
> - Tên dự án: SalonBook.
> - Sản phẩm hoặc dịch vụ: Website đặt lịch cắt tóc và quản lý lịch hẹn cho salon.
> - Khách hàng mục tiêu: Người có nhu cầu đặt lịch cắt tóc và sử dụng dịch vụ chăm sóc tóc. Nhóm khách hàng cụ thể chưa được TV1 xác nhận.
> - Vấn đề kinh doanh: Khách khó nắm được khung giờ còn trống; salon có nguy cơ trùng lịch và khó quản lý lịch hẹn thủ công. Đây là giả thuyết cần nhóm kiểm chứng.
> - Website tham khảo: https://30shine.com/ ; https://www.fresha.com/ ; https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/salon-dat-lich-online/dat-lich-online/
> - Kết quả khảo sát: https://github.com/philipng09/salon-booking-project/blob/main/docs/competitor-analysis.md
> - Thời gian thực hiện: Chưa xác nhận thời hạn của toàn đồ án; bài tập Chương 1 được nhóm lên kế hoạch làm trong 2 ngày.
> - Quy mô nhóm: 7 thành viên.
>
> Hãy đề xuất:
>
> 1. Mục tiêu và phạm vi dự án.
> 2. Các nhóm người dùng và quyền hạn.
> 3. Danh sách chức năng cần có.
> 4. Quy trình nghiệp vụ chính.
> 5. Yêu cầu phi chức năng.
> 6. Các chức năng nên hoàn thành ở phiên bản đầu tiên.
> 7. Các chức năng nâng cao có thể bổ sung.
> 8. Rủi ro khi triển khai và cách giảm thiểu.
>
> Phân biệt rõ:
>
> - Yêu cầu bắt buộc.
> - Yêu cầu có thể phát triển sau.
> - Đề xuất cần nhóm xác minh thêm.
>
> Không giả định nhóm có đủ thời gian hoặc năng lực để triển khai tất cả chức năng. Hãy giải thích cơ sở của từng đề xuất.
>
> Hãy trình bày kết quả theo đúng 8 mục trên, bổ sung một bảng ngắn nêu những nội dung cần kiểm tra, điều chỉnh hoặc loại bỏ sau khi nhận kết quả AI. Những gì chưa được TV1 phê duyệt phải ghi là đề xuất hoặc giả định, không tự nhận là quyết định của nhóm.

### 2.3. Kết quả phân tích ChatGPT

*Nội dung sau được biên tập từ câu trả lời AI thứ nhất, giữ lại các đề xuất và mã chức năng phục vụ đối chiếu.*

#### 2.3.1. Mục tiêu và phạm vi

SalonBook được đề xuất nhằm giúp khách hàng xem dịch vụ và đặt lịch trực tuyến, đồng thời giúp salon quản lý nhân viên, ca làm việc và trạng thái cuộc hẹn.

Phạm vi ban đầu là một salon có nhiều nhân viên. Hệ thống đa chi nhánh, AI tư vấn kiểu tóc và quản lý gói liệu trình phức tạp không được ưu tiên trong phiên bản đầu.

Mô hình này cần TV1 xác nhận trước khi trở thành phạm vi chính thức.

#### 2.3.2. Các nhóm người dùng

| Nhóm người dùng | Quyền hạn đề xuất |
|---|---|
| Khách chưa đăng nhập | Xem thông tin salon, dịch vụ và giá |
| Khách hàng | Đặt lịch, xem lịch sử, theo dõi trạng thái, yêu cầu hủy |
| Nhân viên/Lễ tân | Xem và xử lý lịch theo quyền được cấp |
| Admin | Quản lý dịch vụ, nhân viên, ca làm việc, tài khoản và lịch hẹn |

Cần xác minh chính sách đăng nhập và sự khác nhau giữa tài khoản lễ tân với nhân viên được khách đặt lịch.

#### 2.3.3. Danh sách chức năng đề xuất

| Mã | Chức năng | Phân loại sơ bộ của AI 1 |
|---|---|---|
| F01 | Trang chủ, danh mục và chi tiết dịch vụ | Yêu cầu nền tảng |
| F02 | Tìm kiếm, lọc và sắp xếp dịch vụ | Yêu cầu nền tảng |
| F03 | Đăng ký, đăng nhập, quản lý tài khoản | Yêu cầu nền tảng |
| F04 | Chọn dịch vụ và nhân viên | Cốt lõi nghiệp vụ |
| F05 | Hiển thị ngày, giờ khả dụng | Cốt lõi nghiệp vụ |
| F06 | Tạo lịch hẹn, xác nhận đặt lịch | Cốt lõi nghiệp vụ |
| F07 | Xem lịch sử, trạng thái và yêu cầu hủy | Cốt lõi nghiệp vụ |
| F08 | Quản lý dịch vụ, giá và danh mục | Quản trị |
| F09 | Quản lý nhân viên, ca làm việc | Cốt lõi nghiệp vụ |
| F10 | Tiếp nhận, xác nhận, cập nhật lịch | Cốt lõi nghiệp vụ |
| F11 | Giỏ dịch vụ, checkout, đơn dịch vụ | Yêu cầu TMĐT cần thiết kế phù hợp |
| F12 | Thanh toán trực tuyến | Cần đáp ứng quy định đồ án |
| F13 | Voucher, khuyến mãi | Cần đáp ứng quy định đồ án |
| F14 | Shipping/vận chuyển | Cần giảng viên xác nhận cách áp dụng |
| F15 | Dashboard quản trị | Cần đáp ứng quy định đồ án |
| F16 | Một chức năng mở rộng có giá trị nghiệp vụ | Chưa chọn cụ thể |
| F17 | Đánh giá dịch vụ, dịch vụ liên quan | Cần đối chiếu quy định/phạm vi |
| F18 | Combo, package, phân nhân viên tự động | Phát triển sau |

Các nhãn bắt buộc từ AI 1 phải được nhóm đối chiếu lại với quy định đồ án gốc trước khi chốt.

#### 2.3.4. Quy trình nghiệp vụ chính

1. Khách truy cập website và tìm dịch vụ.
2. Xem mô tả, giá và thời lượng.
3. Chọn nhân viên.
4. Chọn ngày, giờ còn khả dụng.
5. Nhập thông tin và kiểm tra yêu cầu.
6. Hệ thống kiểm tra lần cuối và lưu cuộc hẹn.
7. Salon xác nhận hoặc xử lý theo quy tắc.
8. Khách theo dõi trạng thái; salon cập nhật sau phục vụ.

Các ngoại lệ cần xử lý gồm: hết chỗ, nhân viên nghỉ, thông tin không hợp lệ, hai khách đặt đồng thời, hủy lịch và thanh toán thất bại.

#### 2.3.5. Yêu cầu phi chức năng

| Nhóm | Đề xuất |
|---|---|
| Khả năng sử dụng | Luồng đặt lịch dễ hiểu |
| Responsive | Giao diện dùng được trên desktop và mobile |
| Bảo mật | Xác thực, phân quyền, bảo vệ dữ liệu |
| Toàn vẹn dữ liệu | Tránh xác nhận lịch chồng lấn không hợp lệ |
| Hiệu năng | Có kiểm thử thời gian phản hồi; chưa tự đặt ngưỡng |
| Bảo trì | Mã nguồn có cấu trúc và được quản lý trên GitHub |
| Xử lý lỗi | Thanh toán thất bại không gây sai trạng thái |
| Quyền riêng tư | Chỉ truy cập thông tin khách theo quyền phù hợp |

#### 2.3.6. Chức năng phiên bản đầu

Ưu tiên xây dựng một luồng nghiệp vụ hoàn chỉnh:

- Danh mục, chi tiết dịch vụ.
- Nhân viên và ca làm việc.
- Chọn dịch vụ, nhân viên, thời gian.
- Kiểm tra và tạo lịch hợp lệ.
- Xác nhận, quản lý trạng thái lịch.
- Khách xem lịch hẹn.
- Đăng nhập và phân quyền cơ bản.

Đây là MVP nghiệp vụ, không đồng nghĩa đã đáp ứng tất cả yêu cầu đồ án cuối kỳ.

#### 2.3.7. Chức năng nâng cao

Các chức năng được cân nhắc sau gồm combo nhiều dịch vụ, package nhiều buổi, tự động phân nhân viên, nhắc lịch qua email, gợi ý dịch vụ và AI tư vấn kiểu tóc.

Việc lựa chọn một chức năng mở rộng bắt buộc vẫn cần được xác nhận riêng, tránh tính trùng chức năng lõi.

#### 2.3.8. Rủi ro và biện pháp giảm thiểu

| Rủi ro | Biện pháp đề xuất |
|---|---|
| Đặt trùng lịch | Kiểm tra lịch và xử lý đồng thời tại backend/CSDL |
| Phạm vi quá rộng | Giới hạn chức năng và chia giai đoạn |
| Thiếu kỹ năng tích hợp | Đánh giá năng lực, thử nghiệm sớm |
| Tích hợp thanh toán khó | Chọn một cổng sandbox và kiểm thử |
| Shipping khó áp dụng | Hỏi giảng viên trước khi thiết kế |
| Sai phân quyền | Kiểm thử truy cập trái phép |
| Lỗi hủy lịch | Xác định trạng thái và chính sách hủy |
| Sai thời gian | Thống nhất múi giờ và định dạng |
| Xung đột mã nguồn | Sử dụng branch, pull request, review |
| Đề xuất AI không phù hợp | Nhóm kiểm tra và ghi nhật ký sử dụng AI |

---

## 3. AI thứ hai – Claude

### 3.1. Mục đích

Claude được sử dụng để phản biện độc lập kết quả phân tích của ChatGPT theo Nhiệm vụ 4, không mặc định rằng đề xuất AI thứ nhất là đúng.

### 3.2. Nội dung Prompt 2 theo mẫu

> Bạn là người phản biện độc lập cho một dự án website thương mại điện tử do nhóm sinh viên thực hiện trong một học phần.
>
> Tôi sẽ cung cấp:
>
> 1. Mô tả đề tài.
> 2. Vấn đề kinh doanh và khách hàng mục tiêu.
> 3. Kết quả khảo sát ba website.
> 4. Danh sách yêu cầu do một công cụ AI khác đề xuất.
>
> Hãy phản biện các yêu cầu theo những khía cạnh:
>
> - Có thực sự giải quyết vấn đề kinh doanh không?
> - Có yêu cầu nào trùng lặp hoặc không cần thiết không?
> - Có chức năng nào vượt quá phạm vi của nhóm không?
> - Có thiếu chức năng cơ bản hoặc quy trình nghiệp vụ nào không?
> - Có rủi ro về dữ liệu, bảo mật hoặc quyền riêng tư không?
> - Có yêu cầu nào chưa đủ rõ để lập trình và kiểm thử không?
>
> Với mỗi vấn đề, hãy nêu lý do và đề xuất điều chỉnh.
>
> Không mặc định rằng phương án của công cụ AI trước là đúng.
> Không tự ý thay đổi toàn bộ đề tài.

**Dữ liệu gửi cho Claude:** Mô tả SalonBook, vấn đề kinh doanh, bảng khảo sát 30Shine – Fresha – KiotViet Salon và kết quả AI thứ nhất.

**Lưu ý minh chứng:** Nội dung trên là mẫu cốt lõi của giảng viên. TV2 cần đối chiếu lại cuộc trò chuyện Claude nếu có bổ sung câu lệnh khác trong prompt thực tế.

### 3.3. Kết quả phản biện của Claude

*Nội dung dưới đây được hệ thống hóa từ phản hồi Claude mà TV2 đã nhận.*

#### 3.3.1. Khả năng giải quyết vấn đề kinh doanh

Claude nhận xét mục tiêu SalonBook phù hợp nhưng chưa có cách đánh giá mức độ giải quyết hai vấn đề: khó tìm giờ trống và đặt trùng lịch.

Đề xuất bổ sung chỉ số thành công có thể kiểm thử, chẳng hạn không xảy ra lịch chồng lấn trong bộ test. Cần xác định rõ phân khúc khách hàng và nên kiểm chứng giả thuyết thực tế nếu có điều kiện.

#### 3.3.2. Trùng lặp và chức năng chưa cần thiết

- F06 và F11 có nguy cơ trùng lặp giữa lịch hẹn và checkout.
- Giỏ nhiều dịch vụ có thể kéo theo nghiệp vụ combo phức tạp, mâu thuẫn với việc hoãn F18.
- F18 gộp ba chức năng riêng: combo, package, tự phân thợ.
- F16 chưa xác định chức năng mở rộng cụ thể.
- F15 chưa mô tả chỉ số thống kê rõ ràng.

Claude đề xuất chọn Booking làm thực thể nghiệp vụ chính và thống nhất quan hệ với checkout/đơn dịch vụ.

#### 3.3.3. Chức năng có thể vượt phạm vi

- Shipping chưa rõ cách áp dụng với salon: cần hỏi giảng viên.
- Thanh toán nên giới hạn một tích hợp sandbox phù hợp.
- Voucher cần quy định đơn giản, tránh nhiều điều kiện chồng chéo.
- Cần chốt số vai trò và quyền để tránh quá phức tạp.

Không nên triển khai đồng thời tất cả các chức năng nâng cao.

#### 3.3.4. Nghiệp vụ còn thiếu

Claude chỉ ra các nội dung cần xem xét:

1. Lễ tân tạo lịch hộ khách đến trực tiếp hoặc gọi điện.
2. Chặn giờ bận ngoài hệ thống.
3. Quy trình đổi lịch hoặc hủy rồi đặt lại.
4. Vòng đời trạng thái lịch hẹn.
5. Liên kết nhân viên thực hiện được dịch vụ nào.
6. Giờ nghỉ, ngày nghỉ và thời gian đệm.
7. Quy tắc sức chứa theo nhân viên hoặc khung giờ.
8. Phân biệt nhân viên được đặt lịch với tài khoản người dùng.
9. Thông báo kết quả đặt lịch ở mức cơ bản.

#### 3.3.5. Dữ liệu, bảo mật và quyền riêng tư

Claude yêu cầu cụ thể hóa những rủi ro:

- Hai yêu cầu đồng thời cùng đặt một giờ.
- Khách truy cập hoặc hủy lịch của khách khác.
- API lịch trống làm lộ dữ liệu cá nhân.
- Xác thực kết quả thanh toán, xử lý callback lặp.
- Lộ khóa API hoặc dữ liệu nhạy cảm trong repo công khai.
- Phân quyền và giới hạn dữ liệu mỗi vai trò được xem.
- Chống spam tạo lịch, bảo vệ mật khẩu và dữ liệu khách.

Đây là các điểm phản biện chuyên môn; nhóm cần chọn phương án phù hợp năng lực triển khai và yêu cầu bảo mật đồ án.

#### 3.3.6. Yêu cầu chưa đủ rõ để kiểm thử

| Yêu cầu | Điểm cần làm rõ |
|---|---|
| F05 | Bước khung giờ, thời gian đệm, quy tắc chồng lấn |
| F07 | Hủy trực tiếp hay yêu cầu hủy, thời hạn hủy |
| F10 | Tự xác nhận hay xác nhận thủ công |
| F11/F12 | Quan hệ trạng thái thanh toán với trạng thái đặt lịch |
| F13 | Quy tắc sử dụng voucher |
| F15 | Chỉ số cụ thể của dashboard |
| F17 | Điều kiện được đánh giá dịch vụ |
| Phi chức năng | Tiêu chí đo và kiểm thử |
| Chung | Mỗi chức năng cần có tiêu chí nghiệm thu rõ ràng |

---

## 4. Bảng tổng hợp theo mẫu

**Nguyên tắc:** Ba cột đầu phản ánh nội dung phân tích và phản biện thực tế; cột cuối để nhóm quyết định sau khi thảo luận. Không gán đề xuất của ChatGPT thành quyết định chính thức của nhóm.

| Nội dung | AI thứ nhất đề xuất | AI thứ hai phản biện | Quyết định của nhóm |
|---|---|---|---|
| Phạm vi một salon | Có | Phù hợp để giới hạn phạm vi, cần xác nhận | Giữ lại |
| Khách hàng mục tiêu | Người có nhu cầu dịch vụ tóc | Cần xác định phân khúc và kiểm chứng giả thuyết | Điều chỉnh cụ thể hơn nếu cần |
| F01 – Danh mục/chi tiết | Có | Hợp lý, cần cho khách xem dịch vụ | Giữ lại |
| F02 – Tìm kiếm/lọc | Có | Giữ ý tưởng, cần rõ tiêu chí lọc | Giữ lại |
| F03 – Tài khoản | Có | Cần chốt khách bắt buộc đăng nhập không | Giữ lại, điều chỉnh |
| F04 – Chọn dịch vụ/thợ | Có | Thiếu liên kết thợ–dịch vụ | Giữ lại, bổ sung |
| F05 – Giờ khả dụng | Có | Thiếu quy tắc ca, đệm, chồng lấn | Giữ lại, bổ sung |
| F06 – Tạo lịch | Có | Dễ trùng với F11; cần phân biệt Booking và Checkout | Giữ lại, điều chỉnh |
| F07 – Lịch sử/hủy | Có | Cần quy tắc hủy và đổi lịch | Giữ lại, bổ sung |
| F08 – Quản lý dịch vụ | Có | Hợp lý, chức năng quản trị cơ bản | Giữ lại |
| F09 – Ca làm việc | Có | Thiếu ngày nghỉ, liên kết dịch vụ và sức chứa | Giữ lại, bổ sung |
| F10 – Xử lý lịch | Có | Thiếu trạng thái và quy tắc chuyển trạng thái | Giữ lại, bổ sung |
| F11 – Giỏ/checkout | Có | Trùng khái niệm F06; cần thiết kế lại | Điều chỉnh và tích hợp F06 |
| F12 – Thanh toán | Có | Nên giới hạn phạm vi tích hợp, làm rõ đặt cọc/trả toàn bộ | Giữ lại, triển khai theo giai đoạn |
| F13 – Voucher | Có | Cần quy tắc đơn giản và có thể kiểm thử | Giữ lại, đơn giản hóa |
| F14 – Shipping | Có | Khó áp dụng trực tiếp với dịch vụ salon | Cân nhắc |
| F15 – Dashboard | Có | Cần nêu rõ chỉ số được tính | Giữ lại, bổ sung |
| F16 – Mở rộng | Có | Chưa chọn chức năng; không được trùng lõi | Cân nhắc việc nhắc lịch qua email |
| F17 – Đánh giá | Có | Cần làm rõ điều kiện đánh giá và mức ưu tiên | Giữ lại nếu thuộc yêu cầu nền tảng |
| F18 – Combo/package/tự phân thợ | Có | Nên tách thành các chức năng riêng và cân nhắc hoãn | Tách riêng, hoãn |
| Đặt lịch hộ khách | AI 1 chưa nêu rõ | Cần xem xét để đồng bộ lịch online và offline | Bổ sung |
| Chặn giờ | AI 1 chưa nêu rõ | Giúp tránh lịch phát sinh ngoài hệ thống | Bổ sung |
| Đổi lịch | AI 1 chưa nêu rõ | Cần chọn đổi trực tiếp hoặc hủy rồi đặt lại | Bổ sung |
| Chống trùng đồng thời | Có nêu chung | Cần kiểm soát tại CSDL và có test đồng thời | Giữ lại, kiểm thử |
| Bảo mật dữ liệu | Có nêu chung | Cần kiểm thử quyền sở hữu lịch, phân quyền, API và thanh toán | Giữ lại |
| Tiêu chí nghiệm thu | Chưa đầy đủ | Cần bổ sung tiêu chí kiểm thử cho từng chức năng | Bổ sung |

--------

## 5. Kết luận

ChatGPT đề xuất bộ yêu cầu ban đầu cho SalonBook theo tám nhóm nội dung của giảng viên. Claude phản biện độc lập và chỉ ra các điểm cần điều chỉnh, đặc biệt là sự trùng lặp giữa đặt lịch và checkout, các nghiệp vụ vận hành salon còn thiếu, rủi ro bảo mật và tiêu chí nghiệm thu chưa rõ.

Những đề xuất của hai AI là tài liệu hỗ trợ ra quyết định, không thay thế việc thảo luận và kiểm chứng của nhóm. Trước khi chốt `REQUIREMENTS.md`, TV1 cùng các thành viên cần quyết định giữ, sửa, hoãn hoặc loại bỏ từng yêu cầu quan trọng và giải thích được lý do.

**Trạng thái:** Chờ nhóm xem xét và phê duyệt.
