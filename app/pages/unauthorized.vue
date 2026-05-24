<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <UMain class="flex items-center justify-center min-h-screen bg-gradient-to-br from-[color:var(--omni-teal)]/5 to-[color:var(--omni-teal-dark)]/5">
    <div class="w-full max-w-xl px-6 py-12 text-center">
      <div class="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="w-16 h-16 mx-auto mb-6 text-cyan-400"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8v4l3 3"
          />
          <path
            d="M5 19h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"
          />
        </svg>
        <h1 class="text-3xl font-bold text-white mb-4">
          Unauthorized Access
        </h1>
        <p class="text-slate-300">
          You don't have permission to access this page. Please log in to continue.
        </p>
      </div>
      
      <div class="mt-8">
        <UButton
          to="/login"
          label="Sign In"
          size="lg"
          color="primary"
          class="w-full"
        />
      </div>
    </div>
  </UMain>
</template>

<style lang="css" scoped>
:root {
  --omni-teal: #22d3ee; /* cyan-400  — primary accent */
  --omni-teal-dark: #0891b2; /* cyan-600  — hover / darker accent */
}

html {
  color-scheme: dark;
}
</style>