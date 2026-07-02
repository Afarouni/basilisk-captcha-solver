import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from basilisk import BasiliskClient

client = BasiliskClient(site_key="a3760bfe5cf4254b2759c19fb2601667",
                        site_domain="https://faucetpay.io")

token = client.solve_full()
print("captcha_response =", token)
