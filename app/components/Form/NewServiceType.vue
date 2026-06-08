<script setup lang="ts">
import type { ServiceType, ServiceTypeForm } from "~/models";
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
    data?: ServiceType;
}>();

const emit = defineEmits<{
    submit: [data: ServiceTypeForm];
    close: [];
}>();

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    unique_code: z.string().min(1, "Unique code is required"),
    description: z.string(),
    need_chair: z.boolean(),
    need_pickup_address: z.boolean(),
    need_dropoff_address: z.boolean(),
});

const initialState: ServiceTypeForm = {
    name: "",
    unique_code: "",
    description: "",
    need_chair: false,
    need_pickup_address: false,
    need_dropoff_address: false,
};

const state = reactive<ServiceTypeForm>({ ...initialState });

const resetForm = () => {
    Object.assign(state, { ...initialState });
};

const close = () => {
    open.value = false;
    emit("close");
    resetForm();
};

const onSubmit = async (event: FormSubmitEvent<ServiceTypeForm>) => {
    console.log("submit", event.data);
    emit("submit", event.data);
    open.value = false;
    resetForm();
};

watch(
    () => props.data,
    (newData) => {
        if (newData) {
            Object.assign(state, {
                name: newData.name ?? "",
                unique_code: newData.unique_code ?? "",
                description: newData.description ?? "",
                need_chair: newData.need_chair ?? false,
                need_pickup_address: newData.need_pickup_address ?? false,
                need_dropoff_address: newData.need_dropoff_address ?? false,
            });
        } else {
            resetForm();
        }
    },
    { immediate: true },
);

watch(open, (val) => {
    if (!val) resetForm();
});
</script>

<template>
    <UModal
        v-model:open="open"
        :close="{ onClick: () => close() }"
        :title="props.data ? 'Edit Service Type' : 'Tambah Service Type'"
        :description="
            props.data
                ? 'Ubah data service type'
                : 'Isi data untuk membuat service type baru'
        "
        :ui="{
            footer: 'justify-end',
        }"
    >
        <template #body>
            <UForm
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                :id="props.data ? 'update-service-type' : 'create-service-type'"
            >
                <div class="grid grid-cols-1 gap-4">
                    <UFormField label="Name" name="name" required>
                        <UInput
                            v-model="state.name"
                            placeholder="Service Type Name"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Unique Code" name="unique_code" required>
                        <UInput
                            v-model="state.unique_code"
                            placeholder="e.g. FLT, TRN"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Description" name="description">
                        <UTextarea
                            v-model="state.description"
                            placeholder="Description"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Need Chair" name="need_chair">
                        <UCheckbox v-model="state.need_chair" />
                    </UFormField>

                    <UFormField
                        label="Need Pickup Address"
                        name="need_pickup_address"
                    >
                        <UCheckbox v-model="state.need_pickup_address" />
                    </UFormField>

                    <UFormField
                        label="Need Dropoff Address"
                        name="need_dropoff_address"
                    >
                        <UCheckbox v-model="state.need_dropoff_address" />
                    </UFormField>
                </div>
            </UForm>
        </template>

        <template #footer>
            <UButton
                label="Batal"
                color="neutral"
                variant="outline"
                @click="close"
            />
            <UButton
                type="submit"
                label="Save"
                color="primary"
                :form="
                    props.data ? 'update-service-type' : 'create-service-type'
                "
            />
        </template>
    </UModal>
</template>
