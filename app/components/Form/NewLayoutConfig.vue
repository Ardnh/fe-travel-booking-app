<script setup lang="ts">
import type { Cell } from "~/models";
import type { FormSubmitEvent } from "@nuxt/ui";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
    data?: Cell[][];
}>();

const emit = defineEmits<{
    submit: [data: Cell[][]];
}>();

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

const resetForm = () => {
    Object.assign(layouts, { ...initialCell.value });
};

const onSubmit = async (event: FormSubmitEvent<LayoutForm>) => {
    console.log("Submit");
    console.log(event.data);

    loading.value = true;
    try {
        emit("submit", event.data);
    } finally {
        loading.value = false;
        open.value = false;
    }
};

watch(
    () => props.data,
    (newData) => {
        if (newData) {
            Object.assign(layouts, newData);
        } else {
            resetForm();
        }
    },
    { immediate: true },
);
</script>

<template>
    <UModal v-model:open="open" fullscreen title="Modal fullscreen">
        <template #body>
            <div class="grid grid-cols-2">
                <div class=""></div>
                <div class="">part 2</div>
            </div>
        </template>
    </UModal>
</template>

<style lang="scss" scoped></style>
