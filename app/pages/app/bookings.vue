<script setup lang="ts">
definePageMeta({
    layout: "app",
});
onMounted(async () => {
    console.log("mounted bookings");
});

onUnmounted(() => {
    console.log("unmounted bookings");
});
</script>

<template>
    <UCard title="Card with title" class="w-full bg-[#025964]">
        <Placeholder class="h-32" />
    </UCard>
    <div>bookings</div>
</template>

<style lang="css" scoped></style>
