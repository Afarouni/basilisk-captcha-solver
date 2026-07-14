import argparse
import base64
import json
import os
import random
import sys
import time
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from basilisk_v4 import BasiliskV4Client, BasiliskV4Error


def token_fields(token):
    try:
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        return json.loads(base64.urlsafe_b64decode(payload))
    except Exception:
        return {}


def run(n, site_key, site_domain, fast, pace):
    ok = done = 0
    risks = Counter()
    for i in range(n):
        c = BasiliskV4Client(site_key, site_domain, fast=fast)
        t0 = time.perf_counter()
        try:
            token = c.solve()
            done += 1
            ok += 1
            f = token_fields(token)
            risk = f.get("risk_level", "?")
            risks[risk] += 1
            pow_ms = c.pow_result.get("pow_ms") if c.pow_result else "-"
            print(f"#{i:3d} [{c.device.os:7s}] token={token[:40]} risk={risk:6s} "
                  f"action={f.get('action', '') or '-'} ttl={f.get('ttl_seconds', '?')}s pow_ms={pow_ms} "
                  f"{time.perf_counter() - t0:.1f}s -> {ok}/{done} ({ok / done * 100:.0f}%)", flush=True)
        except BasiliskV4Error as e:
            done += 1
            print(f"#{i:3d} [{c.device.os:7s}] FAIL: {e} -> {ok}/{done}", flush=True)
        except Exception as e:
            print(f"#{i:3d} error: {e!r}", flush=True)
        time.sleep(random.uniform(*pace))
    dist = " ".join(f"{k}={v}" for k, v in risks.most_common()) or "none"
    print(f"\n=== v4 end-to-end: {ok}/{done} = {ok / max(1, done) * 100:.1f}%  risk[{dist}] ===", flush=True)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("-n", type=int, default=20)
    ap.add_argument("--fast", action="store_true")
    ap.add_argument("--site-key", default="a3760bfe5cf4254b2759c19fb2601667")
    ap.add_argument("--site-domain", default="https://faucetpay.io")
    a = ap.parse_args()
    pace = (0.5, 1.2) if a.fast else (3.0, 4.5)
    run(a.n, a.site_key, a.site_domain, a.fast, pace)
