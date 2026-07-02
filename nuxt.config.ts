// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/image",
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_API || "http://127.0.0.1:8000/api/admin",
      appName: "HatounandDayana",
    },
  },

  i18n: {
    locales: [
      { code: "en", name: "English", dir: "ltr", file: "en.json" },
      { code: "ar", name: "العربية", dir: "rtl", file: "ar.json" },
    ],
    defaultLocale: "ar",
    strategy: "no_prefix",
  },

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  compatibilityDate: "2024-07-11",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
