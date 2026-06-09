import type { BaseResponse, CreatePoolDTO, Pool, PoolListResponse, UpdatePoolDTO } from "~/models";

export const usePoolsRepository = () => {
    const { api } = useApi();

    return {
        createPool: (req: CreatePoolDTO) => api<BaseResponse>("/pool-points", { method: "POST", body: req }),
        getAllPool: (page: number, limit: number) => api<PoolListResponse>("/pool-points", { query: { page, limit } }),
        getPoolByID: (id: string) => api<PoolResponse>(`/pool-points/${id}`),
        getPoolByVendorID: (vendorId: string) => api<PoolListResponse>(`/pool-points/vendor/${vendorId}`),
        updatePool: (id: string, req: UpdatePoolDTO) => api<BaseResponse>(`/pool-points/${id}`, { method: "PUT", body: req }),
        deletePool: (id: string) => api<BaseResponse>(`/pool-points/${id}`, { method: "DELETE" }),
    };
};
