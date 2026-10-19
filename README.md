# SalonBook – Website Đặt Lịch Salon Tóc Trực Tuyến 
Đồ án Phát triển ứng dụng TMĐT – UEH – Website đặt lịch salon
---

## 1. Giới thiệu

**SalonBook** là nền tảng thương mại điện tử hoạt động theo mô hình trung gian (Marketplace), kết nối khách hàng có nhu cầu chăm sóc tóc với các salon và barbershop tại Thành phố Hồ Chí Minh.

Website hỗ trợ khách hàng tìm kiếm, so sánh và đặt lịch trực tuyến cho các dịch vụ như cắt tóc, uốn, nhuộm, gội đầu dưỡng sinh và phục hồi tóc.

### Vấn đề kinh doanh cần giải quyết

- Khách hàng mất thời gian khi phải đặt lịch qua điện thoại hoặc tin nhắn.
- Khó tìm kiếm và so sánh salon theo vị trí, bảng giá và chất lượng phục vụ.
- Salon quản lý lịch hẹn thủ công, dễ xảy ra tình trạng trùng lịch hoặc bỏ sót khách.
- Các salon vừa và nhỏ gặp khó khăn trong việc tiếp cận khách hàng trực tuyến.

**Giải pháp:** SalonBook cung cấp nền tảng đặt lịch tập trung, cho phép khách hàng chủ động lựa chọn salon, dịch vụ, stylist và khung giờ phù hợp. Đồng thời hỗ trợ chủ salon quản lý lịch hẹn, nhân viên và dịch vụ hiệu quả hơn.

---

## 2. Khách hàng mục tiêu

### Khách hàng cá nhân
- Học sinh, sinh viên và nhân viên văn phòng từ 16–40 tuổi tại TP.HCM.
- Người có nhu cầu sử dụng dịch vụ chăm sóc tóc thường xuyên.
- Người có lịch trình bận rộn, muốn chủ động đặt lịch và hạn chế thời gian chờ đợi.
- Người muốn tham khảo bảng giá, vị trí và đánh giá trước khi lựa chọn salon.

### Đối tác salon
- Chủ salon tóc, barbershop vừa và nhỏ tại TP.HCM.
- Các salon có nhu cầu số hóa quy trình quản lý lịch hẹn.
- Các salon muốn mở rộng khả năng tiếp cận khách hàng qua nền tảng trực tuyến.

---

## 3. Chức năng chính

Hệ thống dự kiến phát triển 10 chức năng chính trong phiên bản đầu tiên (MVP):

| Mã | Chức năng | Mô tả |
|---|---|---|
| F01 | Tìm kiếm và lọc salon | Tìm kiếm salon theo khu vực, loại hình và nhóm dịch vụ. |
| F02 | Xem thông tin salon | Xem thông tin salon, bảng giá, dịch vụ và danh sách stylist. |
| F03 | Đặt lịch trực tuyến | Chọn salon, dịch vụ, stylist, ngày và khung giờ còn trống. |
| F04 | Quản lý và hủy lịch | Xem lịch sử đặt chỗ và hủy trước giờ hẹn tối thiểu 2 tiếng. |
| F05 | Đánh giá salon | Chấm điểm 1–5 sao và nhận xét sau khi hoàn thành dịch vụ. |
| F06 | Đăng ký và đăng nhập | Xác thực tài khoản và phân quyền người dùng. |
| F07 | Quản lý salon và dịch vụ | Chủ salon cập nhật thông tin, danh mục dịch vụ và bảng giá. |
| F08 | Quản lý lịch làm việc | Thiết lập ca trực và ngày nghỉ của stylist. |
| F09 | Quản lý lịch hẹn | Chủ salon tiếp nhận, xác nhận và cập nhật trạng thái lịch hẹn. |
| F10 | Quản trị hệ thống | Admin quản lý tài khoản, phê duyệt salon và kiểm duyệt đánh giá. |

### Chức năng phát triển trong tương lai

- Tích hợp Chatbot AI tư vấn kiểu tóc.
- Xây dựng chương trình tích điểm thành viên và voucher.
- Mở rộng các tiện ích hỗ trợ trải nghiệm khách hàng.

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

**Định hướng kỹ thuật:** Nhóm xem xét sử dụng source code nền tảng BarberFlow (ASP.NET Core MVC) để tham khảo và phát triển mở rộng, kết hợp thiết kế lại giao diện theo định hướng SalonBook. Phương án triển khai cuối cùng cần được nhóm thống nhất.

---

## 6. Kế hoạch thực hiện

Dự án dự kiến triển khai trong 8 tuần, chia thành 6 giai đoạn:

| Giai đoạn | Thời gian | Nội dung |
|---|---|---|
| 1. Khảo sát và xác định yêu cầu | Tuần 1 | Xác định đề tài, phân tích đối thủ, xây dựng tài liệu yêu cầu và GitHub Repository. |
| 2. Thiết kế UI/UX | Tuần 2 | Thiết kế wireframe, giao diện và prototype bằng Figma. |
| 3. Phát triển Frontend | Tuần 3–4 | Xây dựng giao diện trang chủ, danh sách salon, dịch vụ và đặt lịch. |
| 4. Phát triển Backend và Database | Tuần 5–6 | Thiết kế cơ sở dữ liệu, xây dựng API và xử lý nghiệp vụ đặt lịch. |
| 5. Tích hợp và kiểm thử | Tuần 7 | Kết nối frontend/backend, kiểm thử luồng đặt lịch và xử lý lỗi. |
| 6. Triển khai và hoàn thiện | Tuần 8 | Đưa website lên hosting, hoàn thiện tài liệu và báo cáo đồ án. |

**Kết quả dự kiến:** Xây dựng website SalonBook hoạt động trực tuyến, hỗ trợ các nghiệp vụ tìm kiếm salon, đặt lịch, quản lý lịch hẹn và quản trị hệ thống.

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

