<script setup lang="ts">
import { useUsersStore, useVendorStore } from "~/stores";

const userStore = useUsersStore();
const vendorStore = useVendorStore();
const toast = useToast();

const { userProfile } = storeToRefs(userStore);
const {} = storeToRefs(vendorStore);
const { hasMultiRole, hasRole } = usePermissions();

const { getUserProfile } = userStore;
const { createVendor } = vendorStore;

const open = ref(false);

const handleSubmit = async (data: any) => {
    try {
        if (!userProfile.value) {
            throw new Error("User profile not provided");
        }

        await createVendor({
            ...data,
            owner_user_id: userProfile.value.user_id,
        });
    } catch (e) {
        toast.add({
            title: `${e}`,
            duration: 0,
            close: false,
        });
    }
};

const createOrGoToVendor = () => {
    if (userHasVendor) {
        navigateTo("/vendor");
    } else {
        open.value = true;
    }
};

onMounted(async () => {
    if (userProfile.value) return;
    await getUserProfile();
});

onUnmounted(() => {
    console.log("unmounted index");
});

definePageMeta({
    layout: "app",
});

const userHasVendor = computed(() => {
    return hasMultiRole() && hasRole("business_owner");
});

const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
});

const initials = computed(() => {
    if (!userProfile.value?.name) return "?";
    return userProfile.value.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
});

