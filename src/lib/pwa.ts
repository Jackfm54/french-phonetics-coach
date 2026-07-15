export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const host = window.location.hostname;
  const isPreviewOrDev =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lovableproject.com") ||
    host.includes("-preview--") ||
    host.includes("-dev.");

  if (isPreviewOrDev) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => void reg.unregister());
    });
    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((key) => void caches.delete(key)));
    }
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // silencioso: PWA opcional
    });
  });
}
