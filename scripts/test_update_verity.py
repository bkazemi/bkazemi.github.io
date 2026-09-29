"""Exercise updates and ensure failed validation never changes the pin."""

import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tarfile
import tempfile
import unittest
from unittest.mock import patch


spec = importlib.util.spec_from_file_location(
    "update_verity", Path(__file__).with_name("update-verity.py")
)
updater = importlib.util.module_from_spec(spec)
spec.loader.exec_module(updater)


class UpdateVerityTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.path = Path(directory.name) / "embed.js"
        self.original = (
            f'const ASSET_URL = "{updater.CDN.format("0.0.4")}";\n'
            'const ASSET_INTEGRITY = "sha384-old";\n'
            '// Keep the rest of the embed unchanged.\n'
        )
        self.path.write_text(self.original)
        self.browser = b'customElements.define("verity-badge", class extends HTMLElement {});'
        buffer = io.BytesIO()
        with tarfile.open(fileobj=buffer, mode="w:gz") as archive:
            member = tarfile.TarInfo("package/dist/verity.js")
            member.size = len(self.browser)
            archive.addfile(member, io.BytesIO(self.browser))
        self.archive = buffer.getvalue()
        self.metadata = {
            "name": "@bkazemi/verity",
            "version": "0.0.5",
            "dist": {"integrity": updater.sri(self.archive, "sha512")},
        }

    def run_update(self, archive=None, browser=None):
        responses = [
            json.dumps(self.metadata).encode(),
            self.archive if archive is None else archive,
            self.browser if browser is None else browser,
        ]
        with patch.object(updater, "fetch", side_effect=responses):
            return updater.update(self.path)

    def test_update_and_second_run_noop(self):
        self.assertTrue(self.run_update())
        updated = self.path.read_text()
        self.assertEqual(
            updated,
            self.original.replace("@0.0.4/", "@0.0.5/").replace(
                "sha384-old", updater.sri(self.browser, "sha384")
            ),
        )
        self.assertFalse(self.run_update())
        self.assertEqual(self.path.read_text(), updated)

    def test_rejects_corrupt_archive(self):
        with self.assertRaisesRegex(ValueError, "checksum mismatch"):
            self.run_update(archive=b"corrupted archive")
        self.assertEqual(self.path.read_text(), self.original)

    def test_rejects_cdn_mismatch(self):
        with self.assertRaisesRegex(ValueError, "does not match"):
            self.run_update(browser=b"different script")
        self.assertEqual(self.path.read_text(), self.original)

    def test_rejects_invalid_javascript(self):
        with patch.object(updater.subprocess, "run", side_effect=subprocess.CalledProcessError(1, "node")):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_update()
        self.assertEqual(self.path.read_text(), self.original)

    def test_rejects_downgrades_and_unexpected_versions(self):
        for version in ["0.0.3", "0.0.5-beta.1", "bad\nversion"]:
            with self.subTest(version=version):
                self.metadata["version"] = version
                with self.assertRaises(ValueError):
                    self.run_update()
                self.assertEqual(self.path.read_text(), self.original)

    def test_rejects_missing_integrity_pin(self):
        self.path.write_text(self.original.replace("ASSET_INTEGRITY", "OTHER"))
        before = self.path.read_text()
        with self.assertRaisesRegex(ValueError, "exactly one"):
            updater.update(self.path)
        self.assertEqual(self.path.read_text(), before)


if __name__ == "__main__":
    unittest.main()
