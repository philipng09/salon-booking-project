/* SalonBook – chọn NHIỀU dịch vụ bằng checkbox ở trang chi tiết salon.
 * Cần nạp sau product-detail.js và trước booking-entry.js / booking-bridge.js.
 * Không sửa dữ liệu products.js, không tạo lịch hẹn thật.
 */
(function () {
  'use strict';

  const DRAFT_KEY = 'salonbook_pending_booking';
  const CONTACT_KEY = 'salonbook_booking_customer_v1';
  const RESULT_KEY = 'salonbook_booking_demo_result_v1';
  const $ = id => document.getElementById(id);
  // Đăng ký capture NGAY LÚC TẢI SCRIPT, trước booking-entry.js / booking-bridge.js.
  let bookingHandler = null;
  document.addEventListener('click', event => {
    if (bookingHandler) bookingHandler(event);
  }, true);
  const money = value => Number(value || 0).toLocaleString('vi-VN') + ' ₫';

  function getSalon() {
    const params = new URLSearchParams(location.search);
    const id = params.get('salonId') || params.get('id') || params.get('salon') || '1';
    const list = typeof products !== 'undefined' && Array.isArray(products) ? products : [];
    return list.find(s => String(s.id) === String(id) || String(s.slug) === String(id)) || null;
  }

  function getSelectedTime() {
    const buttons = [...document.querySelectorAll('#detail-time-grid .btn-time-slot')];
    const active = buttons.find(b => b.getAttribute('aria-pressed') === 'true' ||
      /255,\s*197,\s*1/.test(b.style.backgroundColor) ||
      /#ffc501/i.test(b.style.backgroundColor));
    return active?.dataset.time || '';
  }

  function localToday() {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')].join('-');
  }

  function timeMinutes(time) {
    if (!/^\d{2}:\d{2}$/.test(time || '')) return null;
    const [hour, minute] = time.split(':').map(Number);
    return hour < 24 && minute < 60 ? hour * 60 + minute : null;
  }

  function scheduleError(salon, services, stylistId, date, time) {
    if (!stylistId) return 'Vui lòng chọn chuyên viên.';
    const stylist = (salon.stylists || []).find(s => String(s.id) === String(stylistId));
    if (!stylist) return 'Chuyên viên không hợp lệ.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || date < localToday())
      return 'Vui lòng chọn ngày hợp lệ.';
    const day = new Date(date + 'T12:00:00');
    if (Number.isNaN(day.getTime()) ||
      day.getFullYear() !== Number(date.slice(0, 4)) ||
      day.getMonth() + 1 !== Number(date.slice(5, 7)) ||
      day.getDate() !== Number(date.slice(8, 10))) return 'Ngày không hợp lệ.';
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    if (salon.openingHours?.closedDays?.includes(dayNames[day.getDay()]))
      return 'Salon nghỉ vào ngày này.';
    if (!Array.isArray(stylist.availableHours) || !stylist.availableHours.includes(time))
      return 'Vui lòng chọn khung giờ trống của chuyên viên.';
    const start = new Date(date + 'T' + time + ':00');
    if (!(start.getTime() > Date.now())) return 'Khung giờ đã qua, vui lòng chọn lại.';
    const beginning = timeMinutes(time);
    const open = timeMinutes(salon.openingHours?.open);
    const close = timeMinutes(salon.openingHours?.close);
    const duration = services.reduce((sum, service) => sum + (Number(service.duration) || 0), 0);
    if (open !== null && beginning < open) return 'Giờ hẹn trước giờ salon mở cửa.';
    if (close !== null && beginning + duration > close)
      return 'Tổng thời lượng dịch vụ vượt quá giờ salon đóng cửa. Chọn giờ sớm hơn.';
    return '';
  }

  function notice(message, isError) {
    const box = $('booking-bridge-notice');
    if (box) {
      box.hidden = false;
      box.textContent = message;
      box.classList.toggle('error', Boolean(isError));
    } else {
      alert(message);
    }
  }

  function init() {
    const salon = getSalon();
    const select = $('detail-service-select');
    const field = select?.closest('.detail-field');
    const services = salon?.servicesList || [];
    if (!field || !select || !services.length || $('sb-service-checkboxes')) return;

    // Giữ nguyên select cũ ẩn đi: các module và ?serviceId= vẫn đọc được ID dịch vụ đầu tiên.
    const title = field.querySelector('label[for="detail-service-select"]');
    if (title) { title.removeAttribute('for'); title.id = 'sb-service-checkbox-label';
      title.textContent = '01. Chọn dịch vụ (có thể tích nhiều)'; }
    const grid = document.createElement('div');
    grid.id = 'sb-service-checkboxes';
    grid.className = 'sb-service-checkboxes';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-labelledby', 'sb-service-checkbox-label');
    select.insertAdjacentElement('beforebegin', grid);

    const footer = document.createElement('div');
    footer.className = 'sb-check-footer';
    const count = document.createElement('span');
    count.id = 'sb-service-selected-count';
    count.setAttribute('aria-live', 'polite');
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'sb-service-clear';
    clear.textContent = 'Bỏ chọn tất cả';
    footer.append(count, clear);
    grid.insertAdjacentElement('afterend', footer);

    let restoring = false;
    const moneyTotal = $('summary-price');
    const summaryNames = $('summary-service-name');

    const checks = new Map();
    const cardChecks = new Map();

    function ids() {
      return services.filter(service => checks.get(String(service.id))?.checked)
        .map(service => String(service.id));
    }
    function selectedServices() { const chosen = new Set(ids());
      return services.filter(service => chosen.has(String(service.id))); }
    function paint() {
      const selected = selectedServices();
      count.textContent = `Đã chọn ${selected.length} dịch vụ · ${money(selected.reduce((s, service) => s + Number(service.price || 0), 0))}`;
      if (summaryNames) summaryNames.textContent = selected.length ? selected.map(x => x.name).join(' + ') : 'Chưa chọn dịch vụ';
      if (moneyTotal) moneyTotal.textContent = selected.length ? money(selected.reduce((sum, s) => sum + Number(s.price || 0), 0)) : 'Chưa chọn';
      for (const service of services) {
        const id = String(service.id);
        const checked = checks.get(id)?.checked || false;
        checks.get(id)?.closest('.sb-service-option')?.classList.toggle('is-checked', checked);
        const card = cardChecks.get(id);
        if (card) { card.checked = checked; card.closest('.detail-service-card')?.classList.toggle('sb-card-selected', checked); }
      }
    }
    function sync() {
      if (!restoring) {
        const first = ids()[0] || '';
        if (select.value !== first) {
          select.value = first;
          restoring = true;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          restoring = false;
        }
      }
      paint();
    }

    services.forEach(service => {
      const id = String(service.id);
      const label = document.createElement('label');
      label.className = 'sb-service-option';
      const input = document.createElement('input');
      input.type = 'checkbox'; input.name = 'sb-services'; input.value = id;
      input.setAttribute('aria-label', 'Chọn dịch vụ ' + service.name);
      const detail = document.createElement('span'); detail.className = 'sb-service-name';
      const name = document.createElement('strong'); name.textContent = service.name;
      const duration = document.createElement('small'); duration.textContent = (Number(service.duration) || 0) + ' phút';
      detail.append(name, duration);
      const price = document.createElement('span'); price.className = 'sb-service-price'; price.textContent = money(service.price);
      label.append(input, detail, price);
      grid.append(label);
      checks.set(id, input);
      input.addEventListener('change', sync);

      // Thẻ bảng giá ở phía trên cũng có checkbox; tích ở đâu cũng đồng bộ.
      const card = [...document.querySelectorAll('#detail-service-grid .detail-service-card')]
        .find(el => el.dataset.serviceId === id);
      if (card) {
        const cardLabel = document.createElement('label'); cardLabel.className = 'sb-card-check';
        const cardInput = document.createElement('input'); cardInput.type = 'checkbox'; cardInput.value = id;
        const caption = document.createElement('span'); caption.textContent = 'Chọn dịch vụ';
        cardLabel.append(cardInput, caption);
        card.append(cardLabel);
        cardChecks.set(id, cardInput);
        cardInput.addEventListener('change', () => { input.checked = cardInput.checked; sync(); });
      }
    });

    const params = new URLSearchParams(location.search);
    const rawDraft = (() => { try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null'); } catch (_) { return null; } })();
    const fromCart = rawDraft && String(rawDraft.salonId) === String(salon.id) && rawDraft.source === 'cart'
      && Array.isArray(rawDraft.serviceIds) ? rawDraft.serviceIds.map(String) : [];
    const first = select.value;
    const initial = params.get('editKey') ? [first] : fromCart.length ? fromCart : first ? [first] : [];
    initial.forEach(id => { if (checks.has(id)) checks.get(id).checked = true; });

    // Những click “↗” trong bảng giá hiện tại vẫn chọn dịch vụ, nhưng thay vì thay thế sẽ tích thêm.
    document.querySelectorAll('#detail-service-grid .btn-pick-service').forEach(anchor => {
      anchor.addEventListener('click', () => {
        const input = checks.get(String(anchor.dataset.serviceId));
        if (input && !input.checked) { input.checked = true; sync(); }
      });
    });

    select.addEventListener('change', () => {
      if (restoring) return;
      const input = checks.get(String(select.value));
      if (input) { input.checked = true; paint(); }
    });
    // product-detail.js cập nhật tóm tắt khi chọn stylist/ngày; vẽ lại tổng N dịch vụ sau đó.
    ['detail-stylist-select', 'detail-date'].forEach(id => $(id)?.addEventListener('change', () => {
      queueMicrotask(paint);
    }));
    clear.addEventListener('click', () => {
      checks.forEach(input => { input.checked = false; });
      sync();
    });

    function handleBookingClick(event) {
      const target = event.target instanceof Element ? event.target.closest('#add-to-cart-btn,#direct-booking-btn') : null;
      if (!target) return;
      // Chặn listener cũ trước khi chúng lưu 1 dịch vụ duy nhất.
      event.preventDefault();
      event.stopImmediatePropagation();
      const chosen = selectedServices();
      if (!chosen.length) { notice('Vui lòng tích chọn ít nhất một dịch vụ.', true); return; }
      const stylistId = $('detail-stylist-select')?.value || '';
      const date = $('detail-date')?.value || '';
      const time = getSelectedTime();
      const complete = Boolean(stylistId && date && time);
      const invalid = complete ? scheduleError(salon, chosen, stylistId, date, time) : '';
      if (target.id === 'add-to-cart-btn') {
        if (!window.SalonCart) { notice('Giỏ dịch vụ chưa sẵn sàng.', true); return; }
        const booking = complete && !invalid ? { stylistId, date, time } : null;
        const editKey = params.get('editKey');
        const cartEntry = editKey && window.SalonCart.getCart().find(item => item.key === editKey);
        let saved = 0;
        for (const service of chosen) {
          let okay;
          if (cartEntry && String(cartEntry.serviceId) === String(service.id) && booking) {
            okay = window.SalonCart.updateBooking(editKey, { ...booking, serviceId: String(service.id) });
          } else {
            okay = window.SalonCart.addToCart(salon.id, service.id, 1, booking);
          }
          if (okay) saved++;
        }
        notice(saved === chosen.length
          ? `Đã thêm ${saved} dịch vụ vào giỏ.${booking ? ' Đã lưu lịch dự kiến.' : ' Bạn có thể chọn lịch sau.'}`
          : `Đã lưu ${saved}/${chosen.length} dịch vụ. Vui lòng kiểm tra giỏ.`, saved !== chosen.length);
        return;
      }
      if (!complete) { notice('Vui lòng chọn chuyên viên, ngày và khung giờ trước khi đặt lịch.', true); return; }
      if (invalid) { notice(invalid, true); return; }
      const idList = chosen.map(s => String(s.id));
      const draft = {
        salonId: salon.id, serviceIds: idList,
        selections: idList.map(serviceId => ({ serviceId, stylistId, date, time })),
        source: 'direct', createdAt: new Date().toISOString()
      };
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        sessionStorage.removeItem(CONTACT_KEY);
        sessionStorage.removeItem(RESULT_KEY);
      } catch (_) { notice('Không thể lưu lựa chọn trong phiên trình duyệt.', true); return; }
      const targetPage = 'booking-customer.html';
      if (window.SalonBookAuth && !window.SalonBookAuth.currentUser()) {
        location.href = 'auth.html?returnTo=' + encodeURIComponent(targetPage);
      } else {
        location.href = targetPage;
      }
    }

    bookingHandler = handleBookingClick;
    field.classList.add('sb-multiselect-ready');
    paint();
    window.SalonBookCheckedServices = Object.freeze({ getIds: () => ids(), getServices: () => selectedServices() });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
