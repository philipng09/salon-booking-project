# Project Plan

## 1. Thành viên và vai trò
| Thành viên | Vai trò | Trách nhiệm |
|---|---|---|
| Ngân | TV1 · Trưởng nhóm (Leader) | Quản lý tiến độ chung, viết brief đề tài, duyệt quyết định nhóm và kiểm tra nộp cuối |
| Duyên | TV2 · Research & AI | Khảo sát 3 website đối thủ, chạy prompt phân tích và lập bảng đối chiếu AI |
| Hân Nguyễn | TV3 · Requirements | Xác định vai trò, phân quyền, lập danh mục chức năng (F-code) và phi chức năng |
| Hân Văn | TV4 · Workflow | Xây dựng quy trình đặt lịch cắt tóc, xử lý ngoại lệ và quy tắc trạng thái lịch hẹn |
| My | TV5 · Project Plan | Lập kế hoạch toàn học phần, phân công công việc 7 thành viên, quản lý rủi ro dự án |
| Phi | TV6 · Technical & GitHub | Đề xuất stack công nghệ, khởi tạo repo GitHub Public, cấu hình AGENTS.md và tạo Issues |
| Thông | TV7 · QA & Documentation | Viết README.md tổng quan, hoàn thiện nhật ký AI_USAGE_LOG.md và kiểm tra chất lượng |

## 2. Các giai đoạn
- Giai đoạn 1: Khảo sát và xác định yêu cầu.
- Giai đoạn 2: Thiết kế giao diện.
- Giai đoạn 3: Xây dựng các chức năng frontend.
- Giai đoạn 4: Phát triển backend và cơ sở dữ liệu.
- Giai đoạn 5: Tích hợp và kiểm thử.
- Giai đoạn 6: Triển khai và hoàn thiện.

## 3. Công việc
| Mã | Người phụ trách | Kết quả cần đạt | Thời hạn | Trạng thái |
|---|---|---|---|---|
| 01.1 | Ngân | Brief đề tài 1 trang (trả lời 6 câu hỏi xác định đề tài) | 12h trưa 17/10 | Đang thực hiện |
| 02.1 | Duyên | docs/competitor-analysis.md (khảo sát 3 website tương tự) | 12h trưa 18/10 | Đang thực hiện |
| 02.3 | Duyên | Tư liệu prompt và phản biện giữa 2 công cụ AI | 12h trưa 18/10 | Đang thực hiện |
| 03.1 | Hân Nguyễn | REQUIREMENTS.md (vai trò, danh mục mã F-code, phi chức năng) | 12h trưa 18/10 | Đang thực hiện |
| 04.1 | Hân Văn | docs/business-workflow.md (quy trình đặt lịch và ngoại lệ) | 12h trưa 18/10 | Đang thực hiện |
| 05.1 | My | PROJECT_PLAN.md (phân công 7 người, kế hoạch 6 giai đoạn, rủi ro) | 12h trưa 18/10 | Hoàn thành |
| 06.1 | Phi | Khung repo GitHub Public, AGENTS.md, tạo các GitHub Issues | 12h trưa 17/10 | Đang thực hiện |
| 07.1 | Thông, Ngân | README.md hoàn chỉnh và AI_USAGE_LOG.md | 5h chiều 19/10 | Đang thực hiện |
| G2.1 | Hân Văn, Duyên | Bản thiết kế Wireframe / Figma các màn hình đặt lịch | Tuần 4 | Chưa bắt đầu |
| G3.1 | Phi, Duyên | Mã nguồn giao diện Frontend Responsive (HTML/CSS/JS) | Tuần 7 | Chưa bắt đầu |
| G4.1 | Phi, Hân Nguyễn | Cơ sở dữ liệu và API xử lý đặt lịch, kiểm tra lịch trống | Tuần 10 | Chưa bắt đầu |
| G5.1 | Thông, Cả nhóm | Báo cáo kiểm thử tích hợp toàn bộ luồng nghiệp vụ | Tuần 12 | Chưa bắt đầu |
| G6.1 | Phi, Ngân, My | Website chạy thực tế trên hosting và slide báo cáo | Tuần 14 | Chưa bắt đầu |

## 4. Rủi ro
| Rủi ro | Ảnh hưởng | Hướng xử lý |
|---|---|---|
| Xung đột mã nguồn (Git Conflict) khi nhóm cùng chỉnh sửa code | Trung bình | Quy định mỗi người làm trên branch riêng, chỉ merge vào nhánh chính qua Pull Request sau khi kiểm tra |
| Lỗi logic đặt trùng giờ (nhiều khách cùng chọn 1 thợ trong cùng khung giờ) | Cao | Thiết kế cơ chế khóa tạm thời khung giờ khi đang thanh toán và kiểm tra lại slot trống trước khi lưu CSDL |
| Chênh lệch kỹ năng lập trình web giữa các thành viên | Trung bình | Phân chia công việc theo thế mạnh, hỗ trợ chéo và tận dụng công cụ AI để tạo khung code mẫu |
| Sơ suất lộ thông tin nhạy cảm (API key, mật khẩu CSDL) lên GitHub | Nghiêm trọng | Cấu hình kỹ file `.gitignore`, toàn bộ bí mật phải lưu trong biến môi trường `.env` |
| Nguy cơ trễ hạn đồ án do chọn phạm vi chức năng quá rộng | Cao | Bám sát danh sách MVP đặt lịch cốt lõi trong REQUIREMENTS.md, hoãn các tính năng phụ sang giai đoạn cuối |
