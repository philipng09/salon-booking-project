
# PHÂN TÍCH VÀ PHẢN BIỆN YÊU CẦU DỰ ÁN BẰNG AI

**Dự án:** Website đặt lịch Salon – SalonBook  
**Công cụ AI thứ nhất:** ChatGPT  
**Công cụ AI thứ hai:** Claude  
**Mô hình:** Nền tảng trung gian (Marketplace) kết nối nhiều salon độc lập tại Thành phố Hồ Chí Minh.

## 1. Mục đích và phương pháp thực hiện

Nhóm sử dụng ChatGPT theo Prompt 1 của giảng viên để đề xuất yêu cầu cho dự án SalonBook, dựa trên mô tả đề tài, vấn đề kinh doanh, khách hàng mục tiêu và kết quả khảo sát ba website 30Shine, Fresha, KiotViet Salon. Kết quả phân tích gồm tám nội dung: mục tiêu và phạm vi, nhóm người dùng, chức năng, quy trình nghiệp vụ, yêu cầu phi chức năng, phiên bản đầu tiên, chức năng nâng cao và rủi ro triển khai.

Tiếp theo, nhóm sử dụng Claude theo Prompt 2 để phản biện độc lập kết quả của ChatGPT theo sáu khía cạnh: mức độ giải quyết vấn đề kinh doanh, yêu cầu trùng lặp hoặc không cần thiết, tính khả thi, chức năng và quy trình còn thiếu, rủi ro dữ liệu và mức độ rõ ràng để lập trình, kiểm thử.

Nhóm tổng hợp các nhận định có ảnh hưởng trực tiếp đến phạm vi và chất lượng hệ thống, từ đó lựa chọn phương án phù hợp với mục tiêu dự án và nguồn lực bảy thành viên trong một học phần. Các đề xuất mới chưa được thống nhất được phân biệt với những nội dung đã xác định trong đề tài.

## 2. Bảng đối chiếu kết quả hai công cụ AI

