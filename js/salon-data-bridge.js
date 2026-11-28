/*
 * SalonBook - cầu nối dữ liệu Salon Owner với danh mục salon dùng chung.
 * products.js và hairmodels.js phải được nạp trước file này.
 */
(function () {
  'use strict';

  const KEYS = {
    salon: 'salonbook.salon.1.profile.v1',
    stylists: 'salonbook.salon.1.stylists.v1',
    services: 'salonbook.salon.1.services.v1',
    hairModels: 'hair_models',
  };

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (_) {
      return fallback;
    }
  }

  function uniqueTimes(schedule) {
    if (Array.isArray(schedule)) return [...new Set(schedule)].sort();
    if (!schedule || typeof schedule !== 'object') return [];
    return [...new Set(Object.values(schedule).flat().filter(Boolean))].sort();
  }

  function applySalonOverrides() {
    if (typeof products === 'undefined' || !Array.isArray(products)) return;
    const salon = products.find(item => Number(item.id) === 1);
    if (!salon) return;

    const profile = read(KEYS.salon, null);
    const stylists = read(KEYS.stylists, null);
    const services = read(KEYS.services, null);

    if (profile && Number(profile.salonId || profile.id) === 1) {
      salon.name = profile.name || salon.name;
      salon.address = profile.address || salon.address;
      salon.description = profile.description || salon.description;
      if (profile.phone) salon.phone = profile.phone;
      salon.openingHours = {
        ...(salon.openingHours || {}),
        ...(profile.openingHours || {}),
        open: profile.openTime || profile.openingHours?.open || salon.openingHours?.open,
        close: profile.closeTime || profile.openingHours?.close || salon.openingHours?.close,
      };
    }

    if (Array.isArray(stylists)) {
      salon.stylists = stylists
        .filter(item => Number(item.salonId) === 1 && item.status !== 'inactive')
        .map(item => {
          const schedule = item.availableHours || {};
          return {
            id: String(item.stylistId || item.id),
            stylistId: String(item.stylistId || item.id),
            salonId: 1,
            name: item.name,
            experience: item.experience || item.specialty || 'Chuyên viên',
            availableHours: uniqueTimes(schedule),
            availabilityByDay: Array.isArray(schedule)
              ? null
              : schedule,
          };
        });
    }

    if (Array.isArray(services)) {
      salon.servicesList = services
        .filter(item => Number(item.salonId) === 1 && item.status !== 'inactive')
        .map(item => ({
          id: String(item.serviceId || item.id),
          serviceId: String(item.serviceId || item.id),
          salonId: 1,
          name: item.name,
          duration: Number(item.duration || 0),
          price: Number(item.price || 0),
          value: item.value || '',
        }));
    }
  }

  function applyHairModelOverrides() {
    if (typeof hairModels === 'undefined' || !Array.isArray(hairModels)) return;
    const saved = read(KEYS.hairModels, null);
    if (!Array.isArray(saved)) return;

    const otherSalons = hairModels.filter(item => Number(item.salonId) !== 1);
    const currentSalon = saved
      .filter(item => Number(item.salonId) === 1)
      .map(item => ({
        ...item,
        id: String(item.hairModelId || item.id),
        hairModelId: String(item.hairModelId || item.id),
        status: item.status || 'Đang tuyển',
      }));

    hairModels.splice(0, hairModels.length, ...currentSalon, ...otherSalons);
  }

  applySalonOverrides();
  applyHairModelOverrides();

  window.SalonBookSharedData = {
    refresh() {
      applySalonOverrides();
      applyHairModelOverrides();
    },
    keys: { ...KEYS },
  };
})();
