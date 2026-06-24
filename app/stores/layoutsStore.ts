import type {
    CreateLayoutDto,
    Layouts,
    Options,
    UpdateLayoutDto,
} from "~/models";
import { useLayoutsService } from "~/services";

export const useLayoutsStore = defineStore("layouts", () => {
    // ------------ INSTANCE ------------
    const { isLoading, getError, run } = useAsync();
    const service = useLayoutsService();

    // ------------ API STATE ------------
    const layouts = ref<Layouts[]>([]);
    const layout = ref<Layouts | null>(null);
    const layoutOptions = ref<Options[]>([]);

    // ------------ UI STATE ------------

    // ------------ ACTIONS ------------
    const getAllLayouts = async (query: {
        page: number;
        page_size: number;
        search: string;
        sort_by: string;
        sort_order: string;
    }) => {
        const result = await run("getAllLayouts", () =>
            service.getAllLayouts(query),
        );

        if (result.success) {
            layouts.value = result.data;
            layoutOptions.value = result.data.map((l) => ({
                label: l.name,
                value: l.layout_id,
            }));
        }
    };

    const createLayout = async (data: CreateLayoutDto) => {
        const result = await run("createLayout", () =>
            service.createLayout(data),
        );
        if (result.success) {
            layouts.value.push(result.data);
            layoutOptions.value.push({
                label: result.data.name,
                value: result.data.layout_id,
            });
        }
    };

    const updateLayout = async (id: string, data: UpdateLayoutDto) => {
        const result = await run("updateLayout", () =>
            service.updateLayout(id, data),
        );
        if (result.success) {
            const updatedLayout = result.data;
            const index = layouts.value.findIndex((l) => l.layout_id === id);
            if (index !== -1) {
                layouts.value[index] = updatedLayout;
                layoutOptions.value[index] = {
                    label: updatedLayout.name,
                    value: updatedLayout.layout_id,
                };
            }
        }
    };

    const deleteLayout = async (layout_id: string) => {
        const result = await run("deleteLayout", () =>
            service.deleteLayout(layout_id),
        );
        if (result.success) {
            layouts.value = layouts.value.filter(
                (l) => l.layout_id !== layout_id,
            );
            layoutOptions.value = layoutOptions.value.filter(
                (o) => o.value !== layout_id,
            );
        }
    };

    return {
        layout,
        layouts,
        getAllLayouts,
        createLayout,
        updateLayout,
        deleteLayout,
        isLoading,
        getError,
        layoutOptions,
    };
});
