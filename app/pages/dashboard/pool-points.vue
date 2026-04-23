<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const searchValue = ref<string>('')
const isMounted = ref(true)

const items = ref<DropdownMenuItem[]>([
    {
        label: 'PDF',
        icon: 'i-lucide-user'
    },
    {
        label: 'Excel',
        icon: 'i-lucide-credit-card'
    },
    {
        label: 'CSV',
        icon: 'i-lucide-cog'
    }
])

const data = ref([
    {
        id: '4600',
        name: 'POOL CIKINI',
        address: 'Jl. Cikini Raya No.73, RT.1/RW.5, Cikini',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        total_admin: 24,
        open_hour: '08:00',
        close_hour: '17:00',
        status: 'active'
    },
])

definePageMeta({
  layout: 'dashboard'
})

onMounted(() => {
    if(isMounted.value) {
        setTimeout(() => {
            isMounted.value = false
        }, 1000)
    }
})
</script>
<template>
    <div v-if="isMounted" class="flex items-center justify-center p-8 h-full w-full animate-pulse">
        <UIcon name="i-lucide-loader-pinwheel" class="animate-spin text-primary text-4xl" />
    </div>
    <div v-else class="">
        <div class="flex items-center justify-between mb-3">
            <UInput 
                v-model="searchValue"
                placeholder="Search..."
                icon="i-lucide-search"
                clearable
            />
            <UDropdownMenu
                :items="items"
                :content="{
                    align: 'end',
                    side: 'bottom',
                    sideOffset: 5
                }"
                :ui="{
                    content: 'w-24'
                }"
            >
                <UButton label="Export" icon="i-lucide-download" color="neutral" variant="outline" />
            </UDropdownMenu>
        </div>
        <div class="border rounded-xl border-gray-200 flex flex-col h-full">
            <UTable :data="data" class="flex-1" />
        </div>
    </div>
</template>
