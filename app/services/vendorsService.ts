import type { CreateVendorDTO, UpdateVendorDTO } from "~/models";
import { useVendorRepository } from "~/repositories";

export const useVendorService = () => {
    const repo = useVendorRepository();

    const getAllVendor = (page: number, limit: number) => {
        return repo.getAllVendor(page, limit);
    };

    const getVendorById = (vendorId: string) => {
        return repo.getVendorById(vendorId);
    };

    const createVendor = (req: CreateVendorDTO) => {
        return repo.createVendor(req);
    };

    const updateVendor = (vendorId: string, req: UpdateVendorDTO) => {
        return repo.updateVendor(vendorId, req);
    };

    const deleteVendor = (vendorId: string) => {
        return repo.deleteVendor(vendorId);
    };

    return {
        getAllVendor,
        getVendorById,
        createVendor,
        updateVendor,
        deleteVendor,
    };
};
