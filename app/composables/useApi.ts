import { storage } from "~/utils";

export const useApi = () => {
    const config = useRuntimeConfig();

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest({ options }) {
            const token = storage.getString("token");
            if (token) {
                options.headers.set("Authorization", `Bearer ${token}`);
            }
        },

        onResponseError({ response }) {
            if (response.status === 401) {
                // storage.clear();
                navigateTo("/login");
            }
            if (response.status === 403) {
                throw createError({
                    statusCode: 403,
                    message: "Akses ditolak",
                });
            }
            if (response.status === 404) {
                throw createError({
                    statusCode: 404,
                    message: "Tidak ditemukan",
                });
            }
            if (response.status === 500) {
                throw createError({ statusCode: 500, message: "Server error" });
            }
        },
    });

    return { api };
};
