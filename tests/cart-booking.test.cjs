const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../js/cart.js'),'utf8');
const products = [
  { id: 1, name:'The Hair Space', image:'images/salon-01.jpg', servicesList:[
    {id:'s1_1', name:'Cắt & tạo kiểu', price:150000, duration:'45 phút'},
    {id:'s1_2', name:'Nhuộm tóc', price:650000, duration:'90 phút'}],
    stylists: [{id:'st1',name:'Minh Trí', availableHours:['09:00','14:00']},
               {id:'st2',name:'Hải Yến', availableHours:['10:30']}]},
  { id: 2, name:'JUNO', image:'images/salon-02.jpg', servicesList:[
    {id:'s2_1', name:'Cắt & tạo kiểu', price:180000, duration:'45 phút'}],
    stylists: [{id:'st3',name:'Juno Lee', availableHours:['09:00']}]}
];
function create(initial = null) {
  const data = new Map(initial ? [['cart',initial]] : []);
  const localStorage = {getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,String(value))};
  const win = {localStorage};
  vm.runInNewContext(code,{window:win,products,console});
  return {cart:win.SalonCart,storage:data};
}
const future = () => {
  const d = new Date(); d.setDate(d.getDate()+10);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
const booking = () => ({stylistId:'st1',date:future(),time:'09:00'});

test('B01 lưu đủ stylistId/ngày/khung giờ và trả tên chuyên viên',()=>{
  const {cart}=create();
  assert.equal(cart.addToCart(1,'s1_1',1,booking()),true);
  const item=cart.getTotals().items[0];
  assert.equal(item.stylistName,'Minh Trí');
  assert.equal(item.bookingDate,future());
  assert.equal(item.bookingTime,'09:00');
  assert.equal(item.serviceName,'Cắt & tạo kiểu');
  assert.equal(item.isComplete,true);
});
test('B02 thêm lại cùng salon-dịch vụ-chuyên viên-ngày-giờ tăng SL, không tạo dòng trùng',()=>{
  const {cart}=create();
  cart.addToCart(1,'s1_1',1,booking());cart.addToCart(1,'s1_1',1,booking());
  assert.equal(cart.getCart().length,1);assert.equal(cart.getTotals().totalQuantity,2);
  assert.equal(cart.getTotals().totalAmount,300000);
});
test('B03 dịch vụ giống nhau nhưng khung giờ khác phải tách 2 dòng',()=>{
  const {cart}=create();
  cart.addToCart(1,'s1_1',1,booking());cart.addToCart(1,'s1_1',1,{...booking(),time:'14:00'});
  assert.equal(cart.getTotals().distinctItems,2);
});
test('B04 chuyên viên khác nhưng dịch vụ giống nhau là 2 dòng',()=>{
  const {cart}=create();
  cart.addToCart(1,'s1_1',1,booking());cart.addToCart(1,'s1_1',1,{...booking(),stylistId:'st2',time:'10:30'});
  assert.equal(cart.getTotals().distinctItems,2);
});
test('B05 không cho lưu lịch khi thiếu thợ, giờ không trong danh sách hoặc ngày đã qua',()=>{
  const {cart}=create();
  assert.equal(cart.addToCart(1,'s1_1',1,{...booking(),stylistId:''}),false);
  assert.equal(cart.addToCart(1,'s1_1',1,{...booking(),time:'18:20'}),false);
  assert.equal(cart.addToCart(1,'s1_1',1,{...booking(),date:'2021-01-01'}),false);
  assert.equal(cart.getTotals().totalQuantity,0);
});
test('B06 dữ liệu lịch hẹn được lưu/khôi phục qua localStorage',()=>{
  const {cart,storage}=create();cart.addToCart(1,'s1_2',1,booking());
  const restored=create(storage.get('cart')).cart;
  assert.equal(restored.getTotals().items[0].stylistName,'Minh Trí');
  assert.equal(restored.getTotals().totalAmount,650000);
});
test('B07 chuyển mục giỏ cũ thiếu lịch thành lịch đầy đủ và giữ SL',()=>{
  const {cart}=create();cart.addToCart(1,'s1_1',2);
  assert.equal(cart.getTotals().items[0].isComplete,false);
  assert.equal(cart.updateBooking('1:s1_1',{...booking(),serviceId:'s1_1'}),true);
  assert.equal(cart.getTotals().items[0].isComplete,true);
  assert.equal(cart.getTotals().totalQuantity,2);
});
test('B08 chỉnh sửa thời gian sẽ thay khóa không mất mục khác',()=>{
  const {cart}=create();cart.addToCart(1,'s1_1',1,booking());
  const key=cart.getCart()[0].key;
  assert.equal(cart.updateBooking(key,{...booking(),time:'14:00'}),true);
  assert.equal(cart.getCart()[0].time,'14:00');
  assert.equal(cart.getTotals().totalAmount,150000);
});
test('B09 sửa lịch trùng một lịch khác sẽ gộp đúng số lượng',()=>{
  const {cart}=create();cart.addToCart(1,'s1_1',2,booking());cart.addToCart(1,'s1_1',3,{...booking(),time:'14:00'});
  const second=cart.getCart().find(x=>x.time==='14:00');
  assert.equal(cart.updateBooking(second.key,booking()),true);
  assert.equal(cart.getTotals().distinctItems,1);assert.equal(cart.getTotals().totalQuantity,5);
});
test('B10 giá lấy từ servicesList; không tin giá giả trong localStorage',()=>{
  const raw=JSON.stringify([{salonId:1,serviceId:'s1_1',quantity:1,price:1,...booking()}]);
  assert.equal(create(raw).cart.getTotals().totalAmount,150000);
});
test('B11 dữ liệu cũ vẫn khôi phục được, không mất giỏ',()=>{
  const raw=JSON.stringify([{key:'1:s1_1',salonId:1,serviceId:'s1_1',quantity:3}]);
  const {cart}=create(raw);
  assert.equal(cart.getTotals().totalAmount,450000);
  assert.equal(cart.getTotals().items[0].isComplete,false);
});
test('B12 chặn chỉnh sửa lịch bằng id không hợp lệ',()=>{
  const {cart}=create();cart.addToCart(1,'s1_1',1);
  assert.equal(cart.updateBooking('1:s1_1',{...booking(),stylistId:'st3'}),false);
  assert.equal(cart.getCart()[0].key,'1:s1_1');
});
