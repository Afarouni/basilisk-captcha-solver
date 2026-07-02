# basilisk-captcha-solver

Solver for Basilisk captcha, the one on faucetpay.io. There are two parts, a slider puzzle and a
"click these 3 icons in order" step, and you need both to get the token. It does everything with
normal image processing.

## how it works

The slider gives you a background with a hole in it plus the puzzle piece. The piece is cut out of
the background so you can't just match the picture, but the hole still has an outline, so I match the
piece's outline against the edges in the background to find the x, then drag the slider over.

The icons step has a star, a calendar and a cart, and each one is always the same color (cyan, blue,
teal). So I just look for each color and click the middle of it. Two things trip up a naive version:
cyan and teal are close, so I match every pixel to the closest of the three colors instead of
thresholding each one on its own, and the blue calendar looks like sky, so I also weight by edges
(the icons have sharp edges, a sky doesn't).

The mouse movement matters too, a dead straight line gets rejected. For the icons I take a real
recorded mouse path and bend it onto wherever the 3 icons ended up.

One catch, the endpoints are behind Cloudflare which blocks plain python, so it uses curl_cffi
pretending to be Chrome.

## use it

Install:

```
pip install -r requirements.txt
```

Solve the sample images offline:

```
python examples/solve_local.py
```

Solve a live one:

```python
from basilisk import BasiliskClient
token = BasiliskClient("a3760bfe5cf4254b2759c19fb2601667", "https://faucetpay.io").solve_full()
```

The solving is about 40ms. If you want it even quicker, `fast=True` drops the fake human
delays. Check the pass rate yourself:

```
python eval/accuracy_live.py -n 100 --fast
```

## files

```
basilisk/solver.py    the slider
basilisk/icons.py     the icons
basilisk/trail.py     the mouse paths
basilisk/client.py    the requests
examples/             offline and live demos
eval/                 accuracy test and image scraper
samples/              one slider and one icons challenge
```

## note

MIT.