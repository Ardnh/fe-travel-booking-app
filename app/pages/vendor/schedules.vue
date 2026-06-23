<script setup lang="ts">
definePageMeta({
    layout: "vendor",
    ssr: false,
});
useHead({
    title: "Schedules",
});

const vendorStore = useVendorStore();
const { vendor } = storeToRefs(vendorStore);
const { getVendorByOwnerUserId } = vendorStore;

const open = ref(false);

const showModal = () => {
    console.log("show modal");
    open.value = true;
};

const handleSubmit = (data: any) => {
    console.log("submit schedule");
    console.log(toRaw(data));
};

onMounted(async () => {
    if (vendor.value != null) return;
    await getVendorByOwnerUserId();
});
</script>
<template>
    <div class="w-full flex-1">
        <div class="w-full flex justify-end items-center mb-3">
            <UButton
                label="New Schedule"
                icon="i-lucide-plus"
                size="md"
                color="primary"
                variant="solid"
                @click="showModal"
            />
        </div>

        <!-- <UTable
            sticky
            :data="pools"
            :columns="columns"
            class="flex-1 min-h-[74vh] border border-accented rounded-lg"
            :loading="isLoading('getPoolByVendorID')"
        />
        <div class="h-auto flex justify-end mt-3">
            <UPagination
                v-model:page="poolsPagination.current_page"
                :total="poolsPagination.total_pages"
                @update:page="onUpdatePage"
            />
        </div>  -->
    </div>

    <FormNewSchedule
        v-model:open="open"
        @submit="(data: any) => handleSubmit(data)"
    />
</template>