| Nội dung | AI thứ nhất đề xuất | AI thứ hai phản biện | Quyết định của nhóm |
|---|---|---|---|
| **1. Khả năng giải quyết vấn đề kinh doanh** | Phát triển marketplace giúp khách tìm kiếm, so sánh và đặt lịch tại nhiều salon; đồng thời hỗ trợ từng salon quản lý dịch vụ, stylist và lịch hẹn riêng. | Đánh giá định hướng phù hợp, nhưng cho rằng mục tiêu tận dụng giờ trống chưa được thể hiện rõ qua khả năng hiển thị hoặc ưu tiên các giờ trống gần nhất. | **Giữ mô hình marketplace đã xác định.** Chức năng đặt lịch theo giờ khả dụng tạo điều kiện cho salon tiếp nhận khách trực tuyến. Chưa bổ sung bộ lọc “giờ trống gần nhất” vào phiên bản đầu vì chưa phải chức năng thiết yếu. |
| **2. Quy trình xác nhận lịch** | Khách tạo lịch hẹn; salon tiếp nhận và cập nhật trạng thái từ chờ xác nhận đến hoàn thành hoặc hủy. | Bước chờ xác nhận có thể khiến khách phải đợi; đề nghị xác nhận tự động hoặc quy định thời hạn phản hồi. | **Giữ quy trình salon tiếp nhận và xác nhận lịch.** Cách này phù hợp mục tiêu hỗ trợ salon chủ động quản lý lịch phục vụ. Xác nhận tự động chưa được lựa chọn vì làm thay đổi quy trình xử lý lịch hẹn. |
| **3. Chức năng có khả năng trùng lặp** | Tách quản lý thông tin, danh mục dịch vụ với quản lý stylist và lịch làm việc. | Đề nghị gộp thành một module quản lý salon vì cùng phục vụ chủ salon. | **Giữ hai nhóm chức năng riêng về nghiệp vụ.** Danh mục dịch vụ và lịch nhân viên có dữ liệu, quy tắc xử lý khác nhau; có thể tích hợp trong cùng giao diện quản trị để thuận tiện sử dụng. |
| **4. Mức độ cần thiết của trạng thái lịch** | Đề xuất vòng đời lịch gồm Chờ xác nhận, Đã xác nhận, Đang phục vụ, Hoàn thành và Hủy. | Cho rằng trạng thái “Đang phục vụ” có thể không cần thiết và làm tăng thao tác. | **Giữ trạng thái “Đang phục vụ”.** Trạng thái hỗ trợ chủ salon theo dõi tiến trình thực hiện dịch vụ. Khi triển khai phải quy định rõ các chuyển trạng thái hợp lệ để tránh cập nhật sai. |
| **5. Tính khả thi của phiên bản đầu tiên** | Đề xuất các chức năng cốt lõi về tìm kiếm salon, đặt lịch, quản lý lịch hẹn, đánh giá và quản trị hệ thống. | Cảnh báo phạm vi tương đối lớn đối với nhóm bảy sinh viên; đề nghị phân tầng chức năng và giảm độ phức tạp. | **Giữ các nhóm chức năng cốt lõi của đề tài.** Ưu tiên triển khai theo quan hệ phụ thuộc, trước hết bảo đảm quy trình tìm kiếm và đặt lịch hoạt động ổn định, sau đó hoàn thiện các nghiệp vụ quản trị và đánh giá. Không mở rộng đồng thời sang các tính năng nâng cao. |
| **6. Salon không thể phục vụ lịch đã nhận** | Cho phép chủ salon quản lý và cập nhật trạng thái lịch hẹn, nhưng chưa mô tả riêng tình huống salon phải từ chối hoặc hủy lịch. | Đề nghị bổ sung trường hợp salon không thể phục vụ, chẳng hạn stylist nghỉ đột xuất; nên ghi nhận lý do hủy hoặc từ chối. | **Đề xuất làm rõ quy trình xử lý lịch hẹn.** Cần xác định điều kiện salon được từ chối hoặc hủy lịch, cách ghi nhận lý do và thông tin khách được xem. Nội dung này chưa được xem là một chức năng mới đã phê duyệt. |
| **7. Khách không đến hoặc lịch quá hạn** | Đề xuất các trạng thái cơ bản cho vòng đời lịch hẹn. | Chỉ ra trường hợp khách không đến hoặc lịch quá giờ nhưng chưa được cập nhật; đề nghị thêm trạng thái “Không đến”. | **Giữ các trạng thái cơ bản trong phạm vi ban đầu.** Ghi nhận trường hợp khách không đến là tình huống ngoại lệ cần có phương án xử lý; chưa tự bổ sung trạng thái mới khi chưa thống nhất quy tắc vận hành. |
| **8. Phân quyền và bảo vệ dữ liệu** | Phân quyền theo vai trò, kiểm tra quyền tại máy chủ và không cho chủ salon truy cập dữ liệu của salon khác. | Đề nghị làm rõ chủ salon chỉ được xem thông tin khách có lịch tại salon mình; cần bảo vệ dữ liệu cá nhân và hạn chế truy cập trái phép. | **Tiếp thu để cụ thể hóa yêu cầu bảo mật.** Mỗi chủ salon chỉ được quản lý dữ liệu thuộc salon mình; thông tin khách hàng được giới hạn theo nhu cầu xử lý lịch hẹn, không cho phép truy cập chéo giữa các salon. |
| **9. Thay đổi thông tin dịch vụ sau khi đặt lịch** | Lịch hẹn liên kết với salon, dịch vụ, stylist và thời gian thực hiện. | Cảnh báo thông tin lịch sử có thể sai lệch nếu salon thay đổi giá hoặc thời lượng dịch vụ sau khi khách đặt. | **Đề xuất tiếp thu nguyên tắc bảo toàn thông tin lịch hẹn.** Giá, tên dịch vụ và thời lượng áp dụng khi tạo lịch cần được lưu hoặc truy xuất ổn định. Phương án lưu trữ cụ thể được xác định ở bước thiết kế dữ liệu; không phát sinh nghiệp vụ thanh toán. |
| **10. Kiểm tra giờ khả dụng và chống trùng lịch** | Xác định giờ trống từ lịch làm việc, ngày nghỉ, thời lượng dịch vụ và các lịch đã được giữ chỗ; kiểm tra lại khi xác nhận. | Yêu cầu làm rõ bước thời gian, trạng thái giữ giờ và xử lý trường hợp nhiều khách đặt cùng lúc. | **Giữ yêu cầu kiểm tra khả năng phục vụ của stylist.** Việc xác nhận lịch phải kiểm tra toàn bộ khoảng thời gian và ngăn ghi nhận các lịch chồng lấn. Chưa ấn định bước thời gian cố định khi chưa có quy tắc thiết kế được thống nhất. |
| **11. Chính sách hủy lịch trước hai tiếng** | Khách được hủy lịch trước giờ bắt đầu tối thiểu hai tiếng; muốn đổi lịch phải hủy và đặt mới. | Đề nghị làm rõ trường hợp hủy đúng ranh giới hai tiếng và cách tính thời gian. | **Giữ chính sách đã xác định.** Yêu cầu hủy hợp lệ khi thời gian từ lúc yêu cầu đến giờ bắt đầu lớn hơn hoặc bằng hai tiếng và trạng thái lịch cho phép hủy. Thời gian được xử lý nhất quán theo múi giờ Việt Nam. |
| **12. Khả năng lập trình và kiểm thử** | Đề xuất yêu cầu về bảo mật, toàn vẹn lịch hẹn, hiệu năng và giao diện phù hợp thiết bị. | Nhận xét một số yêu cầu còn định tính, chưa có điều kiện và kết quả kiểm thử rõ ràng. | **Tiếp thu.** Khi đặc tả, các yêu cầu quan trọng cần có điều kiện đầu vào, thao tác và kết quả mong đợi. Các chỉ tiêu hiệu năng phải dựa trên môi trường và dữ liệu kiểm thử cụ thể, không tự đưa ra mức cam kết thiếu căn cứ. |

