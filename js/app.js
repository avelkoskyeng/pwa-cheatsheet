if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const swPath = (window.BASE_PATH || '') + '/sw.js';
      const reg = await navigator.serviceWorker.register(swPath);
      console.log("SW registered:", reg.scope);
    } catch (e) {
      console.error("SW registration failed:", e);
    }
  });
}