from __future__ import annotations

import io
import json
import random
import time

from curl_cffi import requests
from PIL import Image

from basilisk import solve_slide, solve_icons, generate_slide_trail, generate_icons_trail
from .crypto import seal_body, trail_digest
from .fingerprint import Device, Behavior
from .pow import solve_pow

SERVER = "https://basiliskcaptcha.com"
WIDGET_VERSION = "pool-2026-07-14-17c02338"

class BasiliskV4Error(RuntimeError):
    pass

def _accept_language(langs):
    return ",".join([langs[0]] + [f"{lang};q=0.{9 - i}" for i, lang in enumerate(langs[1:])])

class BasiliskV4Client:
    def __init__(self, site_key, site_domain, rng=None, fast=False):
        self.site_key = site_key
        self.site_domain = site_domain
        self.rng = rng or random.Random()
        self.fast = fast
        self.device = Device(self.rng)
        self.behavior = Behavior(self.rng)
        self.session = requests.Session(impersonate="chrome")
        self.headers = self._headers()
        self.captcha_id = self.seal_key = self.sid = None
        self.integrity_seed = self.start_ticket = None
        self.pow_challenge = self.pow_result = None
        self.challenge_started_at = 0

    def _headers(self):
        d = self.device
        return {
            "accept": "*/*", "accept-language": _accept_language(d.languages),
            "content-type": "text/plain;charset=UTF-8",
            "origin": self.site_domain, "referer": self.site_domain.rstrip("/") + "/",
            "sec-ch-ua": '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
            "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": f'"{d.sec_ch_ua_platform}"',
            "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "cross-site",
            "user-agent": d.user_agent, "priority": "u=1, i",
        }

    def _pause(self, lo, hi, fast_lo=0.0, fast_hi=0.0):
        if self.fast:
            if fast_hi > 0:
                time.sleep(self.rng.uniform(fast_lo, fast_hi))
        else:
            time.sleep(self.rng.uniform(lo, hi))

    def _post(self, endpoint, body):
        if self.seal_key and self.captcha_id and body.get("captcha_id") == self.captcha_id:
            payload = seal_body(self.seal_key, self.captcha_id, body)
        else:
            payload = body
        r = self.session.post(f"{SERVER}/challenge/{endpoint}", data=json.dumps(payload),
                              headers=self.headers, timeout=25)
        try:
            return r.json()
        except Exception as exc:
            raise BasiliskV4Error(f"{endpoint}: non-JSON reply {r.status_code}") from exc

    def fetch_image(self, url):
        return Image.open(io.BytesIO(self.session.get(url, headers=self.headers, timeout=25).content))

    def threaded_body(self, extra, include_sid=False, include_signals=False, trail_x=None, trail_y=None):
        body = {"site_key": self.site_key, "site_domain": self.site_domain, **extra,
                "protocol_version": 4, "widget_version": WIDGET_VERSION, "fp_hash": self.device.fp_hash}
        if include_sid and self.sid:
            body["sid"] = self.sid
        if include_signals:
            if self.integrity_seed:
                body["signals"] = self.device.sealed_signals(self.behavior, self.integrity_seed,
                                                             trail_x or [], trail_y or [], self.rng)
            else:
                body["signals"] = self.device.create_signals(self.behavior)
        return body

    def check_site(self):
        return self._post("check-site", {"site_key": self.site_key, "site_domain": self.site_domain}).get("success")

    def create_challenge(self, supported=("slide",), retries=25):
        for _ in range(retries):
            self.session = requests.Session(impersonate="chrome")
            self.check_site()
            self._pause(0.8, 1.6)
            body = {"site_key": self.site_key, "site_domain": self.site_domain,
                    "signals": self.device.create_signals(self.behavior),
                    "supported_types": list(supported), "protocol_version": 4,
                    "widget_version": WIDGET_VERSION, "fp_hash": self.device.fp_hash}
            r = self._post("create-challenge", body)
            if r.get("success"):
                d = r["data"]
                self.captcha_id = d["captcha_id"]
                self.seal_key = d.get("seal_key")
                self.sid = d.get("sid")
                self.integrity_seed = d.get("client_integrity_seed")
                self.start_ticket = d.get("start_ticket")
                self.pow_challenge = d.get("pow")
                self.challenge_started_at = int(time.time() * 1000)
                return d
            self._pause(1.4, 2.6)
        raise BasiliskV4Error("create-challenge kept returning Rejected (rate limit)")

    def ensure_pow(self):
        if self.pow_result is None and self.pow_challenge:
            self.pow_result = solve_pow(self.pow_challenge["seed"], self.pow_challenge["difficulty"])
        return self.pow_result or {}

    def run_checkpoint(self, slider_position, trail_x, trail_y):
        n = min(len(trail_x), len(trail_y))
        body = self.threaded_body({
            "captcha_id": self.captcha_id, "start_ticket": self.start_ticket,
            "slider_position": round(slider_position), "trail_digest": trail_digest(trail_x, trail_y, n),
            "point_count": n, "elapsed_ms": max(0, int(time.time() * 1000) - self.challenge_started_at),
        }, include_sid=True)
        return self._post("interaction-checkpoint", body)

    def solve_slide_stage(self, data):
        bg = self.fetch_image(data["background_url"])
        piece = self.fetch_image(data["slide_url"])
        sol = solve_slide(bg, piece, data["slide_y"])
        tx, ty = generate_slide_trail(sol.x, rng=self.rng)
        self._pause(1.0, 2.0, 1.3, 1.8)
        body = self.threaded_body({"captcha_id": self.captcha_id, "trail_x": tx, "trail_y": ty},
                                  include_sid=True, include_signals=True, trail_x=tx, trail_y=ty)
        return self._post("slide-verify", body), sol.x

    def icons_stage(self):
        self._pause(0.8, 1.5)
        r = self._post("icons-challenge", self.threaded_body({"captcha_id": self.captcha_id}, include_sid=True))
        if not r.get("success"):
            raise BasiliskV4Error(f"icons-challenge failed: {r.get('message')!r}")
        data = r["data"]
        bg = self.fetch_image(data["background_url"])
        coords = solve_icons(bg, data["icons_order"])
        tx, ty = generate_icons_trail(coords, rng=self.rng)
        self._pause(1.2, 2.5, 1.3, 1.8)
        body = self.threaded_body({"captcha_id": self.captcha_id, "coords": coords, "trail_x": tx, "trail_y": ty},
                                  include_sid=True, include_signals=True, trail_x=tx, trail_y=ty)
        body.update(self.ensure_pow())
        r = self._post("icons-verify", body)
        return (r.get("data") or {}).get("captcha_response"), r

    def solve(self):
        data = self.create_challenge(("slide",))
        self.ensure_pow()
        rs, _ = self.solve_slide_stage(data)
        if not rs.get("success"):
            raise BasiliskV4Error(f"slide-verify failed: {rs.get('message')!r}")
        token = (rs.get("data") or {}).get("captcha_response")
        if token:
            return token
        token, ri = self.icons_stage()
        if not token:
            raise BasiliskV4Error(f"icons-verify failed: {ri.get('message')!r}")
        return token
