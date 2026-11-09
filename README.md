
# SalonBook – Website Đặt Lịch Salon Tóc Trực Tuyến

---

## 1. Giới thiệu

**SalonBook** là nền tảng thương mại điện tử hoạt động theo mô hình trung gian (Marketplace), kết nối khách hàng có nhu cầu chăm sóc tóc với các salon và barbershop tại Thành phố Hồ Chí Minh.

Ở phiên bản bài tập nhóm Buổi 3, website hỗ trợ khám phá salon, tìm kiếm/lọc/sắp xếp, xem thông tin chi tiết, chọn dịch vụ – stylist – ngày – giờ và lưu các lựa chọn vào giỏ dịch vụ. Việc xác nhận lịch hẹn thực tế trên máy chủ vẫn thuộc giai đoạn phát triển sau.

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

Hệ thống định hướng phát triển 13 chức năng chính trong phiên bản MVP. Bảng này mô tả **phạm vi mục tiêu**; tiến độ thực tế của bài tập Buổi 3 được cập nhật tại Mục 9–11:

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

**Phân công cụ thể cho bài tập JavaScript Buổi 3:** xem Mục 9.1.

---

## 5. Công nghệ sử dụng và dự kiến

**Đang sử dụng (Buổi 3):** HTML5, CSS3, JavaScript (DOM, mảng đối tượng, URLSearchParams, localStorage), CSS Grid/Flexbox/Media Queries, Git/GitHub, GitHub Pages. Nhóm dùng Chrome DevTools để kiểm thử trình duyệt và Node.js (`node --test`) để kiểm thử logic giỏ hàng.

**Định hướng phát triển:**

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

SalonBook hiện là **frontend prototype tương tác** bằng HTML5, CSS3 và JavaScript. Giỏ dịch vụ được lưu trong `localStorage`, chưa đồng bộ với máy chủ.

### Truy cập trực tuyến

Website:
https://philipng09.github.io/salon-booking-project/

Mã nguồn:
https://github.com/philipng09/salon-booking-project

### Chạy trên máy tính

1. Truy cập GitHub Repository.
2. Chọn Code → Download ZIP.
3. Giải nén thư mục dự án.
4. Mở thư mục bằng Visual Studio Code và chạy **Live Server** (hoặc một máy chủ HTTP cục bộ).
5. Mở `index.html`, sau đó kiểm tra tìm kiếm, lọc, trang chi tiết và giỏ dịch vụ.

**Không nên mở trực tiếp bằng `file://`:** `js/common.js` dùng `fetch()` để tải `components/footer.html`, có thể bị trình duyệt chặn khi mở file trực tiếp (BUG-03).

Các trang chính:
- index.html: Trang chủ.
- products.html: Danh sách salon.
- product-detail.html: Chi tiết salon và giao diện đặt lịch.
- about.html: Giới thiệu SalonBook.
- cart.html: Giỏ dịch vụ, thay đổi số lượng, xóa và xem tổng tiền.
- blog.html: Trang nội dung.

**Kiểm thử tự động giỏ hàng** (cần cài Node.js):

```bash
node --test tests/cart.test.cjs tests/cart-booking.test.cjs
```

Theo báo cáo ngày 09/11/2026, bộ kiểm thử này đạt **25/25 ca Pass**.

Lưu ý: Để kiểm tra đầy đủ các thành phần được tải bằng JavaScript, nên chạy dự án bằng Live Server trong Visual Studio Code hoặc máy chủ HTTP cục bộ.

---

## 9. Kết quả triển khai JavaScript – Bài tập nhóm Buổi 3

### 9.1. Phân công triển khai

Các vai trò dài hạn của nhóm được trình bày tại Mục 4. Riêng bài tập Buổi 3, nhiệm vụ thực tế được phân như sau:

| Thành viên | Phần việc Buổi 3 |
|---|---|
| Thanh Ngân | Chuẩn hóa dữ liệu `js/products.js`, hiển thị danh sách salon |
| Mai Duyên | Tìm kiếm, lọc đa tiêu chí, sắp xếp |
| Trà My | Trang chi tiết động theo ID và nút thêm vào giỏ |
| Văn Ngọc Hân | Logic giỏ hàng: thêm, sửa, xóa, tính tiền |
| Nguyễn Bảo Hân | Lưu và đồng bộ giỏ hàng bằng `localStorage` |
| Nhật Phi | Kiểm thử chức năng, khắc phục lỗi tích hợp |
| Hiển Thông, Thanh Ngân, Mai Duyên | GitHub, tích hợp mã nguồn, báo cáo và cập nhật README |
| Cả nhóm | Chuẩn bị và trả lời 10 câu hỏi kiến thức |

### 9.2. Dữ liệu dùng chung và cấu trúc mã nguồn

