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

The Verity project page loads the distributed browser asset from `assets/verity.js`
and reads its public connection IDs from `assets/verity-config.json`. Each ID in
`connectionIds` renders one pill, whatever its provider. Create or renew a public
connection on the verifier's owner page, then add or replace that ID and publish
the site. Keep all owner and OAuth credentials on the backend.
An empty `connectionIds` list hides the embed until the first connection is ready.
Copy a fresh `dist/verity.js` from the Verity build when upgrading the component.
