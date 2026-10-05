#!/usr/bin/env python3
"""Update the browser pin from npm's latest tag, after verifying its bytes."""

import base64
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parent.parent
EMBED = ROOT / "assets/js/verily-embed.js"
REGISTRY = "https://registry.npmjs.org/@bkazemi%2fverily/latest"
CDN = "https://cdn.jsdelivr.net/npm/@bkazemi/verily@{}/dist/verily.js"
VERSION = r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)"
PIN = re.compile(
    r'^const ASSET_URL = "https://cdn\.jsdelivr\.net/npm/@bkazemi/verily@'
    r'([^/]+)/dist/verily\.js";$', re.MULTILINE
)
INTEGRITY = re.compile(r'^const ASSET_INTEGRITY = "[^"]+";$', re.MULTILINE)


def fetch(url):
    with urlopen(url, timeout=60) as response:
        return response.read()


def sri(data, algorithm):
    digest = hashlib.new(algorithm, data).digest()
    return algorithm + "-" + base64.b64encode(digest).decode("ascii")


def version_tuple(version):
    if not isinstance(version, str) or not re.fullmatch(VERSION, version):
        raise ValueError(f"Expected a stable npm version, got {version!r}")
    return tuple(map(int, version.split(".")))


def update(path=EMBED):
    source = path.read_text()
    pins = PIN.findall(source)
    if len(pins) != 1 or len(INTEGRITY.findall(source)) != 1:
        raise ValueError("Expected exactly one Verily URL and integrity pin")
    current = pins[0]
    metadata = json.loads(fetch(REGISTRY))
    if metadata["name"] != "@bkazemi/verily":
        raise ValueError("Unexpected npm package")
    version = metadata["version"]
    if version_tuple(version) < version_tuple(current):
        raise ValueError(f"Refusing to downgrade Verily from {current} to {version}")
    if version == current:
        print(f"Verily is already at {version}")
        return False

    tarball_url = f"https://registry.npmjs.org/@bkazemi/verily/-/verily-{version}.tgz"
    archive_bytes = fetch(tarball_url)
    if sri(archive_bytes, "sha512") != metadata["dist"]["integrity"]:
        raise ValueError("npm package checksum mismatch")
    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:gz") as archive:
        member = archive.getmember("package/dist/verily.js")
        if not member.isfile():
            raise ValueError("Browser script is not a regular file")
        packaged = archive.extractfile(member).read()

    url = CDN.format(version)
    browser = fetch(url)
    if not browser or browser != packaged:
        raise ValueError("CDN script does not match the npm release")
    # Parse the script without executing package code or installing dependencies.
    with tempfile.TemporaryDirectory() as directory:
        script = Path(directory) / "verily.js"
        script.write_bytes(browser)
        subprocess.run(["node", "--check", str(script)], check=True)

    updated = PIN.sub(f'const ASSET_URL = "{url}";', source)
    updated = INTEGRITY.sub(
        f'const ASSET_INTEGRITY = "{sri(browser, "sha384")}";', updated
    )
    path.write_text(updated)
    print(f"Updated Verily from {current} to {version}")
    return True


if __name__ == "__main__":
    update()
