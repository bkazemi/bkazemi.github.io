"use strict";
var Verity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key2 of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/browser.ts
  var browser_exports = {};
  __export(browser_exports, {
    attestationLabel: () => attestationLabel,
    externalName: () => externalName,
    freshnessMs: () => freshnessMs,
    init: () => init,
    isArtifactProvider: () => isArtifactProvider,
    localSide: () => localSide,
    status: () => status,
    statusLabel: () => statusLabel
  });

  // src/core/index.ts
  function isArtifactProvider(provider) {
    return "verify" in provider;
  }
  var freshnessMs = 7 * 864e5;
  function status(connection, now, freshness = freshnessMs) {
    if (connection.revokedAt !== void 0) return "revoked";
    if (now >= connection.expiresAt) return "expired";
    const external = connection.attestations?.external;
    if (external?.artifactUrl && !external.hosted && freshness !== Infinity && now >= external.confirmedAt + freshness)
      return "expired";
    return "verified";
  }
  function statusLabel(evidence, now) {
    if (evidence.status === "revoked") return "Revoked";
    if (evidence.status === "verified" && evidence.expiresAt > now) return "Verified";
    return evidence.expiresAt > now ? "Unconfirmed" : "Expired";
  }
  function localSide(local, siteName) {
    if (local.kind === "site") return { heading: "Website", value: siteName };
    const heading = {
      account: `Account on ${siteName}`,
      page: `Page on ${siteName}`
    };
    return { heading: heading[local.kind ?? ""] ?? siteName, value: local.label };
  }
  function externalName(external) {
    return external.kind === "key" ? external.handle : `@${external.handle.replace(/^@/, "")}`;
  }
  function attestationLabel(method, names) {
    return {
      declared: `Stated by ${names.site}`,
      oauth: `Signed in with ${names.provider}`,
      attestation: `Published a proof on ${names.provider}`,
      dns: "Proved with a DNS record",
      wellknown: "Proved with a file on the domain",
      signature: "Proved with a signature"
    }[method];
  }

  // src/browser/mark.ts
  var tones = {
    current: ["#D3444C", "#149766"],
    inactive: ["#149766", "#D3444C"],
    pending: ["currentColor", "currentColor"]
  };
  function paintMark(svg, tone) {
    const colors = tones[tone];
    svg.setAttribute("class", tone === "pending" ? "mark pending" : "mark");
    for (const [layer, path] of [...svg.children].entries())
      path.setAttribute("stroke", colors[layer] ?? colors[0]);
  }
  function verificationMark(tone = "current") {
    const namespace2 = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace2, "svg");
    svg.setAttribute("viewBox", "-4 -4 264 264");
    svg.setAttribute("fill", "none");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    for (const layer of [0, 1]) {
      const path = document.createElementNS(namespace2, "path");
      path.setAttribute("d", "M40 36 128 220 216 36");
      path.setAttribute("stroke-width", "32");
      path.setAttribute("stroke-linejoin", "miter");
      if (layer === 1) {
        path.setAttribute("pathLength", "176");
        path.setAttribute("stroke-dasharray", "108 176");
        path.setAttribute("stroke-dashoffset", "-54");
      }
      svg.append(path);
    }
    paintMark(svg, tone);
    return svg;
  }

  // src/browser/provider-mark.ts
  var namespace = "http://www.w3.org/2000/svg";
  function mark() {
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("class", "provider");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    return svg;
  }
  function github() {
    const svg = mark();
    const path = document.createElementNS(namespace, "path");
    svg.setAttribute("fill", "currentColor");
    path.setAttribute(
      "d",
      "M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656"
    );
    svg.append(path);
    return svg;
  }
  function key() {
    const svg = mark();
    svg.setAttribute("fill", "none");
    for (const d of [
      "M7.4 8.6a3.3 3.3 0 1 0-4.7 4.7 3.3 3.3 0 0 0 4.7-4.7Z",
      "M7.4 8.6 14 2",
      "M11.2 4.8l1.6 1.6",
      "M9.4 6.6l1.6 1.6"
    ]) {
      const path = document.createElementNS(namespace, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "1.6");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.append(path);
    }
    return svg;
  }
  function providerMark(provider) {
    const marks = { github, openpgp: key };
    return marks[provider]?.();
  }

  // src/browser/badge.ts
  var styles = `
  :host { display: inline-block; max-width: 100%; vertical-align: middle; }
  * { box-sizing: border-box; }
  .badge {
    display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 3px 5px;
    border: 1px solid var(--verity-border, #dce2e0); border-radius: 6px;
    background: var(--verity-surface, #fff); color: var(--verity-text, #202c29);
    font: var(--verity-font-size, 13px)/1.35
      var(--verity-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
    text-decoration: none;
  }
  a[href]:hover { background: var(--verity-hover, #f3f6f4); border-color: var(--verity-border, #dce2e0); }
  .badge:focus-visible { outline: 2px solid #357ce5; outline-offset: 2px; }
  .name { font-weight: 600; overflow-wrap: anywhere; min-width: 0; }
  .label { display: none; font-size: 11px; color: var(--verity-muted, #65726c); }
  .badge:hover .label, .badge:focus-within .label { display: inline; }
  .icon { display: grid; place-items: center; flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; font-size: 12px; font-weight: 750; }
  .mark { display: block; flex-shrink: 0; width: 20px; height: 20px; }
  .mark.pending { opacity: .45; }
  /* A dim ring where the account will go; it only spins where motion is welcome. */
  .spinner {
    flex-shrink: 0; width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid currentColor; opacity: .3;
  }
  .divider { flex-shrink: 0; width: 1px; height: 12px; background: var(--verity-border, #dce2e0); }
  .provider { display: block; flex-shrink: 0; width: 14px; height: 14px; }
  .expired .icon { color: #815a12; background: #fbefce; }
  .revoked .icon, .message .icon { color: #626d69; background: #edf0ee; }
  .message { color: var(--verity-muted, #65726c); }
  @media (prefers-reduced-motion: no-preference) {
    a { transition: background .12s, border-color .12s; }
    /* The mark is drawn before the answer arrives, so it resolves rather than swaps. */
    .mark, .mark path { transition: opacity .18s ease, stroke .18s ease; }
    .spinner { border-top-color: transparent; opacity: .4; animation: verity-spin .7s linear infinite; }
  }
  @keyframes verity-spin { to { transform: rotate(360deg); } }
`;
  var sheet;
  var frames = /* @__PURE__ */ new WeakMap();
  var pendingKey = "\0pending";
  var shown = /* @__PURE__ */ new WeakMap();
  var messages = /* @__PURE__ */ new WeakMap();
  function badgeSheet() {
    if (!sheet) {
      sheet = new CSSStyleSheet();
      sheet.replaceSync(styles);
    }
    return sheet;
  }
  function frame(element, state) {
    let frame2 = frames.get(element);
    shown.delete(element);
    messages.delete(element);
    if (frame2?.host.parentNode !== element) {
      const host = document.createElement("span");
      const root = host.attachShadow({ mode: "open" });
      root.adoptedStyleSheets = [badgeSheet()];
      frame2 = { host, root };
      frames.set(element, frame2);
      element.replaceChildren(host);
    }
    const tag = state === "message" ? "span" : "a";
    if (!frame2.pill || frame2.pill.tagName.toLowerCase() !== tag) {
      frame2.pill = document.createElement(tag);
      frame2.mark = void 0;
      frame2.root.replaceChildren(frame2.pill);
    }
    for (const attribute of [
      "href",
      "rel",
      "title",
      "tabindex",
      "role",
      "aria-label",
      "aria-haspopup"
    ])
      frame2.pill.removeAttribute(attribute);
    frame2.pill.onclick = null;
    frame2.pill.className = `badge ${state}`;
    frame2.mark ??= verificationMark("pending");
    if (frame2.mark.parentNode !== frame2.pill) frame2.pill.replaceChildren(frame2.mark);
    else while (frame2.mark.nextSibling) frame2.mark.nextSibling.remove();
    return { pill: frame2.pill, mark: frame2.mark };
  }
  function intact(element) {
    const frame2 = frames.get(element);
    return frame2?.host.parentNode === element && frame2.pill?.parentNode === frame2.root;
  }
  function badgeShown(element) {
    return intact(element) && shown.has(element);
  }
  function renderKey(evidence, current, label) {
    return JSON.stringify([
      evidence.provider,
      evidence.providerName,
      externalName(evidence.external),
      evidence.evidenceUrl,
      evidence.verifierName,
      evidence.local.label,
      evidence.status,
      current,
      label
    ]);
  }
  function span(className, text) {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = text;
    return element;
  }
  function renderBadgePending(element) {
    if (intact(element) && messages.get(element) === pendingKey) return;
    const { pill, mark: mark2 } = frame(element, "pending");
    paintMark(mark2, "pending");
    pill.setAttribute("role", "status");
    pill.setAttribute("aria-label", "Checking verification");
    const divider = span("divider", "");
    divider.setAttribute("aria-hidden", "true");
    const spinner = span("spinner", "");
    spinner.setAttribute("aria-hidden", "true");
    pill.append(divider, spinner);
    messages.set(element, pendingKey);
  }
  function renderBadgeMessage(element, message) {
    if (intact(element) && messages.get(element) === message) return;
    const { pill, mark: mark2 } = frame(element, "message");
    paintMark(mark2, "inactive");
    pill.setAttribute("tabindex", "0");
    pill.setAttribute("role", "status");
    pill.setAttribute("aria-label", message);
    const icon = span("icon", "\u2013");
    icon.setAttribute("aria-hidden", "true");
    const divider = span("divider", "");
    divider.setAttribute("aria-hidden", "true");
    pill.append(divider, span("label", message), icon);
    messages.set(element, message);
  }
  function renderBadge(element, evidence) {
    const provider = evidence.providerName ?? evidence.provider;
    const current = evidence.status === "verified" && evidence.expiresAt > Date.now();
    const state = current ? "verified" : evidence.status === "revoked" ? "revoked" : "expired";
    const label = statusLabel(evidence, Date.now());
    const key2 = renderKey(evidence, current, label);
    if (intact(element) && shown.get(element) === key2) return null;
    const handle = externalName(evidence.external);
    const { pill, mark: mark2 } = frame(element, state);
    const badge = pill;
    paintMark(mark2, current ? "current" : "inactive");
    badge.href = evidence.evidenceUrl;
    badge.rel = "noreferrer";
    badge.setAttribute(
      "aria-label",
      `${provider} ${handle}: ${label} | via: ${evidence.verifierName} | inspect verification`
    );
    badge.title = `${label} | via: ${evidence.verifierName} | Inspect verification for ${evidence.local.label}`;
    const divider = span("divider", "");
    divider.setAttribute("aria-hidden", "true");
    const logo2 = providerMark(evidence.provider);
    badge.append(divider, logo2 ?? span("name", provider), span("name", handle));
    if (!current) {
      const icon = span("icon", state === "expired" ? "\u25F7" : "\u2013");
      icon.setAttribute("aria-hidden", "true");
      badge.append(span("label", label), icon);
    }
    shown.set(element, key2);
    return badge;
  }

  // src/logo.ts
  var logoViewBox = "0 -26 2785 916";
  var logoPaths = [
    {
      d: "M36.76 22.11 364.79 708 692.83 22.11 600.38 -22.11 364.79 470.49 129.21 -22.11Z",
      fill: "#D3444C"
    },
    {
      d: "M209.69 383.69 364.79 708 648 115.85 555.55 71.64 364.79 470.49 302.14 339.47Z",
      fill: "#149766"
    },
    {
      d: "M942 710Q838 710 777 646.5Q716 583 710 473Q709 460 709 439.5Q709 419 710 406Q714 335 743 281.5Q772 228 822.5 199Q873 170 941 170Q1017 170 1068.5 202Q1120 234 1147 293Q1174 352 1174 431V448Q1174 459 1167.5 465Q1161 471 1151 471H805Q805 472 805 475Q805 478 805 480Q807 521 823 556.5Q839 592 869.5 614Q900 636 941 636Q977 636 1001 625Q1025 614 1040 600.5Q1055 587 1060 579Q1069 567 1074 564.5Q1079 562 1090 562H1139Q1148 562 1154.5 567.5Q1161 573 1160 583Q1159 598 1144 619.5Q1129 641 1101.5 662Q1074 683 1033.5 696.5Q993 710 942 710ZM805 402H1079V399Q1079 354 1062.5 319Q1046 284 1015 263.5Q984 243 941 243Q898 243 867.5 263.5Q837 284 821 319Q805 354 805 399ZM1317 700Q1307 700 1300.5 693.5Q1294 687 1294 677V204Q1294 194 1300.5 187Q1307 180 1317 180H1363Q1373 180 1380 187Q1387 194 1387 204V248Q1407 214 1442 197Q1477 180 1527 180H1566Q1576 180 1582.5 186.5Q1589 193 1589 203V244Q1589 254 1582.5 260Q1576 266 1566 266H1506Q1452 266 1421 297.5Q1390 329 1390 383V677Q1390 687 1383 693.5Q1376 700 1366 700ZM1697 700Q1687 700 1680.5 693.5Q1674 687 1674 677V203Q1674 193 1680.5 186.5Q1687 180 1697 180H1745Q1755 180 1761.5 186.5Q1768 193 1768 203V677Q1768 687 1761.5 693.5Q1755 700 1745 700ZM1689 83Q1679 83 1672.5 76.5Q1666 70 1666 60V6Q1666 -4 1672.5 -11Q1679 -18 1689 -18H1752Q1762 -18 1769 -11Q1776 -4 1776 6V60Q1776 70 1769 76.5Q1762 83 1752 83ZM2119 700Q2063 700 2028 678.5Q1993 657 1977 617.5Q1961 578 1961 524V260H1883Q1873 260 1866.5 253.5Q1860 247 1860 237V203Q1860 193 1866.5 186.5Q1873 180 1883 180H1961V13Q1961 3 1967.5 -3.5Q1974 -10 1984 -10H2031Q2041 -10 2047.5 -3.5Q2054 3 2054 13V180H2178Q2189 180 2195 186.5Q2201 193 2201 203V237Q2201 247 2195 253.5Q2189 260 2178 260H2054V517Q2054 564 2070 591Q2086 618 2127 618H2188Q2198 618 2204.5 624.5Q2211 631 2211 641V677Q2211 687 2204.5 693.5Q2198 700 2188 700ZM2398 890Q2390 890 2384 884Q2378 878 2378 870Q2378 866 2379 862Q2380 858 2383 852L2460 669L2269 218Q2264 206 2264 201Q2264 192 2270 186Q2276 180 2285 180H2334Q2345 180 2350.5 185Q2356 190 2358 197L2510 561L2666 197Q2669 190 2674.5 185Q2680 180 2691 180H2738Q2747 180 2753 186Q2759 192 2759 200Q2759 205 2754 218L2470 873Q2467 880 2461.5 885Q2456 890 2445 890Z",
      fill: "currentColor"
    }
  ];
  var logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logoViewBox}" class="logo" role="img" aria-label="Verity">` + logoPaths.map(({ d, fill }) => `<path d="${d}" fill="${fill}"/>`).join("") + "</svg>";

  // src/browser/logo.ts
  function verityLogo() {
    const namespace2 = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace2, "svg");
    svg.setAttribute("viewBox", logoViewBox);
    svg.setAttribute("class", "logo");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Verity");
    for (const { d, fill } of logoPaths) {
      const path = document.createElementNS(namespace2, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", fill);
      svg.append(path);
    }
    return svg;
  }

  // src/version.ts
  var version = "v0";

  // src/browser/evidence-dialog.ts
  var openDialogs = /* @__PURE__ */ new WeakMap();
  var styles2 = `
  * { box-sizing: border-box; }
  dialog { width: min(460px, calc(100vw - 32px)); max-height: calc(100dvh - 40px); margin: auto; padding: 24px; border: 1px solid #dce2de; border-radius: 16px; background: #fff; color: #23312b; box-shadow: 0 24px 90px #10201935; font: 13px/1.6 system-ui, sans-serif; }
  dialog::backdrop { background: #15271f66; }
  header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
  h2 { margin: 0; font-size: 18px; font-weight: 650; letter-spacing: -.3px; }
  button { width: 32px; height: 32px; border: 1px solid #dce2de; border-radius: 8px; background: #fff; color: #52645a; font: 20px system-ui, sans-serif; cursor: pointer; }
  button:hover { background: #f2f5f1; }
  a { color: #245f43; text-underline-offset: 3px; overflow-wrap: anywhere; }
  a:focus-visible, button:focus-visible { outline: 2px solid #357ce5; outline-offset: 3px; }
  .summary { display: flex; align-items: center; gap: 8px; margin-top: 16px; }
  .mark { width: 36px; height: 36px; flex-shrink: 0; }
  .provider { width: 14px; height: 14px; }
  .state { font-size: 14px; font-weight: 650; line-height: 1.4; }
  .muted { color: #6b786f; font-size: 12px; }
  .account { padding: 14px 16px; border: 1px solid #e0e6df; border-radius: 10px; margin-top: 12px; }
  .account h3 { display: flex; align-items: center; gap: 6px; margin: 0 0 3px; color: #6b786f; font-size: 11px; font-weight: 550; }
  .account a, .account strong { font-weight: 650; font-size: 14px; }
  /* The account's own name carries that weight; a link inside a line of prose does not. */
  .summary a { font: inherit; }
  .reference { margin-top: 2px; }
  .method { margin-top: 8px; }
  .proof { margin-top: 2px; }
  .joiner { display: block; width: 20px; height: 20px; margin: 8px auto -4px; color: #90a096; }
  dl { margin: 16px 0 0; padding-top: 12px; border-top: 1px solid #e5e9e3; display: grid; grid-template-columns: auto 1fr; gap: 5px 16px; font-size: 11px; }
  dt { color: #6b786f; }
  dd { margin: 0; text-align: right; overflow-wrap: anywhere; }
  .explanation { margin-top: 16px; }
  footer { display: flex; align-items: center; justify-content: end; gap: 6px; margin-top: 14px; color: #9aa9a0; font-size: 11px; }
  .logo { display: block; height: 13px; }
`;
  function node(tag, text = "", className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
  }
  function outward(anchor, url) {
    anchor.href = url;
    anchor.rel = "noreferrer";
    anchor.target = "_blank";
    return anchor;
  }
  function linkMark() {
    const namespace2 = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace2, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("class", "joiner");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    for (const d of [
      "M10.5 7.5 13 5a4.95 4.95 0 0 1 7 7l-2.5 2.5",
      "M13.5 16.5 11 19a4.95 4.95 0 0 1-7-7l2.5-2.5",
      "M9 15l6-6"
    ]) {
      const path = document.createElementNS(namespace2, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "round");
      svg.append(path);
    }
    return svg;
  }
  function attestationNote(attestation, names) {
    const label = attestation && attestationLabel(attestation.method, names);
    if (!attestation || !label) return [];
    const note = node("div", label, "muted method");
    if (!attestation.artifactUrl) return [note];
    const proof = node("div", "", "muted proof");
    proof.append(outward(node("a", "View the proof"), attestation.artifactUrl));
    return [note, proof];
  }
  function moment(time) {
    return new Date(time).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
  }
  function accountCard(heading, name, reference, url, ...extra) {
    const card = node("section", "", "account");
    const title = node("h3");
    const value = node(url ? "a" : "strong", name);
    title.append(...heading);
    if (value instanceof HTMLAnchorElement) outward(value, url);
    card.append(title, value);
    if (reference) card.append(node("div", reference, "muted reference"));
    card.append(...extra);
    return card;
  }
  function render(content, evidence) {
    const current = evidence.status === "verified" && evidence.expiresAt > Date.now();
    const status2 = statusLabel(evidence, Date.now());
    const provider = evidence.providerName ?? evidence.provider;
    const summary = node("div", "", "summary");
    const copy = node("div");
    const attribution = node("div", "via: ", "muted");
    const verifier = outward(node("a", evidence.verifierName), evidence.evidenceUrl);
    verifier.title = `View this record at ${evidence.verifierName} (opens in a new tab)`;
    attribution.append(verifier);
    copy.append(node("div", status2, "state"), attribution);
    summary.append(verificationMark(current ? "current" : "inactive"), copy);
    const dates = node("dl");
    const dateRows = [["Approved", evidence.approvedAt]];
    if (evidence.status === "revoked") {
      if (evidence.revokedAt !== void 0) dateRows.push(["Revoked on", evidence.revokedAt]);
    } else {
      dateRows.push([
        evidence.expiresAt > Date.now() ? "Valid until" : "Expired on",
        evidence.expiresAt
      ]);
    }
    if (evidence.attestations?.external.artifactUrl)
      dateRows.push(["Last checked", evidence.attestations.external.confirmedAt]);
    for (const [label, time] of dateRows) {
      dates.append(node("dt", label), node("dd", moment(time)));
    }
    const names = { site: evidence.siteName, provider };
    const local = localSide(evidence.local, evidence.siteName);
    const localCard = accountCard(
      [document.createTextNode(local.heading)],
      local.value,
      // The heading names the site and the label names the subject, so the site's own
      // reference adds a third line saying the same thing. The provider id on the other
      // card stays: that one is the provider's identifier, not the site's own wording.
      void 0,
      evidence.local.profileUrl,
      ...attestationNote(evidence.attestations?.local, names)
    );
    const logo2 = providerMark(evidence.provider);
    const externalCard = accountCard(
      // The mark and the name, or just the name. A mark that falls back to writing the name
      // would print it twice here, since this heading writes it either way.
      logo2 ? [logo2, document.createTextNode(provider)] : [document.createTextNode(provider)],
      externalName(evidence.external),
      evidence.external.id,
      evidence.external.profileUrl,
      // Status first, then how it was shown, then when. The proof explains the state
      // above it, so it cannot sit before that state has been given.
      summary,
      ...attestationNote(evidence.attestations?.external, names),
      dates
    );
    content.replaceChildren(
      localCard,
      linkMark(),
      externalCard,
      // Nothing below the cards may name a provider. Approval, method and dates belong to
      // the card they came from, and a second provider on this subject gets its own card.
      node(
        "p",
        "Verification does not guarantee legal identity, trustworthiness, or permanent ownership.",
        "muted explanation"
      )
    );
  }
  function openEvidenceDialog(opener, load, opened) {
    const existing = openDialogs.get(opener);
    if (existing?.open) {
      existing.focus();
      return;
    }
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const sheet2 = new CSSStyleSheet();
    sheet2.replaceSync(styles2);
    root.adoptedStyleSheets = [sheet2];
    const dialog = node("dialog");
    const heading = node("h2", "Verification details");
    const close = node("button", "\xD7");
    const header = node("header");
    const stamp = node("footer");
    const content = node("div", "Checking verification\u2026");
    heading.id = "verity-dialog-title";
    dialog.setAttribute("aria-labelledby", heading.id);
    close.type = "button";
    close.setAttribute("aria-label", "Close verification details");
    content.setAttribute("aria-live", "polite");
    stamp.append(verityLogo(), node("span", version));
    header.append(heading, close);
    dialog.append(header, content, stamp);
    root.append(dialog);
    document.body.append(host);
    openDialogs.set(opener, dialog);
    let refreshing = false;
    let expiryTimer;
    let drawn;
    const draw = (evidence) => {
      const key2 = JSON.stringify([evidence, statusLabel(evidence, Date.now())]);
      if (key2 === drawn) return;
      drawn = key2;
      render(content, evidence);
    };
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const evidence = await load();
        if (!dialog.open) return;
        clearTimeout(expiryTimer);
        draw(evidence);
        const remaining = evidence.expiresAt - Date.now();
        if (evidence.status === "verified" && remaining > 0 && remaining <= 3e4) {
          expiryTimer = setTimeout(() => {
            if (dialog.open) draw(evidence);
          }, remaining);
        }
      } catch {
        clearTimeout(expiryTimer);
        drawn = void 0;
        if (dialog.open)
          content.replaceChildren(
            node("p", "Verification unavailable. Please close this dialog and try again.")
          );
      } finally {
        refreshing = false;
      }
    };
    const interval = setInterval(() => {
      void refresh();
    }, 3e4);
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom))
        dialog.close();
    });
    dialog.addEventListener(
      "close",
      () => {
        clearInterval(interval);
        clearTimeout(expiryTimer);
        openDialogs.delete(opener);
        host.remove();
        opener.firstElementChild?.shadowRoot?.querySelector("a, [tabindex]")?.focus();
      },
      { once: true }
    );
    if (opened) draw(opened);
    dialog.showModal();
    void refresh();
  }

  // src/browser/index.ts
  var latest = /* @__PURE__ */ new WeakMap();
  function init({ backendUrl }) {
    const base = new URL(backendUrl, location.href);
    if (!["https:", "http:"].includes(base.protocol)) throw new Error("Invalid backend URL");
    base.pathname = base.pathname.replace(/\/$/, "");
    async function request(path, data) {
      const response = await fetch(`${base.href}${path}`, {
        credentials: "same-origin",
        cache: "no-store",
        ...data ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        } : {}
      });
      if (!response.ok) throw new Error("Verity request unavailable");
      return response.json();
    }
    const client = {
      async connect({ provider }) {
        if (base.origin !== location.origin)
          throw new Error("Management requires a same-origin backend");
        const popup = window.open("about:blank", "_blank", "popup,width=600,height=750");
        if (!popup) throw new Error("Allow popups to verify");
        try {
          const data = await request("/connect", { provider });
          if (!record(data) || typeof data.url !== "string" || new URL(data.url).origin !== base.origin)
            throw new Error("Invalid flow URL");
          return await new Promise((resolve) => {
            const finish = (result) => {
              clearInterval(timer);
              clearTimeout(timeout);
              window.removeEventListener("message", receive);
              popup.close();
              resolve(result);
            };
            const receive = (event) => {
              if (event.origin !== base.origin || event.source !== popup || !record(event.data) || event.data.type !== "verity-result")
                return;
              const value = event.data;
              if (value.outcome === "complete" && typeof value.connectionId === "string")
                finish({ outcome: "complete", connectionId: value.connectionId });
              else finish({ outcome: value.outcome === "cancelled" ? "cancelled" : "failed" });
            };
            const timer = setInterval(() => {
              if (popup.closed) finish({ outcome: "cancelled" });
            }, 500);
            const timeout = setTimeout(() => finish({ outcome: "failed" }), 11 * 6e4);
            window.addEventListener("message", receive);
            popup.location.href = data.url;
          });
        } catch (error) {
          popup.close();
          throw error;
        }
      },
      /** The site's current public connections, so an embed need not hardcode ids. */
      async listPublished() {
        const data = await request("/published");
        if (!Array.isArray(data) || !data.every(validEvidence))
          throw new Error("Invalid evidence response");
        return data;
      },
      async getConnection(id) {
        const data = await request(`/connections/${encodeURIComponent(id)}?format=json`);
        if (!validEvidence(data)) throw new Error("Invalid evidence response");
        return data;
      },
      async mountBadge(element, { connectionId, evidence }) {
        if (!evidence && !badgeShown(element)) renderBadgePending(element);
        try {
          const e = evidence ?? await client.getConnection(connectionId);
          if (!validEvidence(e)) throw new Error("Invalid evidence response");
          if (e.visibility !== "public") throw new Error("Unavailable");
          safeUrl(e.external.profileUrl);
          safeUrl(e.evidenceUrl);
          latest.set(element, e);
          const badge = renderBadge(element, e);
          if (!badge) return;
          badge.setAttribute("aria-haspopup", "dialog");
          badge.onclick = (event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof HTMLDialogElement === "undefined")
              return;
            event.preventDefault();
            const read = latest.get(element) ?? e;
            openEvidenceDialog(
              element,
              async () => {
                const fresh = await client.getConnection(read.id);
                if (fresh.visibility !== "public") throw new Error("Unavailable");
                safeUrl(fresh.evidenceUrl);
                safeUrl(fresh.external.profileUrl);
                if (fresh.local.profileUrl) safeUrl(fresh.local.profileUrl);
                return fresh;
              },
              readable(read)
            );
          };
        } catch {
          latest.delete(element);
          renderBadgeMessage(element, "Unavailable");
        }
      },
      disconnect: (id) => request(`/connections/${encodeURIComponent(id)}/disconnect`, {}),
      issueShare: (id) => request(`/connections/${encodeURIComponent(id)}/share`, {}),
      revokeShare: (id) => request(`/connections/${encodeURIComponent(id)}/share-revoke`, {})
    };
    return client;
  }
  function record(value) {
    return value !== null && typeof value === "object";
  }
  function readable(evidence) {
    try {
      safeUrl(evidence.evidenceUrl);
      safeUrl(evidence.external.profileUrl);
      if (evidence.local.profileUrl) safeUrl(evidence.local.profileUrl);
      return evidence;
    } catch {
      return void 0;
    }
  }
  function safeUrl(value) {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid URL");
    return url.href;
  }
  function validAttestations(value) {
    if (value === void 0) return true;
    if (!record(value)) return false;
    return ["local", "external"].every((side) => {
      const attestation = value[side];
      if (!record(attestation)) return false;
      return ["backend", "provider"].includes(String(attestation.by)) && typeof attestation.method === "string" && typeof attestation.confirmedAt === "number" && Number.isFinite(attestation.confirmedAt) && (attestation.expect === void 0 || typeof attestation.expect === "string") && // Rendered as a link later, so only http(s) may ever reach an href.
      (attestation.artifactUrl === void 0 || httpUrl(attestation.artifactUrl));
    });
  }
  function httpUrl(value) {
    if (typeof value !== "string") return false;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }
  function validEvidence(value) {
    if (!record(value) || !record(value.local) || !record(value.external)) return false;
    return ["id", "provider", "siteName", "verifierName", "evidenceUrl"].every(
      (k) => typeof value[k] === "string"
    ) && ["label", "reference"].every(
      (k) => typeof value.local[k] === "string"
    ) && ["id", "handle", "profileUrl"].every(
      (k) => typeof value.external[k] === "string"
    ) && (value.local.profileUrl === void 0 || typeof value.local.profileUrl === "string") && (value.providerName === void 0 || typeof value.providerName === "string") && validAttestations(value.attestations) && (value.local.kind === void 0 || typeof value.local.kind === "string") && (value.external.kind === void 0 || ["account", "key"].includes(String(value.external.kind))) && (value.revokedAt === void 0 || typeof value.revokedAt === "number" && Number.isFinite(value.revokedAt)) && ["verified", "expired", "revoked"].includes(String(value.status)) && ["public", "unlisted"].includes(String(value.visibility)) && ["authenticatedAt", "approvedAt", "expiresAt"].every(
      (k) => typeof value[k] === "number" && Number.isFinite(value[k])
    );
  }
  if (typeof customElements !== "undefined" && !customElements.get("verity-badge")) {
    customElements.define(
      "verity-badge",
      class extends HTMLElement {
        /**
         * Evidence an embed already fetched, handed over before the badge is presented so
         * its first paint is the finished pill rather than a placeholder replaced a round
         * trip later. It seeds one paint only; every later refresh is fetched.
         */
        evidence;
        /**
         * A badge may be placed before its connection is known: it then waits, showing the
         * pill's own frame, until `connection-id` names what it presents.
         */
        static observedAttributes = ["backend-url", "connection-id"];
        timer;
        queued = false;
        connectedCallback() {
          this.present();
          this.timer = setInterval(() => this.refresh(), 3e4);
        }
        disconnectedCallback() {
          clearInterval(this.timer);
        }
        attributeChangedCallback() {
          this.present();
        }
        /**
         * Deferred by a microtask, so an embed that sets the backend, the connection and the
         * evidence one after another is drawn once, from all three, before anything paints.
         */
        present() {
          if (this.queued) return;
          this.queued = true;
          queueMicrotask(() => {
            this.queued = false;
            if (!this.isConnected) return;
            const seed = this.evidence;
            this.evidence = void 0;
            this.refresh(validEvidence(seed) && seed.visibility === "public" ? seed : void 0);
          });
        }
        refresh(evidence) {
          const backendUrl = this.getAttribute("backend-url"), connectionId = this.getAttribute("connection-id");
          if (!connectionId) {
            renderBadgePending(this);
            return;
          }
          if (backendUrl) void init({ backendUrl }).mountBadge(this, { connectionId, evidence });
        }
      }
    );
  }
  return __toCommonJS(browser_exports);
})();
