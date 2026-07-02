import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from basilisk import (solve_slide, solve_icons,
                      generate_slide_trail, generate_icons_trail)

SAMPLES = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "samples")

sol = solve_slide(os.path.join(SAMPLES, "slide_bg.png"),
                  os.path.join(SAMPLES, "slide_piece.png"), slide_y=145)
print(f"slide: gap x = {sol.x}  (confidence {sol.confidence:.2f}, margin {sol.margin:.2f})")
sx, sy = generate_slide_trail(sol.x)
print(f"       slide trail: {len(sx)} points, {sx[0]['coord']} -> {sx[-1]['coord']}")

order = ["star", "calendar", "buy"]
coords = solve_icons(os.path.join(SAMPLES, "icons_bg.png"), order)
print(f"icons: {list(zip(order, [(c['x'], c['y']) for c in coords]))}")
ix, iy = generate_icons_trail(coords)
print(f"       icons trail: {len(ix)} points over "
      f"{ix[-1]['timestamp'] - ix[0]['timestamp']} ms")
