import type { Vendor, CreateVendorDTO, UpdateVendorDTO } from "~/models";
import { useAsync } from "~/composables";
import { useVendorService } from "~/services";
import { useUsersStore } from "~/stores";

export const useVendorStore = defineStore("vendor", () => {
    // ------------ INSTANCE ------------
    const { isLoading, getError, run } = useAsync();
    const userStore = useUsersStore();
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

    const getVendorByOwnerUserId = async () => {
        const result = await run("getVendorById", () => service.getVendorByOwnerUserId());
        vendor.value = result.data;
    };

    const createVendor = async (req: CreateVendorDTO) => {
        await run("createVendor", () => service.createVendor(req));
    };

    const updateVendor = async (vendorId: string, req: UpdateVendorDTO) => {
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
        getVendorByOwnerUserId,
        createVendor,
        updateVendor,
        deleteVendor,
    };
});
