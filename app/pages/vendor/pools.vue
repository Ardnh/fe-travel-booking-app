<script setup lang="ts">
import type { Pool, CreatePoolDTO } from "~/models";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
    layout: "vendor",
    ssr: false,
});

const toast = useToast();
const poolsStore = usePoolsStore();
const vendorStore = useVendorStore();

const { pools } = storeToRefs(poolsStore);
const { vendor } = storeToRefs(vendorStore);

const { getAllPool, getPoolByVendorID, createPool, updatePool, deletePool, isLoading, getError } = poolsStore;

const { getVendorByOwnerUserId } = vendorStore;

const query = ref({
    page: 1,
    page_size: 30,
    search: "",
    sort_by: "created_at",
    sort_order: "DESC",
});

const open = ref(false);
const deleteOpen = ref(false);
const editPool = ref<Pool | undefined>(undefined);
const UButton = resolveComponent("UButton");

const columns: TableColumn<Pool>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "city", header: "City" },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) =>
            h(
                "span",
                {
                    class: "block truncate max-w-[200px]",
                    title: row.original.address,
                },
                row.original.address,
            ),
    },
    { accessorKey: "open_time", header: "Open Time" },
    { accessorKey: "close_time", header: "Close Time" },
    { accessorKey: "status", header: "Status" },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
            h("div", { class: "flex items-center gap-2" }, [
                h(UButton, {
                    icon: "i-lucide-pencil",
                    color: "neutral",
                    variant: "soft",
                    size: "sm",
                    "aria-label": "Edit",
                    onClick: async () => {
                        editPool.value = row.original;
                        open.value = true;
                    },
                }),
                h(UButton, {
                    icon: "i-lucide-trash-2",
                    color: "error",
                    variant: "soft",
                    size: "sm",
                    "aria-label": "Delete",
                    onClick: () => {
                        editPool.value = row.original;
                        deleteOpen.value = true;
                    },
                }),
            ]),
    },
];

const showModal = () => {
    editPool.value = undefined;
    open.value = true;
};

const closeModal = () => {
    open.value = false;
    editPool.value = undefined;
};

const handleSubmit = async (data: CreatePoolDTO) => {
    try {
        if (editPool.value) {
            await updatePool(editPool.value.pool_id, data);
            toast.add({
                title: "Success",
                description: "Pool updated successfully",
                color: "success",
            });
        } else {
            await createPool(data);
            toast.add({
                title: "Success",
                description: "Pool created successfully",
                color: "success",
            });
        }
    } catch {
        const key = editPool.value ? "updatePool" : "createPool";
        const error = poolsStore.getError(key);
        if (error) {
            toast.add({
                title: "Failed to Save Pool",
                description: error,
                color: "error",
            });
        }
    } finally {
        open.value = false;
        editPool.value = undefined;
    }
};

const handleDelete = async () => {
    try {
        if (!editPool.value) return;
        await deletePool(editPool.value.pool_id);
        toast.add({
            title: "Success",
            description: "Pool deleted successfully",
            color: "success",
        });
    } catch {
        const error = poolsStore.getError("deletePool");
        if (error) {
            toast.add({
                title: "Failed to Delete Pool",
                description: error,
                color: "error",
            });
        }
    } finally {
        deleteOpen.value = false;
        editPool.value = undefined;
    }
};

onMounted(async () => {
    if (vendor.value == null) {
        await getVendorByOwnerUserId();
    }
    if (vendor.value) {
        await getPoolByVendorID(vendor.value.vendor_id);
    }
});

watch(
    () => vendor.value?.vendor_id,
    (vendorId) => {
        if (vendorId) {
            getPoolByVendorID(vendorId);
        }
    },
);
</script>

<template>
    <div class="w-full flex justify-end items-center gap-4 mb-3">
        <UButton label="New Pool" icon="i-lucide-plus" size="md" color="primary" variant="solid" @click="showModal" />
    </div>

    <UTable :data="pools" :columns="columns" class="flex-1 border border-gray-300 rounded-lg" :loading="isLoading('getPoolByVendorID')" />

    <FormNewPool v-model:open="open" @submit="(data: any) => handleSubmit(data)" @close="closeModal" :data="editPool" />
    <ModalDeleteConfirmation v-model:open="deleteOpen" title="Delete Pool" :itemName="editPool?.name" confirmLabel="Delete" @delete="handleDelete" />
</template>
