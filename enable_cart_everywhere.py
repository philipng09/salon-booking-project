#!/usr/bin/env python3
"""SalonBook - hiển thị liên kết giỏ + badge trên tất cả trang website.

Chạy tại thư mục repo salon-booking-project (đặt script cạnh index.html):
    python enable_cart_everywhere.py

Tận dụng js/cart.js, js/products.js, css/cart.css đã tích hợp từ Bài tập Buổi 3.
Không ghi đè cấu trúc trang, chạy lại không chèn trùng, tự tạo bản sao lưu trước khi sửa.
"""
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parent
CSS = '  <link rel="stylesheet" href="css/cart.css">'
PRODUCTS = '  <script src="js/products.js"></script>'
CART = '  <script src="js/cart.js"></script>'


def has_asset(html: str, asset: str, attribute: str) -> bool:
    """Tìm asset theo src/href, cho phép nháy đơn hoặc kép, tránh thêm lần hai."""
    return bool(re.search(rf'\b{attribute}\s*=\s*[\'\"]{re.escape(asset)}[\'\"]', html, re.I))


def enable_on_page(path: Path) -> str:
    html = path.read_text(encoding="utf-8-sig")
    # Không chạm vào file HTML rỗng/placeholder hoặc trang không dùng header chung.
    if not re.search(r'<header\b[^>]*\bclass\s*=\s*[\'\"][^\'\"]*\bsite-header\b', html, re.I):
        return "SKIP (không có header của SalonBook)"
    if 'nav-actions' not in html or '</head>' not in html.lower() or '</body>' not in html.lower():
        return "SKIP (thiếu cấu trúc HTML chuẩn hoặc nav-actions)"
    modified = html
    added = []
    if not has_asset(modified, 'css/cart.css', 'href'):
        modified = re.sub(r'</head\s*>', lambda m: CSS + '\n' + m.group(0), modified, count=1, flags=re.I)
        added.append('CSS')

    # JS products phải chạy trước cart, cần thiết để đọc giá và tổng tiền.
    scripts = []
    if not has_asset(modified, 'js/products.js', 'src'):
        scripts.append(PRODUCTS)
        added.append('dữ liệu salon')
    if not has_asset(modified, 'js/cart.js', 'src'):
        scripts.append(CART)
        added.append('giỏ + badge')
    if scripts:
        # Trường hợp website đã nạp cart.js nhưng chưa có products.js: thêm
        # products.js NGAY TRƯỚC cart.js để bảo đảm thứ tự phụ thuộc.
        if len(scripts) == 1 and scripts[0] == PRODUCTS and has_asset(modified, 'js/cart.js', 'src'):
            modified = re.sub(r'(?i)<script\s+[^>]*src\s*=\s*[\'\"]js/cart\.js[\'\"][^>]*>\s*</script>',
                              lambda m: PRODUCTS + '\n' + m.group(0), modified, count=1)
        else:
            modified = re.sub(r'</body\s*>', lambda m: '\n'.join(scripts) + '\n' + m.group(0),
                              modified, count=1, flags=re.I)

    if modified == html:
        return 'SKIP (đã có giỏ trên trang này)'
    backup = path.with_name(path.name + '.before-global-cart.bak')
    if not backup.exists():
        shutil.copy2(path, backup)
    path.write_text(modified, encoding='utf-8')
    return 'OK (đã bổ sung ' + ', '.join(added) + ')'


def main():
    for required in ('index.html', 'js/products.js', 'js/cart.js', 'css/cart.css'):
        if not (ROOT / required).is_file():
            print(f'[LỖI] Thiếu {required}. Cần đặt script ở thư mục gốc salon-booking-project, '
                  'sau khi cài bộ giỏ hàng trước đó.', file=sys.stderr)
            return 1

    changed = 0
    for path in sorted(ROOT.glob('*.html')):
        try:
            result = enable_on_page(path)
            print(f'[{result.split(" ", 1)[0]}] {path.name}: {result}')
            if result.startswith('OK'): changed += 1
        except Exception as exc:
            print(f'[LỖI] {path.name}: {exc}', file=sys.stderr)
            return 1
    print(f'\nHoàn thành. Đã cập nhật {changed} trang. '
          'Nhấn vào biểu tượng 🛍 trên header để mở cart.html. '
          'Không commit file *.before-global-cart.bak.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
