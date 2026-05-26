import type { BaseResponse, CreateVendorDTO, UpdateVendorDTO, VendorListResponse, VendorResponse } from "~/models";

export const useVendorRepository = () => {
    const { api } = useApi();

    return {
        createVendor: (req: CreateVendorDTO) => api<BaseResponse>("/vendors", { method: "POST", body: req }),
        getAllVendor: (page: number, limit: number) => api<VendorListResponse>("/vendors", { query: { page, limit } }),
        getVendorById: (vendorId: string) => api<VendorResponse>(`/vendors/${vendorId}`),
        updateVendor: (vendorId: string, req: UpdateVendorDTO) => api<UpdateVendorDTO>(`/vendors/${vendorId}`, { method: "PUT", body: req }),
        deleteVendor: (vendorId: string) => api<BaseResponse>(`/vendors/${vendorId}`, { method: "DELETE" }),
    };
};
