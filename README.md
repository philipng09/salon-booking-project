# SalonBook – Website Đặt Lịch Salon Tóc Trực Tuyến

---

## 1. Giới thiệu

**SalonBook** là nền tảng thương mại điện tử hoạt động theo mô hình trung gian (Marketplace), kết nối khách hàng có nhu cầu chăm sóc tóc với các salon và barbershop tại Thành phố Hồ Chí Minh.

Website hỗ trợ khách hàng tìm kiếm, so sánh và đặt lịch trực tuyến cho các dịch vụ như cắt tóc, uốn, nhuộm, gội đầu dưỡng sinh và phục hồi tóc.

### Vấn đề kinh doanh cần giải quyết

- Khách hàng mất thời gian khi phải đặt lịch qua điện thoại hoặc tin nhắn.
- Khó tìm kiếm và so sánh salon theo vị trí, bảng giá và chất lượng phục vụ.
- Salon quản lý lịch hẹn thủ công, dễ xảy ra tình trạng trùng lịch hoặc bỏ sót khách.
- Các salon vừa và nhỏ gặp khó khăn trong việc tiếp cận khách hàng trực tuyến.
- Khách hàng cần thêm công cụ tham khảo kiểu tóc phù hợp trước khi lựa chọn dịch vụ.

**Giải pháp:** SalonBook cung cấp nền tảng đặt lịch tập trung, cho phép khách hàng chủ động lựa chọn salon, dịch vụ, stylist và khung giờ phù hợp. Đồng thời, nền tảng hỗ trợ chủ salon quản lý lịch hẹn, nhân viên và dịch vụ hiệu quả hơn, kết hợp các chức năng AI hỗ trợ tư vấn kiểu tóc và đăng ký làm mẫu tóc.

---

## 2. Khách hàng mục tiêu

### Khách hàng cá nhân
- Học sinh, sinh viên và nhân viên văn phòng từ 16–40 tuổi tại TP.HCM.
- Người có nhu cầu sử dụng dịch vụ chăm sóc tóc thường xuyên.
- Người có lịch trình bận rộn, muốn chủ động đặt lịch và hạn chế thời gian chờ đợi.
- Người muốn tham khảo bảng giá, vị trí và đánh giá trước khi lựa chọn salon.
- Người có nhu cầu tham khảo kiểu tóc phù hợp với khuôn mặt và tìm kiếm cơ hội làm mẫu tóc.

### Đối tác salon
- Chủ salon tóc, barbershop vừa và nhỏ tại TP.HCM.
- Các salon có nhu cầu số hóa quy trình quản lý lịch hẹn.
- Các salon muốn mở rộng khả năng tiếp cận khách hàng qua nền tảng trực tuyến.
- Các salon có nhu cầu đăng bài tuyển mẫu tóc và quản lý ứng viên.

---

## 3. Chức năng chính

Hệ thống dự kiến phát triển 13 chức năng chính trong phiên bản đầu tiên (MVP):

| Mã | Chức năng | Mô tả |
|---|---|---|
| F01 | Tìm kiếm và lọc salon | Tìm kiếm salon theo khu vực, loại hình và nhóm dịch vụ. |
| F02 | Xem thông tin salon | Xem thông tin salon, bảng giá, dịch vụ và danh sách stylist. |
| F03 | Phân tích khuôn mặt và gợi ý kiểu tóc bằng AI | Phân tích ảnh khuôn mặt và đề xuất khoảng 3–5 kiểu tóc tham khảo; hỗ trợ gợi ý salon hoặc stylist phù hợp khi có đủ dữ liệu. |
| F04 | Đăng bài tuyển mẫu và ứng tuyển | Chủ salon đăng bài tuyển mẫu tóc; khách hàng xem thông tin và gửi đơn ứng tuyển. |
| F05 | Đặt lịch trực tuyến | Chọn salon, dịch vụ, stylist, ngày và khung giờ phù hợp; hệ thống kiểm tra lịch làm việc và hạn chế trùng lịch. |
| F06 | Quản lý và hủy lịch | Xem lịch sử đặt lịch và hủy lịch theo điều kiện quy định; việc đổi lịch được thực hiện bằng cách hủy lịch cũ nếu đủ điều kiện và tạo lịch mới. |
| F07 | Đánh giá salon | Chấm điểm 1–5 sao và nhận xét sau khi hoàn thành dịch vụ. |
| F08 | Đăng ký và đăng nhập | Xác thực tài khoản và phân quyền người dùng. |
| F09 | Quản lý salon và dịch vụ | Chủ salon cập nhật thông tin, danh mục dịch vụ, bảng giá và thông tin stylist. |
| F10 | Quản lý lịch làm việc | Thiết lập ca trực, lịch làm việc và ngày nghỉ của stylist. |
| F11 | Quản lý lịch hẹn | Chủ salon tiếp nhận, xác nhận và cập nhật trạng thái lịch hẹn theo quy trình nghiệp vụ. |
| F12 | Quản trị hệ thống | Admin quản lý tài khoản, kiểm duyệt nội dung và hỗ trợ vận hành nền tảng. |
| F13 | Chatbot AI tư vấn kiểu tóc | Hỗ trợ khách hàng tham khảo kiểu tóc và lựa chọn dịch vụ chăm sóc tóc phù hợp. |

