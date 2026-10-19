# Project Plan

## 1. Thành viên và vai trò
| Thành viên | Mã TV | Vai trò dự án | Trách nhiệm chính xuyên suốt 8 tuần | Sản phẩm bàn giao chính | Người duyệt |
|---|:---:|---|---|---|:---:|
| **Ngân** | TV1 | Trưởng nhóm (Leader / BA) | Điều phối tiến độ tổng thể, brief đề tài, kiểm soát phạm vi chức năng, duyệt quyết định nhóm và nghiệm thu báo cáo cuối kỳ. | Brief đề tài, Báo cáo tiến độ, Slide tổng kết | Giảng viên |
| **Duyên** | TV2 | Research & AI Specialist | Khảo sát các website đối thủ, phân tích & phản biện AI, hỗ trợ thiết kế giao diện Figma và lập trình Frontend. | competitor-analysis.md, Prototype Figma, Giao diện web | Ngân |
| **Bảo Hân** | TV3 | Requirements Analyst | Đặc tả chi tiết vai trò người dùng, lập danh mục 10 chức năng (F01–F10), quy chuẩn phi chức năng và thiết kế CSDL quan hệ. | REQUIREMENTS.md, Data Dictionary CSDL | Ngân |
| **Ngọc Hân** | TV4 | Workflow & UX Designer | Xây dựng luồng nghiệp vụ đặt lịch cắt tóc, xử lý quy tắc ngoại lệ & trạng thái, phối hợp thiết kế wireframe/Figma. | business-workflow.md, Luồng trải nghiệm UI | Bảo Hân |
| **My** | TV5 | Project Manager & Planner | Lập kế hoạch 8 tuần toàn học phần, kiểm soát phân công 7 thành viên, theo dõi tiến độ và quản trị rủi ro dự án. | PROJECT_PLAN.md, Bảng theo dõi Task/Issue | Ngân |
| **Phi** | TV6 | Technical Lead & Fullstack | Thiết lập kiến trúc kỹ thuật ASP.NET Core, khởi tạo repo GitHub/Issues, lập trình Frontend, Backend API và deploy website. | Repo GitHub, AGENTS.md, Source code web, Link deploy | Ngân |
| **Thông** | TV7 | QA & Documentation | Viết tài liệu tổng quan README, quản lý nhật ký sử dụng AI, thiết kế kịch bản test (Test Case) và rà soát chất lượng hệ thống. | README.md, AI_USAGE_LOG.md, Test Report | Ngân |

---

## 2. Các giai đoạn (Lộ trình 8 tuần toàn học phần)

- **Giai đoạn 1: Khảo sát và xác định yêu cầu (Tuần 1)**
  - *Mục tiêu:* Thống nhất đề tài Nền tảng sàn TMĐT đặt lịch cắt tóc tại TP.HCM, hoàn thiện 7 file tài liệu Markdown khởi tạo dự án, phân tích đối thủ & AI, thiết lập GitHub Issues.
  - *Kết quả cần đạt:* 01 link GitHub Public đầy đủ 7 file tài liệu và khung Issues phân công.
  - *Người phụ trách chính:* Cả nhóm (Lead: Ngân, My).

- **Giai đoạn 2: Thiết kế giao diện UI/UX (Tuần 2)**
  - *Mục tiêu:* Thiết kế wireframe và prototype Figma hoàn chỉnh cho các luồng: Trang chủ lọc salon đa tiêu chí (F01), Chi tiết Menu & Stylist (F02), Quy trình chọn lịch Booking (F03), Quản lý lịch cá nhân & Đánh giá (F04, F05), Dashboard quản trị cho Chủ salon (F07–F09) và Admin sàn (F10).
  - *Kết quả cần đạt:* Link Figma Interactive Prototype có khả năng demo toàn bộ luồng người dùng.
  - *Người phụ trách chính:* Ngọc Hân, Duyên.

- **Giai đoạn 3: Xây dựng các chức năng frontend (Tuần 3 – Tuần 4)**
  - *Mục tiêu:* 
    - *Tuần 3:* Cắt giao diện tĩnh HTML5/CSS3/JS chuẩn Responsive (Desktop & Mobile), dựng Navbar, Footer, Trang chủ, Bộ lọc tìm kiếm salon theo Quận/Khu vực/Chuyên môn (F01) và Trang chi tiết salon kèm Menu giá (F02).
    - *Tuần 4:* Xây dựng giao diện chọn ngày/khung giờ/stylist (F03), form đăng nhập/đăng ký (F06), trang xem lịch sử và form hủy lịch hẹn (F04), khung đánh giá sao (F05), màn hình quản trị salon (F07–F09).
  - *Kết quả cần đạt:* Bộ mã nguồn Frontend giao diện hoạt động mượt mà, tương thích đa thiết bị.
  - *Người phụ trách chính:* Phi, Duyên.

