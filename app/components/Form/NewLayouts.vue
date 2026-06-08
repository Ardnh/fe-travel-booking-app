<script setup lang="ts">
import { z } from "zod";
import type { LayoutForm, Layouts, Cell } from "~/models";
import type { FormSubmitEvent } from "@nuxt/ui";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
    data?: Layouts;
}>();

const emit = defineEmits<{
    submit: [data: LayoutForm];
    close: [];
}>();

const schema = z.object({
    name: z.string().min(3, "Minimal 3 karakter"),
    grid_size_x: z
        .number("Harus berupa angka")
        .min(1, "Minimal 3")
        .max(20, "Maksimal 20"),
    grid_size_y: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(20, "Maksimal 20"),
    seat_count: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(500, "Maksimal 500"),
    layout_config: z.array(z.array(z.any())),
});

const initialCell = ref<Cell>({
    type: "seat",
    row: 1,
    col: 1,
    id: "1-1",
    status: "available",
    isWindow: false,
    windowPosition: "right",
});

const initialState: LayoutForm = {
    name: "",
    grid_size_x: 1,
    grid_size_y: 1,
    seat_count: 1,
    layout_config: [[{ ...initialCell.value }]],
};

const state = reactive<LayoutForm>({ ...initialState });
const loading = ref(false);
const selected = ref<Set<string>>(new Set());
const isAssigning = ref(false);

function toggleSeat(cell: Cell) {
    if (cell.status !== "available" || !cell.id) return;
    if (selected.value.has(cell.id)) selected.value.delete(cell.id);
    else selected.value.add(cell.id);
}

function seatClass(cell: Cell): string {
    if (cell.id && selected.value.has(cell.id))
        return "bg-emerald-500 text-white border-emerald-600";
    switch (cell.status) {
        case "booked":
            return "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed";
        case "blocked":
            return "bg-red-100 text-red-400 border-red-200 cursor-not-allowed";
        default:
            return "bg-white text-slate-700 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50";
    }
}

const resetForm = () => {
    Object.assign(state, { ...initialState });
};

const close = () => {
    open.value = false;
    emit("close");
    resetForm();
};

const onSubmit = async (event: FormSubmitEvent<LayoutForm>) => {
    loading.value = true;
    try {
        emit("submit", event.data);
    } finally {
        loading.value = false;
        open.value = false;
        resetForm();
    }
};