### Chức năng và quy tắc nghiệp vụ liên quan

- Lịch hẹn phải được kiểm tra theo lịch làm việc của stylist, thời lượng dịch vụ và thời gian đệm giữa các lịch.
- Hệ thống cần hạn chế tình trạng nhiều khách hàng đặt cùng một khung giờ không khả dụng.
- Giá dịch vụ tại thời điểm đặt lịch cần được lưu lại cùng thông tin lịch hẹn.
- Khách hàng chỉ được quản lý lịch hẹn thuộc tài khoản của mình; chủ salon chỉ được quản lý dữ liệu thuộc salon mình.
- Hình ảnh sử dụng cho chức năng phân tích AI cần được xóa trong vòng 24 giờ sau khi hoàn tất phân tích.
- Cần xác định rõ thời điểm tính thời hạn lưu trữ đối với ảnh ứng tuyển làm mẫu.
- Trong phạm vi MVP, hệ thống không triển khai thanh toán trực tuyến; khách hàng và salon tự thỏa thuận việc thanh toán.

---

## 4. Thành viên

Nhóm thực hiện gồm 7 thành viên:

| STT | Thành viên | Vai trò | Nhiệm vụ chính |
|---|---|---|---|
| 1 | Ngân | Leader / Business Analyst | Điều phối nhóm, kiểm soát phạm vi và nghiệm thu dự án. |
| 2 | Duyên | Research & AI Specialist | Phân tích đối thủ, phản biện AI và hỗ trợ thiết kế giao diện. |
| 3 | Bảo Hân | Requirements Analyst | Phân tích yêu cầu chức năng và thiết kế cấu trúc dữ liệu. |
| 4 | Ngọc Hân | Workflow & UX Designer | Xây dựng quy trình nghiệp vụ và thiết kế trải nghiệm người dùng. |
| 5 | My | Project Manager & Planner | Lập kế hoạch, phân công công việc và theo dõi tiến độ. |
| 6 | Phi | Technical Lead & Fullstack | Thiết lập hệ thống, phát triển frontend, backend và triển khai website. |
| 7 | Thông | QA & Documentation | Kiểm thử hệ thống, quản lý tài liệu và hoàn thiện README. |

---

## 5. Công nghệ dự kiến

Các công nghệ được đề xuất sử dụng trong quá trình phát triển:

| Thành phần | Công nghệ |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | ASP.NET Core MVC |
| ORM | Entity Framework Core |
| Database | SQL Server / SQLite |
| UI/UX Design | Figma |
| Version Control | Git & GitHub |
| Deployment | Nền tảng hosting phù hợp |
| AI | Tích hợp dịch vụ AI phù hợp cho phân tích, gợi ý và tư vấn kiểu tóc |

**Định hướng kỹ thuật:** Nhóm xem xét sử dụng source code nền tảng BarberFlow (ASP.NET Core MVC) để tham khảo và phát triển mở rộng, kết hợp thiết kế lại giao diện theo định hướng SalonBook. Phương án triển khai cuối cùng cần được nhóm thống nhất.

---

## 6. Kế hoạch thực hiện

Dự án dự kiến triển khai trong 8 tuần, chia thành 6 giai đoạn:

| Giai đoạn | Thời gian | Nội dung |
|---|---|---|
| 1. Khảo sát và xác định yêu cầu | Tuần 1 | Xác định đề tài, phân tích đối thủ, xây dựng tài liệu yêu cầu và GitHub Repository. |
| 2. Thiết kế UI/UX | Tuần 2 | Thiết kế wireframe, giao diện và prototype bằng Figma. |
| 3. Phát triển Frontend | Tuần 3–4 | Xây dựng giao diện trang chủ, danh sách salon, dịch vụ, chức năng tìm kiếm và đặt lịch. |
| 4. Phát triển Backend và Database | Tuần 5–6 | Thiết kế cơ sở dữ liệu, xây dựng nghiệp vụ đặt lịch, quản lý lịch làm việc, tuyển mẫu và ứng tuyển. |
| 5. Tích hợp và kiểm thử | Tuần 7 | Kết nối frontend/backend, kiểm thử luồng đặt lịch, phân quyền, xử lý lỗi và tích hợp các chức năng AI theo phạm vi triển khai. |
| 6. Triển khai và hoàn thiện | Tuần 8 | Đưa website lên hosting, kiểm thử tổng thể, hoàn thiện tài liệu và báo cáo đồ án. |

