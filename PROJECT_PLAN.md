# Project Plan

## 1. Thành viên và vai trò
| Thành viên | Mã TV | Vai trò dự án | Trách nhiệm chính xuyên suốt 8 tuần | Sản phẩm bàn giao chính | Người duyệt |
|---|:---:|---|---|---|:---:|
| **Ngân** | TV1 | Trưởng nhóm (Leader / BA) | Điều phối tiến độ tổng thể, brief đề tài, kiểm soát phạm vi chức năng, duyệt quyết định nhóm và nghiệm thu báo cáo cuối kỳ. | Brief đề tài, Báo cáo tiến độ, Slide tổng kết | Giảng viên |
| **Duyên** | TV2 | Research & AI Specialist | Khảo sát các website đối thủ, phân tích & phản biện AI, hỗ trợ thiết kế giao diện Figma và cắt HTML/CSS giao diện. | competitor-analysis.md, Prototype Figma, Giao diện web | Ngân |
| **Hân Nguyễn** | TV3 | Requirements Analyst | Đặc tả chi tiết vai trò người dùng, lập danh mục mã F-code, quy chuẩn phi chức năng và thiết kế cấu trúc dữ liệu bảng CSDL. | REQUIREMENTS.md, Data Dictionary CSDL | Ngân |
| **Hân Văn** | TV4 | Workflow & UX Designer | Xây dựng luồng nghiệp vụ đặt lịch cắt tóc, xử lý trạng thái ngoại lệ, phối hợp vẽ wireframe/giao diện người dùng. | business-workflow.md, Luồng trải nghiệm UI | Hân Nguyễn |
| **My** | TV5 | Project Manager & Planner | Lập kế hoạch 8 tuần toàn học phần, kiểm soát phân công công việc 7 thành viên, theo dõi deadline và quản trị rủi ro dự án. | PROJECT_PLAN.md, Bảng theo dõi Task/Issue | Ngân |
| **Phi** | TV6 | Technical Lead & Fullstack | Thiết lập kiến trúc kỹ thuật, khởi tạo repo GitHub/Issues, lập trình cấu trúc Frontend, Backend API và triển khai web lên hosting. | Repo GitHub, AGENTS.md, Source code web, Link deploy | Ngân |
| **Thông** | TV7 | QA & Documentation | Viết tài liệu tổng quan README, quản lý nhật ký sử dụng AI, thiết kế kịch bản test (Test Case) và rà soát chất lượng hệ thống. | README.md, AI_USAGE_LOG.md, Test Report | Ngân |

---

## 2. Các giai đoạn (Lộ trình 8 tuần toàn học phần)

- **Giai đoạn 1: Khảo sát và xác định yêu cầu (Tuần 1)**
  - *Mục tiêu:* Thống nhất đề tài Website đặt lịch cắt tóc, hoàn thiện bộ 7 file tài liệu Markdown khởi tạo dự án, phân tích đối thủ & AI, thiết lập GitHub Issues.
  - *Kết quả cần đạt:* 01 link GitHub Public đầy đủ 7 file tài liệu và khung Issues phân công.
  - *Người phụ trách chính:* Cả nhóm (Lead: Ngân, My).

- **Giai đoạn 2: Thiết kế giao diện UI/UX (Tuần 2)**
  - *Mục tiêu:* Thiết kế wireframe và prototype Figma hoàn chỉnh cho các luồng: Trang chủ, Danh mục thợ & Dịch vụ cắt tóc, Lịch đặt chỗ, Form xác nhận và Dashboard quản trị salon.
  - *Kết quả cần đạt:* Link Figma Interactive Prototype có khả năng demo luồng người dùng.
  - *Người phụ trách chính:* Hân Văn, Duyên.

- **Giai đoạn 3: Xây dựng các chức năng frontend (Tuần 3 – Tuần 4)**
  - *Mục tiêu:* 
    - *Tuần 3:* Cắt giao diện tĩnh HTML/CSS/JS (hoặc React/Vue) chuẩn Responsive (Desktop & Mobile), dựng Navbar, Footer, Banner, Danh sách dịch vụ và Bảng giá.
    - *Tuần 4:* Xây dựng giao diện chọn ngày/giờ, chọn thợ cắt tóc, form điền thông tin khách hàng, modal xác nhận lịch hẹn và xử lý validation dữ liệu ở client.
  - *Kết quả cần đạt:* Bộ mã nguồn Frontend giao diện hoạt động mượt mà, tương thích đa thiết bị.
  - *Người phụ trách chính:* Phi, Duyên.

