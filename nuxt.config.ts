// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    css: ["~/assets/css/main.css"],
    vite: {
        optimizeDeps: {
            include: ["@vue/devtools-core", "@vue/devtools-kit", "zod"],
        },
    },
    app: {
        pageTransition: {
            name: "page",
            mode: "out-in",
        },
        layoutTransition: {
            name: "layout",
            mode: "out-in",
        },
    },
    runtimeConfig: {
        apiSecret: "123",
        // Keys within public, will be also exposed to the client-side
        public: {
            apiBase: "http://127.0.0.1:8080/api/v1",
        },
    },
});
