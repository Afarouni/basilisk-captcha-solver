from __future__ import annotations

CHROME_MAJOR = "149"

UA = {
    "windows": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "mac": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
    "linux": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36",
}
PLATFORM = {"windows": "Win32", "mac": "MacIntel", "linux": "Linux x86_64"}
CH_UA_PLATFORM = {"windows": "Windows", "mac": "macOS", "linux": "Linux"}
OS_WEIGHTS = [("windows", 70), ("mac", 22), ("linux", 8)]

WINDOWS_RENDERERS = [
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3090 (0x00002204) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3090 Ti (0x00002203) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 (0x00002206) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Ti (0x00002208) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Laptop GPU (0x0000249C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Laptop GPU (0x000024DC) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 Ti Laptop GPU (0x00002420) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002488) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 (0x00002503) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 (0x00002504) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti (0x00002486) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti (0x00002489) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Ti (0x000024C9) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3050 (0x00002507) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3050 Laptop GPU (0x000025A2) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3050 Ti Laptop GPU (0x000025A0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 (0x00002684) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 (0x00002786) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Ti (0x00002782) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 SUPER (0x00002783) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Ti (0x00002803) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Laptop GPU (0x000028E0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 2070 (0x00001F02) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 2070 with Max-Q Design (0x00001F10) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 2070 SUPER (0x00001E84) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 (0x00001E89) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 SUPER (0x00001F06) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1080 Ti (0x00001B06) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 (0x00001B81) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 6GB (0x00001B83) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 Ti (0x00002182) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 SUPER (0x000021C4) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 (0x00002188) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 (0x00001F91) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti (0x00001C82) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 (0x00001C8D) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 980 (0x000013C0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA RTX 5000 Ada Generation (0x000026B2) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA Quadro P3200 (0x00001BBB) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6750 XT (0x000073DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6600 (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6600 XT (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001681) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001636) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x0000164C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Vega 3 Graphics (0x000015D8) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon (TM) Graphics (0x000015E7) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon R7 370 Series (0x00006811) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon R7 200 Series (0x00006658) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon R5 340 (0x00006611) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon (TM) RX 470 Graphics (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x0000A7A0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x0000A7A1) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x00009A40) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x000046A8) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics (0x000046A6) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 770 (0x00004680) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 730 (0x00004C8B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E9B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E92) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00003E91) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00009BC8) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 620 (0x00003EA0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics 620 (0x00005917) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics (0x00009A78) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics (0x00009B41) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics (0x0000A78B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 620 (0x00005916) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 530 (0x0000191B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 520 (0x00001916) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 5500 (0x00001616) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 4000 (0x00000166) Direct3D11 vs_5_0 ps_5_0, D3D11)",
]
MAC_RENDERERS = [
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M1, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Pro, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M1 Max, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Pro, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M2 Max, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M3, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Pro, Unspecified Version)",
    "ANGLE (Apple, ANGLE Metal Renderer: Apple M3 Max, Unspecified Version)",
    "ANGLE (Intel Inc., Intel(R) Iris(TM) Plus Graphics 645, OpenGL 4.1)",
    "ANGLE (Intel Inc., Intel(R) Iris(TM) Plus Graphics 655, OpenGL 4.1)",
    "ANGLE (Intel Inc., Intel(R) UHD Graphics 630, OpenGL 4.1)",
    "ANGLE (ATI Technologies Inc., AMD Radeon Pro 5500M OpenGL Engine, OpenGL 4.1)",
    "ANGLE (ATI Technologies Inc., AMD Radeon Pro 5300M OpenGL Engine, OpenGL 4.1)",
]
LINUX_RENDERERS = [
    "ANGLE (Intel, Mesa Intel(R) Xe Graphics (TGL GT2), OpenGL 4.6)",
    "ANGLE (Intel, Mesa Intel(R) UHD Graphics (TGL GT1), OpenGL 4.6)",
    "ANGLE (Intel, Mesa Intel(R) HD Graphics 520 (SKL GT2), OpenGL 4.6)",
    "ANGLE (Intel, Mesa Intel(R) HD Graphics 620 (KBL GT2), OpenGL 4.6)",
    "ANGLE (Intel, Mesa Intel(R) HD Graphics 630 (KBL GT2), OpenGL 4.6)",
    "ANGLE (Intel, Mesa Intel(R) UHD Graphics 770 (ADL-S GT1), OpenGL 4.6)",
    "ANGLE (Intel, Mesa Intel(R) Graphics (RPL-P), OpenGL 4.6)",
    "ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 3060/PCIe/SSE2, OpenGL 4.5.0)",
    "ANGLE (NVIDIA Corporation, NVIDIA GeForce RTX 2060/PCIe/SSE2, OpenGL 4.5.0)",
    "ANGLE (NVIDIA Corporation, NVIDIA GeForce GTX 1060 6GB/PCIe/SSE2, OpenGL 4.5.0)",
]
RENDERERS = {"windows": WINDOWS_RENDERERS, "mac": MAC_RENDERERS, "linux": LINUX_RENDERERS}

WINDOWS_SCREENS = [(1920, 1080), (1920, 1080), (1920, 1080), (1366, 768), (1536, 864),
                   (1536, 864), (1600, 900), (1440, 900), (1280, 720), (1280, 800),
                   (2560, 1440), (3840, 2160), (1920, 1200), (2560, 1080), (1680, 1050),
                   (2048, 1152), (3440, 1440), (1360, 768)]
MAC_SCREENS = [(1440, 900), (1512, 982), (1728, 1117), (1680, 1050), (1470, 956),
               (2056, 1329), (1800, 1169), (2560, 1440), (1920, 1080)]
LINUX_SCREENS = [(1920, 1080), (1920, 1080), (1366, 768), (1600, 900), (2560, 1440),
                 (1440, 900), (3840, 2160), (1680, 1050)]
SCREENS = {"windows": WINDOWS_SCREENS, "mac": MAC_SCREENS, "linux": LINUX_SCREENS}

WINDOWS_TASKBAR = [40, 40, 48, 48, 56, 72]
MAC_CHROME_INSET = [25, 25, 25, 85, 92]
LINUX_PANEL = [27, 32, 48, 64]

CORES_DESKTOP = [4, 6, 8, 8, 8, 12, 12, 16, 16, 20, 24, 32]

MAC_CHIP_CORES = {"M1": 8, "M1 Pro": 10, "M1 Max": 10, "M2": 8, "M2 Pro": 12,
                  "M2 Max": 12, "M3": 8, "M3 Pro": 12, "M3 Max": 16}
DEVICE_MEMORY = [8, 8, 8, 8, 8, 4, 4]
PLUGINS = [5, 5, 5, 5, 3]

LANGUAGES = [
    ["en-US"], ["en-US"], ["en-US", "en"], ["en-GB", "en"], ["en-GB", "en-US", "en"],
    ["de-DE", "de", "en-US", "en"], ["de-DE", "de"], ["fr-FR", "fr", "en-US", "en"],
    ["fr-FR", "fr"], ["es-ES", "es"], ["es-ES", "es", "en"], ["pt-BR", "pt", "en-US", "en"],
    ["ru-RU", "ru", "en-US", "en"], ["it-IT", "it"], ["nl-NL", "nl", "en"],
    ["pl-PL", "pl", "en-US", "en"], ["tr-TR", "tr", "en"], ["ja-JP", "ja"], ["ko-KR", "ko"],
    ["zh-CN", "zh", "en"], ["en-CA", "fr-CA", "en"], ["en-AU", "en"], ["sv-SE", "sv", "en"],
    ["id-ID", "id", "en"], ["cs-CZ", "cs", "en"], ["ro-RO", "ro", "en"],
]

TZ_BY_LANG = {
    "en-US": [300, 360, 420, 480], "en-CA": [300, 360, 420, 480], "en-GB": [0], "en-AU": [-600, -660],
    "de": [-60], "fr": [-60], "es": [-60, 300], "it": [-60], "nl": [-60], "pl": [-60],
    "cs": [-60], "ro": [-120], "sv": [-60], "tr": [-180], "ru": [-180], "pt-BR": [180, 240],
    "ja": [-540], "ko": [-540], "zh": [-480], "id": [-420],
}
TZ_FALLBACK = [0, -60, -120, 60, 120, 180, 240, 300, 360, 420, 480, -180, -240, -330, -480, -540]

def webgl_vendor_for(renderer: str) -> str:
    inner = renderer[len("ANGLE ("):].split(",", 1)[0] if renderer.startswith("ANGLE (") else "Google Inc."
    return f"Google Inc. ({inner})"

def mac_cores_for(renderer: str) -> int:
    for chip in sorted(MAC_CHIP_CORES, key=len, reverse=True):
        if f"Apple {chip}" in renderer or f": Apple {chip}," in renderer:
            return MAC_CHIP_CORES[chip]
    return 8

def timezone_for(languages: list, rng) -> int:
    primary = languages[0]
    for key in (primary, primary.split("-")[0]):
        if key in TZ_BY_LANG:
            return rng.choice(TZ_BY_LANG[key])
    return rng.choice(TZ_FALLBACK)
