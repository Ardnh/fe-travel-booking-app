<!--
  SeatLayoutEditor.vue — editor layout kursi (Nuxt 3/4 + Vue 3 + TS) dgn vue-konva
  Preset: Daihatsu Luxio 8-seater, konfigurasi 3-3-2 (7 kursi penumpang + sopir), RHD.

  Setup:
    1) npm i vue-konva konva
    2) plugins/vue-konva.client.ts:
         import VueKonva from 'vue-konva'
         export default defineNuxtPlugin((nuxtApp) => { nuxtApp.vueApp.use(VueKonva) })
    3) nuxt.config.ts: export default defineNuxtConfig({ build: { transpile: ['konva'] } })

  Interaksi editor:
    - Kursi  : klik = pilih · dobel-klik = ubah status · seret = pindah (snap grid)
    - Hapus  : pilih kursi lalu klik tombol "Hapus kursi" atau tekan Delete / Backspace
    - Sopir  : seret = pindah (snap grid)
    - Pintu/jendela : seret = pindah ke sel lain · klik = ganti sisi (kiri/kanan/atas/bawah)
-->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

type SeatType = "seater" | "sleeper";
type SeatStatus = "available" | "booked" | "blocked";
type ElementType = "driver" | "door" | "window";
type Side = "left" | "right" | "top" | "bottom";

interface Seat {
    id: string;
    row: number;
    col: number;
    type: SeatType;
    status: SeatStatus;
}

interface LayoutElement {
    type: ElementType;
    row: number;
    col: number;
    side?: Side;
}

// --- konstanta grid ---
const CELL = 44;
const GAP = 10;
const STEP = CELL + GAP;
const ORIGIN_X = 30;
const ORIGIN_Y = 30;
const COLS = 3; // Luxio: 3 kolom (kiri / tengah / kanan)

const stageConfig = { width: 240, height: 240 };

// --- preset Luxio (3-3-2) ---
const seats = ref<Seat[]>([
    { id: "1", row: 0, col: 0, type: "seater", status: "available" },
    { id: "2", row: 0, col: 1, type: "seater", status: "available" },
    { id: "3", row: 1, col: 0, type: "seater", status: "available" },
    { id: "4", row: 1, col: 1, type: "seater", status: "available" },
    { id: "5", row: 1, col: 2, type: "seater", status: "available" },
    { id: "6", row: 2, col: 0, type: "seater", status: "available" },
    { id: "7", row: 2, col: 2, type: "seater", status: "available" },
]);

const elements = ref<LayoutElement[]>([
    { type: "driver", row: 0, col: 2 }, // RHD: setir di depan-kanan
    { type: "door", row: 0, col: 2, side: "right" }, // pintu sopir
    { type: "door", row: 0, col: 0, side: "left" }, // pintu penumpang depan
    { type: "door", row: 1, col: 0, side: "left" }, // pintu geser kiri
    { type: "door", row: 1, col: 2, side: "right" }, // pintu geser kanan
    { type: "window", row: 2, col: 0, side: "left" }, // jendela belakang kiri
    { type: "window", row: 2, col: 2, side: "right" }, // jendela belakang kanan
]);

definePageMeta({
    layout: "platform",
});

// id unik yang tidak pernah turun (aman walau ada kursi dihapus)
let seatCounter = seats.value.length;
const selectedId = ref<string | null>(null);

// --- helper posisi & warna ---
function xy(row: number, col: number) {
    return { x: ORIGIN_X + col * STEP, y: ORIGIN_Y + row * STEP };
}

function fillFor(s: Seat): string {
    if (s.status === "booked") return "#d3d1c7";
    if (s.status === "blocked") return "#f0c9c9";
    return "#ffffff";
}

function statusIcon(status: SeatStatus): string {
    switch (status) {
        case "booked":
            return "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0 M8 11v-4a4 4 0 1 1 8 0v4";
        case "blocked":
            return "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0 M5.7 5.7l12.6 12.6";
        default:
            return "M5 12l5 5l9 -11";
    }
}

function iconColor(status: SeatStatus): string {
    if (status === "booked") return "#73726c";
    if (status === "blocked") return "#a32d2d";
    return "#3b6d11";
}

const STEERING =
    "M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18 " +
    "M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0 -6 " +
    "M5.6 9h12.8 M9.5 14.5l-2.5 4 M14.5 14.5l2.5 4";

function elementBar(el: LayoutElement) {
    const isDoor = el.type === "door";
    const t = isDoor ? 7 : 3;
    const m = 7;
    const fill = isDoor ? "#185fa5" : "#85b7eb";
    const cornerRadius = isDoor ? 3 : 2;
    switch (el.side) {
        case "right":
            return {
                x: CELL - t / 2,
                y: m,
                width: t,
                height: CELL - 2 * m,
                fill,
                cornerRadius,
            };
        case "top":
            return {
                x: m,
                y: -t / 2,
                width: CELL - 2 * m,
                height: t,
                fill,
                cornerRadius,
            };
        case "bottom":
            return {
                x: m,
                y: CELL - t / 2,
                width: CELL - 2 * m,
                height: t,
                fill,
                cornerRadius,
            };
        default:
            return {
                x: -t / 2,
                y: m,
                width: t,
                height: CELL - 2 * m,
                fill,
                cornerRadius,
            }; // left
    }
}

