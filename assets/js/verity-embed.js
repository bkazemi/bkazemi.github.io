let assetReady;

function loadAsset(toAppPath) {
  if (customElements.get("verity-badge")) return Promise.resolve();
  if (assetReady) return assetReady;

  assetReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = toAppPath("/assets/verity.js");
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
  const response = await fetch(toAppPath("/assets/verity-config.json"), {
    credentials: "omit",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Verity configuration unavailable");

  const config = await response.json();
  const ids = Array.isArray(config.connectionIds) ? config.connectionIds : [];
  if (ids.length === 0) {
    host.remove();
    return;
  }
  if (!ids.every((id) => typeof id === "string" && id.length > 0)) {
    throw new Error("Invalid Verity configuration");
  }
  if (new URL(config.backendUrl).protocol !== "https:") {
    throw new Error("Invalid Verity configuration");
  }

  await loadAsset(toAppPath);
  if (!host.isConnected) return;

  // One pill per verified connection; the component picks its own provider mark.
  for (const id of ids) {
    const badge = document.createElement("verity-badge");
    badge.setAttribute("backend-url", config.backendUrl);
    badge.setAttribute("connection-id", id);
    host.appendChild(badge);
  }
}
