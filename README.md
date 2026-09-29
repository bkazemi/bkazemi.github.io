# Personal site

This is a static site served by GitHub Pages. Terminal behavior and project
content live in `assets/js/terminal-app.js`.

## Terminal pages

Edit `templates/terminal.html` to change the shared page shell, then run:

```sh
python3 scripts/generate-pages.py
```

Commit the generated HTML alongside the template changes so GitHub Pages can
serve it directly without a build step. To add a project, update the `projects`
object in the terminal script and the `PAGES` mapping in the generator.

Check that generated pages are current with:

```sh
python3 scripts/generate-pages.py --check
```

The legacy redirects in `sw/` and the standalone Shakar playground are maintained
separately.

## Verity pill

The Verity project page loads the published `@bkazemi/verity` browser script from
jsDelivr, pinned to a version and checked by its integrity hash (both set at the top
of `assets/js/verity-embed.js`). It reads the backend address from
`assets/verity-config.json` and shows one pill for each public connection the
backend lists at `/published`, so adding or revoking a connection needs no change
here. Keep all owner and OAuth credentials on the backend.

The `Update Verity` GitHub Actions workflow checks npm's `latest` tag daily at
10:23 UTC, or on demand from the Actions tab. It verifies the npm archive checksum,
compares the CDN script with the packaged script, checks JavaScript syntax, and
commits the new version and integrity hash together. It follows stable releases,
including major versions, and refuses downgrades. Failed validation leaves the pin
unchanged. A new release may have to wait for the next run if the CDN is not ready.

The workflow uses the built-in `GITHUB_TOKEN` with `contents: write` and
`pages: write`; no additional secrets are needed. The default branch must allow
the bot to push. It explicitly requests a branch-based Pages build because bot
commits do not trigger one, and retries a missing or failed build on the next run.
The schedule takes effect once the workflow is pushed to the default branch.

To update locally (Python 3 and Node.js required):

```sh
python3 scripts/update-verity.py
```
