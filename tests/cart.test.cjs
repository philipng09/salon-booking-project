const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '../js/cart.js'), 'utf8');
const products = [
  { id: 1, name: 'The Hair Space', image: 'images/salon-01.jpg', servicesList: [
    { id: 's1_1', name: 'Cắt & tạo kiểu', price: 150000, duration: '45 phút' },
    { id: 's1_2', name: 'Nhuộm tóc', price: 650000, duration: '90 phút' }
  ] },
  { id: 2, name: 'JUNO HAIR STUDIO', image: 'images/salon-02.jpg', servicesList: [
    { id: 's2_1', name: 'Cắt & tạo kiểu', price: 180000, duration: '45 phút' }
  ] }
];
function start(initial = null) {
  const store = new Map();
  if (initial !== null) store.set('cart', initial);
  const localStorage = {getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v))};
  const win = {localStorage};
  const context = vm.createContext({window:win, products, console});
  vm.runInContext(code, context);
  return {cart: win.SalonCart, store};
}
function simple(cart) {return JSON.parse(JSON.stringify(cart.getCart()));}

test('TC01 thêm dịch vụ từ danh sách: lấy dịch vụ đầu tiên của salon', () => {
  const {cart} = start();
  assert.equal(cart.addToCart(1), true);
  assert.deepEqual(simple(cart), [{key:'1:s1_1',salonId:1,serviceId:'s1_1',quantity:1}]);
});
test('TC02 thêm cùng dịch vụ 2 lần không phát sinh dòng trùng', () => {
  const {cart} = start(); cart.addToCart(1,'s1_1'); cart.addToCart('1','s1_1');
  assert.equal(cart.getCart().length, 1); assert.equal(cart.getTotals().totalQuantity, 2);
});
test('TC03 khác dịch vụ cùng salon là hai dòng độc lập', () => {
  const {cart} = start(); cart.addToCart(1,'s1_1'); cart.addToCart(1,'s1_2');
  assert.equal(cart.getCart().length, 2); assert.equal(cart.getTotals().totalAmount, 800000);
});
test('TC04 cùng tên dịch vụ khác salon không gộp trùng', () => {
  const {cart} = start(); cart.addToCart(1,'s1_1'); cart.addToCart(2,'s2_1');
  assert.equal(cart.getCart().length, 2);
});
test('TC05 thay đổi số lượng cập nhật tiền dòng, tổng số và tổng tiền', () => {
  const {cart} = start(); cart.addToCart(1,'s1_1'); cart.addToCart(1,'s1_2');
  assert.equal(cart.updateQuantity('1:s1_1',3), true);
  const result=cart.getTotals();
  assert.equal(result.totalQuantity,4); assert.equal(result.totalAmount,1100000);
  assert.equal(result.items.find(x=>x.key==='1:s1_1').lineTotal,450000);
});
test('TC06 tăng thêm dịch vụ đã có làm tăng số lượng đúng n', () => {
  const {cart} = start(); cart.addToCart(1,'s1_1',2); cart.addToCart(1,'s1_1',3);
  assert.equal(cart.getTotals().totalQuantity,5);
});
test('TC07 xóa dịch vụ và đưa giỏ về trạng thái trống', () => {
  const {cart} = start(); cart.addToCart(1,'s1_1');
  assert.equal(cart.removeFromCart('1:s1_1'),true);
  assert.deepEqual(simple(cart),[]); assert.equal(cart.getTotals().totalAmount,0);
});
test('TC08 tải lại module phục hồi localStorage', () => {
  const {cart,store} = start(); cart.addToCart(1,'s1_1',2);
  const restored = start(store.get('cart')).cart;
  assert.equal(restored.getTotals().totalQuantity,2);
  assert.equal(restored.getTotals().totalAmount,300000);
});
test('TC09 JSON lỗi hoặc lưu trữ không tồn tại không làm sập trang', () => {
  assert.deepEqual(simple(start('{broken').cart),[]);
  assert.deepEqual(simple(start().cart),[]);
});
test('TC10 loại bỏ mục dịch vụ không tồn tại và hợp nhất mục trùng dữ liệu cũ', () => {
  const raw = JSON.stringify([{salonId:1,serviceId:'s1_1',quantity:2},{salonId:1,serviceId:'s1_1',quantity:1},{salonId:999,serviceId:'xxx',quantity:1}]);
  const {cart}=start(raw); assert.equal(cart.getCart().length,1); assert.equal(cart.getTotals().totalQuantity,3);
});
test('TC11 từ chối số lượng âm, lẻ và khóa số lượng ở ngưỡng 99', () => {
  const {cart}=start(); assert.equal(cart.addToCart(1,'s1_1',-1),false);
  cart.addToCart(1,'s1_1'); assert.equal(cart.updateQuantity('1:s1_1',2.5),false);
  cart.addToCart(1,'s1_1',150); assert.equal(cart.getCart()[0].quantity,99);
});
test('TC12 cập nhật số lượng bằng 0 tương đương xóa mục', () => {
  const {cart}=start(); cart.addToCart(2,'s2_1');
  assert.equal(cart.updateQuantity('2:s2_1',0),true);
  assert.equal(cart.getCart().length,0);
});
test('TC13 không thể thêm salon / dịch vụ ID không tồn tại', () => {
  const {cart}=start(); assert.equal(cart.addToCart(999,'x'),false); assert.equal(cart.addToCart(1,'x'),false);
  assert.equal(cart.getTotals().totalAmount,0);
});
