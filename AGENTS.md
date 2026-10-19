# Project Instructions for AI

## 1. Project context
Đây là đồ án sinh viên học phần "Phát triển ứng dụng WEB/TMĐT" (UEH).
Sản phẩm: website đặt lịch dịch vụ tóc (cắt, uốn, nhuộm, gội dưỡng sinh, phục hồi) tại TP.HCM.
Khách hàng mục tiêu: người 16–340 tuổi tại TP.HCM; chủ/nhân viên salon quản lý lịch hẹn.
Nhóm 7 thành viên, trình độ lập trình cơ bản.
Công nghệ dự kiến: HTML/CSS/JavaScript + Bootstrap 5, Node.js + Express, MySQL.

## 2. Scope
- Chỉ triển khai các chức năng đã được nhóm thống nhất trong REQUIREMENTS.md (theo mã F01, F02...).
- Không tự thêm chức năng ngoài REQUIREMENTS.md (ví dụ: thanh toán online, chatbot, gợi ý AI)
  trừ khi nhóm đã cập nhật REQUIREMENTS.md.
- Quy trình đặt lịch phải bám theo docs/business-workflow.md.
- Quy tắc bắt buộc: không cho phép 2 lịch hẹn trùng thời gian của cùng một thợ;
  thời lượng dịch vụ phải được tính khi kiểm tra khung giờ trống.

## 3. Coding principles
- Giữ mã nguồn dễ đọc, dễ bảo trì; đặt tên biến/hàm rõ nghĩa; có comment cho logic chính.
- Không thay đổi kiến trúc lớn (đổi framework, đổi CSDL, đổi cấu trúc thư mục) khi chưa được nhóm đồng ý.
- Không tự ý xóa hoặc viết lại chức năng đang hoạt động.
- Ưu tiên thay đổi nhỏ, mỗi lần một chức năng, có thể kiểm tra được.
- Kiểm tra dữ liệu đầu vào ở cả frontend và backend.

## 4. Workflow
Trước khi sửa mã nguồn:
1. Đọc REQUIREMENTS.md, docs/business-workflow.md và các file liên quan.
2. Phân tích hiện trạng mã nguồn.
3. Đề xuất phương án và liệt kê file sẽ sửa.
4. Chờ thành viên phụ trách xác nhận rồi mới thực hiện.

Sau khi sửa mã nguồn:
1. Giải thích các thay đổi.
2. Nêu rõ các file đã sửa.
3. Hướng dẫn chạy và kiểm thử (các bước + kết quả mong đợi).
4. Báo cáo giới hạn hoặc lỗi còn tồn tại.

## 5. Security
- Không đưa mật khẩu, API key, token hoặc chuỗi kết nối CSDL vào mã nguồn; dùng file .env (đã có trong .gitignore).
- Không tự ý vô hiệu hóa kiểm tra bảo mật, xác thực hoặc phân quyền.
- Không dùng dữ liệu cá nhân thật (tên, số điện thoại khách hàng); chỉ dùng dữ liệu mẫu.
- Chức năng quản trị phải yêu cầu đăng nhập và đúng quyền.

## 6. Communication
- Nếu yêu cầu chưa rõ hoặc mâu thuẫn với REQUIREMENTS.md, hãy hỏi lại trước khi triển khai.
- Trả lời bằng tiếng Việt, ngắn gọn, nêu rõ giả định.
