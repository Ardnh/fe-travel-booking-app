import type { BaseResponse, CreatePoolDTO, PoolResponse, PoolListResponse, UpdatePoolDTO, CreatePoolResponse, UpdatePoolResponse } from "~/models";

export const usePoolsRepository = () => {
    const { api } = useApi();

    return {
        createPool: (req: CreatePoolDTO) => api<CreatePoolResponse>("/pool-points", { method: "POST", body: req }),
        getAllPool: (page: number, limit: number) => api<PoolListResponse>("/pool-points", { query: { page, limit } }),
        getPoolByID: (id: string) => api<PoolResponse>(`/pool-points/${id}`),
        getPoolByVendorID: (vendorId: string, page: number, pageSize: number) =>
            api<PoolListResponse>(`/pool-points/vendors/${vendorId}/pool-points`, { query: { page, page_size: pageSize } }),
        updatePool: (id: string, req: UpdatePoolDTO) => api<UpdatePoolResponse>(`/pool-points/${id}`, { method: "PUT", body: req }),
        deletePool: (id: string) => api<BaseResponse>(`/pool-points/${id}`, { method: "DELETE" }),
    };
};
