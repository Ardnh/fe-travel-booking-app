// ~/composables/useAsync.ts
export const useAsync = () => {
    const loadingMap = ref<Record<string, boolean>>({})
    const errorMap = ref<Record<string, string | null>>({})

    const isLoading = (key: string) => loadingMap.value[key] ?? false
    const getError = (key: string) => errorMap.value[key] ?? null

    const run = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
        loadingMap.value[key] = true
        errorMap.value[key] = null
        try {
            return await fn()
        } catch (e: any) {
            errorMap.value[key] = e.message
            throw e
        } finally {
            loadingMap.value[key] = false
        }
    }

    return { isLoading, getError, run }
}