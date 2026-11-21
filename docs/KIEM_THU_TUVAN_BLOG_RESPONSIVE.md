# Kiểm thử hoàn thiện – Tư vấn, Cộng đồng (Blog kiểu Threads), Responsive (21–22/11/2026)

Người thực hiện: Nhật Phi · Môi trường: Chrome headless (Playwright), máy chủ cục bộ, 3 độ rộng 1366 / 768 / 390px.

## 1. Kiểm thử chức năng

| Mã | Chức năng | Thao tác | Kết quả mong đợi | Kết quả |
|---|---|---|---|---|
| TV01 | Nút tư vấn | Mở tuvan.html | Nút "Bắt đầu tư vấn" bị khóa | Pass |
| TV02 | Kiểm tra định dạng | Chọn file .txt | Báo lỗi "chỉ chấp nhận JPG/PNG" | Pass |
| TV03 | Xem trước ảnh | Chọn ảnh PNG | Hiện ảnh xem trước, ẩn lỗi | Pass |
| TV04 | Điều kiện tư vấn | Có ảnh + chọn kiểu, chưa đồng ý | Nút vẫn khóa, danh sách điều kiện báo còn thiếu | Pass |
| TV05 | Điều kiện tư vấn | Tick đồng ý | Nút mở | Pass |
| TV06 | Loading | Bấm tư vấn | Hiện loading 3 bước, nút khóa tránh bấm 2 lần | Pass |
| TV07 | Kết quả mô phỏng | Chờ ~2 giây | Có nhãn "KẾT QUẢ MÔ PHỎNG" và ghi chú không phải AI thật | Pass |
| TV08 | Chuyển Booking | Xem gợi ý salon | 3 nút dẫn tới product-detail.html?id=… | Pass |
| TV09 | Lưu lịch sử | Sau khi có kết quả | Khóa salonbook_consult_history có bản ghi, không chứa ảnh | Pass |
| TV10 | Khôi phục lịch sử | F5 | Lịch sử vẫn hiển thị | Pass |
| TV11 | Chọn lại từ lịch sử | Bấm "Chọn lại" | Kiểu tóc được chọn lại và highlight | Pass |
| TV12 | Đặt lịch từ gợi ý | Bấm "Đặt lịch tại đây" | Mở đúng trang salon | Pass |
| TH01 | Bảng tin | Mở blog.html | 6 bài đầu render từ js/blogs.js, có nút "Xem thêm" | Pass |
| TH02 | Tải thêm | Bấm "Xem thêm" | Hiện đủ 10 bài | Pass |
| TH03 | Sắp xếp | Tab "Mới nhất" | Bài mới nhất lên trước (so theo mốc thời gian thật) | Pass |
| TH04 | Lọc chủ đề | Chip "Hỏi đáp" | Chỉ hiện bài Hỏi đáp | Pass |
| TH05 | Hashtag | Bấm #layer trong bài | Lọc tại chỗ, URL có ?tag=layer, có nút bỏ lọc | Pass |
| TH06 | Mở thread | Bấm vào thân bài | Mở blog-detail.html?id=… đúng bài | Pass |
| TH07 | Quyền tương tác | Khách bấm tim | Chuyển sang auth.html?returnTo=blog.html | Pass |
| TH08–10 | Thích bài | Bấm tim, F5, bấm lại | +1 và đổi màu; còn sau F5; bỏ thích về số cũ | Pass |
| TH11 | Validation đăng bài | Gửi form trống | Báo lỗi nội dung và chủ đề | Pass |
| TH12 | Ảnh đính kèm | Chọn ảnh 2400×1600 | Xem trước, tự nén ≤1080px | Pass |
| TH13 | Đăng bài | Điền đủ + gắn salon | Bài lên đầu, có ảnh và thẻ salon dẫn tới product-detail | Pass |
| TH14 | Chống chèn HTML | Nội dung chứa thẻ img/b | Hiện dạng chữ, không chạy mã | Pass |
| TH15 | Dung lượng | Kiểm tra localStorage | Ảnh sau nén chỉ vài KB–vài trăm KB | Pass |
| TH16–18 | Trả lời | Gửi, thích, xóa trả lời của mình | Số trả lời cập nhật; thích +1; xóa được | Pass |
| TH19 | Phân quyền xóa | Mở thread của người khác | Không có nút xóa | Pass |
| TH20–21 | id sai / thiếu id | ?id=999, không có id | Thông báo rõ ràng + quay lại bảng tin | Pass |
| TH22 | Xóa bài | Tác giả bấm Xóa | Bài và tương tác liên quan bị xóa | Pass |
| TH23 | Dữ liệu hỏng | Ghi JSON sai vào localStorage | Trang vẫn hiển thị bài mẫu, không lỗi | Pass |
| C01 | Console | Toàn bộ thao tác trên | Không lỗi JavaScript | Pass |

