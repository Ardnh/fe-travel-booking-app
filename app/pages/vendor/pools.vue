<script setup lang="ts">
import type { Pool, CreatePoolDTO, PoolParams } from "~/models";
import type { TableColumn } from "@nuxt/ui";
import { INITIAL_PARAMS } from "~/constants/common";

definePageMeta({
    layout: "vendor",
    ssr: false,
});

const toast = useToast();
const poolsStore = usePoolsStore();
const vendorStore = useVendorStore();

const { pools } = storeToRefs(poolsStore);
const { vendor } = storeToRefs(vendorStore);

useHead({
    title: `Pools ${vendor.value ? "| " + vendor.value.business_name : ""}`,
});

const { getAllPool, getPoolByVendorID, createPool, updatePool, deletePool, isLoading, getError, poolsPagination } = poolsStore;

const { getVendorByOwnerUserId } = vendorStore;

const params = ref<PoolParams>({ ...INITIAL_PARAMS });

const open = ref(false);
const deleteOpen = ref(false);
const editPool = ref<Pool | undefined>(undefined);
const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const columns: TableColumn<Pool>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "province", header: "Province" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "district", header: "District" },
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
    {
        accessorKey: "open_time",
        header: "Open Time",
    },
    {
        accessorKey: "close_time",
        header: "Close Time",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const color = {
                active: "success" as const,
                inactive: "error" as const,
                suspended: "neutral" as const,
                pending: "warning" as const,
            }[row.getValue("status") as string];

            return h(UBadge, { class: "capitalize", variant: "subtle", color }, () => row.getValue("status"));
        },
    },
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

const items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
}));

const onUpdatePage = (page: number) => {
    params.value.page = page;
};

onMounted(async () => {
    if (vendor.value == null) {
        await getVendorByOwnerUserId();
    }
    if (vendor.value) {
        await getPoolByVendorID(params.value);
    }
});

watch(
    () => params.value.page,
    (page) => {
        getPoolByVendorID(params.value);
    },
);
</script>

<template>
    <div class="w-full flex-1">
        <div class="w-full flex justify-end items-center mb-3">
            <UButton label="New Pool" icon="i-lucide-plus" size="md" color="primary" variant="solid" @click="showModal" />
        </div>

        <!-- <UScrollArea
            v-slot="{ item, index }"
            :items="items"
            orientation="horizontal"
            class="w-full my-3 data-[orientation=vertical]:h-10"
        >
            <UBadge class="mr-1" color="neutral" variant="outline" size="lg">{{
                item.title
            }}</UBadge>
        </UScrollArea> -->

        <UTable sticky :data="pools" :columns="columns" class="flex-1 h-[75vh] border border-accented rounded-lg" :loading="isLoading('getPoolByVendorID')" />
        <div class="h-auto flex justify-end mt-3">
            <UPagination v-model:page="poolsPagination.current_page" :total="poolsPagination.total_pages" @update:page="onUpdatePage" />
        </div>
    </div>

    <FormNewPool v-model:open="open" @submit="(data: any) => handleSubmit(data)" @close="closeModal" :data="editPool" />
    <ModalDeleteConfirmation v-model:open="deleteOpen" title="Delete Pool" :itemName="editPool?.name" confirmLabel="Delete" @delete="handleDelete" />
</template>
