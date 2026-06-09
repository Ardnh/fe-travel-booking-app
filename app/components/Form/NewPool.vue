<script setup lang="ts">
import type { Pool, PoolForm } from "~/models";
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import { useAreaStore } from "~/stores/areaStore";

const areaStore = useAreaStore();
const { provinces, regencies, districts } = storeToRefs(areaStore);
const { getProvince, getRegencies, getDistricts } = areaStore;

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{ data?: Pool }>();
const emit = defineEmits<{ submit: [data: PoolForm] }>();

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    district: z.string().min(1, "District is required"),
    open_time: z.string().min(1, "Open time is required"),
    close_time: z.string().min(1, "Close time is required"),
    status: z.string(),
    description: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    embed_url: z
        .string()
        .refine(
            (v) =>
                v === "" || /^https:\/\/www\.google\.com\/maps\/embed/.test(v),
            "Embed Google Maps tidak valid",
        ),
});

const initialState: PoolForm = {
    name: "",
    address: "",
    province: "",
    city: "",
    district: "",
    open_time: "",
    close_time: "",
    status: "active",
    description: "",
    embed_url: "",
    latitude: undefined,
    longitude: undefined,
};

const state = reactive<PoolForm>({ ...initialState });

// --- input embed: tempel kode/URL -> ekstrak src + koordinat ---
const embedRaw = ref("");
watch(embedRaw, (val) => {
    const src = extractEmbedSrc(val);
    if (src) {
        state.embed_url = src;
        const coords = coordsFromEmbedSrc(src);
        if (coords) {
            state.latitude = coords.lat;
            state.longitude = coords.lng;
        }
    }
});

// --- province & city dari areaStore (cascading) ---
// CATATAN: asumsi tiap item punya { id, name } dan getRegencies(provinceId).
// Sesuaikan kalau bentuk data store-mu berbeda.
const selectedProvinceId = ref<string>("");
const selectedRegencyId = ref<string>("");
const selectedDistrictId = ref<string>("");

let hydrating = false;

const provinceItems = computed(() =>
    provinces.value.map((p) => ({ label: p.name, value: p.code })),
);
const regencyItems = computed(() =>
    regencies.value.map((r) => ({ label: r.name, value: r.code })),
);
const districtItems = computed(() =>
    districts.value.map((d) => ({ label: d.name, value: d.code })),
);

watch(selectedProvinceId, async (id) => {
    const prov = provinces.value.find((p) => String(p.code) === String(id));
    state.province = prov?.name ?? "";
    if (!hydrating) {
        selectedRegencyId.value = "";
        state.city = "";
    }
    if (id != null) await getRegencies(id);
});

watch(selectedRegencyId, async (id) => {
    const reg = regencies.value.find((r) => String(r.code) === String(id));
    state.city = reg?.name ?? "";
    if (!hydrating) {
        selectedDistrictId.value = "";
        state.district = "";
    }

    if (id != null) await getDistricts(id);
});

watch(selectedDistrictId, (id) => {
    const dist = districts.value.find((d) => String(d.code) === String(id));
    state.district = dist?.name ?? "";
});

async function hydrateRegencyArea(provName: string, cityName: string) {
    hydrating = true;
    try {
        if (!provinces.value.length) await getProvince();
        const prov = provinces.value.find((p) => p.name === provName);
        if (prov) {
            selectedProvinceId.value = prov.code;
            await getRegencies(prov.code);
            const reg = regencies.value.find((r) => r.name === cityName);
            if (reg) selectedRegencyId.value = reg.code;
        }
    } finally {
        hydrating = false;
    }
}

const resetForm = () => {
    Object.assign(state, { ...initialState });
    embedRaw.value = "";
    selectedProvinceId.value = "";
    selectedRegencyId.value = "";
};

const onSubmit = async (event: FormSubmitEvent<PoolForm>) => {
    emit("submit", { ...state });
    open.value = false;
    resetForm();
};

const close = () => {
    open.value = false;
    resetForm();
};

watch(
    () => props.data,
    (newData) => {
        if (newData) {
            Object.assign(state, {
                name: newData.name,
                province: newData.province,
                city: newData.city,
                district: newData.district,
                address: newData.address,
                open_time: newData.open_time,
                close_time: newData.close_time,
                status: newData.status,
                description: newData.description,
                embed_url: newData.embed_url ?? "",
                latitude: newData.latitude,
                longitude: newData.longitude,
            });
            embedRaw.value = newData.embed_url ?? "";
            if (newData.province)
                hydrateRegencyArea(newData.province, newData.city);
        } else {
            resetForm();
        }
    },
    { immediate: true },
);

