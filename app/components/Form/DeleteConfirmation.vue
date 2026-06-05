<!-- components/DeleteConfirmModal.vue -->
<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });

withDefaults(
    defineProps<{
        title?: string;
        itemName?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        loading?: boolean;
    }>(),
    {
        title: "Konfirmasi Penghapusan",
        confirmLabel: "Hapus",
        cancelLabel: "Batal",
        loading: false,
    },
);

const emit = defineEmits<{
    delete: [];
}>();

const onConfirm = () => {
    emit("delete");
    open.value = false;
};
</script>

<template>
    <UModal
        v-model:open="open"
        :title="title"
        :dismissible="!loading"
        :ui="{ footer: 'justify-end', body: 'sm:max-w-md' }"
    >
        <template #body>
            <div class="flex items-start gap-4">
                <div
                    class="shrink-0 size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                >
                    <UIcon
                        name="i-lucide-triangle-alert"
                        class="size-5 text-red-600 dark:text-red-400"
                    />
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    <template v-if="itemName">
                        Apakah Anda yakin ingin menghapus
                        <span class="font-semibold">"{{ itemName }}"</span>?
                    </template>
                    <template v-else>
                        Apakah Anda yakin ingin menghapus item ini?
                    </template>
                    Data yang dihapus tidak dapat dikembalikan.
                </p>
            </div>
        </template>

        <template #footer="{ close }">
            <UButton
                :label="cancelLabel"
                color="neutral"
                variant="outline"
                :disabled="loading"
                @click="close"
            />
            <UButton
                :label="confirmLabel"
                color="error"
                icon="i-lucide-trash-2"
                :loading="loading"
                @click="onConfirm"
            />
        </template>
    </UModal>
</template>
