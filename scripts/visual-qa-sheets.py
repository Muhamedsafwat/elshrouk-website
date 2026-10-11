#!/usr/bin/env python
"""
Visual QA contact sheets + colour balance (spec §16.2-16.3), built from the output of
`E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test --project=screenshots`.

    python scripts/visual-qa-sheets.py            # writes screenshots/_sheets/*.jpg and prints the colour table

Sheets (JPEG, sized to stay legible when opened in an image viewer / the Read tool):
  <locale>-<route>-phones.jpg     320/360/390/430 viewports at native size, side by side
  <locale>-<route>-large.jpg      768/1024/1280 @0.5, 1440 @0.5, 1920 @0.4
  <locale>-home-<vp>-full.jpg     home full page sliced into columns (390 @0.4, 1440 @0.25)
  <locale>-<route>-full.jpg       other routes: 390 full (@0.4) + 1440 full (@0.25) on one sheet
  <locale>-home-scroll-<vp>-N.jpg scroll film strip (frames every 0.75 viewport)
  overlays-mobile.jpg / overlays-desktop.jpg   open mobile menu, open dropdown, contact form in view
Requires Pillow (pip install pillow).
"""
import glob
import os
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(REPO, 'screenshots')
OUT = os.path.join(SHOTS, '_sheets')
GAP, LABEL, BG = 14, 30, (60, 60, 64)


