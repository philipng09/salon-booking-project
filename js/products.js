/**
 * NGUỒN DỮ LIỆU DÙNG CHUNG - SALONBOOK (BUỔI 3)
 * Phụ trách: Mai Thanh Ngân (TV1)
 */
const products = [
  {
    id: 1,
    slug: "the-hair-space",
    name: "The Hair Space",
    price: 120000,
    category: "Salon tóc",
    district: "quan-1",
    districtName: "Quận 1",
    services: "cat nhuom tao-kieu",
    image: "images/salon-01.jpg",
    address: "34 Phó Đức Chính, Phường Bến Thành, Quận 1, TP.HCM",
    map: "https://maps.app.goo.gl/72ytADTaG9YJMTUX6",
    description: "Không gian làm tóc phong cách tối giản chuẩn Hàn Quốc, chuyên cắt tạo kiểu và uốn nhuộm thời thượng.",
    stylists: [
      { id: "st1_1", name: "Minh Trí", experience: "8 năm", availableHours: ["09:00", "10:30", "14:00", "15:30", "17:00"] },
      { id: "st1_2", name: "Hải Yến", experience: "5 năm", availableHours: ["09:30", "11:00", "13:30", "16:00", "18:30"] },
      { id: "st1_3", name: "Quốc Bảo", experience: "4 năm", availableHours: ["10:00", "14:30", "16:30", "17:30", "19:00"] }
    ],
    servicesList: [
      { id: "s1_1", name: "Cắt & tạo kiểu", duration: "45 phút", price: 150000, value: "cat-tao-kieu" },
      { id: "s1_2", name: "Nhuộm tóc", duration: "90 phút", price: 650000, value: "nhuom-toc" },
      { id: "s1_4", name: "Phục hồi tóc", duration: "60 phút", price: 450000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 2,
    slug: "juno-hair-studio",
    name: "JUNO HAIR STUDIO",
    price: 150000,
    category: "Salon tóc",
    district: "quan-10",
    districtName: "Quận 10",
    services: "cat nhuom tao-kieu",
    image: "images/salon-02.jpg",
    address: "740/20 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
    map: "https://maps.app.goo.gl/2MnwfqcCxjoBgvQB9",
    description: "Studio chuyên các tone màu nhuộm cá tính, bọc phục hồi collagen chống xơ rối.",
    stylists: [
      { id: "st2_1", name: "Juno Lee", experience: "10 năm", availableHours: ["10:00", "11:30", "14:00", "16:30", "18:00"] },
      { id: "st2_2", name: "Tuấn Anh", experience: "6 năm", availableHours: ["09:00", "10:30", "13:00", "15:00", "17:30"] }
    ],
    servicesList: [
      { id: "s2_1", name: "Cắt & tạo kiểu", duration: "45 phút", price: 180000, value: "cat-tao-kieu" },
      { id: "s2_2", name: "Nhuộm tóc", duration: "120 phút", price: 850000, value: "nhuom-toc" },
      { id: "s2_4", name: "Phục hồi tóc", duration: "60 phút", price: 500000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 3,
    slug: "khanh-hair",
    name: "Khánh Hair",
    price: 80000,
    category: "Salon tóc",
    district: "khac",
    districtName: "Khu vực khác",
    services: "cat",
    image: "images/salon-03.jpg",
    address: "245 Nhật Tảo, Diên Hồng, Hồ Chí Minh",
    map: "https://maps.app.goo.gl/kdUWxMfpS8smfffh9",
    description: "Tiệm tóc trẻ trung chuyên cắt tạo form gọn gàng, sấy định hình nhanh chóng cho học sinh - sinh viên.",
    stylists: [
      { id: "st3_1", name: "Duy Khánh", experience: "7 năm", availableHours: ["08:30", "10:00", "13:30", "15:00", "16:30"] },
      { id: "st3_2", name: "Thế Vinh", experience: "4 năm", availableHours: ["09:00", "11:00", "14:00", "16:00", "17:30"] }
    ],
    servicesList: [
      { id: "s3_1", name: "Cắt & tạo kiểu", duration: "30 phút", price: 100000, value: "cat-tao-kieu" },
      { id: "s3_2", name: "Nhuộm tóc", duration: "180 phút", price: 350000, value: "nhuom-toc" },
      { id: "s3_3", name: "Gội & thư giãn", duration: "30 phút", price: 80000, value: "goi-thu-gian" },
      { id: "s3_4", name: "Phục hồi tóc", duration: "60 phút", price: 250000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 4,
    slug: "nhat-hung",
    name: "Hair salon NHẬT HƯNG",
    price: 130000,
    category: "Salon tóc",
    district: "binh-thanh",
    districtName: "Bình Thạnh",
    services: "cat nhuom tao-kieu",
    image: "images/salon-04.png",
    address: "164 Nguyễn Xí, Phường 26, Quận Bình Thạnh, TP.HCM",
    map: "https://maps.app.goo.gl/cGyHf4iEcGfuUX5u7",
    description: "Kỹ thuật uốn nếp giữ form lâu kết hợp cắt tạo kiểu bồng bềnh tự nhiên.",
    stylists: [
      { id: "st4_1", name: "Nhật Hưng", experience: "9 năm", availableHours: ["09:00", "11:00", "14:00", "16:00", "18:00"] },
      { id: "st4_2", name: "Hoàng Nam", experience: "5 năm", availableHours: ["10:00", "13:30", "15:30", "17:00", "19:00"] }
    ],
    servicesList: [
      { id: "s4_1", name: "Cắt & tạo kiểu", duration: "40 phút", price: 160000, value: "cat-tao-kieu" },
      { id: "s4_2", name: "Nhuộm tóc", duration: "180 phút", price: 550000, value: "nhuom-toc" },
      { id: "s4_3", name: "Gội & thư giãn", duration: "45 phút", price: 130000, value: "goi-thu-gian" },
      { id: "s4_4", name: "Phục hồi tóc", duration: "120 phút", price: 380000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 5,
    slug: "min-hair",
    name: "Min Hair Salon",
    price: 160000,
    category: "Salon tóc",
    district: "khac",
    districtName: "Khu vực khác",
    services: "cat nhuom tao-kieu",
    image: "images/salon-05.png",
    address: "771 Đường Số 05, Khu đô thị An Phú An Khánh, TP.HCM",
    map: "https://maps.app.goo.gl/DLbeFnSV2qARrepV6",
    description: "Địa chỉ quen thuộc cho các tín đồ nhuộm thời trang và uốn duỗi thẩm mỹ.",
    stylists: [
      { id: "st5_1", name: "Minh Đăng", experience: "8 năm", availableHours: ["10:00", "13:00", "15:00", "17:00", "19:00"] },
      { id: "st5_2", name: "Phương Thảo", experience: "6 năm", availableHours: ["09:30", "11:30", "14:00", "16:30", "18:30"] }
    ],
    servicesList: [
      { id: "s5_1", name: "Cắt & tạo kiểu", duration: "50 phút", price: 200000, value: "cat-tao-kieu" },
      { id: "s5_2", name: "Nhuộm tóc", duration: "150 phút", price: 950000, value: "nhuom-toc" },
      { id: "s5_4", name: "Phục hồi tóc", duration: "120 phút", price: 550000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 6,
    slug: "doth-hair",
    name: "DOTH HAIR",
    price: 150000,
    category: "Salon tóc",
    district: "quan-1",
    districtName: "Quận 1",
    services: "cat nhuom tao-kieu",
    image: "images/salon-06.png",
    address: "150/40 Nguyễn Trãi, Quận 1, TP.HCM",
    map: "https://maps.app.goo.gl/HKPJV7QwKiwf8GXJ8",
    description: "Chăm sóc tóc toàn diện từ cắt tóc thời thượng đến massage trị liệu thư giãn da đầu.",
    stylists: [
      { id: "st6_1", name: "Đỗ Thành", experience: "7 năm", availableHours: ["09:00", "10:30", "14:00", "16:00", "18:00"] },
      { id: "st6_2", name: "Ánh Tuyết", experience: "5 năm", availableHours: ["10:00", "11:30", "13:30", "15:30", "17:30", "19:30"] }
    ],
    servicesList: [
      { id: "s6_1", name: "Cắt & tạo kiểu", duration: "40 phút", price: 150000, value: "cat-tao-kieu" },
      { id: "s6_2", name: "Nhuộm tóc", duration: "180 phút", price: 600000, value: "nhuom-toc" },
      { id: "s6_3", name: "Gội & thư giãn", duration: "60 phút", price: 200000, value: "goi-thu-gian" },
      { id: "s6_4", name: "Phục hồi tóc", duration: "120 phút", price: 400000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 7,
    slug: "mai-nguyen",
    name: "Hairsalon Mai Nguyễn",
    price: 90000,
    category: "Salon tóc",
    district: "khac",
    districtName: "Khu vực khác",
    services: "cat nhuom",
    image: "images/salon-07.webp",
    address: "411 Tùng Thiện Vương, Phú Định, TP.HCM",
    map: "https://maps.app.goo.gl/w64wwtwnTo8iqRET7",
    description: "Thế mạnh về nhuộm phủ bạc thảo dược và cắt tóc cơ bản, tay nghề thợ lâu năm.",
    stylists: [
      { id: "st7_1", name: "Chị Mai", experience: "12 năm", availableHours: ["08:30", "10:00", "14:00", "15:30", "17:00"] },
      { id: "st7_2", name: "Văn Hùng", experience: "5 năm", availableHours: ["09:00", "11:00", "13:30", "16:00", "17:30"] }
    ],
    servicesList: [
      { id: "s7_1", name: "Cắt & tạo kiểu", duration: "35 phút", price: 120000, value: "cat-tao-kieu" },
      { id: "s7_2", name: "Nhuộm tóc", duration: "120 phút", price: 400000, value: "nhuom-toc" },
      { id: "s7_3", name: "Gội & thư giãn", duration: "35 phút", price: 90000, value: "goi-thu-gian" },
      { id: "s7_4", name: "Phục hồi tóc", duration: "60 phút", price: 300000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 8,
    slug: "susi-hair",
    name: "Susi Hair Salon Quận 5",
    price: 140000,
    category: "Salon tóc",
    district: "quan-5",
    districtName: "Quận 5",
    services: "cat nhuom tao-kieu",
    image: "images/salon-08.webp",
    address: "109 Huỳnh Mẫn Đạt, Quận 5, TP.HCM",
    map: "https://maps.app.goo.gl/FQ4cHyg7F896yy3u6",
    description: "Chuyên cắt tóc layer nữ bồng bềnh, uốn cúp mái bay nhẹ nhàng nữ tính.",
    stylists: [
      { id: "st8_1", name: "Susi Nguyễn", experience: "6 năm", availableHours: ["09:30", "11:00", "14:00", "16:00", "18:00"] },
      { id: "st8_2", name: "Thành Đạt", experience: "4 năm", availableHours: ["10:00", "13:00", "15:00", "17:00", "19:00"] }
    ],
    servicesList: [
      { id: "s8_1", name: "Cắt & tạo kiểu", duration: "45 phút", price: 180000, value: "cat-tao-kieu" },
      { id: "s8_2", name: "Nhuộm tóc", duration: "180 phút", price: 600000, value: "nhuom-toc" },
      { id: "s8_3", name: "Gội & thư giãn", duration: "40 phút", price: 140000, value: "goi-thu-gian" },
      { id: "s8_4", name: "Phục hồi tóc", duration: "120 phút", price: 350000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 9,
    slug: "new-hair",
    name: "New Hair Salon",
    price: 130000,
    category: "Salon tóc",
    district: "quan-7",
    districtName: "Quận 7",
    services: "cat nhuom tao-kieu",
    image: "images/salon-09.jpg",
    address: "178C Lâm Văn Bền, Quận 7, TP.HCM",
    map: "https://maps.app.goo.gl/3s9WAr5ZiywYYD2o9",
    description: "Duỗi cúp tự nhiên, ép phồng chân tóc với dòng sản phẩm hữu cơ nhập khẩu an toàn.",
    stylists: [
      { id: "st9_1", name: "Khắc Tiệp", experience: "8 năm", availableHours: ["09:00", "10:30", "13:30", "15:30", "17:30"] },
      { id: "st9_2", name: "Mỹ Linh", experience: "3 năm", availableHours: ["10:00", "11:30", "14:30", "16:30", "18:30"] }
    ],
    servicesList: [
      { id: "s9_1", name: "Cắt & tạo kiểu", duration: "45 phút", price: 150000, value: "cat-tao-kieu" },
      { id: "s9_2", name: "Nhuộm tóc", duration: "120 phút", price: 700000, value: "nhuom-toc" },
      { id: "s9_3", name: "Gội & thư giãn", duration: "40 phút", price: 130000, value: "goi-thu-gian" },
      { id: "s9_4", name: "Phục hồi tóc", duration: "60 phút", price: 420000, value: "phuc-hoi-toc" }
    ]
  },
  {
    id: 10,
    slug: "the-one",
    name: "The One Hair Salon Quận 3",
    price: 170000,
    category: "Salon tóc",
    district: "quan-3",
    districtName: "Quận 3",
    services: "cat nhuom tao-kieu",
    image: "images/salon-10.jpg",
    address: "436/29 Cách Mạng Tháng Tám, Quận 3, TP.HCM",
    map: "https://maps.app.goo.gl/aw8iVxtYAK5wCv8MA",
    description: "Không gian sang trọng, đội ngũ stylist giàu kinh nghiệm, chuyên phục hồi tóc hư tổn.",
    stylists: [
      { id: "st10_1", name: "Eric Trần", experience: "11 năm", availableHours: ["09:00", "11:00", "14:00", "16:00", "18:00"] },
      { id: "st10_2", name: "Bích Phương", experience: "7 năm", availableHours: ["10:00", "13:30", "15:30", "17:00", "19:00"] }
    ],
    servicesList: [
      { id: "s10_1", name: "Cắt & tạo kiểu", duration: "45 phút", price: 170000, value: "cat-tao-kieu" },
      { id: "s10_2", name: "Nhuộm tóc", duration: "180 phút", price: 800000, value: "nhuom-toc" },
      { id: "s10_3", name: "Gội & thư giãn", duration: "50 phút", price: 170000, value: "goi-thu-gian" },
      { id: "s10_4", name: "Phục hồi tóc", duration: "120 phút", price: 500000, value: "phuc-hoi-toc" }
    ]
  }
];
