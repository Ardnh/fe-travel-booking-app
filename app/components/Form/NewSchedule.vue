<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import type { ScheduleBulkForm, TimeBand } from "../../models/dto/schedulesDto";
import { ScheduleBulkFormSchema } from "../../utils/schema/scheduleSchema";
import type { ScheduleBulkFormSchemaType } from "../../utils/schema/scheduleSchema";
import type { FormError, FormSubmitEvent, FormErrorEvent } from "@nuxt/ui";

const INITIAL_FORM_VALUES: Partial<ScheduleBulkForm> = {
    originPoolId: "",
    destinationMode: "city",
    destinationCity: undefined,
    destinationPoolIds: [],
    departureTimes: ["06:00", "09:00", "14:00", "20:00", "22:00"],
    validFrom: getCurrentDate(),
    validTo: "",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    layoutId: "",
    priceBands: [
        { label: "Pagi–Siang", from: "05:00", to: "17:00", price: 120000 },
        { label: "Malam", from: "17:00", to: "05:00", price: 150000 },
    ],
};

// --- Instance ───────────────────────────────────────────────────────────────
const poolsStore = usePoolsStore();
const layoutStore = useLayoutsStore();

const { getOriginPoolOptions, getDestinationPoolOptions, poolLocationsOptions, poolLocationsByVendor, poolsOptionsByVendor } = storeToRefs(poolsStore);
const { layoutOptions, layouts } = storeToRefs(layoutStore);
const { getPoolByVendorIdOptions, getAvailableLocationsByVendorID, setPoolCityName } = poolsStore;
const { getAllLayouts } = layoutStore;

// --- Fetch Data ───────────────────────────────────────────────────────────────
const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{ data?: ScheduleBulkForm }>();
const emit = defineEmits<{ submit: [data: ScheduleBulkForm] }>();

const close = () => {
    open.value = false;
};

const dayNames = ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"]; // index 0..6

// ── State form ─────────────────────────────────────────────────────────
const form = useTemplateRef("form");
const newTime = ref("");

const originPoolSearchTerm = ref("");
const destinationPoolSearchTerm = ref("");

// ── Helper ─────────────────────────────────────────────────────────────
const fmtRupiah = (n: number) => new Intl.NumberFormat("id-ID").format(n);
const timeToMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return (h ?? 0) * 60 + (m ?? 0);
};
// True kalau jam t berada di window [from, to). Menangani wrap tengah malam.
const inBand = (t: string, from: string, to: string) => {
    const x = timeToMin(t),
        a = timeToMin(from),
        b = timeToMin(to);
    return a <= b ? x >= a && x < b : x >= a || x < b;
};
const resolvePrice = (t: string) => formValues.priceBands?.find((band) => inBand(t, band.from, band.to))?.price ?? 0;

const addTime = () => {
    const t = newTime.value.trim();
    if (formValues.departureTimes && /^\d{2}:\d{2}$/.test(t) && !formValues.departureTimes.includes(t)) {
        formValues.departureTimes = [...formValues.departureTimes, t].sort();
        newTime.value = "";
    }
};
const removeTime = (t: string) => {
    formValues.departureTimes = formValues.departureTimes ? formValues.departureTimes.filter((x) => x !== t) : [];
};
const toggleDay = (d: number) => {
    formValues.daysOfWeek =
        formValues.daysOfWeek && formValues.daysOfWeek.includes(d) ? formValues.daysOfWeek.filter((x) => x !== d) : [...(formValues.daysOfWeek ?? []), d].sort();
};
const addBand = () => formValues.priceBands?.push({ label: "", from: "", to: "", price: 0 });
const removeBand = (i: number) => formValues.priceBands?.splice(i, 1);

// ── Turunan / preview ──────────────────────────────────────────────────
const totalSeat = computed(() => layouts.value.find((l) => l.layout_id === formValues.layoutId)?.seat_count ?? 0);

const destinationPools = computed(() => {
    if (formValues.destinationMode === "city") {
        const cityPools = poolLocationsByVendor.value.find((p) => p.city_name === formValues.destinationCity);
        return cityPools?.pools
            ? cityPools.pools.map((row) => {
                  return {
                      label: row.name,
                      value: row.pool_id,
                  };
              })
            : [];
    }

    // destinationPoolIds: string[] pools ids
    return (formValues.destinationPoolIds ?? [])
        .map((id) => {
            const pool = poolsOptionsByVendor.value.find((p) => p.pool_id === id);
            return pool ? { label: pool.name, value: pool.pool_id } : null;
        })
        .filter((p): p is { label: string; value: string } => p !== null);
});

const countPoolLocationsByCity = computed(() => {
    if (formValues.destinationMode === "city") {
        const selectedPoolCity = poolLocationsByVendor.value.find((p) => p.city_name === formValues.destinationCity);
        return selectedPoolCity ? selectedPoolCity.total_pools : 0;
    }

    return formValues.destinationPoolIds?.length ?? 0;
});