watch(open, (val) => {
    if (!val) resetForm();
});

onMounted(() => {
    if (!provinces.value.length) getProvince();
});
</script>

<template>
    <UModal
        v-model:open="open"
        fullscreen
        :close="{ onClick: () => close() }"
        :title="props.data ? 'Edit Pool' : 'Tambah Pool'"
        :description="
            props.data ? 'Ubah data pool' : 'Isi data untuk membuat pool baru'
        "
        :ui="{ footer: 'justify-end' }"
    >
        <template #body>
            <div class="grid grid-cols-3 w-full h-full gap-3">
                <div class="p-5">
                    <UForm
                        :id="props.data ? 'update-pool' : 'create-pool'"
                        :schema="schema"
                        :state="state"
                        class="space-y-4"
                        @submit="onSubmit"
                    >
                        <div class="gap-4">
                            <UFormField label="Nama Pool" name="name" required>
                                <UInput
                                    v-model="state.name"
                                    placeholder="Nama Pool"
                                    icon="i-lucide-map-pin"
                                    class="w-full"
                                />
                            </UFormField>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <UFormField label="Status" name="status">
                                <USelect
                                    v-model="state.status"
                                    :items="[
                                        'active',
                                        'inactive',
                                        'suspended',
                                        'pending',
                                    ]"
                                    class="w-full"
                                />
                            </UFormField>
                            <UFormField
                                label="Provinsi"
                                name="province"
                                required
                            >
                                <USelectMenu
                                    v-model="selectedProvinceId"
                                    value-key="value"
                                    :items="provinceItems"
                                    placeholder="Pilih provinsi"
                                    class="w-full"
                                />
                            </UFormField>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <UFormField
                                label="Kota/Kabupaten"
                                name="city"
                                required
                            >
                                <USelectMenu
                                    v-model="selectedRegencyId"
                                    value-key="value"
                                    :items="regencyItems"
                                    :disabled="!selectedProvinceId"
                                    placeholder="Pilih kota/kabupaten"
                                    class="w-full"
                                />
                            </UFormField>

                            <UFormField
                                label="Kecamatan"
                                name="district"
                                required
                            >
                                <USelectMenu
                                    v-model="selectedDistrictId"
                                    value-key="value"
                                    :items="districtItems"
                                    :disabled="!selectedRegencyId"
                                    placeholder="Pilih kecamata n"
                                    class="w-full"
                                />
                            </UFormField>
                        </div>

                        <UFormField label="Alamat" name="address" required>
                            <UTextarea
                                v-model="state.address"
                                placeholder="Alamat lengkap"
                                :rows="2"
                                class="w-full"
                            />
                        </UFormField>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <UFormField
                                label="Jam Buka"
                                name="open_time"
                                required
                            >
                                <UInput
                                    v-model="state.open_time"
                                    type="time"
                                    class="w-full"
                                />
                            </UFormField>

                            <UFormField
                                label="Jam Tutup"
                                name="close_time"
                                required
                            >
                                <UInput
                                    v-model="state.close_time"
                                    type="time"
                                    class="w-full"
                                />
                            </UFormField>
                        </div>

                        <UFormField label="Deskripsi" name="description">
                            <UTextarea
                                v-model="state.description"
                                placeholder="Deskripsi pool"
                                :rows="3"
                                class="w-full"
                            />
                        </UFormField>

                        <UFormField
                            label="Lokasi (Embed Google Maps)"
                            name="embed_url"
                            help="Di Google Maps: Share → Embed a map → salin kode, tempel di sini."
                        >
                            <UTextarea
                                v-model="embedRaw"
                                placeholder="Tempel kode <iframe …> atau URL embed Google Maps"
                                :rows="3"
                                class="w-full"
                            />
                        </UFormField>
                    </UForm>
                </div>

                <div class="col-span-2 flex flex-col gap-2">
                    <iframe
                        v-if="state.embed_url"
                        :src="state.embed_url"
                        style="
                            border: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 15px;
                        "
                        allowfullscreen
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div
                        v-else
                        class="flex items-center justify-center w-full h-full rounded-[15px] bg-gray-100 text-gray-400 text-sm"
                    >
                        Tempel kode embed Google Maps untuk melihat pratinjau
                        peta
                    </div>
                    <p
                        v-if="state.latitude && state.longitude"
                        class="text-xs text-gray-500"
                    >
                        Koordinat terdeteksi: {{ state.latitude }},
                        {{ state.longitude }}
                    </p>
                </div>
            </div>
        </template>

        <template #footer="{ close }">
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
                :form="props.data ? 'update-pool' : 'create-pool'"
            />
        </template>
    </UModal>
</template>
