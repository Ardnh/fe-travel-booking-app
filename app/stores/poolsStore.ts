import type {
    CreatePoolDTO,
    Pagination,
    Pool,
    UpdatePoolDTO,
    PoolParams,
    Options,
    AvailablePoolsOptions,
    PoolInfo,
    AvailablePoolsByCity,
} from "~/models";
import { useAsync } from "~/composables";
import { usePoolsService } from "~/services";
import { useVendorStore } from "~/stores";
import { INITIAL_PAGINATION } from "~/constants";

export const usePoolsStore = defineStore("pools", () => {
    const vendorStore = useVendorStore();
    const service = usePoolsService();

    const { isLoading, getError, run } = useAsync();
    const { vendor } = storeToRefs(vendorStore);

    const pools = ref<Pool[]>([]);
    const pool = ref<Pool | null>(null);
    const poolOptions = ref<Options[]>([]);
    const poolLocationsOptions = ref<AvailablePoolsOptions[]>([]);
    const poolLocations = ref<AvailablePoolsByCity[]>([]);
    const availablePools = ref<PoolInfo[]>([]);
    const poolsPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    const getAllPool = async (params: PoolParams) => {
        const result = await run("getAllPool", () =>
            service.getAllPool(params),
        );

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

    const getPoolByVendorID = async (params: PoolParams) => {
        if (vendor.value == null) return;

        const vendorId = vendor.value.vendor_id;
        const result = await run("getPoolByVendorID", () =>
            service.getPoolByVendorID(vendorId, params),
        );

        if (result.success) {
            pools.value = result.data;
            poolsPagination.value = result.pagination;
        }
    };

    const getPoolByVendorIdOptions = async () => {
        if (vendor.value == null) return;

        const vendorId = vendor.value.vendor_id;
        const result = await run("getPoolByVendorID", () =>
            service.getPoolByVendorID(vendorId, { page: 1, page_size: 10 }),
        );

        if (result.success) {
            poolOptions.value = result.data.map((row) => {
                return {
                    label: row.name,
                    value: row.pool_id,
                };
            });
        }
    };

    const getAvailableLocationsByVendorID = async (locationType: string) => {
        if (vendor.value == null) return;

        const vendorId = vendor.value.vendor_id;
        const result = await run("getAvailableLocationsByVendorID", () =>
            service.getAvailableLocationsByVendorID(vendorId, locationType),
        );

        if (result.success) {
            poolLocations.value = result.data;
            availablePools.value = result.data.flatMap((row) => row.pools);
            poolLocationsOptions.value = result.data.map((row) => {
                return {
                    label: row.city_name,
                    value: row.city_name,
                };
            });
        }
    };

    const createPool = async (req: CreatePoolDTO) => {
        const vendorId = vendor.value?.vendor_id;
        if (!vendorId) return;

        const result = await run("createPool", () =>
            service.createPool(vendorId, req),
        );
        if (result.success) {
            pools.value = [...pools.value, result.data];
        }
    };

    const updatePool = async (id: string, req: UpdatePoolDTO) => {
        const result = await run("updatePool", () =>
            service.updatePool(id, req),
        );
        if (result.success) {
            pools.value = pools.value.map((item) =>
                item.pool_id === id ? result.data : item,
            );
        }
    };

    const deletePool = async (id: string) => {
        const result = await run("deletePool", () => service.deletePool(id));
        if (result.success) {
            pools.value = pools.value.filter((item) => item.pool_id !== id);
        }
    };

    return {
        poolsPagination,
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
        getPoolByVendorIdOptions,
        poolOptions,
        getAvailableLocationsByVendorID,
        poolLocationsOptions,
        poolLocations,
        availablePools,
    };
});
