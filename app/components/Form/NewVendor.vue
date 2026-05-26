<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{
    submit: [data: VendorForm];
}>();

const schema = z.object({
    business_name: z.string().min(3, "Minimal 3 karakter"),
    owner_name: z.string().min(3, "Minimal 3 karakter"),
    description: z.string().min(10, "Minimal 10 karakter"),
    founded_year: z
        .number({ invalid_type_error: "Harus berupa angka" })
        .min(1900, "Tahun tidak valid")
        .max(new Date().getFullYear(), "Tahun tidak boleh lebih dari sekarang"),
    phone_number: z
        .string()
        .min(10, "Minimal 10 digit")
        .regex(/^\+?[0-9]+$/, "Format nomor tidak valid"),
    email: z.string().email("Format email tidak valid"),
    head_office_address: z.string().min(10, "Minimal 10 karakter"),
    logo_url: z.string().url("Format URL tidak valid").or(z.literal("")),
    banner_url: z.string().url("Format URL tidak valid").or(z.literal("")),
    legal_document_number: z.string().min(5, "Minimal 5 karakter"),
});

type VendorForm = z.output<typeof schema>;

const initialState: VendorForm = {
    business_name: "",
    owner_name: "",
    description: "",
    founded_year: new Date().getFullYear(),
    phone_number: "",
    email: "",
    head_office_address: "",
    logo_url: "",
    banner_url: "",
    legal_document_number: "",
};

const state = reactive<VendorForm>({ ...initialState });
const loading = ref(false);

const resetForm = () => {
    Object.assign(state, { ...initialState });
};

const onSubmit = async (event: FormSubmitEvent<VendorForm>) => {
    loading.value = true;
    try {
        emit("submit", event.data);
        resetForm();
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
        title="Tambah Vendor Baru"
        description="Isi data vendor untuk mendaftarkan bisnis baru"
        :ui="{
            footer: 'justify-end',
            width: 'sm:max-w-2xl',
        }"
    >
        <template #body>
            <UForm
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmit"
                id="vendor-form"
            >
                <!-- Business Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormField
                        label="Nama Bisnis"
                        name="business_name"
                        required
                    >
                        <UInput
                            v-model="state.business_name"
                            placeholder="Bali Adventure Tours"
                            icon="i-lucide-building-2"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Nama Pemilik" name="owner_name" required>
                        <UInput
                            v-model="state.owner_name"
                            placeholder="Muhammad Ardan"
                            icon="i-lucide-user"
                            class="w-full"
                        />
                    </UFormField>
                </div>

                <UFormField label="Deskripsi" name="description" required>
                    <UTextarea
                        v-model="state.description"
                        placeholder="Penyedia jasa travel dan tour terpercaya..."
                        :rows="3"
                        class="w-full"
                    />
                </UFormField>

                <!-- Contact Info -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UFormField
                        label="Tahun Berdiri"
                        name="founded_year"
                        required
                    >
                        <UInput
                            v-model.number="state.founded_year"
                            type="number"
                            placeholder="2020"
                            icon="i-lucide-calendar"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField
                        label="No. Telepon"
                        name="phone_number"
                        required
                    >
                        <UInput
                            v-model="state.phone_number"
                            placeholder="+6281234567890"
                            icon="i-lucide-phone"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Email" name="email" required>
                        <UInput
                            v-model="state.email"
                            type="email"
                            placeholder="info@vendor.com"
                            icon="i-lucide-mail"
                            class="w-full"
                        />
                    </UFormField>
                </div>

                <UFormField
                    label="Alamat Kantor Pusat"
                    name="head_office_address"
                    required
                >
                    <UTextarea
                        v-model="state.head_office_address"
                        placeholder="Jl. Sunset Road No. 88, Kuta, Bali"
                        :rows="2"
                        class="w-full"
                    />
                </UFormField>

                <!-- Media URLs -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormField label="Logo URL" name="logo_url">
                        <UInput
                            v-model="state.logo_url"
                            placeholder="https://example.com/logo.png"
                            icon="i-lucide-image"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Banner URL" name="banner_url">
                        <UInput
                            v-model="state.banner_url"
                            placeholder="https://example.com/banner.jpg"
                            icon="i-lucide-panorama"
                            class="w-full"
                        />
                    </UFormField>
                </div>

                <UFormField
                    label="Nomor Dokumen Legal (NIB)"
                    name="legal_document_number"
                    required
                >
                    <UInput
                        v-model="state.legal_document_number"
                        placeholder="NIB-1234567890"
                        icon="i-lucide-file-text"
                        class="w-full"
                    />
                </UFormField>
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
                label="Simpan Vendor"
                color="primary"
                icon="i-lucide-save"
                type="submit"
                form="vendor-form"
                :loading="loading"
            />
        </template>
    </UModal>
</template>
