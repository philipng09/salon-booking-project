
/* =========================================
   SALONBOOK - SALON DETAIL & NAVIGATION
   10 salon + Google Maps
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // 1. DỮ LIỆU 10 SALON
  const salons = [
    {
      id: "the-hair-space",
      name: "The Hair Space",
      district: "Quận 1",
      address: "34 Phó Đức Chính, Phường Bến Thành, Quận 1, TP.HCM",
      image: "images/salon-01.jpg",
      map: "https://maps.app.goo.gl/72ytADTaG9YJMTUX6"
    },
    {
      id: "juno-hair-studio",
      name: "JUNO Hair Studio",
      district: "Quận 10",
      address: "740/20 Sư Vạn Hạnh, Phường 12, Quận 10, Hồ Chí Minh",
      image: "images/salon-02.jpg",
      map: "https://maps.app.goo.gl/2MnwfqcCxjoBgvQB9"
    },
    {
      id: "khanh-hair",
      name: "Khánh Hair",
      district: "Quận 10",
      address: "245 Nhật Tảo, Diên Hồng, Hồ Chí Minh",
      image: "images/salon-03.jpg",
      map: "https://maps.app.goo.gl/kdUWxMfpS8smfffh9"
    },
    {
      id: "nhat-hung",
      name: "Hair Salon Nhật Hưng",
      district: "Bình Thạnh",
      address: "164 Đường Nguyễn Xí, Phường 26, Quận Bình Thạnh, TP.HCM",
      image: "images/salon-04.png",
      map: "https://maps.app.goo.gl/cGyHf4iEcGfuUX5u7"
    },
    {
      id: "min-hair",
      name: "Min Hair Salon",
      district: "An Phú An Khánh",
      address: "771 Đường Số 05, Khu đô thị An Phú An Khánh, Bình Trưng, Hồ Chí Minh",
      image: "images/salon-05.png",
      map: "https://maps.app.goo.gl/DLbeFnSV2qARrepV6"
    },
    {
      id: "doth-hair",
      name: "DOTH HAIR",
      district: "Quận 1",
      address: "150/40 Nguyễn Trãi, Quận 1, Hồ Chí Minh",
      image: "images/salon-06.png",
      map: "https://maps.app.goo.gl/HKPJV7QwKiwf8GXJ8"
    },
    {
      id: "mai-nguyen",
      name: "Hairsalon Mai Nguyễn",
      district: "Phú Định",
      address: "411 Đường Tùng Thiện Vương, Phú Định, Hồ Chí Minh",
      image: "images/salon-07.webp",
      map: "https://maps.app.goo.gl/w64wwtwnTo8iqRET7"
    },
    {
      id: "susi-hair",
      name: "Susi Hair Salon Quận 5",
      district: "Quận 5",
      address: "109 Đường Huỳnh Mẫn Đạt, An Đông, Hồ Chí Minh",
      image: "images/salon-08.webp",
      map: "https://maps.app.goo.gl/FQ4cHyg7F896yy3u6"
    },
    {
      id: "new-hair",
      name: "New Hair Salon",
      district: "Quận 7",
      address: "178C Đường Lâm Văn Bền, Quận 7, Hồ Chí Minh",
      image: "images/salon-09.jpg",
      map: "https://maps.app.goo.gl/3s9WAr5ZiywYYD2o9"
    },
    {
      id: "the-one",
      name: "The One Hair Salon Quận 3",
      district: "Quận 3",
      address: "436/29 Cách Mạng Tháng Tám, Quận 3, Hồ Chí Minh",
      image: "images/salon-10.jpg",
      map: "https://maps.app.goo.gl/aw8iVxtYAK5wCv8MA"
    }
  ];

  // 2. HÀM HỖ TRỢ
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
    return salons.find(item =>
      normalize(item.name) === normalize(name)
    );
  }

  function salonLink(salon) {
    return "product-detail.html?salon=" +
      encodeURIComponent(salon.id);
  }

  // 3. LIÊN KẾT TRANG CHỦ
  document.querySelectorAll(".salon-card").forEach(card => {
    const name = card.querySelector("h3")?.textContent;
    const salon = findSalon(name);

    if (!salon) return;

    const link = card.querySelector(".salon-card-link");
    if (link) link.href = salonLink(salon);
  });

  // 4. LIÊN KẾT TRANG PRODUCTS
  document.querySelectorAll(".product-salon-card").forEach(card => {
    const name = card.dataset.name ||
      card.querySelector("h2")?.textContent;

    const salon = findSalon(name);
    if (!salon) return;

    const detailLink = card.querySelector(".salon-detail-button");
    if (detailLink) detailLink.href = salonLink(salon);

    const mapLink = card.querySelector(".salon-map-link");
    if (mapLink) mapLink.href = salon.map;
  });

  // 5. CHỈ XỬ LÝ TRANG CHI TIẾT
  const detailTitle = document.getElementById("detail-title");

  if (!detailTitle) return;

  const params = new URLSearchParams(window.location.search);
  const salonId = params.get("salon");

  const salon = salons.find(item => item.id === salonId) || salons[0];

  document.title = salon.name + " | SalonBook";

  // 6. THÔNG TIN SALON
  detailTitle.textContent = salon.name;

  const detailImage = document.querySelector(".detail-image img");

  if (detailImage) {
    detailImage.src = salon.image;
    detailImage.alt = "Hình ảnh " + salon.name;
  }

  const detailLabel = document.querySelector(
    ".detail-info .detail-label"
  );

  if (detailLabel) {
    detailLabel.textContent =
      "SALON TÓC · " + salon.district.toUpperCase();
  }

  const detailAddress = document.querySelector(".detail-address");

  if (detailAddress) {
    detailAddress.textContent = "📍 " + salon.address;
  }

  const description = document.querySelector(".detail-description");

  if (description) {
    description.textContent =
      salon.name +
      " là salon được giới thiệu trên nền tảng SalonBook. " +
      "Bạn có thể tham khảo thông tin, địa chỉ và các nhóm " +
      "dịch vụ chăm sóc tóc trước khi lựa chọn lịch hẹn phù hợp.";
  }

  // 7. NÚT GOOGLE MAPS TRANG CHI TIẾT
  const detailInfo = document.querySelector(".detail-info");
  const bookingButton = document.querySelector(".detail-button");

  if (detailInfo && salon.map) {
    // Tránh hiển thị trùng nút
    detailInfo.querySelectorAll(".detail-map-link").forEach(link => {
      link.remove();
    });

    const mapLink = document.createElement("a");

    mapLink.className = "detail-map-link";
    mapLink.href = salon.map;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.textContent = "📍 Xem bản đồ ↗";

    if (bookingButton && bookingButton.parentElement === detailInfo) {
      detailInfo.insertBefore(mapLink, bookingButton);
    } else {
      detailInfo.appendChild(mapLink);
    }
  }

  // 8. TÓM TẮT LỊCH HẸN
  const summaryItems = document.querySelectorAll(
    ".detail-summary-item"
  );

  function updateSummary(index, value) {
    const strong = summaryItems[index]?.querySelector("strong");

    if (strong) {
      strong.textContent = value;
    }
  }

  updateSummary(0, salon.name);
  updateSummary(1, salon.district + ", TP.HCM");

  // 9. CHỌN DỊCH VỤ
  const serviceSelect = document.getElementById(
    "detail-service-select"
  );

  if (serviceSelect) {
    serviceSelect.addEventListener("change", () => {
      const selected = serviceSelect.options[
        serviceSelect.selectedIndex
      ];

      updateSummary(
        2,
        serviceSelect.value && selected
          ? selected.textContent.trim()
          : "Chưa xác nhận"
      );
    });
  }

  // 10. CHỌN NGÀY DỰ KIẾN
  const dateInput = document.getElementById("detail-date");

  if (dateInput) {
    const now = new Date();

    const today = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    dateInput.min = today;

    dateInput.addEventListener("change", () => {
      if (!dateInput.value) {
        updateSummary(4, "Chưa xác nhận");
        return;
      }

      const parts = dateInput.value.split("-");
      const formattedDate =
        parts[2] + "/" + parts[1] + "/" + parts[0];

      updateSummary(4, formattedDate + " · Chưa chọn giờ");
    });
  }

  // 11. DANH SÁCH SALON KHÁC
  const otherSalonGrid = document.querySelector(".other-salon-grid");

  if (otherSalonGrid) {
    // Xóa các thẻ HTML mẫu
    otherSalonGrid.replaceChildren();

    // Hiển thị 9 salon còn lại
    salons
      .filter(item => item.id !== salon.id)
      .forEach(item => {
        const card = document.createElement("article");
        card.className = "other-salon-card";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = "Hình ảnh " + item.name;
        image.loading = "lazy";
        image.className = "other-salon-image";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const address = document.createElement("p");
        address.textContent = "📍 " + item.address;

        const detailLink = document.createElement("a");
        detailLink.className = "other-salon-detail-link";
        detailLink.href = salonLink(item);
        detailLink.textContent = "Xem chi tiết ↗";

        const mapLink = document.createElement("a");
        mapLink.className = "other-salon-map-link";
        mapLink.href = item.map;
        mapLink.target = "_blank";
        mapLink.rel = "noopener noreferrer";
        mapLink.textContent = "Xem bản đồ ↗";

        card.append(image, title, address, detailLink, mapLink);

        otherSalonGrid.appendChild(card);
      });
  }

  // Giữ trang ở đầu, trừ khi điều hướng bằng #booking
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});