- **Giai đoạn 4: Phát triển backend và cơ sở dữ liệu (Tuần 5 – Tuần 6)**
  - *Mục tiêu:* 
    - *Tuần 5:* Thiết kế CSDL (bảng Khách hàng, Thợ cắt tóc, Dịch vụ, Khung giờ, Lịch hẹn); xây dựng các API cơ bản (CRUD dịch vụ, danh sách thợ, lấy slot giờ).
    - *Tuần 6:* Xây dựng nghiệp vụ nâng cao: API đặt lịch hẹn, thuật toán kiểm tra phòng trống/chống trùng lịch cùng khung giờ cho một thợ, API cập nhật trạng thái đơn đặt lịch.
  - *Kết quả cần đạt:* Cơ sở dữ liệu và hệ thống RESTful API kết nối dữ liệu hoàn chỉnh.
  - *Người phụ trách chính:* Phi, Hân Nguyễn.

- **Giai đoạn 5: Tích hợp và kiểm thử (Tuần 7)**
  - *Mục tiêu:* Tích hợp hoàn toàn giao diện Frontend với Backend API; chạy kiểm thử End-to-End toàn bộ quy trình; kiểm thử các trường hợp ngoại lệ (khách hủy lịch, thợ bận đột xuất, trùng giờ).
  - *Kết quả cần đạt:* Báo cáo kiểm thử (Test Log) đạt yêu cầu, toàn bộ lỗi nghiêm trọng (Critical Bugs) được xử lý.
  - *Người phụ trách chính:* Thông, Phi, Hân Văn.

- **Giai đoạn 6: Triển khai và hoàn thiện (Tuần 8)**
  - *Mục tiêu:* Đưa website lên môi trường thực tế (Vercel / Render / Supabase), kiểm tra bảo mật (không lộ API key/secret), hoàn thiện báo cáo đồ án và slide thuyết trình.
  - *Kết quả cần đạt:* Website chạy online với URL công khai; slide và tài liệu nghiệm thu đồ án hoàn chỉnh.
  - *Người phụ trách chính:* Ngân, Phi, My, Thông.

---

## 3. Công việc chi tiết