// --- interaksi ---
function snapCell(node: {
    x(): number;
    y(): number;
    position(p: { x: number; y: number }): void;
}) {
    const col = Math.max(0, Math.round((node.x() - ORIGIN_X) / STEP));
    const row = Math.max(0, Math.round((node.y() - ORIGIN_Y) / STEP));
    node.position(xy(row, col));
    return { row, col };
}

function onSeatDragEnd(seat: Seat, e: { target: any }) {
    const { row, col } = snapCell(e.target);
    seat.row = row;
    seat.col = col;
}

function onElementDragEnd(el: LayoutElement, e: { target: any }) {
    const { row, col } = snapCell(e.target);
    el.row = row;
    el.col = col;
}

function selectSeat(seat: Seat, e: any) {
    e.cancelBubble = true; // jangan sampai ter-deselect oleh klik stage
    selectedId.value = seat.id;
}

function cycleStatus(seat: Seat) {
    const order: SeatStatus[] = ["available", "booked", "blocked"];
    seat.status = order[(order.indexOf(seat.status) + 1) % order.length];
}

function cycleSide(el: LayoutElement) {
    const order: Side[] = ["left", "right", "top", "bottom"];
    el.side = order[(order.indexOf(el.side ?? "left") + 1) % order.length];
}

function deleteSelected() {
    if (selectedId.value == null) return;
    seats.value = seats.value.filter((s) => s.id !== selectedId.value);
    selectedId.value = null;
}

function onStageClick(e: any) {
    if (e.target === e.target.getStage()) selectedId.value = null; // klik area kosong = batal pilih
}

function onKey(e: KeyboardEvent) {
    if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedId.value != null
    ) {
        e.preventDefault();
        deleteSelected();
    }
}
onMounted(() => window.addEventListener("keydown", onKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onKey));

function findFreeCell() {
    const taken = new Set<string>([
        ...seats.value.map((s) => `${s.row},${s.col}`),
        ...elements.value
            .filter((el) => el.type === "driver")
            .map((el) => `${el.row},${el.col}`),
    ]);
    for (let r = 0; r < 12; r++)
        for (let c = 0; c < COLS; c++)
            if (!taken.has(`${r},${c}`)) return { row: r, col: c };
    return { row: 0, col: 0 };
}

function addSeat() {
    const { row, col } = findFreeCell();
    seatCounter++;
    seats.value.push({
        id: String(seatCounter),
        row,
        col,
        type: "seater",
        status: "available",
    });
}

function addElement(type: ElementType) {
    if (type === "driver") elements.value.push({ type, ...findFreeCell() });
    else elements.value.push({ type, row: 0, col: 0, side: "left" });
}

// --- export ke skema layout ---
const layoutJson = computed(() => ({
    vehicleType: "daihatsu-luxio",
    decks: [
        {
            deck: 1,
            rows: 3,
            cols: COLS,
            seats: seats.value.map((s) => ({
                id: s.id,
                row: s.row,
                col: s.col,
                w: 1,
                h: 1,
                type: s.type,
                status: s.status,
            })),
            elements: elements.value.map((el) => ({
                type: el.type,
                row: el.row,
                col: el.col,
                ...(el.side ? { side: el.side } : {}),
            })),
        },
    ],
}));

function exportLayout() {
    console.log(JSON.stringify(layoutJson.value, null, 2));
    // await $fetch('/api/layouts', { method: 'POST', body: layoutJson.value })
}

// HTML ONLY
type CellType = "seat" | "isle" | "driver" | "door" | "window";
// type SeatStatus = "available" | "booked" | "blocked";

interface Cell {
    type: CellType;
    row: number;
    col: number;
    id?: string; // untuk seat
    status?: SeatStatus; // untuk seat
    isWindow?: boolean;
    windowPosition?: "left" | "right";
}

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

const selected = ref<Set<string>>(new Set());

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
</script>

