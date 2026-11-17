/**
 * NGUỒN DỮ LIỆU DÙNG CHUNG - SALONBOOK (Đã bổ sung Phân loại Salon Nam/Nữ/Unisex & Giờ trống của thợ)
 * Phụ trách: Mai Thanh Ngân (TV1)
 */
const products = [
  {
    id: 1,
    slug: "the-hair-space",
    name: "The Hair Space",
    category: "Salon tóc",
    salonType: "unisex", // Salon tổng hợp Hàn Quốc
    district: "quan-1",
    districtName: "Quận 1",
    image: "images/salon-01.jpg",
    address: "34 Phó Đức Chính, Phường Bến Thành, Quận 1, TP.HCM",
    map: "https://maps.app.goo.gl/72ytADTaG9YJMTUX6",
    lat: 10.7712,
    lng: 106.6980,
    description: "Không gian làm tóc phong cách tối giản chuẩn Hàn Quốc, chuyên cắt tạo kiểu và uốn nhuộm thời thượng.",
    rating: 4.8,
    reviewCount: 124,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:00",
      close: "20:00",
      closedDays: []
    },
    stylists: [
      { id: "st1_1", salonId: 1, name: "Minh Trí", experience: "8 năm", availableHours: ["09:00", "10:30", "14:00", "16:00", "18:30"] },
      { id: "st1_2", salonId: 1, name: "Hải Yến", experience: "5 năm", availableHours: ["09:30", "11:00", "14:30", "16:30", "19:00"] },
      { id: "st1_3", salonId: 1, name: "Quốc Bảo", experience: "4 năm", availableHours: ["10:00", "13:30", "15:30", "17:30"] }
    ],
    servicesList: [
      { id: "s1_1", salonId: 1, name: "Cắt & tạo kiểu", duration: 45, price: 150000, value: "cat-tao-kieu" },
      { id: "s1_2", salonId: 1, name: "Nhuộm tóc", duration: 90, price: 650000, value: "nhuom-toc" },
      { id: "s1_4", salonId: 1, name: "Phục hồi tóc", duration: 60, price: 450000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r1_1", userName: "Nguyễn Văn Thông", rating: 5, comment: "Thợ cắt rất có tâm, không gian quán đẹp chuẩn Hàn.", date: "2026-10-15" },
      { id: "r1_2", userName: "Trần Thị Liễu", rating: 4, comment: "Nhuộm màu đẹp nhưng chờ hơi lâu vào cuối tuần.", date: "2026-10-20" }
    ]
  },
  {
    id: 2,
    slug: "juno-hair-studio",
    name: "JUNO HAIR STUDIO",
    category: "Salon tóc",
    salonType: "unisex", // Studio nhuộm thời trang
    district: "quan-10",
    districtName: "Quận 10",
    image: "images/salon-02.jpg",
    address: "740/20 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
    map: "https://maps.app.goo.gl/2MnwfqcCxjoBgvQB9",
    lat: 10.7756,
    lng: 106.6681,
    description: "Studio chuyên các tone màu nhuộm cá tính, bọc phục hồi collagen chống xơ rối.",
    rating: 5,
    reviewCount: 198,
    openingHours: {
      days: "Thứ Hai - Thứ Bảy",
      open: "09:00",
      close: "19:30",
      closedDays: ["Chủ Nhật"]
    },
    stylists: [
      { id: "st2_1", salonId: 2, name: "Juno Lee", experience: "10 năm", availableHours: ["09:00", "11:00", "14:00", "16:30", "18:00"] },
      { id: "st2_2", salonId: 2, name: "Tuấn Anh", experience: "6 năm", availableHours: ["09:30", "13:30", "15:30", "17:30"] }
    ],
    servicesList: [
      { id: "s2_1", salonId: 2, name: "Cắt & tạo kiểu", duration: 45, price: 180000, value: "cat-tao-kieu" },
      { id: "s2_2", salonId: 2, name: "Nhuộm tóc", duration: 120, price: 850000, value: "nhuom-toc" },
      { id: "s2_4", salonId: 2, name: "Phục hồi tóc", duration: 60, price: 500000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r2_1", userName: "Lê Hoàng Chí", rating: 5, comment: "Juno tay nghề đỉnh cao, màu nhuộm chuẩn không cần chỉnh.", date: "2026-11-01" }
    ]
  },
  {
    id: 3,
    slug: "khanh-hair",
    name: "Khánh Hair",
    category: "Salon tóc",
    salonType: "nam", // Tiệm thiên hướng cắt nam / học sinh sinh viên nhanh gọn
    district: "khac",
    districtName: "Khu vực khác",
    image: "images/salon-03.jpg",
    address: "245 Nhật Tảo, Diên Hồng, Hồ Chí Minh",
    map: "https://maps.app.goo.gl/kdUWxMfpS8smfffh9",
    lat: 10.7580,
    lng: 106.6620,
    description: "Tiệm tóc trẻ trung chuyên cắt tạo form gọn gàng, sấy định hình nhanh chóng cho học sinh - sinh viên.",
    rating: 4.8,
    reviewCount: 145,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "08:30",
      close: "19:00",
      closedDays: []
    },
    stylists: [
      { id: "st3_1", salonId: 3, name: "Duy Khánh", experience: "7 năm", availableHours: ["08:30", "10:00", "14:00", "16:00", "17:30"] },
      { id: "st3_2", salonId: 3, name: "Thế Vinh", experience: "4 năm", availableHours: ["09:00", "11:00", "15:00", "17:00"] }
    ],
    servicesList: [
      { id: "s3_1", salonId: 3, name: "Cắt & tạo kiểu", duration: 30, price: 100000, value: "cat-tao-kieu" },
      { id: "s3_2", salonId: 3, name: "Nhuộm tóc", duration: 180, price: 350000, value: "nhuom-toc" },
      { id: "s3_3", salonId: 3, name: "Gội & thư giãn", duration: 30, price: 80000, value: "goi-thu-gian" },
      { id: "s3_4", salonId: 3, name: "Phục hồi tóc", duration: 60, price: 250000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r3_1", userName: "Phạm Minh Duy", rating: 5, comment: "Cắt nhanh, rẻ, hợp túi tiền sinh viên.", date: "2026-10-10" }
    ]
  },
  {
    id: 4,
    slug: "nhat-hung",
    name: "Hair salon NHẬT HƯNG",
    category: "Salon tóc",
    salonType: "unisex",
    district: "binh-thanh",
    districtName: "Bình Thạnh",
    image: "images/salon-04.png",
    address: "164 Nguyễn Xí, Phường 26, Quận Bình Thạnh, TP.HCM",
    map: "https://maps.app.goo.gl/cGyHf4iEcGfuUX5u7",
    lat: 10.8120,
    lng: 106.7090,
    description: "Kỹ thuật uốn nếp giữ form lâu kết hợp cắt tạo kiểu bồng bềnh tự nhiên.",
    rating: 4.9,
    reviewCount: 82,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:00",
      close: "20:00",
      closedDays: []
    },
    stylists: [
      { id: "st4_1", salonId: 4, name: "Nhật Hưng", experience: "9 năm", availableHours: ["09:00", "10:30", "14:00", "16:30", "18:30"] },
      { id: "st4_2", salonId: 4, name: "Hoàng Nam", experience: "5 năm", availableHours: ["09:30", "13:30", "15:30", "18:00"] }
    ],
    servicesList: [
      { id: "s4_1", salonId: 4, name: "Cắt & tạo kiểu", duration: 40, price: 160000, value: "cat-tao-kieu" },
      { id: "s4_2", salonId: 4, name: "Nhuộm tóc", duration: 180, price: 550000, value: "nhuom-toc" },
      { id: "s4_3", salonId: 4, name: "Gội & thư giãn", duration: 45, price: 130000, value: "goi-thu-gian" },
      { id: "s4_4", salonId: 4, name: "Phục hồi tóc", duration: 120, price: 380000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r4_1", userName: "Hoàng Thu Hằng", rating: 5, comment: "Uốn tóc ở đây giữ form bền lắm, gội đầu thư giãn.", date: "2026-11-05" }
    ]
  },
  {
    id: 5,
    slug: "min-hair",
    name: "Min Hair Salon",
    category: "Salon tóc",
    salonType: "unisex",
    district: "khac",
    districtName: "Khu vực khác",
    image: "images/salon-05.png",
    address: "771 Đường Số 05, Khu đô thị An Phú An Khánh, TP.HCM",
    map: "https://maps.app.goo.gl/DLbeFnSV2qARrepV6",
    lat: 10.7880,
    lng: 106.7450,
    description: "Địa chỉ quen thuộc cho các tín đồ nhuộm thời trang và uốn duỗi thẩm mỹ.",
    rating: 4.8,
    reviewCount: 64,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:30",
      close: "20:00",
      closedDays: []
    },
    stylists: [
      { id: "st5_1", salonId: 5, name: "Minh Đăng", experience: "8 năm", availableHours: ["09:30", "11:00", "14:30", "16:30", "18:30"] },
      { id: "st5_2", salonId: 5, name: "Phương Thảo", experience: "6 năm", availableHours: ["10:00", "13:30", "15:30", "17:30"] }
    ],
    servicesList: [
      { id: "s5_1", salonId: 5, name: "Cắt & tạo kiểu", duration: 50, price: 200000, value: "cat-tao-kieu" },
      { id: "s5_2", salonId: 5, name: "Nhuộm tóc", duration: 150, price: 950000, value: "nhuom-toc" },
      { id: "s5_4", salonId: 5, name: "Phục hồi tóc", duration: 120, price: 550000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r5_1", userName: "Vũ Minh Phương", rating: 5, comment: "Màu nhuộm thời trang đẹp xuất sắc.", date: "2026-10-28" }
    ]
  },
  {
    id: 6,
    slug: "doth-hair",
    name: "DOTH HAIR",
    category: "Salon tóc",
    salonType: "unisex",
    district: "quan-1",
    districtName: "Quận 1",
    image: "images/salon-06.png",
    address: "150/40 Nguyễn Trãi, Quận 1, TP.HCM",
    map: "https://maps.app.goo.gl/HKPJV7QwKiwf8GXJ8",
    lat: 10.7680,
    lng: 106.6900,
    description: "Chăm sóc tóc toàn diện từ cắt tóc thời thượng đến massage trị liệu thư giãn da đầu.",
    rating: 4.8,
    reviewCount: 250,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:00",
      close: "20:00",
      closedDays: []
    },
    stylists: [
      { id: "st6_1", salonId: 6, name: "Đỗ Thành", experience: "7 năm", availableHours: ["09:00", "10:30", "14:00", "16:00", "18:30"] },
      { id: "st6_2", salonId: 6, name: "Ánh Tuyết", experience: "5 năm", availableHours: ["09:30", "11:30", "15:00", "17:30"] }
    ],
    servicesList: [
      { id: "s6_1", salonId: 6, name: "Cắt & tạo kiểu", duration: 40, price: 150000, value: "cat-tao-kieu" },
      { id: "s6_2", salonId: 6, name: "Nhuộm tóc", duration: 180, price: 600000, value: "nhuom-toc" },
      { id: "s6_3", salonId: 6, name: "Gội & thư giãn", duration: 60, price: 200000, value: "goi-thu-gian" },
      { id: "s6_4", salonId: 6, name: "Phục hồi tóc", duration: 120, price: 400000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r6_1", userName: "Đặng Thị Gìau", rating: 4, comment: "Dịch vụ gội đầu massage rất phê, nhân viên nhiệt tình.", date: "2026-11-02" }
    ]
  },
  {
    id: 7,
    slug: "mai-nguyen",
    name: "Hairsalon Mai Nguyễn",
    category: "Salon tóc",
    salonType: "nu", // Chuyên chăm sóc tóc nữ, phủ bạc thảo dược
    district: "khac",
    districtName: "Khu vực khác",
    image: "images/salon-07.webp",
    address: "411 Tùng Thiện Vương, Phú Định, TP.HCM",
    map: "https://maps.app.goo.gl/w64wwtwnTo8iqRET7",
    lat: 10.7450,
    lng: 106.6350,
    description: "Thế mạnh về nhuộm phủ bạc thảo dược và cắt tóc cơ bản, tay nghề thợ lâu năm.",
    rating: 4.9,
    reviewCount: 230,
    openingHours: {
      days: "Thứ Hai - Thứ Bảy",
      open: "08:00",
      close: "18:30",
      closedDays: ["Chủ Nhật"]
    },
    stylists: [
      { id: "st7_1", salonId: 7, name: "Chị Mai", experience: "12 năm", availableHours: ["08:00", "09:30", "13:30", "15:30", "17:00"] },
      { id: "st7_2", salonId: 7, name: "Văn Hùng", experience: "5 năm", availableHours: ["08:30", "10:30", "14:30", "16:30"] }
    ],
    servicesList: [
      { id: "s7_1", salonId: 7, name: "Cắt & tạo kiểu", duration: 35, price: 120000, value: "cat-tao-kieu" },
      { id: "s7_2", salonId: 7, name: "Nhuộm tóc", duration: 120, price: 400000, value: "nhuom-toc" },
      { id: "s7_3", salonId: 7, name: "Gội & thư giãn", duration: 35, price: 90000, value: "goi-thu-gian" },
      { id: "s7_4", salonId: 7, name: "Phục hồi tóc", duration: 60, price: 300000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r7_1", userName: "Bùi Văn Hiếu", rating: 4, comment: "Nhân viên tư vấn dễ thương, nhiệt tình", date: "2026-09-15" }
    ]
  },
  {
    id: 8,
    slug: "susi-hair",
    name: "Susi Hair Salon Quận 5",
    category: "Salon tóc",
    salonType: "nu", // Chuyên cắt layer nữ bồng bềnh
    district: "quan-5",
    districtName: "Quận 5",
    image: "images/salon-08.webp",
    address: "109 Huỳnh Mẫn Đạt, Quận 5, TP.HCM",
    map: "https://maps.app.goo.gl/FQ4cHyg7F896yy3u6",
    lat: 10.7530,
    lng: 106.6710,
    description: "Chuyên cắt tóc layer nữ bồng bềnh, uốn cúp mái bay nhẹ nhàng nữ tính.",
    rating: 4.8,
    reviewCount: 110,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:00",
      close: "20:00",
      closedDays: []
    },
    stylists: [
      { id: "st8_1", salonId: 8, name: "Susi Nguyễn", experience: "6 năm", availableHours: ["09:00", "10:30", "14:00", "16:00", "18:30"] },
      { id: "st8_2", salonId: 8, name: "Thành Đạt", experience: "4 năm", availableHours: ["09:30", "11:00", "15:00", "17:30"] }
    ],
    servicesList: [
      { id: "s8_1", salonId: 8, name: "Cắt & tạo kiểu", duration: 45, price: 180000, value: "cat-tao-kieu" },
      { id: "s8_2", salonId: 8, name: "Nhuộm tóc", duration: 180, price: 600000, value: "nhuom-toc" },
      { id: "s8_3", salonId: 8, name: "Gội & thư giãn", duration: 40, price: 140000, value: "goi-thu-gian" },
      { id: "s8_4", salonId: 8, name: "Phục hồi tóc", duration: 120, price: 350000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r8_1", userName: "Ngô Thanh Yến", rating: 5, comment: "Cắt layer kiểu bay cực kỳ hợp mặt, rất ưng ý.", date: "2026-11-04" }
    ]
  },
  {
    id: 9,
    slug: "new-hair",
    name: "New Hair Salon",
    category: "Salon tóc",
    salonType: "unisex",
    district: "quan-7",
    districtName: "Quận 7",
    image: "images/salon-09.jpg",
    address: "178C Lâm Văn Bền, Quận 7, TP.HCM",
    map: "https://maps.app.goo.gl/3s9WAr5ZiywYYD2o9",
    lat: 10.7380,
    lng: 106.7150,
    description: "Duỗi cúp tự nhiên, ép phồng chân tóc với dòng sản phẩm hữu cơ nhập khẩu an toàn.",
    rating: 4.8,
    reviewCount: 75,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:00",
      close: "19:30",
      closedDays: []
    },
    stylists: [
      { id: "st9_1", salonId: 9, name: "Khắc Tiệp", experience: "8 năm", availableHours: ["09:00", "10:30", "14:00", "16:00", "18:00"] },
      { id: "st9_2", salonId: 9, name: "Mỹ Linh", experience: "3 năm", availableHours: ["09:30", "13:30", "15:30", "17:30"] }
    ],
    servicesList: [
      { id: "s9_1", salonId: 9, name: "Cắt & tạo kiểu", duration: 45, price: 150000, value: "cat-tao-kieu" },
      { id: "s9_2", salonId: 9, name: "Nhuộm tóc", duration: 120, price: 700000, value: "nhuom-toc" },
      { id: "s9_3", salonId: 9, name: "Gội & thư giãn", duration: 40, price: 130000, value: "goi-thu-gian" },
      { id: "s9_4", salonId: 9, name: "Phục hồi tóc", duration: 60, price: 420000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r9_1", userName: "Dương Khánh", rating: 5, comment: "Tóc duỗi cúp mềm mượt, không bị khô xơ chút nào.", date: "2026-10-30" }
    ]
  },
  {
    id: 10,
    slug: "the-one",
    name: "The One Hair Salon Quận 3",
    category: "Salon tóc",
    salonType: "unisex",
    district: "quan-3",
    districtName: "Quận 3",
    image: "images/salon-10.jpg",
    address: "436/29 Cách Mạng Tháng Tám, Quận 3, TP.HCM",
    map: "https://maps.app.goo.gl/aw8iVxtYAK5wCv8MA",
    lat: 10.7820,
    lng: 106.6780,
    description: "Không gian sang trọng, đội ngũ stylist giàu kinh nghiệm, chuyên phục hồi tóc hư tổn.",
    rating: 4.9,
    reviewCount: 140,
    openingHours: {
      days: "Thứ Hai - Chủ Nhật",
      open: "09:00",
      close: "20:30",
      closedDays: []
    },
    stylists: [
      { id: "st10_1", salonId: 10, name: "Eric Trần", experience: "11 năm", availableHours: ["09:00", "11:00", "14:00", "16:30", "19:00"] },
      { id: "st10_2", salonId: 10, name: "Bích Phương", experience: "7 năm", availableHours: ["09:30", "13:30", "15:30", "18:00"] }
    ],
    servicesList: [
      { id: "s10_1", salonId: 10, name: "Cắt & tạo kiểu", duration: 45, price: 170000, value: "cat-tao-kieu" },
      { id: "s10_2", salonId: 10, name: "Nhuộm tóc", duration: 180, price: 800000, value: "nhuom-toc" },
      { id: "s10_3", salonId: 10, name: "Gội & thư giãn", duration: 50, price: 170000, value: "goi-thu-gian" },
      { id: "s10_4", salonId: 10, name: "Phục hồi tóc", duration: 120, price: 500000, value: "phuc-hoi-toc" }
    ],
    reviewsList: [
      { id: "r10_1", userName: "Lý Mai Linh", rating: 5, comment: "Dịch vụ đẳng cấp 5 sao, phục hồi tóc hư tổn cực kỳ hiệu quả.", date: "2026-11-06" }
    ]
  }
];
