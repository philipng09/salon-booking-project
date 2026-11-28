/* SalonBook - bảng điều khiển chủ salon The Hair Space (Frontend demo). */
(function () {
  'use strict';

  const SALON_ID = 1;
  const OWNER_EMAIL = 'owner1@salonbook.test';
  const KEYS = {
    user: 'currentUser',
    salon: 'salonbook.salon.1.profile.v1',
    stylists: 'salonbook.salon.1.stylists.v1',
    services: 'salonbook.salon.1.services.v1',
    bookings: 'salonbook.salon.1.bookings.v1',
    hairModels: 'hair_models',
    applications: 'hair_model_applications',
  };

  const DAY_LIST = [
    { key: 'T2', label: 'Thứ 2' }, { key: 'T3', label: 'Thứ 3' },
    { key: 'T4', label: 'Thứ 4' }, { key: 'T5', label: 'Thứ 5' },
    { key: 'T6', label: 'Thứ 6' }, { key: 'T7', label: 'Thứ 7' },
    { key: 'CN', label: 'Chủ nhật' },
  ];
  const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  ];
  const SHIFTS = {
    morning: ['08:00', '09:00', '10:00', '11:00'],
    afternoon: ['13:00', '14:00', '15:00', '16:00'],
    evening: ['17:00', '18:00', '19:00'],
  };
  const STATUS_LABELS = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  const state = {
    user: null,
    salon: null,
    stylists: [],
    services: [],
    bookings: [],
    hairModels: [],
    applications: [],
    selectedStylistId: null,
    bookingStatus: 'all',
    bookingDate: '',
  };

  const $ = id => document.getElementById(id);

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char]);
  }

  function localISO(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDays(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return localISO(date);
  }

  function dayKey(dateString) {
    const day = new Date(`${dateString}T12:00:00`).getDay();
    return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][day];
  }

  function formatDate(dateString) {
    if (!dateString) return '—';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  function money(value) {
    return Number(value || 0).toLocaleString('vi-VN') + ' ₫';
  }

  function initials(name) {
    return String(name || '?').trim().split(/\s+/).slice(-2)
      .map(part => part[0] || '').join('').toUpperCase();
  }

  function sourceSalon() {
    if (typeof products !== 'undefined' && Array.isArray(products)) {
      return products.find(item => Number(item.id) === SALON_ID) || null;
    }
    return null;
  }

  function sourceHairModels() {
    if (typeof hairModels !== 'undefined' && Array.isArray(hairModels)) {
      return hairModels.filter(item => Number(item.salonId) === SALON_ID);
    }
    return [];
  }

  function buildWeeklyHours(hours) {
    if (hours && !Array.isArray(hours) && typeof hours === 'object') {
      const result = {};
      DAY_LIST.forEach(day => {
        result[day.key] = [...new Set(hours[day.key] || [])].sort();
      });
      return result;
    }
    const times = Array.isArray(hours) ? hours : [];
    const result = {};
    DAY_LIST.forEach(day => { result[day.key] = [...times]; });
    return result;
  }

  function sourceDefaults() {
    const source = sourceSalon() || {
      id: 1,
      name: 'The Hair Space',
      address: '34 Phó Đức Chính, Phường Bến Thành, Quận 1, TP.HCM',
      description: 'Salon tóc phong cách Hàn Quốc, chuyên cắt tạo kiểu và uốn nhuộm.',
      openingHours: { open: '09:00', close: '20:00', closedDays: [] },
      stylists: [], servicesList: [],
    };

    const profile = {
      salonId: 1,
      name: source.name,
      address: source.address,
      phone: source.phone || '0909 123 456',
      description: source.description || '',
      openTime: source.openingHours?.open || '09:00',
      closeTime: source.openingHours?.close || '20:00',
      openingHours: { ...(source.openingHours || {}) },
    };

    const stylists = (source.stylists || []).map(item => ({
      id: String(item.id),
      stylistId: String(item.id),
      salonId: SALON_ID,
      name: item.name,
      experience: item.experience || 'Chuyên viên',
      specialty: item.experience || 'Stylist',
      status: 'active',
      availableHours: buildWeeklyHours(item.availableHours),
    }));

    const services = (source.servicesList || []).map(item => ({
      id: String(item.id),
      serviceId: String(item.id),
      salonId: SALON_ID,
      name: item.name,
      duration: Number(item.duration || 0),
      price: Number(item.price || 0),
      value: item.value || '',
      status: 'active',
    }));

    return { profile, stylists, services };
  }

  function demoBookings(stylists, services) {
    if (!stylists.length || !services.length) return [];
    const rows = [];
    const customers = [
      ['Nguyễn Lan', '0912 345 678'],
      ['Trần Hùng', '0909 888 777'],
      ['Lê Mai', '0933 222 111'],
      ['Phạm Quỳnh', '0987 654 321'],
    ];

    for (let index = 0; index < Math.min(4, stylists.length + 1); index += 1) {
      const stylist = stylists[index % stylists.length];
      const date = addDays(index + 1);
      const times = stylist.availableHours[dayKey(date)] || [];
      const time = times[index % Math.max(times.length, 1)] || times[0] || '10:00';
      const service = services[index % services.length];
      rows.push({
        bookingId: `BK-DEMO-${String(index + 1).padStart(3, '0')}`,
        id: `BK-DEMO-${String(index + 1).padStart(3, '0')}`,
        salonId: SALON_ID,
        stylistId: stylist.stylistId,
        serviceId: service.serviceId,
        serviceIds: [service.serviceId],
        customerName: customers[index][0],
        phone: customers[index][1],
        email: '',
        date,
        time,
        status: 'confirmed',
        note: 'Lịch hẹn minh họa trong bản demo.',
        source: 'dashboard-demo',
      });
    }
    return rows;
  }

  function normalizeBookings(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item, index) => {
      const bookingId = String(item.bookingId || item.id || `BK-${Date.now()}-${index}`);
      return {
        ...item,
        id: bookingId,
        bookingId,
        salonId: Number(item.salonId || SALON_ID),
        stylistId: String(item.stylistId || ''),
        serviceId: String(item.serviceId || item.serviceIds?.[0] || ''),
        status: item.status || 'confirmed',
      };
    }).filter(item => item.salonId === SALON_ID);
  }

  function loadData() {
    const defaults = sourceDefaults();
    state.salon = read(KEYS.salon, defaults.profile);
    state.stylists = read(KEYS.stylists, defaults.stylists);
    state.services = read(KEYS.services, defaults.services);
    state.stylists = Array.isArray(state.stylists) ? state.stylists.map(item => ({
      ...item,
      id: String(item.stylistId || item.id),
      stylistId: String(item.stylistId || item.id),
      salonId: SALON_ID,
      availableHours: buildWeeklyHours(item.availableHours),
      status: item.status || 'active',
    })) : [];
    state.services = Array.isArray(state.services) ? state.services.map(item => ({
      ...item,
      id: String(item.serviceId || item.id),
      serviceId: String(item.serviceId || item.id),
      salonId: SALON_ID,
      status: item.status || 'active',
    })) : [];

    const storedBookings = read(KEYS.bookings, null);
    state.bookings = storedBookings === null
      ? demoBookings(state.stylists, state.services)
      : normalizeBookings(storedBookings);

    const baseModels = sourceHairModels().map(item => ({
      ...item,
      id: String(item.hairModelId || item.id),
      hairModelId: String(item.hairModelId || item.id),
      salonId: SALON_ID,
    }));
    state.hairModels = read(KEYS.hairModels, baseModels);
    if (!Array.isArray(state.hairModels)) state.hairModels = baseModels;
    state.hairModels = state.hairModels.filter(item => Number(item.salonId) === SALON_ID);

    const storedApplications = read(KEYS.applications, null);
    state.applications = Array.isArray(storedApplications) ? storedApplications : [
      {
        applicationId: 'APP-DEMO-001', hairModelId: state.hairModels[0]?.hairModelId || '',
        salonId: SALON_ID, applicantName: 'Ngọc Diệp', phone: '0912 111 222',
        note: 'Tóc dài 25cm, chưa qua xử lý hóa chất.', date: addDays(-2), status: 'pending',
      },
      {
        applicationId: 'APP-DEMO-002', hairModelId: state.hairModels[0]?.hairModelId || '',
        salonId: SALON_ID, applicantName: 'Kim Ngân', phone: '0933 444 555',
        note: 'Có thể đến vào cuối tuần.', date: addDays(-1), status: 'pending',
      },
    ];

    state.selectedStylistId = state.stylists[0]?.stylistId || null;
    write(KEYS.salon, state.salon);
    write(KEYS.stylists, state.stylists);
    write(KEYS.services, state.services);
    write(KEYS.bookings, state.bookings);
    write(KEYS.hairModels, state.hairModels);
    write(KEYS.applications, state.applications);
  }

  function save(key, value) {
    write(KEYS[key], value);
    window.dispatchEvent(new CustomEvent('salonbook:salon-data-updated', {
      detail: { salonId: SALON_ID, type: key },
    }));
    if (window.SalonBookSharedData?.refresh) window.SalonBookSharedData.refresh();
  }

  function toast(message) {
    const root = $('toast-root');
    if (!root) return;
    const item = document.createElement('div');
    item.className = 'toast-message';
    item.textContent = message;
    root.appendChild(item);
    window.setTimeout(() => item.remove(), 2400);
  }

  function show(el, visible) {
    if (!el) return;
    el.classList.toggle('hidden', !visible);
  }

  function checkAuth() {
    const user = read(KEYS.user, null);
    const isOwner = user && user.role === 'salon_owner';
    const isTargetOwner = user && (
      Number(user.salonId) === SALON_ID ||
      String(user.email || '').toLowerCase() === OWNER_EMAIL
    );

    if (!isOwner || !isTargetOwner) {
      show($('auth-guard'), true);
      show($('dashboard'), false);
      return false;
    }

    // Một số phiên đăng nhập cũ chưa lưu salonId; email demo xác định salon đại diện.
    state.user = { ...user, salonId: SALON_ID };
    show($('auth-guard'), false);
    show($('dashboard'), true);
    return true;
  }

  function getService(id) {
    return state.services.find(item => String(item.serviceId) === String(id)) || null;
  }

  function getStylist(id) {
    return state.stylists.find(item => String(item.stylistId) === String(id)) || null;
  }

  function renderHeader() {
    $('owner-email').textContent = state.user.email || state.user.fullName || 'Chủ salon';
    $('owner-salon').textContent = state.salon.name || 'The Hair Space';
    $('owner-avatar').textContent = initials(state.salon.name || 'TH');
    $('today-pill').textContent = new Date().toLocaleDateString('vi-VN', {
      weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  function bookingRow(booking, showActions) {
    const service = getService(booking.serviceId);
    const stylist = getStylist(booking.stylistId);
    let actions = '';
    if (showActions) {
      if (booking.status === 'pending') {
        actions += `<button class="btn btn-success btn-sm" data-booking-action="confirm" data-id="${escapeHTML(booking.bookingId)}">Xác nhận</button>`;
      }
      if (booking.status === 'confirmed') {
        actions += `<button class="btn btn-primary btn-sm" data-booking-action="complete" data-id="${escapeHTML(booking.bookingId)}">Hoàn thành</button>`;
      }
      if (['pending', 'confirmed'].includes(booking.status)) {
        actions += `<button class="btn btn-ghost btn-sm" data-booking-action="cancel" data-id="${escapeHTML(booking.bookingId)}">Hủy</button>`;
      }
    }
    return `<tr>
      <td>${escapeHTML(booking.customerName || 'Khách hàng')}</td>
      <td>${escapeHTML(booking.phone || '—')}</td>
      <td>${escapeHTML(service?.name || booking.serviceName || '—')}</td>
      <td>${escapeHTML(stylist?.name || '—')}</td>
      <td>${formatDate(booking.date)}</td>
      <td>${escapeHTML(booking.time || '—')}</td>
      <td><span class="badge badge-${escapeHTML(booking.status)}">${STATUS_LABELS[booking.status] || escapeHTML(booking.status)}</span></td>
      ${showActions ? `<td class="actions-cell"><div class="recruit-actions">${actions}</div></td>` : ''}
    </tr>`;
  }

  function renderOverview() {
    const today = localISO();
    const todayBookings = state.bookings.filter(item => item.date === today);
    const pending = state.bookings.filter(item => item.status === 'pending').length;
    const confirmed = state.bookings.filter(item => item.status === 'confirmed').length;
    const completed = state.bookings.filter(item => item.status === 'completed').length;
    const revenue = state.bookings
      .filter(item => item.status === 'completed')
      .reduce((sum, item) => sum + Number(getService(item.serviceId)?.price || item.total || 0), 0);

    const stats = [
      { label: 'Lịch hẹn hôm nay', value: todayBookings.length, note: `${todayBookings.filter(item => item.status === 'confirmed').length} đã xác nhận` },
      { label: 'Chờ xác nhận', value: pending, note: 'Cần xử lý' },
      { label: 'Lịch đã xác nhận', value: confirmed, note: 'Đang chờ phục vụ' },
      { label: 'Doanh thu hoàn thành', value: money(revenue), note: `${completed} lịch đã hoàn thành` },
    ];
    $('stats-grid').innerHTML = stats.map(item => `
      <div class="stat-card"><div class="stat-label">${item.label}</div>
      <div class="stat-value">${item.value}</div><div class="stat-trend">${item.note}</div></div>
    `).join('');

    const upcoming = [...state.bookings]
      .filter(item => item.status === 'confirmed' && item.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 6);
    $('today-bookings').innerHTML = upcoming.length
      ? `<div class="table-wrap"><table><thead><tr><th>Khách</th><th>Liên hệ</th><th>Dịch vụ</th><th>Stylist</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th></tr></thead><tbody>${upcoming.map(item => bookingRow(item, false)).join('')}</tbody></table></div>`
      : '<div class="empty">Chưa có lịch hẹn sắp tới.</div>';
  }

  function renderBookings() {
    let list = [...state.bookings];
    if (state.bookingStatus !== 'all') list = list.filter(item => item.status === state.bookingStatus);
    if (state.bookingDate) list = list.filter(item => item.date === state.bookingDate);
    list.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

    $('bookings-table').innerHTML = list.length
      ? `<div class="table-wrap"><table><thead><tr><th>Khách</th><th>Liên hệ</th><th>Dịch vụ</th><th>Stylist</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${list.map(item => bookingRow(item, true)).join('')}</tbody></table></div>`
      : '<div class="empty">Không có lịch hẹn phù hợp với bộ lọc.</div>';

    $('bookings-table').querySelectorAll('[data-booking-action]').forEach(button => {
      button.addEventListener('click', () => changeBookingStatus(button.dataset.id, button.dataset.bookingAction));
    });
  }

  function changeBookingStatus(bookingId, action) {
    const booking = state.bookings.find(item => item.bookingId === bookingId);
    if (!booking) return;
    if (action === 'cancel' && !window.confirm(`Hủy lịch hẹn của ${booking.customerName || 'khách hàng'}?`)) return;
    const statusMap = { confirm: 'confirmed', complete: 'completed', cancel: 'cancelled' };
    if (!statusMap[action]) return;
    booking.status = statusMap[action];
    save('bookings', state.bookings);
    renderBookings();
    renderOverview();
    toast('Đã cập nhật trạng thái lịch hẹn.');
  }

  function totalSlots(stylist) {
    return Object.values(stylist.availableHours || {}).reduce((sum, times) => sum + times.length, 0);
  }

  function renderStylistList() {
    const root = $('stylist-list');
    if (!state.stylists.length) {
      root.innerHTML = '<div class="empty">Chưa có stylist nào.</div>';
      $('stylist-editor').innerHTML = '<div class="empty">Thêm stylist để thiết lập khung giờ.</div>';
      return;
    }
    root.innerHTML = state.stylists.map(stylist => `
      <div class="stylist-item ${stylist.stylistId === state.selectedStylistId ? 'active' : ''}">
        <button type="button" class="stylist-select" data-select-stylist="${escapeHTML(stylist.stylistId)}">
          <span class="stylist-avatar">${escapeHTML(initials(stylist.name))}</span>
          <span><span class="stylist-name">${escapeHTML(stylist.name)}</span><br><span class="stylist-meta">${totalSlots(stylist)} khung giờ mở</span></span>
        </button>
        <span class="stylist-item-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-edit-stylist="${escapeHTML(stylist.stylistId)}">Sửa</button>
          <button class="btn btn-ghost btn-sm" type="button" data-delete-stylist="${escapeHTML(stylist.stylistId)}">Xóa</button>
        </span>
      </div>`).join('');

    root.querySelectorAll('[data-select-stylist]').forEach(button => button.addEventListener('click', () => {
      state.selectedStylistId = button.dataset.selectStylist;
      renderStylistList();
      renderStylistEditor();
    }));
    root.querySelectorAll('[data-edit-stylist]').forEach(button => button.addEventListener('click', () => {
      openStylistModal(getStylist(button.dataset.editStylist));
    }));
    root.querySelectorAll('[data-delete-stylist]').forEach(button => button.addEventListener('click', () => {
      deleteStylist(button.dataset.deleteStylist);
    }));
  }

  function renderStylistEditor() {
    const root = $('stylist-editor');
    const stylist = getStylist(state.selectedStylistId);
    if (!stylist) {
      root.innerHTML = '<div class="empty">Chọn một stylist để thiết lập giờ làm việc.</div>';
      return;
    }

    root.innerHTML = `
      <div class="card-head"><div><h2>${escapeHTML(stylist.name)}</h2>
      <p class="section-note">Bật/tắt khung giờ theo từng ngày hoặc chọn nhanh theo ca.</p></div>
      <button class="btn btn-primary btn-sm" id="save-hours" type="button">Lưu khung giờ</button></div>
      ${DAY_LIST.map(day => {
        const active = new Set(stylist.availableHours[day.key] || []);
        return `<div class="schedule-day"><div class="schedule-day-head">
          <div class="schedule-day-name">${day.label} <span class="stylist-meta">(${active.size}/${TIME_SLOTS.length})</span></div>
          <div class="quick-shifts">
            <button class="chip" type="button" data-shift="morning" data-day="${day.key}">Ca sáng</button>
            <button class="chip" type="button" data-shift="afternoon" data-day="${day.key}">Ca chiều</button>
            <button class="chip" type="button" data-shift="evening" data-day="${day.key}">Ca tối</button>
            <button class="chip" type="button" data-shift="all" data-day="${day.key}">Cả ngày</button>
            <button class="chip" type="button" data-shift="clear" data-day="${day.key}">Xóa</button>
          </div></div>
          <div class="slot-grid">${TIME_SLOTS.map(time => `<button class="slot ${active.has(time) ? 'on' : 'off'}" type="button" data-time="${time}" data-day="${day.key}" aria-pressed="${active.has(time)}">${time}</button>`).join('')}</div>
        </div>`;
      }).join('')}`;

    root.querySelectorAll('[data-time]').forEach(button => button.addEventListener('click', () => {
      const day = button.dataset.day;
      const time = button.dataset.time;
      const current = new Set(stylist.availableHours[day] || []);
      current.has(time) ? current.delete(time) : current.add(time);
      stylist.availableHours[day] = [...current].sort();
      renderStylistEditor();
    }));

    root.querySelectorAll('[data-shift]').forEach(button => button.addEventListener('click', () => {
      const day = button.dataset.day;
      const shift = button.dataset.shift;
      let times = new Set(stylist.availableHours[day] || []);
      if (shift === 'clear') times.clear();
      else if (shift === 'all') TIME_SLOTS.forEach(time => times.add(time));
      else (SHIFTS[shift] || []).forEach(time => times.add(time));
      stylist.availableHours[day] = [...times].sort();
      renderStylistEditor();
    }));

    $('save-hours').addEventListener('click', () => {
      save('stylists', state.stylists);
      renderStylistList();
      toast(`Đã lưu khung giờ của ${stylist.name}.`);
    });
  }

  function openModal(title, bodyHTML, onSave, saveLabel = 'Lưu') {
    const root = $('modal-root');
    root.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><h3>${title}</h3>${bodyHTML}<div class="modal-actions"><button class="btn btn-ghost" type="button" id="modal-cancel">Hủy</button><button class="btn btn-primary" type="button" id="modal-save">${saveLabel}</button></div></div>`;
    root.classList.remove('hidden');
    root.addEventListener('click', function closeOnBackdrop(event) {
      if (event.target === root) closeModal();
    }, { once: true });
    $('modal-cancel').addEventListener('click', closeModal);
    $('modal-save').addEventListener('click', () => onSave(root.querySelector('.modal')));
    const first = root.querySelector('input, textarea, select');
    if (first) first.focus();
  }

  function closeModal() {
    $('modal-root').classList.add('hidden');
    $('modal-root').innerHTML = '';
  }

  function openStylistModal(stylist = null) {
    const editing = Boolean(stylist);
    openModal(editing ? 'Cập nhật stylist' : 'Thêm stylist', `
      <div class="form"><div class="form-field"><label>Tên stylist</label><input id="modal-name" maxlength="80" value="${escapeHTML(stylist?.name || '')}" required></div>
      <div class="form-field"><label>Kinh nghiệm / chuyên môn</label><input id="modal-experience" maxlength="80" value="${escapeHTML(stylist?.experience || '')}" placeholder="Ví dụ: 5 năm kinh nghiệm"></div></div>
    `, modal => {
      const name = modal.querySelector('#modal-name').value.trim();
      const experience = modal.querySelector('#modal-experience').value.trim() || 'Stylist';
      if (!name) return window.alert('Vui lòng nhập tên stylist.');
      if (editing) {
        stylist.name = name;
        stylist.experience = experience;
        stylist.specialty = experience;
      } else {
        const stylistId = `st1_${Date.now()}`;
        const availableHours = {};
        DAY_LIST.forEach(day => { availableHours[day.key] = []; });
        state.stylists.push({ id: stylistId, stylistId, salonId: SALON_ID, name, experience, specialty: experience, status: 'active', availableHours });
        state.selectedStylistId = stylistId;
      }
      save('stylists', state.stylists);
      renderStylistList();
      renderStylistEditor();
      closeModal();
      toast(editing ? 'Đã cập nhật stylist.' : 'Đã thêm stylist.');
    }, editing ? 'Lưu thay đổi' : 'Thêm stylist');
  }

  function deleteStylist(stylistId) {
    const used = state.bookings.some(item => item.stylistId === stylistId && item.status !== 'cancelled');
    if (used) return window.alert('Không thể xóa stylist vì vẫn có lịch hẹn liên quan. Hãy xử lý lịch hẹn trước.');
    if (!window.confirm('Bạn chắc chắn muốn xóa stylist này?')) return;
    state.stylists = state.stylists.filter(item => item.stylistId !== stylistId);
    if (state.selectedStylistId === stylistId) state.selectedStylistId = state.stylists[0]?.stylistId || null;
    save('stylists', state.stylists);
    renderStylistList();
    renderStylistEditor();
    toast('Đã xóa stylist.');
  }

  function renderSalonForm() {
    const form = $('salon-info-form');
    const fields = [
      ['name', 'Tên salon', 'text'], ['phone', 'Số điện thoại', 'tel'],
      ['address', 'Địa chỉ', 'text'], ['openTime', 'Giờ mở cửa', 'time'],
      ['closeTime', 'Giờ đóng cửa', 'time'],
    ];
    form.innerHTML = fields.map(([key, label, type]) => `
      <div class="form-field"><label for="salon-${key}">${label}</label>
      <input id="salon-${key}" data-key="${key}" type="${type}" value="${escapeHTML(state.salon[key] || '')}" required></div>
    `).join('') + `
      <div class="form-field"><label for="salon-description">Mô tả</label>
      <textarea id="salon-description" data-key="description" rows="4">${escapeHTML(state.salon.description || '')}</textarea></div>
      <button class="btn btn-primary" type="submit">Lưu thông tin salon</button>`;

    form.addEventListener('submit', event => {
      event.preventDefault();
      form.querySelectorAll('[data-key]').forEach(input => {
        state.salon[input.dataset.key] = input.value.trim();
      });
      state.salon.salonId = SALON_ID;
      state.salon.openingHours = {
        ...(state.salon.openingHours || {}),
        open: state.salon.openTime,
        close: state.salon.closeTime,
      };
      save('salon', state.salon);
      renderHeader();
      toast('Đã lưu thông tin The Hair Space.');
    });
  }

  function renderServices() {
    const root = $('services-table');
    const services = state.services.filter(item => item.status !== 'inactive');
    root.innerHTML = services.length ? `<div class="table-wrap"><table><thead><tr><th>Tên dịch vụ</th><th>Thời lượng</th><th>Giá</th><th>Thao tác</th></tr></thead><tbody>
      ${services.map(item => `<tr><td>${escapeHTML(item.name)}</td><td>${Number(item.duration)} phút</td><td>${money(item.price)}</td><td class="actions-cell"><button class="btn btn-ghost btn-sm" type="button" data-edit-service="${escapeHTML(item.serviceId)}">Sửa</button> <button class="btn btn-ghost btn-sm" type="button" data-delete-service="${escapeHTML(item.serviceId)}">Xóa</button></td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty">Chưa có dịch vụ nào.</div>';

    root.querySelectorAll('[data-edit-service]').forEach(button => button.addEventListener('click', () => openServiceModal(getService(button.dataset.editService))));
    root.querySelectorAll('[data-delete-service]').forEach(button => button.addEventListener('click', () => deleteService(button.dataset.deleteService)));
  }

  function openServiceModal(service = null) {
    const editing = Boolean(service);
    openModal(editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ', `
      <div class="form"><div class="form-field"><label>Tên dịch vụ</label><input id="modal-name" maxlength="100" value="${escapeHTML(service?.name || '')}" required></div>
      <div class="form-row"><div class="form-field"><label>Thời lượng (phút)</label><input id="modal-duration" type="number" min="1" max="600" value="${Number(service?.duration || 45)}" required></div>
      <div class="form-field"><label>Giá (VNĐ)</label><input id="modal-price" type="number" min="0" step="1000" value="${Number(service?.price || 0)}" required></div></div></div>
    `, modal => {
      const name = modal.querySelector('#modal-name').value.trim();
      const duration = Number(modal.querySelector('#modal-duration').value);
      const price = Number(modal.querySelector('#modal-price').value);
      if (!name || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(price) || price < 0) return window.alert('Vui lòng nhập tên, thời lượng và giá hợp lệ.');
      if (editing) Object.assign(service, { name, duration, price });
      else {
        const serviceId = `s1_${Date.now()}`;
        state.services.push({ id: serviceId, serviceId, salonId: SALON_ID, name, duration, price, value: '', status: 'active' });
      }
      save('services', state.services);
      renderServices();
      closeModal();
      toast(editing ? 'Đã cập nhật dịch vụ.' : 'Đã thêm dịch vụ.');
    }, editing ? 'Lưu thay đổi' : 'Thêm dịch vụ');
  }

  function deleteService(serviceId) {
    const used = state.bookings.some(item => (item.serviceId === serviceId || item.serviceIds?.includes(serviceId)) && item.status !== 'cancelled');
    if (used) return window.alert('Không thể xóa dịch vụ đang được tham chiếu bởi lịch hẹn.');
    if (!window.confirm('Bạn chắc chắn muốn xóa dịch vụ này?')) return;
    state.services = state.services.filter(item => item.serviceId !== serviceId);
    save('services', state.services);
    renderServices();
    toast('Đã xóa dịch vụ.');
  }

  function appStatusLabel(status) {
    return ({ pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' })[status] || status;
  }

  function renderRecruits() {
    const root = $('recruits-list');
    if (!state.hairModels.length) {
      root.innerHTML = '<div class="empty">Chưa có tin tuyển mẫu tóc.</div>';
      return;
    }

    root.innerHTML = state.hairModels.map(model => {
      const modelId = String(model.hairModelId || model.id);
      const apps = state.applications.filter(app => String(app.hairModelId) === modelId);
      const statusClass = /đang tuyển|open/i.test(model.status || '') ? 'open' : 'closed';
      return `<article class="recruit-card">
        <div class="recruit-head"><div><div class="recruit-title">${escapeHTML(model.title)}</div>
        <div class="recruit-meta"><span>🎯 ${Number(model.slots || 0)} suất</span><span>⏰ Hạn: ${formatDate(model.deadline)}</span><span>👥 ${apps.length} đơn</span><span class="badge badge-${statusClass}">${escapeHTML(model.status || 'Đang tuyển')}</span></div></div>
        <div class="recruit-actions"><button class="btn btn-ghost btn-sm" type="button" data-edit-model="${escapeHTML(modelId)}">Sửa</button><button class="btn btn-ghost btn-sm" type="button" data-delete-model="${escapeHTML(modelId)}">Xóa</button></div></div>
        <p class="recruit-desc">${escapeHTML(model.requirement || model.description || '')}</p>
        <p class="recruit-desc"><strong>Dịch vụ:</strong> ${escapeHTML(model.serviceName || '—')} &nbsp; <strong>Chi phí:</strong> ${escapeHTML(model.cost || '—')}</p>
        <div class="recruit-apps"><strong>Đơn ứng tuyển</strong>
          ${apps.length ? `<div class="table-wrap"><table class="recruit-application-table"><thead><tr><th>Ứng viên</th><th>Liên hệ</th><th>Ghi chú</th><th>Ngày gửi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
          ${apps.map(app => `<tr><td>${escapeHTML(app.applicantName || app.name || 'Ứng viên')}</td><td>${escapeHTML(app.phone || '—')}</td><td>${escapeHTML(app.note || '—')}</td><td>${formatDate(app.date || app.createdAt)}</td><td><span class="badge badge-${escapeHTML(app.status || 'pending')}">${appStatusLabel(app.status || 'pending')}</span></td><td class="actions-cell">${app.status === 'pending' ? `<div class="application-actions"><button class="btn btn-success btn-sm" type="button" data-app-action="approved" data-app-id="${escapeHTML(app.applicationId || app.id)}">Duyệt</button><button class="btn btn-ghost btn-sm" type="button" data-app-action="rejected" data-app-id="${escapeHTML(app.applicationId || app.id)}">Từ chối</button></div>` : '—'}</td></tr>`).join('')}
          </tbody></table></div>` : '<p class="section-note">Chưa có đơn ứng tuyển.</p>'}
        </div></article>`;
    }).join('');

    root.querySelectorAll('[data-edit-model]').forEach(button => button.addEventListener('click', () => openRecruitModal(state.hairModels.find(item => String(item.hairModelId || item.id) === button.dataset.editModel))));
    root.querySelectorAll('[data-delete-model]').forEach(button => button.addEventListener('click', () => deleteRecruit(button.dataset.deleteModel)));
    root.querySelectorAll('[data-app-action]').forEach(button => button.addEventListener('click', () => updateApplication(button.dataset.appId, button.dataset.appAction)));
  }

  function openRecruitModal(model = null) {
    const editing = Boolean(model);
    openModal(editing ? 'Sửa tin tuyển mẫu' : 'Đăng tin tuyển mẫu tóc', `
      <div class="form"><div class="form-field"><label>Tiêu đề</label><input id="modal-title" maxlength="140" value="${escapeHTML(model?.title || '')}" required></div>
      <div class="form-field"><label>Dịch vụ</label><input id="modal-service" maxlength="100" value="${escapeHTML(model?.serviceName || '')}" placeholder="Ví dụ: Nhuộm tóc"></div>
      <div class="form-field"><label>Yêu cầu mẫu</label><textarea id="modal-requirement" rows="3">${escapeHTML(model?.requirement || model?.description || '')}</textarea></div>
      <div class="form-field"><label>Chi phí / quyền lợi</label><input id="modal-cost" maxlength="180" value="${escapeHTML(model?.cost || '')}"></div>
      <div class="form-row"><div class="form-field"><label>Số suất tuyển</label><input id="modal-slots" type="number" min="1" value="${Number(model?.slots || 3)}"></div>
      <div class="form-field"><label>Hạn đăng ký</label><input id="modal-deadline" type="date" value="${escapeHTML(model?.deadline || addDays(14))}"></div></div>
      <div class="form-field"><label>Trạng thái</label><select id="modal-model-status"><option value="Đang tuyển" ${!model || /đang tuyển|open/i.test(model.status || '') ? 'selected' : ''}>Đang tuyển</option><option value="Đã đóng" ${model && !/đang tuyển|open/i.test(model.status || '') ? 'selected' : ''}>Đã đóng</option></select></div></div>
    `, modal => {
      const title = modal.querySelector('#modal-title').value.trim();
      const serviceName = modal.querySelector('#modal-service').value.trim();
      const requirement = modal.querySelector('#modal-requirement').value.trim();
      const cost = modal.querySelector('#modal-cost').value.trim();
      const slots = Number(modal.querySelector('#modal-slots').value);
      const deadline = modal.querySelector('#modal-deadline').value;
      const status = modal.querySelector('#modal-model-status').value;
      if (!title || !Number.isInteger(slots) || slots < 1 || !deadline) return window.alert('Vui lòng nhập tiêu đề, số suất và hạn đăng ký hợp lệ.');
      if (editing) Object.assign(model, { title, serviceName, requirement, cost, slots, deadline, status });
      else {
        const hairModelId = `hm_1_${Date.now()}`;
        state.hairModels.unshift({ id: hairModelId, hairModelId, salonId: SALON_ID, title, serviceName, requirement, cost, slots, deadline, status, createdAt: localISO() });
      }
      save('hairModels', state.hairModels);
      renderRecruits();
      closeModal();
      toast(editing ? 'Đã cập nhật tin tuyển mẫu.' : 'Đã đăng tin tuyển mẫu.');
    }, editing ? 'Lưu thay đổi' : 'Đăng tin');
  }

  function deleteRecruit(modelId) {
    if (!window.confirm('Xóa tin tuyển mẫu này và các đơn ứng tuyển liên quan?')) return;
    state.hairModels = state.hairModels.filter(item => String(item.hairModelId || item.id) !== modelId);
    state.applications = state.applications.filter(item => String(item.hairModelId) !== modelId);
    save('hairModels', state.hairModels);
    save('applications', state.applications);
    renderRecruits();
    toast('Đã xóa tin tuyển mẫu.');
  }

  function updateApplication(applicationId, status) {
    const application = state.applications.find(item => String(item.applicationId || item.id) === applicationId);
    if (!application || !['approved', 'rejected'].includes(status)) return;
    application.status = status;
    application.reviewedAt = new Date().toISOString();
    save('applications', state.applications);
    renderRecruits();
    toast(status === 'approved' ? 'Đã duyệt đơn ứng tuyển.' : 'Đã từ chối đơn ứng tuyển.');
  }

  const TAB_META = {
    overview: ['Tổng quan', 'Theo dõi hoạt động của The Hair Space.'],
    bookings: ['Lịch hẹn', 'Lọc lịch theo ngày, trạng thái và cập nhật kết quả phục vụ.'],
    stylists: ['Stylist & Khung giờ', 'Quản lý đội ngũ và lịch làm việc theo từng ngày.'],
    services: ['Dịch vụ & Thông tin Salon', 'Cập nhật thông tin salon và danh mục dịch vụ.'],
    recruits: ['Tuyển mẫu tóc', 'Quản lý tin tuyển, duyệt hoặc từ chối đơn ứng tuyển.'],
  };

  function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(item => item.classList.toggle('active', item.dataset.panel === tab));
    if (TAB_META[tab]) {
      $('page-title').textContent = TAB_META[tab][0];
      $('page-subtitle').textContent = TAB_META[tab][1];
    }
  }

  function bindEvents() {
    document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => switchTab(button.dataset.tab)));
    $('booking-status-filter').addEventListener('change', event => {
      state.bookingStatus = event.target.value;
      renderBookings();
    });
    $('booking-date-filter').addEventListener('change', event => {
      state.bookingDate = event.target.value;
      renderBookings();
    });
    $('clear-booking-filters').addEventListener('click', () => {
      state.bookingStatus = 'all';
      state.bookingDate = '';
      $('booking-status-filter').value = 'all';
      $('booking-date-filter').value = '';
      renderBookings();
    });
    $('add-stylist-btn').addEventListener('click', () => openStylistModal());
    $('add-service-btn').addEventListener('click', () => openServiceModal());
    $('add-recruit-btn').addEventListener('click', () => openRecruitModal());
    $('logout-btn').addEventListener('click', () => {
      if (!window.confirm('Đăng xuất khỏi tài khoản chủ salon?')) return;
      localStorage.removeItem(KEYS.user);
      window.location.href = 'auth.html';
    });
  }

  function boot() {
    if (!checkAuth()) return;
    loadData();
    renderHeader();
    renderOverview();
    renderBookings();
    renderStylistList();
    renderStylistEditor();
    renderSalonForm();
    renderServices();
    renderRecruits();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
