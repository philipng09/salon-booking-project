/*
 * SALONBOOK PROFILE (bản Auth demo trong localStorage)
 * Nguồn Booking / tư vấn PHẢI được cung cấp bởi nhóm chức năng tương ứng.
 * Contract tích hợp: window.SalonBookProfileData = {
 *   getBookings: async () => [{id,userId,salonName,services,stylistName,date,time,totalPrice,status}],
 *   getConsultations: async () => [{id,userId,title,summary,createdAt}],
 *   cancelBooking: async (id) => { ... } // cập nhật backend & kiểm tra quyền / điều kiện hủy
 * };
 * Các hàm getBookings/getConsultations KHÔNG ĐƯỢC trả dữ liệu giỏ (cart / pending booking).
 * Backend PHẢI xác thực userId phiên đăng nhập và quyền sở hữu lịch.
 */
(() => {
  'use strict';
  const SESSION = 'currentUser';
  const USERS = 'salonbook_users';
  const auth = window.SalonBookAuth;
  if (!auth || !auth.requireLogin()) return;
  const current = auth.currentUser();
  if (!current) return;

  const $ = id => document.getElementById(id);
  const root = $('profile-main');
  const tabs = [...document.querySelectorAll('[data-panel]')];
  const validEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = phone => /^0\d{9}$/.test(phone);
  const validName = name => name.length >= 2 && name.length <= 80 && /^[\p{L}\s'-]+$/u.test(name);
  const money = price => Number.isFinite(Number(price)) ? new Intl.NumberFormat('vi-VN').format(Number(price)) + ' ₫' : 'Chưa có';
  const statuses = {pending:'Chờ xác nhận', confirmed:'Đã xác nhận', completed:'Hoàn tất', cancelled:'Đã hủy'};
  let bookings = [];
  let consultations = [];
  let bookingLoaded = false;
  let consultationLoaded = false;
  let selectedBooking = null;

  function notify(message, ok = false) {
    const box = $('profile-alert');
    box.textContent = message;
    box.classList.toggle('is-success', ok);
    box.hidden = false;
    box.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function clearNotice(){ $('profile-alert').hidden = true; }
  function getStoredUsers() {
    try { const users = JSON.parse(localStorage.getItem(USERS) || '[]'); return Array.isArray(users) ? users : []; }
    catch { return []; }
  }
  function writeAccountSession(user){
    const session = { userId:user.userId, fullName:user.fullName, email:user.email, phone:user.phone, role:user.role };
    localStorage.setItem(SESSION, JSON.stringify(session));
    document.dispatchEvent(new Event('salonbook:auth-changed'));
  }
  function drawUser(){
    const user = auth.currentUser();
    if (!user || String(user.userId) !== String(current.userId)) { location.replace('auth.html?returnTo=profile.html'); return; }
    $('profile-display-name').textContent = user.fullName;
    $('profile-display-email').textContent = user.email;
    $('profile-avatar').textContent = [...user.fullName.trim()][0]?.toUpperCase() || 'S';
    $('overview-name').textContent = user.fullName.split(/\s+/).slice(-1)[0];
    $('overview-fullname').textContent = user.fullName;
    $('overview-email').textContent = user.email;
    $('overview-phone').textContent = user.phone || 'Chưa cập nhật';
    $('profile-fullname').value = user.fullName;
    $('profile-email').value = user.email;
    $('profile-phone').value = user.phone || '';
    $('profile-userid').value = user.userId;
  }
  function openPanel(panel){
    if (!$( `panel-${panel}`)) return;
    tabs.forEach(btn => {
      const active = btn.dataset.panel === panel;
      btn.classList.toggle('is-active', active);
      if (active) btn.setAttribute('aria-current','page'); else btn.removeAttribute('aria-current');
    });
    document.querySelectorAll('.profile-panel').forEach(el => { el.hidden = el.id !== `panel-${panel}`; });
    clearNotice();
    if (panel === 'bookings' && !bookingLoaded) loadBookings();
    if (panel === 'consultations' && !consultationLoaded) loadConsultations();
  }
  tabs.forEach(btn => btn.addEventListener('click', () => openPanel(btn.dataset.panel)));
  document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => openPanel(btn.dataset.go)));
  $('profile-logout').addEventListener('click', () => auth.logout());

  // Cập nhật đúng tài khoản đang đăng nhập, không tạo cấu trúc User khác Auth.
  $('profile-form').addEventListener('submit', event => {
    event.preventDefault();
    const fullName = $('profile-fullname').value.trim().replace(/\s+/g,' ');
    const email = $('profile-email').value.trim().toLowerCase();
    const phone = $('profile-phone').value.trim();
    if (!validName(fullName)) return notify('Họ tên phải có 2–80 ký tự, chỉ gồm chữ, khoảng trắng, dấu nháy hoặc gạch nối.');
    if (!validEmail(email)) return notify('Vui lòng nhập email hợp lệ.');
    if (!validPhone(phone)) return notify('Số điện thoại Việt Nam phải có 10 chữ số và bắt đầu bằng 0.');
    const users = getStoredUsers();
    const index = users.findIndex(u => String(u.userId) === String(current.userId));
    if (index < 0) return notify('Không tìm thấy tài khoản trong dữ liệu demo. Vui lòng đăng nhập lại.');
    if (users.some((u,i) => i !== index && u.email === email)) return notify('Email này đã được tài khoản khác sử dụng.');
    if (users.some((u,i) => i !== index && u.phone === phone)) return notify('Số điện thoại này đã được tài khoản khác sử dụng.');
    users[index] = {...users[index],fullName,email,phone};
    try {
      localStorage.setItem(USERS, JSON.stringify(users));
      writeAccountSession(users[index]);
      drawUser();
      notify('Đã cập nhật hồ sơ trong bản demo trên trình duyệt này.',true);
    } catch { notify('Không thể lưu hồ sơ trên trình duyệt.'); }
  });

  async function sha256(password,salt){
    const bytes = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2,'0')).join('');
  }
  $('password-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (!fields.currentPassword || !fields.newPassword || !fields.confirmPassword) return notify('Vui lòng nhập đủ ba trường mật khẩu.');
    if (fields.newPassword.length < 8) return notify('Mật khẩu mới phải có ít nhất 8 ký tự.');
    if (fields.newPassword !== fields.confirmPassword) return notify('Mật khẩu xác nhận không khớp.');
    if (fields.currentPassword === fields.newPassword) return notify('Mật khẩu mới phải khác mật khẩu hiện tại.');
    const users = getStoredUsers();
    const index = users.findIndex(u => String(u.userId) === String(current.userId));
    const user = users[index];
    if (!user?.salt || !user?.passwordHash) return notify('Không tìm thấy thông tin mật khẩu demo.');
    try {
      const oldHash = await sha256(fields.currentPassword, user.salt);
      if (oldHash !== user.passwordHash) return notify('Mật khẩu hiện tại không đúng.');
      const newHash = await sha256(fields.newPassword, user.salt);
      users[index] = {...user,passwordHash:newHash};
      localStorage.setItem(USERS, JSON.stringify(users));
      form.reset();
      notify('Đã đổi mật khẩu demo thành công.',true);
    } catch { notify('Không thể cập nhật mật khẩu. Hãy mở website qua localhost/HTTPS.'); }
  });

  const dataSource = () => window.SalonBookProfileData;
  // Adapter tường minh, không tự đọc bất kỳ dữ liệu Cart nào.
  async function loadBookings(){
    const node = $('bookings-message');
    if (typeof dataSource()?.getBookings !== 'function') {
      node.hidden = false;
      node.textContent = 'Chưa kết nối nguồn Booking chính thức. Lịch dự kiến trong giỏ hàng sẽ không hiển thị tại đây.';
      $('stat-bookings').textContent = '—'; $('stat-upcoming').textContent = '—';
      return;
    }
    node.hidden = false; node.textContent = 'Đang tải lịch hẹn…';
    try {
      const result = await dataSource().getBookings();
      if (!Array.isArray(result)) throw new Error('Booking response is not an array');
      // Chỉ là lọc phụ cho giao diện; backend vẫn bắt buộc kiểm tra userId.
      bookings = result.filter(b => b && String(b.userId ?? b.user_id) === String(current.userId));
      bookingLoaded = true;
      $('stat-bookings').textContent = String(bookings.length);
      $('stat-upcoming').textContent = String(bookings.filter(b => ['pending','confirmed'].includes(b.status)).length);
      renderBookings();
    } catch (err){ console.warn('Profile: Booking unavailable',err); node.textContent = 'Không thể tải dữ liệu Booking. Vui lòng thử lại khi hệ thống hoạt động.'; }
  }
  function make(tag, text, cls){
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    el.textContent = text == null ? '—' : String(text);
    return el;
  }
  function serviceText(item){
    const services = item.services ?? item.bookingServices;
    if (Array.isArray(services)) return services.map(s => typeof s === 'string' ? s : (s.name ?? s.serviceName ?? s.service?.name ?? 'Dịch vụ')).join(', ') || 'Chưa có';
    return item.serviceName || 'Chưa có';
  }
  function renderBookings(){
    const list = $('booking-list'); list.replaceChildren();
    const filter = $('booking-status').value;
    const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
    $('bookings-message').hidden = filtered.length > 0;
    if (!filtered.length) $('bookings-message').textContent = bookings.length ? 'Không có lịch hẹn thuộc trạng thái này.' : 'Bạn chưa có lịch hẹn nào trong hệ thống Booking.';
    filtered.forEach(item => {
      const card = make('article','', 'booking-card');
      const top = make('div','', 'booking-top');
      top.append(make('h3',item.salonName ?? item.salon?.name ?? 'Salon chưa cập nhật'));
      top.append(make('span',statuses[item.status] || 'Không rõ trạng thái',`booking-status ${item.status || ''}`));
      const meta = make('div','', 'booking-meta');
      [ `Dịch vụ: ${serviceText(item)}`, `Chuyên viên: ${item.stylistName ?? item.stylist?.name ?? 'Chưa chọn'}`, `Ngày: ${item.date ?? item.bookingDate ?? item.booking_date ?? '—'}`, `Giờ: ${item.time ?? item.startTime ?? item.start_time ?? '—'}`, `Giá dự kiến: ${money(item.totalPrice ?? item.total_price)}`].forEach(s => meta.append(make('span',s)));
      const button = make('button','Xem chi tiết','profile-secondary'); button.type = 'button';
      button.addEventListener('click',() => openBooking(item));
      card.append(top,meta,button);list.append(card);
    });
  }
  $('booking-status').addEventListener('change',renderBookings);
  function openBooking(item){
    selectedBooking = item;
    const body = $('booking-dialog-body'); body.replaceChildren();
    const dl = document.createElement('dl');
    const rows = [
      ['Mã lịch', item.id],['Salon',item.salonName ?? item.salon?.name],['Dịch vụ',serviceText(item)],
      ['Chuyên viên',item.stylistName ?? item.stylist?.name ?? 'Chưa chọn'],
      ['Ngày',item.date ?? item.bookingDate ?? item.booking_date],['Giờ',item.time ?? item.startTime ?? item.start_time],
      ['Tổng giá dự kiến',money(item.totalPrice ?? item.total_price)],['Trạng thái',statuses[item.status] ?? 'Không rõ']
    ];
    rows.forEach(([name,value]) => { const row=document.createElement('div');row.append(make('dt',name),make('dd',value));dl.append(row); });
    body.append(dl);
    // Không tự suy đoán quy định/hạn hủy; chỉ hiện nút khi hệ thống Booking cho phép.
    $('dialog-cancel-booking').hidden = !(
      ['pending','confirmed'].includes(item.status) && item.canCancel === true &&
      typeof dataSource()?.cancelBooking === 'function'
    );
    $('dialog-message').textContent = '';
    $('booking-dialog').showModal();
  }
  function closeDialog(){ $('booking-dialog').close(); }
  $('dialog-close').addEventListener('click', closeDialog);
  $('dialog-dismiss').addEventListener('click', closeDialog);
  $('booking-dialog').addEventListener('click', event => { if (event.target === $('booking-dialog')) closeDialog(); });
  $('dialog-cancel-booking').addEventListener('click',async () => {
    const booking = selectedBooking;
    if (!booking || !['pending','confirmed'].includes(booking.status) || booking.canCancel !== true ||
        typeof dataSource()?.cancelBooking !== 'function') return;
    if (!confirm('Bạn chắc chắn muốn gửi yêu cầu hủy lịch này?')) return;
    const button = $('dialog-cancel-booking'); button.disabled = true;
    try {
      await dataSource().cancelBooking(booking.id);
      closeDialog(); bookingLoaded = false; await loadBookings();
      notify('Yêu cầu hủy lịch đã được gửi. Trạng thái mới được lấy từ hệ thống Booking.',true);
    } catch (err){ console.warn(err); $('dialog-message').textContent = 'Không thể hủy lịch. Vui lòng kiểm tra điều kiện hủy và thử lại.'; }
    finally { button.disabled = false; }
  });

  async function loadConsultations(){
    const box = $('consultations-message');
    if (typeof dataSource()?.getConsultations !== 'function'){
      box.hidden=false;box.textContent='Chưa kết nối lịch sử tư vấn của tài khoản. Không có dữ liệu mẫu được tự tạo.';return;
    }
    box.hidden=false;box.textContent='Đang tải lịch sử tư vấn…';
    try {
      const result = await dataSource().getConsultations();
      if (!Array.isArray(result)) throw new Error('Invalid consultation response');
      consultations = result.filter(c => c && String(c.userId ?? c.user_id) === String(current.userId));
      consultationLoaded = true;
      $('stat-consultations').textContent=String(consultations.length);
      const list=$('consultations-list');list.replaceChildren();
      box.hidden=consultations.length>0;
      if (!consultations.length) box.textContent='Bạn chưa có lịch sử tư vấn nào.';
      consultations.forEach(c => {
        const card=make('article','','consultation-card');
        card.append(make('h3',c.title ?? 'Lần tư vấn'));
        card.append(make('p',c.summary ?? 'Chưa có tóm tắt tư vấn'));
        card.append(make('small',c.createdAt ?? c.created_at ?? ''));
        list.append(card);
      });
    } catch(err){ console.warn(err);box.textContent='Không thể tải lịch sử tư vấn.'; }
  }
  window.addEventListener('storage',event => {
    if (event.key === SESSION){
      const user=auth.currentUser();
      if (!user || String(user.userId)!==String(current.userId)) location.replace('auth.html?returnTo=profile.html');
      else drawUser();
    }
  });
  drawUser();
  root.hidden=false;
  // Cập nhật thống kê chỉ khi có nguồn dữ liệu thực.
  if (typeof dataSource()?.getBookings === 'function') loadBookings();
  if (typeof dataSource()?.getConsultations === 'function') loadConsultations();
})();
