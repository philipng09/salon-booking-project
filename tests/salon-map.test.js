'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  coordinatesOf, ratingOf, distanceKm, nearbySalons, directionsUrl, mapsUrl, escapeHtml
} = require('../js/salon-map-utils');

const first = { id: 1, lat: 10.7712, lng: 106.6980, rating: 4.8, reviewCount: 124 };
const second = { id: 2, lat: 10.7756, lng: 106.6681, rating: 5, reviewCount: 198 };

test('tọa độ 0 là hợp lệ; tọa độ thiếu hoặc ngoài biên bị bỏ qua', () => {
  assert.deepEqual(coordinatesOf({ lat: 0, lng: 0 }), [0, 0]);
  assert.equal(coordinatesOf({ lat: undefined, lng: 106 }), null);
  assert.equal(coordinatesOf({ lat: '10.77', lng: 106 }), null);
  assert.equal(coordinatesOf({ lat: 91, lng: 106 }), null);
  assert.equal(coordinatesOf({ lat: 10, lng: Infinity }), null);
});

test('đánh giá sao chỉ hiển thị khi dữ liệu có thật', () => {
  assert.deepEqual(ratingOf(first), { value: 4.8, count: 124, percentage: 96 });
  assert.equal(ratingOf({ rating: 5, reviewCount: 0 }), null);
  assert.equal(ratingOf({ rating: undefined, reviewCount: 20 }), null);
  assert.equal(ratingOf({ rating: 6, reviewCount: 20 }), null);
  assert.equal(ratingOf({ rating: 4.5, reviewCount: -1 }), null);
});

test('Haversine tính khoảng cách km và xếp salon gần nhất', () => {
  assert.equal(distanceKm([10.7, 106.7], [10.7, 106.7]), 0);
  assert.equal(distanceKm([NaN, 1], [1, 1]), Infinity);
  assert.ok(distanceKm([10.7712, 106.698], [10.7756, 106.6681]) > 3);
  const nearby = nearbySalons([second, { id: 3 }, first], [10.7712, 106.698], 10);
  assert.deepEqual(nearby.map(row => row.salon.id), [1, 2]);
  assert.deepEqual(nearbySalons([first, second], [21, 105], 1), []);
});

test('liên kết chỉ đường theo tọa độ; thiếu tọa độ không tạo liên kết sai', () => {
  assert.equal(directionsUrl(first), 'https://www.google.com/maps/dir/?api=1&destination=10.7712%2C106.698');
  assert.equal(directionsUrl({ id: 9 }), null);
  assert.match(mapsUrl(first), /^https:\/\/www\.google\.com\/maps\/search/);
});

test('escapeHtml không cho chèn thẻ hay thuộc tính', () => {
  assert.equal(escapeHtml('<img src="x" onerror=\'alert(1)\'>&'), '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;');
});
