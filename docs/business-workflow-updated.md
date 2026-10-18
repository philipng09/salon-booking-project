# Quy trình nghiệp vụ đặt lịch SalonBook

**Phụ trách:** TV4 -- Workflow (Hân Văn)\
**Task:** 04.1 Quy trình đặt lịch · 04.2 Ngoại lệ & quy tắc · 04.3 Đối
chiếu REQUIREMENTS\
**Tài liệu liên quan:** `REQUIREMENTS.md`, `AGENTS.md`,
`BaiTap_Nhom_Chuong1.pdf`, `PHÁT TRIỂN ỨNG DỤNG TMDT.docx`\
**Trạng thái:** Đã cập nhật theo mô hình marketplace nhiều salon; các
điểm chưa khớp với F01--F07 được ghi rõ để TV3 xác nhận. Tài liệu này
**không tự sửa `REQUIREMENTS.md`**.

## 1. Mục tiêu, phạm vi và căn cứ

### 1.1. Bối cảnh nghiệp vụ

Theo mô tả đề tài, SalonBook là nền tảng trung gian (marketplace) kết
nối khách hàng với **nhiều salon/barbershop tại Thành phố Hồ Chí Minh**,
không phải website chỉ phục vụ một salon. Các dịch vụ dự kiến gồm cắt
tóc, uốn, nhuộm, gội đầu dưỡng sinh và phục hồi tóc.

Bản mô tả đề tài nêu các chức năng cốt lõi của phiên bản đầu tiên:

-   Khách hàng xem danh sách salon, tìm kiếm/lọc theo khu vực.
-   Khách hàng xem thông tin dịch vụ, đặt lịch và quản lý lịch sử đặt
    chỗ cá nhân.
-   Quản trị viên và chủ salon quản lý danh mục dịch vụ, cập nhật giá,
    theo dõi và xử lý trạng thái lịch hẹn trong ngày.
-   Thanh toán trực tuyến qua cổng điện tử là chức năng nâng cao, không
    đưa vào workflow MVP hiện tại.

Mô tả đề tài cũng đề cập việc so sánh salon theo giá, phong cách và
khoảng cách, cùng hình ảnh thực tế/đánh giá. Tuy nhiên, hình ảnh và đánh
giá chưa được liệt kê rõ trong danh sách chức năng MVP; cần nhóm xác
nhận trước khi coi là tiêu chí bắt buộc.

### 1.2. Cách dùng tài liệu

Tài liệu bài tập Chương 1 yêu cầu nhóm mô tả ít nhất một quy trình
nghiệp vụ chính bằng danh sách bước, sơ đồ đơn giản hoặc công cụ vẽ. Vì
vậy, tài liệu này mô tả luồng đặt lịch, dữ liệu đầu vào/đầu ra, ngoại lệ
và đối chiếu với mã chức năng hiện có.

`REQUIREMENTS.md` và `AGENTS.md` trong repository vẫn là căn cứ chức
năng hiện tại. Khi bản mô tả đề tài và F01--F07 chưa thống nhất, tài
liệu này **ghi nhận khoảng trống để TV3/nhóm quyết định**, không tự thêm
hoặc sửa yêu cầu đã duyệt.

### 1.3. Những điểm cần lưu ý trước khi triển khai

  -----------------------------------------------------------------------
  Nội dung trong mô tả đề Tình trạng trong        Cách xử lý trong tài
  tài                     F01--F07 hiện có        liệu này
  ----------------------- ----------------------- -----------------------
  Marketplace có nhiều    F01--F07 chưa thể hiện  Đưa bước chọn salon vào
  salon                   rõ mã salon trong luồng workflow; đề nghị TV3
                          đặt lịch                xác nhận trường
                                                  `salon_id` và phạm vi
                                                  dữ liệu

  Tìm kiếm/lọc salon theo Chưa có F-code riêng    Ghi là khoảng trống cần
  khu vực; so sánh giá,   thể hiện đầy đủ         đối chiếu, không tự gán
  phong cách, khoảng cách                         vào F01 nếu chưa thống
                                                  nhất

  Chủ salon quản lý dịch  F05/F06 hiện mô tả      Đề nghị xác định vai
  vụ, giá và lịch hẹn của quyền admin             trò chủ salon và giới
  salon mình                                      hạn dữ liệu theo salon

  Lịch sử đặt chỗ cá nhân F07 ghi đăng nhập/lịch  Đánh dấu mâu thuẫn cần
  thuộc chức năng MVP     sử là tùy chọn hoặc     TV3 xác nhận
                          giai đoạn sau; F04 yêu  
                          cầu tài khoản để tra    
                          cứu/hủy                 

  Hình ảnh và đánh giá    Được nhắc trong vấn đề  Chỉ đưa vào MVP sau khi
  salon                   kinh doanh/giá trị nền  nhóm xác nhận
                          tảng, nhưng không nêu   
                          rõ trong danh sách MVP  

  Thanh toán trực tuyến   Mô tả đề tài xếp vào    Không đưa vào workflow
                          chức năng nâng cao      bắt buộc hiện tại
  -----------------------------------------------------------------------

