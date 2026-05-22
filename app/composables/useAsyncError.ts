// ~/composables/useError.ts
export const useAsyncError = () => {
    const errorMap = ref<Record<string, string | null>>({})

    const getError = (key: string) => errorMap.value[key] ?? null

    const setError = (key: string, message: string) => {
        errorMap.value[key] = message
    }

    const clearError = (key: string) => {
        errorMap.value[key] = null
    }

    return { getError, setError, clearError }
}