<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <UMain>
    <!-- Navigation -->
    <nav class="w-full px-8 py-5 flex items-center justify-between border-b border-white/5">
      <!-- Logo -->
      <div class="flex items-center gap-2.5 select-none">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[color:var(--omni-teal)] to-[color:var(--omni-teal-dark)] flex items-center justify-center shadow-md shadow-cyan-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-5 h-5 text-white" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 9a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V9zM3 14a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zM9 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM9 9a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1h-4a1 1 0 01-1-1V9z"/>
            <path fill-rule="evenodd" d="M3 3a1.5 1.5 0 00-1.5 1.5v10A1.5 1.5 0 003 16h3.25a.75.75 0 010 1.5H3a1.5 1.5 0 001.5 1.5h10a1.5 1.5 0 001.5-1.5V14.25a.75.75 0 011.5 0v1.75a1.5 1.5 0 001.5 1.5h3.25a.75.75 0 010 1.5H21a1.5 1.5 0 001.5-1.5V14.5a1.5 1.5 0 00-1.5-1.5H15a1.5 1.5 0 00-1.5 1.5v.75a1.5 1.5 0 01-3 0v-1.75A1.5 1.5 0 009.5 6H6.5a1.5 1.5 0 00-1.5 1.5v5A1.5 1.5 0 005 15H2.5a1.5 1.5 0 01-1.5-1.5V10.5a1.5 1.5 0 00-1.5-1.5H0a1.5 1.5 0 00-1.5 1.5v5A1.5 1.5 0 00.5 18H4a1.5 1.5 0 001.5-1.5V16a1.5 1.5 0 00-1.5-1.5H0a1.5 1.5 0 00-1.5 1.5v5A1.5 1.5 0 001.5 21H0" clip-rule="evenodd"/>
            <path d="M1 8a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V8zM1 3a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V3z"/>
          </svg>
        </div>
        <span class="text-base font-semibold tracking-tight text-white">Omni HR</span>
      </div>

      <!-- Nav links (desktop) -->
      <div class="hidden sm:flex items-center gap-5 text-sm font-medium text-slate-400">
        <a href="#features" class="hover:text-white transition-colors duration-150">Features</a>
        <a href="#about"    class="hover:text-white transition-colors duration-150">About</a>
        <a href="#pricing"  class="hover:text-white transition-colors duration-150">Pricing</a>
        <a href="#contact"  class="hover:text-white transition-colors duration-150">Contact</a>
      </div>

      <!-- CTA -->
      <UButton
        label="Sign In"
        size="sm"
        color="info"
        variant="solid"
        to="/login"
        class="shadow shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow duration-200"
      />
    </nav>

    <!-- Hero -->
    <section class="relative px-8 pt-28 pb-36 flex flex-col items-center text-center overflow-hidden">
      <!-- Ambient glow -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] rounded-full bg-[color:var(--omni-teal)]/8 blur-[120px]" />
        <div class="absolute top-[180px] left-1/3 w-[320px] h-[320px] rounded-full bg-cyan-600/6 blur-[100px]" />
      </div>

      <!-- Badge -->
      <div class="relative z-10 flex items-center gap-2 rounded-full border border-cyan-700/40 bg-cyan-950/30 px-4 py-1.5 text-xs font-medium text-cyan-300 tracking-wide uppercase backdrop-blur-sm mb-8">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        All-in-One HR Platform
      </div>

      <!-- Headline -->
      <h1 class="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight max-w-3xl text-white mb-5">
        All Essentials,
        <span class="block mt-1 bg-gradient-to-r from-[color:var(--omni-teal)] to-emerald-400 bg-clip-text text-transparent">
          One Unified Platform
        </span>
      </h1>

      <!-- Subhead -->
      <p class="relative z-10 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed mb-11">
        Handle payroll, schedules, leave, compliance, and performance — everything
        your people need to thrive, in one connected workspace.
      </p>

      <!-- CTA buttons -->
      <div class="relative z-10 flex flex-col sm:flex-row items-center gap-4">
        <UButton
          label="Start Free Trial"
          size="lg"
          color="primary"
          class="min-w-[180px] shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/45 transition-shadow font-semibold tracking-wide"
        />
        <UButton
          label="Sign In"
          size="lg"
          color="neutral"
          variant="soft"
          to="/login"
          class="min-w-[180px] font-medium tracking-wide"
        />
      </div>
    </section>

    <!-- Three trust signals -->
    <section id="features" class="px-8 py-20 border-t border-white/5">
      <div class="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-14 text-center">
        <div>
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-cyan-800/30 border border-cyan-700/30 flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-5 h-5 text-cyan-300">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-2">Real-Time Payroll</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Speed up your payroll cycle with automatic computation, approvals, and disbursement tracking.</p>
        </div>
        <div>
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-cyan-800/30 border border-cyan-700/30 flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-5 h-5 text-cyan-300">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-2">Team Scheduling</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Smart rosters, shift swaps, and overtime alerts — keep every team on the same page.</p>
        </div>
        <div>
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-cyan-800/30 border border-cyan-700/30 flex items-center justify-center mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="w-5 h-5 text-cyan-300">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 1.25 12 1.25c2.29 0 4.544.41 6.75 1.471V4.237c0-.892-.59-1.68-1.439-1.923a6.007 6.007 0 00-5.02-2.487 6.003 6.003 0 00-5.28 5.676zM12 2.25c-1.29 0-2.54.09-3.763.26a8.005 8.005 0 00-3.993 4.166M12 2.25c1.29 0 2.54.09 3.763.26a8.005 8.005 0 013.993-4.166" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-2">HR Compliance</h3>
          <p class="text-sm text-slate-400 leading-relaxed">Stay audit-ready with automated record-keeping, policy enforcement, and country-specific regulations.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-8 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-xs text-slate-500">© 2026 Omni HR. All rights reserved.</p>
      <div class="flex items-center gap-5 text-xs text-slate-500">
        <a href="#" class="hover:text-cyan-400 transition-colors">Privacy</a>
        <a href="#" class="hover:text-cyan-400 transition-colors">Terms</a>
        <a href="#" class="hover:text-cyan-400 transition-colors">Support</a>
      </div>
    </footer>
  </UMain>
</template>

<style scoped>
/* ── OMNI HR colour tokens ────────────────────────────────── */
:root {
  --omni-teal:     #22d3ee;   /* cyan-400  — primary accent */
  --omni-teal-dark:#0891b2;   /* cyan-600  — hover / darker accent */
}

html { color-scheme: dark; }
</style>