const memberSince = computed(() => {
    if (!userProfile.value?.created_at) return "";
    return new Date(userProfile.value.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
});

const quickActions = [
    {
        label: "Buat Booking Baru",
        icon: "i-lucide-calendar-plus",
        description: "Pesan jadwal perjalanan",
        to: "/app/bookings",
        color: "primary" as const,
    },
    {
        label: "Lihat Jadwal",
        icon: "i-lucide-clock",
        description: "Cek jadwal keberangkatan",
        to: "/app/schedules",
        color: "neutral" as const,
    },
    {
        label: "Cari Vendor",
        icon: "i-lucide-search",
        description: "Temukan vendor perjalanan",
        to: "/app/vendors",
        color: "neutral" as const,
    },
    {
        label: "Riwayat Booking",
        icon: "i-lucide-history",
        description: "Lihat booking sebelumnya",
        to: "/app/bookings",
        color: "neutral" as const,
    },
];

const permissionLabels: Record<string, { label: string; icon: string }> = {
    "profile:read": { label: "Lihat Profil", icon: "i-lucide-user" },
    "profile:update": { label: "Edit Profil", icon: "i-lucide-user-pen" },
    "service-types:read": { label: "Lihat Layanan", icon: "i-lucide-layers" },
    "vendors:read": { label: "Lihat Vendor", icon: "i-lucide-store" },
    "vendors:create": { label: "Tambah Vendor", icon: "i-lucide-store" },
    "schedules:read": { label: "Lihat Jadwal", icon: "i-lucide-calendar" },
    "pool-points:read": { label: "Lihat Pool", icon: "i-lucide-map-pin" },
    "layouts:read": { label: "Lihat Layout", icon: "i-lucide-layout-grid" },
    "layout-positions:read": { label: "Lihat Posisi", icon: "i-lucide-grid-3x3" },
    "bookings:create": { label: "Buat Booking", icon: "i-lucide-ticket-plus" },
    "bookings:read": { label: "Lihat Booking", icon: "i-lucide-ticket" },
};
</script>

<template>
    <div class="flex flex-col gap-6 p-4 md:p-6">
        <!-- Greeting & Profile Card -->
        <UCard v-if="userProfile" variant="subtle">
            <div class="flex flex-col md:flex-row md:items-center gap-4">
                <UAvatar
                    :src="userProfile.avatar_url || undefined"
                    :text="initials"
                    size="3xl"
                    :chip="{
                        color: userProfile.is_active ? 'success' : 'error',
                        position: 'bottom-right',
                    }"
                />
                <div class="flex-1 min-w-0">
                    <p class="text-sm text-muted">{{ greeting }} 👋</p>
                    <h1 class="text-2xl font-bold text-highlighted truncate">
                        {{ userProfile.name }}
                    </h1>
                    <p class="text-sm text-muted mt-1">
                        {{ userProfile.email }}
                    </p>
                    <div class="flex flex-wrap items-center gap-2 mt-2">
                        <UBadge v-for="role in userProfile.roles" :key="role" color="primary" variant="subtle" size="sm" icon="i-lucide-shield">
                            {{ role.replace("_", " ") }}
                        </UBadge>
                        <UBadge :color="userProfile.is_active ? 'success' : 'error'" variant="subtle" size="sm">
                            {{ userProfile.is_active ? "Aktif" : "Nonaktif" }}
                        </UBadge>
                    </div>
                </div>
                <div class="hidden md:flex flex-col items-end gap-1 text-right">
                    <UButton icon="i-lucide-building-2" @click="createOrGoToVendor">{{ userHasVendor ? "Go to Vendor" : "Open Vendor" }}</UButton>
                    <UBadge color="neutral" variant="outline" size="sm" icon="i-lucide-phone">
                        {{ userProfile.phone }}
                    </UBadge>
                    <p class="text-xs text-muted">Bergabung {{ memberSince }}</p>
                </div>
            </div>
        </UCard>

        <!-- Loading State -->
        <UCard v-else variant="subtle">
            <div class="flex items-center gap-4">
                <USkeleton class="size-16 rounded-full" />
                <div class="flex-1 space-y-2">
                    <USkeleton class="h-4 w-32" />
                    <USkeleton class="h-6 w-48" />
                    <USkeleton class="h-4 w-40" />
                </div>
            </div>
        </UCard>

        <!-- Quick Actions -->
        <div>
            <h2 class="text-lg font-semibold text-highlighted mb-3">Aksi Cepat</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <UCard
                    v-for="action in quickActions"
                    :key="action.label"
                    class="cursor-pointer hover:ring-primary/50 transition-all"
                    variant="outline"
                    @click="navigateTo(action.to)"
                >
                    <div class="flex items-start gap-3">
                        <div class="rounded-lg bg-primary/10 p-2">
                            <UIcon :name="action.icon" class="size-5 text-primary" />
                        </div>
                        <div>
                            <p class="font-medium text-sm text-highlighted">
                                {{ action.label }}
                            </p>
                            <p class="text-xs text-muted mt-0.5">
                                {{ action.description }}
                            </p>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>

        <!-- Info Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Permissions -->
            <UCard title="Akses Anda" variant="outline">
                <div class="flex flex-wrap gap-1.5">
                    <UBadge v-for="perm in userProfile?.permissions" :key="perm" color="neutral" variant="subtle" size="xs" :icon="permissionLabels[perm]?.icon || 'i-lucide-key'">
                        {{ permissionLabels[perm]?.label || perm }}
                    </UBadge>
                </div>
            </UCard>

            <!-- Account Info -->
            <UCard title="Informasi Akun" variant="outline">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-muted">Email</span>
                        <span class="text-sm font-medium text-highlighted">{{ userProfile?.email }}</span>
                    </div>
                    <USeparator />
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-muted">Telepon</span>
                        <span class="text-sm font-medium text-highlighted">{{ userProfile?.phone }}</span>
                    </div>
                    <USeparator />
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-muted">Status</span>
                        <UBadge :color="userProfile?.is_active ? 'success' : 'error'" variant="subtle" size="xs">
                            {{ userProfile?.is_active ? "Aktif" : "Nonaktif" }}
                        </UBadge>
                    </div>
                    <USeparator />
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-muted">Bergabung</span>
                        <span class="text-sm font-medium text-highlighted">{{ memberSince }}</span>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
    <FormNewVendor v-model:open="open" @submit="handleSubmit" />
</template>
