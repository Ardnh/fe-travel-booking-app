import type { LayoutListResponse } from "~/models";

export const useLayoutsRepository = () => {
    const { api } = useApi();

    return {
        getAllLayouts: (query: { page: number; page_size: number; search: string; sort_by: string; sort_order: string }) => api<LayoutListResponse>("/layouts", { query }),
    };
};
