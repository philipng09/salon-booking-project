#!/usr/bin/env python3
"""Tích hợp giỏ SalonBook vào repo hiện có; idempotent, không viết lại HTML/CSS.
Chạy tại thư mục gốc repository: python apply_patch.py
"""
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent

def patch(path, replacements):
    file = ROOT / path
    if not file.is_file():
        raise FileNotFoundError(f"Thiếu file gốc {path}; hãy đặt bộ mã vào đúng thư mục repo SalonBook.")
    content = file.read_text(encoding="utf-8")
    original = content
    for marker, insert in replacements:
        if insert in content:
            continue
        if marker not in content:
            raise RuntimeError(f"Không thấy vị trí cần chèn trong {path}: {marker[:80]!r}")
        content = content.replace(marker, insert + "\n" + marker, 1)
    if content != original:
        backup = file.with_suffix(file.suffix + ".before-cart.bak")
        if not backup.exists():
            shutil.copy2(file, backup)
        file.write_text(content, encoding="utf-8")
        print("[OK] Đã cập nhật", path)
    else:
        print("[SKIP] Đã tích hợp trước đó", path)

if __name__ == "__main__":
    try:
        required = ["products.html", "product-detail.html", "js/products.js", "js/render-products.js", "css/style.css"]
        for item in required:
            if not (ROOT / item).is_file():
                raise FileNotFoundError(f"Thiếu {item}; không chạy được khi thiếu mã nguồn website gốc.")
        patch("products.html", [
            ("</head>", '    <link rel="stylesheet" href="css/cart.css">'),
            ('<script src="js/render-products.js"></script>', '    <script src="js/cart.js"></script>\n    <script src="js/cart-list.js"></script>'),
        ])
        patch("product-detail.html", [
            ("</head>", '  <link rel="stylesheet" href="css/cart.css">'),
            ('<script src="js/common.js"></script>', '  <script src="js/products.js"></script>\n  <script src="js/cart.js"></script>\n  <script src="js/cart-detail.js"></script>'),
        ])
        print("\nHoàn tất. Mở products.html, thêm một dịch vụ và truy cập cart.html để thử.")
        print("Lưu ý: Giỏ chỉ tính giá dự kiến, không thực hiện booking/thanh toán thật.")
    except Exception as exc:
        print("[LỖI]", exc, file=sys.stderr)
        sys.exit(1)
