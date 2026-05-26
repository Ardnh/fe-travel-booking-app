import type { BaseResponse } from "../common";

export interface CreateVendorDTO {
    owner_user_id: string;
    business_name: string;
    owner_name: string;
    description: string;
    founded_year: number;
    phone_number: string;
    email: string;
    head_office_address: string;
    logo_url: string;
    banner_url: string;
    legal_document_number: string;
}

export type VendorStatus = "active" | "inactive" | "suspended" | "pending";

export interface UpdateVendorDTO {
    business_name?: string;
    owner_name?: string;
    description?: string;
    founded_year?: number;
    phone_number?: string;
    email?: string;
    head_office_address?: string;
    logo_url?: string;
    banner_url?: string;
    legal_document_number?: string;
    is_verified?: boolean;
    status?: VendorStatus;
}

export interface Vendor {
    vendor_id: string;
    owner_user_id: string;
    business_name: string;
    owner_name: string;
    description: string;
    founded_year: number;
    phone_number: string;
    email: string;
    head_office_address: string;
    logo_url: string;
    banner_url: string;
    legal_document_number: string;
    is_verified: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: any;
}

export interface VendorListResponse extends BaseResponse {
    data: Vendor[];
}

export interface VendorResponse extends BaseResponse {
    data: Vendor;
}