- **Giai đoạn 4: Phát triển backend và cơ sở dữ liệu (Tuần 5 – Tuần 6)**
  - *Mục tiêu:* 
    - *Tuần 5:* Thiết kế CSDL quan hệ trên SQL Server/SQLite bằng Entity Framework Core (Bảng Salon, Dịch vụ, Stylist, Ca trực, Lịch hẹn, Khách hàng, Đánh giá); xây dựng API xác thực Auth phân quyền (F06), API tìm kiếm/lọc salon (F01, F02), API CRUD thông tin và dịch vụ salon (F07).
    - *Tuần 6:* Xây dựng logic nghiệp vụ cốt lõi: API quản lý ca trực/ngày nghỉ thợ (F08), API đặt lịch Booking kèm cơ chế khóa dữ liệu (locking/transaction) chống trùng lịch Double Booking (F03), API hủy lịch trước 2 tiếng (F04), API điều phối trạng thái lịch hẹn (F09), API gửi đánh giá sao (F05) và API quản trị sàn (F10).
  - *Kết quả cần đạt:* Hệ thống Backend ASP.NET Core MVC & RESTful API kết nối dữ liệu hoàn chỉnh, ngăn chặn lỗ hổng IDOR.
  - *Người phụ trách chính:* Phi, Bảo Hân.

- **Giai đoạn 5: Tích hợp và kiểm thử (Tuần 7)**
  - *Mục tiêu:* Tích hợp hoàn toàn giao diện Frontend với Backend; chạy kiểm thử End-to-End toàn bộ 10 chức năng; kiểm thử kiểm tra dữ liệu đầu vào (SĐT 10 số, ngày tương lai, số sao 1-5); kiểm thử xử lý ngoại lệ khi khách hủy lịch hoặc thợ nghỉ ca.
  - *Kết quả cần đạt:* Báo cáo kiểm thử (Test Log) đạt yêu cầu, toàn bộ lỗi nghiêm trọng (Double Booking, IDOR) được xử lý triệt để.
  - *Người phụ trách chính:* Thông, Phi, Ngọc Hân.

- **Giai đoạn 6: Triển khai và hoàn thiện (Tuần 8)**
  - *Mục tiêu:* Đưa website lên hosting thực tế (Render/Vercel/SmarterASP.NET), cấu hình chuỗi kết nối an toàn, hoàn thiện slide báo cáo đồ án và nghiệm thu.
  - *Kết quả cần đạt:* Website chạy online với URL công khai; slide và tài liệu nghiệm thu đồ án hoàn chỉnh.
  - *Người phụ trách chính:* Ngân, Phi, My, Thông.

---

## 3. Công việc chi tiết

