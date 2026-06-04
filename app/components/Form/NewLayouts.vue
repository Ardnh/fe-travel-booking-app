<script setup lang="ts">
import { z } from "zod";
import type { LayoutForm } from "~/models";

import type { FormSubmitEvent } from "@nuxt/ui";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
    data?: LayoutForm | null;
}>();

const emit = defineEmits<{
    submit: [mode: "create" | "update", data: LayoutForm];
}>();

const schema = z.object({
    name: z.string().min(3, "Minimal 3 karakter"),
    grid_size_x: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(20, "Maksimal 20"),
    grid_size_y: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(20, "Maksimal 20"),
    seat_count: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(500, "Maksimal 500"),
});

const initialState: LayoutForm = {
    name: "",
    grid_size_x: 1,
    grid_size_y: 1,
    seat_count: 1,
};

const state = reactive<LayoutForm>({ ...initialState });
const loading = ref(false);
const mode = ref<"create" | "update">("create");

watch(
    () => props.data,
    (newData) => {
        if (newData) {
            Object.assign(state, { ...newData });
            mode.value = "update";
        } else {
            resetForm();
        }
    },
    { immediate: true },
);

const resetForm = () => {
    Object.assign(state, { ...initialState });
    mode.value = "create";
};

const onSubmit = async (event: FormSubmitEvent<LayoutForm>) => {
    loading.value = true;
    try {
        emit("submit", mode.value, event.data);
        open.value = false;
    } finally {
        loading.value = false;
    }
};

watch(open, (val) => {
    if (!val) resetForm();
});
</script>

<template>
    <UModal
        v-model:open="open"
        :title="props.data ? 'Edit Layout' : 'Tambah Layout Baru'"
        :description="
            props.data
                ? 'Ubah data layout kursi'
                : 'Isi data layout untuk membuat layout kursi baru'
        "
        :ui="{
            footer: 'justify-end',
            body: 'sm:max-w-2xl',
        }"
    >
        <template #body>
            <UForm
                :id="props.data ? 'update-layout-form' : 'create-layout-form'"
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                class="space-y-4"
            >
                <UFormField label="Nama Layout" name="name" required>
                    <UInput
                        v-model="state.name"
                        placeholder="Elf"
                        icon="i-lucide-layout-grid"
                        class="w-full"
                    />
                </UFormField>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UFormField label="Grid Size X" name="gridSizeX" required>
                        <UInput
                            v-model.number="state.grid_size_x"
                            type="number"
                            placeholder="4"
                            icon="i-lucide-grid-2x2"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Grid Size Y" name="gridSizeY" required>
                        <UInput
                            v-model.number="state.grid_size_y"
                            type="number"
                            placeholder="7"
                            icon="i-lucide-grid-3x3"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Jumlah Kursi" name="seatCount" required>
                        <UInput
                            v-model.number="state.seat_count"
                            type="number"
                            placeholder="20"
                            icon="i-lucide-armchair"
                            class="w-full"
                        />
                    </UFormField>
                </div>
            </UForm>
        </template>

        <template #footer="{ close }">
            <UButton
                label="Batal"
                color="neutral"
                variant="outline"
                :disabled="loading"
                @click="close"
            />
            <UButton
                :label="props.data ? 'Update Layout' : 'Simpan Layout'"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                :form="props.data ? 'update-layout-form' : 'create-layout-form'"
                :loading="loading"
            />
        </template>
    </UModal>
</template>
