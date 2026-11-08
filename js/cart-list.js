/* Bổ sung nút thêm dịch vụ trên danh sách salon được render động bởi TV1.
 * Tách riêng để không sửa js/render-products.js và không ảnh hưởng bộ lọc hiện có.
 */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("salon-grid");
  if (!grid || typeof products === "undefined" || !window.SalonCart) return;
  function insertButtons() {
    grid.querySelectorAll(".product-salon-card").forEach(card => {
      if (card.querySelector("[data-cart-add]")) return;
      const salon = products.find(item => item.name === card.dataset.name);
      if (!salon || !salon.servicesList?.length) return;
      const service = salon.servicesList[0];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "salon-add-cart";
      button.dataset.cartAdd = "";
      button.dataset.salonId = String(salon.id);
      button.dataset.serviceId = String(service.id);
      button.textContent = `+ Thêm ${service.name} · ${SalonCart.formatMoney(service.price)}`;
      button.setAttribute("aria-label", `Thêm ${service.name} của ${salon.name} vào giỏ`);
      card.querySelector(".salon-info")?.appendChild(button);
    });
  }
  insertButtons();
  new MutationObserver(insertButtons).observe(grid, { childList: true, subtree: true });
});