## 2. Tác nhân và trách nhiệm

  -----------------------------------------------------------------------
  Tác nhân                Trách nhiệm trong       Ghi chú về phạm vi
                          workflow                
  ----------------------- ----------------------- -----------------------
  Khách chưa đăng nhập    Xem danh sách salon,    F03 hiện cho phép gửi
                          tìm/lọc theo khu vực,   booking bằng họ tên và
                          xem dịch vụ/giá, chọn   số điện thoại; quyền
                          salon, dịch vụ, thợ và  tra cứu/hủy cần đối
                          giờ, gửi yêu cầu đặt    chiếu F04
                          lịch                    

  Khách hàng có tài khoản Thực hiện các thao tác  Mô tả đề tài coi lịch
                          của khách; xem lịch sử  sử cá nhân là MVP nhưng
                          và tra cứu/hủy lịch của F07 hiện ghi tùy
                          chính mình theo quyền   chọn/giai đoạn sau
                          được duyệt              

  Chủ salon / quản lý     Quản lý danh mục dịch   Vai trò này có trong mô
  salon                   vụ, giá và theo dõi/xử  tả đề tài nhưng chưa
                          lý lịch hẹn thuộc salon được F05/F06 phân quyền
                          của mình                rõ

  Stylist / thợ           Thực hiện dịch vụ và    Các nhãn trạng thái
                          cập nhật trạng thái     dành cho stylist cần
                          lịch theo quyền được    đồng bộ với F06
                          thống nhất              

  Quản trị viên nền tảng  Quản lý hoạt động theo  Cần phân biệt quyền
                          phạm vi được phân       quản trị toàn nền tảng
                          quyền; hỗ trợ quản lý   với quyền chủ salon
                          dịch vụ/lịch hẹn nếu    
                          yêu cầu được duyệt      

  Frontend / website      Hiển thị salon, dịch    Không tự quyết định
                          vụ, lựa chọn lịch; nhận cuối cùng rằng slot còn
                          thông tin khách; hiển   trống
                          thị kết quả hoặc lỗi    

  Backend / hệ thống đặt  Kiểm tra dữ liệu, liên  Phải kiểm tra lại khi
  lịch                    kết salon--dịch         khách gửi yêu cầu,
                          vụ--stylist, thời       không chỉ dựa vào dữ
                          lượng, lịch làm và xung liệu frontend
                          đột; lưu booking hợp lệ 
  -----------------------------------------------------------------------

## 3. 04.1 --- Quy trình đặt lịch chính

