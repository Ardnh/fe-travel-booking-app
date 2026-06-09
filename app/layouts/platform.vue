<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";
import { useAuthStore } from "~/stores/authStore";

const toast = useToast();
const authStore = useAuthStore();

const open = ref(false);
const logoutOpen = ref(false);
const logoutLoading = ref(false);
const activePageName = ref("Dashboard");

const links = [
    [
        {
            label: "Dashboard",
            icon: "i-lucide-house",
            to: "/platform",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Dashboard";
            },
        },
        {
            label: "Layouts",
            icon: "i-lucide-house",
            to: "/platform/layouts",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Layouts";
            },
        },
        {
            label: "Service Types",
            icon: "i-lucide-house",
            to: "/platform/service-types",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Service Types";
            },
        },
    ],
] satisfies NavigationMenuItem[][];

const items = ref<DropdownMenuItem[][]>([
    [
        {
            label: "Benjamin",
            avatar: {
                src: "https://github.com/benjamincanac.png",
                loading: "lazy",
            },
            type: "label",
        },
    ],
    [
        {
            label: "Profile",
            icon: "i-lucide-user",
        },
    ],
    [
        {
            label: "Logout",
            icon: "i-lucide-log-out",
            onSelect: () => {
                logoutOpen.value = true;
            },
        },
    ],
]);

onMounted(async () => {
    const cookie = useCookie("cookie-consent");
    if (cookie.value === "accepted") {
        return;
    }

    toast.add({
        title: "We use first-party cookies to enhance your experience on our website.",
        duration: 0,
        close: false,
        actions: [
            {
                label: "Accept",
                color: "neutral",
                variant: "outline",
                onClick: () => {
                    cookie.value = "accepted";
                },
            },
            {
                label: "Opt out",
                color: "neutral",
                variant: "ghost",
            },
        ],
    });
});
</script>
<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            id="default"
            v-model:open="open"
            collapsible
            resizable
            class="bg-elevated/25"
            :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
            <template #header="{ collapsed }">
                <!-- <TeamsMenu :collapsed="collapsed" /> -->
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton
                    :collapsed="collapsed"
                    class="bg-transparent ring-default"
                />

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="links[0]"
                    orientation="vertical"
                    tooltip
                    popover
                />

                <UNavigationMenu
                    :collapsed="collapsed"
                    :items="links[1]"
                    orientation="vertical"
                    tooltip
                    class="mt-auto"
                />
            </template>

            <template #footer="{ collapsed }">
                <UDropdownMenu
                    :items="items"
                    :ui="{
                        content: 'w-48',
                    }"
                >
                    <UButton
                        :avatar="{
                            src: 'https://github.com/benjamincanac.png',
                            loading: 'lazy' as const,
                        }"
                        :label="collapsed ? undefined : 'Benjamin'"
                        color="neutral"
                        variant="ghost"
                        class="w-full"
                        :block="collapsed"
                    />
                </UDropdownMenu>
            </template>
        </UDashboardSidebar>

        <UDashboardPanel hboardPanel id="home">
            <template #header>
                <UDashboardNavbar
                    :title="activePageName"
                    :ui="{ right: 'gap-3' }"
                >
                    <template #leading>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <UColorModeButton />
                    </template>
                </UDashboardNavbar>
            </template>

            <template #body>
                <Transition name="page" mode="out-in">
                    <div :key="$route.fullPath">
                        <slot />
                    </div>
                </Transition>
            </template>
        </UDashboardPanel>
    </UDashboardGroup>

    <ModalLogoutConfirmation
        v-model:open="logoutOpen"
        :loading="logoutLoading"
        @confirm="authStore.logout()"
    />
</template>
