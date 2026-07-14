from __future__ import annotations

import hashlib
import time

def count_leading_zero_bits(data: bytes) -> int:
    count = 0
    for byte in data:
        if byte:
            mask = 128
            while mask and not (byte & mask):
                count += 1
                mask >>= 1
            return count
        count += 8
    return count

def iteration_cap(difficulty: int) -> int:
    raw = (2 ** max(0, int(difficulty))) * 16
    return max(1, min(8388608, raw))

def solve_pow(seed: str, difficulty: int) -> dict | None:
    start = time.perf_counter()
    cap = iteration_cap(difficulty)
    seed_b = seed.encode("utf-8")
    i = 0
    while i < cap:
        digest = hashlib.sha256(seed_b + str(i).encode("ascii")).digest()
        if count_leading_zero_bits(digest) >= difficulty:
            return {
                "pow_nonce": str(i),
                "pow_iterations": i + 1,
                "pow_ms": max(0, round((time.perf_counter() - start) * 1000)),
            }
        i += 1
    return None
