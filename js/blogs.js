/**
 * NGUỒN DỮ LIỆU CỘNG ĐỒNG SALONBOOK (kiểu Threads) - DÙNG CHUNG
 * Dùng cho: blog.html (bảng tin) và blog-detail.html?id=... (xem 1 thread)
 * Phụ trách: Nhật Phi
 *
 * Cấu trúc 1 bài (thread):
 *  id        : số nguyên duy nhất → dùng trên URL blog-detail.html?id=...
 *  author    : { name, handle, avatar?, type: "official" | "salon" | "user" }
 *  title     : tiêu đề (tuỳ chọn – bài dài của SalonBook/salon)
 *  content   : nội dung; xuống dòng = đoạn mới; hỗ trợ #hashtag
 *  image     : ảnh đính kèm (tuỳ chọn)
 *  topic     : chủ đề (khớp THREAD_TOPICS)
 *  createdAt : thời điểm đăng (ISO)
 *  likes     : số lượt thích có sẵn (dữ liệu mẫu)
 *  salonId   : (tuỳ chọn) gắn salon trong products.js → nút đặt lịch
 *  replies   : các trả lời mẫu { id, author, content, createdAt, likes }
 *
 * Lượt thích / trả lời / bài mới của người dùng được lưu ở localStorage
 * (xem js/blog-store.js), KHÔNG sửa trực tiếp mảng blogs này.
 */
const THREAD_TOPICS = ["Xu hướng tóc", "Chăm sóc tóc", "Review salon", "Mẹo đặt lịch", "Hỏi đáp"];

const OFFICIAL = { name: "SalonBook", handle: "salonbook", avatar: "images/salonbook-mark.png", type: "official" };

