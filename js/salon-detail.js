
/* =========================================
   SALONBOOK - SALON DETAIL & NAVIGATION
   Kết nối trang chủ, danh sách và chi tiết
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // 1. DỮ LIỆU 10 SALON
  const salons = [
    {
      id: "the-hair-space",
      name: "The Hair Space",
      district: "Quận 1",
      address: "34 Phó Đức Chính, Phường Bến Thành, Quận 1, TP.HCM",
      image: "images/salon-01.jpg",
      map: ""
    },
    {
      id: "juno-hair-studio",
      name: "JUNO Hair Studio",
      district: "Quận 10",
      address: "740/20 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
      image: "images/salon-02.jpg",
      map: "https://maps.app.goo.gl/2MnwfqcCxjoBgvQB9"
    },
    {
      id: "khanh-hair",
      name: "Khánh Hair",
      district: "Khu vực khác",
      address: "Địa chỉ đang cập nhật",
      image: "images/salon-03.jpg",
      map: ""
    },
    {
      id: "nhat-hung",
      name: "Hair Salon Nhật Hưng",
      district: "Bình Thạnh",
      address: "164 Nguyễn Xí, Phường 26, Bình Thạnh, TP.HCM",
      image: "images/salon-04.png",
      map: ""
    },
    {
      id: "min-hair",
      name: "Min Hair Salon",
      district: "An Phú An Khánh",
      address: "771 Đường Số 05, Khu đô thị An Phú An Khánh, TP.HCM",
      image: "images/salon-05.png",
      map: "https://maps.app.goo.gl/DLbeFnSV2qARrepV6"
    },
    {
      id: "doth-hair",
      name: "DOTH HAIR",
      district: "Quận 1",
      address: "150/40 Nguyễn Trãi, Quận 1, TP.HCM",
      image: "images/salon-06.png",
      map: "https://maps.app.goo.gl/HKPJV7QwKiwf8GXJ8"
    },
    {
      id: "mai-nguyen",
      name: "Hairsalon Mai Nguyễn",
      district: "Phú Định",
      address: "411 Tùng Thiện Vương, Phú Định, TP.HCM",
      image: "images/salon-07.webp",
      map: "https://maps.app.goo.gl/w64wwtwnTo8iqRET7"
    },
    {
      id: "susi-hair",
      name: "Susi Hair Salon Quận 5",
      district: "Quận 5",
      address: "109 Huỳnh Mẫn Đạt, An Đông, TP.HCM",
      image: "images/salon-08.webp",
      map: "https://maps.app.goo.gl/FQ4cHyg7F896yy3u6"
    },
    {
      id: "new-hair",
      name: "New Hair Salon",
      district: "Quận 7",
      address: "178C Lâm Văn Bền, Quận 7, TP.HCM",
      image: "images/salon-09.jpg",
      map: "https://maps.app.goo.gl/3s9WAr5ZiywYYD2o9"
    },
    {
      id: "the-one",
      name: "The One Hair Salon Quận 3",
      district: "Quận 3",
      address: "436/29 Cách Mạng Tháng Tám, Quận 3, TP.HCM",
      image: "images/salon-10.jpg",
      map: "https://maps.app.goo.gl/aw8iVxtYAK5wCv8MA"
    }
  ];

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .trim();
  }

  function findSalon(name) {
    return salons.find(salon =>
      normalize(salon.name) === normalize(name)
    );
  }

  function salonLink(salon) {
    return "product-detail.html?salon=" +
      encodeURIComponent(salon.id);
  }

  // =========================================
  // 2. SỬA LINK TRÊN TRANG CHỦ
  // =========================================

  document.querySelectorAll(".salon-card").forEach(card => {
    const name = card.querySelector("h3")?.textContent;
    const salon = findSalon(name);

    if (!salon) return;

    const link = card.querySelector(".salon-card-link");

    if (link) {
      link.href = salonLink(salon);
    }
  });

  // =========================================
  // 3. SỬA LINK TRANG DANH SÁCH SALON
  // =========================================

  document.querySelectorAll(".product-salon-card").forEach(card => {
    const name = card.dataset.name ||
      card.querySelector("h2")?.textContent;

    const salon = findSalon(name);

    if (!salon) return;

    const link = card.querySelector(".salon-detail-button");

    if (link) {
      link.href = salonLink(salon);
    }
  });

  // =========================================
  // 4. TRANG CHI TIẾT SALON
  // =========================================

  const detailTitle = document.getElementById("detail-title");

  if (!detailTitle) return;

  const params = new URLSearchParams(window.location.search);
  const salonId = params.get("salon");

  const salon = salons.find(item => item.id === salonId)
    || salons[0];

  document.title = salon.name + " | SalonBook";

  // Tên salon
  detailTitle.textContent = salon.name;

  // Hình ảnh
  const detailImage = document.querySelector(".detail-image img");

  if (detailImage) {
    detailImage.src = salon.image;
    detailImage.alt = "Hình ảnh " + salon.name;
  }

  // Nhãn khu vực
  const detailLabel = document.querySelector(
    ".detail-info .detail-label"
  );

  if (detailLabel) {
    detailLabel.textContent = "SALON TÓC · " +
      salon.district.toUpperCase();
  }

  // Địa chỉ
  const detailAddress = document.querySelector(".detail-address");

  if (detailAddress) {
    detailAddress.textContent = "📍 " + salon.address;
  }

  // Mô tả
  const description = document.querySelector(".detail-description");

  if (description) {
    description.textContent =
      salon.name + " là salon được giới thiệu trên nền tảng " +
      "SalonBook. Bạn có thể tham khảo thông tin, địa chỉ " +
      "và các nhóm dịch vụ chăm sóc tóc trước khi lựa chọn " +
      "lịch hẹn phù hợp.";
  }

  // Liên kết Google Maps
  const detailInfo = document.querySelector(".detail-info");
  const bookingButton = document.querySelector(".detail-button");

  if (detailInfo && salon.map) {
    const mapLink = document.createElement("a");

    mapLink.href = salon.map;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.textContent = "📍 Xem vị trí trên Google Maps ↗";

    mapLink.style.display = "inline-block";
    mapLink.style.margin = "18px 0";
    mapLink.style.fontWeight = "700";
    mapLink.style.color = "var(--forest, #0c513f)";

    if (bookingButton) {
      detailInfo.insertBefore(mapLink, bookingButton);
    } else {
      detailInfo.appendChild(mapLink);
    }
  }

  // =========================================
  // 5. CẬP NHẬT TÓM TẮT ĐẶT LỊCH
  // =========================================

  const summaryItems = document.querySelectorAll(
    ".detail-summary-item"
  );

  function updateSummary(index, value) {
    const item = summaryItems[index];
    const strong = item?.querySelector("strong");

    if (strong) {
      strong.textContent = value;
    }
  }

  // Salon + địa điểm
  updateSummary(0, salon.name);
  updateSummary(1, salon.district + ", TP.HCM");

  const serviceSelect = document.getElementById(
    "detail-service-select"
  );

  const dateInput = document.getElementById("detail-date");

  // Dịch vụ
  if (serviceSelect) {
    serviceSelect.addEventListener("change", function () {
      const selected = serviceSelect.options[
        serviceSelect.selectedIndex
      ];

      updateSummary(
        2,
        serviceSelect.value ? selected.textContent.trim()
          : "Chưa xác nhận"
      );
    });
  }

  // Ngày không được trước hôm nay
  if (dateInput) {
    const now = new Date();

    const today = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.min = today;

    dateInput.addEventListener("change", function () {
      if (!dateInput.value) {
        updateSummary(4, "Chưa xác nhận");
        return;
      }

      const parts = dateInput.value.split("-");

      updateSummary(
        4,
        parts[2] + "/" + parts[1] + "/" + parts[0] +
        " · Chưa chọn giờ"
      );
    });
  }

  // =========================================
  // 6. DANH SÁCH SALON KHÁC
  // =========================================

  const otherSalonGrid = document.querySelector(
    ".other-salon-grid"
  );

  if (otherSalonGrid) {
    otherSalonGrid.replaceChildren();

    salons
      .filter(item => item.id !== salon.id)
      .forEach(item => {

        const card = document.createElement("article");
        card.className = "other-salon-card";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        image.loading = "lazy";
        image.className = "other-salon-image";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const address = document.createElement("p");
        address.textContent = "📍 " + item.address;

        const link = document.createElement("a");
        link.href = salonLink(item);
        link.textContent = "Xem chi tiết ↗";

        card.append(image, title, address, link);

        if (item.map) {
          const mapLink = document.createElement("a");
          mapLink.href = item.map;
          mapLink.target = "_blank";
          mapLink.rel = "noopener noreferrer";
          mapLink.textContent = "Xem bản đồ ↗";

          card.appendChild(mapLink);
        }

        otherSalonGrid.appendChild(card);
      });
  }

});
