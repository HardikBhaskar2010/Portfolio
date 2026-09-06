"""
Image optimization script: converts all PNG/JPG images in public/images/ and public/
to WebP format using Pillow with optimal compression settings.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIRS = [
    os.path.join(ROOT, 'public', 'images'),
    os.path.join(ROOT, 'public'),
]

def main():
    total_original = 0
    total_webp = 0
    converted = 0

    for d in DIRS:
        if not os.path.exists(d):
            continue
        for f in os.listdir(d):
            if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                src = os.path.join(d, f)
                if not os.path.isfile(src):
                    continue
                name, _ = os.path.splitext(f)
                dst = os.path.join(d, name + '.webp')

                with Image.open(src) as img:
                    img.save(dst, 'WEBP', quality=85, method=6)

                s_orig = os.path.getsize(src)
                s_webp = os.path.getsize(dst)
                total_original += s_orig
                total_webp += s_webp
                converted += 1
                reduction = (1 - s_webp / s_orig) * 100
                print(f"✓ {f} -> {name}.webp: {s_orig/1024:.1f}KB -> {s_webp/1024:.1f}KB ({reduction:.1f}% reduction)")

    if total_original > 0:
        savings = (1 - total_webp / total_original) * 100
        print(f"\nTotal: {converted} images, {total_original/1024/1024:.2f}MB -> {total_webp/1024/1024:.2f}MB ({savings:.1f}% saved)")

if __name__ == '__main__':
    main()
