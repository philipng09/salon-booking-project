# ĐẶC TẢ GIAO DIỆN WEBSITE SALONBOOK – 4 TRANG

**Dự án:** SalonBook – Website giới thiệu salon và dịch vụ chăm sóc tóc tại TP.HCM  
**Nội dung:** Đặc tả giao diện Buổi 2 (không viết HTML/CSS)  
**Phạm vi:** `index.html`, `products.html`, `product-detail.html`, `about.html`

> **Lưu ý:** Đây là đặc tả **giao diện minh họa**, không phải mô tả các chức năng đã lập trình. Trong phạm vi bài tập, không bổ sung tìm kiếm/lọc động, đặt lịch thực tế, thanh toán, Blog, AI hay Google Maps.

## 1. Quy chuẩn giao diện và thành phần dùng chung

| Yếu tố | Đặc tả thống nhất |
|---|---|
| **Bảng màu** | Xanh lá chủ đạo `#355F3B`; xanh nhấn `#C2E8F5`; nền be `#E8DCC4`; nền thẻ `#FFFDF8`; chữ `#26352B`; viền `#D4CCBA`. |
| **Kiểu chữ** | `Arial, sans-serif`; giãn dòng `1.6`; logo đậm `24px`; H1 màu xanh lá. Tiêu đề và văn bản có cấp độ rõ ràng. |
| **Khung nội dung** | Rộng tối đa `1200px`, lề ngang tối thiểu `16px`; card bo góc `12px`, nút bo góc `8px`. |
| **Header** | Dùng chung logo **SalonBook** và menu: **Trang chủ – Khám phá salon – Giới thiệu**. Nền xanh lá, chữ sáng; hover/focus theo CSS. |
| **Footer** | Dùng chung nền xanh lá, dòng chữ **“SalonBook – Dự án học tập”**. |
| **Responsive** | Ở màn hình `≤768px`, header xếp dọc và padding `main` giảm từ `40px` xuống `24px` theo CSS; các lưới nội dung được đề xuất chuyển sang ít cột. Không mặc định đã có menu hamburger. |

**Nguyên tắc dùng chung:** Bố cục nhất quán, ảnh đúng chủ đề và tỷ lệ, chữ dễ đọc, nút/link dễ nhận biết. Không hiển thị thông tin salon, giá hoặc đánh giá chưa có nguồn như dữ liệu thật.

## 2. Trang chủ – `index.html`

**Mục đích:** Giới thiệu SalonBook và dẫn khách đến trang khám phá salon/dịch vụ.

### 2.1. Bố cục đề xuất

```text
HEADER: SalonBook | Trang chủ | Khám phá salon | Giới thiệu
HERO: Tiêu đề + mô tả + ảnh/banner + [Khám phá salon]
NỔI BẬT: [Thẻ salon/dịch vụ] [Thẻ] [Thẻ] → Xem danh sách
FOOTER: SalonBook – Dự án học tập
```

### 2.2. Thành phần và cách trình bày

| Khu vực | Nội dung và hành vi |
|---|---|
| **Hero** | H1 **“Chào mừng đến SalonBook”**, mô tả ngắn về nền tảng, ảnh salon/chăm sóc tóc. Nút **“Khám phá salon”** dẫn đến `products.html`. |
| **Thẻ nổi bật** | Khoảng 3 thẻ salon hoặc nhóm dịch vụ, có ảnh, tên, mô tả ngắn; liên kết đến danh sách hoặc trang chi tiết mẫu nếu phù hợp. |
| **Bố cục** | Desktop: hero chia hai vùng chữ và ảnh; mobile: xếp dọc, ưu tiên tiêu đề và nút trước ảnh. |

**Lưu ý UX:** Ảnh rõ và không che chữ; nút khám phá dễ nhìn; không giả lập chức năng đặt lịch hoàn chỉnh.

## 3. Danh sách sản phẩm/dịch vụ – `products.html`

**Tên hiển thị:** **Khám phá salon**. Trong bài tập, “sản phẩm” được áp dụng thành salon/dịch vụ tóc.  
**Mục đích:** Cho người dùng xem danh sách và mở một trang chi tiết mẫu.

### 3.1. Bố cục đề xuất

```text
HEADER chung
H1: Danh sách salon + mô tả ngắn
LƯỚI TỐI THIỂU 8 THẺ:
[Ảnh + Tên + Giá + Xem chi tiết] × 8
FOOTER chung
```

### 3.2. Thành phần và cách trình bày

| Thành phần | Nội dung | Bố trí/điều hướng |
|---|---|---|
| **Tiêu đề** | “Danh sách salon” và câu mô tả “Khám phá các salon và dịch vụ chăm sóc tóc”. | Đặt đầu nội dung, H1 xanh lá. |
| **Lưới thẻ** | Tối thiểu **8 thẻ**, mỗi thẻ có ảnh, tên, giá tham khảo và link **“Xem chi tiết”**. | Desktop 3–4 cột; tablet 2 cột; mobile 1 cột. |
| **Ảnh** | Ảnh salon/dịch vụ liên quan, có quyền sử dụng. | Cùng tỷ lệ, đề xuất `4:3`; tránh kéo méo. |
| **Nội dung thẻ** | Tên, mô tả ngắn, giá gắn đúng dịch vụ; thiếu dữ liệu ghi **“Đang cập nhật”**. | Nền `#FFFDF8`, viền `#D4CCBA`, chữ `#26352B`. |
| **Liên kết** | “Xem chi tiết”. | Dẫn đến `product-detail.html` – **trang chi tiết tĩnh mẫu**; không tự đổi dữ liệu theo từng thẻ. |

