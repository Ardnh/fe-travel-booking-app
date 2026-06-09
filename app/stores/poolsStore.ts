import type { CreatePoolDTO, Pool, UpdatePoolDTO } from "~/models";
import { useAsync } from "~/composables";
import { usePoolsService } from "~/services";

export const usePoolsStore = defineStore("pools", () => {
    const { isLoading, getError, run } = useAsync();
    const service = usePoolsService();

    const pools = ref<Pool[]>([]);
    const pool = ref<Pool | null>(null);

    const getAllPool = async (page: number, limit: number) => {
        const result = await run("getAllPool", () => service.getAllPool(page, limit));
        pools.value = result.data;
    };

    const getPoolByID = async (id: string) => {
        const result = await run("getPoolByID", () => service.getPoolByID(id));
        pool.value = result.data;
    };

    const getPoolByVendorID = async (vendorId: string) => {
        const result = await run("getPoolByVendorID", () => service.getPoolByVendorID(vendorId));
        pools.value = result.data;
    };

    const createPool = async (req: CreatePoolDTO) => {
        const result = await run("createPool", () => service.createPool(req));
        if (result.success) {
            pools.value = [...pools.value, result.data];
        }
    };

    const updatePool = async (id: string, req: UpdatePoolDto) => {
        const result = await run("updatePool", () => service.updatePool(id, req));
        if (result.success) {
            pools.value = pools.value.map((item) => (item.pool_id === id ? result.data : item));
        }
    };

    const deletePool = async (id: string) => {
        const result = await run("deletePool", () => service.deletePool(id));
        if (result.success) {
            pools.value = pools.value.filter((item) => item.pool_id !== id);
        }
    };

    return {
        isLoading,
        getError,
        pools,
        pool,
        getAllPool,
        getPoolByID,
        getPoolByVendorID,
        createPool,
        updatePool,
        deletePool,
    };
});