def _font(name, size):
    for candidate in (f'C:/Windows/Fonts/{name}', f'/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


TITLE, SMALL = _font('arialbd.ttf', 18), _font('arial.ttf', 15)


def load(path, scale=1.0):
    im = Image.open(path).convert('RGB')
    if scale != 1.0:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    return im


def sheet(rows, title, name):
    """rows: list of rows, each a list of (label, image)."""
    width = max(sum(im.width for _, im in row) + GAP * (len(row) + 1) for row in rows)
    height = 40 + sum(max(im.height for _, im in row) + LABEL + GAP for row in rows) + GAP
    canvas = Image.new('RGB', (width, height), BG)
    draw = ImageDraw.Draw(canvas)
    draw.text((GAP, 10), title, fill=(255, 255, 255), font=TITLE)
    y = 40
    for row in rows:
        x = GAP
        for label, im in row:
            draw.text((x, y + 6), label, fill=(255, 214, 102), font=SMALL)
            canvas.paste(im, (x, y + LABEL))
            x += im.width + GAP
        y += max(im.height for _, im in row) + LABEL + GAP
    path = os.path.join(OUT, name)
    canvas.save(path, quality=86, optimize=True)
    return path


def columns(path, scale, col_h, prefix=''):
    im = load(path, scale)
    return [
        (f'{prefix}{round(top / scale)}px', im.crop((0, top, im.width, min(top + col_h, im.height))))
        for top in range(0, im.height, col_h)
    ]


def colour_shares(path):
    """Share of pixels per brand colour family on a 1/4-downsampled capture (photos land in 'other')."""
    im = Image.open(path).convert('RGB')
    im = im.resize((max(1, im.width // 4), max(1, im.height // 4)), Image.BILINEAR)
    counts = dict(white=0, light_grey=0, black=0, vermilion=0, amber=0, other=0)
    for r, g, b in im.getdata():
        hi, lo = max(r, g, b), min(r, g, b)
        if lo >= 252:
            counts['white'] += 1
        elif lo >= 225 and hi - lo <= 12:
            counts['light_grey'] += 1
        elif hi <= 45:
            counts['black'] += 1
        elif r >= 200 and g <= 120 and b <= 90 and r - g >= 110:
            counts['vermilion'] += 1
        elif r >= 220 and 150 <= g <= 215 and b <= 110:
            counts['amber'] += 1
        else:
            counts['other'] += 1
    total = sum(counts.values())
    return {k: round(100 * v / total, 1) for k, v in counts.items()}


def main():
    os.makedirs(OUT, exist_ok=True)
    made = []
    for locale in ('ar', 'en'):
        locale_dir = os.path.join(SHOTS, locale)
        if not os.path.isdir(locale_dir):
            continue
        for slug in sorted(os.listdir(locale_dir)):
            base = os.path.join(locale_dir, slug)
            p = lambda n: os.path.join(base, f'{n}.png')  # noqa: E731
            if os.path.exists(p('320')):
                made.append(sheet([[(n, load(p(n))) for n in ('320', '360', '390', '430')]],
                                  f'/{locale}/{slug} - phones (native size, viewport only)', f'{locale}-{slug}-phones.jpg'))
                made.append(sheet([
                    [('768x1024 @0.5', load(p('768'), 0.5)), ('1024x768 @0.5', load(p('1024'), 0.5)), ('1280x800 @0.5', load(p('1280'), 0.5))],
                    [('1440x900 @0.5', load(p('1440'), 0.5)), ('1920x1080 @0.4', load(p('1920'), 0.4))],
                ], f'/{locale}/{slug} - tablet + desktop (scaled)', f'{locale}-{slug}-large.jpg'))
            if slug == 'home':
                if os.path.exists(p('390-middle')) and os.path.exists(p('1440-footer')):
                    made.append(sheet([[('390 middle', load(p('390-middle'))), ('390 footer', load(p('390-footer'))),
                                        ('1440 middle @0.45', load(p('1440-middle'), 0.45))]],
                                      f'/{locale} home - middle + footer (sticky bar in view)', f'{locale}-home-middle-footer.jpg'))
                    made.append(sheet([[('1440 footer @0.6', load(p('1440-footer'), 0.6))]],
                                      f'/{locale} home - 1440 footer', f'{locale}-home-1440-footer.jpg'))
                for vp, scale in (('390', 0.4), ('1440', 0.25)):
                    if os.path.exists(p(f'{vp}-full')):
                        made.append(sheet([columns(p(f'{vp}-full'), scale, 1950)], f'/{locale} full page {vp} @{scale}',
                                          f'{locale}-home-{vp}-full.jpg'))
                for vp, scale, per_row, rows_per_sheet in (('1440', 0.33, 3, 4), ('390', 0.5, 7, 2)):
                    frames = sorted(glob.glob(os.path.join(base, f'scroll-{vp}', '*.png')))
                    tiles = [(os.path.basename(f)[:-4], load(f, scale)) for f in frames]
                    chunk = per_row * rows_per_sheet
                    for i in range(0, len(tiles), chunk):
                        part = tiles[i:i + chunk]
                        made.append(sheet([part[j:j + per_row] for j in range(0, len(part), per_row)],
                                          f'/{locale} home scroll film strip {vp} {i // chunk + 1}',
                                          f'{locale}-home-scroll-{vp}-{i // chunk + 1}.jpg'))
            elif os.path.exists(p('390-full')) or os.path.exists(p('1440-full')):
                cols = []
                if os.path.exists(p('390-full')):
                    cols += columns(p('390-full'), 0.4, 1900, '390 ')
                if os.path.exists(p('1440-full')):
                    cols += columns(p('1440-full'), 0.25, 1900, '1440 ')
                made.append(sheet([cols], f'/{locale}/{slug} full page: 390 @0.4 | 1440 @0.25', f'{locale}-{slug}-full.jpg'))

    overlay = lambda *parts: os.path.join(SHOTS, *parts)  # noqa: E731
    if os.path.exists(overlay('ar', 'mobile-menu', '390.png')):
        made.append(sheet([[('ar menu 390', load(overlay('ar', 'mobile-menu', '390.png'))),
                            ('en menu 390', load(overlay('en', 'mobile-menu', '390.png'))),
                            ('ar contact form 390', load(overlay('ar', 'contact', '390-form.png')))]],
                          'Mobile menu open (ar/en) + contact form scrolled into view', 'overlays-mobile.jpg'))
        made.append(sheet([[('ar dropdown 1440 @0.55', load(overlay('ar', 'nav-dropdown', '1440.png'), 0.55)),
                            ('en dropdown 1440 @0.55', load(overlay('en', 'nav-dropdown', '1440.png'), 0.55))],
                           [('ar contact form 1440 @0.55', load(overlay('ar', 'contact', '1440-form.png'), 0.55))]],
                          'Desktop dropdown open (ar/en) + contact form in view', 'overlays-desktop.jpg'))

    for path in made:
        print(os.path.relpath(path, REPO).replace(os.sep, '/'))

    print('\n| capture | white | warm/light grey | black | vermilion | amber | photo/other |')
    print('|---|---|---|---|---|---|---|')
    for f in sorted(glob.glob(os.path.join(SHOTS, '*', '*', '*-full.png'))):
        c = colour_shares(f)
        rel = os.path.relpath(f, REPO).replace(os.sep, '/')
        print(f"| `{rel}` | {c['white']} | {c['light_grey']} | {c['black']} | {c['vermilion']} | {c['amber']} | {c['other']} |")


if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    main()
