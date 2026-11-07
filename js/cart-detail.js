/* Tích hợp giỏ dịch vụ vào chi tiết salon từ nguồn products.js, không tạo booking. */
document.addEventListener("DOMContentLoaded", () => {
  if (!window.SalonCart || typeof products === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const slug = params.get("salon");
  const salon = products.find(item => String(item.id) === id || item.slug === slug);
  const root = document.querySelector(".detail-services");
  if (!root) return;
  if (!salon) {
    root.insertAdjacentHTML("afterbegin", '<p class="cart-detail-warning" role="alert">Không tìm thấy salon theo liên kết. <a href="products.html">Quay lại danh sách salon</a>.</p>');
    return;
  }
  const title = document.getElementById("detail-title");
  if (title) title.textContent = salon.name;
  const image = document.querySelector(".detail-image img");
  if (image) { image.src = salon.image; image.alt = salon.name; }
  const address = document.querySelector(".detail-address");
  if (address) address.textContent = `📍 ${salon.address}`;
  const summarySalon = document.querySelector(".detail-summary-item strong");
  if (summarySalon) summarySalon.textContent = salon.name;

  const select = document.getElementById("detail-service-select");
  if (select) {
    select.replaceChildren(new Option("Chọn dịch vụ", ""));
    salon.servicesList.forEach(service => {
      select.add(new Option(`${service.name} · ${SalonCart.formatMoney(service.price)}`, service.id));
    });
    const add = document.createElement("button");
    add.type = "button";
    add.className = "cart-add-detail";
    add.textContent = "+ Thêm dịch vụ đã chọn vào giỏ";
    add.addEventListener("click", () => {
      if (!select.value) { select.focus(); select.setCustomValidity("Vui lòng chọn dịch vụ"); select.reportValidity(); return; }
      select.setCustomValidity("");
      SalonCart.addToCart(salon.id, select.value);
      add.textContent = "✓ Đã thêm — xem giỏ dịch vụ";
      window.setTimeout(() => { add.textContent = "+ Thêm dịch vụ đã chọn vào giỏ"; }, 2000);
    });
    select.addEventListener("change", () => select.setCustomValidity(""));
    select.insertAdjacentElement("afterend", add);
  }
  document.querySelectorAll(".detail-service-card").forEach((card, index) => {
    const service = salon.servicesList[index];
    if (!service) return;
    const price = card.querySelector(".detail-service-bottom span");
    if (price) price.textContent = SalonCart.formatMoney(service.price);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cart-add-service";
    button.dataset.cartAdd = "";
    button.dataset.salonId = String(salon.id);
    button.dataset.serviceId = service.id;
    button.textContent = "+ Giỏ";
    button.setAttribute("aria-label", `Thêm ${service.name} của ${salon.name} vào giỏ`);
    card.querySelector(".detail-service-bottom")?.appendChild(button);
  });
});