**Luồng tổng quát:** Truy cập website → xem danh sách salon → tìm/lọc
theo khu vực → xem và chọn salon → chọn dịch vụ → chọn ngày → xem
thợ/khung giờ trống → nhập thông tin và xác nhận → backend kiểm tra lần
cuối → lưu lịch và trả mã lịch hẹn → salon xử lý lịch → khách theo dõi
lịch sử.

  --------------------------------------------------------------------------
  Bước           Người thực     Dữ liệu đầu    Xử lý của hệ   Kết quả đầu ra
                 hiện           vào / hành     thống          
                                động                          
  -------------- -------------- -------------- -------------- --------------
  1\. Truy cập   Khách          Mở website     Hiển thị danh  Danh sách
  và xem danh                                  sách salon có  salon có thể
  sách salon                                   trong hệ thống khám phá
                                               và thông tin   
                                               cơ bản đã được 
                                               duyệt để công  
                                               khai           

  2\. Tìm        Khách          Chọn khu vực   Lọc salon theo Danh sách
  kiếm/lọc salon                hoặc tiêu chí  dữ liệu khu    salon phù hợp
                                tìm kiếm được  vực đã lưu;    hoặc thông báo
                                hỗ trợ         nếu không có   không có kết
                                               kết quả thì    quả
                                               hiển thị trạng 
                                               thái rỗng và   
                                               cho phép đổi   
                                               tiêu chí       

  3\. Xem và so  Khách          Mở trang chi   Hiển thị thông Khách có đủ
  sánh salon                    tiết salon;    tin salon,     thông tin để
                                xem dịch vụ và dịch vụ, giá   chọn salon
                                bảng giá       và vị trí theo theo phạm vi
                                               dữ liệu có     chức năng đã
                                               sẵn. Ảnh/đánh  thống nhất
                                               giá chỉ là bắt 
                                               buộc nếu nhóm  
                                               xác nhận đưa   
                                               vào MVP        

  4\. Chọn salon Khách          Chọn một salon Lưu ngữ cảnh   `salon_id`
                                cụ thể         salon đã chọn  hoặc định danh
                                               cho các bước   salon tương
                                               tiếp theo      ứng được xác
                                                              định cho
                                                              booking

  5\. Chọn dịch  Khách          Chọn dịch vụ   Kiểm tra dịch  Dịch vụ được
  vụ                            tại salon đã   vụ thuộc salon chọn, có thời
                                chọn           đang chọn và   lượng dùng để
                                               có thể đặt;    tính giờ kết
                                               lấy giá/thời   thúc
                                               lượng từ dữ    
                                               liệu hệ thống  

  6\. Chọn ngày  Khách          Chọn ngày muốn Tiếp nhận ngày Ngày được chọn
                                đến salon      yêu cầu và tải 
                                               dữ liệu lịch   
                                               làm/khả năng   
                                               phục vụ liên   
                                               quan đến       
                                               salon, dịch vụ 
                                               và thợ         

  7\. Xem thợ và Hệ thống, sau  Hệ thống truy  Theo F02, chỉ  Stylist, giờ
  giờ trống      đó khách       xuất lựa chọn  hiển thị/cho   bắt đầu và giờ
                                khả dụng;      chọn slot phù  kết thúc dự
                                khách chọn     hợp. Phải xét  kiến
                                stylist và giờ thời lượng     
                                bắt đầu        dịch vụ, lịch  
                                               hiện có và     
                                               lịch làm liên  
                                               quan           

  8\. Nhập thông Khách          Nhập họ tên,   Kiểm tra       Yêu cầu hợp lệ
  tin và xác                    số điện thoại; trường bắt     hoặc thông báo
  nhận                          kiểm tra       buộc, định     lỗi để khách
                                salon, dịch    dạng dữ liệu   sửa
                                vụ, thợ, ngày  và tính hợp lệ 
                                giờ rồi gửi    của lựa chọn.  
                                yêu cầu theo   Không yêu cầu  
                                F03            tài khoản để   
                                               gửi booking    
                                               nếu F07 vẫn là 
                                               tùy chọn       

  9\. Kiểm tra   Backend        Nhận yêu cầu   Đọc lại salon, Chấp nhận yêu
  khả dụng lần                  đặt lịch       dịch vụ,       cầu hoặc trả
  cuối                                         stylist, thời  lỗi cụ thể
                                               lượng, lịch    
                                               làm và lịch    
                                               hẹn đã lưu;    
                                               kiểm tra quan  
                                               hệ giữa các mã 
                                               và khoảng thời 
                                               gian có bị     
                                               xung đột không 

  10\. Lưu lịch  Backend / cơ   Yêu cầu đã     Lưu thông tin  Bản ghi lịch
  hẹn            sở dữ liệu     vượt qua mọi   salon, dịch    hẹn hợp lệ và
                                kiểm tra       vụ, stylist,   mã lịch hẹn
                                               khách, ngày    
                                               giờ, trạng     
                                               thái và thời   
                                               điểm tạo theo  
                                               mô hình dữ     
                                               liệu được      
                                               duyệt          

  11\. Trả kết   Website        Nhận kết quả   Nếu lưu thành  Khách biết
  quả đặt lịch                  từ backend     công, hiển thị lịch đã được
                                               mã lịch hẹn và ghi nhận hay
                                               trạng thái;    cần chọn giờ
                                               nếu thất bại,  khác
                                               không hiển thị 
                                               thông báo      
                                               thành công     

  12\. Tiếp nhận Chủ salon/nhân Xem lịch theo  Cập nhật trạng Trạng thái mới
  và xử lý lịch  viên/admin có  ngày/trạng     thái theo F06  được lưu
                 quyền          thái và xử lý  và quyền đã    
                                lịch thuộc     thống nhất;    
                                phạm vi được   không tạo lịch 
                                phân quyền     trùng cho cùng 
                                               stylist        

  13\. Xem lịch  Khách hàng     Mở lịch sử     Lịch sử cá     Hiển thị lịch
  sử / tra cứu /                hoặc chọn lịch nhân là chức   sử/trạng thái;
  hủy                           cần tra        năng MVP theo  nếu hủy hợp lệ
                                cứu/hủy        mô tả đề tài,  thì slot được
                                               nhưng cách     mở lại
                                               truy cập phải  
                                               được TV3 xác   
                                               nhận do        
                                               F07/F04 chưa   
                                               thống nhất.    
                                               Nếu áp dụng    
                                               F04, chỉ chủ   
                                               lịch đã đăng   
                                               nhập được tra  
                                               cứu/hủy và chỉ 
                                               hủy trước giờ  
                                               hẹn ít nhất 2  
                                               giờ            
  --------------------------------------------------------------------------

