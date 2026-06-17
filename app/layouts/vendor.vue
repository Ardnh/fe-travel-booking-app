<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";

const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();

const open = ref(false);
const logoutOpen = ref(false);
const logoutLoading = ref(false);
const activePageName = ref("Dashboard");

const links = [
    [
        {
            label: "Dashboard",
            icon: "i-lucide-house",
            to: "/vendor",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Dashboard";
            },
        },
        {
            label: "Pricing Matrix",
            icon: "i-lucide-circle-percent",
            to: "/vendor/pricing-matrix",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Pricing Matrix";
            },
        },
        {
            label: "Manage Pools",
            icon: "i-lucide-route",
            to: "/vendor/pools",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Pools";
            },
        },
        {
            label: "Manage Schedules",
            icon: "i-lucide-calendar-check",
            to: "/vendor/schedules",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Schedule";
            },
        },
        {
            label: "Manage Users",
            icon: "i-lucide-user",
            to: "/vendor/manage-users",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Manage Users";
            },
        },
    ],
] satisfies NavigationMenuItem[][];

const groups = computed(() => [
    {
        id: "links",
        label: "Go to",
        items: links.flat(),
    },
    {
        id: "code",
        label: "Code",
        items: [
            {
                id: "source",
                label: "View page source",
                icon: "i-simple-icons-github",
                to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === "/" ? "/index" : route.path}.vue`,
                target: "_blank",
            },
        ],
    },
]);

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

const showModal = () => {
    open.value = !open.value;
};
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
                <TeamsMenu :collapsed="collapsed" />
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

        <UDashboardSearch :groups="groups" />

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

    <UModal
        v-model:open="open"
        title="Modal with footer"
        :ui="{ footer: 'justify-end' }"
    >
        <template #body>
            <div class="">{{ activePageName }}</div>
        </template>

        <template #footer="{ close }">
            <UButton
                label="Cancel"
                color="neutral"
                variant="outline"
                @click="close"
            />
            <UButton label="Submit" color="neutral" />
        </template>
    </UModal>

    <ModalLogoutConfirmation
        v-model:open="logoutOpen"
        :loading="logoutLoading"
        @confirm="authStore.logout()"
    />
</template>
