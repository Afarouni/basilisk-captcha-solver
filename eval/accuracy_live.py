import argparse
import json
import os
import random
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from basilisk import (BasiliskClient, solve_slide, solve_icons,
                      generate_slide_trail)
from basilisk.client import BasiliskError

FAILS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_fails")
_ABBR = {"star": "s", "calendar": "c", "buy": "b"}

def one(client, fast):
    t0 = time.perf_counter()
    data = client.create_challenge()
    cid = data["captcha_id"]

    bg = client.fetch_image(data["background_url"])
    piece = client.fetch_image(data["slide_url"])
    tcv = time.perf_counter()
    sol = solve_slide(bg, piece, data["slide_y"])
    slide_cv = (time.perf_counter() - tcv) * 1000
    sx, sy = generate_slide_trail(sol.x)
    if not fast:
        time.sleep(random.uniform(1.2, 2.2))
    rs = client._post("slide-verify", {"captcha_id": cid, "trail_x": sx, "trail_y": sy})
    if not rs.get("success"):
        return {"stage": "slide", "ok": False, "x": sol.x, "sy": data["slide_y"]}

    if not fast:
        time.sleep(random.uniform(1.0, 1.8))
    idata = client.icons_challenge(cid)
    ibg = client.fetch_image(idata["background_url"])
    order = idata["icons_order"]
    tcv = time.perf_counter()
    coords = solve_icons(ibg, order)
    icons_cv = (time.perf_counter() - tcv) * 1000
    if not fast:
        time.sleep(random.uniform(2.5, 4.0))
    ri = client.submit_icons(cid, coords)
    token = (ri.get("data") or {}).get("captcha_response")
    return {"stage": "icons", "ok": bool(ri.get("success") and token), "x": sol.x,
            "sy": data["slide_y"], "order": order, "coords": coords, "bg": ibg,
            "resp": ri, "slide_cv": slide_cv, "icons_cv": icons_cv,
            "wall": time.perf_counter() - t0, "cid": cid}

def run(n, site_key, site_domain, pace, fast):
    os.makedirs(FAILS, exist_ok=True)
    ok = done = 0
    for i in range(n):
        try:
            m = one(BasiliskClient(site_key, site_domain, fast=fast), fast)
        except BasiliskError as e:
            print(f"#{i:3d} error: {e}", flush=True); time.sleep(random.uniform(*pace)); continue
        except Exception as e:
            print(f"#{i:3d} unexpected: {e!r}", flush=True); time.sleep(random.uniform(*pace)); continue
        if m["stage"] == "slide":
            print(f"#{i:3d} SLIDE-FAIL x={m['x']} sy={m['sy']}", flush=True)
            time.sleep(random.uniform(*pace)); continue
        done += 1; ok += m["ok"]
        seq = ">".join(_ABBR[o] for o in m["order"])
        tok = m["resp"].get("data", {}).get("captcha_response", "-") if m["ok"] else "-"
        print(f"#{i:3d} slide OK x={m['x']} sy={m['sy']} cv={m['slide_cv']:.0f}ms | "
              f"icons {'OK  ' if m['ok'] else 'MISS'} {seq} cv={m['icons_cv']:.0f}ms | "
              f"wall={m['wall']:.1f}s | tok={tok} | {ok}/{done} {ok/done*100:.0f}%", flush=True)
        if not m["ok"]:
            m["bg"].save(os.path.join(FAILS, f"{m['cid']}.png"))
            with open(os.path.join(FAILS, f"{m['cid']}.json"), "w") as f:
                json.dump({"order": m["order"], "coords": m["coords"], "resp": m["resp"]}, f, indent=2)
        time.sleep(random.uniform(*pace))
    print(f"\n=== ICONS end-to-end: {ok}/{done} = {ok/max(1,done)*100:.1f}% ===", flush=True)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", type=int, default=100)
    ap.add_argument("--fast", action="store_true", help="drop the fake human delays")
    ap.add_argument("--site-key", default="a3760bfe5cf4254b2759c19fb2601667")
    ap.add_argument("--site-domain", default="https://faucetpay.io")
    ap.add_argument("--pace", type=float, nargs=2, default=None,
                    help="min/max seconds between challenges")
    a = ap.parse_args()
    pace = a.pace or ((0.5, 1.2) if a.fast else (3.0, 4.5))
    run(a.n, a.site_key, a.site_domain, pace, a.fast)
