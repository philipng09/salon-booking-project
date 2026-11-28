(function () {
  'use strict';

  const KEYS = {
    user: 'currentUser',
    salon: 'salon_1_profile',
    stylists: 'salon_1_stylists',
    services: 'salon_1_services',
    bookings: 'salon_1_bookings',
    recruits: 'salon_1_recruitment',
    seeded: 'salon_1_seeded_v1',
  };
  const SALON_ID = 1;
  const OWNER_EMAIL = 'owner1@salonbook.test';
  const SALON_NAME = 'The Hair Space';

  const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
  ];
  const DAYS = [
    { key: 'T2', label: 'Thứ 2' }, { key: 'T3', label: 'Thứ 3' },
    { key: 'T4', label: 'Thứ 4' }, { key: 'T5', label: 'Thứ 5' },
    { key: 'T6', label: 'Thứ 6' }, { key: 'T7', label: 'Thứ 7' },
    { key: 'CN', label: 'Chủ nhật' },
  ];
  const SHIFTS = {
    morning:   ['08:00', '09:00', '10:00', '11:00'],
    afternoon: ['13:00', '14:00', '15:00', '16:00'],
    evening:   ['17:00', '18:00', '19:00'],
  };
  const STATUS_LABELS = {
    pending:   'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  const LS = {
    get(key, fb) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fb : JSON.parse(v);
      } catch { return fb; }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  };

  function seedDemo() {
    LS.set(KEYS.user, {
      id: 'owner-1',
      email: OWNER_EMAIL,
      name: 'Chủ salon The Hair Space',
      role: 'salon_owner',
      salonId: SALON_ID,
    });
    LS.set(KEYS.salon, {
      id: SALON_ID,
      name: SALON_NAME,
      address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      phone: '0909 123 456',
      description: 'The Hair Space – salon tóc hiện đại chuyên cắt, uốn, nhuộm và tạo kiểu.',
      openTime: '08:00',
      closeTime: '20:00',
    });
    LS.set(KEYS.stylists, [
      {
        id: 'st1', name: 'Minh Anh', avatar: 'MA',
        availableHours: {
          T2: ['09:00','10:00','11:00','13:00','14:00','15:00'],
          T3: ['09:00','10:00','11:00','13:00','14:00','15:00'],
          T4: ['09:00','10:00','11:00','13:00','14:00','15:00'],
          T5: ['09:00','10:00','11:00','13:00','14:00','15:00'],
          T6: ['09:00','10:00','11:00','13:00','14:00','15:00'],
          T7: ['09:00','10:00','11:00'],
          CN: [],
        },
      },
      {
        id: 'st2', name: 'Hoàng Long', avatar: 'HL',
        availableHours: {
          T2: ['13:00','14:00','15:00','16:00','17:00','18:00'],
          T3: ['13:00','14:00','15:00','16:00','17:00','18:00'],
          T4: ['13:00','14:00','15:00','16:00','17:00','18:00'],
          T5: ['13:00','14:00','15:00','16:00','17:00','18:00'],
          T6: ['13:00','14:00','15:00','16:00','17:00','18:00'],
          T7: ['08:00','09:00','10:00','11:00','13:00','14:00'],
          CN: ['09:00','10:00','11:00'],
        },
      },
      {
        id: 'st3', name: 'Thu Hà', avatar: 'TH',
        availableHours: {
          T2: ['08:00','09:00','10:00','11:00'],
          T3: ['08:00','09:00','10:00','11:00'],
          T4: ['08:00','09:00','10:00','11:00'],
          T5: ['08:00','09:00','10:00','11:00'],
          T6: ['08:00','09:00','10:00','11:00'],
          T7: [],
          CN: [],
        },
      },
    ]);

    LS.set(KEYS.services, [
      { id: 'sv1', name: 'Cắt tóc nữ',           duration: 45,  price: 150000 },
      { id: 'sv2', name: 'Cắt tóc nam',          duration: 30,  price: 90000  },
      { id: 'sv3', name: 'Uốn tóc',              duration: 120, price: 550000 },
      { id: 'sv4', name: 'Nhuộm tóc',            duration: 120, price: 650000 },
      { id: 'sv5', name: 'Gội đầu dưỡng sinh',   duration: 45,  price: 120000 },
    ]);

    const today = new Date();
    const isoOf = (d) => d.toISOString().slice(0, 10);
    const plus = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return isoOf(d); };

    LS.set(KEYS.bookings, [
      { id: 'bk1', customerName: 'Nguyễn Lan',  phone: '0912 345 678', serviceId: 'sv1', stylistId: 'st1', date: plus(0),  time: '09:00', status: 'pending',   note: '' },
      { id: 'bk2', customerName: 'Trần Hùng',   phone: '0909 888 777', serviceId: 'sv2', stylistId: 'st2', date: plus(0),  time: '14:00', status: 'confirmed', note: '' },
      { id: 'bk3', customerName: 'Lê Mai',      phone: '0933 222 111', serviceId: 'sv4', stylistId: 'st1', date: plus(0),  time: '10:00', status: 'pending',   note: 'Khách muốn tông nâu lạnh' },
      { id: 'bk4', customerName: 'Phạm Quỳnh',  phone: '0987 654 321', serviceId: 'sv3', stylistId: 'st2', date: plus(1),  time: '13:00', status: 'confirmed', note: '' },
      { id: 'bk5', customerName: 'Đỗ Nam',      phone: '0966 555 444', serviceId: 'sv1', stylistId: 'st1', date: plus(-1), time: '09:00', status: 'completed', note: '' },
      { id: 'bk6', customerName: 'Bùi Hà',      phone: '0911 000 111', serviceId: 'sv5', stylistId: 'st3', date: plus(1),  time: '08:00', status: 'pending',   note: '' },
    ]);

    LS.set(KEYS.recruits, [
      {
        id: 'rc1',
        title: 'Tuyển mẫu tóc nhuộm Ombre',
        description: 'Tìm 5 bạn nữ tóc dài trên 20cm làm mẫu nhuộm Ombre. Miễn phí dịch vụ, chụp hình lookbook.',
        slots: 5,
        deadline: plus(14),
        createdAt: plus(-3),
        applications: [
          { name: 'Ngọc Diệp', phone: '0912 111 222', note: 'Tóc dài 25cm, chưa qua xử lý hóa chất', date: plus(-2) },
          { name: 'Kim Ngân',  phone: '0933 444 555', note: 'Có thể đến cuối tuần',                date: plus(-1) },
        ],
      },
      {
        id: 'rc2',
        title: 'Mẫu tóc uốn Hàn Quốc',
        description: 'Cần 3 bạn tóc thẳng, dài vai làm mẫu uốn xoăn Hàn Quốc. Ưu tiên bạn có lịch trống buổi sáng.',
        slots: 3,
        deadline: plus(21),
        createdAt: plus(-1),
        applications: [],
      },
    ]);

    LS.set(KEYS.seeded, true);
  }

  function ensureSeed() {
    if (!LS.get(KEYS.seeded, false)) seedDemo();
  }

  const state = {
    user: null,
    salon: null,
    stylists: [],
    services: [],
    bookings: [],
    recruits: [],
    selectedStylistId: null,
    bookingFilter: 'all',
  };

  function el(tag, attrs = {}, html) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') e.className = v;
      else if (k.startsWith('on') && typeof v === 'function')
        e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const formatVND = (n) => (n || 0).toLocaleString('vi-VN') + '₫';
  const formatDateVN = (iso) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };
  const initials = (name) =>
    (name || '?').split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase();

  const getService = (id) => state.services.find(s => s.id === id);
  const getStylist = (id) => state.stylists.find(s => s.id === id);

  function save(what) {
    LS.set(KEYS[what], state[what]);
  }

  function checkAuth() {
    const user = LS.get(KEYS.user, null);
    const guard = document.getElementById('auth-guard');
    const dash  = document.getElementById('dashboard');

    if (!user || user.role !== 'salon_owner') {
      guard.classList.remove('hidden');
      dash.classList.add('hidden');
      return false;
    }
    state.user = user;
    ensureSeed();
    guard.classList.add('hidden');
    dash.classList.remove('hidden');
    return true;
  }

  function loadState() {
    state.salon    = LS.get(KEYS.salon, null) || {};
    state.stylists = LS.get(KEYS.stylists, []);
    state.services = LS.get(KEYS.services, []);
    state.bookings = LS.get(KEYS.bookings, []);
    state.recruits = LS.get(KEYS.recruits, []);
    state.selectedStylistId = state.stylists[0]?.id || null;
  }

  function renderHeader() {
    document.getElementById('owner-email').textContent = state.user.email;
    document.getElementById('owner-salon').textContent = state.salon.name || '—';
    document.getElementById('owner-avatar').textContent = initials(state.salon.name || '?');
    document.getElementById('today-pill').textContent =
      new Date().toLocaleDateString('vi-VN', {
        weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
      });
  }

  function renderOverview() {
    const today = todayISO();
    const todayBookings = state.bookings.filter(b => b.date === today);
    const pending   = state.bookings.filter(b => b.status === 'pending').length;
    const confirmedToday = todayBookings.filter(b => b.status === 'confirmed').length;
    const completed = state.bookings.filter(b => b.status === 'completed').length;
    const revenue   = state.bookings
      .filter(b => b.status === 'completed')
      .reduce((s, b) => s + (getService(b.serviceId)?.price || 0), 0);

    const stats = [
      { label: 'Lịch hẹn hôm nay',      value: todayBookings.length, trend: `${confirmedToday} đã xác nhận` },
      { label: 'Chờ xác nhận',          value: pending,              trend: 'Cần xử lý' },
      { label: 'Khách đã phục vụ',      value: completed,            trend: 'Toàn thời gian' },
      { label: 'Doanh thu ghi nhận',    value: formatVND(revenue),   trend: 'Từ dịch vụ hoàn thành' },
    ];
    const grid = document.getElementById('stats-grid');
    grid.innerHTML = '';
    stats.forEach(s => grid.appendChild(el('div', { class: 'stat-card' }, `
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-trend">${s.trend}</div>
    `)));

    const box = document.getElementById('today-bookings');
    box.innerHTML = '';
    if (!todayBookings.length) {
      box.appendChild(el('div', { class: 'empty' }, 'Hôm nay chưa có lịch hẹn nào.'));
      return;
    }
    const sorted = [...todayBookings].sort((a, b) => a.time.localeCompare(b.time));
    const tbl = el('table');
    tbl.innerHTML = `
      <thead><tr>
        <th>Khách</th><th>Dịch vụ</th><th>Stylist</th><th>Giờ</th><th>Trạng thái</th>
      </tr></thead>
      <tbody>${sorted.map(b => `
        <tr>
          <td>${b.customerName}</td>
          <td>${getService(b.serviceId)?.name || '—'}</td>
          <td>${getStylist(b.stylistId)?.name || '—'}</td>
          <td>${b.time}</td>
          <td><span class="badge badge-${b.status}">${STATUS_LABELS[b.status]}</span></td>
        </tr>`).join('')}
      </tbody>`;
    box.appendChild(tbl);
  }

  function renderBookings() {
    const list = state.bookings
      .filter(b => state.bookingFilter === 'all' || b.status === state.bookingFilter)
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

    const box = document.getElementById('bookings-table');
    box.innerHTML = '';
    if (!list.length) {
      box.appendChild(el('div', { class: 'empty' }, 'Không có lịch hẹn nào phù hợp.'));
      return;
    }
    const tbl = el('table');
    tbl.innerHTML = `
      <thead><tr>
        <th>Khách</th><th>Liên hệ</th><th>Dịch vụ</th><th>Stylist</th>
        <th>Ngày</th><th>Giờ</th><th>Trạng thái</th><th></th>
      </tr></thead>
      <tbody>${list.map(b => `
        <tr>
          <td>${b.customerName}</td>
          <td>${b.phone}</td>
          <td>${getService(b.serviceId)?.name || '—'}</td>
          <td>${getStylist(b.stylistId)?.name || '—'}</td>
          <td>${formatDateVN(b.date)}</td>
          <td>${b.time}</td>
          <td><span class="badge badge-${b.status}">${STATUS_LABELS[b.status]}</span></td>
          <td class="actions-cell">
            ${b.status === 'pending'   ? `<button class="btn btn-success btn-sm" data-act="confirm"  data-id="${b.id}">Xác nhận</button>` : ''}
            ${b.status === 'confirmed' ? `<button class="btn btn-primary btn-sm" data-act="complete" data-id="${b.id}">Hoàn thành</button>` : ''}
            ${['pending','confirmed'].includes(b.status)
              ? `<button class="btn btn-ghost btn-sm" data-act="cancel" data-id="${b.id}">Hủy</button>` : ''}
          </td>
        </tr>`).join('')}
      </tbody>`;
    box.appendChild(tbl);

    box.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => handleBookingAction(btn.dataset.act, btn.dataset.id));
    });
  }

  function handleBookingAction(act, id) {
    const b = state.bookings.find(x => x.id === id);
    if (!b) return;
    if (act === 'confirm')  b.status = 'confirmed';
    if (act === 'complete') b.status = 'completed';
    if (act === 'cancel') {
      if (!confirm(`Hủy lịch hẹn của ${b.customerName}?`)) return;
      b.status = 'cancelled';
    }
    save('bookings');
    renderBookings();
    renderOverview();
  }

  function renderStylistList() {
    const box = document.getElementById('stylist-list');
    box.innerHTML = '';
    if (!state.stylists.length) {
      box.appendChild(el('div', { class: 'empty' }, 'Chưa có stylist nào.'));
      return;
    }
    state.stylists.forEach(s => {
      const total = Object.values(s.availableHours || {}).reduce((a, arr) => a + arr.length, 0);
      const item = el('div', {
        class: 'stylist-item' + (s.id === state.selectedStylistId ? ' active' : ''),
      }, `
        <div class="stylist-avatar">${s.avatar || initials(s.name)}</div>
        <div>
          <div class="stylist-name">${s.name}</div>
          <div class="stylist-meta">${total} khung giờ mở</div>
        </div>
      `);
      item.addEventListener('click', () => {
        state.selectedStylistId = s.id;
        renderStylistList();
        renderStylistEditor();
      });
      box.appendChild(item);
    });
  }

  function renderStylistEditor() {
    const box = document.getElementById('stylist-editor');
    const st = getStylist(state.selectedStylistId);
    box.innerHTML = '';
    if (!st) {
      box.appendChild(el('div', { class: 'empty' }, 'Chọn một stylist để chỉnh khung giờ làm việc.'));
      return;
    }
    if (!st.availableHours) st.availableHours = {};

    box.appendChild(el('div', { class: 'card-head' }, `
      <div>
        <h2>${st.name}</h2>
        <p style="font-size:13px;color:var(--muted);margin-top:4px;">
          Bật/tắt khung giờ trong tuần hoặc dùng chọn nhanh theo ca, rồi bấm Lưu.
        </p>
      </div>
      <button class="btn btn-primary btn-sm" id="save-hours">Lưu khung giờ</button>
    `));

    const daysBox = el('div');
    DAYS.forEach(day => {
      const activeSet = new Set(st.availableHours[day.key] || []);
      const dayEl = el('div', { class: 'schedule-day' });
      dayEl.appendChild(el('div', { class: 'schedule-day-head' }, `
        <div class="schedule-day-name">
          ${day.label}
          <span style="font-weight:400;color:var(--muted);font-size:12px;">
            (${activeSet.size}/${TIME_SLOTS.length})
          </span>
        </div>
        <div class="quick-shifts">
          <button class="chip" data-shift="morning"   data-day="${day.key}">Ca sáng</button>
          <button class="chip" data-shift="afternoon" data-day="${day.key}">Ca chiều</button>
          <button class="chip" data-shift="evening"   data-day="${day.key}">Ca tối</button>
          <button class="chip" data-shift="all"       data-day="${day.key}">Cả ngày</button>
          <button class="chip" data-shift="clear"     data-day="${day.key}">Xóa</button>
        </div>
      `));

      const grid = el('div', { class: 'slot-grid' });
      TIME_SLOTS.forEach(slot => {
        const on = activeSet.has(slot);
        const slotEl = el('button', {
          class: 'slot ' + (on ? 'on' : 'off'),
          'data-slot': slot,
          'data-day': day.key,
        }, slot);
        slotEl.addEventListener('click', () => {
          const set = new Set(st.availableHours[day.key] || []);
          if (set.has(slot)) set.delete(slot);
          else set.add(slot);
          st.availableHours[day.key] = Array.from(set).sort();
          renderStylistEditor();
        });
        grid.appendChild(slotEl);
      });
      dayEl.appendChild(grid);
      daysBox.appendChild(dayEl);
    });
    box.appendChild(daysBox);

    box.querySelectorAll('[data-shift]').forEach(chip => {
      chip.addEventListener('click', () => {
        const day = chip.dataset.day;
        const shift = chip.dataset.shift;
        const set = new Set(st.availableHours[day] || []);
        if (shift === 'clear') set.clear();
        else if (shift === 'all') TIME_SLOTS.forEach(t => set.add(t));
        else (SHIFTS[shift] || []).forEach(t => set.add(t));
        st.availableHours[day] = Array.from(set).sort();
        renderStylistEditor();
      });
    });

    box.querySelector('#save-hours').addEventListener('click', () => {
      save('stylists');
      renderStylistList();
      showToast(`Đã lưu khung giờ cho ${st.name}`);
    });
  }

  function renderSalonForm() {
    const form = document.getElementById('salon-info-form');
    form.innerHTML = '';
    const fields = [
      { key: 'name',      label: 'Tên salon',      type: 'text' },
      { key: 'phone',     label: 'Số điện thoại',  type: 'text' },
      { key: 'address',   label: 'Địa chỉ',        type: 'text' },
      { key: 'openTime',  label: 'Giờ mở cửa',     type: 'text' },
      { key: 'closeTime', label: 'Giờ đóng cửa',   type: 'text' },
    ];
    fields.forEach(f => {
      const wrap = el('div', { class: 'form-field' }, `<label>${f.label}</label>`);
      const input = el('input', { type: f.type, 'data-key': f.key });
      input.value = state.salon[f.key] || '';
      wrap.appendChild(input);
      form.appendChild(wrap);
    });

    const descWrap = el('div', { class: 'form-field' }, '<label>Mô tả</label>');
    const ta = el('textarea', { 'data-key': 'description', rows: 3 });
    ta.value = state.salon.description || '';
    descWrap.appendChild(ta);
    form.appendChild(descWrap);

    const btn = el('button', { type: 'button', class: 'btn btn-primary' }, 'Lưu thông tin salon');
    btn.addEventListener('click', () => {
      form.querySelectorAll('[data-key]').forEach(inp => {
        state.salon[inp.dataset.key] = inp.value.trim();
      });
      save('salon');
      renderHeader();
      showToast('Đã cập nhật thông tin salon');
    });
    form.appendChild(btn);
  }

  function renderServices() {
    const box = document.getElementById('services-table');
    box.innerHTML = '';
    if (!state.services.length) {
      box.appendChild(el('div', { class: 'empty' }, 'Chưa có dịch vụ nào.'));
      return;
    }
    const tbl = el('table');
    tbl.innerHTML = `
      <thead><tr><th>Tên dịch vụ</th><th>Thời lượng</th><th>Giá</th><th></th></tr></thead>
      <tbody>${state.services.map(s => `
        <tr>
          <td>${s.name}</td>
          <td>${s.duration} phút</td>
          <td>${formatVND(s.price)}</td>
          <td class="actions-cell">
            <button class="btn btn-ghost btn-sm" data-act="edit" data-id="${s.id}">Sửa</button>
            <button class="btn btn-ghost btn-sm" data-act="del"  data-id="${s.id}">Xóa</button>
          </td>
        </tr>`).join('')}
      </tbody>`;
    box.appendChild(tbl);

    box.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (btn.dataset.act === 'del') {
          if (!confirm('Xóa dịch vụ này?')) return;
          state.services = state.services.filter(s => s.id !== id);
          save('services');
          renderServices();
        } else {
          openServiceModal(state.services.find(s => s.id === id));
        }
      });
    });
  }

  function openServiceModal(svc) {
    const isEdit = !!svc;
    const modal = el('div', { class: 'modal' }, `
      <h3>${isEdit ? 'Sửa' : 'Thêm'} dịch vụ</h3>
      <div class="form">
        <div class="form-field"><label>Tên dịch vụ</label>
          <input id="m-name" value="${isEdit ? svc.name : ''}">
        </div>
        <div class="form-row">
          <div class="form-field"><label>Thời lượng (phút)</label>
            <input id="m-duration" type="number" min="1" value="${isEdit ? svc.duration : 30}">
          </div>
          <div class="form-field"><label>Giá (VNĐ)</label>
            <input id="m-price" type="number" min="0" value="${isEdit ? svc.price : 100000}">
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="m-cancel">Hủy</button>
        <button class="btn btn-primary" id="m-save">Lưu</button>
      </div>
    `);
    mountModal(modal);
    modal.querySelector('#m-cancel').addEventListener('click', closeModal);
    modal.querySelector('#m-save').addEventListener('click', () => {
      const name = modal.querySelector('#m-name').value.trim();
      const duration = parseInt(modal.querySelector('#m-duration').value, 10);
      const price = parseInt(modal.querySelector('#m-price').value, 10);
      if (!name || !duration || isNaN(price)) {
        alert('Vui lòng nhập đầy đủ thông tin hợp lệ.');
        return;
      }
      if (isEdit) Object.assign(svc, { name, duration, price });
      else state.services.push({ id: 'sv' + Date.now(), name, duration, price });
      save('services');
      renderServices();
      closeModal();
      showToast('Đã lưu dịch vụ');
    });
  }

  function renderRecruits() {
    const box = document.getElementById('recruits-list');
    box.innerHTML = '';
    if (!state.recruits.length) {
      box.appendChild(el('div', { class: 'empty' }, 'Chưa có bài tuyển mẫu nào.'));
      return;
    }
    state.recruits.forEach(r => {
      const appCount = (r.applications || []).length;
      const card = el('div', { class: 'recruit-card' }, `
        <div class="recruit-head">
          <div>
            <div class="recruit-title">${r.title}</div>
            <div class="recruit-meta">
              <span>🎯 ${r.slots} slot</span>
              <span>⏰ Hạn: ${formatDateVN(r.deadline)}</span>
              <span>👥 ${appCount} ứng viên</span>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" data-act="del" data-id="${r.id}">Xóa</button>
        </div>
        <div class="recruit-desc">${r.description || ''}</div>
        ${appCount ? `
          <div class="recruit-apps">
            <div style="font-weight:600;font-size:13px;margin-bottom:6px;">Ứng viên</div>
            ${r.applications.map(a => `
              <div class="recruit-app-row">
                <div><strong>${a.name}</strong> · ${a.phone}</div>
                <div style="color:var(--muted)">${a.note || ''}</div>
              </div>`).join('')}
          </div>` : ''}
      `);
      box.appendChild(card);
      card.querySelector('[data-act="del"]').addEventListener('click', () => {
        if (!confirm('Xóa bài tuyển mẫu này?')) return;
        state.recruits = state.recruits.filter(x => x.id !== r.id);
        save('recruits');
        renderRecruits();
      });
    });
  }

  function openRecruitModal() {
    const modal = el('div', { class: 'modal' }, `
      <h3>Đăng bài tuyển mẫu tóc</h3>
      <div class="form">
        <div class="form-field"><label>Tiêu đề</label>
          <input id="r-title" placeholder="VD: Tuyển mẫu tóc nhuộm Ombre">
        </div>
        <div class="form-field"><label>Mô tả</label>
          <textarea id="r-desc" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-field"><label>Số slot</label>
            <input id="r-slots" type="number" min="1" value="3">
          </div>
          <div class="form-field"><label>Hạn chót</label>
            <input id="r-deadline" type="date">
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="m-cancel">Hủy</button>
        <button class="btn btn-primary" id="m-save">Đăng</button>
      </div>
    `);
    mountModal(modal);
    const d = new Date(); d.setDate(d.getDate() + 14);
    modal.querySelector('#r-deadline').value = d.toISOString().slice(0, 10);
    modal.querySelector('#m-cancel').addEventListener('click', closeModal);
    modal.querySelector('#m-save').addEventListener('click', () => {
      const title       = modal.querySelector('#r-title').value.trim();
      const description = modal.querySelector('#r-desc').value.trim();
      const slots       = parseInt(modal.querySelector('#r-slots').value, 10);
      const deadline    = modal.querySelector('#r-deadline').value;
      if (!title || !slots || !deadline) { alert('Vui lòng nhập đủ thông tin.'); return; }
      state.recruits.unshift({
        id: 'rc' + Date.now(),
        title, description, slots, deadline,
        createdAt: todayISO(),
        applications: [],
      });
      save('recruits');
      renderRecruits();
      closeModal();
      showToast('Đã đăng bài tuyển mẫu');
    });
  }

  function mountModal(inner) {
    const root = document.getElementById('modal-root');
    root.innerHTML = '';
    root.appendChild(inner);
    root.classList.remove('hidden');
    root.onclick = (e) => { if (e.target === root) closeModal(); };
  }
  function closeModal() {
    document.getElementById('modal-root').classList.add('hidden');
  }
  function showToast(msg) {
    const t = el('div', {
      style: 'position:fixed;bottom:24px;right:24px;background:#10b981;color:#fff;' +
             'padding:12px 18px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.15);' +
             'font-weight:600;font-size:14px;z-index:200;',
    }, msg);
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  const TAB_META = {
    overview: { title: 'Tổng quan',                  subtitle: 'Xin chào, đây là hoạt động của salon hôm nay.' },
    bookings: { title: 'Lịch hẹn',                   subtitle: 'Xác nhận, hoàn thành hoặc hủy lịch hẹn của khách.' },
    stylists: { title: 'Stylist & Khung giờ',        subtitle: 'Bật/tắt khung giờ làm việc theo từng stylist.' },
    services: { title: 'Dịch vụ & Thông tin Salon',  subtitle: 'Cập nhật thông tin salon và danh mục dịch vụ.' },
    recruits: { title: 'Tuyển mẫu tóc',              subtitle: 'Đăng bài và theo dõi ứng viên làm mẫu.' },
  };

  function switchTab(tab) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    const m = TAB_META[tab];
    if (m) {
      document.getElementById('page-title').textContent = m.title;
      document.getElementById('page-subtitle').textContent = m.subtitle;
    }
  }

  function openAddStylistModal() {
    const modal = el('div', { class: 'modal' }, `
      <h3>Thêm stylist mới</h3>
      <div class="form">
        <div class="form-field"><label>Tên stylist</label><input id="s-name"></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="m-cancel">Hủy</button>
        <button class="btn btn-primary" id="m-save">Thêm</button>
      </div>
    `);
    mountModal(modal);
    modal.querySelector('#m-cancel').addEventListener('click', closeModal);
    modal.querySelector('#m-save').addEventListener('click', () => {
      const name = modal.querySelector('#s-name').value.trim();
      if (!name) { alert('Vui lòng nhập tên.'); return; }
      const id = 'st' + Date.now();
      const availableHours = {};
      DAYS.forEach(d => { availableHours[d.key] = []; });
      state.stylists.push({ id, name, avatar: initials(name), availableHours });
      save('stylists');
      state.selectedStylistId = id;
      renderStylistList();
      renderStylistEditor();
      closeModal();
      showToast('Đã thêm stylist');
    });
  }

  function init() {
    if (!checkAuth()) {
      const btn = document.getElementById('seed-demo-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          seedDemo();
          if (checkAuth()) {
            loadState();
            bootDashboard();
          }
        });
      }
      return;
    }
    loadState();
    bootDashboard();
  }

  function bootDashboard() {
    renderHeader();
    renderOverview();
    renderBookings();
    renderStylistList();
    renderStylistEditor();
    renderSalonForm();
    renderServices();
    renderRecruits();

    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('booking-status-filter').addEventListener('change', (e) => {
      state.bookingFilter = e.target.value;
      renderBookings();
    });

    document.getElementById('add-service-btn').addEventListener('click', () => openServiceModal(null));
    document.getElementById('add-recruit-btn').addEventListener('click', openRecruitModal);
    document.getElementById('add-stylist-btn').addEventListener('click', openAddStylistModal);

    document.getElementById('logout-btn').addEventListener('click', () => {
      if (!confirm('Đăng xuất khỏi bảng điều khiển?')) return;
      localStorage.removeItem(KEYS.user);
      location.reload();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