### 3.1. Dữ liệu đầu vào và đầu ra

  -----------------------------------------------------------------------
  Nhóm dữ liệu            Đầu vào                 Đầu ra / dữ liệu được
                                                  lưu
  ----------------------- ----------------------- -----------------------
  Salon                   Định danh salon được    Salon gắn với booking;
                          khách chọn              cần xác nhận trường
                                                  `salon_id` trong yêu
                                                  cầu và mô hình dữ liệu

  Dịch vụ                 Mã dịch vụ do khách     Tên dịch vụ, giá và
                          chọn                    thời lượng lấy từ dữ
                                                  liệu hệ thống; dịch vụ
                                                  phải thuộc salon đã
                                                  chọn

  Stylist                 Mã thợ do khách chọn    Stylist được phân công;
                                                  cần thuộc salon phù hợp
                                                  và khả dụng trong toàn
                                                  bộ thời gian phục vụ

  Lịch                    Ngày, giờ bắt đầu mong  Giờ kết thúc tính từ
                          muốn                    thời lượng dịch vụ; kết
                                                  quả kiểm tra khả dụng

  Khách                   Họ tên, số điện thoại;  Thông tin liên hệ cần
                          tài khoản nếu khách đã  thiết và liên kết tài
                          đăng nhập               khoản nếu có; chỉ lưu
                                                  dữ liệu cần cho nghiệp
                                                  vụ

  Booking                 Salon + dịch vụ +       Mã lịch hẹn, dữ liệu
                          stylist + ngày/giờ +    lịch đã lưu, trạng thái
                          thông tin khách         và thời điểm tạo

  Lỗi                     Thiếu/sai dữ liệu, dịch Thông báo cụ thể; không
                          vụ không thuộc salon,   tạo bản ghi thành công
                          slot hết chỗ hoặc lỗi   nếu kiểm tra thất bại
                          lưu                     
  -----------------------------------------------------------------------

### 3.2. Quy tắc kiểm tra trùng lịch

-   Tính giờ kết thúc từ thời lượng dịch vụ đang lưu trong hệ thống;
    không tin thời lượng do trình duyệt tự gửi.
-   Hai lịch của cùng stylist bị xem là trùng nếu khoảng thời gian giao
    nhau: **giờ bắt đầu yêu cầu \< giờ kết thúc lịch hiện có** và **giờ
    kết thúc yêu cầu \> giờ bắt đầu lịch hiện có**.
-   Phải xác nhận stylist và dịch vụ thuộc đúng salon trong booking;
    không chấp nhận tổ hợp mã salon/dịch vụ/stylist không hợp lệ.
-   Hai lịch của cùng stylist không được giao nhau. Nếu khác stylist thì
    vẫn phải kiểm tra các điều kiện khác trước khi cho đặt.
-   Backend phải kiểm tra lại ngay lúc gửi/lưu lịch. Nếu hai khách gửi
    yêu cầu gần như đồng thời cho cùng slot, chỉ một yêu cầu được lưu;
    yêu cầu còn lại nhận thông báo slot không còn trống.
-   Khi hủy hợp lệ theo F04, trạng thái phải đổi sang nhãn hủy đã thống
    nhất và khung giờ được mở lại.
-   Không tự đặt thêm thời gian đệm, bước nhảy slot hoặc giờ đóng cửa cụ
    thể nếu nhóm chưa định nghĩa trong yêu cầu/cấu hình.

