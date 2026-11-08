# SalonBook | Giỏ dịch vụ và tính tiền — Bài tập nhóm Buổi 3

**Căn cứ:** `BaiTap_Nhom_Buoi3.pdf` (Bước 5, 6) và báo cáo SalonBook. Bản này triển khai theo mã nguồn tại `philipng09/salon-booking-project` nhánh `main`, truy cập ngày 07/11/2026. Giỏ lưu **dịch vụ theo salon**, không bán chính salon đó và không tạo booking thật.

## Cách áp dụng vào GitHub

1. Tải ZIP và giải nén. Sao chép toàn bộ **các file của bộ mã** vào **thư mục gốc của repository SalonBook** trên máy, giữ nguyên cấu trúc `js/`, `css/`, `tests/`. KHÔNG ghi đè `js/products.js`, `js/render-products.js`, HTML/CSS đang có.
2. Tại terminal trong thư mục repository (có `products.html` và `.git`), chạy `python apply_patch.py` (Windows cũng có thể chạy `py apply_patch.py`). Script tự chèn CSS và JS vào `products.html`, `product-detail.html`, mỗi file gốc được sao lưu `*.before-cart.bak` trước khi chỉnh. Chạy lại sẽ không chèn trùng.
3. Chạy website bằng Live Server và kiểm tra: `products.html` → nhấn **Thêm Cắt & tạo kiểu** → `cart.html` → tăng/giảm/xóa. Tại `product-detail.html?id=2`, chọn dịch vụ ở danh sách hoặc dropdown rồi thêm vào giỏ.
4. Chạy kiểm thử tự động: `node --test tests/cart.test.cjs` (cần Node.js 18+).
5. Khi đã nghiệm thu cùng TV1/TV3/TV5, push lên nhánh riêng (lệnh bên dưới) và tạo Pull Request. **Không merge main khi chưa kiểm thử kết hợp với phần của các thành viên khác.**

```bash
git checkout -b feature/cart-service-buoi3
git add cart.html css/cart.css js/cart.js js/cart-list.js js/cart-detail.js \
  products.html product-detail.html apply_patch.py tests/cart.test.cjs README_CART_BUOI3.md
git commit -m "feat: add shared SalonBook service cart with totals and localStorage"
git push -u origin feature/cart-service-buoi3
```

> Windows PowerShell: có thể viết lệnh `git add` thành một dòng. Các file `*.before-cart.bak` là bản sao lưu cục bộ, **không commit**.

## Dữ liệu và API thống nhất

`localStorage["cart"]` lưu mảng:

```json
[{"key":"1:s1_1","salonId":1,"serviceId":"s1_1","quantity":2}]
```

Không lưu giá do người dùng nhập: tên salon, ảnh, giá dịch vụ được đối chiếu từ `products.js` → `servicesList` của salon. `key = salonId + ':' + serviceId` để tránh trùng cùng dịch vụ và không gộp dịch vụ cùng tên giữa 2 salon.

| Hàm dùng chung (`window.SalonCart`) | Mục đích |
|---|---|
| `addToCart(salonId, serviceId, quantity = 1)` | Thêm hoặc cộng dồn số lượng; từ danh sách có thể truyền mỗi salonId để lấy dịch vụ đầu tiên |
| `updateQuantity(key, quantity)` | Đặt số lượng (0 là xóa; giới hạn 99) |
| `removeFromCart(key)` | Xóa dịch vụ |
| `getCart()` / `loadCart()` / `saveCart(items)` | Lấy, khôi phục, lưu giỏ |
| `getTotals()` | Lấy tổng số lượng, tổng tiền, từng dòng và tổng dòng |
| `renderCart()` | Vẽ lại `cart.html`, có thông báo giỏ trống |
| `formatMoney(amount)` | Định dạng VNĐ |

Có thêm alias `addToCart(salonId,serviceId)` nếu chưa tồn tại hàm `addToCart` toàn cục, giúp tương thích với mã của thành viên khác. Khi giỏ thay đổi, hệ thống phát sự kiện `window.addEventListener('saloncart:change', handler)` với `event.detail` là kết quả `getTotals()`.

## Quy tắc tính

- Thành tiền = **giá dịch vụ × số lượng**.
- Tổng số lượng = tổng `quantity` của các dòng.
- Tổng tiền = tổng `lineTotal` của các dòng, sử dụng số nguyên VNĐ.
- Mỗi mục duy nhất theo **cặp salon + dịch vụ**. Cùng dịch vụ tại cùng salon tăng số lượng; cùng loại dịch vụ ở hai salon khác nhau vẫn là hai dòng riêng.
- Phần tính tiền này là **chi phí dự kiến**, không bao gồm voucher, phí thanh toán, không xác thực lịch thợ. Đặt lịch thật cần một quy trình riêng kiểm tra `salon_id`, `stylist_id`, slot, và chốt giá tại thời điểm booking.

## Kiểm thử & lưu ý tích hợp

- `node --test tests/cart.test.cjs` kiểm tra 13 tình huống **logic**; không thay thế kiểm thử trình duyệt, responsive, và tích hợp TV3/TV5.
- Module `js/cart-list.js` gắn nút vào thẻ salon **động** của TV1 thông qua `MutationObserver`, không sửa hàm lọc/sắp xếp.
- Module `js/cart-detail.js` đọc `?id=...` hoặc `?salon=slug` (trường hợp URL dùng slug). Nếu URL sai hiển thị thông báo, không tự thêm dịch vụ tùy ý.
- Các trang cần nạp `js/products.js` **trước** `js/cart.js`.
- `localStorage` dùng chung một trình duyệt và cùng origin; không lưu ở backend. Nếu mở trực tiếp `file://`, nên dùng Live Server để kiểm thử chuyển trang nhất quán.
- Giao diện dùng bảng màu `--forest`, `--yellow`, `--cream` của `css/style.css`. Đã thêm CSS responsive cho mobile và desktop; nhóm vẫn cần kiểm tra hiển thị thực tế sau khi merge.