**Ghi chú:** Bảng tập trung vào những phản biện có ảnh hưởng trực tiếp đến phạm vi và nghiệp vụ cốt lõi. Các nhận xét khác của Claude vẫn được giữ trong phản hồi gốc. Những nội dung ghi “Đề xuất làm rõ” hoặc “Đề xuất tiếp thu” là phương án được đưa ra để nhóm xem xét trước khi chuyển thành yêu cầu triển khai chính thức.

## 3. Kết luận và định hướng lựa chọn

Kết quả cho thấy ChatGPT xác định được những nhóm yêu cầu chính phù hợp với mô hình SalonBook, trong khi Claude bổ sung góc nhìn phản biện về tính khả thi, trường hợp ngoại lệ, bảo vệ dữ liệu và khả năng kiểm thử.

Trên cơ sở mục tiêu kinh doanh và phạm vi đã xác định, định hướng lựa chọn là **giữ mô hình marketplace nhiều salon, quy trình đặt lịch theo stylist, chính sách hủy trước hai tiếng và các chức năng quản lý cốt lõi**. Những góp ý giúp làm rõ quy tắc nghiệp vụ và bảo mật được ghi nhận; các đề xuất làm thay đổi phạm vi hoặc tăng độ phức tạp chưa được tự động áp dụng.

Các kết luận này làm cơ sở cho bước đặc tả yêu cầu tiếp theo. Việc lựa chọn không dựa trên mức độ đồng tình giữa hai công cụ AI mà dựa trên tính phù hợp với vấn đề kinh doanh, khả năng thực hiện và sự thống nhất của nhóm.