## 4. 04.2 --- Ngoại lệ và quy tắc nghiệp vụ

  -----------------------------------------------------------------------
  Tình huống        Điều kiện         Hệ thống xử lý    Trạng thái / kết
                                                        quả
  ----------------- ----------------- ----------------- -----------------
  Không tìm thấy    Bộ lọc không trả  Hiển thị thông    Không tạo booking
  salon theo khu    về kết quả        báo không có      
  vực                                 salon phù hợp và  
                                      cho phép đổi bộ   
                                      lọc               

  Salon/dịch vụ     Mã salon hoặc     Từ chối yêu cầu   Không tạo booking
  không hợp lệ      dịch vụ không tồn và yêu cầu khách  
                    tại; dịch vụ      chọn lại từ dữ    
                    không thuộc salon liệu hợp lệ       
                    đã chọn                             

  Thiếu họ tên hoặc Trường bắt buộc   Hiển thị trường   Không tạo lịch
  số điện thoại     bị bỏ trống hoặc  cần sửa; kiểm tra 
                    dữ liệu không hợp định dạng dữ      
                    lệ                liệu. Không       
                                      gửi/lưu booking   

  Stylist không     Mã stylist không  Từ chối tổ hợp dữ Không tạo booking
  thuộc salon đã    liên kết với      liệu; tải lại     
  chọn              salon trong yêu   stylist phù hợp   
                    cầu                                 

  Thợ/slot không    Thợ không làm     Cập nhật danh     Không tạo lịch
  khả dụng          ngày đó hoặc slot sách thợ/giờ      mới
                    đã có lịch        trống theo F02;   
                                      yêu cầu chọn slot 
                                      khác              

  Thời lượng dịch   Giờ bắt đầu còn   Từ chối slot;     Không tạo lịch
  vụ gây giao nhau  trống nhưng giờ   kiểm tra theo     mới
                    kết thúc tính     toàn bộ khoảng    
                    theo thời lượng   thời gian, không  
                    chồng lên lịch    chỉ giờ bắt đầu   
                    khác của cùng thợ                   

  Ngoài thời gian   Slot không nằm    Không hiển thị    Không tạo lịch
  làm việc          trong lịch làm    hoặc vô hiệu hóa  mới
                    hợp lệ của        slot. Cần TV3 xác 
                    salon/thợ         nhận cách cấu     
                                      hình giờ làm/ngày 
                                      nghỉ vì F01--F07  
                                      chưa nêu rõ chức  
                                      năng quản lý lịch 
                                      làm               

  Hai khách gửi     Slot có thể đã bị Backend kiểm tra  Chỉ một lịch được
  cùng slot gần như đặt sau lần hiển  lại và bảo đảm    lưu
  đồng thời         thị lịch trống    chỉ một booking   
                                      được lưu cho      
                                      khoảng thời gian  
                                      xung đột          

  Chủ salon truy    Tài khoản chủ     Từ chối truy cập. Không lộ dữ liệu
  cập lịch của      salon không có    Đây là nguyên tắc salon khác
  salon khác        quyền với salon   phân quyền đề     
                    trong yêu cầu     xuất cho          
                                      marketplace, cần  
                                      nhóm xác nhận     
                                      trong ma trận     
                                      quyền             

  Khách hủy trước   Khách đã đăng     Xác minh quyền sở Hủy thành công;
  giờ hẹn ít nhất 2 nhập, lịch thuộc  hữu và thời điểm  slot khả dụng lại
  giờ               về chính khách đó hẹn; cập nhật     
                    và còn đủ thời    trạng thái hủy,   
                    gian theo F04     mở lại slot       

  Khách hủy khi còn Không đáp ứng     Từ chối hủy theo  Giữ nguyên trạng
  dưới 2 giờ        điều kiện tối     quy tắc hiện tại  thái
                    thiểu 2 giờ của   và hiển thị lý    
                    F04               do; không đổi dữ  
                                      liệu lịch         

  Khách chưa đăng   Mô tả đề tài yêu  Không tự thêm     Áp dụng quy tắc
  nhập muốn xem     cầu lịch sử cá    cách tra cứu bằng sau khi nhóm
  lịch sử/tra       nhân trong MVP,   mã lịch hẹn.      thống nhất
  cứu/hủy           nhưng F04 yêu cầu Chuyển mâu thuẫn  
                    tài khoản và F07  cho TV3 xác nhận  
                    để đăng nhập/lịch                   
                    sử ở giai đoạn                      
                    sau                                 

  Hủy lặp hoặc hủy  Lịch đã ở trạng   Không xử lý       Trạng thái cũ
  lịch đã hoàn tất  thái hủy hoặc     chuyển trạng thái không đổi
                    hoàn tất          lần nữa; hiển thị 
                                      trạng thái hiện   
                                      tại               

  Cập nhật trạng    Vai trò không có  Từ chối cập nhật  Trạng thái không
  thái trái         quyền hoặc chuyển và giữ dữ liệu    đổi
  quyền/sai thứ tự  từ trạng thái     hiện tại          
                    không hợp lệ                        

  Lỗi máy chủ/cơ sở Không thể lưu an  Báo lỗi, không    Không có lịch mới
  dữ liệu           toàn              thông báo đặt     hoặc không có
                                      thành công; tránh thay đổi trạng
                                      để lại bản ghi    thái
                                      một phần          
  -----------------------------------------------------------------------

