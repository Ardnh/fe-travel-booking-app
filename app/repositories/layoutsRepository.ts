import type {
    BaseResponse,
    CreateLayoutDto,
    CreateLayoutResponse,
    LayoutListResponse,
    UpdateLayoutDto,
    UpdateLayoutResponse,
} from "~/models";

export const useLayoutsRepository = () => {
    const { api } = useApi();

    return {
        getAllLayouts: (query: {
            page: number;
            page_size: number;
            search: string;
            sort_by: string;
            sort_order: string;
        }) => api<LayoutListResponse>("/layouts", { query }),
        createLayout: (data: CreateLayoutDto) =>
            api<CreateLayoutResponse>("/layouts", {
                method: "POST",
                body: data,
            }),
        updateLayout: (id: string, data: UpdateLayoutDto) =>
            api<UpdateLayoutResponse>(`/layouts/${id}`, {
                method: "PUT",
                body: data,
            }),
        deleteLayout: (id: string) =>
            api<BaseResponse>(`/layouts/${id}`, {
                method: "DELETE",
            }),
    };
};
