import Echo from "laravel-echo";

import Pusher from "pusher-js";
window.Pusher = Pusher;

const viteKey =
  import.meta.env.VITE_PUSHER_APP_KEY || import.meta.env.VITE_REVERB_APP_KEY;
const viteHost =
  import.meta.env.VITE_PUSHER_HOST || import.meta.env.VITE_REVERB_HOST;
const vitePort = Number(
  import.meta.env.VITE_PUSHER_PORT ||
    import.meta.env.VITE_REVERB_PORT ||
    80,
);
const viteScheme =
  import.meta.env.VITE_PUSHER_SCHEME ||
  import.meta.env.VITE_REVERB_SCHEME ||
  "https";
const viteCluster =
  import.meta.env.VITE_PUSHER_APP_CLUSTER ?? import.meta.env.VITE_REVERB_APP_CLUSTER ?? "mt1";

window.Echo = new Echo({
  broadcaster: "pusher",
  key: viteKey,
  cluster: viteCluster,
  wsHost: viteHost,
  wsPort: vitePort,
  wssPort: vitePort,
  forceTLS: viteScheme === "https",
  enabledTransports: ["ws", "wss"],
});
