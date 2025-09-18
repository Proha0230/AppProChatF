import path from "path"

function resolve(DIRECTORY) {
    return path.join(__dirname, "src", DIRECTORY)
}
export default defineNuxtConfig({
compatibilityDate: '2025-07-15',
ssr: false,

pages: true,

srcDir: "src/",

css: [
    "~/assets/stylesheets/main.scss",
],

modules: [
    "@ant-design-vue/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt"
],

devtools: { enabled: true }
})