## 5. Trạng thái lịch hẹn

`REQUIREMENTS.md` dùng các nhãn trong F06: **Chờ duyệt, Đã xếp chỗ, Hoàn
tất, Hủy**. F04 lại dùng **Đã hủy**; bảng vai trò cho stylist có **Đang
phục vụ, Hoàn thành**. Bản mô tả đề tài cũng nói chủ salon theo dõi và
xử lý trạng thái lịch, nhưng chưa nêu bộ trạng thái cụ thể. Vì vậy, bảng
dưới đây ghi nhận các nhãn hiện có và đánh dấu điểm cần TV3 chuẩn hóa,
không tự sửa `REQUIREMENTS.md`.

  -----------------------------------------------------------------------
  Trạng thái/nhãn   Ý nghĩa nghiệp vụ Chuyển tiếp dự    Ghi chú
  trong tài liệu                      kiến              
  hiện tại                                              
  ----------------- ----------------- ----------------- -----------------
  Chờ duyệt         Booking đã được   Đã xếp chỗ hoặc   Trạng thái khởi
                    ghi nhận, chờ     Hủy/Đã hủy nếu    tạo đề xuất; TV3
                    salon xử lý/phê   hủy được phép     xác nhận
                    duyệt                               

  Đã xếp chỗ        Salon đã chấp     Đang phục vụ,     Cần thống nhất
                    nhận/điều phối    hoặc Hủy/Đã hủy   xem nhãn này
                    lịch              nếu đáp ứng quy   tương đương "Đã
                                      tắc hủy           xác nhận" hay
                                                        không

  Đang phục vụ      Stylist đang thực Hoàn tất/Hoàn     Có trong quyền
                    hiện dịch vụ      thành             của stylist nhưng
                                                        chưa có trong
                                                        danh sách trạng
                                                        thái F06

  Hoàn tất / Hoàn   Dịch vụ đã hoàn   Không chuyển tiếp F06 ghi "Hoàn
  thành             thành             trong luồng thông tất", bảng vai
                                      thường            trò ghi "Hoàn
                                                        thành"; cần chọn
                                                        một nhãn chuẩn

  Hủy / Đã hủy      Booking đã bị hủy Không chuyển tiếp F06 ghi "Hủy",
                                      trong luồng thông F04 ghi "Đã hủy";
                                      thường            cần chọn một nhãn
                                                        chuẩn
  -----------------------------------------------------------------------

**Nguyên tắc:** Chỉ vai trò được cấp quyền mới được cập nhật trạng thái.
Không đánh dấu hoàn tất trước khi dịch vụ kết thúc. Lịch hủy/hoàn tất
không được chuyển ngược bằng cập nhật thông thường. Không thêm trạng
thái "Từ chối", "Đã thanh toán" hoặc trạng thái khác khi chưa có quyết
định của nhóm.