| Mã | Giai đoạn | Công việc chi tiết | Người phụ trách | Kết quả cần đạt | Thời hạn | Trạng thái |
|:---:|:---:|---|---|---|:---:|:---:|
| **01.1** | GĐ 1 | Trả lời 6 câu hỏi xác định đề tài Sàn TMĐT đặt lịch cắt tóc | Ngân | Brief đề tài 1 trang (mô hình Marketplace, phạm vi MVP) | Tuần 1 | Hoàn thành |
| **01.2** | GĐ 1 | Duyệt các đề xuất giữ/sửa/bỏ từ phân tích AI | Ngân | Bảng quyết định nhóm đã duyệt | Tuần 1 | Hoàn thành |
| **01.3** | GĐ 1 | Rà soát lần cuối tính nhất quán của 7 file Markdown | Ngân | Xác nhận link repo mở được, không lỗi thuật ngữ | Tuần 1 | Hoàn thành |
| **02.1** | GĐ 1 | Khảo sát thực tế 3 website đặt lịch salon/dịch vụ | Duyên | docs/competitor-analysis.md kèm 3 URL thực tế | Tuần 1 | Hoàn thành |
| **02.2** | GĐ 1 | Đúc kết bài học áp dụng và đề xuất tính năng salon | Duyên | Mục "Bài học & đề xuất" trong competitor-analysis | Tuần 1 | Hoàn thành |
| **02.3** | GĐ 1 | Chạy Prompt AI lần 1 phân tích 8 nhóm yêu cầu | Duyên | Bảng tóm tắt kết quả AI 1 (bắt buộc/sau này) | Tuần 1 | Hoàn thành |
| **02.4** | GĐ 1 | Dùng công cụ AI khác phản biện 5 khía cạnh | Duyên | Bảng so sánh đối chiếu giữa 2 công cụ AI | Tuần 1 | Hoàn thành |
| **02.5** | GĐ 1 | Tổng hợp gói tư liệu minh chứng bàn giao cho TV7 | Duyên | Gói prompt và output cho AI_USAGE_LOG.md | Tuần 1 | Hoàn thành |
| **03.1** | GĐ 1 | Đặc tả 4 nhóm người dùng (Guest, Customer, Salon Owner, Admin) | Bảo Hân | Mục "Người dùng & quyền hạn" trong REQUIREMENTS.md | Tuần 1 | Hoàn thành |
| **03.2** | GĐ 1 | Lập bảng danh mục 10 chức năng (F01 – F10) kèm tiêu chí nghiệm thu | Bảo Hân | Bảng 10 mã chức năng chi tiết trong REQUIREMENTS.md | Tuần 1 | Hoàn thành |
| **03.3** | GĐ 1 | Đặc tả phạm vi trong/ngoài, yêu cầu phi chức năng & giả định | Bảo Hân | REQUIREMENTS.md hoàn chỉnh theo chuẩn môn học | Tuần 1 | Hoàn thành |
| **04.1** | GĐ 1 | Xây dựng luồng quy trình đặt lịch cắt tóc chính | Ngọc Hân | docs/business-workflow.md (tối thiểu 1 luồng chính) | Tuần 1 | Hoàn thành |
| **04.2** | GĐ 1 | Thiết lập bảng xử lý tình huống ngoại lệ & trạng thái lịch | Ngọc Hân | Bảng quy tắc xử lý trùng giờ/thợ nghỉ/hủy trước 2h | Tuần 1 | Hoàn thành |
| **04.3** | GĐ 1 | Đối chiếu ăn khớp giữa các bước workflow và mã F-code | Ngọc Hân | Danh sách đối chiếu bước luồng với F01–F10 | Tuần 1 | Hoàn thành |
| **05.1** | GĐ 1 | Lập bảng phân công 7 người theo mã việc Excel | My | Mục 1 trong file PROJECT_PLAN.md | Tuần 1 | Hoàn thành |
| **05.2** | GĐ 1 | Xây dựng lộ trình 8 tuần toàn học phần | My | Mục 2 & Mục 3 trong file PROJECT_PLAN.md | Tuần 1 | Hoàn thành |
| **05.3** | GĐ 1 | Phân tích 5 rủi ro cốt lõi và hướng giảm thiểu | My | Mục 4 trong file PROJECT_PLAN.md | Tuần 1 | Hoàn thành |
| **06.1** | GĐ 1 | Đề xuất stack công nghệ (ASP.NET Core MVC, EF Core, SQL Server) | Phi | Khung stack dự kiến đưa vào README và Plan | Tuần 1 | Hoàn thành |
| **06.2** | GĐ 1 | Khởi tạo repo GitHub Public và cấu trúc file/docs | Phi | Đường dẫn GitHub repo công khai + .gitignore | Tuần 1 | Hoàn thành |
| **06.3** | GĐ 1 | Soạn thảo bộ quy tắc hướng dẫn AI hỗ trợ code | Phi | File AGENTS.md hoàn chỉnh theo trang 16-18 | Tuần 1 | Hoàn thành |
| **06.4** | GĐ 1 | Tạo ≥7 GitHub Issues và gắn người chịu trách nhiệm | Phi | Danh sách GitHub Issues trên repo | Tuần 1 | Hoàn thành |
| **06.5** | GĐ 1 | Kiểm tra đường dẫn nộp bài ở trình duyệt ẩn danh | Phi | Xác nhận link truy cập ẩn danh không lỗi | Tuần 1 | Hoàn thành |
| **07.1** | GĐ 1 | Soạn thảo file tổng quan dự án README.md | Thông, Ngân | README.md đầy đủ 7 phần theo hướng dẫn | Tuần 1 | Hoàn thành |
| **07.2** | GĐ 1 | Hoàn thiện nhật ký sử dụng công cụ AI_USAGE_LOG.md | Thông | File AI_USAGE_LOG.md theo đúng mẫu | Tuần 1 | Hoàn thành |
| **07.3** | GĐ 1 | Rà soát 8 đầu ra theo bảng đối chiếu yêu cầu của thầy | Thông | Bảng kiểm tra tình trạng đạt/chưa đạt | Tuần 1 | Hoàn thành |
| **07.4** | GĐ 1 | Kiểm tra tính nhất quán thuật ngữ và chức năng | Thông | Báo cáo QA duyệt nộp gửi Leader | Tuần 1 | Hoàn thành |
| **W02.1** | GĐ 2 | Vẽ Wireframe chi tiết luồng lọc salon và đặt chỗ (F01, F02, F03) | Ngọc Hân | Bản phác thảo giao diện Desktop và Mobile | Tuần 2 | Chưa bắt đầu |
| **W02.2** | GĐ 2 | Thiết kế Design System & giao diện quản trị tiệm (F07, F08, F09) | Duyên | Màn hình quản lý ca trực, giá và đơn đặt chỗ | Tuần 2 | Chưa bắt đầu |
| **W02.3** | GĐ 2 | Hoàn thiện Prototype tương tác đầy đủ trên Figma | Ngọc Hân, Duyên | Link Figma tương tác thông suốt toàn bộ chức năng | Tuần 2 | Chưa bắt đầu |
| **W03.1** | GĐ 3 | Khởi tạo dự án ASP.NET Core MVC & cấu hình thư viện UI | Phi | Khung dự án sẵn sàng phát triển | Tuần 3 | Chưa bắt đầu |
| **W03.2** | GĐ 3 | Cắt giao diện Trang chủ & Bộ lọc salon đa tiêu chí (F01) | Duyên, Phi | Bộ lọc theo Quận, đối tượng, nhóm chuyên môn hoạt động | Tuần 3 | Chưa bắt đầu |
| **W03.3** | GĐ 3 | Xây dựng giao diện trang Chi tiết salon, Menu & Stylist (F02) | Duyên | Màn hình hiển thị đúng thông tin theo salon_id | Tuần 3 | Chưa bắt đầu |
| **W04.1** | GĐ 4 | Lập trình module chọn ngày, giờ và thợ làm tóc (F03) | Phi | Giao diện chọn slot giờ trống trực quan | Tuần 4 | Chưa bắt đầu |
| **W04.2** | GĐ 4 | Xây dựng Form Auth (F06), Quản lý lịch & Đánh giá (F04, F05) | Duyên | Giao diện đăng nhập, lịch sử hẹn và form chấm sao | Tuần 4 | Chưa bắt đầu |
| **W04.3** | GĐ 4 | Thiết kế giao diện Dashboard Chủ salon & Admin sàn (F07–F10) | Ngọc Hân, Phi | Giao diện quản lý dịch vụ, ca thợ và duyệt salon | Tuần 4 | Chưa bắt đầu |
| **W05.1** | GĐ 5 | Thiết kế lược đồ ERD và khởi tạo DB bằng Entity Framework Core | Bảo Hân, Phi | CSDL SQL Server/SQLite chuẩn hóa quan hệ | Tuần 5 | Chưa bắt đầu |
| **W05.2** | GĐ 5 | Xây dựng module xác thực phân quyền ASP.NET Identity (F06) | Phi | Phân quyền an toàn: Guest, Customer, Owner, Admin | Tuần 5 | Chưa bắt đầu |
| **W05.3** | GĐ 5 | Xây dựng API tìm kiếm, lọc salon (F01, F02) & quản lý menu (F07) | Phi | API hiển thị dữ liệu chính xác theo salon_id | Tuần 5 | Chưa bắt đầu |
| **W06.1** | GĐ 6 | Xây dựng API Đặt lịch (F03) & Quản lý ca trực stylist (F08) | Phi | Thuật toán kiểm tra lịch trống và tự động khóa slot | Tuần 6 | Chưa bắt đầu |
| **W06.2** | GĐ 6 | Lập trình API Hủy lịch $\ge$ 2h (F04), Điều phối đơn (F09), Review (F05) | Phi, Bảo Hân | API cập nhật trạng thái đơn và tính điểm sao TB | Tuần 6 | Chưa bắt đầu |
| **W06.3** | GĐ 6 | Xây dựng API Quản trị đối tác & Kiểm duyệt sàn (F10) | Phi | API duyệt/khóa salon và gỡ bỏ nhận xét vi phạm | Tuần 6 | Chưa bắt đầu |
| **W07.1** | GĐ 7 | Ghép nối toàn diện Frontend với Backend Controller/API | Phi, Duyên | Hệ thống chạy thông suốt 10 chức năng từ UI đến DB | Tuần 7 | Chưa bắt đầu |
| **W07.2** | GĐ 7 | Lập kịch bản kiểm thử (Test Cases) chi tiết cho 10 chức năng | Thông | Bộ tài liệu Test Cases nghiệm thu chức năng | Tuần 7 | Chưa bắt đầu |
| **W07.3** | GĐ 7 | Kiểm thử tích hợp, kiểm tra lỗ hổng IDOR và sửa lỗi | Cả nhóm | Báo cáo kiểm thử đạt chuẩn nghiệm thu | Tuần 7 | Chưa bắt đầu |
| **W08.1** | GĐ 8 | Triển khai website lên hosting thực tế (Vercel/Render) | Phi | Website hoạt động ổn định trên mạng Internet | Tuần 8 | Chưa bắt đầu |
| **W08.2** | GĐ 8 | Rà soát an toàn thông tin, bảo mật biến môi trường | Phi, Thông | Repo sạch sẽ, không lộ secret, link ẩn danh chạy tốt | Tuần 8 | Chưa bắt đầu |
| **W08.3** | GĐ 8 | Soạn thảo Slide thuyết trình và Báo cáo tổng kết | My, Ngân | Slide báo cáo và tài liệu tổng kết đồ án | Tuần 8 | Chưa bắt đầu |
| **W08.4** | GĐ 8 | Tổng duyệt báo cáo và nghiệm thu đề tài trước lớp | Cả nhóm | Dự án sẵn sàng nghiệm thu với giảng viên | Tuần 8 | Chưa bắt đầu |

