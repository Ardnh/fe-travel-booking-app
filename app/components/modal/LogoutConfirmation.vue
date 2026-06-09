<!-- components/form/LogoutConfirmation.vue -->
<script setup lang="ts">
const open = defineModel<boolean>("open", { default: false });

withDefaults(
    defineProps<{
        title?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        loading?: boolean;
    }>(),
    {
        title: "Konfirmasi Logout",
        confirmLabel: "Logout",
        cancelLabel: "Batal",
        loading: false,
    },
);

const emit = defineEmits<{
    confirm: [];
}>();

const onConfirm = () => {
    emit("confirm");
    open.value = false;
};
</script>

<template>
    <UModal v-model:open="open" :title="title" :dismissible="!loading" :ui="{ footer: 'justify-end', body: 'sm:max-w-md' }">
        <template #body>
            <div class="flex items-start gap-4">
                <div
                    class="shrink-0 size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"
                >
                    <UIcon
                        name="i-lucide-log-out"
                        class="size-5 text-orange-600 dark:text-orange-400"
                    />
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                    Apakah Anda yakin ingin logout? Anda perlu masuk kembali untuk mengakses akun Anda.
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
                icon="i-lucide-log-out"
                :loading="loading"
                @click="onConfirm"
            />
        </template>
    </UModal>
</template>