Dữ liệu tập trung trong `js/products.js` dưới dạng mảng `products` gồm **10 salon**. Mỗi salon có thông tin định danh (`id`, `slug`), tên, giá tham khảo, nhóm/khu vực, hình ảnh, địa chỉ, mô tả; đồng thời có `stylists` (gồm `availableHours`) và `servicesList` (tên dịch vụ, thời lượng, đơn giá). Các trang đọc chung dữ liệu để tránh khai báo sai lệch.

Các tệp quan trọng của luồng tương tác:

```text
salon-booking-project/
├── index.html                  # Trang chủ
├── products.html               # Khám phá, tìm/lọc/sắp xếp salon
├── product-detail.html         # Trang chi tiết và chọn lịch dự kiến
├── cart.html                   # Giỏ dịch vụ và tổng tiền
├── about.html, blog.html, tu-van.html
├── components/footer.html      # Footer được nạp bởi JavaScript
├── css/                        # Giao diện và responsive
├── js/
│   ├── products.js             # Dữ liệu salon dùng chung
│   ├── render-products.js      # renderProducts(list)
│   ├── product-detail.js       # Xử lý trang chi tiết và thông tin lịch
│   ├── cart.js                 # Module SalonCart + localStorage
│   └── common.js               # Các thành phần dùng chung
├── tests/
│   ├── cart.test.cjs           # 13 ca kiểm thử giỏ hàng cơ bản
│   └── cart-booking.test.cjs   # 12 ca kiểm thử dữ liệu lịch hẹn
├── images/
├── docs/
└── README.md
```

Một số xử lý tìm kiếm/lọc được mô tả và minh họa trực tiếp trong `products.html` ở báo cáo Buổi 3; không mặc định mọi chức năng đều nằm trong file JS riêng. `js/cart-detail.js` đã được **tắt tại trang chi tiết** để tránh tạo nút thêm giỏ trùng với `js/product-detail.js`.

### 9.3. Chức năng đã thực hiện

| Hạng mục | Kết quả triển khai Buổi 3 |
|---|---|
| Hiển thị salon | `renderProducts(list)` hiển thị 10 salon từ dữ liệu JS, có tên/ảnh/địa chỉ/giá và thông báo khi không có kết quả |
| Tìm kiếm | Tìm theo tên, không phân biệt dấu tiếng Việt và hoa/thường |
| Bộ lọc | Lọc theo khu vực và dịch vụ; kết hợp tìm kiếm, lọc, sắp xếp |
| Sắp xếp | Giá tăng/giảm và tên A–Z; không sửa dữ liệu gốc ngoài ý muốn |
| Trang chi tiết | Dùng `URLSearchParams` lấy ID, hiển thị đúng salon, xử lý ID không tồn tại và liên kết quay lại |
| Chọn dịch vụ | Chọn dịch vụ, chuyên viên, ngày và khung giờ trước khi thêm vào giỏ |
| Giỏ dịch vụ | Thêm, gộp trùng nếu cùng khóa lịch, thay đổi số lượng, xóa, tính thành tiền/tổng tiền và đồng bộ badge |
| Lịch dự kiến trong giỏ | Lưu `stylistId`, `date`, `time`; khác giờ/chuyên viên là các dòng khác nhau; có xử lý sửa/bổ sung lịch |
| localStorage | Lưu/khôi phục khóa `cart`, xử lý JSON hỏng, dữ liệu không hợp lệ và dữ liệu giỏ cũ |

**Quy ước giỏ hàng:** Chỉ thêm dịch vụ từ trang chi tiết sau khi chọn đủ dịch vụ, stylist, ngày và giờ. Khóa gộp mục giỏ gồm salon + dịch vụ + stylist + ngày + giờ; số lượng tối đa 99. Giá được tra từ `servicesList`. Dữ liệu trong `localStorage` là **lựa chọn lịch dự kiến**, không phải đơn đặt lịch được xác nhận trên backend.

### 9.4. Cách chạy và kiểm tra

Xem hướng dẫn đầy đủ tại Mục 8. Dùng **GitHub Pages** hoặc **Live Server** thay vì `file://` để các thành phần tải bằng `fetch()` hoạt động ổn định. Dùng Chrome DevTools (Console, Application → Local Storage, Network) để kiểm tra tương tác và đường dẫn.

### 9.5. Sử dụng AI

Nhóm sử dụng AI (có ghi nhận minh chứng sử dụng Gemini/Claude trong báo cáo) để tham khảo phân công, phân tích chức năng, đề xuất trường hợp kiểm thử và rà soát giải pháp.

Với Prompt kiểm thử, nhóm đối chiếu kết quả AI với mã nguồn thật và chạy kiểm thử thực tế; **không coi câu trả lời AI là bằng chứng Pass**.