const blogs = [
  {
    id: 1,
    author: OFFICIAL,
    title: "Tóc layer Hàn Quốc 2026: 5 kiểu hợp gương mặt tròn",
    content: "Layer tạo độ bồng tự nhiên, tầng ngắn nhất rơi quanh gò má giúp mặt tròn trông gọn hơn.\nGợi ý nhanh: layer bob ngang cằm · wavy lob chấm vai · soft layer dài · layer + mái thưa · butterfly layer.\nBạn đang để kiểu nào? Comment ảnh tóc hiện tại để mọi người góp ý nhé 👇 #layer #matron",
    image: "images/service-cut.png",
    topic: "Xu hướng tóc",
    createdAt: "2026-11-20T09:15:00+07:00",
    likes: 128,
    salonId: 1,
    replies: [
      { id: "r1-1", author: { name: "Thu Hằng", handle: "thuhang.hcm", type: "user" }, content: "Mặt mình tròn mà tóc mỏng thì nên layer bob hay wavy lob ạ?", createdAt: "2026-11-20T10:02:00+07:00", likes: 6 },
      { id: "r1-2", author: OFFICIAL, content: "@thuhang.hcm tóc mỏng nên thử layer bob ngang cằm, tóc sẽ dày hơn khi nhìn. Bạn có thể thử trước ở trang Tư vấn nha!", createdAt: "2026-11-20T10:20:00+07:00", likes: 9 }
    ]
  },
  {
    id: 2,
    author: { name: "JUNO HAIR STUDIO", handle: "junohair.q10", avatar: "images/salon-02.jpg", type: "salon" },
    content: "Tone nâu trà sữa không cần tẩy đang được khách văn phòng đặt nhiều nhất tháng này ☕\nTóc đen tự nhiên lên màu đẹp, ít hư tổn, giữ màu 6–8 tuần. #nhuomtoc #khongtay",
    image: "images/service-color.png",
    topic: "Xu hướng tóc",
    createdAt: "2026-11-19T18:40:00+07:00",
    likes: 214,
    salonId: 2,
    replies: [
      { id: "r2-1", author: { name: "Minh Phương", handle: "phuong.vu", type: "user" }, content: "Mình làm ở đây tuần trước, màu lên đúng như ảnh luôn 😍", createdAt: "2026-11-19T20:11:00+07:00", likes: 12 }
    ]
  },
  {
    id: 3,
    author: { name: "Lê Hoàng Chí", handle: "hoangchi", type: "user" },
    title: "Review: một buổi nhuộm tại JUNO, Quận 10",
    content: "Đặt lịch qua SalonBook khung 14:00 thứ Bảy, tới nơi là được làm luôn, không phải chờ.\nStylist hỏi kỹ lần nhuộm gần nhất rồi mới pha màu, thử trên 1 lọn trước. Tổng thời gian khoảng 2 tiếng.\nĐiểm trừ duy nhất: cuối tuần hơi đông, nên đặt trước 2 ngày. #review #quan10",
    image: "images/salon-02.jpg",
    topic: "Review salon",
    createdAt: "2026-11-18T21:05:00+07:00",
    likes: 87,
    salonId: 2,
    replies: [
      { id: "r3-1", author: { name: "JUNO HAIR STUDIO", handle: "junohair.q10", avatar: "images/salon-02.jpg", type: "salon" }, content: "Cảm ơn bạn đã ghé Juno! Lần sau đặt khung sáng sẽ vắng hơn nha 💛", createdAt: "2026-11-18T22:30:00+07:00", likes: 5 }
    ]
  },
  {
    id: 4,
    author: OFFICIAL,
    title: "Đặt lịch cuối tuần không phải chờ: 4 mẹo nhỏ",
    content: "1. Đặt trước ít nhất 2 ngày.\n2. Ưu tiên khung giờ buổi sáng.\n3. Chọn đúng stylist để salon xếp thời gian chính xác.\n4. Ghi chú kiểu tóc + ảnh tham khảo để rút ngắn phần tư vấn. #meodatlich",
    image: "images/salon-05.png",
    topic: "Mẹo đặt lịch",
    createdAt: "2026-11-17T08:00:00+07:00",
    likes: 156,
    replies: []
  },
  {
    id: 5,
    author: { name: "Ngọc Trâm", handle: "tram.ng", type: "user" },
    content: "Mọi người ơi tóc mình vừa uốn xong 1 tuần mà khô xơ quá, nên hấp dầu ngay hay đợi thêm ạ? 🥲 #hoidap #phuchoitoc",
    topic: "Hỏi đáp",
    createdAt: "2026-11-20T22:47:00+07:00",
    likes: 23,
    replies: [
      { id: "r5-1", author: { name: "Khánh Hair", handle: "khanhhair", avatar: "images/salon-03.jpg", type: "salon" }, content: "Hấp dầu nhẹ được bạn nhé, chỉ nên chờ ít nhất 2 tuần mới làm hoá chất tiếp. Tránh sấy nóng mấy ngày đầu.", createdAt: "2026-11-20T23:10:00+07:00", likes: 15 },
      { id: "r5-2", author: { name: "Duy Phạm", handle: "duypham", type: "user" }, content: "Mình dùng thêm dầu dưỡng đuôi tóc thấy đỡ nhiều.", createdAt: "2026-11-21T07:30:00+07:00", likes: 3 }
    ]
  },
  {
    id: 6,
    author: OFFICIAL,
    title: "Phục hồi tóc sau uốn nhuộm: bắt đầu từ đâu?",
    content: "Nhẹ: ngọn hơi khô → hấp dầu định kỳ.\nTrung bình: tóc xơ, khó vào nếp → liệu trình phục hồi tại salon.\nNặng: gãy khi chải ướt → cắt bớt phần ngọn hỏng trước khi phục hồi. #phuchoitoc",
    image: "images/service-care.png",
    topic: "Chăm sóc tóc",
    createdAt: "2026-11-15T09:30:00+07:00",
    likes: 98,
    replies: []
  },
  {
    id: 7,
    author: { name: "DOTH HAIR", handle: "dothhair", avatar: "images/salon-06.png", type: "salon" },
    content: "Gội dưỡng sinh 60 phút sau giờ làm — khăn và dụng cụ thay mới cho từng khách, có hỏi tình trạng da đầu trước khi gội 🌿 Khung 18:00–20:00 trong tuần vẫn còn chỗ. #goidau",
    image: "images/service-wash.jpg",
    topic: "Chăm sóc tóc",
    createdAt: "2026-11-16T17:20:00+07:00",
    likes: 64,
    salonId: 6,
    replies: []
  },
  {
    id: 8,
    author: { name: "Quốc Anh", handle: "quocanh.sv", type: "user" },
    content: "Sinh viên budget thấp thì cắt ở đâu ổn quanh khu Bình Thạnh – Phú Nhuận vậy mọi người? Tầm 100–150k thôi 🙏 #hoidap #sinhvien",
    topic: "Hỏi đáp",
    createdAt: "2026-11-21T08:05:00+07:00",
    likes: 11,
    replies: [
      { id: "r8-1", author: { name: "Phạm Minh Duy", handle: "minhduy", type: "user" }, content: "Khánh Hair cắt 100k, nhanh mà ổn lắm bạn.", createdAt: "2026-11-21T08:40:00+07:00", likes: 4 }
    ]
  },
  {
    id: 9,
    author: OFFICIAL,
    title: "Chọn salon lần đầu: 6 điều cần xem trước khi đặt",
    content: "Điểm đánh giá + số lượt đánh giá · nội dung review gần đây · bảng giá có thời lượng · vị trí, giờ mở cửa · kinh nghiệm stylist · ảnh không gian thật.\nTrang Đặt lịch có bộ lọc khu vực, dịch vụ và sắp xếp theo giá để so sánh nhanh. #meodatlich",
    image: "images/salon-01.jpg",
    topic: "Mẹo đặt lịch",
    createdAt: "2026-11-14T10:00:00+07:00",
    likes: 142,
    replies: []
  },
  {
    id: 10,
    author: { name: "Hải Yến", handle: "haiyen.stylist", type: "user" },
    content: "Góc stylist: gội trước hay sau khi cắt? Tóc xoăn mình hay cắt khô để thấy đúng độ phồng; còn bob cần đường cắt chuẩn thì làm ẩm trước. Bạn nào thắc mắc cứ hỏi nha ✂️ #layer #hoidap",
    image: "images/salon-10.jpg",
    topic: "Hỏi đáp",
    createdAt: "2026-11-13T15:45:00+07:00",
    likes: 57,
    replies: []
  }
];

window.blogs = blogs;
window.THREAD_TOPICS = THREAD_TOPICS;
