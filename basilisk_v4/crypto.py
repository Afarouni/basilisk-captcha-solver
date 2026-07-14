from __future__ import annotations

import base64
import hashlib
import json
import os

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

MASK32 = 0xFFFFFFFF

def sha256_bytes(text: str) -> bytes:
    return hashlib.sha256(text.encode("utf-8")).digest()

def sha256_hex(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def bytes_to_hex(data: bytes) -> str:
    return data.hex()

def hash_signal(text: str) -> str:
    h1 = 2166136261
    h2 = 2654435769
    for i, ch in enumerate(text):
        c = ord(ch) & 0xFFFF
        h1 = (h1 ^ c) & MASK32
        h1 = (h1 * 16777619) & MASK32
        h2 = (h2 ^ ((c + i) & MASK32)) & MASK32
        h2 = (h2 * 2246822507) & MASK32
    return (f"{h1:08x}{h2:08x}")[:32]

def js_stringify(obj) -> str:
    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False)

def integrity_token(seed: str, integrity_signals: dict) -> str:
    return sha256_hex(f"{seed}|{js_stringify(integrity_signals)}")

def round_half_away_from_zero(x) -> int:
    import math
    return -math.floor(-x + 0.5) if x < 0 else math.floor(x + 0.5)

def trail_digest(trail_x: list, trail_y: list, n: int | None = None) -> str | None:
    if n is None:
        n = min(len(trail_x), len(trail_y))
    if not (1 <= n <= 512) or len(trail_x) < n or len(trail_y) < n:
        return None
    parts = [f"tc1|{n}"]
    for i in range(n):
        xp, yp = trail_x[i], trail_y[i]
        if xp["timestamp"] != yp["timestamp"]:
            return None
        parts.append(f";{round_half_away_from_zero(xp['timestamp'])}:"
                     f"{round_half_away_from_zero(xp['coord'])}:{round_half_away_from_zero(yp['coord'])}")
    return sha256_hex("".join(parts))

def seal_body(seal_key_b64: str, captcha_id: str, body: dict) -> dict:
    key = base64.b64decode(seal_key_b64)
    iv = os.urandom(12)
    aad = f"bslk-seal-v1|{captcha_id}".encode("utf-8")
    plaintext = js_stringify(body).encode("utf-8")
    ct = AESGCM(key).encrypt(iv, plaintext, aad)
    return {
        "sealed": 1,
        "v": 1,
        "cid": captcha_id,
        "iv": base64.b64encode(iv).decode("ascii"),
        "ct": base64.b64encode(ct).decode("ascii"),
    }
