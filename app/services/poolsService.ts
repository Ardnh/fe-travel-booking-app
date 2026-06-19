import type { CreatePoolDTO, UpdatePoolDTO, PoolParams } from "~/models";
import { usePoolsRepository } from "~/repositories";

export const usePoolsService = () => {
    const repo = usePoolsRepository();

    const getAllPool = (params: PoolParams) => {
        return repo.getAllPool(params.page, params.page_size);
    };

    const getPoolByID = (id: string) => {
        return repo.getPoolByID(id);
    };

    const getPoolByVendorID = (vendorId: string, params: PoolParams) => {
        return repo.getPoolByVendorID(vendorId, params.page, params.page_size);
    };

    const getPoolOptions = (vendorId: string) => {
        const result = repo.getPoolByVendorID(vendorId, 1, 15);
    };

    const createPool = (vendorId: string, req: CreatePoolDTO) => {
        const slug = req.slug || req.name.toLowerCase().replace(/\s+/g, "-");
        return repo.createPool({ ...req, slug, vendor_id: vendorId });
    };

    const updatePool = (id: string, req: UpdatePoolDTO) => {
        return repo.updatePool(id, req);
    };

    const deletePool = (id: string) => {
        return repo.deletePool(id);
    };

    return {
        getAllPool,
        getPoolByID,
        getPoolByVendorID,
        getPoolOptions,
        createPool,
        updatePool,
        deletePool,
    };
};
