<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import type { Cell } from "~/models";

definePageMeta({
    layout: "platform",
});

// HTML ONLY

const config: Cell[][] = [
    // Baris depan: pintu (kiri) — kabin kosong — sopir (kanan)
    [
        { type: "door", row: 0, col: 0 },
        { type: "isle", row: 0, col: 1 },
        { type: "isle", row: 0, col: 2 },
        { type: "isle", row: 0, col: 3 },
        { type: "driver", row: 0, col: 4 },
    ],
    // Baris penumpang: 2 + lorong + 2
    [
        {
            type: "seat",
            row: 1,
            col: 0,
            id: "1",
            status: "available",
            isWindow: true,
            windowPosition: "left",
        },
        { type: "seat", row: 1, col: 1, id: "2", status: "available" },
        { type: "isle", row: 1, col: 2 },
        { type: "seat", row: 1, col: 3, id: "3", status: "available" },
        {
            type: "seat",
            row: 1,
            col: 4,
            id: "4",
            status: "available",
            isWindow: true,
            windowPosition: "right",
        },
    ],
    [
        {
            type: "seat",
            row: 2,
            col: 0,
            id: "5",
            status: "available",
            isWindow: true,
            windowPosition: "left",
        },
        { type: "seat", row: 2, col: 1, id: "6", status: "booked" },
        { type: "isle", row: 2, col: 2 },
        { type: "seat", row: 2, col: 3, id: "7", status: "booked" },
        {
            type: "seat",
            row: 2,
            col: 4,
            id: "8",
            status: "available",
            isWindow: true,
            windowPosition: "right",
        },
    ],
    [
        {
            type: "seat",
            row: 3,
            col: 0,
            id: "9",
            status: "available",
            isWindow: true,
            windowPosition: "left",
        },
        { type: "seat", row: 3, col: 1, id: "10", status: "available" },
        { type: "isle", row: 3, col: 2 },
        { type: "seat", row: 3, col: 3, id: "11", status: "available" },
        {
            type: "seat",
            row: 3,
            col: 4,
            id: "12",
            status: "available",
            isWindow: true,
            windowPosition: "right",
        },
    ],
    [
        {
            type: "seat",
            row: 4,
            col: 0,
            id: "13",
            status: "available",
            isWindow: true,
            windowPosition: "left",
        },
        { type: "seat", row: 4, col: 1, id: "14", status: "available" },
        { type: "isle", row: 4, col: 2 },
        { type: "seat", row: 4, col: 3, id: "15", status: "available" },
        {
            type: "seat",
            row: 4,
            col: 4,
            id: "16",
            status: "available",
            isWindow: true,
            windowPosition: "right",
        },
    ],
    // Baris belakang: 5 kursi sejajar (tanpa lorong)
    [
        {
            type: "seat",
            row: 5,
            col: 0,
            id: "17",
            status: "available",
            isWindow: true,
            windowPosition: "left",
        },
        { type: "seat", row: 5, col: 1, id: "18", status: "available" },
        { type: "seat", row: 5, col: 2, id: "19", status: "available" },
        { type: "seat", row: 5, col: 3, id: "20", status: "available" },
        {
            type: "seat",
            row: 5,
            col: 4,
            id: "21",
            status: "available",
            isWindow: true,
            windowPosition: "right",
        },
    ],
];

const hiaceConfig: Cell[][] = [
    [
        { type: "seat", row: 0, col: 0, id: "1", status: "available", isWindow: true, windowPosition: "left" },
        { type: "isle", row: 0, col: 1 },
        { type: "isle", row: 0, col: 2 },
        { type: "driver", row: 0, col: 4 },
    ],
    [
        { type: "isle", row: 0, col: 4 },
        { type: "seat", row: 0, col: 0, id: "2", status: "available" },
        { type: "seat", row: 0, col: 1, id: "3", status: "available" },
        { type: "seat", row: 0, col: 2, id: "4", status: "available", isWindow: true, windowPosition: "right" },
    ],
    [
        { type: "seat", row: 0, col: 0, id: "5", status: "available", isWindow: true, windowPosition: "left" },
        { type: "isle", row: 0, col: 4 },
        { type: "seat", row: 0, col: 1, id: "6", status: "available" },
        { type: "seat", row: 0, col: 2, id: "7", status: "available", isWindow: true, windowPosition: "right" },
    ],
    [
        { type: "seat", row: 0, col: 0, id: "8", status: "available", isWindow: true, windowPosition: "left" },
        { type: "isle", row: 0, col: 4 },
        { type: "seat", row: 0, col: 1, id: "9", status: "available" },
        { type: "seat", row: 0, col: 2, id: "10", status: "available", isWindow: true, windowPosition: "right" },
    ],
    [
        { type: "seat", row: 0, col: 4, id: "11", status: "available", isWindow: true, windowPosition: "left" },
        { type: "seat", row: 0, col: 0, id: "12", status: "available" },
        { type: "seat", row: 0, col: 1, id: "13", status: "available" },
        { type: "seat", row: 0, col: 2, id: "14", status: "available", isWindow: true, windowPosition: "right" },
    ],
];

