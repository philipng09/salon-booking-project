/* SalonBook - Multi-salon appointment checkout (front-end DEMO only).
 * Dependencies: products.js, cart.js, optional auth.js.
 * Date/time and stylist are read from the cart: NEVER ask customer to select again.
 * Multiple services at the SAME salon + stylist + start time become ONE appointment;
 * the combined service duration is used when checking conflicts.
 */
(function (window) {
  'use strict';

  const DRAFT_KEY = 'salonbook_multi_booking_draft_v1';
  const RESULT_KEY = 'salonbook_multi_booking_result_v1';
  const CONTACT_KEY = 'salonbook_multi_booking_customer_v1';
  const $ = id => document.getElementById(id);
  const currency = value => Number(value || 0).toLocaleString('vi-VN') + ' ₫';
  const catalog = () => (typeof products !== 'undefined' && Array.isArray(products)) ? products : [];
  const findSalon = id => catalog().find(s => String(s.id) === String(id)) || null;
  const getItems = () => window.SalonCart?.getTotals?.().items || [];
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const formatDate = date => /^\d{4}-\d{2}-\d{2}$/.test(date || '')
    ? `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}` : 'Chưa chọn';

  function realDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const d = new Date(`${value}T12:00:00`);
    return !Number.isNaN(d.valueOf()) && d.getFullYear() === Number(value.slice(0, 4)) &&
      d.getMonth() + 1 === Number(value.slice(5, 7)) && d.getDate() === Number(value.slice(8, 10));
  }
  function minuteOf(time) {
    if (!/^\d{2}:\d{2}$/.test(time || '')) return null;
    const [hour, minute] = time.split(':').map(Number);
    return hour < 24 && minute < 60 ? hour * 60 + minute : null;
  }
  function timeFromDate(date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }
  function read(key) {
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) { return null; }
  }
  function write(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify(data)); return true; } catch (_) { return false; }
  }
  function node(tag, className, value) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value !== undefined) el.textContent = String(value);
    return el;
  }
  function issue(message, keys) {
    return { message, keys: (keys || []).map(String) };
  }

  function validate(items) {
    const problems = [];
    const groups = new Map();
    const rows = Array.isArray(items) ? items : [];
    if (!rows.length) return { ok: false, issues: [issue('Vui lòng tích chọn ít nhất một dịch vụ trong giỏ.')], appointments: [], total: 0 };

    for (const item of rows) {
      const key = String(item.key || `${item.salonId}:${item.serviceId}`);
      const salon = findSalon(item.salonId);
      const service = salon?.servicesList?.find(s => String(s.id) === String(item.serviceId));
      const stylistId = String(item.stylistId || '');
      const stylist = salon?.stylists?.find(s => String(s.id) === stylistId);
      const date = String(item.bookingDate || item.date || '');
      const time = String(item.bookingTime || item.time || '');
      const duration = Number(service?.duration);
      const price = Number(service?.price);
      const label = `${item.serviceName || service?.name || 'Dịch vụ'} – ${salon?.name || 'salon không xác định'}`;
      if (!salon || !service) {
        problems.push(issue(`${label}: không còn trong dữ liệu salon.`, [key]));
        continue;
      }
      if (!stylist || !realDate(date) || minuteOf(time) === null) {
        problems.push(issue(`${label}: thiếu chuyên viên, ngày hoặc giờ. Hãy chỉnh sửa lịch ở trang chi tiết salon.`, [key]));
        continue;
      }
      if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(price) || price < 0) {
        problems.push(issue(`${label}: bảng giá hoặc thời lượng dịch vụ không hợp lệ.`, [key]));
        continue;
      }
      if (date < today()) {
        problems.push(issue(`${label}: ngày đã qua.`, [key]));
        continue;
      }
      const start = new Date(`${date}T${time}:00`);
      if (!Number.isFinite(start.valueOf()) || !(start.valueOf() > Date.now())) {
        problems.push(issue(`${label}: khung giờ đã qua.`, [key]));
        continue;
      }
      const dayNames = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
      if (salon.openingHours?.closedDays?.includes(dayNames[start.getDay()])) {
        problems.push(issue(`${label}: salon đóng cửa vào ngày đã chọn.`, [key]));
        continue;
      }
      if (!Array.isArray(stylist.availableHours) || !stylist.availableHours.includes(time)) {
        problems.push(issue(`${label}: khung giờ không thuộc lịch mẫu của chuyên viên.`, [key]));
        continue;
      }
      const groupKey = [salon.id, date, time, stylist.id].join('|');
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          salonId: salon.id, salonName: salon.name, address: salon.address || '',
          date, time, stylistId: stylist.id, stylistName: stylist.name,
          startMs: start.getTime(), duration: 0, total: 0, services: [], keys: [],
          open: salon.openingHours?.open || '', close: salon.openingHours?.close || ''
        });
      }
      const appointment = groups.get(groupKey);
      appointment.services.push({ id: String(service.id), name: service.name, duration, price });
      appointment.keys.push(key);
      appointment.duration += duration;
      appointment.total += price;
    }

    const appointments = [...groups.values()].sort((a, b) => a.startMs - b.startMs);
    for (const appt of appointments) {
      appt.endMs = appt.startMs + appt.duration * 60000;
      appt.endTime = timeFromDate(new Date(appt.endMs));
      const startMin = minuteOf(appt.time);
      const openMin = minuteOf(appt.open);
      const closeMin = minuteOf(appt.close);
      if (openMin !== null && startMin < openMin)
        problems.push(issue(`${appt.salonName}: lịch ${appt.time} sớm hơn giờ mở cửa.`, appt.keys));
      if (closeMin !== null && startMin + appt.duration > closeMin)
        problems.push(issue(`${appt.salonName}: ${appt.services.length} dịch vụ kéo dài đến ${appt.endTime}, sau giờ đóng cửa ${appt.close}.`, appt.keys));
    }

    // Half-open intervals [start, end): adjacent appointments, e.g. 10:00 after 09:00–10:00, are allowed.
    for (let a = 0; a < appointments.length; a++) {
      for (let b = a + 1; b < appointments.length; b++) {
        const first = appointments[a], second = appointments[b];
        if (first.startMs < second.endMs && second.startMs < first.endMs) {
          problems.push(issue(
            `TRÙNG LỊCH: ${first.salonName} (${formatDate(first.date)}, ${first.time}–${first.endTime}) và ` +
            `${second.salonName} (${formatDate(second.date)}, ${second.time}–${second.endTime}). ` +
            'Hãy đổi thời gian tại trang chi tiết của một salon.',
            [...first.keys, ...second.keys]
          ));
        }
      }
    }

    return {
      ok: problems.length === 0, issues: problems,
      appointments,
      total: appointments.reduce((s, a) => s + a.total, 0),
      serviceCount: appointments.reduce((s, a) => s + a.services.length, 0),
      salonCount: new Set(appointments.map(a => String(a.salonId))).size
    };
  }

  function selectedFromCart() {
    const select = window.SalonBookCartSelection;
    return typeof select?.getSelectedItems === 'function' ? select.getSelectedItems() : [];
  }

  function setNotice(element, message) {
    if (!element) return;
    element.hidden = !message;
    element.textContent = message || '';
  }
  function markInvalid(keys) {
    const root = $('cart-items');
    if (!root) return;
    const invalid = new Set(keys.map(String));
    root.querySelectorAll('.cart-service-row').forEach(row =>
      row.classList.toggle('sb-batch-invalid', invalid.has(String(row.dataset.itemKey))));
  }
  function startFromCartItems(items) {
    const error = $('cart-batch-error');
    const check = validate(items);
    if (!check.ok) {
      setNotice(error, check.issues.map(x => x.message).join('\n\n'));
      markInvalid(check.issues.flatMap(x => x.keys));
      error?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    const draft = {
      selections: items.map(i => ({
        key: String(i.key), salonId: String(i.salonId), serviceId: String(i.serviceId),
        stylistId: String(i.stylistId), date: String(i.bookingDate || i.date),
        time: String(i.bookingTime || i.time)
      })),
      createdAt: new Date().toISOString()
    };
    if (!write(DRAFT_KEY, draft)) {
      setNotice(error, 'Không lưu được danh sách lịch trong trình duyệt.');
      return false;
    }
    sessionStorage.removeItem(RESULT_KEY);
    sessionStorage.removeItem(CONTACT_KEY);
    location.href = 'booking-multi-customer.html';
    return true;
  }

  function initCart() {
    const button = $('cart-book-all');
    if (!button) return;
    const error = $('cart-batch-error');
    function sync() {
      const selected = selectedFromCart();
      const salonCount = new Set(selected.map(i => String(i.salonId))).size;
      button.disabled = selected.length === 0;
      button.textContent = selected.length
        ? `Đặt ${selected.length} dịch vụ tại ${salonCount} salon →`
        : 'Tích chọn dịch vụ để đặt lịch';
      setNotice(error, '');
      markInvalid([]);
    }
    button.addEventListener('click', () => startFromCartItems(selectedFromCart()));
    window.addEventListener('salonbook:cart-selection-change', sync);
    window.addEventListener('saloncart:change', sync);
    sync();
  }

  function draftValidation() {
    const draft = read(DRAFT_KEY);
    if (!draft || !Array.isArray(draft.selections) || !draft.selections.length)
      return { ok: false, message: 'Chưa có lịch được chọn trong giỏ.' };
    const all = getItems();
    const chosen = [];
    for (const saved of draft.selections) {
      const current = all.find(x => String(x.key) === String(saved.key));
      if (!current || String(current.salonId) !== String(saved.salonId) ||
          String(current.serviceId) !== String(saved.serviceId) ||
          String(current.stylistId || '') !== String(saved.stylistId || '') ||
          String(current.bookingDate || current.date || '') !== String(saved.date || '') ||
          String(current.bookingTime || current.time || '') !== String(saved.time || '')) {
        return { ok: false, message: 'Giỏ hàng đã thay đổi kể từ khi bạn chọn lịch. Vui lòng quay lại giỏ và xác nhận lại.' };
      }
      chosen.push(current);
    }
    const evaluated = validate(chosen);
    if (!evaluated.ok) return { ok: false, message: evaluated.issues.map(x => x.message).join('\n\n') };
    return { ok: true, draft, evaluated };
  }

  function renderAppointments(root, appointments) {
    root.replaceChildren();
    for (const appt of appointments) {
      const card = node('article', 'sb-batch-appointment');
      const meta = node('div', 'sb-batch-appointment-meta');
      meta.append(node('h3', '', appt.salonName), node('span', 'sb-batch-date', formatDate(appt.date)));
      card.append(meta);
      card.append(node('p', 'sb-batch-address', appt.address || 'Địa chỉ đang cập nhật'));
      const rows = node('div', 'sb-batch-services');
      for (const service of appt.services) {
        const line = node('div', 'sb-batch-service-line');
        line.append(node('span', '', `${service.name} · ${service.duration} phút`),
          node('strong', '', currency(service.price)));
        rows.append(line);
      }
      card.append(rows);
      const footer = node('div', 'sb-batch-schedule');
      footer.append(node('span', '', `Chuyên viên: ${appt.stylistName}`),
        node('strong', '', `${appt.time}–${appt.endTime}`));
      card.append(footer);
      root.append(card);
    }
  }

  function prettyMoney(value) {
    return new Intl.NumberFormat('vi-VN').format(value) + 'đ';
  }
  function totalsText(evaluated) {
    const duration = evaluated.appointments.reduce((sum,a)=>sum+a.duration,0);
    return `${evaluated.serviceCount} dịch vụ · ${evaluated.salonCount} salon · ${duration} phút`;
  }
  function validateContact(data) {
    if (!data || typeof data !== 'object') return 'Vui lòng nhập thông tin khách hàng trước khi xác nhận.';
    if (String(data.name||'').trim().length < 2) return 'Họ tên cần ít nhất 2 ký tự.';
    if (!/^0[35789]\d{8}$/.test(String(data.phone||''))) return 'Số điện thoại Việt Nam phải gồm 10 chữ số hợp lệ.';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) return 'Email không hợp lệ.';
    return '';
  }
  function hideCheckout(message) {
    const status = $('sb-multi-status');
    setNotice(status, message);
    const grid = document.querySelector('.sb-fg-grid');
    if (grid) grid.hidden = true;
    if (status && !status.querySelector('a')) {
      status.append(document.createTextNode(' '));
      const a=node('a','','Quay lại giỏ hoặc nhập thông tin khách hàng');
      a.href='cart.html';
      status.append(a);
    }
  }
  function renderReviewAppointments(root, appointments) {
    if (!root) return;
    root.replaceChildren();
    for (const appt of appointments) {
      const card=node('article','sb-fg-appointment');
      const left=node('div','sb-fg-appointment-info');
      left.append(node('h3','',appt.salonName));
      left.append(node('p','sb-fg-appointment-services',appt.services.map(s=>s.name).join(', ')));
      left.append(node('p','sb-fg-appointment-meta',`${appt.time}–${appt.endTime} · ${formatDate(appt.date)} · ${appt.stylistName}`));
      card.append(left,node('strong','sb-fg-appointment-price',prettyMoney(appt.total)));
      root.append(card);
    }
  }
  function initCustomer() {
    const form=$('sb-multi-customer-form');
    if (!form) return;
    const active=draftValidation();
    if (!active.ok) { hideCheckout(active.message); return; }
    const evaluated=active.evaluated;
    $('sb-multi-total').textContent=prettyMoney(evaluated.total);
    $('sb-multi-count').textContent=totalsText(evaluated);
    const user=window.SalonBookAuth?.currentUser?.() || null;
    const prior=read(CONTACT_KEY) || {};
    form.elements.namedItem('name').value=prior.name||user?.fullName||user?.name||'';
    form.elements.namedItem('phone').value=prior.phone||user?.phone||'';
    form.elements.namedItem('email').value=prior.email||user?.email||'';
    form.elements.namedItem('note').value=prior.note||'';
    form.addEventListener('submit',event=>{
      event.preventDefault();
      setNotice($('sb-multi-error'),'');
      if (!form.reportValidity()) return;
      const contact={
        name:form.elements.namedItem('name').value.trim(),
        phone:form.elements.namedItem('phone').value.replace(/[\s().-]/g,''),
        email:form.elements.namedItem('email').value.trim(),
        note:form.elements.namedItem('note').value.trim()
      };
      const problem=validateContact(contact);
      if (problem) { setNotice($('sb-multi-error'),problem); return; }
      const again=draftValidation();
      if (!again.ok) { setNotice($('sb-multi-error'),again.message); return; }
      if (!write(CONTACT_KEY,contact)) { setNotice($('sb-multi-error'),'Không lưu được thông tin trong phiên trình duyệt.'); return; }
      location.href='booking-multi.html';
    });
  }
  function initCheckout() {
    const button=$('sb-multi-confirm');
    if (!button) return;
    const active=draftValidation();
    if (!active.ok) { hideCheckout(active.message); return; }
    const contact=read(CONTACT_KEY);
    const invalid=validateContact(contact);
    if (invalid) {
      hideCheckout(invalid);
      const status=$('sb-multi-status');
      if (status) { const link=status.querySelector('a'); if(link){link.href='booking-multi-customer.html';link.textContent='Điền thông tin khách hàng';} }
      return;
    }
    const evaluated=active.evaluated;
    $('sb-multi-review-name').textContent=contact.name;
    $('sb-multi-review-phone').textContent=contact.phone;
    $('sb-multi-review-email').textContent=contact.email||'Chưa cung cấp';
    renderReviewAppointments($('sb-multi-appointments'),evaluated.appointments);
    $('sb-multi-total').textContent=prettyMoney(evaluated.total);
    $('sb-multi-count').textContent=totalsText(evaluated);
    button.addEventListener('click',()=>{
      setNotice($('sb-multi-error'),'');
      const current=draftValidation();
      if (!current.ok) { setNotice($('sb-multi-error'),current.message); return; }
      const latestContact=read(CONTACT_KEY);
      const contactError=validateContact(latestContact);
      if (contactError) { setNotice($('sb-multi-error'),contactError); return; }
      const result={
        code:'SB-MULTI-DEMO-'+Date.now().toString(36).toUpperCase(),
        createdAt:new Date().toISOString(), status:'demo-local-only',
        total:current.evaluated.total, serviceCount:current.evaluated.serviceCount,
        // Personal customer details are deliberately not saved in the result.
        appointments:current.evaluated.appointments.map(a=>({
          salonId:a.salonId, salonName:a.salonName,address:a.address,
          stylistId:a.stylistId,stylistName:a.stylistName,
          date:a.date,time:a.time,endTime:a.endTime,total:a.total,services:a.services
        }))
      };
      if (!write(RESULT_KEY,result)) { setNotice($('sb-multi-error'),'Không lưu được yêu cầu demo.'); return; }
      sessionStorage.removeItem(CONTACT_KEY);
      sessionStorage.removeItem(DRAFT_KEY);
      location.href='booking-multi-result.html';
    });
  }
  function initResult() {
    const root = $('sb-multi-result-appointments');
    if (!root) return;
    const result = read(RESULT_KEY);
    if (!result || result.status !== 'demo-local-only' || !Array.isArray(result.appointments)) {
      setNotice($('sb-multi-result-missing'), 'Chưa có yêu cầu demo vừa tạo. Hãy bắt đầu từ giỏ dịch vụ.');
      return;
    }
    $('sb-multi-result-code').textContent = result.code;
    $('sb-multi-result-count').textContent = `${result.appointments.length} lịch tại ${new Set(result.appointments.map(a => String(a.salonId))).size} salon`;
    $('sb-multi-result-total').textContent = currency(result.total);
    renderReviewAppointments(root, result.appointments);
  }

  window.SalonBookMultiBooking = Object.freeze({validate, formatDate, currency, startFromCartItems});
  function init() { initCart(); initCustomer(); initCheckout(); initResult(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
