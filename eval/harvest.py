import argparse
import json
import os
import random
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from basilisk import BasiliskClient
from basilisk.client import BasiliskError

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dataset")

def harvest(stage, n, site_key, site_domain):
    os.makedirs(OUT, exist_ok=True)
    manifest, got = [], 0
    while got < n:
        client = BasiliskClient(site_key, site_domain)
        try:
            if stage == "slide":
                d = client.create_challenge()
                cid = d["captcha_id"]
                bg = client.session.get(d["background_url"], headers=client.headers).content
                sl = client.session.get(d["slide_url"], headers=client.headers).content
                open(os.path.join(OUT, f"{cid}_bg.png"), "wb").write(bg)
                open(os.path.join(OUT, f"{cid}_slide.png"), "wb").write(sl)
                manifest.append({"captcha_id": cid, "slide_y": d["slide_y"],
                                 "bg": f"{cid}_bg.png", "slide": f"{cid}_slide.png"})
            else:
                slide = client.solve()
                cid = slide["captcha_id"]
                d = client.icons_challenge(cid)
                bg = client.session.get(d["background_url"], headers=client.headers).content
                open(os.path.join(OUT, f"{cid}_icons.png"), "wb").write(bg)
                manifest.append({"captcha_id": cid, "order": d["icons_order"],
                                 "bg": f"{cid}_icons.png"})
        except BasiliskError as e:
            print("  retry:", e, flush=True); time.sleep(2); continue
        got += 1
        print(f"[{got}/{n}] {manifest[-1]}", flush=True)
        with open(os.path.join(OUT, "manifest.json"), "w") as f:
            json.dump(manifest, f, indent=2)
        time.sleep(random.uniform(2.5, 3.8))
    print("done:", got)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", choices=["slide", "icons"], default="slide")
    ap.add_argument("-n", type=int, default=40)
    ap.add_argument("--site-key", default="a3760bfe5cf4254b2759c19fb2601667")
    ap.add_argument("--site-domain", default="https://faucetpay.io")
    a = ap.parse_args()
    harvest(a.stage, a.n, a.site_key, a.site_domain)