const selected = ref<Set<string>>(new Set());

function toggleSeat(cell: Cell) {
    if (cell.status !== "available" || !cell.id) return;
    if (selected.value.has(cell.id)) selected.value.delete(cell.id);
    else selected.value.add(cell.id);
}

function seatClass(cell: Cell): string {
    if (cell.id && selected.value.has(cell.id)) return "bg-emerald-500 text-white border-emerald-600";
    switch (cell.status) {
        case "booked":
            return "bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed";
        case "blocked":
            return "bg-red-100 text-red-400 border-red-200 cursor-not-allowed";
        default:
            return "bg-white text-slate-700 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50";
    }
}

const initialCell = ref<Cell>({
    type: "seat",
    row: 0,
    col: 0,
    id: "",
    status: "available",
    isWindow: false,
    windowPosition: "right",
});

const colCount = ref(1);
const rowCount = ref(1);
const layouts = ref<Cell[][]>([[{ ...initialCell.value }]]);

// function updateCell(updatedCell: Cell) {
//     layouts.value[updatedCell.row][updatedCell.col] = { ...updatedCell };
// }

// // Buat localCell sebagai salinan sementara saat popover dibuka
// const localCell = ref<Cell>({ ...cell });

// // Saat cell berubah dari luar, sync ke localCell
// watch(
//     () => cell,
//     (newCell) => {
//         localCell.value = { ...newCell };
//     },
//     { deep: true },
// );

// function applyChanges() {
//     // Emit ke parent untuk update layouts
//     emit("update:cell", { ...localCell.value });
// }

// function resetChanges() {
//     localCell.value = { ...cell };
// }
//

const saveLayout = () => {
    console.log("layout");
    console.log(JSON.stringify(layouts.value));
};

watch(
    () => rowCount.value,
    (newVal, oldVal) => {
        if (newVal > oldVal) {
            // Tambah row baru sebanyak selisihnya
            const colLength = layouts.value[0]?.length ?? colCount.value;

            const additionalRows = Array.from({ length: newVal - oldVal }, (_, rowOffset) =>
                Array.from({ length: colLength }, (_, colIndex) => ({
                    ...initialCell.value,
                    id: `seat-${layouts.value.length + rowOffset}-${colIndex}`,
                    row: layouts.value.length + rowOffset,
                    col: colIndex,
                })),
            );

            layouts.value = [...layouts.value, ...additionalRows];
        } else {
            // Kurangi row dari belakang
            layouts.value = layouts.value.slice(0, newVal);
        }

        console.log("layouts", layouts.value);
    },
);

watch(
    () => colCount.value,
    (newVal, oldVal) => {
        if (newVal > oldVal) {
            // Tambah col baru di setiap row sebanyak selisihnya
            layouts.value = layouts.value.map((row, rowIndex) => {
                const additionalCols = Array.from({ length: newVal - oldVal }, (_, colOffset) => ({
                    ...initialCell.value,
                    id: `seat-${rowIndex}-${row.length + colOffset}`,
                    row: rowIndex,
                    col: row.length + colOffset,
                }));
                return [...row, ...additionalCols];
            });
        } else {
            // Kurangi col dari belakang di setiap row
            layouts.value = layouts.value.map((row) => row.slice(0, newVal));
        }

        console.log("layouts", layouts.value);
    },
);
</script>

