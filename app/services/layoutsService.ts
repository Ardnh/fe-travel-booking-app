import { useLayoutsRepository } from "~/repositories";

export const useLayoutsService = () => {
    const repo = useLayoutsRepository();

    const getAllLayouts = (query: { page: number; page_size: number; search: string; sort_by: string; sort_order: string }) => {
        return repo.getAllLayouts(query);
    };

    return {
        getAllLayouts,
    };
};
