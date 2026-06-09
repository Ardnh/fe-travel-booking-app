import type { CreatePoolDTO, UpdatePoolDTO } from "~/models";
import { usePoolsRepository } from "~/repositories";

export const usePoolsService = () => {
    const repo = usePoolsRepository();

    const getAllPool = (page: number, limit: number) => {
        return repo.getAllPool(page, limit);
    };

    const getPoolByID = (id: string) => {
        return repo.getPoolByID(id);
    };

    const getPoolByVendorID = (vendorId: string) => {
        return repo.getPoolByVendorID(vendorId);
    };

    const createPool = (req: CreatePoolDTO) => {
        return repo.createPool(req);
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
        createPool,
        updatePool,
        deletePool,
    };
};