const matchingDates = computed(() => {
    if (!formValues.validFrom || !formValues.validTo) return [];

    const from = new Date(formValues.validFrom),
        to = new Date(formValues.validTo);
    const out: Date[] = [];
    if (Number.isNaN(+from) || Number.isNaN(+to) || to < from) return out;
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (formValues.daysOfWeek?.includes(d.getDay())) out.push(new Date(d));
    }
    return out;
});

const scheduleCount = computed(() => (formValues.departureTimes?.length ?? 0) * countPoolLocationsByCity.value * matchingDates.value.length);
const dayLabel = computed(() =>
    formValues.daysOfWeek && formValues.daysOfWeek.length === 7 ? "Setiap hari" : `${formValues.daysOfWeek ? formValues.daysOfWeek.length : 0} hari/minggu`,
);

// Contoh baris hasil generate (maks 5) — sekaligus memvalidasi resolusi harga
const previewRows = computed(() => {
    const rows: {
        date: string;
        pool: string;
        time: string;
        price: number;
        night: boolean;
    }[] = [];
    const fmtDate = (d: Date) => d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    const dates = matchingDates.value;

    outer: for (const d of dates) {
        for (const pool of destinationPools.value) {
            for (const t of formValues.departureTimes ?? []) {
                const price = resolvePrice(t);
                rows.push({
                    date: fmtDate(d),
                    pool: pool.label,
                    time: t,
                    price,
                    night: price >= 150000,
                });
                if (rows.length >= 5) break outer;
            }
        }
    }

    return rows;
});

// const onSubmit = (event: any) => {
//     console.log("submit event");
//     console.log(event);

//     // emit("submit", {
//     //     originPoolId: originPoolId.value,
//     //     destinationMode: destinationMode.value,
//     //     destinationCity: destinationMode.value === "city" ? destinationCity.value : undefined,
//     //     destinationPoolIds: destinationPools.value.map((p) => p.value),
//     //     departureTimes: toRaw(departureTimes.value),
//     //     validFrom: validFrom.value,
//     //     validTo: validTo.value,
//     //     daysOfWeek: toRaw(daysOfWeek.value),
//     //     layoutId: layoutId.value,
//     //     priceBands: toRaw(bands.value),
//     // });
// };

const onOpenOriginPoolMenu = async () => {
    if (getOriginPoolOptions.value.length == 0) {
        await getPoolByVendorIdOptions();
    }
};

const onUpdateOriginPoolSearchTerm = (val: string) => {
    originPoolSearchTerm.value = val;
};

watchDebounced(
    originPoolSearchTerm,
    (val) => {
        console.log("origin search term " + val);
    },
    { debounce: 500 },
);

const onOpenPoolByCityLocationMenu = async () => {
    if (poolLocationsOptions.value.length == 0) {
        await getAvailableLocationsByVendorID("city");
    }
};

const onUpdateDestinationCity = async (val: any) => {
    setPoolCityName(val);
};

const onOpenDestinationPoolLocationMenu = async () => {
    if (getDestinationPoolOptions.value.length == 0) {
        await getPoolByVendorIdOptions();
    }
};

const onSetDestinationMode = (mode: "city" | "pools") => {
    formValues.destinationMode = mode;
};

const onOpenLayoutMenu = async () => {
    if (layoutOptions.value.length == 0) {
        await getAllLayouts({
            page: 1,
            page_size: 50,
            search: "",
            sort_by: "",
            sort_order: "",
        });
    }
};

