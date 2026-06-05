// plugins/vue-konva.client.ts   (akhiran .client = hanya jalan di browser)
import VueKonva from "vue-konva";
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueKonva);
});
