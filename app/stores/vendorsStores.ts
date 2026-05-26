import type { Vendor, CreateVendorDTO, UpdateVendorDTO } from "~/models";
import { useAsync } from "~/composables";
import { useVendorService } from "~/services";

export const useVendorStore = defineStore("vendor", () => {
    // ------------ INSTANCE ------------
    const { isLoading, getError, run } = useAsync();
    const service = useVendorService();

    // ------------ API STATE ------------
    const vendors = ref<Vendor[]>([]);
    const vendor = ref<Vendor | null>(null);

    // ------------ UI STATE ------------

    // ------------ ACTIONS ------------
    const getAllVendor = async (page: number, limit: number) => {
        const result = await run("getAllVendors", () => service.getAllVendor(page, limit));
        vendors.value = result.data;
    };

    const getVendorById = async (vendorId: string) => {
        // ❌ missing async
        const result = await run("getVendorById", () => service.getVendorById(vendorId));
        vendor.value = result.data;
    };

    const createVendor = async (req: CreateVendorDTO) => {
        // ❌ missing async
        await run("createVendor", () => service.createVendor(req));
    };

    const updateVendor = async (vendorId: string, req: UpdateVendorDTO) => {
        // ❌ missing async
        await run("updateVendor", () => service.updateVendor(vendorId, req));
    };

    const deleteVendor = async (vendorId: string) => {
        // ❌ missing async
        await run("deleteVendor", () => service.deleteVendor(vendorId));
    };

    return {
        isLoading,
        getError,
        vendors,
        vendor,
        getAllVendor,
        getVendorById,
        createVendor,
        updateVendor,
        deleteVendor,
    };
});