---

## 4. Quản lý rủi ro và phương án ứng phó

| STT | Rủi ro tiềm ẩn trong 8 tuần | Mức độ ảnh hưởng | Khả năng xảy ra | Phương án xử lý & Giảm thiểu |
|:---:|---|:---:|:---:|---|
| **1** | **Xung đột mã nguồn (Git Conflict)** khi nhiều thành viên cùng code và đẩy lên nhánh `main`. | Cao | Cao | Phân chia nhánh (branch) riêng theo từng tính năng (`feature/ui`, `feature/api`); chỉ hợp nhất vào `main` thông qua Pull Request sau khi được kiểm tra chéo. |
| **2** | **Lỗi logic đặt trùng giờ** (hai khách hàng cùng bấm đặt một thợ vào cùng một khung giờ). | Nghiêm trọng | Trung bình | Thiết kế cơ chế khóa tạm thời (temporary lock) slot giờ trong 5 phút khi khách bắt đầu điền thông tin; kiểm tra lại tính khả dụng của slot ngay trước khi ghi nhận vào CSDL. |
| **3** | **Áp lực tiến độ do rút ngắn còn 8 tuần**, nguy cơ không kịp hoàn thành. | Cao | Cao | Bám sát sản phẩm khả dụng tối thiểu (MVP); tập trung hoàn thiện trọn vẹn luồng cốt lõi (Đặt lịch salon); hoãn các tính năng phụ phức tạp (như thanh toán trực tuyến đa kênh, Chatbot AI) sang bản nâng cấp. |
| **4** | **Chênh lệch kỹ năng lập trình** giữa các thành viên trong nhóm sinh viên. | Trung bình | Cao | Phân công công việc theo thế mạnh (thành viên mạnh lập trình lo Backend & API, thành viên mạnh thiết kế lo UI/UX & tài liệu); tận dụng công cụ AI để tạo template code ban đầu. |
| **5** | **Sơ suất để lộ thông tin nhạy cảm** (mật khẩu CSDL, API token) lên GitHub Public. | Nghiêm trọng | Trung bình | Cấu hình chặt chẽ file `.gitignore` ngay từ tuần đầu; toàn bộ secret phải lưu trong biến môi trường `.env`; các thành viên tuyệt đối không hardcode mật khẩu vào mã nguồn. |
