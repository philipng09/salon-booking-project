
# AI Usage Log

## Lần sử dụng 1

### Công cụ

- **AI thứ nhất:** ChatGPT
- **AI thứ hai (phản biện):** Claude

### Mục đích

Sử dụng AI để hỗ trợ phân tích, đề xuất và phản biện các yêu cầu nghiệp vụ cho dự án SalonBook – nền tảng Marketplace kết nối khách hàng với nhiều salon tóc độc lập tại Thành phố Hồ Chí Minh.

Cụ thể:
- Xác định mục tiêu và phạm vi dự án.
- Phân tích nhóm người dùng và quyền hạn.
- Đề xuất các chức năng chính của hệ thống.
- Xây dựng quy trình nghiệp vụ đặt lịch.
- Xác định yêu cầu phi chức năng và bảo mật.
- Phân loại chức năng MVP và chức năng nâng cao.
- Nhận diện rủi ro và đề xuất phương án giảm thiểu.
- Đối chiếu, phản biện và điều chỉnh các yêu cầu trước khi triển khai.

### Prompt

**Prompt 1 – Sử dụng ChatGPT để phân tích yêu cầu**

Bạn là chuyên gia phân tích nghiệp vụ cho dự án thương mại điện tử.

Thông tin dự án:
- Tên dự án: Website đặt lịch Salon – SalonBook.
- Mô hình: Marketplace kết nối nhiều salon, barbershop độc lập tại TP.HCM.
- Khách hàng mục tiêu: Người từ 16–40 tuổi, đặc biệt là học sinh, sinh viên và nhân viên văn phòng.
- Vấn đề kinh doanh: Khách hàng khó tìm kiếm, so sánh salon và mất thời gian đặt lịch thủ công. Salon gặp khó khăn trong quản lý lịch hẹn, tránh trùng lịch và tiếp cận khách hàng trực tuyến.
- Website tham khảo: 30Shine, Fresha và KiotViet Salon.
- Nhóm thực hiện: 7 thành viên trong một học phần đại học.

Phạm vi dự án:
- Khách hàng lựa chọn salon, dịch vụ, stylist và khung giờ.
- Chủ salon chỉ quản lý dữ liệu thuộc salon của mình.
- Khách được hủy lịch trước giờ hẹn tối thiểu 2 tiếng.
- Không hỗ trợ thay đổi lịch trực tiếp.
- Chỉ được đánh giá sau khi hoàn thành dịch vụ.
- Không xử lý thanh toán hoặc vận chuyển.

Hãy đề xuất:
1. Mục tiêu và phạm vi dự án.
2. Các nhóm người dùng và quyền hạn.
3. Danh sách chức năng cần có.
4. Quy trình nghiệp vụ chính.
5. Yêu cầu phi chức năng.
6. Các chức năng nên hoàn thành trong phiên bản đầu tiên.
7. Các chức năng nâng cao có thể bổ sung.
8. Rủi ro triển khai và cách giảm thiểu.

Phân biệt rõ yêu cầu bắt buộc, yêu cầu phát triển sau và đề xuất cần nhóm xác minh thêm.

**Prompt 2 – Sử dụng Claude để phản biện**

Bạn là người phản biện độc lập cho một dự án website thương mại điện tử do nhóm sinh viên thực hiện trong một học phần đại học.

Dựa trên mô tả dự án SalonBook, kết quả khảo sát các website 30Shine, Fresha, KiotViet Salon và toàn bộ kết quả phân tích yêu cầu do ChatGPT đề xuất, hãy phản biện theo các khía cạnh:

1. Các yêu cầu có thực sự giải quyết vấn đề kinh doanh không?
2. Có yêu cầu nào trùng lặp hoặc không cần thiết?
3. Có chức năng nào vượt quá phạm vi và nguồn lực nhóm?
4. Có thiếu chức năng hoặc quy trình nghiệp vụ quan trọng nào?
5. Có rủi ro về dữ liệu, bảo mật hoặc quyền riêng tư không?
6. Có yêu cầu nào chưa đủ rõ để lập trình và kiểm thử không?

Với mỗi vấn đề, hãy nêu rõ hạn chế và đề xuất điều chỉnh.

Không mặc định các đề xuất của công cụ AI trước đó là chính xác và không tự động thay đổi toàn bộ tài liệu.

### Kết quả đề xuất

**1. Kết quả phân tích của ChatGPT**

