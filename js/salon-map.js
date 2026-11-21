/**
 * F01 — Salon gần bạn (Leaflet/OpenStreetMap).
 * Chỉ đọc dữ liệu products.js và sự kiện salonbook:results-changed của bộ lọc.
 * Không viết lại, không can thiệp logic tìm kiếm/lọc/sắp xếp của thành viên khác.
 */
(function () {
  'use strict';
  const utils = window.SalonBookMapUtils;
  if (!utils) return;

  const HCMC_CENTER = [10.7769, 106.7009];
  const NEAR_RADIUS_KM = 10;
  const mapElement = document.getElementById('salon-map');
  const statusElement = document.getElementById('salon-map-status');
  const positionLabel = document.getElementById('salon-map-position-label');
  const nearestElement = document.getElementById('salon-map-nearest');
  const locationButton = document.getElementById('salon-find-my-location');
  const showAllButton = document.getElementById('salon-map-show-all');
  const mapsLink = document.getElementById('salon-map-open-external');
  const salonGrid = document.getElementById('salon-grid');
  if (!mapElement || !salonGrid) return;

  let map = null;
  let markerLayer = null;
  let userMarker = null;
  let userPosition = null;
  let mapTilesFailed = false;
  let leafletUnavailable = false;
  let currentSalons = [];
  const markers = new Map();

  function node(tag, className, text) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = text;
    return result;
  }

  function ratingElement(salon) {
    const rating = utils.ratingOf(salon);
    const wrapper = node('span', 'salon-map-rating');
    if (!rating) {
      wrapper.textContent = 'Chưa có đánh giá';
      return wrapper;
    }
    wrapper.setAttribute('aria-label', `${rating.value.toLocaleString('vi-VN')} trên 5 sao, ${rating.count} lượt đánh giá`);
    const stars = node('span', 'salon-rating-stars', '★★★★★');
    stars.setAttribute('aria-hidden', 'true');
    stars.style.setProperty('--star-fill', rating.percentage + '%');
    const score = node('strong', 'salon-rating-score', rating.value.toLocaleString('vi-VN', {
      minimumFractionDigits: 1, maximumFractionDigits: 1
    }));
    const count = node('span', 'salon-rating-count', `(${rating.count} đánh giá)`);
    wrapper.append(stars, score, count);
    return wrapper;
  }

  function linkTo(tag, className, label, href) {
    const link = node(tag, className, label);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function decorateCards(salons) {
    const salonById = new Map(salons.map(salon => [String(salon.id), salon]));
    salonGrid.querySelectorAll('.product-salon-card').forEach(card => {
      const salon = salonById.get(card.dataset.id);
      if (!salon) return;

      // Chỉnh phần hiển thị, KHÔNG sửa nguồn dữ liệu hay hàm renderProducts().
      const address = card.querySelector('.salon-address');
      if (address) address.textContent = salon.address ? `📍 ${salon.address}` : 'Địa chỉ đang cập nhật';
      const rating = card.querySelector('.salon-rating');
      if (rating) rating.replaceChildren(ratingElement(salon));

      const oldActions = card.querySelector('.salon-map-card-actions');
      if (oldActions) oldActions.remove();
      const actions = node('div', 'salon-map-card-actions');
      const coordinates = utils.coordinatesOf(salon);
      if (coordinates) {
        const focus = node('button', 'salon-map-focus-button', 'Xem trên bản đồ');
        focus.type = 'button';
        focus.addEventListener('click', () => focusSalon(salon.id, true));
        actions.append(focus, linkTo('a', 'salon-map-directions-button', 'Chỉ đường', utils.directionsUrl(salon)));
        card.title = 'Nhấn vào salon để tìm vị trí trên bản đồ';
      } else {
        actions.append(node('span', 'salon-map-unavailable', 'Vị trí trên bản đồ đang cập nhật'));
        card.removeAttribute('title');
      }
      const detailButton = card.querySelector('.salon-detail-button');
      if (detailButton) detailButton.before(actions);
      else card.querySelector('.salon-info')?.append(actions);
    });
  }

  function createPopup(salon) {
    const popup = node('div', 'salon-map-popup');
    popup.append(node('h3', '', salon.name || 'Salon'));
    popup.append(node('p', 'salon-map-popup-address', salon.address || 'Địa chỉ đang cập nhật'));
    popup.append(ratingElement(salon));
    const actions = node('div', 'salon-map-popup-actions');
    const detail = node('a', 'salon-map-popup-detail', 'Xem chi tiết');
    detail.href = 'product-detail.html?salonId=' + encodeURIComponent(String(salon.id));
    actions.append(detail);
    const url = utils.directionsUrl(salon);
    if (url) actions.append(linkTo('a', 'salon-map-popup-directions', 'Chỉ đường ↗', url));
    popup.append(actions);
    return popup;
  }

  function displayStatus(message) {
    if (!statusElement) return;
    const error = leafletUnavailable ? 'Không tải được bản đồ. ' :
      mapTilesFailed ? 'Không tải được nền OpenStreetMap. ' : '';
    statusElement.textContent = error + message;
  }

  function fitVisibleSalons() {
    if (!map || !window.L) return;
    const visible = currentSalons.map(utils.coordinatesOf).filter(Boolean);
    if (!visible.length) {
      map.setView(HCMC_CENTER, 12);
    } else if (visible.length === 1) {
      map.setView(visible[0], 15);
    } else {
      map.fitBounds(window.L.latLngBounds(visible), { padding: [28, 28], maxZoom: 14 });
    }
  }

  function updateNearestSalons() {
    if (!nearestElement) return;
    nearestElement.replaceChildren();
    nearestElement.hidden = !userPosition;
    if (!userPosition) return;

    const matches = utils.nearbySalons(currentSalons, userPosition, NEAR_RADIUS_KM).slice(0, 3);
    if (!matches.length) {
      nearestElement.append(node('p', 'salon-map-nearest-empty',
        `Không có salon phù hợp trong bán kính ${NEAR_RADIUS_KM} km. Bạn vẫn có thể xem danh sách theo khu vực.`));
      return;
    }
    nearestElement.append(node('p', 'salon-map-nearest-heading', 'Gần vị trí của bạn nhất'));
    matches.forEach(({ salon, distance }) => {
      const button = node('button', 'salon-map-nearest-item',
        `${salon.name} · ${distance.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} km`);
      button.type = 'button';
      button.addEventListener('click', () => focusSalon(salon.id, true));
      nearestElement.append(button);
    });
  }

  function updateMarkers() {
    markers.clear();
    if (markerLayer) markerLayer.clearLayers();
    const located = currentSalons.filter(salon => utils.coordinatesOf(salon));
    const missing = currentSalons.length - located.length;

    if (map && markerLayer && window.L) {
      located.forEach(salon => {
        const label = utils.escapeHtml(salon.id);
        const icon = window.L.divIcon({
          className: 'salon-map-pin',
          html: `<span class="salon-map-pin-shape"><span>${label}</span></span>`,
          iconSize: [34, 38], iconAnchor: [17, 35], popupAnchor: [0, -26]
        });
        const marker = window.L.marker(utils.coordinatesOf(salon), { icon, title: salon.name || 'Salon' });
        marker.bindPopup(createPopup(salon), { maxWidth: 290 });
        marker.addTo(markerLayer);
        markers.set(String(salon.id), marker);
      });
      fitVisibleSalons();
      window.setTimeout(() => map.invalidateSize(), 70);
    }

    const summary = currentSalons.length === 0 ? 'Không có salon khớp bộ lọc.' :
      `${located.length}/${currentSalons.length} salon có vị trí trên bản đồ.` +
      (missing ? ` ${missing} salon chưa có tọa độ.` : '');
    displayStatus(summary);
    updateNearestSalons();
  }

  function highlightCard(id) {
    salonGrid.querySelectorAll('.product-salon-card').forEach(card => {
      card.classList.toggle('salon-map-card-active', card.dataset.id === String(id));
    });
  }

  function focusSalon(id, shouldScroll) {
    const salon = currentSalons.find(item => String(item.id) === String(id));
    if (!salon) return;
    const coordinate = utils.coordinatesOf(salon);
    if (!coordinate) {
      displayStatus('Salon này chưa có tọa độ. Hãy xem địa chỉ trên thẻ salon.');
      return;
    }
    highlightCard(id);
    if (map) {
      map.setView(coordinate, 16, { animate: true });
      const marker = markers.get(String(id));
      if (marker) marker.openPopup();
      if (shouldScroll) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.setTimeout(() => map.invalidateSize(), 300);
      }
    } else {
      displayStatus('Bản đồ tạm không khả dụng. Dùng “Chỉ đường” hoặc “Xem chi tiết” trên thẻ salon.');
    }
    if (mapsLink) mapsLink.href = utils.mapsUrl(salon);
  }

  function applyResults(salons) {
    currentSalons = Array.isArray(salons) ? salons : [];
    decorateCards(currentSalons);
    updateMarkers();
  }

  function requestLocation() {
    if (!navigator.geolocation || !window.isSecureContext) {
      displayStatus('Trình duyệt yêu cầu HTTPS/localhost để lấy vị trí. Bạn vẫn có thể lọc theo khu vực.');
      return;
    }
    locationButton.disabled = true;
    displayStatus('Đang xin quyền truy cập vị trí của bạn...');
    navigator.geolocation.getCurrentPosition(position => {
      locationButton.disabled = false;
      userPosition = [position.coords.latitude, position.coords.longitude];
      if (positionLabel) positionLabel.textContent = 'Vị trí hiện tại của bạn (ước tính)';
      if (map && window.L) {
        if (userMarker) map.removeLayer(userMarker);
        userMarker = window.L.circleMarker(userPosition, {
          radius: 9, color: '#ffffff', weight: 3,
          fillColor: '#2476d2', fillOpacity: 1
        }).addTo(map).bindPopup('Vị trí của bạn');
        map.setView(userPosition, 13);
        userMarker.openPopup();
      }
      updateNearestSalons();
      displayStatus('Đã xác định vị trí. ' +
        (utils.nearbySalons(currentSalons, userPosition, NEAR_RADIUS_KM).length
          ? 'Các salon gần bạn nhất xuất hiện bên dưới.'
          : `Không có salon phù hợp trong ${NEAR_RADIUS_KM} km; vẫn xem được bản đồ và bộ lọc.`));
    }, error => {
      locationButton.disabled = false;
      const message = error.code === 1 ? 'Bạn chưa cấp quyền vị trí.' :
        error.code === 2 ? 'Không xác định được vị trí.' : 'Yêu cầu vị trí hết thời gian.';
      displayStatus(message + ' Bạn vẫn có thể xem bản đồ và lọc theo khu vực.');
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  }

  function initMap() {
    if (!window.L || typeof window.L.map !== 'function') {
      leafletUnavailable = true;
      mapElement.replaceChildren(node('p', 'salon-map-fallback',
        'Bản đồ tạm không tải được. Hãy dùng bộ lọc Khu vực và nút Chỉ đường trên thẻ salon.'));
      return;
    }
    try {
      map = window.L.map(mapElement, { scrollWheelZoom: false, zoomControl: false })
        .setView(HCMC_CENTER, 12);
      window.L.control.zoom({ position: 'topright' }).addTo(map);
      const tiles = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
        maxZoom: 19
      });
      tiles.on('tileerror', () => {
        if (!mapTilesFailed) {
          mapTilesFailed = true;
          displayStatus('Hãy dùng nút Mở Google Maps hoặc lọc theo khu vực.');
        }
      });
      tiles.addTo(map);
      markerLayer = window.L.layerGroup().addTo(map);
    } catch (error) {
      leafletUnavailable = true;
      map = null;
      markerLayer = null;
      mapElement.replaceChildren(node('p', 'salon-map-fallback',
        'Không thể hiển thị bản đồ. Bộ lọc và danh sách salon vẫn hoạt động.'));
    }
  }

  function init() {
    initMap();
    if (mapsLink) mapsLink.href = utils.mapsUrl(null);
    if (locationButton) locationButton.addEventListener('click', requestLocation);
    if (showAllButton) showAllButton.addEventListener('click', () => {
      fitVisibleSalons();
      if (map) map.closePopup();
      highlightCard(null);
    });
    salonGrid.addEventListener('click', event => {
      if (event.target.closest('a,button')) return;
      const card = event.target.closest('.product-salon-card');
      if (card) focusSalon(card.dataset.id, true);
    });
    window.addEventListener('salonbook:results-changed', event => {
      applyResults(event.detail && event.detail.salons);
    });
    // Cho trường hợp module được nạp sau DOMContentLoaded / khi bộ lọc đã render.
    const initial = Array.isArray(window.SalonBookFilteredSalons) ? window.SalonBookFilteredSalons :
      typeof products !== 'undefined' ? products : [];
    applyResults(initial);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
