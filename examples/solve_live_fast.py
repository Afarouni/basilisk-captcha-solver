import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from basilisk import BasiliskClient

client = BasiliskClient(site_key="a3760bfe5cf4254b2759c19fb2601667",
                        site_domain="https://faucetpay.io", fast=True)

t0 = time.perf_counter()
token = client.solve_full()
print("captcha_response =", token)
print(f"solved in {time.perf_counter() - t0:.1f}s")
