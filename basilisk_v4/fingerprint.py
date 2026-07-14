from __future__ import annotations

import random
import string

from . import devices as D
from .crypto import hash_signal, integrity_token

_B64 = string.ascii_letters + string.digits + "+/"

def _weighted(pairs, rng: random.Random):
    return rng.choices([p[0] for p in pairs], weights=[p[1] for p in pairs])[0]

class Device:
    def __init__(self, rng: random.Random | None = None):
        r = rng or random.Random()
        self.os = _weighted(D.OS_WEIGHTS, r)
        self.user_agent = D.UA[self.os]
        self.platform = D.PLATFORM[self.os]
        self.sec_ch_ua_platform = D.CH_UA_PLATFORM[self.os]
        self.vendor = "Google Inc."
        self.webgl_renderer = r.choice(D.RENDERERS[self.os])
        self.webgl_vendor = D.webgl_vendor_for(self.webgl_renderer)

        w, h = r.choice(D.SCREENS[self.os])
        self.screen_w, self.screen_h = w, h
        self.color_depth = r.choice([30, 30, 24]) if self.os == "mac" else 24
        inset = r.choice(D.MAC_CHROME_INSET if self.os == "mac"
                         else D.WINDOWS_TASKBAR if self.os == "windows" else D.LINUX_PANEL)
        self.avail_w, self.avail_h = w, h - inset

        self.hardware_concurrency = (D.mac_cores_for(self.webgl_renderer)
                                     if self.os == "mac" else r.choice(D.CORES_DESKTOP))
        self.device_memory = r.choice(D.DEVICE_MEMORY)
        self.plugins_count = r.choice(D.PLUGINS)
        self.touch_support = False
        self.languages = r.choice(D.LANGUAGES)
        self.language = self.languages[0]
        self.timezone_offset = D.timezone_for(self.languages, r)
        self.canvas_fp = "".join(r.choice(_B64) for _ in range(23)) + "="
        self.fp_hash = self._fingerprint_hash()

    def _fingerprint_hash(self) -> str:
        fields = [
            self.user_agent, self.language, self.platform,
            f"{self.screen_w}x{self.screen_h}x{self.color_depth}",
            f"{self.avail_w}x{self.avail_h}",
            str(self.timezone_offset),
            str(self.hardware_concurrency),
            str(self.device_memory),
            self.vendor,
            self.canvas_fp,
            f"{self.webgl_vendor}|{self.webgl_renderer}",
        ]
        return hash_signal("|".join(f for f in fields if f))

    def _base_signals(self, behavior: "Behavior") -> dict:
        return {
            "pointer_trusted_events": behavior.pointer_trusted_events,
            "pointer_untrusted_events": behavior.pointer_untrusted_events,
            "pointer_trusted_ratio": behavior.pointer_trusted_ratio(),
            "webdriver": False,
            "cdp_leak_detected": False,
            "automation_globals": [],
            "headless_hints": [],
            "webgl_vendor": self.webgl_vendor,
            "webgl_renderer": self.webgl_renderer,
            "languages": self.languages,
            "hardware_concurrency": self.hardware_concurrency,
            "device_memory": self.device_memory,
            "plugins_count": self.plugins_count,
            "touch_support": self.touch_support,
            "blur_events": behavior.blur_events,
            "focus_events": behavior.focus_events,
            "visibility_changes": behavior.visibility_changes,
            "prechallenge_pointer_moves": behavior.prechallenge_pointer_moves,
            "prechallenge_clicks": behavior.prechallenge_clicks,
            "prechallenge_key_events": behavior.prechallenge_key_events,
            "prechallenge_scroll_events": behavior.prechallenge_scroll_events,
            "prechallenge_ms_before_start": behavior.prechallenge_ms_before_start,
            "honeypot_triggered": False,
            "honeypot_traps": [],
        }

    def create_signals(self, behavior: "Behavior") -> dict:
        s = self._base_signals(behavior)
        s.update(motion_signals([], []))
        return s

    def sealed_signals(self, behavior: "Behavior", integrity_seed: str,
                       trail_x: list, trail_y: list, rng: random.Random | None = None) -> dict:
        r = rng or random.Random()
        s = self._base_signals(behavior)
        integrity = {
            "client_integrity_version": 1,
            "client_integrity_toString_tamper": False,
            "client_integrity_automation_hooks": [],
            "client_integrity_native_overrides": [],
            "client_integrity_debugger_stall_ms": r.randint(0, 2),
            "client_integrity_debugger_detected": False,
        }
        s.update(integrity)
        s["client_integrity_token"] = integrity_token(integrity_seed, integrity)
        s.update(motion_signals(trail_x, trail_y))
        return s

class Behavior:
    def __init__(self, rng: random.Random | None = None):
        r = rng or random.Random()
        self.prechallenge_pointer_moves = r.randint(120, 480)
        self.prechallenge_clicks = r.randint(0, 2)
        self.prechallenge_key_events = 0
        self.prechallenge_scroll_events = r.randint(0, 4)
        self.prechallenge_ms_before_start = r.randint(900, 3600)
        self.pointer_trusted_events = r.randint(1, 4)
        self.pointer_untrusted_events = 0
        self.blur_events = r.randint(0, 1)
        self.focus_events = r.randint(0, 1)
        self.visibility_changes = 0

    def pointer_trusted_ratio(self) -> float:
        total = self.pointer_trusted_events + self.pointer_untrusted_events
        return self.pointer_trusted_events / total if total > 0 else 0

def motion_signals(trail_x: list, trail_y: list) -> dict:
    n = min(len(trail_x), len(trail_y))
    if n == 0:
        return {"motion_event_count": 0, "motion_interval_mean_ms": 0,
                "motion_interval_variance_ms": 0, "motion_path_length_px": 0,
                "motion_straightness_ratio": 0}
    intervals = [trail_x[i]["timestamp"] - trail_x[i - 1]["timestamp"] for i in range(1, n)]
    mean = sum(intervals) / len(intervals) if intervals else 0
    var = sum((v - mean) ** 2 for v in intervals) / len(intervals) if intervals else 0
    path = 0.0
    for i in range(1, n):
        dx = trail_x[i]["coord"] - trail_x[i - 1]["coord"]
        dy = trail_y[i]["coord"] - trail_y[i - 1]["coord"]
        path += (dx * dx + dy * dy) ** 0.5
    net_dx = trail_x[n - 1]["coord"] - trail_x[0]["coord"]
    net_dy = trail_y[n - 1]["coord"] - trail_y[0]["coord"]
    net = (net_dx * net_dx + net_dy * net_dy) ** 0.5
    return {"motion_event_count": n, "motion_interval_mean_ms": mean,
            "motion_interval_variance_ms": var, "motion_path_length_px": path,
            "motion_straightness_ratio": net / path if path > 0 else 0}