ChatGPT đề xuất xây dựng SalonBook theo mô hình Marketplace, tập trung vào các nhóm chức năng:

- Tìm kiếm và lọc salon theo khu vực, loại hình và dịch vụ.
- Xem thông tin salon, bảng giá, stylist và đánh giá.
- Đăng ký, đăng nhập và phân quyền người dùng.
- Đặt lịch trực tuyến theo salon, dịch vụ, stylist và giờ khả dụng.
- Quản lý lịch sử và hủy lịch hẹn.
- Đánh giá salon sau khi hoàn thành dịch vụ.
- Quản lý thông tin, dịch vụ và lịch làm việc của salon.
- Quản lý trạng thái lịch hẹn.
- Quản trị tài khoản và salon đối tác.

Các yêu cầu phi chức năng được đề xuất gồm:
- Bảo mật thông tin người dùng.
- Phân quyền và cách ly dữ liệu giữa các salon.
- Kiểm tra giờ khả dụng và ngăn trùng lịch.
- Kiểm tra dữ liệu đầu vào.
- Thiết kế giao diện responsive.
- Đảm bảo khả năng bảo trì và mở rộng hệ thống.

ChatGPT cũng nhận diện các rủi ro như trùng lịch stylist, truy cập trái phép, dữ liệu không hợp lệ, trạng thái lịch không nhất quán và nguy cơ vượt tiến độ.

**2. Kết quả phản biện của Claude**

Claude đánh giá bản phân tích của ChatGPT đã nhận diện được các nghiệp vụ cốt lõi nhưng còn một số hạn chế:

- Chức năng tìm kiếm chưa hỗ trợ đầy đủ mục tiêu so sánh salon.
- Chưa xử lý rõ các lịch hẹn phát sinh qua điện thoại hoặc khách đến trực tiếp.
- Chưa có phương án cụ thể với khách đặt lịch nhưng không đến.
- Quy trình tiếp nhận và phê duyệt salon đối tác chưa rõ ràng.
- Một số chức năng có khả năng chồng chéo về phân quyền và quản lý trạng thái.
- Chưa làm rõ trường hợp salon từ chối hoặc hủy lịch.
- Chưa xác định đầy đủ cơ chế xác nhận lịch và thông báo.
- Chưa quy định rõ ảnh hưởng khi thay đổi giá, dịch vụ hoặc stylist.
- Các quy tắc kiểm tra trùng lịch, bảo mật và tiêu chí nghiệm thu cần được cụ thể hóa.

### Phản biện

Sau khi đối chiếu kết quả của hai công cụ AI, nhóm ghi nhận:

**1. Về tìm kiếm và so sánh salon**

Claude chỉ ra rằng việc chỉ lọc theo khu vực và nhóm dịch vụ chưa đáp ứng đầy đủ mục tiêu so sánh.

Nhóm tiếp thu đề xuất làm rõ khả năng tìm kiếm theo tên hoặc dịch vụ, đồng thời cân nhắc các bộ lọc nâng cao theo nguồn lực triển khai.

**2. Về quản lý lịch hẹn**

ChatGPT tập trung vào lịch đặt qua website nhưng chưa xử lý đầy đủ tình huống lịch hẹn từ các kênh khác.

Nhóm ghi nhận nhu cầu quản lý thời gian không phục vụ của stylist. Việc nhập lịch thủ công từ điện thoại hoặc khách trực tiếp cần được xem xét thêm.

**3. Về khách không đến lịch hẹn**

Claude đề xuất bổ sung trạng thái "Không đến" và giới hạn số lịch đang hoạt động.

Nhóm ghi nhận đây là rủi ro vận hành nhưng chưa đưa vào yêu cầu bắt buộc khi chưa thống nhất quy tắc xử lý.

**4. Về quản trị salon**

Claude đề nghị làm rõ quy trình tiếp nhận salon mới.

Nhóm ưu tiên phương án Admin tạo hoặc phê duyệt hồ sơ salon và liên kết tài khoản quản lý với đúng salon.

**5. Về phân quyền và bảo mật**

Hai công cụ đều nhấn mạnh việc bảo vệ dữ liệu khách hàng và giới hạn quyền truy cập của chủ salon.

Nhóm tiếp thu yêu cầu kiểm tra quyền tại backend, không cho phép truy cập chéo dữ liệu giữa các salon và hạn chế thu thập thông tin cá nhân không cần thiết.

**6. Về quy trình đặt lịch**