**Kết quả dự kiến:** Xây dựng website SalonBook hoạt động trực tuyến, hỗ trợ các nghiệp vụ tìm kiếm salon, đặt lịch, quản lý lịch hẹn, tuyển mẫu tóc, ứng tuyển, tư vấn kiểu tóc và quản trị hệ thống.

---

## 7. Liên kết tài liệu

Các tài liệu phân tích, lập kế hoạch và hướng dẫn được lưu trữ trong GitHub Repository.

- [Bảng yêu cầu hệ thống – REQUIREMENTS.md](REQUIREMENTS.md)
- [Kế hoạch dự án – PROJECT_PLAN.md](PROJECT_PLAN.md)
- [Phân tích website đối thủ – competitor-analysis.md](docs/competitor-analysis.md)
- [Quy trình nghiệp vụ – business-workflow.md](docs/business-workflow.md)
- [Phân tích và phản biện AI – ai-requirements-review.md](docs/ai-requirements-review.md)
- [Nhật ký sử dụng AI – AI_USAGE_LOG.md](AI_USAGE_LOG.md)
- [Hướng dẫn phát triển – AGENTS.md](AGENTS.md)

---

## 8. Hướng dẫn chạy website

SalonBook hiện được triển khai dưới dạng website giao diện
(frontend prototype) bằng HTML5, CSS3 và JavaScript.

### Truy cập trực tuyến

Website:
https://philipng09.github.io/salon-booking-project/

Mã nguồn:
https://github.com/philipng09/salon-booking-project

### Chạy trên máy tính

1. Truy cập GitHub Repository.
2. Chọn Code → Download ZIP.
3. Giải nén thư mục dự án.
4. Mở file index.html bằng trình duyệt.
5. Sử dụng menu để chuyển giữa các trang.

Các trang chính:
- index.html: Trang chủ.
- products.html: Danh sách salon.
- product-detail.html: Chi tiết salon và giao diện đặt lịch.
- about.html: Giới thiệu SalonBook.

Lưu ý: Để kiểm tra đầy đủ các thành phần được tải
bằng JavaScript, nên chạy dự án bằng Live Server
trong Visual Studio Code hoặc máy chủ HTTP cục bộ.

---

## 9. Hình ảnh minh họa giao diện

Website được thiết kế thống nhất với màu xanh lá,
vàng và nền sáng, sử dụng CSS Grid và Flexbox.

Các giao diện minh họa:
- Trang chủ SalonBook.
- Trang danh sách salon.
- Trang chi tiết salon.
- Trang giới thiệu.

Hình ảnh website và tài nguyên giao diện được
lưu trong thư mục images/ của Repository.

---

## 10. Kiểm thử giao diện

### Nội dung kiểm thử

| Nội dung | Kết quả cần đạt |
|---|---|
| Điều hướng | Các trang liên kết chính xác |
| Danh sách salon | Hiển thị thông tin và hình ảnh salon |
| Chi tiết salon | Hiển thị đúng salon được lựa chọn |
| Responsive | Bố cục thích ứng với kích thước màn hình |
| Hover và Focus | Có phản hồi khi tương tác |
| Hình ảnh | Tải đúng, không bị lỗi đường dẫn |

### Kiểm thử responsive

Kiểm tra trên trình duyệt Chrome bằng Developer Tools:

- Desktop: 1366px.
- Tablet: 768px.
- Mobile: 390px.

Minh chứng kiểm thử được lưu tại:
docs/test-evidence/

Kết quả thực tế và các lỗi phát hiện được ghi nhận
trong tài liệu kiểm thử của nhóm.

---

## 11. Giới hạn phiên bản hiện tại

Phiên bản hiện tại tập trung xây dựng và hoàn thiện
giao diện website phục vụ bài tập HTML5/CSS3.

Các chức năng đã có giao diện minh họa gồm:
- Khám phá và xem thông tin salon.
- Xem các nhóm dịch vụ chăm sóc tóc.
- Chọn dịch vụ và ngày hẹn dự kiến.
- Hiển thị thông tin tóm tắt đặt lịch.

Những chức năng như xác nhận đặt lịch thực tế,
đăng nhập, quản lý lịch hẹn, cơ sở dữ liệu,
phân quyền và tích hợp AI sẽ tiếp tục được phát triển.

Website chưa xử lý giao dịch hay thanh toán thật.

---
