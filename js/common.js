
/*
 * SALONBOOK - COMMON.JS
 * Các chức năng dùng chung:
 * 1. Menu điện thoại
 * 2. Footer
 * 3. Header đăng nhập / đăng xuất
 */

document.addEventListener("DOMContentLoaded", () => {

    // ====================================
    // 1. MENU ĐIỆN THOẠI
    // ====================================

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {

            const isOpen = nav.classList.toggle("is-open");

            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            toggle.setAttribute(
                "aria-label",
                isOpen ? "Đóng menu" : "Mở menu"
            );
        });
    }

    // ====================================
    // 2. FOOTER DÙNG CHUNG
    // ====================================

    const footerHolder = document.querySelector(".site-footer");

    if (footerHolder) {
        fetch("components/footer.html")
            .then(response => {
                return response.ok ? response.text() : "";
            })
            .then(html => {
                if (html) {
                    footerHolder.outerHTML = html;
                }
            })
            .catch(error => {
                console.warn("Không tải được Footer:", error);
            });
    }

    // ====================================
    // 3. HEADER ĐĂNG NHẬP / ĐĂNG XUẤT
    // ====================================

    function updateAuthHeader() {

        if (
            window.SalonBookAuth &&
            typeof window.SalonBookAuth.renderHeader === "function"
        ) {
            window.SalonBookAuth.renderHeader();
        }

    }

    // Cập nhật Header khi mở trang
    updateAuthHeader();

    // ====================================
    // 4. ĐỒNG BỘ TRẠNG THÁI TÀI KHOẢN
    // ====================================

    document.addEventListener(
        "salonbook:auth-changed",
        updateAuthHeader
    );

});
// ============================================================
// ĐỒNG BỘ LỊCH SỬ SALON VỪA XEM / TÌM KIẾM TRÊN TOÀN TRANG
// ============================================================
(function () {
  const HISTORY_KEY = "salonbook_recent_salons";
  const MAX_ITEMS = 3;

  window.SalonBookHistory = {
    getIds() {
      try {
        const raw = JSON.parse(localStorage.getItem(HISTORY_KEY));
        return Array.isArray(raw) ? raw.slice(0, MAX_ITEMS) : [];
      } catch (e) {
        return [];
      }
    },

    addSalons(matchedSalons) {
      if (!Array.isArray(matchedSalons) || matchedSalons.length === 0) return;
      const currentIds = this.getIds();
      const newIds = matchedSalons.map(s => Number(s.id)).filter(Boolean);

      const merged = [...newIds, ...currentIds]
        .filter((id, idx, arr) => arr.indexOf(id) === idx)
        .slice(0, MAX_ITEMS);

      localStorage.setItem(HISTORY_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("salonbook:history-updated"));
    },

    clear() {
      localStorage.removeItem(HISTORY_KEY);
      window.dispatchEvent(new Event("salonbook:history-updated"));
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Bắt sự kiện thanh tìm kiếm nhanh trên HEADER ở MỌI TRANG (nhấn Enter hoặc rời ô)
    const headerInput = document.getElementById("header-quick-search");
    if (headerInput) {
      const saveHeaderSearch = () => {
        if (typeof products === "undefined") return;
        const kw = headerInput.value.trim().toLowerCase();
        if (!kw) return;

        const matched = products.filter(s =>
          (s.name && s.name.toLowerCase().includes(kw)) ||
          (s.districtName && s.districtName.toLowerCase().includes(kw)) ||
          (s.address && s.address.toLowerCase().includes(kw))
        );
        window.SalonBookHistory.addSalons(matched.slice(0, MAX_ITEMS));
      };

      headerInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") saveHeaderSearch();
      });
      headerInput.addEventListener("change", saveHeaderSearch);
    }

    // 2. Bắt sự kiện tìm kiếm / lọc ở TRANG ĐẶT LỊCH (products.html)
    // (Tự bắt mọi form tìm kiếm hoặc ô input search trên trang products.html)
    if (window.location.pathname.includes("products.html")) {
      const productForms = document.querySelectorAll("form");
      productForms.forEach(form => {
        form.addEventListener("submit", function () {
          if (typeof products === "undefined") return;
          const textInput = form.querySelector("input[type='text'], input[type='search']");
          const areaEl = form.querySelector("select[name='area'], #area-select, #filter-area");
          const kw = textInput ? textInput.value.trim().toLowerCase() : "";
          const area = areaEl ? areaEl.value.trim().toLowerCase() : "";

          if (!kw && !area) return;

          const matched = products.filter(s => {
            const okKw = !kw ||
              (s.name && s.name.toLowerCase().includes(kw)) ||
              (s.address && s.address.toLowerCase().includes(kw));
            const okArea = !area ||
              (s.districtName && s.districtName.toLowerCase().includes(area)) ||
              (s.address && s.address.toLowerCase().includes(area));
            return okKw && okArea;
          });

          window.SalonBookHistory.addSalons(matched.slice(0, MAX_ITEMS));
        });
      });
    }
  });
})();
