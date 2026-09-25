// The published @bkazemi/verity browser script. The integrity hash makes the browser
// refuse anything the CDN serves other than exactly this release; upgrading means
// changing both lines.
const ASSET_URL = "https://cdn.jsdelivr.net/npm/@bkazemi/verity@0.0.1/dist/verity.js";
const ASSET_INTEGRITY = "sha384-xWl6piRY1EJNREw5lNz7FtJ8YrQd4+6xXlPXSc6lSf0cKre2959KLX+2zPiJtEJH";

let assetReady;

function loadAsset() {
  if (customElements.get("verity-badge")) return Promise.resolve();
  if (assetReady) return assetReady;

  assetReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = ASSET_URL;
    script.integrity = ASSET_INTEGRITY;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = () => {
      script.remove();
      assetReady = undefined;
      reject(new Error("Verity asset unavailable"));
    };
    document.head.appendChild(script);
  });
  return assetReady;
}

export async function mountVerityPills(host, toAppPath) {
  // The component only needs the page, not the backend, so it loads alongside the
  // evidence rather than after it.
  const asset = loadAsset();
  asset.catch(() => {});

  // A badge with nothing named yet draws its own frame and waits. The pill therefore
  // holds its place from the first paint, and only what the backend knows arrives later.
  const waiting = asset.then(() => {
    if (!host.isConnected) return null;
    const badge = document.createElement("verity-badge");
    host.appendChild(badge);
    return badge;
  });
  waiting.catch(() => {});

  const response = await fetch(toAppPath("/assets/verity-config.json"), {
    credentials: "omit",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Verity configuration unavailable");

  const config = await response.json();
  if (new URL(config.backendUrl).protocol !== "https:") {
    throw new Error("Invalid Verity configuration");
  }

  // The backend names its own current public connections, so revoking or replacing
  // one never means editing this site. Nothing to show means nothing to render.
  const published = await fetch(`${config.backendUrl}/published`, {
    credentials: "omit",
    cache: "no-store",
  });
  if (!published.ok) throw new Error("Verity backend unavailable");

  const connections = await published.json();
  const named = Array.isArray(connections)
    ? connections.filter((connection) => typeof connection?.id === "string" && connection.id)
    : [];
  if (named.length === 0) {
    host.remove();
    return;
  }

  const placed = await waiting;
  if (!host.isConnected) return;

  // One pill per verified connection; the component picks its own provider mark. Each
  // badge is handed the evidence just fetched, so it fills in what it is waiting for
  // rather than asking the backend again for what is already here.
  for (const [index, connection] of named.entries()) {
    const badge = index === 0 && placed ? placed : document.createElement("verity-badge");
    badge.evidence = connection;
    badge.setAttribute("backend-url", config.backendUrl);
    badge.setAttribute("connection-id", connection.id);
    if (badge !== placed) host.appendChild(badge);
  }
}
