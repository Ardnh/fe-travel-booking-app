Berikut rangkuman konvensi penamaan file di project Nuxt.js berdasarkan best practice terkini:

---

**Components** → `PascalCase.vue`

Components menggunakan `PascalCase.vue`, misalnya `MyComponent.vue`. Nuxt akan auto-import berdasarkan path + nama file. Contoh:

```
components/
├── AppHeader.vue          → <AppHeader />
├── BookingCard.vue        → <BookingCard />
├── ui/
│   ├── BaseButton.vue     → <UiBaseButton />
│   └── BaseInput.vue      → <UiBaseInput />
└── flight/
    ├── SearchForm.vue      → <FlightSearchForm />
    └── ResultCard.vue      → <FlightResultCard />
```

Nama komponen dihasilkan dari path direktori dan nama file, dengan segmen duplikat dihapus otomatis.

---

**Pages** → `kebab-case.vue`

Pages menggunakan `kebab-case.vue`, misalnya `index.vue`, `about.vue`, `product-details.vue`. Nama file langsung menjadi route:

```
pages/
├── index.vue                → /
├── about.vue                → /about
├── flight-search.vue        → /flight-search
└── booking/
    ├── index.vue            → /booking
    └── [id].vue             → /booking/:id
```

---

**Composables** → `useCamelCase.ts`

Composables dinamai dengan pola `use<MyComposable>`. Contoh:

```
composables/
├── useAuth.ts
├── useBooking.ts
└── useFlightSearch.ts
```

---

**Layouts** → `kebab-case.vue`

Layouts menggunakan `kebab-case.vue`, misalnya `default.vue` atau `custom-layout.vue`.

```
layouts/
├── default.vue
├── auth.vue
└── admin-panel.vue
```

---

**Middleware** → `kebab-case.ts`

```
middleware/
├── auth.ts
├── guest-only.ts
└── admin-check.ts
```

---

**Plugins** → `kebab-case.ts`

Plugins menggunakan `kebab-case.ts`, misalnya `analytics.js`.

```
plugins/
├── api-client.ts
├── dayjs.ts
└── toast.client.ts       ← suffix .client = client-only
```

---

**Stores (Pinia)** → `kebab-case.ts`

Stores menggunakan `kebab-case.ts`, misalnya `user-store.js`.

```
stores/
├── auth.ts
├── booking.ts
└── flight-search.ts
```

---

**Utils / Helpers** → `camelCase.ts`

Utility functions menggunakan `camelCase.ts`, misalnya `formatDate.js`.

```
utils/
├── formatDate.ts
├── formatCurrency.ts
└── validateEmail.ts
```

---

**Server API** → `kebab-case.ts`

```
server/
├── api/
│   ├── flights.get.ts
│   ├── booking.post.ts
│   └── auth/
│       ├── login.post.ts
│       └── me.get.ts
└── middleware/
    └── auth.ts
```

---

**Suffix khusus Nuxt** yang perlu diingat:

- `.client.vue` / `.client.ts` → hanya dijalankan di client
- `.server.vue` / `.server.ts` → hanya dijalankan di server
- `.global.vue` → komponen yang di-register secara global
- `.get.ts`, `.post.ts`, dll → method-specific server routes

Secara ringkas: **PascalCase untuk komponen**, **kebab-case untuk pages/layouts/plugins/stores/middleware**, **camelCase dengan prefix `use` untuk composables**, dan **camelCase untuk utils**.