| Mã | Giai đoạn | Công việc chi tiết | Người phụ trách | Kết quả cần đạt | Thời hạn | Trạng thái |
|:---:|:---:|---|---|---|:---:|:---:|
| **01.1** | GĐ 1 | Trả lời 6 câu hỏi xác định đề tài salon cắt tóc | Ngân | Brief đề tài 1 trang (mục tiêu, khách hàng, MVP) | Tuần 1 | Hoàn thành |
| **01.2** | GĐ 1 | Duyệt các đề xuất giữ/sửa/bỏ từ phân tích AI | Ngân | Bảng quyết định nhóm đã duyệt | Tuần 1 | Hoàn thành |
| **01.3** | GĐ 1 | Rà soát lần cuối tính nhất quán của 7 file Markdown | Ngân | Xác nhận link repo mở được, không lỗi thuật ngữ | Tuần 1 | Hoàn thành |
| **02.1** | GĐ 1 | Khảo sát thực tế 3 website đặt lịch salon/dịch vụ | Duyên | docs/competitor-analysis.md kèm 3 URL thực | Tuần 1 | Hoàn thành |
| **02.2** | GĐ 1 | Đúc kết bài học áp dụng và đề xuất tính năng salon | Duyên | Mục "Bài học & đề xuất" trong competitor-analysis | Tuần 1 | Hoàn thành |
| **02.3** | GĐ 1 | Chạy Prompt AI lần 1 phân tích 8 nhóm yêu cầu | Duyên | Bảng tóm tắt kết quả AI 1 (bắt buộc/sau này) | Tuần 1 | Hoàn thành |
| **02.4** | GĐ 1 | Dùng công cụ AI khác phản biện 5 khía cạnh | Duyên | Bảng so sánh đối chiếu giữa 2 công cụ AI | Tuần 1 | Hoàn thành |
| **02.5** | GĐ 1 | Tổng hợp gói tư liệu minh chứng bàn giao cho TV7 | Duyên | Gói prompt và output cho AI_USAGE_LOG.md | Tuần 1 | Hoàn thành |
| **03.1** | GĐ 1 | Xác định các nhóm người dùng và phân quyền hạn | Hân Nguyễn | Mục "Người dùng & quyền hạn" trong REQUIREMENTS | Tuần 1 | Hoàn thành |
| **03.2** | GĐ 1 | Lập bảng danh mục chức năng F-code (F01 - F08) | Hân Nguyễn | Bảng mã chức năng kèm tiêu chí nghiệm thu | Tuần 1 | Hoàn thành |
| **03.3** | GĐ 1 | Đặc tả phạm vi trong/ngoài và yêu cầu phi chức năng | Hân Nguyễn | REQUIREMENTS.md hoàn chỉnh theo mẫu thầy | Tuần 1 | Hoàn thành |
| **04.1** | GĐ 1 | Xây dựng luồng quy trình đặt lịch cắt tóc chính | Hân Văn | docs/business-workflow.md (tối thiểu 1 luồng chính) | Tuần 1 | Hoàn thành |
| **04.2** | GĐ 1 | Thiết lập bảng xử lý tình huống ngoại lệ & trạng thái | Hân Văn | Bảng quy tắc xử lý trùng giờ/thợ nghỉ/hủy lịch | Tuần 1 | Hoàn thành |
| **04.3** | GĐ 1 | Đối chiếu ăn khớp giữa các bước workflow và F-code | Hân Văn | Danh sách đối chiếu bước luồng với F-code | Tuần 1 | Hoàn thành |
| **05.1** | GĐ 1 | Lập bảng phân công 7 người theo mã việc Excel | My | Mục 1 trong file PROJECT_PLAN.md | Tuần 1 | Hoàn thành |
| **05.2** | GĐ 1 | Xây dựng lộ trình 8 tuần toàn học phần | My | Mục 2 & Mục 3 trong file PROJECT_PLAN.md | Tuần 1 | Hoàn thành |
| **05.3** | GĐ 1 | Phân tích 5 rủi ro cốt lõi và hướng giảm thiểu | My | Mục 4 trong file PROJECT_PLAN.md | Tuần 1 | Hoàn thành |
| **06.1** | GĐ 1 | Đề xuất stack công nghệ (Frontend, Backend, Database) | Phi | Khung stack dự kiến đưa vào README và Plan | Tuần 1 | Hoàn thành |
| **06.2** | GĐ 1 | Khởi tạo repo GitHub Public và cấu trúc file/docs | Phi | Đường dẫn GitHub repo công khai + .gitignore | Tuần 1 | Hoàn thành |
| **06.3** | GĐ 1 | Soạn thảo bộ quy tắc hướng dẫn AI hỗ trợ code | Phi | File AGENTS.md hoàn chỉnh theo trang 16-18 | Tuần 1 | Hoàn thành |
| **06.4** | GĐ 1 | Tạo ≥7 GitHub Issues và gắn người chịu trách nhiệm | Phi | Danh sách GitHub Issues trên repo | Tuần 1 | Hoàn thành |
| **06.5** | GĐ 1 | Kiểm tra đường dẫn nộp bài ở trình duyệt ẩn danh | Phi | Xác nhận link truy cập ẩn danh không lỗi | Tuần 1 | Hoàn thành |
| **07.1** | GĐ 1 | Soạn thảo file tổng quan dự án README.md | Thông, Ngân | README.md đầy đủ 7 phần theo hướng dẫn | Tuần 1 | Hoàn thành |
| **07.2** | GĐ 1 | Hoàn thiện nhật ký sử dụng công cụ AI_USAGE_LOG.md | Thông | File AI_USAGE_LOG.md theo đúng mẫu | Tuần 1 | Hoàn thành |
| **07.3** | GĐ 1 | Rà soát 8 đầu ra theo bảng đối chiếu yêu cầu của thầy | Thông | Bảng kiểm tra tình trạng đạt/chưa đạt | Tuần 1 | Hoàn thành |
| **07.4** | GĐ 1 | Kiểm tra tính nhất quán thuật ngữ và chức năng | Thông | Báo cáo QA duyệt nộp gửi Leader | Tuần 1 | Hoàn thành |
| **W02.1** | GĐ 2 | Vẽ Wireframe chi tiết giao diện Desktop và Mobile | Hân Văn | Bản phác thảo luồng đặt lịch cắt tóc | Tuần 2 | Chưa bắt đầu |
| **W02.2** | GĐ 2 | Thiết kế Design System (Màu sắc, Typography, Icons) | Duyên | Bộ UI kit đồng bộ cho thương hiệu salon | Tuần 2 | Chưa bắt đầu |
| **W02.3** | GĐ 2 | Hoàn thiện Prototype tương tác trên Figma | Hân Văn, Duyên | Link Figma hoàn chỉnh các màn hình chính | Tuần 2 | Chưa bắt đầu |
| **W03.1** | GĐ 3 | Khởi tạo dự án Frontend & cấu hình thư viện CSS | Phi | Khung dự án Frontend sẵn sàng phát triển | Tuần 3 | Chưa bắt đầu |
| **W03.2** | GĐ 3 | Cắt giao diện Trang chủ, Banner và Bảng dịch vụ | Duyên, Phi | Các trang giới thiệu và bảng giá hiển thị đẹp | Tuần 3 | Chưa bắt đầu |
| **W03.3** | GĐ 3 | Xây dựng trang Hồ sơ thợ cắt tóc và đánh giá | Duyên | Màn hình xem thợ và tay nghề chi tiết | Tuần 3 | Chưa bắt đầu |
| **W04.1** | GĐ 4 | Lập trình module chọn ngày, giờ và thợ (Slot Picker) | Phi | Giao diện chọn lịch tương tác trực quan | Tuần 4 | Chưa bắt đầu |
| **W04.2** | GĐ 4 | Xây dựng Form điền thông tin và tóm tắt lịch hẹn | Duyên | Form nhập liệu có validation đầy đủ | Tuần 4 | Chưa bắt đầu |
| **W04.3** | GĐ 4 | Thiết kế giao diện Dashboard Admin quản lý lịch | Hân Văn, Phi | Màn hình xem danh sách khách đặt cho chủ salon | Tuần 4 | Chưa bắt đầu |
| **W05.1** | GĐ 5 | Thiết kế lược đồ ERD và khởi tạo Database | Hân Nguyễn, Phi | CSDL (PostgreSQL/MySQL/MongoDB) hoàn chỉnh | Tuần 5 | Chưa bắt đầu |
| **W05.2** | GĐ 5 | Xây dựng API quản lý Dịch vụ và Thợ cắt tóc | Phi | API trả danh sách dịch vụ và thợ | Tuần 5 | Chưa bắt đầu |
| **W05.3** | GĐ 5 | Xây dựng API kiểm tra khung giờ trống theo thợ | Phi | API kiểm tra slot còn trống theo thời gian thực | Tuần 5 | Chưa bắt đầu |
| **W06.1** | GĐ 6 | Xây dựng API tạo mới lịch hẹn và thuật toán khóa slot | Phi | API đặt lịch kèm logic chống trùng khung giờ | Tuần 6 | Chưa bắt đầu |
| **W06.2** | GĐ 6 | Xây dựng API đổi/hủy lịch và cập nhật trạng thái | Phi, Hân Nguyễn | API xử lý trạng thái (Chờ duyệt/Đã đặt/Đã hủy) | Tuần 6 | Chưa bắt đầu |
| **W06.3** | GĐ 6 | Tích hợp xác thực phân quyền Admin / Khách hàng | Phi | Middleware bảo vệ các API quản trị salon | Tuần 6 | Chưa bắt đầu |
| **W07.1** | GĐ 7 | Ghép nối toàn bộ Frontend với RESTful API Backend | Phi, Duyên | Luồng đặt lịch hoàn tất từ giao diện đến DB | Tuần 7 | Chưa bắt đầu |
| **W07.2** | GĐ 7 | Lập kịch bản kiểm thử (Test Cases) luồng nghiệp vụ | Thông | Bộ tài liệu Test Cases chi tiết | Tuần 7 | Chưa bắt đầu |
| **W07.3** | GĐ 7 | Thực hiện kiểm thử tích hợp, ghi nhận và sửa bug | Cả nhóm | Báo cáo kiểm thử đạt chuẩn nghiệm thu | Tuần 7 | Chưa bắt đầu |
| **W08.1** | GĐ 8 | Triển khai website lên hosting (Vercel, Render) | Phi | Website hoạt động ổn định trên mạng Internet | Tuần 8 | Chưa bắt đầu |
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
