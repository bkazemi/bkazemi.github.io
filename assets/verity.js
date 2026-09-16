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
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/browser.ts
  var browser_exports = {};
  __export(browser_exports, {
    init: () => init,
    status: () => status
  });

  // src/core/index.ts
  function status(connection, now) {
    if (connection.revokedAt !== void 0) return "revoked";
    return now >= connection.expiresAt ? "expired" : "verified";
  }

  // src/browser/mark.ts
  function verificationMark(inverted = false) {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "-4 -4 264 264");
    svg.setAttribute("fill", "none");
    svg.setAttribute("class", "mark");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const colors = inverted ? ["#149766", "#D3444C"] : ["#D3444C", "#149766"];
    for (const [layer, color] of colors.entries()) {
      const path = document.createElementNS(namespace, "path");
      path.setAttribute("d", "M40 36 128 220 216 36");
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", "32");
      path.setAttribute("stroke-linejoin", "miter");
      if (layer === 1) {
        path.setAttribute("pathLength", "176");
        path.setAttribute("stroke-dasharray", "108 176");
        path.setAttribute("stroke-dashoffset", "-54");
      }
      svg.append(path);
    }
    return svg;
  }

  // src/browser/provider-mark.ts
  function providerMark(provider, name = provider) {
    if (provider !== "github") {
      const label = document.createElement("span");
      label.textContent = name;
      return label;
    }
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    const path = document.createElementNS(namespace, "path");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("class", "provider");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    path.setAttribute(
      "d",
      "M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656"
    );
    svg.append(path);
    return svg;
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
  a:hover { background: var(--verity-hover, #f3f6f4); border-color: var(--verity-border, #dce2e0); }
  .badge:focus-visible { outline: 2px solid #357ce5; outline-offset: 2px; }
  .name { font-weight: 600; overflow-wrap: anywhere; min-width: 0; }
  .label { display: none; font-size: 11px; color: var(--verity-muted, #65726c); }
  .badge:hover .label, .badge:focus-within .label { display: inline; }
  .icon { display: grid; place-items: center; flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; font-size: 12px; font-weight: 750; }
  .mark { display: block; flex-shrink: 0; width: 20px; height: 20px; }
  .divider { flex-shrink: 0; width: 1px; height: 12px; background: var(--verity-border, #dce2e0); }
  .provider { display: block; flex-shrink: 0; width: 14px; height: 14px; }
  .expired .icon { color: #815a12; background: #fbefce; }
  .revoked .icon, .message .icon { color: #626d69; background: #edf0ee; }
  .message { color: var(--verity-muted, #65726c); }
  @media (prefers-reduced-motion: no-preference) { a { transition: background .12s, border-color .12s; } }
`;
  function frame(element, state) {
    const host = document.createElement("span");
    const root = host.attachShadow({ mode: "open" });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    root.adoptedStyleSheets = [sheet];
    const badge = document.createElement(state === "message" ? "span" : "a");
    badge.className = `badge ${state}`;
    root.append(badge);
    element.replaceChildren(host);
    return badge;
  }
  function span(className, text) {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = text;
    return element;
  }
  function renderBadgeMessage(element, message) {
    const badge = frame(element, "message");
    badge.setAttribute("tabindex", "0");
    badge.setAttribute("role", "status");
    badge.setAttribute("aria-label", message);
    const icon = span("icon", "\u2013");
    icon.setAttribute("aria-hidden", "true");
    const divider = span("divider", "");
    divider.setAttribute("aria-hidden", "true");
    badge.append(verificationMark(true), divider, span("label", message), icon);
  }
  function renderBadge(element, evidence) {
    const provider = evidence.providerName ?? evidence.provider;
    const current = evidence.status === "verified" && evidence.expiresAt > Date.now();
    const state = current ? "verified" : evidence.status === "revoked" ? "revoked" : "expired";
    const label = {
      verified: "Verified",
      expired: "Expired",
      revoked: "Revoked"
    }[state];
    const handle = `@${evidence.external.handle.replace(/^@/, "")}`;
    const badge = frame(element, state);
    const mark = verificationMark(!current);
    badge.href = evidence.evidenceUrl;
    badge.rel = "noreferrer";
    badge.setAttribute(
      "aria-label",
      `${provider} ${handle}: ${label} | Verifier: ${evidence.verifierName} | inspect verification`
    );
    badge.title = `${label} | Verifier: ${evidence.verifierName} | Inspect verification for ${evidence.local.label} (${evidence.local.reference}) and ${provider} ${handle}`;
    const divider = span("divider", "");
    divider.setAttribute("aria-hidden", "true");
    badge.append(mark, divider, providerMark(evidence.provider, provider), span("name", handle));
    if (!current) {
      const icon = span("icon", state === "expired" ? "\u25F7" : "\u2013");
      icon.setAttribute("aria-hidden", "true");
      badge.append(span("label", label), icon);
    }
    return badge;
  }

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
  .context { margin: -8px 0 18px; }
  .mark { width: 24px; height: 24px; flex-shrink: 0; }
  .provider { width: 14px; height: 14px; }
  .state { font-size: 14px; font-weight: 650; line-height: 1.4; }
  .muted { color: #6b786f; font-size: 12px; }
  .account { padding: 14px 16px; border: 1px solid #e0e6df; border-radius: 10px; margin-top: 12px; }
  .account h3 { display: flex; align-items: center; gap: 6px; margin: 0 0 3px; color: #6b786f; font-size: 11px; font-weight: 550; }
  .account a, .account strong { font-weight: 650; font-size: 14px; }
  dl { margin: 16px 0 0; padding-top: 12px; border-top: 1px solid #e5e9e3; display: grid; grid-template-columns: auto 1fr; gap: 5px 16px; font-size: 11px; }
  dt { color: #6b786f; }
  dd { margin: 0; text-align: right; overflow-wrap: anywhere; }
  .explanation { padding-top: 16px; border-top: 1px solid #e5e9e3; }
`;
  function node(tag, text = "", className = "") {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
  }
  function subjectNoun(kind) {
    return { account: "account", page: "page", site: "website" }[kind ?? "account"] ?? "account";
  }
  function render(content, evidence) {
    const current = evidence.status === "verified" && evidence.expiresAt > Date.now();
    const status2 = current ? "Verified" : evidence.status === "revoked" ? "Revoked" : "Expired";
    const provider = evidence.providerName ?? evidence.provider;
    const subject = subjectNoun(evidence.local.kind);
    const summary = node("div", "", "summary");
    const copy = node("div");
    copy.append(
      node("div", status2, "state"),
      node("div", `Verifier: ${evidence.verifierName}`, "muted")
    );
    summary.append(verificationMark(!current), copy);
    const dates = node("dl");
    const dateRows = [["Approved", evidence.approvedAt]];
    if (evidence.status === "revoked") {
      if (evidence.revokedAt !== void 0) dateRows.push(["Revoked on", evidence.revokedAt]);
    } else {
      dateRows.push([current ? "Valid until" : "Expired on", evidence.expiresAt]);
    }
    for (const [label, time] of dateRows) {
      dates.append(node("dt", label), node("dd", new Date(time).toLocaleString()));
    }
    const explanation = node(
      "p",
      `The holder of the external account authenticated with its provider and approved this specific link. ${evidence.siteName} supplied the ${subject} it names.`,
      "muted explanation"
    );
    const context = node("p", "", "muted context");
    const local = node(evidence.local.profileUrl ? "a" : "strong", evidence.local.label);
    if (local instanceof HTMLAnchorElement) {
      local.href = evidence.local.profileUrl;
      local.rel = "noreferrer";
    }
    context.append("For ", local, ` on ${evidence.siteName}`);
    const card = node("section", "", "account");
    const providerHeading = node("h3");
    const handle = node("a", `@${evidence.external.handle.replace(/^@/, "")}`);
    providerHeading.append(
      providerMark(evidence.provider, provider),
      document.createTextNode(provider)
    );
    handle.href = evidence.external.profileUrl;
    handle.rel = "noreferrer";
    card.append(providerHeading, handle, summary, dates);
    content.replaceChildren(
      context,
      card,
      explanation,
      node(
        "p",
        "Verification does not guarantee legal identity, trustworthiness, or permanent ownership.",
        "muted"
      )
    );
  }
  function openEvidenceDialog(opener, load) {
    const existing = openDialogs.get(opener);
    if (existing?.open) {
      existing.focus();
      return;
    }
    const host = document.createElement("div");
    const root = host.attachShadow({ mode: "open" });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles2);
    root.adoptedStyleSheets = [sheet];
    const dialog = node("dialog");
    const heading = node("h2", "Verification details");
    const close = node("button", "\xD7");
    const header = node("header");
    const content = node("div", "Checking verification\u2026");
    heading.id = "verity-dialog-title";
    dialog.setAttribute("aria-labelledby", heading.id);
    close.type = "button";
    close.setAttribute("aria-label", "Close verification details");
    content.setAttribute("aria-live", "polite");
    header.append(heading, close);
    dialog.append(header, content);
    root.append(dialog);
    document.body.append(host);
    openDialogs.set(opener, dialog);
    let refreshing = false;
    let expiryTimer;
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const evidence = await load();
        if (!dialog.open) return;
        clearTimeout(expiryTimer);
        render(content, evidence);
        const remaining = evidence.expiresAt - Date.now();
        if (evidence.status === "verified" && remaining > 0 && remaining <= 3e4) {
          expiryTimer = setTimeout(() => {
            if (dialog.open) render(content, evidence);
          }, remaining);
        }
      } catch {
        clearTimeout(expiryTimer);
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
    dialog.showModal();
    void refresh();
  }

  // src/browser/index.ts
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
      async getConnection(id) {
        const data = await request(`/connections/${encodeURIComponent(id)}?format=json`);
        if (!validEvidence(data)) throw new Error("Invalid evidence response");
        return data;
      },
      async mountBadge(element, { connectionId }) {
        renderBadgeMessage(element, "Checking\u2026");
        try {
          const e = await client.getConnection(connectionId);
          if (e.visibility !== "public") throw new Error("Unavailable");
          safeUrl(e.external.profileUrl);
          safeUrl(e.evidenceUrl);
          const badge = renderBadge(element, e);
          badge.setAttribute("aria-haspopup", "dialog");
          badge.addEventListener("click", (event) => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof HTMLDialogElement === "undefined")
              return;
            event.preventDefault();
            openEvidenceDialog(element, async () => {
              const fresh = await client.getConnection(e.id);
              if (fresh.visibility !== "public") throw new Error("Unavailable");
              safeUrl(fresh.evidenceUrl);
              safeUrl(fresh.external.profileUrl);
              if (fresh.local.profileUrl) safeUrl(fresh.local.profileUrl);
              return fresh;
            });
          });
        } catch {
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
  function safeUrl(value) {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid URL");
    return url.href;
  }
  function validEvidence(value) {
    if (!record(value) || !record(value.local) || !record(value.external)) return false;
    return ["id", "provider", "siteName", "verifierName", "evidenceUrl"].every(
      (k) => typeof value[k] === "string"
    ) && ["label", "reference"].every(
      (k) => typeof value.local[k] === "string"
    ) && ["id", "handle", "profileUrl"].every(
      (k) => typeof value.external[k] === "string"
    ) && (value.local.profileUrl === void 0 || typeof value.local.profileUrl === "string") && (value.providerName === void 0 || typeof value.providerName === "string") && (value.local.kind === void 0 || typeof value.local.kind === "string") && (value.revokedAt === void 0 || typeof value.revokedAt === "number" && Number.isFinite(value.revokedAt)) && ["verified", "expired", "revoked"].includes(String(value.status)) && ["public", "unlisted"].includes(String(value.visibility)) && ["authenticatedAt", "approvedAt", "expiresAt"].every(
      (k) => typeof value[k] === "number" && Number.isFinite(value[k])
    );
  }
  if (typeof customElements !== "undefined" && !customElements.get("verity-badge")) {
    customElements.define(
      "verity-badge",
      class extends HTMLElement {
        timer;
        connectedCallback() {
          this.refresh();
          this.timer = setInterval(() => this.refresh(), 3e4);
        }
        disconnectedCallback() {
          clearInterval(this.timer);
        }
        refresh() {
          const backendUrl = this.getAttribute("backend-url"), connectionId = this.getAttribute("connection-id");
          if (backendUrl && connectionId)
            void init({ backendUrl }).mountBadge(this, { connectionId });
        }
      }
    );
  }
  return __toCommonJS(browser_exports);
})();
