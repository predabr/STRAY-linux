from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/webdev-static-assets/stray-linux/stray-linux-logo-v2.png")
output = Path("/home/ubuntu/webdev-static-assets/stray-linux/build-assets")
icons = output / "icons"
icons.mkdir(parents=True, exist_ok=True)

with Image.open(source) as image:
    rgba = image.convert("RGBA")
    for size in (16, 24, 32, 48, 64, 96, 128, 256, 512):
        resized = rgba.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(icons / f"{size}x{size}.png", "PNG", optimize=True)
    rgba.resize((512, 512), Image.Resampling.LANCZOS).save(output / "icon.png", "PNG", optimize=True)
    rgba.save(output / "icon.ico", "ICO", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

print(f"generated icons in {icons}")
