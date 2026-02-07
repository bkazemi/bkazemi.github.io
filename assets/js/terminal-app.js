(() => {
  const appEl = document.getElementById("app");
  if (!appEl) {
    return;
  }

  const SCRIPT_SUFFIX = "/assets/js/terminal-app.js";

  const projects = {
    trop: {
      name: "trop",
      routePath: "/projects/trop",
      padCatOutput: true,
      separator: "────────────────────────────────────────────",
      headerLinks: [
        { label: "Project Page", url: "https://github.com/bkazemi/trop", external: true },
        {
          label: "Download",
          url: "https://github.com/bkazemi/trop/releases/latest",
          external: true,
        },
        { label: "Contact", url: "mailto:bkazemi@users.sf.net", external: false },
        { label: "View Manpage", url: "https://github.com/bkazemi/trop/blob/master/trop.1", external: true },
      ],
      description:
        "trop is a shell script designed to make interaction with transmission-remote easier.\n\n" +
        "It features options to get information about tr-remote torrents by seeding torrents or by a specific set of tracker URLs. This project aims to provide information from transmission-remote to the user in a clean way, and make doing common tasks more automatic, interchangeably through command-line or scripts.\n\n" +
        "The code is written to be as POSIX compliant as possible.",
    },
    gopoker: {
      name: "gopoker",
      routePath: "/projects/gopoker",
      padCatOutput: true,
      padAfterAscii: true,
      asciiArt:
        "                                             ▕██▋\n" +
        "                                             ▕██▋\n" +
        " ▃▅▆▆▆▆▅▖    ▃▅▆▆▝▆▅▃▁   ▕▆▇▇▇▇▆▄   ▗▆▇▇▇▆▅  ▕██▋ ▁▆▆▆▘ ▗▅▇▇▇▆▅▁   ▃▅▅▆▇▇▇\n" +
        "▟██▀▀▜██▍  ▄▀▜██████▛▔▅  ▕██▛▀▀██▙ ▗██▛▀▀██▉ ▕██▋▗██▛▘ ▕██▛▀▀██▉  ▕██▛▀▀▀▀\n" +
        "██▉  ▐██▍ ▟█▆██████████▙ ▕██▌  ▜██ ▐██▎  ▜██▏▕█████▛   ▐██▙▅▅▟██▏ ▕██▋\n" +
        "███  ▐██▍▕▛▜██████████▛▀▍▕██▌  ███ ▐██▎  ▟██▏▕██▛███▖  ▕██▛▀▀▀▀▀▏ ▕██▋\n" +
        "▝███▆▇██▍ ▆████████████▆▎▕██▙▄▅██▋ ▝███▄▅██▛ ▕██▋ ▜██▖  ▜██▅▄▄▄▖  ▕██▋\n" +
        "  ▀▀▀▜██▍ ▝█▀████████▛█▛ ▕████▛▀▘   ▔▀▀█▛▀▀  ▕▀▀▘  ▀▀▀▎  ▀▀▜██▀▘  ▕▀▀▘\n" +
        " ▂▂▃▅██▛   ▝▆████▜██▙▅▔  ▕██▌\n" +
        "▕████▀▀      ▔▀▀▀▝▀▀▔    ▕██▌",
      asciiArtMobile:
        "                   ▕█\n" +
        "▅▇▇▋ ▄▇▇▆▂ ▇▛▇▖▗▇▇▆▕█▗▇▘▅▇▇▖▕▆▇▀\n" +
        "█▎▐▋▐█████▍█▍▐▊▐▌▕█▕██▌ █▇▇▊▕█▏\n" +
        "▝▜█▋▐█████▌█▇█▘▝█▇▛▕█▝█▖▀▇▆▎▕█▏\n" +
        "▗▆█▘ ▝▜▜▛▘ █▍",
      description: "a poker game made in golang.",
      cta: { label: "try it here", url: "https://poker.shirkadeh.org", external: true },
    },
    shakar: {
      name: "shakar",
      routePath: "/projects/shakar",
      padCatOutput: true,
      padBeforeLinkBar: true,
      description:
        "A subjectful scripting language.\n\n" +
        "Shakar is a work-in-progress general-purpose scripting language. It targets boilerplate like repeated variable names, defensive null checks, and verbose read-transform-write cycles. Its core idea is subjectful flow, where the language tracks what you're operating on so you don't have to repeat it. Chains, guards, fan-outs, and apply-assign all share a single implicit-subject model that keeps code compact without hiding control flow.\n\n" +
        "The source of truth for the language is the design notes. It describes the grammar, implicit subject rules for ., and the rest of the semantics in detail.",
      linkBar: [
        { label: "Playground", url: "/shakar", external: false },
        {
          label: "Design Notes",
          url: "https://github.com/bkazemi/shakar/blob/master/docs/shakar-design-notes.md",
          external: true,
        },
        {
          label: "Grammar",
          url: "https://github.com/bkazemi/shakar/blob/master/grammar.ebnf",
          external: true,
        },
      ],
    },
  };

  const guiApps = {
    shakar: {
      title: "shakar playground",
      src: "/shakar",
    },
    gopoker: {
      title: "gopoker",
      src: "https://poker.shirkadeh.org",
    },
  };

  const aboutText =
    "Hi, I'm a programmer. This site hosts my personal projects.";

  const LAST_LOGIN_KEY = "bkazemi_terminal_last_login_ms";
  const host = window.location.hostname || "localhost";
  const hostSegment = host.split(".")[0] || "localhost";
  const titleDomain = host.toLowerCase();

  const state = {
    cwd: "/",
  };

  const MAX_HISTORY_ENTRIES = 200;
  let latestRenderToken = 0;
  let isAnimating = false;
  let isSyntheticSubmit = false;
  const commandHistory = [];
  let historyCursor = -1;
  let historyDraft = "";
  let lastTabInput = null;

  appEl.innerHTML = [
    '<main id="screen" class="screen" aria-label="Interactive terminal">',
    '  <section id="output" class="output" aria-live="polite"></section>',
    '  <form id="terminal-form" class="input-wrap" autocomplete="off">',
    '    <div class="input-row">',
    '      <label class="input-prompt" for="terminal-input" id="active-prompt"></label>',
    '      <textarea id="terminal-input" class="cmd-input" rows="1" wrap="soft" spellcheck="false" autofocus aria-label="Terminal command"></textarea>',
    "    </div>",
    "  </form>",
    "</main>",
    '<div id="gui-layer" class="gui-layer hidden">',
    '  <div class="gui-window">',
    '    <div class="gui-titlebar">',
    '      <span class="gui-titlebar-text" id="gui-titlebar-text"></span>',
    '      <button class="gui-close-btn" id="gui-close-btn">[X]</button>',
    "    </div>",
    '    <iframe class="gui-content" id="gui-content"></iframe>',
    "  </div>",
    "</div>",
  ].join("");

  const screenEl = document.getElementById("screen");
  const outputEl = document.getElementById("output");
  const formEl = document.getElementById("terminal-form");
  const inputEl = document.getElementById("terminal-input");
  const promptEl = document.getElementById("active-prompt");
  const guiLayerEl = document.getElementById("gui-layer");
  const guiTitleTextEl = document.getElementById("gui-titlebar-text");
  const guiCloseBtn = document.getElementById("gui-close-btn");
  const guiContentEl = document.getElementById("gui-content");

  function normalizePathname(pathname) {
    if (!pathname || pathname === "/") {
      return "/";
    }

    return pathname.replace(/\/+$/, "") || "/";
  }

  function normalizeBasePath(pathname) {
    const normalized = normalizePathname(pathname);
    return normalized === "/" ? "" : normalized;
  }

  function detectBasePath() {
    const scriptEl =
      document.currentScript ||
      Array.from(document.scripts).find((script) => script.src && script.src.includes(SCRIPT_SUFFIX));

    if (!scriptEl || !scriptEl.src) {
      return "";
    }

    try {
      const srcPath = normalizePathname(new URL(scriptEl.src, window.location.href).pathname);
      if (!srcPath.endsWith(SCRIPT_SUFFIX)) {
        return "";
      }

      const prefix = srcPath.slice(0, -SCRIPT_SUFFIX.length);
      return normalizeBasePath(prefix);
    } catch {
      return "";
    }
  }

  const appBasePath = detectBasePath();

  function toAppPath(routePath) {
    const normalizedRoute = normalizePathname(routePath);
    if (normalizedRoute === "/") {
      return appBasePath ? `${appBasePath}/` : "/";
    }

    return `${appBasePath}${normalizedRoute}`;
  }

  function stripBasePath(pathname) {
    const normalized = normalizePathname(pathname);
    if (!appBasePath) {
      return normalized;
    }

    if (normalized === appBasePath) {
      return "/";
    }

    if (normalized.startsWith(`${appBasePath}/`)) {
      const stripped = normalized.slice(appBasePath.length);
      return stripped || "/";
    }

    return normalized;
  }

  function inferProjectRoute(pathname) {
    const match = pathname.match(/\/projects\/([^/]+?)(?:\/index\.html)?$/);
    if (match) {
      return `/projects/${match[1]}`;
    }

    return null;
  }

  function inferRoutePath(pathname) {
    const normalized = normalizePathname(stripBasePath(pathname));

    if (
      normalized === "/" ||
      normalized === "/projects" ||
      normalized === "/about"
    ) {
      return normalized;
    }

    if (normalized === "/index.html") {
      return "/";
    }

    if (normalized === "/projects/index.html") {
      return "/projects";
    }

    if (normalized === "/about/index.html") {
      return "/about";
    }

    const projectRoute = inferProjectRoute(normalized);
    if (projectRoute) {
      return projectRoute;
    }

    if (normalized.endsWith("/projects/index.html") || normalized.endsWith("/projects")) {
      return "/projects";
    }

    if (normalized.endsWith("/about/index.html") || normalized.endsWith("/about")) {
      return "/about";
    }

    if (normalized.endsWith("/index.html")) {
      return "/";
    }

    return normalized;
  }

  function hasOwnEntry(map, key) {
    return Object.prototype.hasOwnProperty.call(map, key);
  }

  function titleForRoutePath(routePath) {
    let label = "404";

    if (routePath === "/") {
      label = "home";
    } else if (routePath === "/projects") {
      label = "projects";
    } else if (routePath === "/about") {
      label = "about";
    } else {
      const projectMatch = routePath.match(/^\/projects\/([^/]+)$/);
      if (projectMatch) {
        const slug = projectMatch[1];
        if (hasOwnEntry(projects, slug)) {
          label = projects[slug].name;
        }
      }

      const guiMatch = routePath.match(/^\/x\/([^/]+)$/);
      if (guiMatch) {
        const appKey = guiMatch[1];
        if (hasOwnEntry(guiApps, appKey)) {
          label = guiApps[appKey].title;
        }
      }
    }

    return `${label.toLowerCase()} - ${titleDomain}`;
  }

  function syncDocumentTitle(routePath) {
    document.title = titleForRoutePath(routePath);
  }

  function routePathToState(pathname, { includeGuiRoutes = true } = {}) {
    const routePath = inferRoutePath(pathname);
    if (routePath === "/") {
      return { routePath, cwd: "/" };
    }

    if (routePath === "/projects") {
      return { routePath, cwd: "/projects" };
    }

    if (routePath === "/about") {
      return { routePath, cwd: "/", rootFile: "about" };
    }

    const projectMatch = routePath.match(/^\/projects\/([^/]+)$/);
    if (projectMatch) {
      const slug = projectMatch[1];
      if (hasOwnEntry(projects, slug)) {
        return {
          routePath,
          cwd: "/projects",
          projectSlug: slug,
        };
      }
    }

    if (includeGuiRoutes) {
      const guiMatch = routePath.match(/^\/x\/([^/]+)$/);
      if (guiMatch && hasOwnEntry(guiApps, guiMatch[1])) {
        return { routePath, cwd: "/", guiApp: guiMatch[1] };
      }
    }

    return null;
  }

  function cwdToRoutePath(cwd) {
    return cwd === "/projects" ? "/projects" : "/";
  }

  function syncPromptWidth() {
    const promptWidth = promptEl.getBoundingClientRect().width;
    screenEl.style.setProperty("--prompt-width", `${promptWidth}px`);
  }

  function promptText() {
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const displayHost = mobile ? hostSegment[0] : hostSegment;
    return `bkazemi@${displayHost}:${state.cwd}$`;
  }

  function normalizeCdArg(arg) {
    if (!arg) {
      return "";
    }

    if (arg === "/") {
      return "/";
    }

    return arg.replace(/\/+$/, "");
  }

  function setPrompt() {
    promptEl.textContent = promptText();
    syncPromptWidth();
  }

  function resizeInput() {
    inputEl.style.height = "0px";
    const lineHeight = Number.parseFloat(window.getComputedStyle(inputEl).lineHeight) || 0;
    const nextHeight = Math.max(inputEl.scrollHeight, lineHeight);
    inputEl.style.height = `${nextHeight}px`;
    ensureInputVisible();
  }

  function syncPathForRoute(routePath, replace = false) {
    const normalizedRoutePath = inferRoutePath(routePath);
    syncDocumentTitle(normalizedRoutePath);

    const targetPath = normalizePathname(toAppPath(normalizedRoutePath));
    const currentPath = normalizePathname(window.location.pathname);
    if (targetPath === currentPath) {
      return;
    }

    const method = replace ? "replaceState" : "pushState";
    try {
      window.history[method]({}, "", targetPath);
    } catch {
      // Keep terminal flow working even if history APIs are restricted.
    }
  }

  function syncPathForCwd(replace = false) {
    syncPathForRoute(cwdToRoutePath(state.cwd), replace);
  }

  function syncPathForProject(slug, replace = false) {
    const project = hasOwnEntry(projects, slug) ? projects[slug] : null;
    if (!project) {
      return;
    }

    syncPathForRoute(project.routePath, replace);
  }

  function enterGuiMode(appKey, pushState = true) {
    const app = hasOwnEntry(guiApps, appKey) ? guiApps[appKey] : null;
    if (!app) {
      return;
    }

    guiTitleTextEl.textContent = app.title;
    guiContentEl.src = app.src;
    screenEl.style.display = "none";
    guiLayerEl.classList.remove("hidden");

    if (pushState) {
      syncPathForRoute(`/x/${appKey}`, false);
    }
  }

  async function exitGuiMode() {
    guiContentEl.src = "about:blank";

    const teardown = document.createElement("div");
    teardown.className = "gui-teardown";
    const line1 = document.createElement("p");
    line1.className = "line";
    line1.textContent = "xinit: connection to X server lost";
    const line2 = document.createElement("p");
    line2.className = "line";
    line2.textContent = "waiting for X server to shut down... done";
    teardown.appendChild(line1);
    teardown.appendChild(line2);
    guiLayerEl.appendChild(teardown);

    await delay(600);

    teardown.remove();
    guiLayerEl.classList.add("hidden");
    screenEl.style.display = "";

    appendLine("xinit: server terminated", "muted");
    syncPathForCwd(false);
    inputEl.focus();
    scrollToBottom();
  }

  function setCwd(nextCwd, syncPath = false) {
    state.cwd = nextCwd;
    setPrompt();

    if (syncPath) {
      syncPathForCwd(false);
    }
  }

  function scrollToBottom() {
    screenEl.scrollTop = screenEl.scrollHeight;
  }

  function ensureInputVisible() {
    const screenRect = screenEl.getBoundingClientRect();
    const formRect = formEl.getBoundingClientRect();
    const margin = 12;
    const isOutOfView =
      formRect.bottom > screenRect.bottom - margin || formRect.top < screenRect.top + margin;

    if (isOutOfView) {
      scrollToBottom();
    }
  }

  function appendLine(text, className = "") {
    const p = document.createElement("p");
    p.className = `line ${className}`.trim();
    p.textContent = text;
    outputEl.appendChild(p);
    scrollToBottom();
  }

  function appendHTMLLine(html, className = "") {
    const p = document.createElement("p");
    p.className = `line ${className}`.trim();
    p.innerHTML = html;
    outputEl.appendChild(p);
    scrollToBottom();
  }

  function appendBlankLine() {
    appendHTMLLine("&nbsp;");
  }

  function projectAsciiArt(project) {
    if (!project.asciiArt) {
      return "";
    }

    if (!project.asciiArtMobile) {
      return project.asciiArt;
    }

    return window.matchMedia("(max-width: 700px)").matches ? project.asciiArtMobile : project.asciiArt;
  }

  function appendCommand(command) {
    const row = document.createElement("div");
    row.className = "line command-row";
    row.innerHTML =
      `<span class="input-prompt">${escapeHtml(promptText())}</span>` +
      `<span class="cmd">${escapeHtml(command)}</span>`;
    outputEl.appendChild(row);
    scrollToBottom();
  }

  function appendEntryList(entries) {
    const row = document.createElement("div");
    row.className = "entry-list";

    entries.forEach((entry) => {
      if (entry.type === "project") {
        const a = document.createElement("a");
        a.className = "entry-link";
        a.href = entry.url;
        a.textContent = entry.label;
        a.dataset.action = "project";
        a.dataset.project = entry.slug;
        row.appendChild(a);
        return;
      }

      if (entry.type === "dir") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "entry-link";
        button.textContent = entry.label;
        button.dataset.action = "cd";
        button.dataset.path = entry.path;
        row.appendChild(button);
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "entry-link";
      button.textContent = entry.label;
      button.dataset.action = "cat";
      button.dataset.target = entry.target;
      if (entry.routePath) {
        button.dataset.route = entry.routePath;
      }
      row.appendChild(button);
    });

    outputEl.appendChild(row);
    scrollToBottom();
  }

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildAnchorHtml(url, label, external) {
    const attrs = external ? ' target="_blank" rel="noreferrer"' : "";
    return `<a class="entry-link" href="${escapeHtml(url)}"${attrs}>${escapeHtml(label)}</a>`;
  }

  function entriesForCwd(cwd) {
    if (cwd === "/projects") {
      return Object.values(projects).map((project) => ({
        type: "project",
        slug: project.name,
        label: project.name,
        url: toAppPath(project.routePath),
      }));
    }

    return [
      { type: "file", label: "about", target: "about", routePath: "/about" },
      { type: "dir", label: "projects/", path: "projects" },
    ];
  }

  function currentEntries() {
    return entriesForCwd(state.cwd);
  }

  function sortEntriesForLs(entries) {
    return entries
      .slice()
      .sort((a, b) => a.label.replace(/\/$/, "").localeCompare(b.label.replace(/\/$/, "")));
  }

  function resolveLsTarget(arg) {
    const normalizedArg = normalizeCdArg(arg);
    const strippedDotPath = normalizedArg.startsWith("./") ? normalizedArg.slice(2) : normalizedArg;

    if (!strippedDotPath || strippedDotPath === ".") {
      return { ok: true, type: "dir", cwd: state.cwd };
    }

    if (strippedDotPath === "~" || strippedDotPath === "/") {
      return { ok: true, type: "dir", cwd: "/" };
    }

    if (strippedDotPath === "..") {
      return { ok: true, type: "dir", cwd: "/" };
    }

    const absolutePath = strippedDotPath.startsWith("/")
      ? strippedDotPath
      : state.cwd === "/"
        ? `/${strippedDotPath}`
        : `${state.cwd}/${strippedDotPath}`;
    const normalizedPath = normalizePathname(absolutePath);

    if (normalizedPath === "/" || normalizedPath === "/projects") {
      return { ok: true, type: "dir", cwd: normalizedPath };
    }

    if (normalizedPath === "/about") {
      return { ok: true, type: "file", label: "about" };
    }

    const projectMatch = normalizedPath.match(/^\/projects\/([^/]+)$/);
    if (projectMatch && hasOwnEntry(projects, projectMatch[1])) {
      return { ok: true, type: "file", label: projectMatch[1] };
    }

    return { ok: false };
  }

  function doLs(arg = "") {
    const target = resolveLsTarget(arg);
    if (!target.ok) {
      appendLine(`ls: cannot access '${arg}': No such file or directory`, "error");
      return { ok: false };
    }

    if (target.type === "file") {
      appendLine(target.label);
      return { ok: true };
    }

    appendEntryList(sortEntriesForLs(entriesForCwd(target.cwd)));
    return { ok: true };
  }

  function doPwd() {
    appendLine(state.cwd);
    return { ok: true };
  }

  function doClear() {
    outputEl.textContent = "";
    return { ok: true };
  }

  function doCd(arg) {
    const normalizedArg = normalizeCdArg(arg);
    const strippedDotPath = normalizedArg.startsWith("./") ? normalizedArg.slice(2) : normalizedArg;

    if (!strippedDotPath || strippedDotPath === "~" || strippedDotPath === "/") {
      setCwd("/", true);
      return { ok: true };
    }

    if (strippedDotPath === ".") {
      return { ok: true };
    }

    if (strippedDotPath === "..") {
      setCwd("/", true);
      return { ok: true };
    }

    if (
      strippedDotPath === "projects" ||
      strippedDotPath === "/projects"
    ) {
      setCwd("/projects", true);
      return { ok: true };
    }

    if (strippedDotPath.startsWith("/")) {
      const routeState = routePathToState(strippedDotPath, { includeGuiRoutes: false });
      if (routeState && !routeState.projectSlug && !routeState.rootFile) {
        setCwd(routeState.cwd, true);
        return { ok: true };
      }
    }

    appendLine(`cd: no such file or directory: ${arg}`, "error");
    return { ok: false };
  }

  function resolveCatTarget(arg) {
    const normalizedArg = normalizeCdArg(arg);
    const strippedDotPath = normalizedArg.startsWith("./") ? normalizedArg.slice(2) : normalizedArg;

    if (!strippedDotPath || strippedDotPath === "." || strippedDotPath === "~" || strippedDotPath === "..") {
      return { ok: false, kind: "dir" };
    }

    const absolutePath = strippedDotPath.startsWith("/")
      ? strippedDotPath
      : state.cwd === "/"
        ? `/${strippedDotPath}`
        : `${state.cwd}/${strippedDotPath}`;
    const routePath = inferRoutePath(absolutePath);

    if (routePath === "/" || routePath === "/projects") {
      return { ok: false, kind: "dir" };
    }

    if (routePath === "/about") {
      return { ok: true, type: "about" };
    }

    const projectMatch = routePath.match(/^\/projects\/([^/]+)$/);
    if (projectMatch && hasOwnEntry(projects, projectMatch[1])) {
      return { ok: true, type: "project", slug: projectMatch[1] };
    }

    return { ok: false, kind: "missing" };
  }

  function doCat(arg) {
    if (!arg) {
      appendLine("cat: missing operand", "error");
      return { ok: false };
    }

    const target = resolveCatTarget(arg);
    if (!target.ok) {
      if (target.kind === "dir") {
        appendLine(`cat: ${arg}: Is a directory`, "error");
      } else {
        appendLine(`cat: ${arg}: No such file`, "error");
      }
      return { ok: false };
    }

    if (target.type === "about") {
      appendLine(aboutText);
      appendBlankLine();
      appendHTMLLine(
        `GitHub: ${buildAnchorHtml("https://github.com/bkazemi", "github.com/bkazemi", true)}`
      );
      appendHTMLLine(
        "Email: b &lt;at&gt; kazemi.io"
      );
      return { ok: true };
    }

    if (target.type === "project") {
      const project = projects[target.slug];

      if (project.padCatOutput) {
        appendBlankLine();
      }

      if (project.headerLinks && project.headerLinks.length > 0) {
        const linksHtml = project.headerLinks
          .map((link) => buildAnchorHtml(link.url, link.label, link.external))
          .join("  ");
        appendHTMLLine(linksHtml);
      }

      if (project.separator) {
        appendLine(project.separator, "muted separator-line");
      }

      const asciiArt = projectAsciiArt(project);
      if (asciiArt) {
        appendLine(asciiArt);
        if (project.padAfterAscii) {
          appendBlankLine();
        }
      }

      const paragraphs = project.description.split("\n\n");
      for (const para of paragraphs) {
        appendLine(para, "desc-para");
      }

      if (project.cta) {
        appendHTMLLine(
          `${escapeHtml(project.cta.label)}: ${buildAnchorHtml(project.cta.url, project.cta.url, project.cta.external)}`
        );
      }

      if (project.linkBar && project.linkBar.length > 0) {
        if (project.padBeforeLinkBar) {
          appendBlankLine();
        }

        const linkBarHtml = project.linkBar
          .map((link) => buildAnchorHtml(link.url, link.label, link.external))
          .join(" | ");
        appendHTMLLine(linkBarHtml);
      }

      if (project.padCatOutput) {
        appendBlankLine();
      }

      return { ok: true };
    }

    appendLine(`cat: ${arg}: No such file`, "error");
    return { ok: false };
  }

  function doXdgOpen(arg, commandName = "xdg-open") {
    if (!arg) {
      appendLine(`${commandName}: missing operand`, "error");
      return { ok: false };
    }

    if (hasOwnEntry(guiApps, arg)) {
      return doStartx(arg);
    }

    const project = hasOwnEntry(projects, arg) ? projects[arg] : null;
    if (!project) {
      appendLine(`${commandName}: ${arg}: not found`, "error");
      return { ok: false };
    }

    simulateProjectClick(arg);
    return { ok: true };
  }

  function doHistory(arg = "") {
    const trimmedArg = arg.trim();
    const visibleHistory = commandHistory.filter((entry) => {
      const [name] = entry.split(/\s+/);
      return name !== "history";
    });
    let count = visibleHistory.length;

    if (trimmedArg) {
      if (!/^\d+$/.test(trimmedArg)) {
        appendLine("history: usage: history [n]", "error");
        return { ok: false };
      }

      count = Number.parseInt(trimmedArg, 10);
    }

    if (!visibleHistory.length || count <= 0) {
      return { ok: true };
    }

    const startIndex = Math.max(visibleHistory.length - count, 0);
    for (let i = startIndex; i < visibleHistory.length; i++) {
      const displayIndex = i + 1;
      appendLine(`${displayIndex}  ${visibleHistory[i]}`);
    }

    return { ok: true };
  }

  function doStartx(arg) {
    if (!arg) {
      appendLine("startx: no .xinitrc found; specify an app (e.g. startx shakar)", "error");
      appendLine("available apps: " + Object.keys(guiApps).join(", "), "muted");
      return { ok: false };
    }

    if (!hasOwnEntry(guiApps, arg)) {
      appendLine(`startx: unknown app '${arg}'`, "error");
      appendLine("available apps: " + Object.keys(guiApps).join(", "), "muted");
      return { ok: false };
    }

    appendLine("xinit: starting X server", "muted");
    isAnimating = true;
    window.setTimeout(() => {
      isAnimating = false;
      enterGuiMode(arg);
    }, 500);

    return { ok: true, stopChain: true };
  }

  function doHelp() {
    appendLine("Available commands:", "muted");
    appendLine("help | ?");
    appendLine("ls [path]");
    appendLine("pwd");
    appendLine("cd .. | cd ~ | cd / | cd projects | cd /projects");
    appendLine("cat <path>");
    appendLine("xdg-open <project>");
    appendLine("startx <app>");
    appendLine("history [n]");
    appendLine("home");
    appendLine("clear");
    appendLine("Use && to chain commands (example: cd /projects && ls)", "muted");
    return { ok: true };
  }

  function runSingle(rawCommand) {
    const trimmed = rawCommand.trim();
    if (!trimmed) {
      return { ok: true };
    }

    const [name, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ");

    if (name === "ls") {
      return doLs(arg);
    }

    if (name === "pwd") {
      return doPwd();
    }

    if (name === "clear") {
      return doClear();
    }

    if (name === "cd") {
      return doCd(arg);
    }

    if (name === "cat") {
      return doCat(arg);
    }

    if (name === "startx") {
      return doStartx(arg);
    }

    if (name === "xdg-open" || name === "open") {
      return doXdgOpen(arg, name);
    }

    if (name === "history") {
      return doHistory(arg);
    }

    if (name === "home") {
      doClear();
      setCwd("/", true);
      return doLs();
    }

    if (name === "help" || name === "?") {
      return doHelp();
    }

    appendLine(`${name}: command not found`, "error");
    return { ok: false };
  }

  function runCommandLine(commandLine) {
    const parts = commandLine
      .split("&&")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 3);

    for (const part of parts) {
      const result = runSingle(part);
      if (result.stopChain) {
        return;
      }
      if (!result.ok) {
        return;
      }
    }
  }

  function resetHistoryNavigation() {
    historyCursor = -1;
    historyDraft = "";
  }

  function recordHistory(command) {
    if (!command) {
      return;
    }

    if (commandHistory[commandHistory.length - 1] === command) {
      return;
    }

    commandHistory.push(command);
    if (commandHistory.length > MAX_HISTORY_ENTRIES) {
      commandHistory.splice(0, commandHistory.length - MAX_HISTORY_ENTRIES);
    }
  }

  function setInputValue(value) {
    inputEl.value = value;
    resizeInput();
    inputEl.setSelectionRange(value.length, value.length);
  }

  const COMPLETABLE_COMMANDS = [
    "cat", "cd", "clear", "help", "history", "home", "ls", "open", "pwd", "startx", "xdg-open",
  ];

  function longestCommonPrefix(strings) {
    if (!strings.length) {
      return "";
    }

    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (!strings[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
    }

    return prefix;
  }

  function resolveCompletionDir(partialArg) {
    if (!partialArg) {
      return { dir: state.cwd, namePrefix: "", pathPrefix: "" };
    }

    const lastSlash = partialArg.lastIndexOf("/");
    if (lastSlash === -1) {
      return { dir: state.cwd, namePrefix: partialArg, pathPrefix: "" };
    }

    const dirPart = partialArg.slice(0, lastSlash + 1);
    const namePrefix = partialArg.slice(lastSlash + 1);
    const cleaned = dirPart.replace(/\/+$/, "") || "/";

    let resolvedDir;
    if (cleaned === "/" || cleaned === "~") {
      resolvedDir = "/";
    } else if (cleaned === "/projects") {
      resolvedDir = "/projects";
    } else if (cleaned === "projects" || cleaned === "./projects") {
      resolvedDir = state.cwd === "/" ? "/projects" : null;
    } else if (cleaned === "." || cleaned === "./" || cleaned === "") {
      resolvedDir = state.cwd;
    } else {
      return null;
    }

    if (!resolvedDir) {
      return null;
    }

    const normalizedPrefix = cleaned === "~" ? "/" : dirPart;
    return { dir: resolvedDir, namePrefix, pathPrefix: normalizedPrefix };
  }

  function entryCompletionName(entry) {
    if (entry.type === "dir") {
      return entry.label.replace(/\/$/, "");
    }

    return entry.slug || entry.label;
  }

  function getPathCompletions(command, partialArg) {
    const ctx = resolveCompletionDir(partialArg);
    if (!ctx) {
      return [];
    }

    const entries = entriesForCwd(ctx.dir);

    let filtered;
    if (command === "cd") {
      filtered = entries.filter((e) => e.type === "dir");
    } else if (command === "cat") {
      filtered = entries.filter((e) => e.type === "file" || e.type === "project");
    } else {
      filtered = entries;
    }

    return filtered
      .filter((e) => entryCompletionName(e).startsWith(ctx.namePrefix))
      .map((e) => {
        const name = entryCompletionName(e);
        const suffix = e.type === "dir" ? "/" : "";
        return {
          completion: ctx.pathPrefix + name + suffix,
          display: name + suffix,
        };
      });
  }

  function getTabCompletions(input) {
    const lastAmpIdx = input.lastIndexOf("&&");
    let chainPrefix = "";
    let subCmd = input;
    if (lastAmpIdx !== -1) {
      chainPrefix = input.slice(0, lastAmpIdx + 2);
      subCmd = input.slice(lastAmpIdx + 2);
    }

    const leadingWs = subCmd.match(/^\s*/)[0];
    const trimmed = subCmd.trimStart();
    const spaceIdx = trimmed.indexOf(" ");

    if (spaceIdx === -1) {
      const partial = trimmed;
      const matches = COMPLETABLE_COMMANDS.filter((c) => c.startsWith(partial));
      return {
        type: "command",
        candidates: matches.map((m) => chainPrefix + leadingWs + m),
        displayCandidates: matches,
      };
    }

    const cmdName = trimmed.slice(0, spaceIdx);
    const afterCmd = trimmed.slice(spaceIdx);
    const arg = afterCmd.trimStart();
    const argWs = afterCmd.slice(0, afterCmd.length - arg.length);

    let entries;
    if (cmdName === "xdg-open" || cmdName === "open") {
      const projectNames = Object.keys(projects);
      entries = projectNames
        .filter((p) => p.startsWith(arg))
        .map((p) => ({ completion: p, display: p }));
    } else if (cmdName === "startx") {
      const appNames = Object.keys(guiApps);
      entries = appNames
        .filter((a) => a.startsWith(arg))
        .map((a) => ({ completion: a, display: a }));
    } else if (cmdName === "cd" || cmdName === "ls" || cmdName === "cat") {
      entries = getPathCompletions(cmdName, arg);
    } else {
      entries = [];
    }

    return {
      type: "argument",
      candidates: entries.map((e) => chainPrefix + leadingWs + cmdName + argWs + e.completion),
      displayCandidates: entries.map((e) => e.display),
    };
  }

  function handleTabCompletion() {
    const currentInput = inputEl.value;
    const isDoubleTab = lastTabInput === currentInput;

    const result = getTabCompletions(currentInput);

    if (!result.candidates.length) {
      lastTabInput = currentInput;
      return;
    }

    if (result.candidates.length === 1) {
      let completed = result.candidates[0];
      if (result.type === "command" || !completed.endsWith("/")) {
        completed += " ";
      }
      setInputValue(completed);
      lastTabInput = null;
      return;
    }

    const commonPrefix = longestCommonPrefix(result.candidates);

    if (commonPrefix !== currentInput) {
      setInputValue(commonPrefix);
      lastTabInput = commonPrefix;
      return;
    }

    if (isDoubleTab) {
      appendCommand(currentInput);
      appendLine(result.displayCandidates.join("  "));
      lastTabInput = null;
    } else {
      lastTabInput = currentInput;
    }
  }

  function historyEntryForCursor(cursor) {
    if (cursor < 0 || cursor >= commandHistory.length) {
      return "";
    }

    return commandHistory[commandHistory.length - 1 - cursor];
  }

  function navigateHistoryUp() {
    if (!commandHistory.length) {
      return false;
    }

    if (historyCursor === -1) {
      historyDraft = inputEl.value;
    }

    if (historyCursor >= commandHistory.length - 1) {
      return true;
    }

    historyCursor++;
    setInputValue(historyEntryForCursor(historyCursor));
    return true;
  }

  function navigateHistoryDown() {
    if (!commandHistory.length || historyCursor === -1) {
      return false;
    }

    if (historyCursor === 0) {
      const draft = historyDraft;
      resetHistoryNavigation();
      setInputValue(draft);
      return true;
    }

    historyCursor--;
    setInputValue(historyEntryForCursor(historyCursor));
    return true;
  }

  function submitTerminalForm({ synthetic = false } = {}) {
    if (synthetic) {
      isSyntheticSubmit = true;
    }

    try {
      if (typeof formEl.requestSubmit === "function") {
        formEl.requestSubmit();
        return;
      }

      formEl.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    } finally {
      if (synthetic) {
        isSyntheticSubmit = false;
      }
    }
  }

  function delay(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  function typingDelayMs(char = "") {
    const roll = Math.random();

    // Most keystrokes stay near the existing speed.
    if (roll < 0.78) {
      return 44 + Math.floor(Math.random() * 56);
    }

    // Short burst: occasional quick taps.
    if (roll < 0.91) {
      return 28 + Math.floor(Math.random() * 26);
    }

    // Hesitation: occasional longer pauses.
    const extraPause = char === " " ? 26 : 0;
    return 95 + extraPause + Math.floor(Math.random() * 105);
  }

  function initialTypingDelayMs() {
    return 340 + Math.floor(Math.random() * 340);
  }

  function beforeEnterDelayMs() {
    const base = 120 + Math.floor(Math.random() * 160);
    const hesitation = Math.random() < 0.3 ? 80 + Math.floor(Math.random() * 130) : 0;
    return base + hesitation;
  }

  async function simulateTypeOnly(command, renderToken) {
    inputEl.value = "";
    resizeInput();
    inputEl.focus();
    await delay(initialTypingDelayMs());

    for (const char of command) {
      if (renderToken !== latestRenderToken) {
        return;
      }

      inputEl.value += char;
      resizeInput();
      await delay(typingDelayMs(char));
    }
  }

  async function simulateTypeAndEnter(command, renderToken) {
    isAnimating = true;
    try {
      await simulateTypeOnly(command, renderToken);
      if (renderToken !== latestRenderToken) {
        return;
      }

      await delay(beforeEnterDelayMs());
      isAnimating = false;
      submitTerminalForm({ synthetic: true });
    } finally {
      isAnimating = false;
    }
  }

  function routeCommandForState(routeState) {
    if (routeState.projectSlug) {
      return `cat ${routeState.projectSlug}`;
    }

    if (routeState.rootFile) {
      return `cat ${routeState.rootFile}`;
    }

    return "ls";
  }

  function appendNotFoundOutput(pathname) {
    appendCommand(`file ${pathname}`);
    appendLine(`file: cannot open '${pathname}' (No such file or directory)`, "error");
    appendLine("404 not found", "error");
  }

  function setNotFoundRecoveryCommand() {
    inputEl.value = "clear && cd / && ls";
    resizeInput();
  }

  async function simulateNotFoundSequence(pathname, renderToken) {
    isAnimating = true;
    try {
      await simulateTypeOnly(`file ${pathname}`, renderToken);
      if (renderToken !== latestRenderToken) {
        return;
      }

      await delay(beforeEnterDelayMs());
      if (renderToken !== latestRenderToken) {
        return;
      }

      appendNotFoundOutput(pathname);
      await simulateTypeOnly("clear && cd / && ls", renderToken);
    } finally {
      isAnimating = false;
    }
  }

  function simulateProjectClick(slug) {
    const project = hasOwnEntry(projects, slug) ? projects[slug] : null;
    if (!project) {
      return;
    }

    setCwd("/projects", false);
    syncPathForProject(slug, false);
    doClear();
    appendCommand(`clear && cat ${slug}`);
    runSingle(`cat ${slug}`);
  }

  function simulateRootFileClick(target, routePath = "") {
    if (!target) {
      return;
    }

    if (routePath) {
      syncPathForRoute(routePath, false);
    }

    doClear();
    appendCommand(`clear && cat ${target}`);
    runSingle(`cat ${target}`);
  }

  function runDirectoryClick(path) {
    const normalizedPath = normalizeCdArg(path) || ".";
    const renderedPath = normalizedPath === "/" ? "/" : `${normalizedPath}/`;
    const command = `cd ${renderedPath} && ls`;
    appendCommand(command);
    const cdResult = runSingle(`cd ${renderedPath}`);
    if (cdResult.ok) {
      runSingle("ls");
    }
  }

  function buildLastLogin(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short",
    }).formatToParts(date);

    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.weekday} ${values.month} ${values.day} ${values.hour}:${values.minute}:${values.second} ${values.timeZoneName}`;
  }

  function readLastLoginMs() {
    try {
      const raw = window.localStorage.getItem(LAST_LOGIN_KEY);
      if (!raw) {
        return null;
      }

      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  function writeLastLoginMs(value) {
    try {
      window.localStorage.setItem(LAST_LOGIN_KEY, String(value));
    } catch {
      // Ignore storage failures (private mode / blocked storage).
    }
  }

  function bootSession() {
    const nowMs = Date.now();
    const previousLoginMs = readLastLoginMs();

    appendLine("The programs included with this site are free software.", "muted");
    appendLine(`Welcome to ${host} (GNU/Linux 6.18.8 x86_64)`, "muted");

    if (previousLoginMs) {
      appendLine(`Last login: ${buildLastLogin(new Date(previousLoginMs))} from this browser`, "muted");
    } else {
      appendLine("Last login: first session from this browser", "muted");
    }

    appendLine("Type 'help' for available commands.", "muted");
    appendBlankLine();

    writeLastLoginMs(nowMs);
  }

  function renderNotFound(pathname) {
    appendNotFoundOutput(pathname);
    setNotFoundRecoveryCommand();
  }

  function renderRoute(pathname, withBoot = false) {
    latestRenderToken++;
    const renderToken = latestRenderToken;
    const normalized = inferRoutePath(pathname);
    syncDocumentTitle(normalized);
    const routeState = routePathToState(pathname);

    if (routeState && routeState.guiApp) {
      enterGuiMode(routeState.guiApp, false);
      return;
    }

    // Restore terminal mode if returning from GUI (e.g. browser back)
    if (!guiLayerEl.classList.contains("hidden")) {
      guiContentEl.src = "about:blank";
      guiLayerEl.classList.add("hidden");
      screenEl.style.display = "";
    }

    doClear();
    if (withBoot) {
      bootSession();
    }

    if (!routeState) {
      setCwd("/", false);
      if (withBoot) {
        simulateNotFoundSequence(normalized, renderToken);
      } else {
        renderNotFound(normalized);
        inputEl.focus();
      }
      return;
    }

    setCwd(routeState.cwd, false);
    const routeCommand = routeCommandForState(routeState);
    if (withBoot) {
      simulateTypeAndEnter(routeCommand, renderToken);
    } else {
      appendCommand(routeCommand);
      runSingle(routeCommand);
      inputEl.focus();
    }
  }

  outputEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList.contains("entry-link")) {
      return;
    }

    const action = target.dataset.action;
    if (!action) {
      return;
    }

    event.preventDefault();

    if (action === "project") {
      simulateProjectClick(target.dataset.project);
    } else if (action === "cat") {
      simulateRootFileClick(target.dataset.target, target.dataset.route || "");
    } else if (action === "cd") {
      runDirectoryClick(target.dataset.path || "");
    }

    setPrompt();
    inputEl.focus();
  });

  guiCloseBtn.addEventListener("click", () => {
    exitGuiMode();
  });

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isAnimating) {
      return;
    }
    const command = inputEl.value.trim();
    if (!isSyntheticSubmit) {
      recordHistory(command);
    }
    resetHistoryNavigation();
    lastTabInput = null;
    appendCommand(command);
    runCommandLine(command);
    inputEl.value = "";
    setPrompt();
    resizeInput();
    inputEl.focus();
  });

  inputEl.addEventListener("input", (event) => {
    if (isAnimating) {
      event.target.value = "";
      return;
    }
    resetHistoryNavigation();
    lastTabInput = null;
    resizeInput();
  });

  inputEl.addEventListener("keydown", (event) => {
    const hasModifier = event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
    const isArrowUp = event.key === "ArrowUp";
    const isArrowDown = event.key === "ArrowDown";

    if (!hasModifier && (isArrowUp || isArrowDown)) {
      if (isAnimating) {
        return;
      }

      const didNavigate = isArrowUp ? navigateHistoryUp() : navigateHistoryDown();
      if (didNavigate) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === "Tab" && !hasModifier) {
      event.preventDefault();
      if (!isAnimating) {
        handleTabCompletion();
      }
      return;
    }

    if (event.key !== "Enter" || hasModifier) {
      return;
    }

    event.preventDefault();
    submitTerminalForm();
  });

  screenEl.addEventListener("click", (event) => {
    const selection = window.getSelection();
    if (selection && selection.type === "Range" && selection.toString().length > 0) {
      return;
    }

    const target = event.target;
    if (target instanceof HTMLElement && target.closest("a,button,input,textarea,label")) {
      return;
    }

    inputEl.focus();
  });

  window.addEventListener("popstate", () => {
    renderRoute(window.location.pathname, false);
  });

  window.addEventListener("resize", () => {
    setPrompt();
    resizeInput();
  });

  const strippedPath = normalizePathname(stripBasePath(window.location.pathname));
  const inferredPath = inferRoutePath(window.location.pathname);
  if (strippedPath !== inferredPath) {
    syncPathForRoute(inferredPath, true);
  }

  setPrompt();
  resizeInput();
  renderRoute(window.location.pathname, true);
})();
