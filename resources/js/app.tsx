import "./bootstrap";
import "./echo";
import "../css/app.css";
import "../css/emoji.css";
import "../css/image-gallery.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* игнорируем: не HTTPS / старый браузер */
    });
  });
}

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: "#2563eb",
  },
});
