/**
 * Xuất dữ liệu mẫu của Frontend (js/products.js, js/hairmodels.js) sang JSON
 * để Laravel Seeder đọc lại. Chạy từ thư mục gốc repo:
 *     node scripts/export-seed-data.cjs
 * Kết quả: backend/database/data/salons.json, hair_models.json
 *
 * Lý do: products.js khai báo `const products = [...]` cho trình duyệt, không
 * export theo CommonJS. Script chạy file trong sandbox (vm) rồi lấy biến ra,
 * nhờ vậy Frontend và CSDL dùng chung MỘT nguồn dữ liệu, không chép tay.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'backend', 'database', 'data');

// Chạy một file JS của Frontend và trả về biến toàn cục cần lấy.
function readBrowserConst(file, varName) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  const ctx = vm.createContext({});
  vm.runInContext(`${code}\n;globalThis.__out = ${varName};`, ctx, { filename: file });
  if (!Array.isArray(ctx.__out)) throw new Error(`${file}: không tìm thấy mảng ${varName}`);
  return ctx.__out;
}

fs.mkdirSync(outDir, { recursive: true });

const salons = readBrowserConst('js/products.js', 'products');
const hairModels = readBrowserConst('js/hairmodels.js', 'hairModels');

fs.writeFileSync(path.join(outDir, 'salons.json'), JSON.stringify(salons, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'hair_models.json'), JSON.stringify(hairModels, null, 2) + '\n');

console.log(`salons.json: ${salons.length} salon, ` +
  `${salons.reduce((n, s) => n + s.servicesList.length, 0)} dịch vụ, ` +
  `${salons.reduce((n, s) => n + s.stylists.length, 0)} stylist, ` +
  `${salons.reduce((n, s) => n + s.reviewsList.length, 0)} đánh giá`);
console.log(`hair_models.json: ${hairModels.length} tin tuyển mẫu`);
