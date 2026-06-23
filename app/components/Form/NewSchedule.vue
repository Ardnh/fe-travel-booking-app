<script setup lang="ts">
import { user } from "#build/ui";

// ── Tipe ───────────────────────────────────────────────────────────────
interface TimeBand {
    label: string;
    from: string; // "05:00"
    to: string; // "17:00"  (kalau from > to → window melewati tengah malam)
    price: number;
}

interface ScheduleBulkForm {
    originPoolId: string;
    destinationMode: "city" | "pools";
    destinationCity?: string;
    destinationPoolIds: string[];
    departureTimes: string[];
    validFrom: string;
    validTo: string;
    daysOfWeek: number[]; // 0 = Minggu ... 6 = Sabtu
    layoutId: string;
    priceBands: TimeBand[];
}

// --- Instance ───────────────────────────────────────────────────────────────
const poolsStore = usePoolsStore();
const { poolOptions, poolLocationsOptions, poolLocations } =
    storeToRefs(poolsStore);
const { getPoolByVendorIdOptions, getAvailableLocationsByVendorID } =
    poolsStore;

// --- Fetch Data ───────────────────────────────────────────────────────────────

const open = defineModel<boolean>("open", { default: false });
const props = defineProps<{ data?: ScheduleBulkForm }>();
const emit = defineEmits<{ submit: [data: ScheduleBulkForm] }>();

const openPoolOptions = ref(false);

const close = () => {
    open.value = false;
};

// ── Data sumber (ganti dengan fetch sesungguhnya) ──────────────────────
const originPools = [
    { label: "Cikini — Jakarta Pusat", value: "pool-cikini" },
    { label: "Lebak Bulus — Jakarta Selatan", value: "pool-lebakbulus" },
];
// const cities = [
//     { label: "Bandung — Jawa Barat", value: "Bandung" },
//     { label: "Cirebon — Jawa Barat", value: "Cirebon" },
// ];
// Pool tujuan per kota — di produksi ambil dari API berdasar kota terpilih
// const poolsByCity: Record<string, { label: string; value: string }[]> = {
//     Bandung: [
//         { label: "Leuwipanjang", value: "pool-leuwipanjang" },
//         { label: "Cicaheum", value: "pool-cicaheum" },
//         { label: "Pasteur", value: "pool-pasteur" },
//         { label: "Dipatiukur", value: "pool-dipatiukur" },
//     ],
//     Cirebon: [
//         { label: "Harjamukti", value: "pool-harjamukti" },
//         { label: "Cirebon Kota", value: "pool-cirebonkota" },
//     ],
// };
const layouts = [
    { label: "Executive 2-2 · 32 kursi", value: "layout-exec32", seats: 32 },
    {
        label: "Super Executive 2-1 · 21 kursi",
        value: "layout-sexec21",
        seats: 21,
    },
];
const dayNames = ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"]; // index 0..6

// ── State form ─────────────────────────────────────────────────────────
const originPoolId = ref(props.data?.originPoolId ?? "");
const destinationMode = ref<"city" | "pools">(
    props.data?.destinationMode ?? "city",
);
const destinationCity = ref(props.data?.destinationCity ?? "");
const destinationPoolIds = ref<string[]>(props.data?.destinationPoolIds ?? []);
const departureTimes = ref<string[]>(
    props.data?.departureTimes ?? ["06:00", "09:00", "14:00", "20:00", "22:00"],
);
const newTime = ref("");
const validFrom = ref(props.data?.validFrom ?? "2026-07-01");
const validTo = ref(props.data?.validTo ?? "2026-09-14");
const daysOfWeek = ref<number[]>(
    props.data?.daysOfWeek ?? [0, 1, 2, 3, 4, 5, 6],
);
const layoutId = ref(props.data?.layoutId ?? "layout-exec32");
const bands = ref<TimeBand[]>(
    props.data?.priceBands ?? [
        { label: "Pagi–Siang", from: "05:00", to: "17:00", price: 120000 },
        { label: "Malam", from: "17:00", to: "05:00", price: 150000 },
    ],
);

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
const resolvePrice = (t: string) =>
    bands.value.find((band) => inBand(t, band.from, band.to))?.price ?? 0;

