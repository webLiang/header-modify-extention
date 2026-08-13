#!/usr/bin/env python3
"""Generate Header Modify icons, promo tiles, and store screenshots (Pillow)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS_IMG = ROOT / "src" / "assets" / "img"
STORE_IMAGES = ROOT / "docs" / "chrome-web-store" / "images"

TEAL = (15, 118, 110)  # #0F766E
TEAL_LIGHT = (13, 148, 136)  # #0D9488
TEAL_SOFT = (204, 251, 241)  # #CCFBF1
BG0 = (243, 247, 248)
BG1 = (232, 242, 241)
SLATE = (15, 23, 42)
MUTED = (100, 116, 139)
WHITE = (255, 255, 255)
CARD = (255, 255, 255)
ACCENT_LINE = (45, 212, 191)


def ensure_dirs() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    ASSETS_IMG.mkdir(parents=True, exist_ok=True)
    STORE_IMAGES.mkdir(parents=True, exist_ok=True)


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates += [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Supplemental/Helvetica.ttc",
            "/Library/Fonts/Arial Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ]
    candidates += [
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))  # type: ignore[return-value]


def fill_vertical_gradient(img: Image.Image, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> None:
    draw = ImageDraw.Draw(img)
    w, h = img.size
    for y in range(h):
        color = lerp(top, bottom, y / max(h - 1, 1))
        draw.line([(0, y), (w, y)], fill=color)


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill=None,
    outline=None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_request_icon(size: int) -> Image.Image:
    """Squircle teal icon with request-header card + pencil badge."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Gradient squircle background
    pad = max(1, size // 32)
    radius = int(size * 0.22)
    # Draw gradient into a temp square then mask
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fill_vertical_gradient(base, TEAL_LIGHT, TEAL)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (pad, pad, size - pad - 1, size - pad - 1),
        radius=radius,
        fill=255,
    )
    img.paste(base, (0, 0), mask)

    # Soft highlight
    highlight = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    hd.ellipse(
        (-size * 0.2, -size * 0.35, size * 0.95, size * 0.55),
        fill=(255, 255, 255, 38),
    )
    img = Image.alpha_composite(img, highlight)
    draw = ImageDraw.Draw(img)

    # Request arrow (top-left)
    ax = size * 0.16
    ay = size * 0.18
    aw = size * 0.18
    draw.line([(ax, ay + aw * 0.35), (ax + aw, ay + aw * 0.35)], fill=WHITE, width=max(2, size // 28))
    draw.polygon(
        [
            (ax + aw - size * 0.02, ay + aw * 0.1),
            (ax + aw + size * 0.04, ay + aw * 0.35),
            (ax + aw - size * 0.02, ay + aw * 0.6),
        ],
        fill=WHITE,
    )

    # White request card
    cx0, cy0 = size * 0.22, size * 0.30
    cx1, cy1 = size * 0.78, size * 0.78
    rounded_rect(draw, (cx0, cy0, cx1, cy1), radius=int(size * 0.08), fill=WHITE)

    # Header lines
    line_left = cx0 + size * 0.08
    line_right = cx1 - size * 0.08
    y0 = cy0 + size * 0.10
    gap = size * 0.13
    for i in range(3):
        y = y0 + i * gap
        color = TEAL if i == 0 else (203, 213, 225)
        thickness = max(2, size // 22) if i == 0 else max(2, size // 28)
        # name stub
        draw.rounded_rectangle(
            (line_left, y, line_left + size * 0.18, y + thickness),
            radius=thickness // 2,
            fill=color,
        )
        # value stub
        draw.rounded_rectangle(
            (line_left + size * 0.22, y, line_right - (size * 0.08 if i == 0 else 0), y + thickness),
            radius=thickness // 2,
            fill=color if i == 0 else (226, 232, 240),
        )

    # Pencil badge (bottom-right of card)
    bx = cx1 - size * 0.14
    by = cy1 - size * 0.14
    br = size * 0.11
    draw.ellipse((bx - br, by - br, bx + br, by + br), fill=TEAL_LIGHT, outline=WHITE, width=max(1, size // 48))
    # simple pencil
    p = size * 0.045
    draw.line([(bx - p, by + p * 0.3), (bx + p * 0.6, by - p * 0.8)], fill=WHITE, width=max(2, size // 36))
    draw.polygon(
        [(bx + p * 0.35, by - p), (bx + p * 0.9, by - p * 0.55), (bx + p * 0.7, by - p * 0.35)],
        fill=WHITE,
    )

    return img


def write_logo_svg() -> None:
    svg = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Header Modify">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#bg)"/>
  <path d="M22 28h22" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <path d="M40 20l12 8-12 8" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="28" y="40" width="72" height="62" rx="12" fill="#fff"/>
  <rect x="40" y="54" width="22" height="7" rx="3.5" fill="#0F766E"/>
  <rect x="66" y="54" width="22" height="7" rx="3.5" fill="#0F766E"/>
  <rect x="40" y="70" width="18" height="6" rx="3" fill="#CBD5E1"/>
  <rect x="62" y="70" width="26" height="6" rx="3" fill="#E2E8F0"/>
  <rect x="40" y="84" width="18" height="6" rx="3" fill="#CBD5E1"/>
  <rect x="62" y="84" width="26" height="6" rx="3" fill="#E2E8F0"/>
  <circle cx="92" cy="92" r="14" fill="#0D9488" stroke="#fff" stroke-width="3"/>
  <path d="M86 95l8-10 4 3" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""
    (ASSETS_IMG / "logo.svg").write_text(svg, encoding="utf-8")


def save_icon_pngs(icon128: Image.Image) -> None:
    icon128.convert("RGBA").save(PUBLIC / "icon-128.png")
    icon128.resize((34, 34), Image.Resampling.LANCZOS).save(PUBLIC / "icon-34.png")
    icon128.convert("RGBA").save(STORE_IMAGES / "icon-128.png")


def draw_soft_bg(size: tuple[int, int], accent: tuple[int, int, int] = TEAL) -> Image.Image:
    img = Image.new("RGB", size, BG0)
    fill_vertical_gradient(img, BG0, BG1)
    draw = ImageDraw.Draw(img, "RGBA")
    w, h = size
    # decorative circles
    for cx, cy, r, a in [
        (w * 0.1, h * 0.2, w * 0.28, 40),
        (w * 0.9, h * 0.1, w * 0.22, 30),
        (w * 0.75, h * 0.85, w * 0.3, 28),
    ]:
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*accent, a))
    return img


def make_promo_small(icon: Image.Image) -> None:
    w, h = 440, 280
    img = draw_soft_bg((w, h), TEAL_LIGHT)
    # darker teal band for text contrast
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle((0, 0, w, h), radius=0, fill=(*TEAL, 210))
    for cx, cy, r, a in [(60, 40, 90, 50), (400, 220, 120, 40)]:
        od.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, a))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    icon_s = icon.resize((96, 96), Image.Resampling.LANCZOS)
    img.paste(icon_s, (28, (h - 96) // 2), icon_s)

    draw.text((140, 78), "Header Modify", font=font(34, bold=True), fill=WHITE)
    draw.text((140, 130), "Edit request headers per site", font=font(18), fill=(226, 252, 245))
    draw.text((140, 178), "Paste DevTools · iframes included", font=font(14), fill=(167, 243, 208))
    img.save(STORE_IMAGES / "promo-small-440x280.png")


def make_promo_marquee(icon: Image.Image) -> None:
    w, h = 1400, 560
    img = draw_soft_bg((w, h), TEAL)
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle((0, 0, w, h), fill=(*TEAL, 200))
    for cx, cy, r, a in [(180, 120, 220, 45), (1200, 420, 280, 35), (700, -40, 200, 25)]:
        od.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, a))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    icon_s = icon.resize((160, 160), Image.Resampling.LANCZOS)
    img.paste(icon_s, (80, 120), icon_s)

    draw.text((280, 130), "Header Modify", font=font(64, bold=True), fill=WHITE)
    draw.text((280, 220), "Rewrite HTTP request headers for the current site", font=font(28), fill=(204, 251, 241))
    draw.text((280, 280), "DevTools paste · per-site enable · includes iframe requests", font=font(22), fill=(167, 243, 208))
    draw.text((280, 360), "Open source · Manifest V3 · declarativeNetRequest", font=font(18), fill=(153, 246, 228))

    # Right-side fake popup card
    card = (900, 90, 1320, 470)
    rounded_rect(draw, card, 24, fill=WHITE)
    draw.text((930, 120), "example.com", font=font(18, bold=True), fill=SLATE)
    draw.text((930, 155), "Enable for this site", font=font(20, bold=True), fill=SLATE)
    # toggle on
    rounded_rect(draw, (1200, 150, 1260, 182), 16, fill=TEAL)
    draw.ellipse((1230, 154, 1256, 178), fill=WHITE)
    draw.text((930, 210), "user-agent", font=font(16), fill=MUTED)
    rounded_rect(draw, (930, 235, 1280, 265), 8, fill=(241, 245, 249))
    draw.text((942, 242), "Mozilla/5.0 … Custom/1.0", font=font(14), fill=SLATE)
    draw.text((930, 290), "x-debug-token", font=font(16), fill=MUTED)
    rounded_rect(draw, (930, 315, 1280, 345), 8, fill=(241, 245, 249))
    draw.text((942, 322), "enabled", font=font(14), fill=SLATE)
    rounded_rect(draw, (930, 380, 1100, 420), 20, fill=TEAL)
    draw.text((958, 390), "Parse & Merge", font=font(16, bold=True), fill=WHITE)

    img.save(STORE_IMAGES / "promo-marquee-1400x560.png")


def screenshot_canvas(title: str, subtitle: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    w, h = 1280, 800
    img = draw_soft_bg((w, h), TEAL_LIGHT)
    draw = ImageDraw.Draw(img)
    draw.text((64, 48), title, font=font(36, bold=True), fill=SLATE)
    draw.text((64, 100), subtitle, font=font(20), fill=MUTED)
    return img, draw


def draw_fake_popup(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], mode: str) -> None:
    x0, y0, x1, y1 = box
    rounded_rect(draw, box, 20, fill=WHITE, outline=(226, 232, 240), width=2)
    draw.text((x0 + 24, y0 + 20), "Header Modify", font=font(22, bold=True), fill=SLATE)
    draw.text((x0 + 24, y0 + 52), "example.com", font=font(14), fill=MUTED)

    # enable card
    rounded_rect(draw, (x0 + 20, y0 + 85, x1 - 20, y0 + 155), 14, fill=(240, 253, 250), outline=(167, 243, 208))
    draw.text((x0 + 36, y0 + 100), "Enable for this site", font=font(16, bold=True), fill=SLATE)
    draw.text((x0 + 36, y0 + 124), "All requests in this tab (including iframes)", font=font(12), fill=MUTED)
    on = mode != "off"
    rounded_rect(draw, (x1 - 90, y0 + 105, x1 - 36, y0 + 135), 15, fill=TEAL if on else (203, 213, 225))
    knob_x = x1 - 62 if on else x1 - 84
    draw.ellipse((knob_x, y0 + 109, knob_x + 22, y0 + 131), fill=WHITE)

    if mode == "paste":
        draw.text((x0 + 24, y0 + 175), "Paste from DevTools", font=font(15, bold=True), fill=SLATE)
        rounded_rect(draw, (x0 + 20, y0 + 205, x1 - 20, y0 + 320), 12, fill=(248, 250, 252), outline=(226, 232, 240))
        lines = ["sec-fetch-user", "?1", "user-agent", "Mozilla/5.0 …"]
        for i, line in enumerate(lines):
            draw.text((x0 + 36, y0 + 218 + i * 24), line, font=font(13), fill=SLATE if i % 2 == 0 else MUTED)
        rounded_rect(draw, (x0 + 20, y0 + 340, x0 + 160, y0 + 378), 18, fill=TEAL)
        draw.text((x0 + 40, y0 + 350), "Parse & Merge", font=font(14, bold=True), fill=WHITE)
    else:
        draw.text((x0 + 24, y0 + 175), "Request headers", font=font(15, bold=True), fill=SLATE)
        rows = [
            ("user-agent", "Mozilla/5.0 Custom/1.0"),
            ("x-debug", "1"),
            ("accept-language", "en-US,en;q=0.9"),
        ]
        for i, (name, value) in enumerate(rows):
            y = y0 + 205 + i * 52
            draw.ellipse((x0 + 28, y + 10, x0 + 42, y + 24), outline=TEAL, width=2)
            draw.ellipse((x0 + 31, y + 13, x0 + 39, y + 21), fill=TEAL)
            rounded_rect(draw, (x0 + 54, y, x0 + 170, y + 34), 8, fill=(248, 250, 252), outline=(226, 232, 240))
            draw.text((x0 + 62, y + 8), name, font=font(12), fill=SLATE)
            rounded_rect(draw, (x0 + 180, y, x1 - 28, y + 34), 8, fill=(248, 250, 252), outline=(226, 232, 240))
            draw.text((x0 + 188, y + 8), value[:28], font=font(12), fill=MUTED)


def make_screenshots() -> None:
    # 01 enabled
    img, draw = screenshot_canvas("Enable for this site", "Turn on rewriting for the current origin — badge shows ON")
    draw_fake_popup(draw, (360, 160, 920, 700), mode="list")
    img.save(STORE_IMAGES / "screenshot-01-popup-enabled.png")

    # 02 paste
    img, draw = screenshot_canvas("Paste from Chrome DevTools", "Alternate name/value lines, Name: Value, or cURL -H")
    draw_fake_popup(draw, (360, 160, 920, 700), mode="paste")
    img.save(STORE_IMAGES / "screenshot-02-paste-devtools.png")

    # 03 list
    img, draw = screenshot_canvas("Edit request headers", "Add, toggle, or delete headers — set means add or replace")
    draw_fake_popup(draw, (360, 160, 920, 700), mode="list")
    img.save(STORE_IMAGES / "screenshot-03-headers-list.png")

    # 04 how it works
    img, draw = screenshot_canvas("How it works", "Open source · local-only settings · Manifest V3 DNR")
    steps = [
        ("1", "Open an http(s) page"),
        ("2", "Paste or add headers"),
        ("3", "Enable for this site"),
        ("4", "Reload & inspect Network"),
    ]
    for i, (n, text) in enumerate(steps):
        x = 100 + i * 280
        rounded_rect(draw, (x, 220, x + 240, 420), 18, fill=WHITE, outline=(226, 232, 240))
        draw.ellipse((x + 90, 250, x + 150, 310), fill=TEAL_SOFT)
        draw.text((x + 108, 262), n, font=font(28, bold=True), fill=TEAL)
        draw.text((x + 28, 340), text, font=font(16, bold=True), fill=SLATE)
    rounded_rect(draw, (100, 480, 1180, 700), 18, fill=WHITE, outline=(226, 232, 240))
    draw.text((140, 520), "Privacy", font=font(22, bold=True), fill=SLATE)
    draw.text(
        (140, 570),
        "No remote collection. Headers and enabled sites stay in chrome.storage.local on your device.",
        font=font(18),
        fill=MUTED,
    )
    draw.text(
        (140, 620),
        "GitHub: https://github.com/webLiang/header-modify-extention",
        font=font(18),
        fill=TEAL,
    )
    img.save(STORE_IMAGES / "screenshot-04-how-it-works.png")

    # 05 iframe scope
    img, draw = screenshot_canvas(
        "Includes iframe requests",
        "Session rules use tabIds — main frame, sub_frame, XHR, fetch, media…",
    )
    # browser chrome
    rounded_rect(draw, (160, 180, 1120, 700), 16, fill=WHITE, outline=(203, 213, 225), width=2)
    rounded_rect(draw, (160, 180, 1120, 230), 16, fill=(248, 250, 252))
    draw.rectangle((160, 214, 1120, 230), fill=(248, 250, 252))
    draw.text((190, 194), "https://example.com/player", font=font(16), fill=MUTED)
    # main + iframe
    rounded_rect(draw, (200, 260, 1080, 420), 12, fill=(240, 253, 250), outline=TEAL)
    draw.text((220, 280), "Main page requests → headers applied", font=font(18, bold=True), fill=TEAL)
    draw.text((220, 320), "GET /api/stream  ·  user-agent: Custom/1.0", font=font(15), fill=SLATE)
    rounded_rect(draw, (240, 460, 1040, 660), 12, fill=(239, 246, 255), outline=(59, 130, 246))
    draw.text((260, 490), "Cross-origin iframe", font=font(18, bold=True), fill=(37, 99, 235))
    draw.text((260, 540), "cdn.video.example / player.js / xhr — same tab, same rules", font=font(15), fill=SLATE)
    draw.text((260, 590), "declarativeNetRequest session rule · tabIds", font=font(14), fill=MUTED)
    img.save(STORE_IMAGES / "screenshot-05-iframe-scope.png")


def main() -> None:
    ensure_dirs()
    icon128 = draw_request_icon(128)
    save_icon_pngs(icon128)
    write_logo_svg()
    make_promo_small(icon128)
    make_promo_marquee(icon128)
    make_screenshots()
    print("Generated icons + store images under:")
    print(f"  {PUBLIC}")
    print(f"  {ASSETS_IMG / 'logo.svg'}")
    print(f"  {STORE_IMAGES}")


if __name__ == "__main__":
    main()