<template>
    <div class="editor">
        <div class="toolbar">
            <button @click="addSeat">+ Kursi</button>
            <button @click="addElement('driver')">+ Sopir</button>
            <button @click="addElement('door')">+ Pintu</button>
            <button @click="addElement('window')">+ Jendela</button>
            <button
                class="danger"
                :disabled="selectedId === null"
                @click="deleteSelected"
            >
                Hapus kursi
            </button>
            <button @click="exportLayout">Export JSON</button>
        </div>
        <p class="hint">
            Kursi: klik = pilih · dobel-klik = status · Delete = hapus
            &nbsp;|&nbsp; Pintu/jendela: klik = ganti sisi · semua: seret =
            pindah
        </p>

        <div class="grid grid-cols-2 gap-4">
            <ClientOnly>
                <v-stage
                    :config="stageConfig"
                    class="canvas"
                    @click="onStageClick"
                    @tap="onStageClick"
                >
                    <v-layer>
                        <!-- KURSI -->
                        <v-group
                            v-for="seat in seats"
                            :key="'seat-' + seat.id"
                            :config="{
                                x: xy(seat.row, seat.col).x,
                                y: xy(seat.row, seat.col).y,
                                draggable: true,
                            }"
                            @dragstart="() => (selectedId = seat.id)"
                            @dragend="(e: any) => onSeatDragEnd(seat, e)"
                            @click="(e: any) => selectSeat(seat, e)"
                            @tap="(e: any) => selectSeat(seat, e)"
                            @dblclick="() => cycleStatus(seat)"
                            @dbltap="() => cycleStatus(seat)"
                        >
                            <v-rect
                                :config="{
                                    width: CELL,
                                    height: CELL,
                                    cornerRadius: 8,
                                    fill: fillFor(seat),
                                    stroke:
                                        selectedId === seat.id
                                            ? '#185fa5'
                                            : '#9b9a92',
                                    strokeWidth:
                                        selectedId === seat.id ? 2.5 : 1,
                                }"
                            />
                            <v-path
                                :config="{
                                    data: statusIcon(seat.status),
                                    stroke: iconColor(seat.status),
                                    strokeWidth: 2,
                                    lineCap: 'round',
                                    lineJoin: 'round',
                                    x: CELL / 2 - 8,
                                    y: 5,
                                    scaleX: 16 / 24,
                                    scaleY: 16 / 24,
                                }"
                            />
                            <v-text
                                :config="{
                                    text: seat.id,
                                    width: CELL,
                                    y: 27,
                                    align: 'center',
                                    fontSize: 11,
                                    fill: '#3d3d3a',
                                }"
                            />
                        </v-group>

                        <!-- ELEMEN: sopir / pintu / jendela -->
                        <v-group
                            v-for="(el, i) in elements"
                            :key="'el-' + i"
                            :config="{
                                x: xy(el.row, el.col).x,
                                y: xy(el.row, el.col).y,
                                draggable: true,
                            }"
                            @dragend="(e: any) => onElementDragEnd(el, e)"
                            @click="() => el.type !== 'driver' && cycleSide(el)"
                            @tap="() => el.type !== 'driver' && cycleSide(el)"
                        >
                            <template v-if="el.type === 'driver'">
                                <v-rect
                                    :config="{
                                        width: CELL,
                                        height: CELL,
                                        cornerRadius: 8,
                                        fill: '#eceae2',
                                        stroke: '#9b9a92',
                                        strokeWidth: 1,
                                    }"
                                />
                                <v-path
                                    :config="{
                                        data: STEERING,
                                        stroke: '#5f5e5a',
                                        strokeWidth: 2,
                                        lineCap: 'round',
                                        lineJoin: 'round',
                                        x: CELL / 2 - 11,
                                        y: CELL / 2 - 11,
                                        scaleX: 22 / 24,
                                        scaleY: 22 / 24,
                                    }"
                                />
                            </template>
                            <v-rect v-else :config="elementBar(el)" />
                        </v-group>
                    </v-layer>
                </v-stage>

                <template #fallback>
                    <p class="hint">Memuat editor…</p>
                </template>
            </ClientOnly>
            <div class="inline-block rounded-2xl bg-amber-50 p-4">
                <div
                    v-for="(row, rowIndex) in config"
                    :key="rowIndex"
                    class="grid gap-1"
                    :style="{
                        gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                    }"
                >
                    <div
                        v-for="(cell, colIndex) in row"
                        :key="colIndex"
                        class="flex items-center justify-center"
                    >
                        <!-- KURSI -->
                        <button
                            v-if="cell.type === 'seat'"
                            type="button"
                            class="relative m-3 flex h-28 w-28 items-center justify-center rounded-xl border text-sm font-medium transition"
                            :class="seatClass(cell)"
                            :disabled="
                                cell.status === 'booked' ||
                                cell.status === 'blocked'
                            "
                            @click="toggleSeat(cell)"
                        >
                            {{ cell.id }}
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
                        </button>

                        <!-- SOPIR -->
                        <div
                            v-else-if="cell.type === 'driver'"
                            class="m-3 flex h-28 w-28 items-center justify-center rounded-xl border bg-slate-100 text-slate-500"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                class="h-8 w-8"
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
                        <div v-else class="m-3 h-28 w-6"></div>
                    </div>
                </div>

                <p v-if="selected.size" class="mt-2 text-sm text-slate-600">
                    Dipilih: {{ [...selected].join(", ") }}
                </p>
            </div>
        </div>
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