<template>
    <div class="editor">
        <div class="flex gap-2 mb-5">
            <div class="">
                <div class="">Column</div>
                <UInputNumber v-model="colCount" />
            </div>
            <div class="">
                <div class="">Row</div>
                <UInputNumber v-model="rowCount" />
            </div>
            <UButton @click="saveLayout">Save</UButton>
        </div>

        <div
            v-for="(row, rowIndex) in layouts"
            :key="rowIndex"
            class="grid gap-1 bg-amber-50 w-1/2 rounded-xl"
            :style="{
                gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }"
        >
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="flex items-center justify-center">
                <!-- KURSI -->
                <UPopover>
                    <button
                        v-if="cell.type === 'seat'"
                        type="button"
                        class="relative m-3 flex h-28 w-28 items-center justify-center rounded-xl border text-sm font-medium transition"
                        :class="seatClass(cell)"
                        :disabled="cell.status === 'booked' || cell.status === 'blocked'"
                        @click="toggleSeat(cell)"
                    >
                        {{ cell.id }}
                        <div
                            v-if="cell.isWindow"
                            class="absolute inset-y-0 my-auto h-[65px] w-[7px] rounded"
                            :class="cell.windowPosition === 'right' ? '-right-[3px]' : '-left-[3px]'"
                            style="background-color: AccentColor"
                        />
                    </button>

                    <!-- SOPIR -->
                    <div v-else-if="cell.type === 'driver'" class="m-3 flex h-28 w-28 items-center justify-center rounded-xl border bg-slate-100 text-slate-500">
                        <svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="3" />
                            <path d="M5.6 9h12.8" />
                            <path d="M9.5 14.5l-2.5 4" />
                            <path d="M14.5 14.5l2.5 4" />
                        </svg>
                    </div>

                    <!-- LORONG: dibiarkan kosong, membentuk gap -->
                    <div v-else class="m-3 h-28 w-6"></div>

                    <template #content>
                        <div class="w-72 p-4 space-y-4">
                            <!-- Header -->
                            <div class="flex items-center justify-between border-b pb-2">
                                <span class="font-semibold text-sm">Cell Config</span>
                                <UBadge :label="cell.type" variant="soft" />
                            </div>

                            <!-- ID -->
                            <UFormField label="ID">
                                <UInput v-model="cell.id" placeholder="Seat ID" size="sm" class="w-full" />
                            </UFormField>

                            <!-- Type -->
                            <UFormField label="Type">
                                <USelect
                                    v-model="cell.type"
                                    :items="[
                                        { label: 'Seat', value: 'seat' },
                                        { label: 'Driver', value: 'driver' },
                                        { label: 'Aisle', value: 'aisle' },
                                    ]"
                                    size="sm"
                                    class="w-full"
                                />
                            </UFormField>

                            <!-- Status — hanya muncul jika type seat -->
                            <UFormField v-if="cell.type === 'seat'" label="Status">
                                <USelect
                                    v-model="cell.status"
                                    :items="[
                                        { label: 'Available', value: 'available' },
                                        { label: 'Booked', value: 'booked' },
                                        { label: 'Blocked', value: 'blocked' },
                                        { label: 'Selected', value: 'selected' },
                                    ]"
                                    size="sm"
                                    class="w-full"
                                />
                            </UFormField>

                            <!-- Is Window -->
                            <UFormField v-if="cell.type === 'seat'" label="Window Seat">
                                <div class="flex items-center gap-2">
                                    <UCheckbox v-model="cell.isWindow" />
                                    <span class="text-xs text-gray-500">{{ cell.isWindow ? "Yes" : "No" }}</span>
                                </div>
                            </UFormField>

                            <!-- Window Position — hanya muncul jika isWindow true -->
                            <UFormField v-if="cell.type === 'seat' && cell.isWindow" label="Window Position">
                                <USelect
                                    v-model="cell.windowPosition"
                                    :items="[
                                        { label: 'Left', value: 'left' },
                                        { label: 'Right', value: 'right' },
                                    ]"
                                    size="sm"
                                    class="w-full"
                                />
                            </UFormField>

                            <!-- Row & Col (readonly info) -->
                            <div class="grid grid-cols-2 gap-2">
                                <UFormField label="Row">
                                    <UInput :model-value="cell.row" size="sm" disabled class="w-full" />
                                </UFormField>
                                <UFormField label="Col">
                                    <UInput :model-value="cell.col" size="sm" disabled class="w-full" />
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

        <p v-if="selected.size" class="mt-2 text-sm text-slate-600">Dipilih: {{ [...selected].join(", ") }}</p>
    </div>
</template>

<style scoped>
.editor {
    font-family: system-ui, sans-serif;
}
.toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
}
.toolbar button {
    padding: 6px 12px;
    border: 1px solid #cfcdc4;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
}
.toolbar button:hover {
    background: #f3f1ea;
}
.toolbar button.danger {
    color: #a32d2d;
    border-color: #e3b1b1;
}
.toolbar button.danger:hover:not(:disabled) {
    background: #fbeaea;
}
.toolbar button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}
.hint {
    font-size: 12px;
    color: #73726c;
    margin: 0 0 12px;
}
.canvas {
    border: 1px solid #e6e4dc;
    border-radius: 12px;
    background: #faf9f5;
    display: inline-block;
}
</style>
