/* Chức năng tìm/lọc Salon trên index.html — không thay đổi giỏ hoặc booking. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof products === 'undefined' || !Array.isArray(products)) return;
    const section = document.getElementById('homepage-search-results');
    const grid = document.getElementById('homepage-result-grid');
    const count = document.getElementById('homepage-result-count');
    const description = document.getElementById('homepage-result-description');
    const empty = document.getElementById('homepage-result-empty');
    const form = document.getElementById('booking');
    if (!section || !grid) return;

    const params = new URLSearchParams(window.location.search);
    const normalize = v => String(v ?? '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
    const includes = (text, token) => normalize(text).includes(normalize(token));
    const serviceCodes = {
      'uon-nhuom': ['nhuom-toc'],
      'goi-duong-sinh': ['goi-thu-gian'],
      'phuc-hoi': ['phuc-hoi-toc'],
      'Cắt & tạo kiểu': ['cat-tao-kieu'],
      'Nhuộm tóc': ['nhuom-toc'],
      'Gội & thư giãn': ['goi-thu-gian'],
      'Phục hồi tóc': ['phuc-hoi-toc']
    };
    const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const qs = name => params.get(name) || '';
    const area = document.getElementById('area-select');
    const service = document.getElementById('service-select');
    const date = document.getElementById('booking-date');
    const knownAreas = ['Quận 1','Quận 3','Quận 5','Quận 7','Quận 10','Bình Thạnh','Gò Vấp'];

    function matching(s, filters) {
      const fullText = [s.name,s.address,s.districtName,s.category,s.description].join(' ');
      if (filters.q && !includes(fullText, filters.q)) return false;
      if (filters.type && s.salonType !== filters.type) return false;
      if (filters.area) {
        const a = filters.area;
        const matchedArea = a === 'Khu vực khác'
          ? !knownAreas.some(k => includes(s.districtName, k))
          : includes(s.districtName, a) || includes(s.address, a);
        if (!matchedArea) return false;
      }
      if (filters.service) {
        const codes = serviceCodes[filters.service];
        const offered = Array.isArray(s.servicesList) ? s.servicesList : [];
        const ok = offered.some(item => codes
          ? codes.includes(item.value)
          : includes(item.name, filters.service) || includes(item.value, filters.service));
        if (!ok) return false;
      }
      return true;
    }

    function render() {
      const f = {q:qs('q'),type:qs('type'),area:qs('area'),service:qs('service'),date:qs('date')};
      const active = params.has('filter') || Object.values(f).some(Boolean);
      if (!active) return;
      if (area && f.area && [...area.options].some(o => o.value === f.area)) area.value = f.area;
      if (service && f.service && [...service.options].some(o => o.value === f.service)) service.value = f.service;
      if (date && f.date) date.value = f.date;
      section.hidden = false;
      const matched = products.filter(s => matching(s,f));
      count.textContent = `Tìm thấy ${matched.length} salon phù hợp`;
      const what = [f.q && `từ khóa “${f.q}”`,f.area && `khu vực ${f.area}`,f.service && `dịch vụ ${f.service}`,f.type && `loại salon ${f.type}`].filter(Boolean);
      description.textContent = (what.length ? 'Kết quả theo ' + what.join(' · ') + '. ' : 'Danh sách salon hiện có. ') +
        (f.date ? `Ngày dự kiến: ${f.date}. Chưa xác nhận lịch trống; vui lòng kiểm tra khi chọn salon.` : 'Nhấn xem chi tiết để tiếp tục chọn dịch vụ và đặt lịch.');
      grid.innerHTML = matched.map(s => `<article class="salon-card">
        <div class="salon-art"><img src="${esc(s.image)}" alt="${esc(s.name)}" loading="lazy" onerror="this.src='images/salonbook-mark.png'"></div>
        <div class="salon-card-body"><span class="salon-type">${esc(s.category || 'SALON TÓC')} · ${esc(s.districtName)}</span>
        <h3>${esc(s.name)}</h3><p class="card-rating">⭐ ${esc(s.rating)} (${esc(s.reviewCount)} đánh giá)</p>
        <p>📍 ${esc(s.address)}</p>
        <div class="salon-card-footer-links"><a class="salon-card-link" href="product-detail.html?salonId=${encodeURIComponent(s.id)}">Xem chi tiết Salon ↗</a></div>
        </div></article>`).join('');
      if (empty) empty.hidden = matched.length > 0;
      document.querySelectorAll('.filter-chips-bar .filter-chip').forEach(chip => {
        const url = new URL(chip.href, location.href);
        const activeChip = ['type','service'].some(key => url.searchParams.has(key) && url.searchParams.get(key) === f[key]) ||
          (url.searchParams.get('filter') === 'all' && !f.type && !f.service);
        chip.classList.toggle('active', activeChip);
      });
      if (window.SalonBookHistory && matched.length) window.SalonBookHistory.addSalons(matched.slice(0, 3));
      if (window.location.hash === '#homepage-search-results' || active) {
        requestAnimationFrame(() => section.scrollIntoView({behavior:'auto',block:'start'}));
      }
    }
    if (form) form.addEventListener('submit', function (event) {
      event.preventDefault();
      const next = new URLSearchParams();
      if (area?.value) next.set('area',area.value);
      if (service?.value) next.set('service',service.value);
      if (date?.value) next.set('date',date.value);
      if (!next.toString()) return;
      window.location.assign('index.html?' + next.toString() + '#homepage-search-results');
    },true);
    render();
  });
})();
