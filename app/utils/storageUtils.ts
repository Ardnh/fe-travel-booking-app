// utils/storage.ts
export const storage = {
    getString(key: string): string | null {
        if (import.meta.server) return null;
        try {
            const item = localStorage.getItem(key);
            return item ? item : null;
        } catch {
            return null;
        }
    },

    setString(key: string, value: string): void {
        if (import.meta.server) return;
        try {
            localStorage.setItem(key, value);
        } catch {
            console.error(`Failed to set localStorage key: ${key}`);
        }
    },

    setJson<T>(key: string, value: T): void {
        if (import.meta.server) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            console.error(`Failed to set localStorage key: ${key}`);
        }
    },

    remove(key: string): void {
        if (import.meta.server) return;
        localStorage.removeItem(key);
    },

    clear(): void {
        if (import.meta.server) return;
        localStorage.clear();
    },
};
