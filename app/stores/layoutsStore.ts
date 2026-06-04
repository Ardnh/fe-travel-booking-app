import type { Layouts } from "~/models";
import { useLayoutsService } from "~/services";

export const useLayoutsStore = defineStore("layouts", () => {
    // ------------ INSTANCE ------------
    const { isLoading, getError, run } = useAsync();
    const service = useLayoutsService();

    // ------------ API STATE ------------
    const layouts = ref<Layouts[]>([]);
    const layout = ref<Layouts | null>(null);

    // ------------ UI STATE ------------

    // ------------ ACTIONS ------------
    const getAllLayouts = async (query: { page: number; page_size: number; search: string; sort_by: string; sort_order: string }) => {
        const result = await run("getAllLayouts", () => service.getAllLayouts(query));
        layouts.value = result.data;
    };

    return {
        layout,
        layouts,
        getAllLayouts,
    };
});
