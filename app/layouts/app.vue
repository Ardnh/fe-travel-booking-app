<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useToast } from "@nuxt/ui/runtime/composables/useToast.js";

const route = useRoute();
const toast = useToast();

const open = ref(false);
const activePageName = ref("Dashboard");

const links = [
    [
        {
            label: "Dashboard",
            icon: "i-lucide-house",
            to: "/app",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Dashboard";
            },
        },
        {
            label: "Bookings",
            icon: "i-lucide-house",
            to: "/app/bookings",
            onSelect: () => {
                open.value = false;
                activePageName.value = "Bookings";
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

const showModal = () => {
    open.value = !open.value;
};

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
            :ui="{
                footer: 'lg:border-t lg:border-default',
            }"
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
                        <UButton
                            v-if="activePageName !== 'Dashboard'"
                            icon="i-lucide-plus"
                            size="md"
                            color="primary"
                            variant="solid"
                            @click="showModal()"
                        >
                            New {{ activePageName }}
                        </UButton>
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
</template>
