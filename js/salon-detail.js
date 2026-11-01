
/* =========================================
   SALONBOOK - SALON DETAIL & NAVIGATION
   Kết nối trang chủ, danh sách và chi tiết
   Phiên bản chỉnh sửa - Không có nút bản đồ
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // =========================================
  // 1. DỮ LIỆU 10 SALON
  // =========================================

  const salons = [
    {
      id: "the-hair-space",
      name: "The Hair Space",
      district: "Quận 1",
      address: "34 Phó Đức Chính, Phường Bến Thành, Quận 1, TP.HCM",
      image: "images/salon-01.jpg"
    },
    {
      id: "juno-hair-studio",
      name: "JUNO Hair Studio",
      district: "Quận 10",
      address: "740/20 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
      image: "images/salon-02.jpg"
    },
    {
      id: "khanh-hair",
      name: "Khánh Hair",
      district: "Quận 10",
      address: "245 Nhật Tảo, Phường Diên Hồng, TP.HCM",
      image: "images/salon-03.jpg"
    },
    {
      id: "nhat-hung",
      name: "Hair Salon Nhật Hưng",
      district: "Bình Thạnh",
      address: "164 Nguyễn Xí, Phường 26, Bình Thạnh, TP.HCM",
      image: "images/salon-04.png"
    },
    {
      id: "min-hair",
      name: "Min Hair Salon",
      district: "An Phú An Khánh",
      address: "771 Đường Số 05, Khu đô thị An Phú An Khánh, TP.HCM",
      image: "images/salon-05.png"
    },
    {
      id: "doth-hair",
      name: "DOTH HAIR",
      district: "Quận 1",
      address: "150/40 Nguyễn Trãi, Quận 1, TP.HCM",
      image: "images/salon-06.png"
    },
    {
      id: "mai-nguyen",
      name: "Hairsalon Mai Nguyễn",
      district: "Phú Định",
      address: "411 Tùng Thiện Vương, Phú Định, TP.HCM",
      image: "images/salon-07.webp"
    },
    {
      id: "susi-hair",
      name: "Susi Hair Salon Quận 5",
      district: "Quận 5",
      address: "109 Huỳnh Mẫn Đạt, An Đông, TP.HCM",
      image: "images/salon-08.webp"
    },
    {
      id: "new-hair",
      name: "New Hair Salon",
      district: "Quận 7",
      address: "178C Lâm Văn Bền, Quận 7, TP.HCM",
      image: "images/salon-09.jpg"
    },
    {
      id: "the-one",
      name: "The One Hair Salon Quận 3",
      district: "Quận 3",
      address: "436/29 Cách Mạng Tháng Tám, Quận 3, TP.HCM",
      image: "images/salon-10.jpg"
    }
  ];

  // =========================================
  // 2. HÀM HỖ TRỢ
  // =========================================

  function normalize(text) {
    return String(text || "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findSalon(name) {
    return salons.find(function (salon) {
      return normalize(salon.name) === normalize(name);
    });
  }

  function salonLink(salon) {
    return "product-detail.html?salon=" +
      encodeURIComponent(salon.id);
  }

  // =========================================
  // 3. CẬP NHẬT LINK TRANG CHỦ
  // =========================================

  document.querySelectorAll(".salon-card").forEach(function (card) {

    const nameElement = card.querySelector("h3");

    if (!nameElement) return;

    const salon = findSalon(nameElement.textContent);

    if (!salon) return;

    const link = card.querySelector(".salon-card-link");

    if (link) {
      link.href = salonLink(salon);
    }

  });

  // =========================================
  // 4. CẬP NHẬT LINK TRANG DANH SÁCH
  // =========================================

  document.querySelectorAll(".product-salon-card").forEach(function (card) {

    const nameElement = card.querySelector("h2");

    const name = card.dataset.name ||
      (nameElement ? nameElement.textContent : "");

    const salon = findSalon(name);

    if (!salon) return;

    const link = card.querySelector(".salon-detail-button");

    if (link) {
      link.href = salonLink(salon);
    }

  });

  // =========================================
  // 5. XÁC ĐỊNH SALON ĐANG XEM
  // =========================================

  const detailTitle = document.getElementById("detail-title");

  // Nếu không phải trang chi tiết thì dừng.
  if (!detailTitle) return;

  const params = new URLSearchParams(window.location.search);

  const salonId = params.get("salon");

  const salon = salons.find(function (item) {
    return item.id === salonId;
  }) || salons[0];

  // Cập nhật tiêu đề trình duyệt
  document.title = salon.name + " | SalonBook";

  // Cập nhật tên salon
  detailTitle.textContent = salon.name;

  // =========================================
  // 6. CẬP NHẬT THÔNG TIN CHI TIẾT
  // =========================================

  // Hình ảnh salon
  const detailImage = document.querySelector(
    ".detail-image img"
  );

  if (detailImage) {
    detailImage.src = salon.image;
    detailImage.alt = "Hình ảnh " + salon.name;
  }

  // Nhãn khu vực
  const detailLabel = document.querySelector(
    ".detail-info .detail-label"
  );

  if (detailLabel) {
    detailLabel.textContent =
      "SALON TÓC · " + salon.district.toUpperCase();
  }

  // Địa chỉ
  const detailAddress = document.querySelector(
    ".detail-address"
  );

  if (detailAddress) {
    detailAddress.textContent = "📍 " + salon.address;
  }

  // Mô tả salon
  const description = document.querySelector(
    ".detail-description"
  );

  if (description) {
    description.textContent =
      salon.name +
      " là salon được giới thiệu trên nền tảng SalonBook. " +
      "Bạn có thể tham khảo thông tin, địa chỉ và các " +
      "nhóm dịch vụ chăm sóc tóc trước khi lựa chọn " +
      "lịch hẹn phù hợp.";
  }

  // Xóa liên kết bản đồ cũ nếu có trong HTML
  document.querySelectorAll(
    ".detail-info a[href*='maps'], " +
    ".other-salon-grid a[href*='maps']"
  ).forEach(function (link) {
    link.remove();
  });

  // =========================================
  // 7. CẬP NHẬT TÓM TẮT ĐẶT LỊCH
  // =========================================

  const summaryItems = document.querySelectorAll(
    ".detail-summary-item"
  );

  function updateSummary(index, value) {

    const item = summaryItems[index];

    if (!item) return;

    const strong = item.querySelector("strong");

    if (strong) {
      strong.textContent = value;
    }

  }

  // Tên salon
  updateSummary(0, salon.name);

  // Khu vực salon
  updateSummary(1, salon.district + ", TP.HCM");

  const serviceSelect = document.getElementById(
    "detail-service-select"
  );

  const dateInput = document.getElementById(
    "detail-date"
  );

  // =========================================
  // 8. CẬP NHẬT DỊCH VỤ
  // =========================================

  if (serviceSelect) {

    serviceSelect.addEventListener("change", function () {

      const selectedOption =
        serviceSelect.options[serviceSelect.selectedIndex];

      if (serviceSelect.value && selectedOption) {

        updateSummary(
          2,
          selectedOption.textContent.trim()
        );

      } else {

        updateSummary(2, "Chưa xác nhận");

      }

    });

  }

  // =========================================
  // 9. CẬP NHẬT NGÀY DỰ KIẾN
  // =========================================

  if (dateInput) {

    // Lấy ngày hôm nay theo giờ địa phương
    const now = new Date();

    const today = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    // Không cho chọn ngày trong quá khứ
    dateInput.min = today;

    dateInput.addEventListener("change", function () {

      if (!dateInput.value) {

        updateSummary(4, "Chưa xác nhận");
        return;

      }

      const parts = dateInput.value.split("-");

      const formattedDate =
        parts[2] + "/" + parts[1] + "/" + parts[0];

      updateSummary(
        4,
        formattedDate + " · Chưa chọn giờ"
      );

    });

  }

  // =========================================
  // 10. DANH SÁCH CÁC SALON KHÁC
  // =========================================

  const otherSalonGrid = document.querySelector(
    ".other-salon-grid"
  );

  if (otherSalonGrid) {

    // Xóa dữ liệu salon mẫu có sẵn trong HTML
    otherSalonGrid.replaceChildren();

    // Loại bỏ salon đang xem
    const otherSalons = salons.filter(function (item) {
      return item.id !== salon.id;
    });

    // Tạo thẻ cho 9 salon còn lại
    otherSalons.forEach(function (item) {

      const card = document.createElement("article");
      card.className = "other-salon-card";

      // Hình ảnh
      const image = document.createElement("img");

      image.src = item.image;
      image.alt = "Hình ảnh " + item.name;
      image.loading = "lazy";
      image.className = "other-salon-image";

      // Tên salon
      const title = document.createElement("h3");
      title.textContent = item.name;

      // Địa chỉ
      const address = document.createElement("p");
      address.textContent = "📍 " + item.address;

      // Chỉ tạo nút XEM CHI TIẾT
      const link = document.createElement("a");

      link.href = salonLink(item);
      link.textContent = "Xem chi tiết ↗";
      link.className = "other-salon-detail-link";

      // Gắn các phần tử vào thẻ
      card.append(
        image,
        title,
        address,
        link
      );

      // Gắn thẻ salon vào danh sách
      otherSalonGrid.appendChild(card);

    });

  }

  // =========================================
  // 11. HOÀN TẤT
  // =========================================

  // Đảm bảo trang mở tại đầu nội dung.
  // Không can thiệp khi có hash như #booking.
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

});