## 2. Kiểm tra responsive (10 trang × 3 độ rộng)

Trang: index, products, product-detail?id=1, cart, auth, profile, tuvan, blog, blog-detail?id=1, about.

| Lần | Kết quả |
|---|---|
| Lần 1 | 9/30 trường hợp tràn ngang (8 trang ở 768px, index + tuvan ở 390px) |
| Sau sửa | 30/30 không tràn ngang, 0 lỗi Console |

## 3. Lỗi phát hiện và đã xử lý

| Mã | Mô tả | Nguyên nhân | Cách sửa | Retest |
|---|---|---|---|---|
| BUG-H1 | 768px: header tràn 52–228px | 5 menu + ô tìm kiếm + giỏ + nút đăng nhập trên một hàng | Ẩn ô tìm kiếm header ≤1100px, thu nhỏ nút (responsive-ux.css mục 6) | Pass |
| BUG-H2 | 390px: index/tuvan tràn 196px; các trang khác mất nút Đăng nhập | homepage-v4.css ép `.nav-actions` hiện bằng `!important`; style.css lại ẩn hẳn | Thống nhất: điện thoại giữ nút Đăng nhập, ẩn link giỏ (đã có trong menu ☰) | Pass |
| BUG-H3 | 761–900px: menu chen vào logo | Menu ☰ chỉ bật từ 760px | Bật menu ☰ từ 900px | Pass |
| BUG-H4 | products/about luôn hiện "Đăng ký / Đăng nhập" kể cả khi đã đăng nhập | Thiếu js/auth.js | Thêm auth.js vào 2 trang | Pass |
| BUG-T1 | Tư vấn: nút "Bắt đầu tư vấn" chỉ hiện alert | Bước 4 chưa làm | Loading + kết quả mô phỏng + gợi ý salon | Pass |
| BUG-T2 | Nút "Sử dụng camera" cao 30px | Vùng chạm nhỏ | min-height 44px | Pass |
| BUG-H5 | Đã đăng nhập: menu "Trang chủ", "Đặt lịch"... xuống 2 dòng, đè lên logo ở ≤1366px | Lời chào "Xin chào, <họ tên>" + nút Đăng xuất chiếm chỗ, link menu được phép xuống dòng | Menu không xuống dòng; ẩn lời chào <1440px; thu/ẩn ô tìm kiếm ≤1280px (responsive-ux.css mục 7) | Pass |
| BUG-B2 | Avatar trả lời xem trước bị kéo thành hình bầu dục | `.th-reply-preview span {flex:1}` áp cả vào avatar | Tách khối chữ riêng, avatar flex: 0 0 auto + aspect-ratio 1:1 | Pass |
| BUG-B1 | Bài mới đăng không lên đầu tab "Mới nhất" | So sánh chuỗi ngày có múi giờ khác nhau (+07:00 và Z) | So sánh theo Date.getTime() | Pass |
| BUG-T3 | Ảnh `src=""` gửi request thừa | Thẻ img để src rỗng | Bỏ thuộc tính src, dùng removeAttribute | Pass |

## 4. Giới hạn

- Kết quả tư vấn là mô phỏng; điểm phù hợp tính cố định theo ảnh + kiểu tóc, không phân tích khuôn mặt.
- Bài viết, lượt thích, trả lời và lịch sử tư vấn chỉ lưu trong localStorage của trình duyệt hiện tại.
- Booking, Profile được kiểm tra tràn ngang/Console; chưa kiểm thử sâu luồng nghiệp vụ của 2 trang này.
