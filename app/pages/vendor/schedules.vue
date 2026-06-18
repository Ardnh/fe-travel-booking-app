<script setup lang="ts">
definePageMeta({
    layout: "vendor",
    ssr: false,
});
useHead({
    title: "Schedules",
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
        </div> -->
    </div>
</template>
