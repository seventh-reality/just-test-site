import Vue from "vue";
import App from "./App.vue";
import "@/assets/styles/main.css";
import store from "./store/index";
import router from "./router/index";
import Notifications from "vt-notifications";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

Sentry.init({
    dsn: "https://c9a122bcc027464992d4a46af81251e0@o180935.ingest.sentry.io/5372539",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

Vue.config.productionTip = false;

Vue.use(Notifications);

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount("#app");
