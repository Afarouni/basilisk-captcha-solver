# basilisk-captcha-solver

Solver for Basilisk captcha. It solves the challenge and gives you the
captcha token. The picture parts are plain image processing, the rest is a reimplementation
of their protocol.

This targets their current build, protocol 4, widget `pool-2026-07-14-17c02338`. That build id is
the `widget_version` their own script reports, so if it changes they pushed an update and something
here might need a look.

## v2 update (basilisk v4) (15/07/2026)

Basilisk very recently did a update, so the old flow does not seem to be in use anymore. The image
solving still works, they just wrapped a lot of new stuff around it. Here is what they changed and
what v2 does about it.

- the widget script is obfuscated now (javascript-obfuscator). there is a fully deobfuscated and
  renamed copy in this repo (`basilisk-captcha.deobfuscated.js`), and the obfuscated original next to
  it (`basilisk-captcha.obfuscated.js`) if you want to compare.
- they added a rotation challenge, you drag a slider to spin a little patch until it sits upright,
  next to the old slider puzzle. the server decides which one you get, and you tell it which ones you
  can do.
- every request after create-challenge is encrypted now. they call it "sealed": AES-256-GCM with a
  per-session key the server hands you, a random iv, and the captcha id mixed in as associated data.
- there is a proof of work. the server gives you a seed and a difficulty, you grind a nonce until
  sha256(seed+nonce) has that many leading zero bits, and you send it with the last request.
- create-challenge now wants a big pile of device and behaviour signals: user agent, webgl vendor and
  renderer, cpu cores, memory, screen, languages, timezone, pointer and scroll counts, a canvas+webgl
  fingerprint hash, honeypot flags, and a client-integrity block that sniffs for tampering and
  automation. v2 builds all of it from a pool of real device profiles, so every run looks like a
  different real machine and the fingerprint hash never repeats.
- the rotation one also does a checkpoint partway through the drag. it phones home mid-drag and the
  server sends back a mutation (flip the direction, shift the offset, or change the gain) that changes
  how the rest of your drag maps to the angle. so you can't just precompute the motion.

v2 reimplements all of that and gets real tokens. the crypto (the sealing, the integrity token, the
fingerprint hash) is matched byte for byte against their own code. right now it takes the slide path:
it asks for the slide type, which the server still gives, solves it with the image code below, and
runs the sealed slide then icons then token flow. the rotation solver (finding the upright angle and
driving the drag through that mid-way mutation) is the next thing on the list but I will probably not
add support for it until it becomes forced by the server.

## how the image solving works

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

The endpoints are behind Cloudflare which blocks plain python requests, so it uses curl_cffi
pretending to be Chrome.

## use it

Install:

```
pip install -r requirements.txt
```

Solve a live one (v2, gives you a real token):

```python
from basilisk_v4 import BasiliskV4Client
token = BasiliskV4Client("a3760bfe5cf4254b2759c19fb2601667", "https://faucetpay.io").solve()
```

`fast=True` trims the idle waiting but keeps a little think time before each answer, otherwise the
server rejects it for being too quick. check the pass rate yourself:

```
python eval/accuracy_v4.py -n 50
```

Just the image solving, offline on the sample images:

```
python examples/solve_local.py
```

## files

```
basilisk_v4/          the v4 protocol: sealing, pow, fingerprint, device pool, client
basilisk/             the image solving (slider + icons), reused by v4
basilisk-captcha.deobfuscated.js   their widget, deobfuscated and renamed
basilisk-captcha.obfuscated.js     the same widget as served, obfuscated
examples/             live and offline demos
eval/                 accuracy test
samples/              one slider and one icons challenge
```

## note

MIT.
