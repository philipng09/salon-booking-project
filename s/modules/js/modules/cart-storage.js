const CART_KEY = "salonbook_cart";
const CART_VERSION = 1;

const emptyCart = () => ({ version: CART_VERSION, items: [] });
const findService = (id) => services.find((s) => s.id === id);

// Đọc giỏ: xử lý chưa có dữ liệu, JSON hỏng, sai cấu trúc, dịch vụ không còn tồn tại
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return emptyCart();                       // chưa có dữ liệu
    const data = JSON.parse(raw);
    if (!data || data.version !== CART_VERSION || !Array.isArray(data.items)) {
      throw new Error("Sai cấu trúc giỏ");
    }
    data.items = data.items.filter(
      (it) => Number.isInteger(it.id) && Number.isInteger(it.quantity)
              && it.quantity > 0 && findService(it.id)
    );
    return data;
  } catch (err) {
    console.warn("Giỏ lưu bị hỏng, đặt lại giỏ rỗng:", err);
    try { localStorage.removeItem(CART_KEY); } catch (_) {}
    return emptyCart();
  }
}

// Ghi giỏ: gọi sau MỖI lần thêm / xóa / đổi số lượng
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Không lưu được giỏ:", err);          // đầy bộ nhớ / chế độ riêng tư
  }
  updateCartBadge();
}

// Tính lại từ dữ liệu đã khôi phục (không lưu tổng tiền vào storage)
function getCartDetails(cart = loadCart()) {
  return cart.items.map((it) => {
    const s = findService(it.id);
    return { ...s, quantity: it.quantity, subtotal: s.price * it.quantity };
  });
}
const getCartTotal = (cart) => getCartDetails(cart).reduce((t, i) => t + i.subtotal, 0);
const getCartCount = (cart) => loadCart().items.reduce((t, i) => t + i.quantity, 0);
const getCartDuration = (cart) =>
  getCartDetails(cart).reduce((t, i) => t + i.duration * i.quantity, 0); // nếu có trường duration

// Cập nhật số trên icon giỏ ở thanh điều hướng (mọi trang đều có <span class="cart-count">)
function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => (el.textContent = getCartCount()));
}
document.addEventListener("DOMContentLoaded", updateCartBadge);

// Đồng bộ khi mở nhiều tab
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) {
    updateCartBadge();
    if (typeof renderCart === "function") renderCart();
  }
});