## 6. 04.3 --- Đối chiếu workflow với F-code của TV3

  -----------------------------------------------------------------------
  Bước / nghiệp vụ  F-code            Mức độ khớp       Ghi chú kiểm tra
  ----------------- ----------------- ----------------- -----------------
  Xem danh sách     Chưa có F-code    **Thiếu / cần xác Đây là chức năng
  salon, tìm/lọc    riêng rõ ràng     nhận**            MVP trong mô tả
  theo khu vực                                          đề tài nhưng
                                                        F01--F07 chưa thể
                                                        hiện rõ

  Xem/so sánh salon F01 chỉ mô tả xem **Khớp một phần** Cần xác nhận phạm
  theo giá, phong   dịch vụ, mô tả và                   vi so sánh; ảnh
  cách, khoảng cách giá                                 và đánh giá được
                                                        nhắc trong mô tả
                                                        kinh doanh nhưng
                                                        chưa rõ có bắt
                                                        buộc ở MVP hay
                                                        không

  Xem dịch vụ, mô   F01               **Khớp một phần** F01 phù hợp với
  tả và giá                                             thông tin dịch vụ
                                                        nhưng cần làm rõ
                                                        dịch vụ thuộc
                                                        salon nào và giá
                                                        nào được hiển thị

  Chọn ngày, xem    F02               **Khớp một phần** Cần giữ ngữ cảnh
  thợ và slot còn                                       salon; xét thời
  trống                                                 lượng dịch vụ và
                                                        lịch hiện có theo
                                                        `AGENTS.md`; cách
                                                        quản lý lịch
                                                        làm/ngày nghỉ
                                                        chưa rõ

  Gửi yêu cầu với   F03               **Khớp một phần** Luồng tạo booking
  họ tên, SĐT, dịch                                     phù hợp, nhưng mô
  vụ, thợ và giờ;                                       hình marketplace
  trả mã lịch hẹn                                       cần xác nhận
                                                        `salon_id` và
                                                        kiểm tra dịch
                                                        vụ/stylist thuộc
                                                        salon đã chọn

  Tra cứu/hủy lịch  F04               **Có quy tắc      F04 giới hạn ở
  cá nhân; hủy                        nhưng mâu thuẫn   khách có tài
  trước ít nhất 2                     phạm vi**         khoản; mô tả đề
  giờ; mở lại slot                                      tài yêu cầu lịch
                                                        sử đặt chỗ trong
                                                        MVP, trong khi
                                                        F07 để đăng
                                                        nhập/lịch sử là
                                                        tùy chọn/giai
                                                        đoạn sau

  Admin             F05               **Khớp một phần** Mô tả đề tài yêu
  thêm/sửa/tạm ẩn                                       cầu chủ salon
  dịch vụ                                               cũng quản lý danh
                                                        mục và giá. Cần
                                                        phân quyền chủ
                                                        salon với admin
                                                        nền tảng và giới
                                                        hạn dữ liệu theo
                                                        salon

  Admin xem lịch    F06               **Khớp một phần** Quy tắc chống
  theo ngày/trạng                                       trùng được thể
  thái; cập nhật                                        hiện; cần bổ
  trạng thái; chống                                     sung/đối chiếu
  trùng lịch                                            quyền chủ salon,
                                                        phạm vi lịch của
                                                        từng salon và
                                                        chuẩn hóa trạng
                                                        thái

  Đăng ký/đăng      F07               **Mâu thuẫn với   F07 ghi tùy
  nhập, lưu lịch sử                   MVP**             chọn/giai đoạn
                                                        sau nhưng mô tả
                                                        đề tài liệt kê
                                                        lịch sử đặt chỗ
                                                        cá nhân trong
                                                        chức năng bắt
                                                        buộc của phiên
                                                        bản đầu

  Quản lý lịch      Chưa có F-code    **Cần TV3 xác     F02 cần dữ liệu
  làm/ngày nghỉ của riêng rõ ràng     nhận**            lịch làm để tính
  salon và stylist                                      slot trống; cần
                                                        xác định ai quản
                                                        lý và qua chức
                                                        năng nào

  Quản lý hình      Chưa có F-code    **Cần xác nhận    Được nhắc trong
  ảnh/đánh giá      riêng rõ ràng     phạm vi**         vấn đề kinh
  salon                                                 doanh/giải pháp
                                                        nhưng chưa có
                                                        trong danh sách
                                                        MVP; không tự
                                                        thêm vào phạm vi

  Thanh toán trực   Ngoài phạm vi bắt **Không đưa vào   Chỉ xem xét ở
  tuyến             buộc theo mô tả   MVP**             giai đoạn sau nếu
                    đề tài                              nhóm thống nhất
  -----------------------------------------------------------------------

### 6.1. Các câu hỏi/phản hồi gửi TV3 --- không tự sửa REQUIREMENTS

1.  **Xác nhận mô hình marketplace:** SalonBook là nền tảng nhiều salon
    tại TP.HCM. F01--F07 có cần bổ sung luồng danh sách salon và lọc
    theo khu vực không?
2.  **Dữ liệu booking:** F03 hiện chưa nêu rõ `salon_id`. Mỗi booking có
    cần lưu salon và kiểm tra dịch vụ/stylist thuộc salon đó không?
3.  **Tìm kiếm và so sánh:** Phạm vi MVP có bao gồm lọc salon theo khu
    vực, so sánh giá/phong cách/khoảng cách không? Hình ảnh và đánh giá
    là bắt buộc hay để giai đoạn sau?
