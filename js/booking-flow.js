/* SalonBook booking screens - static front-end demonstration; no server booking. */
(function () {
  'use strict';
  const DRAFT_KEY = 'salonbook_pending_booking';
  const CONTACT_KEY = 'salonbook_booking_customer_v1';
  const RESULT_KEY = 'salonbook_booking_demo_result_v1';
  const catalog = () => (typeof products !== 'undefined' && Array.isArray(products)) ? products : [];
  const $ = id => document.getElementById(id);
  const money = n => Number(n || 0).toLocaleString('vi-VN') + ' ₫';
  const text = (id, value) => { const el = $(id); if (el) el.textContent = String(value ?? '—'); };
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (_) { return null; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const today = () => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth()+1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  };
  const formatDate = iso => /^\d{4}-\d{2}-\d{2}$/.test(String(iso))
    ? `${iso.slice(8,10)}/${iso.slice(5,7)}/${iso.slice(0,4)}` : 'Chưa chọn';
  const error = (id,message) => { const el = $(id); if (el) { el.hidden = !message; el.textContent = message || ''; } };
  const appendText = (parent, tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = String(value ?? ''); parent.append(el); return el;
  };
  const getSalon = id => catalog().find(item => String(item.id) === String(id)) || null;
  const getServices = (salon, ids) => (ids || []).map(id => salon.servicesList?.find(s => String(s.id) === String(id))).filter(Boolean);
  const getStylist = (salon, id) => salon.stylists?.find(s => String(s.id) === String(id)) || null;
  const keyFromUrl = () => new URLSearchParams(location.search).get('salonId');

  // A salon appointment has ONE chosen start time and stylist for all selected services.
  // The mock availableHours data is NOT actual server availability.
  function snapshot() {
    const draft = read(DRAFT_KEY);
    if (!draft || !draft.salonId) return null;
    const salon = getSalon(draft.salonId);
    if (!salon) return null;
    const unique = [...new Set((Array.isArray(draft.serviceIds) ? draft.serviceIds : []).map(String))];
    const services = getServices(salon, unique);
    if (!services.length) return null;
    const selected = (Array.isArray(draft.selections) ? draft.selections : []).find(s =>
      s && s.stylistId && s.date && s.time && getStylist(salon,s.stylistId));
    const fallback = (Array.isArray(draft.selections) ? draft.selections : [])[0] || {};
    const appointment = {
      stylistId: selected?.stylistId || fallback.stylistId || '',
      date: selected?.date || fallback.date || '',
      time: selected?.time || fallback.time || ''
    };
    return { salon, services, draft, appointment,
      stylist:getStylist(salon, appointment.stylistId),
      total:services.reduce((sum,s)=>sum+Number(s.price||0),0),
      duration:services.reduce((sum,s)=>sum+Number(s.duration||0),0) };
  }
  function dateIsValid(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
    const d = new Date(value+'T12:00:00');
    return !Number.isNaN(d.getTime()) &&
      d.getFullYear()===Number(value.slice(0,4)) &&
      d.getMonth()+1===Number(value.slice(5,7)) && d.getDate()===Number(value.slice(8,10));
  }
  function isClosed(salon, date) {
    if (!dateIsValid(date)) return true;
    const day = new Date(date+'T12:00:00').getDay();
    const labels = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
    return Array.isArray(salon.openingHours?.closedDays) && salon.openingHours.closedDays.includes(labels[day]);
  }
  function validateSlot(snap) {
    if (!snap) return 'Không tìm thấy thông tin lịch. Vui lòng chọn salon và dịch vụ lại.';
    const {salon,stylist,appointment,duration} = snap;
    if (!stylist) return 'Vui lòng chọn chuyên viên.';
    if (!dateIsValid(appointment.date) || appointment.date < today()) return 'Vui lòng chọn ngày đặt lịch hợp lệ trong tương lai.';
    if (isClosed(salon,appointment.date)) return 'Salon không hoạt động vào ngày được chọn.';
    if (!/^\d{2}:\d{2}$/.test(appointment.time) || !stylist.availableHours?.includes(appointment.time)) return 'Vui lòng chọn một khung giờ của chuyên viên.';
    const start = new Date(`${appointment.date}T${appointment.time}:00`);
    if (!(start.getTime() > Date.now())) return 'Khung giờ này đã qua. Vui lòng chọn khung giờ khác.';
    const open = salon.openingHours?.open, close = salon.openingHours?.close;
    const mins = s => { if (!/^\d{2}:\d{2}$/.test(s||'')) return null; const [h,m] = s.split(':').map(Number); return h*60+m; };
    if (mins(open)!==null && mins(appointment.time)<mins(open)) return 'Giờ hẹn nằm trước giờ mở cửa.';
    if (mins(close)!==null && mins(appointment.time)+duration>mins(close)) return 'Tổng thời lượng dịch vụ vượt quá giờ đóng cửa. Vui lòng chọn giờ sớm hơn.';
    return '';
  }
  function summary(snap) {
    if (!snap) return;
    const {salon, services, appointment, stylist,total} = snap;
    const image = $('bk-salon-image');
    if (image) { image.src=salon.image || 'images/salonbook-mark.png'; image.alt=`Hình ảnh ${salon.name}`; image.onerror=()=>{image.onerror=null;image.src='images/salonbook-mark.png';}; }
    text('bk-salon-name',salon.name); text('bk-salon-address',salon.address);
    const root=$('bk-service-summary');
    if(root){root.replaceChildren();services.forEach(item=>{
      const line=appendText(root,'div','booking-service-line','');line.textContent='';
      const span=appendText(line,'span','',item.name);
      appendText(span,'small','',`${item.duration} phút`);
      appendText(line,'strong','',money(item.price));
    });}
    text('bk-total',money(total)); text('bk-stylist',stylist?.name || 'Chưa chọn');
    text('bk-date',formatDate(appointment.date)); text('bk-time',appointment.time || 'Chưa chọn');
  }
  function gate(message) {
    const panel=$('booking-gate');
    if (!panel) return;
    panel.hidden=false;panel.textContent=message;
    panel.append(document.createTextNode(' '));
    const link=document.createElement('a');link.href='products.html';link.textContent='Quay lại khám phá salon';panel.append(link);
  }
  function redirectIfInvalid() {
    const snap=snapshot();
    if(!snap){gate('Bạn chưa có bản nháp đặt lịch hợp lệ.');return null;}
    const msg=validateSlot(snap);
    if(msg){gate(msg+' Hãy chọn lại lịch.');return null;}
    summary(snap);
    return snap;
  }

  function initSelect() {
    const form=$('booking-select-form');if(!form) return;
    const queryId=keyFromUrl();
    const previous=read(DRAFT_KEY);
    const salon=getSalon(queryId || previous?.salonId);
    if(!salon){form.hidden=true;gate('Không tìm thấy salon.');return;}
    const availableServices=salon.servicesList || [];
    const savedIds=(String(previous?.salonId)===String(salon.id) && Array.isArray(previous.serviceIds))?previous.serviceIds.map(String):[];
    const savedSelection=(String(previous?.salonId)===String(salon.id) && Array.isArray(previous.selections))?previous.selections.find(s=>s?.stylistId && s?.date && s?.time)||previous.selections[0]:null;
    const sRoot=$('bk-service-options');
    availableServices.forEach(service=>{
      const label=appendText(sRoot,'label','booking-check-option','');label.textContent='';
      const input=document.createElement('input'); input.type='checkbox';input.name='service';input.value=String(service.id);input.checked=savedIds.includes(String(service.id));
      label.append(input);
      const caption=appendText(label,'span','booking-option-label',service.name);
      appendText(caption,'small','',`${service.duration} phút`);
      appendText(label,'span','booking-option-price',money(service.price));
      input.addEventListener('change',update);
    });
    const tRoot=$('bk-stylist-options');
    (salon.stylists||[]).forEach(stylist=>{
      const label=appendText(tRoot,'label','booking-radio-option','');label.textContent='';
      const input=document.createElement('input');input.type='radio';input.name='stylist';input.value=String(stylist.id);input.checked=String(stylist.id)===String(savedSelection?.stylistId||'');
      label.append(input);
      const caption=appendText(label,'span','booking-option-label',stylist.name);
      appendText(caption,'small','',stylist.experience?`Kinh nghiệm ${stylist.experience}`:'Chuyên viên');
      input.addEventListener('change',()=>{chosenTime='';update();});
    });
    const date=$('bk-select-date');date.min=today();
    date.value=dateIsValid(savedSelection?.date)&&savedSelection.date>=today()?savedSelection.date:'';
    let chosenTime=savedSelection?.time || '';
    date.addEventListener('change',()=>{chosenTime='';update();});
    const currentIds=()=>[...form.querySelectorAll('input[name="service"]:checked')].map(el=>el.value);
    const stylistId=()=>form.querySelector('input[name="stylist"]:checked')?.value||'';
    function viewSnapshot(){
      const services=getServices(salon,currentIds());const time=chosenTime;
      const appointment={stylistId:stylistId(),date:date.value,time};
      return {salon,services,appointment,stylist:getStylist(salon,appointment.stylistId),
        total:services.reduce((s,x)=>s+Number(x.price||0),0),duration:services.reduce((s,x)=>s+Number(x.duration||0),0)};
    }
    function update(){
      const snap=viewSnapshot();summary(snap);
      const hours=snap.stylist?.availableHours||[];const root=$('bk-time-options');root.replaceChildren();
      if(!snap.stylist||!date.value){appendText(root,'span','', 'Chọn chuyên viên và ngày để xem khung giờ.');return;}
      if(isClosed(salon,date.value)){appendText(root,'span','', 'Salon nghỉ vào ngày này. Vui lòng chọn ngày khác.');return;}
      if(!hours.includes(chosenTime))chosenTime='';
      hours.forEach(time=>{
        const button=appendText(root,'button','booking-time-option',time);button.type='button';
        const proposed={...snap,appointment:{...snap.appointment,time}};
        button.disabled=Boolean(validateSlot(proposed));
        if(button.disabled && chosenTime===time)chosenTime='';
        button.setAttribute('aria-pressed',String(chosenTime===time));
        button.addEventListener('click',()=>{chosenTime=time;update();});
      });
    }
    form.addEventListener('submit',event=>{
      event.preventDefault();const s=viewSnapshot();
      if(!s.services.length){error('bk-select-error','Bạn cần chọn ít nhất một dịch vụ.');return;}
      const problem=validateSlot(s);
      if(problem){error('bk-select-error',problem);return;}
      const draft={salonId:s.salon.id,serviceIds:s.services.map(x=>String(x.id)),selections:s.services.map(x=>({serviceId:String(x.id),...s.appointment})),source:'booking-form',createdAt:new Date().toISOString()};
      if(!write(DRAFT_KEY,draft)){error('bk-select-error','Không thể lưu bản nháp trên trình duyệt.');return;}
      sessionStorage.removeItem(CONTACT_KEY);sessionStorage.removeItem(RESULT_KEY);
      location.href='booking-customer.html';
    });
    update();
  }

  function initCustomer() {
    const form=$('booking-customer-form');if(!form)return;
    const snap=redirectIfInvalid();if(!snap){form.hidden=true;return;}
    const existing=read(CONTACT_KEY);
    const authUser=window.SalonBookAuth?.currentUser?.()||null;
    $('bk-customer-name').value=existing?.name||authUser?.name||'';
    $('bk-customer-phone').value=existing?.phone||authUser?.phone||'';
    $('bk-customer-email').value=existing?.email||authUser?.email||'';
    $('bk-customer-note').value=existing?.note||'';
    const change=$('bk-change-selection'),back=$('bk-back-select');
    [change,back].forEach(a=>{if(a)a.href=`booking-select.html?salonId=${encodeURIComponent(snap.salon.id)}`;});
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const name=$('bk-customer-name').value.trim();
      const phone=$('bk-customer-phone').value.replace(/[\s().-]/g,'').trim();
      const email=$('bk-customer-email').value.trim();
      const note=$('bk-customer-note').value.trim();
      if(name.length<2){error('bk-customer-error','Vui lòng nhập họ tên từ 2 ký tự trở lên.');return;}
      if(!/^(?:0[35789]\d{8}|\+84[35789]\d{8})$/.test(phone)){
        error('bk-customer-error','Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số, ví dụ 0912345678.');return;
      }
      if(!$('bk-accept').checked){error('bk-customer-error','Vui lòng xác nhận thông tin và lưu ý về bản demo.');return;}
      if(!write(CONTACT_KEY,{name,phone,email,note})){error('bk-customer-error','Trình duyệt không thể lưu thông tin.');return;}
      location.href='booking-review.html';
    });
  }

  function initReview() {
    const button=$('bk-confirm-btn');if(!button)return;
    const snap=redirectIfInvalid();const contact=read(CONTACT_KEY);
    if(!snap||!contact){button.disabled=true;gate('Thiếu thông tin khách hàng. Vui lòng quay về bước trước.');return;}
    text('bk-review-name',contact.name);text('bk-review-phone',contact.phone);
    text('bk-review-email',contact.email||'Không cung cấp');text('bk-review-note',contact.note||'Không có');
    button.addEventListener('click',()=>{
      if(!$('bk-final-agree').checked){error('bk-review-error','Vui lòng xác nhận bạn đã kiểm tra thông tin.');return;}
      const now=redirectIfInvalid();if(!now){error('bk-review-error','Khung giờ đã không còn hợp lệ. Vui lòng chọn lại.');return;}
      button.disabled=true;
      const code='SB-DEMO-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,5).toUpperCase();
      const result={code,salonId:now.salon.id,serviceIds:now.services.map(x=>String(x.id)),
        stylistId:now.appointment.stylistId,date:now.appointment.date,time:now.appointment.time,
        total:now.total,createdAt:new Date().toISOString(),status:'demo-local-only'};
      if(!write(RESULT_KEY,result)){button.disabled=false;error('bk-review-error','Không thể lưu bản demo trên trình duyệt.');return;}
      sessionStorage.removeItem(CONTACT_KEY); // Do not retain customer personal data after final step.
      sessionStorage.removeItem(DRAFT_KEY);
      location.href='booking-result.html';
    });
  }

  function initResult(){
    if(!$('bk-result-code'))return;
    const record=read(RESULT_KEY);const salon=getSalon(record?.salonId);
    if(!record||!salon||record.status!=='demo-local-only'){
      text('bk-result-code','Không có bản demo vừa tạo');return;
    }
    const names=getServices(salon,record.serviceIds).map(s=>s.name);
    text('bk-result-code',record.code);text('bk-result-salon',salon.name);
    text('bk-result-service',names.join(', ')||'—');
    text('bk-result-stylist',getStylist(salon,record.stylistId)?.name||'—');
    text('bk-result-date',`${formatDate(record.date)} · ${record.time}`);
    text('bk-result-total',money(record.total));
  }
  function init(){initSelect();initCustomer();initReview();initResult();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.SalonBookBookingDemo={today,formatDate,validateSlot};
})();
