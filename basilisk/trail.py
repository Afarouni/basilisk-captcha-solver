from __future__ import annotations

import json
import math
import os
import random
import time
from typing import Dict, List, Optional, Tuple

SLIDER_START = 8

Sample = Dict[str, int]
Trail = List[Sample]

_TEMPLATE = json.load(open(os.path.join(os.path.dirname(__file__), "_icons_trail_template.json")))
_TPTS = _TEMPLATE["pts"]
_TCLICKS = [tuple(c) for c in _TEMPLATE["coords"]]

def _template_anchor_index(cx: int, cy: int) -> int:
    for i, (_, x, y) in enumerate(_TPTS):
        if x == cx and y == cy:
            return i
    return 0

_ANCHOR_IDX = [_template_anchor_index(*_TCLICKS[0]), _template_anchor_index(*_TCLICKS[1]),
               _template_anchor_index(*_TCLICKS[2]), len(_TPTS) - 1]
_ANCHOR_PT = [_TCLICKS[0], _TCLICKS[1], _TCLICKS[2], (_TPTS[-1][1], _TPTS[-1][2])]

def generate_slide_trail(
    target_x: int,
    start_x: int = SLIDER_START,
    rng: Optional[random.Random] = None,
    now_ms: Optional[int] = None,
) -> Tuple[Trail, Trail]:
    rng = rng or random
    target_x = int(round(target_x))
    distance = max(1, target_x - start_x)

    n = int(min(260, max(45, distance * 1.7)))
    t = int(now_ms if now_ms is not None else time.time() * 1000)

    trail_x: Trail = []
    trail_y: Trail = []
    y = 0.0
    for i in range(n + 1):
        p = i / n
        ease = 0.5 - 0.5 * math.cos(math.pi * p)
        x = start_x + distance * ease + rng.uniform(-0.6, 0.6)
        cx = max(start_x, min(target_x, int(round(x))))

        y += rng.uniform(-0.8, 1.0)
        y = max(-4.0, min(20.0, y))

        dt = rng.randint(3, 11)
        if rng.random() < 0.05:
            dt += rng.randint(12, 45)
        t += dt

        trail_x.append({"timestamp": t, "coord": cx})
        trail_y.append({"timestamp": t, "coord": int(round(y))})

    trail_x[-1]["coord"] = target_x
    return trail_x, trail_y

def generate_icons_trail(
    points: List[Dict[str, int]],
    apply_button: Optional[Tuple[int, int]] = None,
    rng: Optional[random.Random] = None,
    now_ms: Optional[int] = None,
) -> Tuple[Trail, Trail]:
    rng = rng or random
    if apply_button is None:
        apply_button = (rng.randint(160, 210), rng.randint(300, 320))
    my = [(p["x"], p["y"]) for p in points] + [apply_button]
    t0 = int(now_ms if now_ms is not None else time.time() * 1000)

    tx: Trail = []
    ty: Trail = []
    for s in range(3):
        i0, i1 = _ANCHOR_IDX[s], _ANCHOR_IDX[s + 1]
        ra, rb = _ANCHOR_PT[s], _ANCHOR_PT[s + 1]
        ma, mb = my[s], my[s + 1]
        rlen = math.hypot(rb[0] - ra[0], rb[1] - ra[1]) or 1.0
        mlen = math.hypot(mb[0] - ma[0], mb[1] - ma[1]) or 1.0
        rux, ruy = (rb[0] - ra[0]) / rlen, (rb[1] - ra[1]) / rlen
        mux, muy = (mb[0] - ma[0]) / mlen, (mb[1] - ma[1]) / mlen
        scale = mlen / rlen
        for i in range(i0, i1 + 1):
            if s > 0 and i == i0:
                continue
            ts, rx, ry = _TPTS[i]
            vx, vy = rx - ra[0], ry - ra[1]
            along = (vx * rux + vy * ruy) * scale
            perp = (vx * (-ruy) + vy * rux) * scale
            nx = max(0, min(318, ma[0] + along * mux + perp * (-muy)))
            ny = max(0, min(340, ma[1] + along * muy + perp * mux))
            tx.append({"timestamp": t0 + ts, "coord": int(round(nx))})
            ty.append({"timestamp": t0 + ts, "coord": int(round(ny))})
    return tx, ty
