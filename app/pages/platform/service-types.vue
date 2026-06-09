<script setup lang="ts">
import type {
    ServiceType,
    ServiceTypeForm,
    UpdateServiceTypeDTO,
    CreateServiceTypeDTO,
} from "~/models";
import type { TableColumn } from "@nuxt/ui";

definePageMeta({
    layout: "platform",
    ssr: false,
});

const toast = useToast();
const serviceTypesStore = useServiceTypesStore();
const usersStore = useUsersStore();

const { serviceTypes } = storeToRefs(serviceTypesStore);
const { userProfile } = storeToRefs(usersStore);

const {
    getAllServiceType,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    isLoading,
} = serviceTypesStore;

const query = ref({
    page: 1,
    page_size: 30,
    search: "",
    sort_by: "created_at",
    sort_order: "DESC",
});

const open = ref(false);
const deleteOpen = ref(false);
const editServiceType = ref<ServiceType | undefined>(undefined);
const UButton = resolveComponent("UButton");

const columns: TableColumn<ServiceType>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "unique_code", header: "Code" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "display_order", header: "Display Order" },
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
                        editServiceType.value = row.original;
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
                        editServiceType.value = row.original;
                        deleteOpen.value = true;
                    },
                }),
            ]),
    },
];

const showModal = () => {
    editServiceType.value = undefined;
    open.value = true;
};

const closeModal = () => {
    open.value = false;
    editServiceType.value = undefined;
};

const handleSubmit = async (data: ServiceTypeForm) => {
    try {
        if (editServiceType.value) {
            await updateServiceType(
                editServiceType.value.service_type_id,
                data as UpdateServiceTypeDTO,
            );
            toast.add({
                title: "Success",
                description: "Service Type updated successfully",
                color: "success",
            });
        } else {
            await createServiceType({
                ...(data as CreateServiceTypeDTO),
                created_by: userProfile.value?.user_id ?? "",
            });
            toast.add({
                title: "Success",
                description: "Service Type created successfully",
                color: "success",
            });
        }
    } catch {
        const key = editServiceType.value
            ? "updateServiceType"
            : "createServiceType";
        const error = serviceTypesStore.getError(key);
        if (error) {
            toast.add({
                title: "Failed to Save Service Type",
                description: error,
                color: "error",
            });
        }
    } finally {
        open.value = false;
        editServiceType.value = undefined;
    }
};

const handleDelete = async () => {
    try {
        if (!editServiceType.value) return;
        await deleteServiceType(editServiceType.value.service_type_id);
        toast.add({
            title: "Success",
            description: "Service Type deleted successfully",
            color: "success",
        });
    } catch {
        const error = serviceTypesStore.getError("deleteServiceType");
        if (error) {
            toast.add({
                title: "Failed to Delete Service Type",
                description: error,
                color: "error",
            });
        }
    } finally {
        deleteOpen.value = false;
        editServiceType.value = undefined;
    }
};

const { refresh } = await useAsyncData(
    "service-types",
    () => getAllServiceType(query.value),
    { server: false },
);

// onMounted(async () => {
//     console.log("mount service types");
//     await getAllServiceType(query.value);
// });
</script>

<template>
    <div class="w-full flex justify-end items-center gap-4 mb-3">
        <UButton
            label="New Service Type"
            icon="i-lucide-plus"
            size="md"
            color="primary"
            variant="solid"
            @click="showModal"
        />
    </div>

    <UTable
        :data="serviceTypes"
        :columns="columns"
        class="flex-1 border border-gray-300 rounded-lg"
        :loading="isLoading('getAllServiceType')"
    />

    <FormNewServiceType
        v-model:open="open"
        @submit="(data: any) => handleSubmit(data)"
        @close="closeModal"
        :data="editServiceType"
    />
    <ModalDeleteConfirmation
        v-model:open="deleteOpen"
        title="Delete Service Type"
        :itemName="editServiceType?.name"
        confirmLabel="Delete"
        @delete="handleDelete"
    />
</template>
