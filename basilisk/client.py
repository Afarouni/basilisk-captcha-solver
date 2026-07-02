from __future__ import annotations

import io
import json
import random
import time
from typing import Optional

from curl_cffi import requests
from PIL import Image

from .solver import solve_slide, SlideSolution
from .icons import solve_icons
from .trail import generate_slide_trail, generate_icons_trail

SERVER = "https://basiliskcaptcha.com"

class BasiliskError(RuntimeError):
    pass

class BasiliskClient:
    def __init__(self, site_key: str, site_domain: str,
                 impersonate: str = "chrome", rng: Optional[random.Random] = None,
                 fast: bool = False):
        self.site_key = site_key
        self.site_domain = site_domain
        self.rng = rng or random.Random()
        self.fast = fast
        self.session = requests.Session(impersonate=impersonate)
        self.headers = {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Content-Type": "text/plain;charset=UTF-8",
            "Origin": site_domain,
            "Referer": site_domain.rstrip("/") + "/",
        }

    def _pause(self, lo, hi, fast_lo=0.0, fast_hi=0.0):
        a, b = (fast_lo, fast_hi) if self.fast else (lo, hi)
        if b > 0:
            time.sleep(self.rng.uniform(a, b))

    def _post(self, endpoint: str, extra: Optional[dict] = None) -> dict:
        payload = {"site_key": self.site_key, "site_domain": self.site_domain}
        if extra:
            payload.update(extra)
        r = self.session.post(f"{SERVER}/challenge/{endpoint}",
                              data=json.dumps(payload), headers=self.headers, timeout=20)
        try:
            return r.json()
        except Exception as exc:
            raise BasiliskError(f"{endpoint}: non-JSON reply {r.status_code}") from exc

    def check_site(self) -> bool:
        return bool(self._post("check-site").get("success"))

    def create_challenge(self, retries: int = 30) -> dict:
        for _ in range(retries):
            self.session = requests.Session(impersonate="chrome")
            self.check_site()
            self._pause(0.8, 1.6, 0.2, 0.4)
            r = self._post("create-challenge")
            if r.get("success"):
                return r["data"]
            self._pause(1.4, 2.6, 0.5, 1.0)
        raise BasiliskError("create-challenge kept returning Rejected (rate limit)")

    def refresh_slide(self, captcha_id: str) -> dict:
        r = self._post("slide-challenge", {"captcha_id": captcha_id})
        if not r.get("success"):
            raise BasiliskError(f"slide-challenge refresh failed: {r.get('message')!r}")
        return r["data"]

    def fetch_image(self, url: str) -> Image.Image:
        return Image.open(io.BytesIO(self.session.get(url, headers=self.headers, timeout=20).content))

    def submit_slide(self, captcha_id: str, solution: SlideSolution) -> dict:
        trail_x, trail_y = generate_slide_trail(solution.x, rng=self.rng)
        return self._post("slide-verify",
                          {"captcha_id": captcha_id, "trail_x": trail_x, "trail_y": trail_y})

    def solve_slide_challenge(self, data: dict) -> SlideSolution:
        bg = self.fetch_image(data["background_url"])
        piece = self.fetch_image(data["slide_url"])
        return solve_slide(bg, piece, data["slide_y"])

    def solve(self, max_attempts: int = 4) -> dict:
        data = self.create_challenge()
        captcha_id = data["captcha_id"]
        for attempt in range(max_attempts):
            solution = self.solve_slide_challenge(data)
            self._pause(1.2, 2.5)
            result = self.submit_slide(captcha_id, solution)
            if result.get("success"):
                return {"captcha_id": captcha_id, "data": data, "solution": solution,
                        "attempts": attempt + 1}
            if attempt < max_attempts - 1:
                data = self.refresh_slide(captcha_id)
        raise BasiliskError(f"slide unsolved after {max_attempts} attempts")

    def icons_challenge(self, captcha_id: str) -> dict:
        r = self._post("icons-challenge", {"captcha_id": captcha_id})
        if not r.get("success"):
            raise BasiliskError(f"icons-challenge failed: {r.get('message')!r}")
        return r["data"]

    def submit_icons(self, captcha_id: str, coords: list) -> dict:
        trail_x, trail_y = generate_icons_trail(coords, rng=self.rng)
        return self._post("icons-verify", {"captcha_id": captcha_id, "coords": coords,
                                           "trail_x": trail_x, "trail_y": trail_y})

    def solve_full(self, max_attempts: int = 3) -> str:
        slide = self.solve()
        captcha_id = slide["captcha_id"]
        for _ in range(max_attempts):
            self._pause(1.0, 1.8)
            data = self.icons_challenge(captcha_id)
            bg = self.fetch_image(data["background_url"])
            coords = solve_icons(bg, data["icons_order"])
            self._pause(1.2, 2.5)
            result = self.submit_icons(captcha_id, coords)
            token = (result.get("data") or {}).get("captcha_response")
            if result.get("success") and token:
                return token
        raise BasiliskError(f"icons unsolved after {max_attempts} attempts")