Chi tiết xem [AI_USAGE_LOG.md](AI_USAGE_LOG.md).

### 9.6. Phạm vi chưa triển khai

Website chưa tích hợp backend, cơ sở dữ liệu người dùng, đăng nhập/phân quyền, đặt lịch xác nhận trên máy chủ, xử lý trùng lịch đa người dùng hoặc thanh toán thật. Các chức năng AI phân tích khuôn mặt/chatbot và quản trị salon vẫn thuộc định hướng dự án tại Mục 3.

---

## 10. Kiểm thử chức năng, tích hợp và giao diện

### 10.1. Môi trường và phương pháp

Nhóm kiểm thử trên **Chrome** qua máy chủ cục bộ, ở độ rộng **1366px** (desktop) và **390px** (mobile), dùng DevTools Console/Application/Network. Bảng kiểm thử và ảnh chụp chi tiết nằm trong **Báo cáo NHÓM-3-BTNC3, Mục 8**.

### 10.2. Kết quả kiểm thử Buổi 3

| Phạm vi | Kết quả theo báo cáo ngày 09/11/2026 |
|---|---|
| Chức năng trình duyệt TC01–TC20 | **20/20 Pass** ở lần chạy đầu |
| Tích hợp + giao diện TC01–TC22 | Lần đầu **20/22 Pass**, TC21 và TC22 Fail |
| Retest sau khi sửa BUG-01 và BUG-02 | **22/22 Pass** |
| Kiểm thử tự động `tests/cart.test.cjs` | **13/13 Pass** |
| Kiểm thử tự động mở rộng `tests/cart-booking.test.cjs` | **12/12 Pass**; tổng cộng **25/25 Pass**, 0 Fail, 0 Skipped |

Các kịch bản đã kiểm tra gồm hiển thị 10 salon, tìm `juno`/`khanh`, lọc Quận 1 và Nhuộm tóc, sắp xếp giá, mở chi tiết theo `id`, thêm dịch vụ sau khi chọn đủ thông tin, gộp lịch trùng, tăng/giảm/xóa số lượng, lưu/khôi phục `localStorage`, xử lý dữ liệu hỏng và trạng thái rỗng. Console không ghi nhận lỗi JavaScript chưa xử lý trong lần kiểm thử lại theo báo cáo.

### 10.3. Kiểm thử responsive và minh chứng

Bài tập trước đã ghi nhận giao diện trang chi tiết Min Hair Salon ở Desktop 1366px, Tablet 768px và Mobile. Buổi 3 tiếp tục kiểm tra ở 1366px và 390px, bao gồm trang danh sách và giỏ dịch vụ, sau đó sửa hai lỗi tích hợp liên quan tới màn hình nhỏ.

- [Ảnh responsive desktop](docs/test-evidence/01-responsive-desktop.png)
- [Ảnh responsive tablet](docs/test-evidence/02-responsive-tablet.png)
- [Ảnh responsive mobile](docs/test-evidence/03-responsive-mobile.png)

Các ảnh minh chứng BUG-01/BUG-02 và bảng kết quả TC01–TC22 được trình bày trong báo cáo nhóm Buổi 3; không mặc định đã được upload vào thư mục `docs/test-evidence/` nếu chưa kiểm tra GitHub.

### 10.4. Lỗi đã sửa và vấn đề còn theo dõi

| Mã lỗi | Nguyên nhân | Hướng xử lý và trạng thái |
|---|---|---|
| **BUG-01** – Menu mobile bấm không mở | `js/common.js` đăng ký hai handler click cùng toggle menu, khiến menu mở rồi đóng ngay | **Đã sửa:** gộp thành một `DOMContentLoaded`; TC21 retest **Pass** (Phi sửa, Thông theo dõi tích hợp) |
| **BUG-02** – Tràn ngang 36px ở 390px | Footer 4 cột không có quy tắc responsive phù hợp | **Đã sửa:** `.footer-main` thành 2 cột dưới 900px và 1 cột dưới 560px; TC22 retest **Pass** (Phi sửa) |
| **BUG-03** – Footer không tải đúng khi mở `file://` | `fetch()` bị trình duyệt hạn chế trên file cục bộ | **Đã ghi nhận/hướng dẫn:** chạy qua Live Server hoặc GitHub Pages; còn phương án thay đổi triển khai ở giai đoạn sau |
| **BUG-04** – Mô tả nút thêm giỏ không khớp code | Tài liệu cũ nhắc `js/cart-detail.js` dù trang chi tiết đã tắt file đó | **Cần đồng bộ tài liệu:** mô tả luồng thật là chọn đủ dịch vụ/stylist/ngày/giờ rồi nhấn “Thêm vào giỏ” trong `product-detail.js` |
