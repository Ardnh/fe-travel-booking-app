import type { CreatePoolDTO, Pool, UpdatePoolDTO } from "~/models";
import { useAsync } from "~/composables";
import { usePoolsService } from "~/services";
import { useVendorStore } from "~/stores";

export const usePoolsStore = defineStore("pools", () => {
    const vendorStore = useVendorStore();
    const service = usePoolsService();

    const { isLoading, getError, run } = useAsync();
    const { vendor } = storeToRefs(vendorStore);

    const pools = ref<Pool[]>([]);
    const pool = ref<Pool | null>(null);

    const getAllPool = async (page: number, limit: number) => {
        const result = await run("getAllPool", () => service.getAllPool(page, limit));

        if (result.success) {
            pools.value = result.data;
        }
    };

    const getPoolByID = async (id: string) => {
        const result = await run("getPoolByID", () => service.getPoolByID(id));

        if (result.success) {
            pool.value = result.data;
        }
    };

    const getPoolByVendorID = async (vendorId: string) => {
        const result = await run("getPoolByVendorID", () => service.getPoolByVendorID(vendorId));

        if (result.success) {
            pools.value = result.data;
        }
    };

    const createPool = async (req: CreatePoolDTO) => {
        const vendorId = vendor.value?.vendor_id;
        if (!vendorId) return;

        const result = await run("createPool", () => service.createPool(vendorId, req));
        if (result.success) {
            pools.value = [...pools.value, result.data];
        }
    };

    const updatePool = async (id: string, req: UpdatePoolDTO) => {
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
