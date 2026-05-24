import { defineStore } from "#imports";
import { useAsync } from "~/composables";
import type { UserProfile } from "~/models";
import { useUsersService } from "~/services";
export const useUsersStore = defineStore("users", () => {
    // ------------ INSTANCE ------------
    const { isLoading, getError, run } = useAsync();
    const service = useUsersService();

    // ------------ API STATE ------------
    const userProfile = ref<UserProfile | null>(null);

    // ------------ UI STATE ------------
    const activeRole = ref<string | null>(null);

    // ------------ ACTIONS ------------
    const getUserProfile = async () => {
        const result = await run("getUserProfile", () =>
            service.getUserProfile(),
        );
        userProfile.value = result.data;
    };

    const setActiveRole = (role: string) => {
        activeRole.value = role;
    };

    return {
        isLoading,
        getError,
        userProfile,
        getUserProfile,
        setActiveRole,
        activeRole,
    };
});
