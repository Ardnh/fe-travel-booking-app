import { defineStore } from "#imports";
import { useAsync } from "~/composables";
import type { LoginRequestDTO, LoginResponse } from "~/models";
import { useAuthService } from "~/services";

export const useAuthStore = defineStore("auth", () => {
    // ------------ INSTANCE ------------
    const { isLoading, getError, run } = useAsync();
    const service = useAuthService();

    // ------------ API STATE ------------
    const loginData = ref<LoginResponse | null>(null);

    // ------------ UI STATE ------------

    // ------------ ACTIONS ------------
    const login = async (req: LoginRequestDTO) => {
        const result = await run<LoginResponse>("login", () =>
            service.login(req),
        );

        storage.setString("token", result.data.token);
        storage.setString("expire_date", result.data.expire_date);
    };

    const register = () => {};

    return {
        isLoading,
        getError,
        login,
        register,
    };
});
