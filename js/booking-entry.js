/* SalonBook | New booking flow integration.
 * IMPORTANT: Load this script BEFORE js/booking-bridge.js in product-detail.html.
 * The existing bridge intercepts clicks on the document in CAPTURE phase.
 * Register this narrower direct-booking capture handler first so it can redirect
 * to the new customer screen while leaving cart and other actions untouched.
 */
(function () {
  'use strict';
  const DRAFT_KEY = 'salonbook_pending_booking';
  function findSalon() {
    const params=new URLSearchParams(location.search);
    const raw=params.get('salonId')||params.get('id')||params.get('salon')||'1';
    const list=(typeof products!=='undefined'&&Array.isArray(products))?products:[];
    return list.find(s=>String(s.id)===String(raw)||String(s.slug)===String(raw));
  }
  function selectedTime() {
    const buttons=[...document.querySelectorAll('#detail-time-grid .btn-time-slot')];
    const selected=buttons.find(el=>
      el.getAttribute('aria-pressed')==='true'||
      /255,\s*197,\s*1/.test(el.style.backgroundColor) ||
      /#ffc501/i.test(el.style.backgroundColor));
    return selected?.dataset.time||'';
  }
  function runBooking(event) {
    const button=event.target instanceof Element ? event.target.closest('#direct-booking-btn') : null;
    if(!button)return; // Leave existing add-to-cart, nav and other actions untouched.
    event.preventDefault();
    event.stopImmediatePropagation();
    const salon=findSalon();
    const serviceId=document.getElementById('detail-service-select')?.value||'';
    const stylistId=document.getElementById('detail-stylist-select')?.value||'';
    const date=document.getElementById('detail-date')?.value||'';
    const time=selectedTime();
    const service=salon?.servicesList?.find(s=>String(s.id)===String(serviceId));
    const stylist=salon?.stylists?.find(s=>String(s.id)===String(stylistId));
    if(!salon||!service){alert('Vui lòng chọn salon và dịch vụ trước.');return;}
    if(!stylist){alert('Vui lòng chọn chuyên viên.');return;}
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!time||!stylist.availableHours?.includes(time)){
      alert('Vui lòng chọn ngày và khung giờ hợp lệ.');return;
    }
    const start=new Date(`${date}T${time}:00`);
    if(!(start.getTime()>Date.now())){alert('Khung giờ đã qua. Vui lòng chọn lại.');return;}
    let old=null;
    try{old=JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'null');}catch(_){}
    const same=old?.source==='cart' && String(old.salonId)===String(salon.id) &&
      Array.isArray(old.serviceIds) && old.serviceIds.map(String).includes(String(service.id));
    const ids=same?[...new Set(old.serviceIds.map(String).filter(sid=>salon.servicesList.some(s=>String(s.id)===sid)))]:[String(service.id)];
    const selections=ids.map(sid=>({serviceId:sid,stylistId:String(stylist.id),date,time}));
    try{
      sessionStorage.setItem(DRAFT_KEY,JSON.stringify({salonId:salon.id,serviceIds:ids,selections,source:same?'cart':'direct',createdAt:new Date().toISOString()}));
    }catch(_){alert('Không thể lưu lựa chọn trong phiên trình duyệt.');return;}
    if(window.SalonBookAuth && !window.SalonBookAuth.currentUser()){
      location.href='auth.html?returnTo='+encodeURIComponent('booking-customer.html');
    }else{
      location.href='booking-customer.html';
    }
  }
  // Must run during script evaluation, before booking-bridge.js registers its capture listener.
  document.addEventListener('click',runBooking,true);

  function addMultiServiceLink(){
    const salon=findSalon();
    const anchor=document.getElementById('direct-booking-btn')||document.getElementById('add-to-cart-btn');
    if(!salon||!anchor||document.getElementById('booking-multi-service-link'))return;
    const link=document.createElement('a');
    link.id='booking-multi-service-link';
    link.href='booking-select.html?salonId='+encodeURIComponent(String(salon.id));
    link.textContent='✓ Chọn nhiều dịch vụ & đặt lịch';
    link.style.cssText='display:block;text-align:center;margin-top:12px;padding:12px;border:1px solid #0c513f;border-radius:11px;color:#0c513f;font-weight:750;background:#eef6ef;text-decoration:none';
    anchor.insertAdjacentElement('afterend',link);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addMultiServiceLink);
  else addMultiServiceLink();
})();
