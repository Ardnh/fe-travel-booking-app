<script setup lang="ts">
useHead({
    title: `Select Role`,
});
const usersStore = useUsersStore();

const { userProfile } = storeToRefs(usersStore);

async function selectRole(item: string) {
    console.log("selectRole dipanggil", item);
    console.log(mapRolesToRoute(item));
    await navigateTo(mapRolesToRoute(item).route);
}
</script>

<template>
    <UMain class="flex items-center justify-center min-h-screen bg-gradient-to-br from-[color:var(--omni-teal)]/5 to-[color:var(--omni-teal-dark)]/5">
        <div class="w-full max-w-2xl px-6 py-12">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-white mb-4">Select Your Role</h1>
                <p class="text-xl text-slate-300">Choose the role that best describes you to continue</p>
            </div>

            <div class="grid gap-8 md:grid-cols-2">
                <!-- Daily User Option -->
                <div
                    v-for="(item, index) in userProfile?.roles ?? []"
                    :key="index"
                    @click="selectRole(item)"
                    class="group flex flex-col items-center justify-center p-8 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20 bg-black/5 backdrop-blur-sm"
                >
                    <div class="w-16 h-16 mb-6 flex items-center justify-center bg-white/10 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 text-white" fill="currentColor">
                            <path
                                d="M12 4a4 4 0 00-4 4v2a4 4 0 00-4 4v2a4 4 0 004 4v2a4 4 0 004 4v2a4 4 0 004-4v2a4 4 0 004-4v-2a4 4 0 00-4-4v-2a4 4 0 00-4-4v-2a4 4 0 004-4v-2a4 4 0 00-4-4z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-2">{{ mapRolesToRoute(item).name }} : {{ mapRolesToRoute(item).route }}</h3>
                    <p class="text-slate-300 text-center">Manage your personal HR tasks, time off, and payroll</p>
                    <div class="mt-6 w-full flex justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            class="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </UMain>
</template>

<style lang="css" scoped>
/* Maintain the color variables from the main layout */
:root {
    --omni-teal: #22d3ee; /* cyan-400  — primary accent */
    --omni-teal-dark: #0891b2; /* cyan-600  — hover / darker accent */
}

html {
    color-scheme: dark;
}
</style>