**Lưu ý UX:** Nội dung mỗi thẻ đủ dễ quét (tên – dịch vụ – giá – link); nút đủ lớn trên điện thoại. Không bổ sung bộ lọc, tìm kiếm hay phân trang hoạt động khi bài chưa yêu cầu.

## 4. Chi tiết sản phẩm/dịch vụ – `product-detail.html`

**Tên hiển thị:** **Chi tiết salon**.  
**Mục đích:** Trình bày đầy đủ thông tin của **một salon/dịch vụ mẫu** thống nhất với thẻ tại trang danh sách.

### 4.1. Bố cục đề xuất

```text
HEADER chung
H1: Tên salon/dịch vụ
[ẢNH CHÍNH / ảnh phụ] | [Tên + nhóm dịch vụ + giá]
                       | [Mô tả + thông tin cơ bản]
[Đặt lịch – nút minh họa nếu có]
[← Quay lại danh sách salon]
FOOTER chung
```

### 4.2. Thành phần và cách trình bày

| Khu vực | Nội dung | Lưu ý |
|---|---|---|
| **Ảnh chính** | Ảnh lớn phù hợp salon/dịch vụ; ảnh phụ nếu có. | Khớp ảnh đại diện tại trang danh sách. |
| **Tên và giá** | H1 tên salon/dịch vụ; giá tham khảo gắn dịch vụ cụ thể; thông tin khu vực, loại salon, nhóm dịch vụ nếu có. | Đặt gần nhau để dễ đối chiếu. |
| **Mô tả** | Giới thiệu và nội dung chăm sóc tóc, chia thành đoạn ngắn. | Tránh khối chữ dài. |
| **Hành động** | Có thể minh họa nút **“Đặt lịch”** theo phác thảo; link **“Quay lại danh sách salon”**. | Không mô tả nút minh họa như booking đã hoạt động. |

**Bố trí:** Desktop khoảng **45% ảnh – 55% thông tin**; mobile chuyển sang ảnh trên, nội dung dưới. Tên, giá và ảnh phải nhất quán với thẻ dẫn đến trang này. Link quay lại dẫn đến `products.html`.

## 5. Giới thiệu cửa hàng – `about.html`

**Mục đích:** Giúp người xem hiểu SalonBook là gì và giá trị của nền tảng.

### 5.1. Bố cục đề xuất

```text
HEADER chung
H1: Giới thiệu SalonBook
[ẢNH MINH HỌA] | [SalonBook là gì?]
[Giá trị cho khách hàng] [Giá trị cho salon]
[Khám phá salon →]
FOOTER chung
```

### 5.2. Thành phần và cách trình bày

| Thành phần | Nội dung/bố trí |
|---|---|
| **Giới thiệu** | “SalonBook là dự án nền tảng kết nối khách hàng với các salon và barbershop tại TP.HCM.” Đặt dưới H1, kèm ảnh đúng chủ đề. |
| **Giá trị nền tảng** | Hai khối ngắn: **Khách hàng** thuận tiện xem dịch vụ, bảng giá; **Salon** có kênh giới thiệu dịch vụ. |
| **Ảnh và liên kết** | Chỉ dùng ảnh nhóm/salon có nguồn phù hợp. Nút **“Khám phá salon”** dẫn đến `products.html`. |
| **Responsive** | Desktop hai vùng ảnh và chữ; mobile một cột, ưu tiên nội dung quan trọng trước ảnh. |

**Lưu ý:** Giới thiệu đúng tính chất dự án; không tuyên bố hệ thống đặt lịch đã hoàn thiện hoặc đưa thông tin liên hệ không được xác nhận.

## 6. Điều hướng giữa 4 trang

| Thao tác | Trang đích |
|---|---|
| Nhấn logo **SalonBook** hoặc **Trang chủ** | `index.html` |
| Nhấn **Khám phá salon** từ header, hero hoặc trang Giới thiệu | `products.html` |
| Nhấn **Xem chi tiết** trên thẻ mẫu | `product-detail.html` |
| Nhấn **Quay lại danh sách salon** | `products.html` |
| Nhấn **Giới thiệu** | `about.html` |

**Điều hướng chung:** Header chỉ có 3 mục **Trang chủ – Khám phá salon – Giới thiệu**. Trang Chi tiết truy cập từ danh sách, không cần mục menu riêng. Người dùng luôn có đường quay về trang danh sách hoặc trang chủ.

## 7. Các điểm cần lưu ý khi thiết kế UI/UX

- **Nhất quán:** Header, footer, font, màu, kích thước nút và khoảng cách giữa 4 trang đồng bộ với `style.css`.
- **Dễ đọc:** Có phân cấp H1/tiêu đề phụ; văn bản ngắn; màu chữ đủ tương phản với nền.
- **Hình ảnh:** Liên quan đúng salon/dịch vụ, kích thước thống nhất, không méo; có mô tả thay thế phù hợp.
- **Điều hướng rõ ràng:** Link đúng 4 tệp HTML, dễ tìm nút quay lại; không tạo nút không có điểm đến mà giả là chức năng hoàn chỉnh.
- **Responsive:** Không tràn ngang ở màn hình hẹp; card giảm số cột; nút/link dễ chạm.
- **Đúng phạm vi:** Chỉ đặc tả giao diện tĩnh trong Buổi 2; các chức năng động và nghiệp vụ mở rộng chưa thuộc phần bàn giao này.

---

**Kết quả bàn giao:** Bản đặc tả bố cục, thành phần dùng chung, bảng màu/kiểu chữ, hình ảnh, điều hướng và lưu ý UX cho đúng **4 trang HTML** của SalonBook; dùng làm căn cứ điều chỉnh wireframe Buổi 1 và triển khai giao diện ở các buổi tiếp theo.
