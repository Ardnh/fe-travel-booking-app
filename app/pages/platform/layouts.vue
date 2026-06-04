<script setup lang="ts">
import { user } from "#build/ui";

const layoutsStore = useLayoutsStore();
const usersStore = useUsersStore();

const { layouts } = storeToRefs(layoutsStore);
const { userProfile } = storeToRefs(usersStore);

const { getAllLayouts } = layoutsStore;
const { getUserProfile } = usersStore;

const query = ref({
    page: 1,
    page_size: 30,
    search: "",
    sort_by: "created_at",
    sort_order: "DESC",
});

definePageMeta({
    layout: "platform",
});

onMounted(async () => {
    await getAllLayouts(query.value);
});
</script>

<template>
    <div class="">user profile</div>
    <pre>{{ userProfile }}</pre>
    <div>super admin layouts</div>
    <pre>{{ layouts }}</pre>
</template>
