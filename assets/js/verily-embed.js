// The published @bkazemi/verily browser script. The integrity hash makes the browser
// refuse anything the CDN serves other than exactly this release; upgrading means
// changing both lines.
const ASSET_URL = "https://cdn.jsdelivr.net/npm/@bkazemi/verily@0.5.0/dist/verily.js";
const ASSET_INTEGRITY = "sha384-36gTObYr4JNJzHbdgXeff0yDY+jw+z8SPrkwxewFVuXmoOsWEkSEPW0yKpLPKYb0";

let assetReady;

function loadAsset() {
  if (customElements.get("verily-badge")) return Promise.resolve();
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
      reject(new Error("Verily asset unavailable"));
    };
    document.head.appendChild(script);
  });
  return assetReady;
}

export async function mountVerilyPills(host, toAppPath) {
  // The component only needs the page, not the backend, so it loads alongside the
  // evidence rather than after it.
  const asset = loadAsset();
  asset.catch(() => {});

  // A badge with nothing named yet draws its own frame and waits. The pill therefore
  // holds its place from the first paint, and only what the backend knows arrives later.
  const waiting = asset.then(() => {
    if (!host.isConnected) return null;
    const badge = document.createElement("verily-badge");
    host.appendChild(badge);
    return badge;
  });
  waiting.catch(() => {});

  const response = await fetch(toAppPath("/assets/verily-config.json"), {
    credentials: "omit",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Verily configuration unavailable");

  const config = await response.json();
  if (new URL(config.backendUrl).protocol !== "https:") {
    throw new Error("Invalid Verily configuration");
  }

  // The backend names its own current public connections, so revoking or replacing
  // one never means editing this site. Nothing to show means nothing to render.
  const published = await fetch(`${config.backendUrl}/published`, {
    credentials: "omit",
    cache: "no-store",
  });
  if (!published.ok) throw new Error("Verily backend unavailable");

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

  // One pill for every account: they are all this site's, so the component shows the
  // first connected and counts the rest, and its dialog lists each on a card of its own.
  const badge = placed ?? host.appendChild(document.createElement("verily-badge"));
  badge.setAttribute("backend-url", config.backendUrl);
  if (named.length === 1) {
    // Handed the evidence just fetched, so it fills in without asking again.
    badge.evidence = named[0];
    badge.setAttribute("connection-id", named[0].id);
  } else {
    badge.setAttribute("connection-ids", named.map((connection) => connection.id).join(" "));
  }
}