const addTime = () => {
    const t = newTime.value.trim();
    if (/^\d{2}:\d{2}$/.test(t) && !departureTimes.value.includes(t)) {
        departureTimes.value = [...departureTimes.value, t].sort();
        newTime.value = "";
    }
};
const removeTime = (t: string) => {
    departureTimes.value = departureTimes.value.filter((x) => x !== t);
};
const toggleDay = (d: number) => {
    daysOfWeek.value = daysOfWeek.value.includes(d)
        ? daysOfWeek.value.filter((x) => x !== d)
        : [...daysOfWeek.value, d].sort();
};
const addBand = () =>
    bands.value.push({ label: "", from: "", to: "", price: 0 });
const removeBand = (i: number) => bands.value.splice(i, 1);

// ── Turunan / preview ──────────────────────────────────────────────────
const totalSeat = computed(
    () => layouts.find((l) => l.value === layoutId.value)?.seats ?? 0,
);

const destinationPools = computed(() => {
    if (destinationMode.value === "city")
        return poolLocations.value[destinationCity.value] ?? [];
    return (poolsByCity[destinationCity.value] ?? []).filter((p) =>
        destinationPoolIds.value.includes(p.value),
    );
});

const countPoolLocationsByCity = computed(() => {
    const selectedPoolCity = poolLocations.value.find(
        (p) => p.city === destinationCity.value,
    );
    return selectedPoolCity ? selectedPoolCity.total_pool : 0;
});

const matchingDates = computed(() => {
    const from = new Date(validFrom.value),
        to = new Date(validTo.value);
    const out: Date[] = [];
    if (Number.isNaN(+from) || Number.isNaN(+to) || to < from) return out;
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (daysOfWeek.value.includes(d.getDay())) out.push(new Date(d));
    }
    return out;
});

const scheduleCount = computed(
    () =>
        departureTimes.value.length *
        countPoolLocationsByCity.value *
        matchingDates.value.length,
);

