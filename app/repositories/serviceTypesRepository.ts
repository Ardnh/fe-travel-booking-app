import type {
    BaseResponse,
    CreateServiceTypeResponse,
    ServiceTypeListResponse,
    UpdateServiceTypeResponse,
    ServiceTypeByIdResponse,
} from "~/models";

export const useServiceTypeRepository = () => {
    const { api } = useApi();

    return {
        getAllServiceType: (query: {
            page: number;
            page_size: number;
            search: string;
            sort_by: string;
            sort_order: string;
        }) => api<ServiceTypeListResponse>("/service-types", { query }),
        getServiceTypeById: (id: string) =>
            api<ServiceTypeByIdResponse>(`/service-types/${id}`),
        createServiceType: (data: any) =>
            api<CreateServiceTypeResponse>("/service-types", {
                method: "POST",
                body: data,
            }),
        updateServiceType: (id: string, data: any) =>
            api<UpdateServiceTypeResponse>(`/service-types/${id}`, {
                method: "PUT",
                body: data,
            }),
        deleteServiceType: (id: string) =>
            api<BaseResponse>(`/service-types/${id}`, { method: "DELETE" }),
    };
};