Claude yêu cầu làm rõ tình huống nhiều khách cùng đặt một stylist trong khoảng thời gian trùng nhau.

Nhóm thống nhất phải kiểm tra toàn bộ thời lượng dịch vụ và kiểm tra lại giờ khả dụng tại thời điểm lưu lịch.

**7. Về tính khả thi**

Claude cảnh báo khối lượng chức năng tương đối lớn đối với nhóm 7 sinh viên.

Nhóm thống nhất ưu tiên triển khai các chức năng theo mức độ phụ thuộc nghiệp vụ, tập trung hoàn thiện luồng đặt lịch cốt lõi trước các tính năng nâng cao.

### Quyết định của nhóm

Sau khi phân tích và phản biện, nhóm đưa ra các quyết định:

**1. Nội dung giữ lại**

- Giữ mô hình Marketplace kết nối nhiều salon độc lập.
- Giữ chức năng tìm kiếm, lọc và xem thông tin salon.
- Giữ quy trình đặt lịch theo dịch vụ, stylist và khung giờ.
- Giữ chức năng quản lý lịch sử và hủy lịch hẹn.
- Giữ quy định hủy lịch trước giờ hẹn tối thiểu 120 phút.
- Giữ chức năng đánh giá sau khi hoàn thành dịch vụ.
- Giữ chức năng quản lý salon, nhân viên và lịch làm việc.
- Giữ chức năng quản trị hệ thống và phân quyền.
- Giữ yêu cầu kiểm tra chống trùng lịch và bảo mật dữ liệu.

**2. Nội dung điều chỉnh hoặc làm rõ**

- Làm rõ khả năng tìm kiếm salon theo tên hoặc dịch vụ.
- Phân biệt quyền quản lý lịch của khách hàng và chủ salon.
- Làm rõ quy trình Admin tiếp nhận và phê duyệt salon đối tác.
- Xác định lịch đang chờ xác nhận cũng phải được xét khi kiểm tra giờ khả dụng.
- Bảo toàn thông tin lịch sử khi thay đổi giá, dịch vụ hoặc stylist.
- Quy định khách được hủy lịch khi còn ít nhất 120 phút trước giờ hẹn và trạng thái lịch cho phép.
- Bổ sung yêu cầu kiểm thử đặt trùng giờ, phân quyền và các tình huống ngoại lệ.
- Xem xét phương án salon từ chối hoặc hủy lịch khi không thể phục vụ.

**3. Nội dung chưa đưa vào phiên bản đầu tiên**

- Chatbot AI tư vấn kiểu tóc.
- Hệ thống tích điểm thành viên và voucher.
- Thanh toán trực tuyến.
- Đổi lịch trực tiếp.
- Hệ thống tự động xử lý khách không đến.
- Giao diện so sánh song song nhiều salon.
- Các tính năng mở rộng khác chưa được nhóm thống nhất.

**Kết luận:** Nhóm không áp dụng toàn bộ nội dung do AI đề xuất mà lựa chọn, điều chỉnh và kiểm chứng dựa trên mục tiêu kinh doanh, phạm vi dự án, nguồn lực thực hiện và khả năng triển khai thực tế.

### Người kiểm tra

- **Duyên (TV2 – Research & AI Specialist):** Thực hiện phân tích, phản biện và tổng hợp kết quả sử dụng AI.
- **Bảo Hân (TV3 – Requirements Analyst):** Đối chiếu các đề xuất với tài liệu yêu cầu và danh sách chức năng hệ thống.
- **Ngân (TV1 – Leader / Business Analyst):** Rà soát phạm vi và quyết định cuối cùng của nhóm.
- **Thông (TV7 – QA & Documentation):** Tổng hợp và cập nhật nhật ký sử dụng AI trong repository.

---

## Nguyên tắc sử dụng AI

- AI chỉ được sử dụng như công cụ hỗ trợ nghiên cứu, phân tích và đề xuất.
- Các kết quả AI phải được thành viên nhóm kiểm tra trước khi áp dụng.
- Không tự động đưa toàn bộ đề xuất AI vào yêu cầu dự án.
- Không cung cấp thông tin đăng nhập, mật khẩu, API key hoặc token cho công cụ AI.
- Không đưa dữ liệu cá nhân, tài liệu mật hoặc tài liệu không được phép công khai lên GitHub.
- Nhóm chịu trách nhiệm đối với nội dung, mã nguồn và kết quả cuối cùng của dự án.

