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
