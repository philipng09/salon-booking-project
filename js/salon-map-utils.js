/**
 * Pure helpers shared by the salon map, card badges and automated checks.
 * No browser dependency: node tests/salon-map.test.js
 */
(function (root) {
  'use strict';

  function coordinatesOf(salon) {
    if (!salon || typeof salon.lat !== 'number' || typeof salon.lng !== 'number' ||
        !Number.isFinite(salon.lat) || !Number.isFinite(salon.lng) ||
        Math.abs(salon.lat) > 90 || Math.abs(salon.lng) > 180) return null;
    return [salon.lat, salon.lng];
  }

  function ratingOf(salon) {
    if (!salon || typeof salon.rating !== 'number' ||
        !Number.isFinite(salon.rating) || salon.rating < 0 || salon.rating > 5 ||
        !Number.isInteger(salon.reviewCount) || salon.reviewCount <= 0) return null;
    return { value: salon.rating, count: salon.reviewCount,
      percentage: Math.round((salon.rating / 5) * 10000) / 100 };
  }

  function distanceKm(from, to) {
    if (!Array.isArray(from) || !Array.isArray(to) || from.length !== 2 || to.length !== 2 ||
        !from.concat(to).every(n => typeof n === 'number' && Number.isFinite(n))) return Infinity;
    const radians = deg => deg * Math.PI / 180;
    const dLat = radians(to[0] - from[0]);
    const dLng = radians(to[1] - from[1]);
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const a = sinLat * sinLat + Math.cos(radians(from[0])) *
      Math.cos(radians(to[0])) * sinLng * sinLng;
    return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  function nearbySalons(salons, location, radiusKm = 10) {
    if (!Array.isArray(salons) || !Array.isArray(location) || !(radiusKm > 0)) return [];
    return salons.flatMap(salon => {
      const coords = coordinatesOf(salon);
      if (!coords) return [];
      const distance = distanceKm(location, coords);
      return distance <= radiusKm ? [{ salon, distance }] : [];
    }).sort((a, b) => a.distance - b.distance);
  }

  function directionsUrl(salon) {
    const coords = coordinatesOf(salon);
    return coords ? 'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent(coords[0] + ',' + coords[1]) : null;
  }

  function mapsUrl(salon) {
    const coords = coordinatesOf(salon);
    return coords ? 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(coords[0] + ',' + coords[1]) :
      'https://www.google.com/maps/@10.7769,106.7009,12z';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  const api = { coordinatesOf, ratingOf, distanceKm, nearbySalons,
    directionsUrl, mapsUrl, escapeHtml };
  root.SalonBookMapUtils = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
