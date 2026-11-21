"""Offline browser smoke test: DOM + real booking logic, with navigation intercepted.
No network dependency; executable uses system Chromium and a mock catalog.
"""
from pathlib import Path
import re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
PRODUCTS='''const products=[{id:1,slug:'the-hair-space',name:'The Hair Space',address:'34 Phó Đức Chính, Quận 1, TP.HCM',image:'images/salon-01.jpg',openingHours:{open:'09:00',close:'20:00',closedDays:[]},stylists:[{id:'st1_1',name:'Minh Trí',experience:'8 năm',availableHours:['09:00','10:30','14:00','16:00']},{id:'st1_2',name:'Hải Yến',experience:'5 năm',availableHours:['09:30','11:00','14:30','16:30']}],servicesList:[{id:'s1_1',name:'Cắt & tạo kiểu',duration:45,price:150000},{id:'s1_4',name:'Phục hồi tóc',duration:60,price:450000}]}]'''
JS=(ROOT/'js/booking-flow.js').read_text()
# In the browser sandbox, outgoing page navigations are administratively blocked.
# Replace ONLY the actual navigation expression, preserving state and handlers.
for page in ['booking-customer.html','booking-review.html','booking-result.html']:
    JS=JS.replace(f"location.href='{page}';",f"window.__nextUrl='{page}';")
COMMON_CSS='''body{font-family:Arial,sans-serif;margin:0} .site-header{display:none}.site-footer{display:none}.booking-page .booking-container{max-width:1160px}'''
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for width in [1280,390]:
        page=browser.new_page(viewport={'width':width,'height':844})
        page.goto('about:blank')
        # Mock only sessionStorage (about:blank has no storage origin).
        page.evaluate('''() => {const data={};Object.defineProperty(window,'sessionStorage',{configurable:true,value:{setItem:(a,b)=>data[a]=String(b),getItem:a=>data[a]??null,removeItem:a=>delete data[a]}});sessionStorage.setItem('salonbook_pending_booking',JSON.stringify({salonId:1,serviceIds:[],selections:[]}));window.SalonBookAuth={currentUser:()=>({})};}''')
        page.add_script_tag(content=PRODUCTS)
        failures=[]
        page.on('pageerror',lambda e:failures.append(str(e)))
        def load(name):
            page.set_content((ROOT/name).read_text(),wait_until='load')
            page.add_style_tag(content=COMMON_CSS)
            page.add_style_tag(content=(ROOT/'css/booking-flow.css').read_text())
            page.add_script_tag(content=JS)
        load('booking-select.html')
        assert page.locator('#bk-salon-name').inner_text()=='The Hair Space'
        assert page.locator('input[name=service]').count()==2
        page.locator('input[name=service]').nth(0).check()
        page.locator('input[name=service]').nth(1).check()
        assert '600.000' in page.locator('#bk-total').inner_text()
        page.locator('input[name=stylist]').nth(0).check()
        day=page.evaluate('''() => {const d=new Date();d.setDate(d.getDate()+1);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}''')
        page.locator('#bk-select-date').fill(day)
        assert page.locator('.booking-time-option').count()==4
        page.get_by_role('button',name='14:00').click()
        page.get_by_role('button',name=re.compile('Tiếp tục: Thông tin KH')).click()
        assert page.evaluate('window.__nextUrl')=='booking-customer.html'
        draft=page.evaluate("JSON.parse(sessionStorage.getItem('salonbook_pending_booking'))")
        assert len(draft['serviceIds'])==2
        load('booking-customer.html')
        assert '600.000' in page.locator('#bk-total').inner_text()
        page.locator('#bk-customer-name').fill('Nguyễn An')
        page.locator('#bk-customer-phone').fill('123')
        page.locator('#bk-accept').check()
        page.get_by_role('button',name=re.compile('Tiếp tục: Xác nhận')).click()
        assert page.locator('#bk-customer-error').is_visible()
        page.locator('#bk-customer-phone').fill('0912345678')
        page.get_by_role('button',name=re.compile('Tiếp tục: Xác nhận')).click()
        assert page.evaluate('window.__nextUrl')=='booking-review.html'
        load('booking-review.html')
        assert page.locator('#bk-review-name').inner_text()=='Nguyễn An'
        assert page.locator('#bk-review-phone').inner_text()=='0912345678'
        page.locator('#bk-final-agree').check()
        page.get_by_role('button',name=re.compile('Ghi nhận yêu cầu')).click()
        assert page.evaluate('window.__nextUrl')=='booking-result.html'
        assert page.evaluate("sessionStorage.getItem('salonbook_pending_booking')") is None
        assert page.evaluate("sessionStorage.getItem('salonbook_booking_customer_v1')") is None
        load('booking-result.html')
        assert page.locator('#bk-result-code').inner_text().startswith('SB-DEMO-')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'Overflow {width}px'
        assert not failures,failures
        print(f'PASS width={width}: 4 screens, 2 services, amount, date/stylist/time, phone validation, demo result, session cleanup, no overflow')
        page.close()
    browser.close()

# Existing product-detail.html compatibility: preserve old add-to-cart and intercept
# only the already-present direct booking button at capture phase.
ENTRY=(ROOT/'js/booking-entry.js').read_text().replace("location.href='booking-customer.html';","window.__nextUrl='booking-customer.html';")
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page()
    page.goto('about:blank')
    page.evaluate('''() => {const data={};Object.defineProperty(window,'sessionStorage',{configurable:true,value:{setItem:(a,b)=>data[a]=String(b),getItem:a=>data[a]??null}});window.SalonBookAuth={currentUser:()=>({id:1})}}''')
    page.set_content('''<div class="detail-booking-form">
      <select id="detail-service-select"><option value="s1_1" selected>Cắt</option></select>
      <select id="detail-stylist-select"><option value="st1_1" selected>Trí</option></select>
      <input id="detail-date" type="date">
      <div id="detail-time-grid"><button class="btn-time-slot" data-time="14:00" style="background-color:#ffc501">14:00</button></div>
      <button id="add-to-cart-btn" type="button">Add</button>
      <button id="direct-booking-btn" type="button">Đặt lịch ngay</button></div>''')
    page.add_script_tag(content=PRODUCTS)
    page.evaluate('''() => {window.legacyCalled=0}''')
    tomorrow=page.evaluate('''() => {const d=new Date();d.setDate(d.getDate()+1);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}''')
    page.locator('#detail-date').fill(tomorrow)
    page.add_script_tag(content=ENTRY)
    # Existing booking-bridge.js installs document capture listener AFTER entry script.
    page.evaluate('''() => document.addEventListener('click',e=>{if(e.target.closest('#direct-booking-btn')){window.legacyCalled++;e.stopImmediatePropagation()}},true)''')
    assert page.locator('#booking-multi-service-link').count()==1
    page.locator('#direct-booking-btn').click()
    assert page.evaluate('window.legacyCalled')==0
    assert page.evaluate('window.__nextUrl')=='booking-customer.html'
    assert page.evaluate('JSON.parse(sessionStorage.getItem("salonbook_pending_booking")).serviceIds[0]')=='s1_1'
    print('PASS existing detail integration: button capture, one service draft, cart untouched')
    browser.close()