const formValues = reactive<Partial<ScheduleBulkFormSchemaType>>({
    originPoolId: undefined,
    destinationMode: "city",
    destinationCity: undefined,
    destinationPoolIds: [],
    departureTimes: ["06:00", "09:00", "14:00", "20:00", "22:00"],
    validFrom: getCurrentDate(),
    validTo: "",
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    layoutId: undefined,
    priceBands: [
        { label: "Pagi–Siang", from: "05:00", to: "17:00", price: 120000 },
        { label: "Malam", from: "17:00", to: "05:00", price: 150000 },
    ],
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<ScheduleBulkFormSchemaType>) {
    toast.add({ title: "Success", description: "The form has been submitted.", color: "success" });
    console.log(event.data);
}

async function onError(event: FormErrorEvent) {
    console.log(event.errors);
    // if (event?.errors?.[0]?.id) {
    //     const element = document.getElementById(event.errors[0].id);
    //     element?.focus();
    //     element?.scrollIntoView({ behavior: "smooth", block: "center" });
    // }
}
</script>
<template>
    <UModal
        v-model:open="open"
        fullscreen
        :close="{ onClick: () => close() }"
        :title="props.data ? 'Edit jadwal' : 'Buat jadwal massal'"
        :description="props.data ? 'Ubah pola jadwal' : 'Definisikan pola sekali — sistem expand jadi banyak jadwal'"
        :ui="{ footer: 'justify-end' }"
    >
        <template #body>
            <div class="mx-auto flex max-w-3xl flex-col gap-4">
                <UForm ref="form" :schema="ScheduleBulkFormSchema" :state="formValues" class="space-y-4" @submit="onSubmit" @error="onError">
                    <!-- Destination -->
                    <UCard variant="outline">
                        <template #header>
                            <span class="flex items-center gap-2 font-medium"> <UIcon name="i-lucide-route" /> Rute </span>
                        </template>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <UFormField label="Pool asal" name="originPoolId">
                                <USelectMenu
                                    v-model="formValues.originPoolId"
                                    :items="getOriginPoolOptions"
                                    @update:open="onOpenOriginPoolMenu"
                                    @update:searchTerm="onUpdateOriginPoolSearchTerm"
                                    clear
                                    value-key="value"
                                    placeholder="Select origin pool"
                                    class="w-full"
                                />
                            </UFormField>
                            <UFormField label="Tujuan">
                                <UFieldGroup class="w-full">
                                    <UButton
                                        label="Per kota"
                                        class="flex-1 justify-center"
                                        :color="formValues.destinationMode === 'city' ? 'primary' : 'neutral'"
                                        :variant="formValues.destinationMode === 'city' ? 'solid' : 'outline'"
                                        @click="onSetDestinationMode('city')"
                                    />
                                    <UButton
                                        label="Pilih pool"
                                        class="flex-1 justify-center"
                                        :color="formValues.destinationMode === 'pools' ? 'primary' : 'neutral'"
                                        :variant="formValues.destinationMode === 'pools' ? 'solid' : 'outline'"
                                        @click="onSetDestinationMode('pools')"
                                    />
                                </UFieldGroup>
                            </UFormField>
                        </div>

                        <UFormField label="Kota tujuan" class="mt-4">
                            <USelectMenu
                                v-model="formValues.destinationCity"
                                :items="poolLocationsOptions"
                                class="w-full"
                                value-key="value"
                                clear
                                @update:open="onOpenPoolByCityLocationMenu"
                                @update:modelValue="onUpdateDestinationCity"
                                placeholder="Select city"
                            />
                        </UFormField>

                        <USelectMenu
                            v-if="formValues.destinationMode === 'pools'"
                            v-model="formValues.destinationPoolIds"
                            multiple
                            clear
                            :items="getDestinationPoolOptions"
                            @update:open="onOpenDestinationPoolLocationMenu"
                            value-key="value"
                            placeholder="Select destination pool"
                            class="mt-3 w-full"
                        />

                        <p v-if="formValues.destinationMode === 'city'" class="mt-3 flex items-center gap-1.5 text-sm text-primary">
                            <UIcon name="i-lucide-info" />
                            Akan dibuat jadwal ke
                            {{ countPoolLocationsByCity }}
                            pool aktif di {{ formValues.destinationCity }}.
                        </p>
                    </UCard>

                    <!-- Departure -->
                    <UCard variant="outline">
                        <template #header>
                            <span class="flex items-center gap-2 font-medium"> <UIcon name="i-lucide-clock" /> Keberangkatan </span>
                        </template>

                        <UFormField label="Jam keberangkatan" name="departureTimes">
                            <div class="flex flex-wrap items-center gap-2">
                                <UBadge v-for="t in formValues.departureTimes ?? []" :key="t" color="neutral" variant="subtle" class="gap-1">
                                    {{ t }}
                                    <UIcon name="i-lucide-x" class="cursor-pointer" @click="removeTime(t)" />
                                </UBadge>
                                <UInput v-model="newTime" type="time" size="sm" class="w-28" @keydown.enter.prevent="addTime" />
                                <UButton icon="i-lucide-plus" size="sm" color="neutral" variant="ghost" label="Tambah" @click="addTime" />
                            </div>
                        </UFormField>

                        <div class="mt-4 grid gap-4 sm:grid-cols-2">
                            <UFormField label="Berlaku dari" name="validFrom">
                                <UInput v-model="formValues.validFrom" type="date" class="w-full" />
                            </UFormField>
                            <UFormField label="Sampai" name="validTo">
                                <UInput v-model="formValues.validTo" type="date" class="w-full" />
                            </UFormField>
                        </div>

                        <UFormField label="Pengulangan" class="mt-4" name="daysOfWeek">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <UButton
                                    v-for="(name, i) in dayNames"
                                    :key="i"
                                    :label="name"
                                    size="sm"
                                    class="w-10 justify-center"
                                    :color="formValues.daysOfWeek && formValues.daysOfWeek.includes(i) ? 'primary' : 'neutral'"
                                    :variant="formValues.daysOfWeek && formValues.daysOfWeek.includes(i) ? 'solid' : 'outline'"
                                    @click="toggleDay(i)"
                                />
                                <span class="ml-2 text-sm text-muted">{{ dayLabel }}</span>
                            </div>
                        </UFormField>
                    </UCard>

                    <!-- Layout -->
                    <UCard variant="outline">
                        <template #header>
                            <span class="flex items-center gap-2 font-medium"> <UIcon name="i-lucide-bus" /> Armada </span>
                        </template>
                        <div class="grid items-end gap-4 sm:grid-cols-[2fr_1fr]">
                            <UFormField label="Layout kursi" name="layoutId">
                                <USelect
                                    v-model="formValues.layoutId"
                                    :items="layoutOptions"
                                    @update:open="onOpenLayoutMenu"
                                    placeholder="Pilih layout kursi"
                                    valueKey="value"
                                    class="w-full"
                                />
                            </UFormField>
                            <div class="rounded-md bg-elevated px-3 py-2">
                                <p class="text-xs text-muted">Total kursi</p>
                                <p class="text-xl font-medium">{{ totalSeat }}</p>
                            </div>
                        </div>
                    </UCard>

                    <!-- Time Bands -->
                    <UCard variant="outline">
                        <template #header>
                            <span class="flex items-center gap-2 font-medium"> <UIcon name="i-lucide-banknote" /> Harga per time-band </span>
                        </template>

                        <div class="mb-1.5 grid grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr_auto] gap-2 text-xs text-dimmed">
                            <span>Label</span><span>Dari jam</span><span>Sampai jam</span> <span>Harga / kursi</span><span></span>
                        </div>
                        <div v-for="(band, i) in formValues.priceBands ?? []" :key="i" class="mb-2 grid grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr_auto] items-center gap-2">
                            <UInput v-model="band.label" placeholder="Label" />
                            <UInput v-model="band.from" type="time" />
                            <UInput v-model="band.to" type="time" />
                            <UInput v-model.number="band.price" type="number" :step="1000" />
                            <UButton icon="i-lucide-trash" color="neutral" variant="ghost" :disabled="(formValues.priceBands ?? []).length <= 1" @click="removeBand(i)" />
                        </div>

                        <p
                            v-if="formValues.priceBands?.some((b) => b.from && b.to && timeToMin(b.from) > timeToMin(b.to))"
                            class="mt-1 flex items-center gap-1.5 text-xs text-warning"
                        >
                            <UIcon name="i-lucide-moon" />
                            Band dengan jam awal lebih besar dari jam akhir melewati tengah malam.
                        </p>

                        <UButton icon="i-lucide-plus" size="sm" color="neutral" variant="outline" label="Tambah band" class="mt-3" @click="addBand" />
                    </UCard>

                    <!-- Preview -->
                    <div class="rounded-lg bg-primary-50 p-4 dark:bg-primary-950/40">
                        <div class="mb-1 flex items-baseline gap-2.5">
                            <span class="text-3xl font-medium text-primary">
                                {{ fmtRupiah(scheduleCount) }}
                            </span>
                            <span class="text-sm text-primary">jadwal akan dibuat</span>
                        </div>
                        <p class="mb-3.5 text-sm text-primary/80">
                            {{ formValues.departureTimes?.length ?? 0 }} jam × {{ countPoolLocationsByCity }} pool tujuan × {{ matchingDates.length }} hari
                        </p>

                        <div class="overflow-hidden rounded-md bg-default">
                            <table class="w-full table-fixed text-sm">
                                <thead>
                                    <tr class="text-xs text-muted">
                                        <th class="px-3 py-2 text-left font-normal">Tanggal</th>
                                        <th class="px-3 py-2 text-left font-normal">Pool tujuan</th>
                                        <th class="px-3 py-2 text-left font-normal">Jam</th>
                                        <th class="px-3 py-2 text-right font-normal">Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, i) in previewRows" :key="i" class="border-t border-default">
                                        <td class="px-3 py-2">{{ row.date }}</td>
                                        <td class="px-3 py-2">{{ row.pool }}</td>
                                        <td class="px-3 py-2">{{ row.time }}</td>
                                        <td class="px-3 py-2 text-right" :class="row.night ? 'font-medium text-warning' : ''">
                                            {{ fmtRupiah(row.price) }}
                                        </td>
                                    </tr>
                                    <tr v-if="!previewRows.length">
                                        <td colspan="4" class="px-3 py-3 text-center text-sm text-muted">Lengkapi rute, jam, tanggal, dan harga untuk melihat preview.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </UForm>
            </div>
        </template>
        <template #footer>
            <UButton @click="form?.submit()">Simpan</UButton>
        </template>
    </UModal>
</template>
