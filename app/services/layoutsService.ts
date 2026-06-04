import type { CreateLayoutDto, UpdateLayoutDto } from "~/models";
import { useLayoutsRepository } from "~/repositories";

export const useLayoutsService = () => {
    const repo = useLayoutsRepository();

    const getAllLayouts = (query: {
        page: number;
        page_size: number;
        search: string;
        sort_by: string;
        sort_order: string;
    }) => {
        return repo.getAllLayouts(query);
    };

    const createLayout = (data: CreateLayoutDto) => {
        return repo.createLayout(data);
    };

    const updateLayout = (id: string, data: UpdateLayoutDto) => {
        return repo.updateLayout(id, data);
    };

    const deleteLayout = (id: string) => {
        return repo.deleteLayout(id);
    };

    return {
        getAllLayouts,
        createLayout,
        updateLayout,
        deleteLayout,
    };
};
