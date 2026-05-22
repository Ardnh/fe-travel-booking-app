
export const useLoading = () => {
    const loadingMap = ref<Record<string, boolean>>({})

    const isLoading = (key: string) => loadingMap.value[key] ?? false

    const withLoading = async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
        loadingMap.value[key] = true
        try {
            return await fn()
        } finally {
            loadingMap.value[key] = false
        }
    }

    return { isLoading, withLoading }
}