# Minh chứng kiểm thử Buổi 3 (TV6 – Phi)

Phiên bản kiểm thử: nhánh main, commit 439c1cf (09/11/2026). Chrome 1366px và 390px.

| Mã | Chức năng | Lần 1 | Retest |
|---|---|---|---|
| TC01 | Danh sách salon | Pass | Pass |
| TC02 | Xem chi tiết | Pass | Pass |
| TC03 | Tìm kiếm theo tên | Pass | Pass |
| TC13 | Tìm kiếm không có kết quả (dữ liệu rỗng) | Pass | Pass |
| TC04 | Lọc theo khu vực và dịch vụ | Pass | Pass |
| TC05 | Sắp xếp theo giá | Pass | Pass |
| TC14 | Kết hợp tìm + lọc + sắp xếp, đặt lại | Pass | Pass |
| TC06 | Thêm dịch vụ vào giỏ | Pass | Pass |
| TC07 | Thêm lại dịch vụ đã có | Pass | Pass |
| TC15 | Thêm dịch vụ từ trang chi tiết | Pass | Pass |
| TC08 | Thay đổi số lượng | Pass | Pass |
| TC16 | Giảm số lượng về tối thiểu (dữ liệu biên) | Pass | Pass |
| TC09 | Xóa dịch vụ | Pass | Pass |
| TC10 | Tải lại trang giỏ hàng | Pass | Pass |
| TC17 | Đồng bộ giỏ giữa các trang | Pass | Pass |
| TC11 | Giỏ hàng không có dịch vụ | Pass | Pass |
| TC18 | Dữ liệu localStorage sai/hỏng | Pass | Pass |
| TC19 | Chi tiết với id không tồn tại | Pass | Pass |
| TC20 | Chi tiết khi thiếu tham số id | Pass | Pass |
| TC21 | Menu điện thoại | Fail | Pass |
| TC22 | Giao diện desktop/mobile | Fail | Pass |
| TC12 | Kiểm tra Console | Pass | Pass |

Lỗi đã sửa: BUG-01 (js/common.js gắn click menu 2 lần), BUG-02 (footer 4 cột tràn ngang ở 390px).
Ảnh: tc*.png theo mã ca kiểm thử; BUG01-menu.png, BUG02-footer.png (trước/sau khi sửa).