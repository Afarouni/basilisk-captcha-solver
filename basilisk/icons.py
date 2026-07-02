from __future__ import annotations

import io
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image
from scipy.ndimage import sobel
from scipy.signal import fftconvolve

ImageLike = "Image.Image | str | bytes"

ICON_COLORS: Dict[str, Tuple[int, int, int]] = {
    "star": (0, 224, 255),
    "calendar": (102, 102, 255),
    "buy": (20, 255, 213),
}
_NAMES = ["star", "calendar", "buy"]

_COLOR_TOL = 110.0
_MAX_TOL = 90.0
_DISK_RADIUS = 26
_GLYPH_RADIUS = 40

def _disk(radius: int) -> np.ndarray:
    y, x = np.ogrid[-radius:radius + 1, -radius:radius + 1]
    d = (x * x + y * y <= radius * radius).astype(np.float64)
    return d / d.sum()

_DISK = _disk(_DISK_RADIUS)

def _as_image(src) -> Image.Image:
    if isinstance(src, Image.Image):
        return src
    if isinstance(src, (bytes, bytearray)):
        return Image.open(io.BytesIO(src))
    return Image.open(src)

def _feature_maps(img: Image.Image) -> Dict[str, Tuple[np.ndarray, np.ndarray]]:
    rgb = np.asarray(img.convert("RGB"), dtype=np.float64)
    gray = rgb.mean(axis=2)
    edge = np.hypot(sobel(gray, axis=1, mode="reflect"), sobel(gray, axis=0, mode="reflect"))
    edge_n = np.clip(edge / (np.percentile(edge, 98) + 1e-9), 0.0, 1.0)

    dists = {n: np.sqrt(((rgb - np.array(c, dtype=np.float64)) ** 2).sum(axis=2))
             for n, c in ICON_COLORS.items()}
    assign = np.argmin(np.stack([dists[n] for n in _NAMES]), axis=0)

    maps: Dict[str, Tuple[np.ndarray, np.ndarray]] = {}
    for k, n in enumerate(_NAMES):
        close = np.clip(1.0 - dists[n] / _COLOR_TOL, 0.0, 1.0)
        col = close * ((assign == k) & (dists[n] < _MAX_TOL))
        maps[n] = (col * edge_n, col)
    return maps

def _locate(maps: Dict[str, Tuple[np.ndarray, np.ndarray]], name: str) -> Tuple[int, int, float]:
    loc, col = maps[name]
    dens = fftconvolve(loc, _DISK, mode="same")
    py, px = np.unravel_index(int(np.argmax(dens)), dens.shape)
    conf = float(dens[py, px])

    r = _GLYPH_RADIUS
    y0, y1 = max(0, py - r), min(col.shape[0], py + r + 1)
    x0, x1 = max(0, px - r), min(col.shape[1], px + r + 1)
    win = col[y0:y1, x0:x1]
    thr = max(1e-6, 0.4 * win.max())
    ys, xs = np.where(win >= thr)
    if len(xs) == 0:
        return int(px), int(py), conf
    cx = x0 + (int(xs.min()) + int(xs.max())) / 2.0
    cy = y0 + (int(ys.min()) + int(ys.max())) / 2.0
    return int(round(cx)), int(round(cy)), conf

def locate_icon(image: ImageLike, name: str) -> Tuple[int, int, float]:
    return _locate(_feature_maps(_as_image(image).convert("RGB")), name)

def solve_icons(background: ImageLike, icons_order: List[str]) -> List[Dict[str, int]]:
    maps = _feature_maps(_as_image(background).convert("RGB"))
    return [{"x": x, "y": y} for x, y, _ in (_locate(maps, n) for n in icons_order)]
