// composables/useAbortController.ts
export const useAbortController = () => {
    const controllers = new Map<string, AbortController>();

    const getSignal = (key: string) => {
        // abort request sebelumnya dengan key yang sama
        if (controllers.has(key)) {
            controllers.get(key)!.abort();
        }
        const controller = new AbortController();
        controllers.set(key, controller);
        return controller.signal;
    };

    const abort = (key: string) => {
        if (controllers.has(key)) {
            controllers.get(key)!.abort();
            controllers.delete(key);
        }
    };

    const abortAll = () => {
        controllers.forEach((controller) => controller.abort());
        controllers.clear();
    };

    onUnmounted(() => {
        abortAll();
    });

    return { getSignal, abort, abortAll };
};