const dayLabel = computed(() =>
    daysOfWeek.value.length === 7
        ? "Setiap hari"
        : `${daysOfWeek.value.length} hari/minggu`,
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
    const fmtDate = (d: Date) =>
        d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    const dates = matchingDates.value;
    outer: for (const d of dates) {
        for (const pool of destinationPools.value) {
            for (const t of departureTimes.value) {
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

const submit = () => {
    emit("submit", {
        originPoolId: originPoolId.value,
        destinationMode: destinationMode.value,
        destinationCity:
            destinationMode.value === "city"
                ? destinationCity.value
                : undefined,
        destinationPoolIds: destinationPools.value.map((p) => p.value),
        departureTimes: departureTimes.value,
        validFrom: validFrom.value,
        validTo: validTo.value,
        daysOfWeek: daysOfWeek.value,
        layoutId: layoutId.value,
        priceBands: bands.value,
    });
};

const onOpenPoolMenu = async () => {
    if (poolOptions.value.length == 0) {
        await getPoolByVendorIdOptions();
    }
};

const onOpenLocationMenu = async () => {
    if (poolLocationsOptions.value.length == 0) {
        await getAvailableLocationsByVendorID("city");
    }
};
</script>

<template>
    <UModal
        v-model:open="open"
        fullscreen
        :close="{ onClick: () => close() }"
        :title="props.data ? 'Edit jadwal' : 'Buat jadwal massal'"
        :description="
            props.data
                ? 'Ubah pola jadwal'
                : 'Definisikan pola sekali — sistem expand jadi banyak jadwal'
        "
        :ui="{ footer: 'justify-end' }"
    >
        <template #body>
            <div class="mx-auto flex max-w-3xl flex-col gap-4">
                <!-- Rute -->
                <UCard variant="outline">
                    <template #header>
                        <span class="flex items-center gap-2 font-medium">
                            <UIcon name="i-lucide-route" /> Rute
                        </span>
                    </template>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <UFormField label="Pool asal">
                            <USelectMenu
                                v-model="originPoolId"
                                :items="poolOptions"
                                @update:open="onOpenPoolMenu"
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
                                    :color="
                                        destinationMode === 'city'
                                            ? 'primary'
                                            : 'neutral'
                                    "
                                    :variant="
                                        destinationMode === 'city'
                                            ? 'solid'
                                            : 'outline'
                                    "
                                    @click="destinationMode = 'city'"
                                />
                                <UButton
                                    label="Pilih pool"
                                    class="flex-1 justify-center"
                                    :color="
                                        destinationMode === 'pools'
                                            ? 'primary'
                                            : 'neutral'
                                    "
                                    :variant="
                                        destinationMode === 'pools'
                                            ? 'solid'
                                            : 'outline'
                                    "
                                    @click="destinationMode = 'pools'"
                                />
                            </UFieldGroup>
                        </UFormField>
                    </div>

                    <UFormField label="Kota tujuan" class="mt-4">
                        <USelectMenu
                            v-model="destinationCity"
                            :items="poolLocationsOptions"
                            class="w-full"
                            value-key="value"
                            @update:open="onOpenLocationMenu"
                            placeholder="Select city"
                        />
                    </UFormField>

                    <USelectMenu
                        v-if="destinationMode === 'pools'"
                        v-model="destinationPoolIds"
                        multiple
                        :items="poolOptions"
                        @update:open="onOpenPoolMenu"
                        value-key="value"
                        placeholder="Select origin pool"
                        class="mt-3 w-full"
                    />

                    <p
                        v-if="destinationMode === 'city'"
                        class="mt-3 flex items-center gap-1.5 text-sm text-primary"
                    >
                        <UIcon name="i-lucide-info" />
                        Akan dibuat jadwal ke
                        {{ countPoolLocationsByCity }}
                        pool aktif di {{ destinationCity }}.
                    </p>
                </UCard>

                <!-- Keberangkatan -->
                <UCard variant="outline">
                    <template #header>
                        <span class="flex items-center gap-2 font-medium">
                            <UIcon name="i-lucide-clock" /> Keberangkatan
                        </span>
                    </template>

                    <UFormField label="Jam keberangkatan">
                        <div class="flex flex-wrap items-center gap-2">
                            <UBadge
                                v-for="t in departureTimes"
                                :key="t"
                                color="neutral"
                                variant="subtle"
                                class="gap-1"
                            >
                                {{ t }}
                                <UIcon
                                    name="i-lucide-x"
                                    class="cursor-pointer"
                                    @click="removeTime(t)"
                                />
                            </UBadge>
                            <UInput
                                v-model="newTime"
                                type="time"
                                size="sm"
                                class="w-28"
                                @keydown.enter.prevent="addTime"
                            />
                            <UButton
                                icon="i-lucide-plus"
                                size="sm"
                                color="neutral"
                                variant="ghost"
                                label="Tambah"
                                @click="addTime"
                            />
                        </div>
                    </UFormField>

                    <div class="mt-4 grid gap-4 sm:grid-cols-2">
                        <UFormField label="Berlaku dari">
                            <UInput
                                v-model="validFrom"
                                type="date"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Sampai">
                            <UInput
                                v-model="validTo"
                                type="date"
                                class="w-full"
                            />
                        </UFormField>
                    </div>

                    <UFormField label="Pengulangan" class="mt-4">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <UButton
                                v-for="(name, i) in dayNames"
                                :key="i"
                                :label="name"
                                size="sm"
                                class="w-10 justify-center"
                                :color="
                                    daysOfWeek.includes(i)
                                        ? 'primary'
                                        : 'neutral'
                                "
                                :variant="
                                    daysOfWeek.includes(i) ? 'solid' : 'outline'
                                "
                                @click="toggleDay(i)"
                            />
                            <span class="ml-2 text-sm text-muted">{{
                                dayLabel
                            }}</span>
                        </div>
                    </UFormField>
                </UCard>

                <!-- Armada -->
                <UCard variant="outline">
                    <template #header>
                        <span class="flex items-center gap-2 font-medium">
                            <UIcon name="i-lucide-bus" /> Armada
                        </span>
                    </template>
                    <div class="grid items-end gap-4 sm:grid-cols-[2fr_1fr]">
                        <UFormField label="Layout kursi">
                            <USelect
                                v-model="layoutId"
                                :items="layouts"
                                class="w-full"
                            />
                        </UFormField>
                        <div class="rounded-md bg-elevated px-3 py-2">
                            <p class="text-xs text-muted">Total kursi</p>
                            <p class="text-xl font-medium">{{ totalSeat }}</p>
                        </div>
                    </div>
                </UCard>

                <!-- Harga per time-band -->
                <UCard variant="outline">
                    <template #header>
                        <span class="flex items-center gap-2 font-medium">
                            <UIcon name="i-lucide-banknote" /> Harga per
                            time-band
                        </span>
                    </template>

                    <div
                        class="mb-1.5 grid grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr_auto] gap-2 text-xs text-dimmed"
                    >
                        <span>Label</span><span>Dari jam</span
                        ><span>Sampai jam</span> <span>Harga / kursi</span
                        ><span></span>
                    </div>
                    <div
                        v-for="(band, i) in bands"
                        :key="i"
                        class="mb-2 grid grid-cols-[1.3fr_0.8fr_0.8fr_1.2fr_auto] items-center gap-2"
                    >
                        <UInput v-model="band.label" placeholder="Label" />
                        <UInput v-model="band.from" type="time" />
                        <UInput v-model="band.to" type="time" />
                        <UInput
                            v-model.number="band.price"
                            type="number"
                            :step="1000"
                        />
                        <UButton
                            icon="i-lucide-trash"
                            color="neutral"
                            variant="ghost"
                            :disabled="bands.length <= 1"
                            @click="removeBand(i)"
                        />
                    </div>

                    <p
                        v-if="
                            bands.some(
                                (b) =>
                                    b.from &&
                                    b.to &&
                                    timeToMin(b.from) > timeToMin(b.to),
                            )
                        "
                        class="mt-1 flex items-center gap-1.5 text-xs text-warning"
                    >
                        <UIcon name="i-lucide-moon" />
                        Band dengan jam awal lebih besar dari jam akhir melewati
                        tengah malam.
                    </p>

                    <UButton
                        icon="i-lucide-plus"
                        size="sm"
                        color="neutral"
                        variant="outline"
                        label="Tambah band"
                        class="mt-3"
                        @click="addBand"
                    />
                </UCard>

                <!-- Preview -->
                <div
                    class="rounded-lg bg-primary-50 p-4 dark:bg-primary-950/40"
                >
                    <div class="mb-1 flex items-baseline gap-2.5">
                        <span class="text-3xl font-medium text-primary">
                            {{ fmtRupiah(scheduleCount) }}
                        </span>
                        <span class="text-sm text-primary"
                            >jadwal akan dibuat</span
                        >
                    </div>
                    <p class="mb-3.5 text-sm text-primary/80">
                        {{ departureTimes.length }} jam ×
                        {{ countPoolLocationsByCity }} pool tujuan ×
                        {{ matchingDates.length }} hari
                    </p>

                    <div class="overflow-hidden rounded-md bg-default">
                        <table class="w-full table-fixed text-sm">
                            <thead>
                                <tr class="text-xs text-muted">
                                    <th class="px-3 py-2 text-left font-normal">
                                        Tanggal
                                    </th>
                                    <th class="px-3 py-2 text-left font-normal">
                                        Pool tujuan
                                    </th>
                                    <th class="px-3 py-2 text-left font-normal">
                                        Jam
                                    </th>
                                    <th
                                        class="px-3 py-2 text-right font-normal"
                                    >
                                        Harga
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(row, i) in previewRows"
                                    :key="i"
                                    class="border-t border-default"
                                >
                                    <td class="px-3 py-2">{{ row.date }}</td>
                                    <td class="px-3 py-2">{{ row.pool }}</td>
                                    <td class="px-3 py-2">{{ row.time }}</td>
                                    <td
                                        class="px-3 py-2 text-right"
                                        :class="
                                            row.night
                                                ? 'font-medium text-warning'
                                                : ''
                                        "
                                    >
                                        {{ fmtRupiah(row.price) }}
                                    </td>
                                </tr>
                                <tr v-if="!previewRows.length">
                                    <td
                                        colspan="4"
                                        class="px-3 py-3 text-center text-sm text-muted"
                                    >
                                        Lengkapi rute, jam, tanggal, dan harga
                                        untuk melihat preview.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <UButton
                label="Batal"
                color="neutral"
                variant="ghost"
                @click="close"
            />
            <UButton
                label="Generate jadwal"
                icon="i-lucide-zap"
                :disabled="!scheduleCount"
                @click="submit"
            />
        </template>
    </UModal>
</template>
