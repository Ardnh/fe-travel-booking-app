<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { useAuthStore, useUsersStore } from "~/stores";
import { authSchema, mapRolesToRoute } from "~/utils";

const toast = useToast();
const authStore = useAuthStore();
const usersStore = useUsersStore();
const { hasMultiRole } = usePermissions();

// State & getters → pakai storeToRefs
const {} = storeToRefs(authStore);
const { userProfile } = storeToRefs(usersStore);

// Actions → ambil langsung dari store
const { login, register, getError } = authStore;
const { getUserProfile } = usersStore;

const fields: AuthFormField[] = [
    {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
    },
];

const onSubmit = async (payload: FormSubmitEvent<AuthSchema>) => {
    try {
        await login(payload.data);

        // Get user Profile
        await getUserProfile();

        if (userProfile.value == null) {
            throw new Error("User profile is not available");
        }

        // Cek jika user memiliki lebih dari 1 role maka arahkan ke select role page
        if (hasMultiRole(userProfile.value.roles)) {
            navigateTo("/select-role");
        } else {
            const role = userProfile.value.roles[0] ?? "";
            const route = mapRolesToRoute(role);

            navigateTo(route.route);
        }

        // Jika user hanya memiliki 1 role langsung arahkan ke halaman yang dituju
    } catch {
        const error = getError("login");
        if (error) {
            toast.add({
                title: "Login Gagal",
                description: error,
                color: "error",
            });
        }
    }
};
</script>

<template>
    <UMain class="flex items-center justify-center min-h-screen">
        <div class="flex flex-col items-center gap-5 w-full max-w-md px-6 py-8">
            <!-- Back link -->
            <NuxtLink to="/" class="group flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.6"
                    stroke="currentColor"
                    class="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Home
            </NuxtLink>

            <!-- Card -->
            <UPageCard class="w-full">
                <UAuthForm
                    :schema="authSchema"
                    title="Welcome back"
                    description="Sign in to your Omni HR account."
                    icon="i-lucide-lock-keyhole"
                    :fields="fields"
                    @submit="onSubmit"
                />
            </UPageCard>
        </div>
    </UMain>
</template>

<style scoped>
html {
    color-scheme: dark;
}
</style>
