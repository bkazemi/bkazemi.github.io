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

  const aboutText =
    "Hi, I'm a programmer. This site hosts my personal projects.";

  const LAST_LOGIN_KEY = "bkazemi_terminal_last_login_ms";
  const host = window.location.hostname || "localhost";
  const hostSegment = host.split(".")[0] || "localhost";

  const state = {
    cwd: "/",
  };

  let latestRenderToken = 0;
  let isAnimating = false;

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
  ].join("");

  const screenEl = document.getElementById("screen");
  const outputEl = document.getElementById("output");
  const formEl = document.getElementById("terminal-form");
  const inputEl = document.getElementById("terminal-input");
  const promptEl = document.getElementById("active-prompt");

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

  function routePathToState(pathname) {
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
      if (projects[slug]) {
        return {
          routePath,
          cwd: "/projects",
          projectSlug: slug,
        };
      }
    }

    return null;
  }

  function cwdToRoutePath(cwd) {
    return cwd === "/projects" ? "/projects" : "/";
  }

  function syncPromptWidth() {
    const promptWidth = Math.ceil(promptEl.getBoundingClientRect().width);
    formEl.style.setProperty("--prompt-width", `${promptWidth}px`);
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
    const targetPath = normalizePathname(toAppPath(routePath));
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
    const project = projects[slug];
    if (!project) {
      return;
    }

    syncPathForRoute(project.routePath, replace);
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
      `<span class="cmd"> ${escapeHtml(command)}</span>`;
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
    if (projectMatch && projects[projectMatch[1]]) {
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
      const routeState = routePathToState(strippedDotPath);
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
    if (projectMatch && projects[projectMatch[1]]) {
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

    const project = projects[arg];
    if (!project) {
      appendLine(`${commandName}: ${arg}: not found`, "error");
      return { ok: false };
    }

    simulateProjectClick(arg);
    return { ok: true };
  }

  function doHelp() {
    appendLine("Available commands:", "muted");
    appendLine("help | ?");
    appendLine("ls [path]");
    appendLine("pwd");
    appendLine("cd .. | cd ~ | cd / | cd projects | cd /projects");
    appendLine("cat <path>");
    appendLine("xdg-open <project>");
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

    if (name === "xdg-open" || name === "open") {
      return doXdgOpen(arg, name);
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
      if (!result.ok) {
        return;
      }
    }
  }

  function submitTerminalForm() {
    if (typeof formEl.requestSubmit === "function") {
      formEl.requestSubmit();
      return;
    }

    formEl.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
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
      submitTerminalForm();
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
    const project = projects[slug];
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
    latestRenderToken += 1;
    const renderToken = latestRenderToken;
    const normalized = inferRoutePath(pathname);
    const routeState = routePathToState(pathname);

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

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isAnimating) {
      return;
    }
    const command = inputEl.value.trim();
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
    resizeInput();
  });

  inputEl.addEventListener("keydown", (event) => {
    const isPlainEnter =
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey;

    if (!isPlainEnter) {
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
