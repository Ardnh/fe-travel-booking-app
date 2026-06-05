<script setup lang="ts">
import { getLayoutsColumns } from "~/constants";
import type { TableColumn } from "@nuxt/ui";
import type {
    LayoutForm,
    Layouts,
    UpdateLayoutDto,
    CreateLayoutDto,
} from "~/models";

const toast = useToast();
const layoutsStore = useLayoutsStore();
const usersStore = useUsersStore();

const { layouts } = storeToRefs(layoutsStore);
const { userProfile } = storeToRefs(usersStore);

const {
    getAllLayouts,
    createLayout,
    deleteLayout,
    updateLayout,
    isLoading,
    getError,
} = layoutsStore;
const { getUserProfile } = usersStore;

const query = ref({
    page: 1,
    page_size: 30,
    search: "",
    sort_by: "created_at",
    sort_order: "DESC",
});

const open = ref(false);
const deleteOpen = ref(false);
const editLayout = ref<Layouts | undefined>(undefined);
const UButton = resolveComponent("UButton");

const columns: TableColumn<Layouts>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "grid_size_x", header: "Grid Size X" },
    { accessorKey: "grid_size_y", header: "Grid Size Y" },
    { accessorKey: "seat_count", header: "Seat Count" },
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
                        editLayout.value = row.original;
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
                        editLayout.value = row.original;
                        deleteOpen.value = true;
                    },
                }),
            ]),
    },
];

const showModal = () => {
    open.value = true;
};

const handleSubmit = async (data: LayoutForm) => {
    if (editLayout.value) {
        await handleUpdate(data);
    } else {
        await handleCreate(data);
    }
    open.value = false;
};

const handleCreate = async (data: LayoutForm) => {
    try {
        const createData: CreateLayoutDto = {
            name: data.name ?? "",
            grid_size_x: data.grid_size_x ?? 0,
            grid_size_y: data.grid_size_y ?? 0,
            seat_count: data.seat_count ?? 0,
            created_by: userProfile.value?.user_id ?? "",
        };

        await createLayout(createData);
    } catch {
        const error = getError("createLayout");
        if (error) {
            toast.add({
                title: "Failed to Create Layout",
                description: error,
                color: "error",
            });
        }
    }
};

const handleUpdate = async (data: LayoutForm) => {
    try {
        if (!editLayout.value) return;

        const id = editLayout.value.layout_id;
        const updateData: UpdateLayoutDto = {
            layout_id: id,
            ...data,
        };

        await updateLayout(id, updateData);
        editLayout.value = undefined;
    } catch {
        const error = getError("updateLayout");
        if (error) {
            toast.add({
                title: "Failed to Update Layout",
                description: error,
                color: "error",
            });
        }
    }
};

const handleDelete = async () => {
    try {
        if (!editLayout.value) return;

        const id = editLayout.value.layout_id;
        await deleteLayout(id);
        editLayout.value = undefined;
    } catch {
        const error = getError("deleteLayout");
        if (error) {
            toast.add({
                title: "Failed to Delete Layout",
                description: error,
                color: "error",
            });
        }
    }
};

definePageMeta({
    layout: "platform",
});

onMounted(async () => {
    await getAllLayouts(query.value);
});
</script>

<template>
    <div class="w-full flex justify-end items-center">
        <UButton
            label="Layout Editor"
            icon="i-lucide-plus"
            size="md"
            color="primary"
            variant="solid"
            @click="showModal()"
        />
        <UButton
            label="New Layouts"
            icon="i-lucide-plus"
            size="md"
            color="primary"
            variant="solid"
            @click="showModal()"
        />
    </div>

    <UTable
        :data="layouts"
        :columns="columns"
        class="flex-1 border border-gray-300 rounded-lg"
    />

    <FormNewLayouts
        v-model:open="open"
        @submit="(data: LayoutForm) => handleSubmit(data)"
        :data="editLayout"
    />

    <FormDeleteConfirmation v-model:open="deleteOpen" @delete="handleDelete" />
</template>
