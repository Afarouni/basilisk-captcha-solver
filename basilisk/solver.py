from __future__ import annotations

import io
from dataclasses import dataclass
from typing import Optional, Tuple, Union

import numpy as np
from PIL import Image
from scipy.ndimage import sobel

PUZZLE_WIDTH = 64
CANVAS_WIDTH = 318
CANVAS_HEIGHT = 252

ImageLike = Union[Image.Image, str, bytes]

@dataclass
class SlideSolution:
    x: int
    confidence: float
    margin: float
    scores: np.ndarray

    def __int__(self) -> int:
        return self.x

def _as_image(src) -> Image.Image:
    if isinstance(src, Image.Image):
        return src
    if isinstance(src, (bytes, bytearray)):
        return Image.open(io.BytesIO(src))
    return Image.open(src)

def _sobel_mag(gray: np.ndarray) -> np.ndarray:
    gx = sobel(gray, axis=1, mode="reflect")
    gy = sobel(gray, axis=0, mode="reflect")
    return np.hypot(gx, gy)

def _ncc_1d(bg_edge: np.ndarray, template: np.ndarray, y0: int) -> np.ndarray:
    ph, pw = template.shape
    h, w = bg_edge.shape
    y1 = min(y0 + ph, h)
    template = template[: y1 - y0]
    t_c = template - template.mean()
    t_norm = np.sqrt((t_c ** 2).sum()) + 1e-9

    scores = np.full(w - pw + 1, -1.0)
    for x in range(scores.size):
        window = bg_edge[y0:y1, x:x + pw]
        w_c = window - window.mean()
        w_norm = np.sqrt((w_c ** 2).sum())
        if w_norm > 1e-6:
            scores[x] = float((w_c * t_c).sum() / (w_norm * t_norm))
    return scores

def solve_slide(background: ImageLike, slide: ImageLike, slide_y: int,
                x_range: Optional[Tuple[int, int]] = None) -> SlideSolution:
    bg = _as_image(background).convert("L")
    bg_edge = _sobel_mag(np.asarray(bg, dtype=np.float64))

    piece = _as_image(slide).convert("RGBA")
    if piece.size[0] != PUZZLE_WIDTH:
        piece = piece.resize((PUZZLE_WIDTH, piece.size[1]))
    alpha = np.asarray(piece, dtype=np.float64)[:, :, 3]

    template = _sobel_mag(alpha)
    template /= template.max() + 1e-9

    y0 = int(round(slide_y))
    scores = _ncc_1d(bg_edge, template, y0)

    search = scores.copy()
    if x_range is not None:
        lo, hi = x_range
        mask = np.ones_like(search, dtype=bool)
        mask[max(0, lo):min(search.size, hi + 1)] = False
        search[mask] = -1.0

    x = int(np.argmax(search))
    peak = float(scores[x])

    rivals = scores.copy()
    rivals[max(0, x - PUZZLE_WIDTH // 2):x + PUZZLE_WIDTH // 2 + 1] = -1.0
    margin = peak - float(rivals.max())

    return SlideSolution(x=x, confidence=peak, margin=margin, scores=scores)
