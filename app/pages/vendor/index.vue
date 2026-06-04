<script setup lang="ts">
const vendorStore = useVendorStore();
const { vendor } = storeToRefs(vendorStore);
const { getVendorByOwnerUserId } = vendorStore;

definePageMeta({
    layout: "vendor",
});

onMounted(async () => {
    if (vendor.value != null) return;
    await getVendorByOwnerUserId();
});

onUnmounted(() => {
    console.log("unmounted /vendor");
});
</script>

<template>
    <!-- Loading state -->
    <div v-if="!vendor" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-gray-400 text-2xl" />
    </div>

    <template v-else>
        <!-- Header Card -->
        <UCard>
            <div class="flex items-start justify-between flex-wrap gap-3">
                <div class="flex items-center gap-4">
                    <UAvatar :alt="vendor.business_name" :src="vendor.logo_url || undefined" size="lg" icon="i-heroicons-building-storefront" />
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h1 class="text-xl font-medium">{{ vendor.business_name }}</h1>
                            <UBadge :color="vendor.status === 'active' ? 'success' : 'error'" variant="soft">
                                {{ vendor.status }}
                            </UBadge>
                            <UBadge :color="vendor.is_verified ? 'success' : 'warning'" variant="soft">
                                {{ vendor.is_verified ? "Terverifikasi" : "Belum terverifikasi" }}
                            </UBadge>
                        </div>
                        <p class="text-sm text-gray-500">{{ vendor.description }} &nbsp;·&nbsp; Berdiri sejak {{ vendor.founded_year }}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <UButton variant="outline" icon="i-heroicons-pencil-square" @click="navigateTo('/dashboard/vendor/edit')"> Edit </UButton>
                    <UButton v-if="!vendor.is_verified" icon="i-heroicons-shield-check" @click="navigateTo('/dashboard/vendor/verify')"> Ajukan Verifikasi </UButton>
                </div>
            </div>
        </UCard>

        <!-- Metric Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <UCard class="bg-gray-50 dark:bg-gray-800">
                <p class="text-xs text-gray-500 mb-1">Tahun Berdiri</p>
                <p class="text-xl font-medium">{{ vendor.founded_year }}</p>
            </UCard>
            <UCard class="bg-gray-50 dark:bg-gray-800">
                <p class="text-xs text-gray-500 mb-1">Status</p>
                <p class="text-xl font-medium" :class="vendor.status === 'active' ? 'text-green-500' : 'text-red-500'">
                    {{ vendor.status === "active" ? "Aktif" : "Nonaktif" }}
                </p>
            </UCard>
            <UCard class="bg-gray-50 dark:bg-gray-800">
                <p class="text-xs text-gray-500 mb-1">Verifikasi</p>
                <p class="text-xl font-medium" :class="vendor.is_verified ? 'text-green-500' : 'text-yellow-500'">
                    {{ vendor.is_verified ? "Verified" : "Pending" }}
                </p>
            </UCard>
            <UCard class="bg-gray-50 dark:bg-gray-800">
                <p class="text-xs text-gray-500 mb-1">No. Legal</p>
                <p class="text-sm font-medium mt-1">{{ vendor.legal_document_number }}</p>
            </UCard>
        </div>

        <!-- Owner & Kontak -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
                <template #header>
                    <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Informasi Pemilik</p>
                </template>
                <div class="flex items-center gap-3 mb-4">
                    <UAvatar :alt="vendor.owner_name" size="md" />
                    <div>
                        <p class="font-medium text-sm">{{ vendor.owner_name }}</p>
                        <p class="text-xs text-gray-500">Owner</p>
                    </div>
                </div>
                <div class="text-xs text-gray-400 space-y-1">
                    <p>Vendor ID</p>
                    <p class="font-mono break-all">{{ vendor.vendor_id }}</p>
                </div>
            </UCard>

            <UCard>
                <template #header>
                    <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Kontak</p>
                </template>
                <div class="space-y-3 text-sm">
                    <div class="flex gap-2">
                        <span class="text-gray-400 w-20 shrink-0">Telepon</span>
                        <span>{{ vendor.phone_number }}</span>
                    </div>
                    <UDivider />
                    <div class="flex gap-2">
                        <span class="text-gray-400 w-20 shrink-0">Email</span>
                        <span class="text-primary">{{ vendor.email }}</span>
                    </div>
                    <UDivider />
                    <div class="flex gap-2">
                        <span class="text-gray-400 w-20 shrink-0">Alamat</span>
                        <span>{{ vendor.head_office_address }}</span>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Timestamp -->
        <UCard>
            <template #header>
                <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Riwayat Waktu</p>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <p class="text-gray-400 text-xs mb-1">Dibuat</p>
                    <p>{{ new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(vendor.created_at)) }}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1">Diperbarui</p>
                    <p>{{ new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(vendor.updated_at)) }}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1">Dihapus</p>
                    <p class="text-gray-400">
                        {{ vendor.deleted_at ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(vendor.deleted_at)) : "—" }}
                    </p>
                </div>
            </div>
        </UCard>
    </template>
</template>