4.  **Vai trò chủ salon:** Chủ salon có được quản lý dịch vụ, giá và
    lịch hẹn của salon mình không? Admin nền tảng có quyền khác gì? Có
    cần giới hạn chủ salon chỉ xem dữ liệu của salon được phân công
    không?
5.  **Lịch sử và tài khoản:** Mô tả đề tài ghi lịch sử đặt chỗ là MVP,
    nhưng F07 để đăng nhập/lịch sử ở giai đoạn sau. Cần chốt lịch sử có
    bắt buộc ở phiên bản đầu không và khách đặt nhanh sẽ tra cứu/hủy như
    thế nào.
6.  **Chuẩn hóa trạng thái:** F06 liệt kê "Chờ duyệt, Đã xếp chỗ, Hoàn
    tất, Hủy"; bảng vai trò có "Đang phục vụ, Hoàn thành"; F04 có "Đã
    hủy". Hãy xác nhận bộ trạng thái chính thức và các chuyển tiếp hợp
    lệ.
7.  **Lịch làm/ngày nghỉ:** Ai quản lý giờ làm, ngày nghỉ và lịch
    stylist? Chức năng này thuộc F02, F06 hay cần F-code riêng?
8.  **Đổi lịch:** Bảng vai trò hiện tại có đề cập khách có thể chỉnh sửa
    lịch cá nhân, nhưng F04 chỉ mô tả tra cứu và hủy. Xác nhận đổi lịch
    có nằm trong phạm vi hay không.
9.  **Phạm vi triển khai:** Xác nhận thanh toán trực tuyến vẫn ở giai
    đoạn sau theo mô tả đề tài, không phải tiêu chí nghiệm thu MVP.

## 7. Checklist nghiệm thu task

### 04.1 --- Quy trình đặt lịch

-   [x] Có luồng chính từ khám phá salon đến đặt lịch và theo dõi trạng
    thái.
-   [x] Thể hiện bước tìm/lọc salon theo khu vực phù hợp với mô hình
    marketplace.
-   [x] Xác định đầu vào/đầu ra, bao gồm salon, dịch vụ, stylist, ngày
    giờ và thông tin khách.
-   [x] Có kiểm tra khả dụng lần cuối ở backend và trả mã lịch hẹn.
-   [ ] TV3 xác nhận cách lưu `salon_id`, quyền chủ salon và cách xử lý
    lịch sử cá nhân.

### 04.2 --- Ngoại lệ và quy tắc

-   [x] Có bảng tình huống -- điều kiện -- xử lý -- kết quả.
-   [x] Có quy tắc chống trùng theo toàn bộ thời lượng dịch vụ.
-   [x] Có kiểm tra quan hệ salon--dịch vụ--stylist.
-   [x] Có quy tắc hủy trước ít nhất 2 giờ và mở lại slot theo F04.
-   [ ] TV3 xác nhận tên trạng thái, lịch làm và quyền chuyển trạng
    thái.

### 04.3 --- Kiểm tra ăn khớp

-   [x] Đối chiếu workflow với F01--F07 trong `REQUIREMENTS.md`.
-   [x] So sánh với mô tả đề tài marketplace trong tài liệu nhóm.
-   [x] Ghi rõ điểm khớp, khớp một phần và khoảng trống; không tự sửa
    `REQUIREMENTS.md`.
-   [x] Soạn danh sách câu hỏi/phản hồi cho TV3.
-   [ ] Hoàn tất sau khi TV3/nhóm quyết định các điểm mâu thuẫn.

## 8. Ghi chú nguồn

-   `BaiTap_Nhom_Chuong1.pdf`: yêu cầu mô tả ít nhất một quy trình
    nghiệp vụ chính và nêu các sản phẩm/tài liệu cần nộp sau buổi 1.
-   `PHÁT TRIỂN ỨNG DỤNG TMDT.docx`: mô tả SalonBook theo mô hình
    marketplace nhiều salon tại TP.HCM; nêu chức năng MVP, đối tượng sử
    dụng, vấn đề kinh doanh và công nghệ dự kiến.
-   `REQUIREMENTS.md` và `AGENTS.md` trong repository: căn cứ đối chiếu
    mã F01--F07, quy tắc thời lượng dịch vụ và chống trùng lịch.

Những nội dung ghi "Cần TV3 xác nhận" là các điểm chưa thống nhất giữa
mô tả đề tài và yêu cầu hiện tại, không phải quyết định tự thay đổi phạm
vi của TV4.