watch(
    () => props.data,
    (newData) => {
        if (newData) {
            isAssigning.value = true;
            Object.assign(state, { ...newData });

            nextTick(() => {
                isAssigning.value = false;
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

watch(
    () => state.grid_size_x,
    (newVal, oldVal) => {
        if (newVal > oldVal) {
            if (isAssigning.value) return;
            // Tambah row baru sebanyak selisihnya
            const colLength =
                state.layout_config[0]?.length ?? state.grid_size_y;

            const additionalRows = Array.from(
                { length: newVal - oldVal },
                (_, rowOffset) =>
                    Array.from({ length: colLength }, (_, colIndex) => ({
                        ...initialCell.value,
                        id: `${state.layout_config.length + rowOffset + 1}-${colIndex + 1}`,
                        row: state.layout_config.length + rowOffset,
                        col: colIndex,
                    })),
            );

            state.layout_config = [...state.layout_config, ...additionalRows];
        } else {
            // Kurangi row dari belakang
            state.layout_config = state.layout_config.slice(0, newVal);
        }

        // console.log("layouts", state.layouts);
    },
);

watch(
    () => state.grid_size_y,
    (newVal, oldVal) => {
        if (newVal > oldVal) {
            if (isAssigning.value) return;
            // Tambah col baru di setiap row sebanyak selisihnya
            state.layout_config = state.layout_config.map((row, rowIndex) => {
                const additionalCols = Array.from(
                    { length: newVal - oldVal },
                    (_, colOffset) => ({
                        ...initialCell.value,
                        id: `${rowIndex + 1}-${row.length + colOffset + 1}`,
                        row: rowIndex,
                        col: row.length + colOffset,
                    }),
                );
                return [...row, ...additionalCols];
            });
        } else {
            // Kurangi col dari belakang di setiap row
            state.layout_config = state.layout_config.map((row) =>
                row.slice(0, newVal),
            );
        }

        // console.log("layouts", state.layouts);
    },
);
</script>

<template>
    <UModal
        v-model:open="open"
        :close="{ onClick: () => close() }"
        fullscreen
        :title="props.data ? 'Edit Layout' : 'Tambah Layout Baru'"
        :description="
            props.data
                ? 'Ubah data layout kursi'
                : 'Isi data layout untuk membuat layout kursi baru'
        "
        :ui="{
            footer: 'justify-end',
        }"
    >
        <template #body>
            <div class="grid grid-cols-3 gap-3 w-full h-full">
                <div class="">
                    <UForm
                        :id="
                            props.data
                                ? 'update-layout-form'
                                : 'create-layout-form'
                        "
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
                            <UFormField label="Baris" name="row" required>
                                <UInput
                                    v-model.number="state.grid_size_x"
                                    type="number"
                                    placeholder="4"
                                    icon="i-lucide-grid-2x2"
                                    class="w-full"
                                />
                            </UFormField>

                            <UFormField label="Kolom" name="col" required>
                                <UInput
                                    v-model.number="state.grid_size_y"
                                    type="number"
                                    placeholder="7"
                                    icon="i-lucide-grid-3x3"
                                    class="w-full"
                                />
                            </UFormField>

                            <UFormField
                                label="Jumlah Kursi"
                                name="seat_count"
                                required
                            >
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
                    <div class="flex gap-2 mt-4 w-full justify-end">
                        <UButton
                            label="Batal"
                            color="neutral"
                            variant="outline"
                            :disabled="loading"
                            @click="close"
                        />
                        <UButton
                            label="Reset"
                            color="neutral"
                            variant="outline"
                            :disabled="loading"
                            @click="resetForm"
                        />
                        <UButton
                            :label="
                                props.data ? 'Update Layout' : 'Simpan Layout'
                            "
                            color="primary"
                            icon="i-lucide-layout-grid"
                            type="submit"
                            :form="
                                props.data
                                    ? 'update-layout-form'
                                    : 'create-layout-form'
                            "
                            :loading="loading"
                        />
                    </div>
                </div>
                <div
                    class="col-span-2 w-full min-h-full h-auto overflow-auto bg-olive-100 rounded-xl p-3"
                >
                    <div
                        v-for="(row, rowIndex) in state.layout_config"
                        class="flex justify-start items-start"
                        :key="rowIndex"
                        :style="{
                            gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                        }"
                    >
                        <div
                            v-for="(cell, colIndex) in row"
                            :key="colIndex"
                            class="flex items-start justify-start"
                        >
                            <!-- KURSI -->
                            <UPopover>
                                <div
                                    v-if="cell.type === 'seat'"
                                    type="button"
                                    class="relative m-3 flex h-28 w-28 items-center justify-center rounded-xl border text-sm font-medium transition"
                                    :class="seatClass(cell)"
                                    :disabled="
                                        cell.status === 'booked' ||
                                        cell.status === 'blocked'
                                    "
                                >
                                    <div
                                        v-if="cell.isWindow"
                                        class="absolute inset-y-0 my-auto h-[65px] w-[7px] rounded"
                                        :class="
                                            cell.windowPosition === 'right'
                                                ? '-right-[3px]'
                                                : '-left-[3px]'
                                        "
                                        style="background-color: AccentColor"
                                    />

                                    <div class="flex flex-col items-center">
                                        <div class="">{{ cell.id }}</div>
                                        <UIcon
                                            name="i-lucide-armchair"
                                            class="size-7"
                                        />
                                    </div>
                                </div>

                                <!-- SOPIR -->
                                <div
                                    v-else-if="cell.type === 'driver'"
                                    class="flex m-3 h-28 w-28 items-center justify-center rounded-xl border bg-slate-100 text-slate-500"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        class="h-10 w-10"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.7"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M5.6 9h12.8" />
                                        <path d="M9.5 14.5l-2.5 4" />
                                        <path d="M14.5 14.5l2.5 4" />
                                    </svg>
                                </div>

                                <!-- LORONG: dibiarkan kosong, membentuk gap -->
                                <div
                                    v-else
                                    class="flex m-3 h-28 w-28 items-center justify-center rounded-xl border bg-slate-100 border-slate-300"
                                >
                                    <!-- <UIcon name="i-lucide-squircle-dashed" class="size-10" /> -->
                                    <div class="">Isle</div>
                                </div>

                                <template #content>
                                    <div class="w-72 p-4 space-y-4">
                                        <!-- Header -->
                                        <div
                                            class="flex items-center justify-between border-b pb-2"
                                        >
                                            <span class="font-semibold text-sm"
                                                >Cell Config</span
                                            >
                                            <UBadge
                                                :label="cell.type"
                                                variant="soft"
                                            />
                                        </div>

                                        <!-- ID -->
                                        <UFormField label="ID">
                                            <UInput
                                                v-model="cell.id"
                                                placeholder="Seat ID"
                                                size="sm"
                                                class="w-full"
                                            />
                                        </UFormField>

                                        <!-- Type -->
                                        <UFormField label="Type">
                                            <USelect
                                                v-model="cell.type"
                                                :items="[
                                                    {
                                                        label: 'Seat',
                                                        value: 'seat',
                                                    },
                                                    {
                                                        label: 'Driver',
                                                        value: 'driver',
                                                    },
                                                    {
                                                        label: 'Aisle',
                                                        value: 'aisle',
                                                    },
                                                ]"
                                                size="sm"
                                                class="w-full"
                                            />
                                        </UFormField>

                                        <!-- Status — hanya muncul jika type seat -->
                                        <UFormField
                                            v-if="cell.type === 'seat'"
                                            label="Status"
                                        >
                                            <USelect
                                                v-model="cell.status"
                                                :items="[
                                                    {
                                                        label: 'Available',
                                                        value: 'available',
                                                    },
                                                    {
                                                        label: 'Booked',
                                                        value: 'booked',
                                                    },
                                                    {
                                                        label: 'Blocked',
                                                        value: 'blocked',
                                                    },
                                                    {
                                                        label: 'Selected',
                                                        value: 'selected',
                                                    },
                                                ]"
                                                size="sm"
                                                class="w-full"
                                            />
                                        </UFormField>

                                        <!-- Is Window -->
                                        <UFormField
                                            v-if="cell.type === 'seat'"
                                            label="Window Seat"
                                        >
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <UCheckbox
                                                    v-model="cell.isWindow"
                                                />
                                                <span
                                                    class="text-xs text-gray-500"
                                                    >{{
                                                        cell.isWindow
                                                            ? "Yes"
                                                            : "No"
                                                    }}</span
                                                >
                                            </div>
                                        </UFormField>

                                        <!-- Window Position — hanya muncul jika isWindow true -->
                                        <UFormField
                                            v-if="
                                                cell.type === 'seat' &&
                                                cell.isWindow
                                            "
                                            label="Window Position"
                                        >
                                            <USelect
                                                v-model="cell.windowPosition"
                                                :items="[
                                                    {
                                                        label: 'Left',
                                                        value: 'left',
                                                    },
                                                    {
                                                        label: 'Right',
                                                        value: 'right',
                                                    },
                                                ]"
                                                size="sm"
                                                class="w-full"
                                            />
                                        </UFormField>

                                        <!-- Row & Col (readonly info) -->
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormField label="Row">
                                                <UInput
                                                    :model-value="cell.row"
                                                    size="sm"
                                                    disabled
                                                    class="w-full"
                                                />
                                            </UFormField>
                                            <UFormField label="Col">
                                                <UInput
                                                    :model-value="cell.col"
                                                    size="sm"
                                                    disabled
                                                    class="w-full"
                                                />
                                            </UFormField>
                                        </div>

                                        <!-- Actions -->
                                        <!-- <div class="flex gap-2 border-t pt-3">
                                            <UButton size="sm" class="flex-1" @click="applyChanges">Apply</UButton>
                                            <UButton size="sm" variant="outline" class="flex-1" @click="resetChanges">Reset</UButton>
                                        </div> -->
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                    </div>

                    <p v-if="selected.size" class="mt-2 text-sm text-slate-600">
                        Dipilih: {{ [...selected].join(", ") }}
                    </p>
                </div>
            </div>
        </template>
    </UModal>
</template>
