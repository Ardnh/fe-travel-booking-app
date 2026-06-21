import type { BaseResponse, BasePagination, Params } from "../common";

export type PoolStatus = "active" | "inactive" | "suspended" | "pending";

export interface LocationData {
    address: string;
    city: string;
    province: string;
    district: string;
    latitude: number;
    longitude: number;
}

export interface Pool {
    pool_id: string;
    vendor_id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    province: string;
    district: string;
    latitude: number;
    longitude: number;
    open_time: string;
    close_time: string;
    status: string;
    description?: string;
    embed_url?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePoolDTO {
    vendor_id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    province: string;
    district: string;
    latitude: number;
    longitude: number;
    open_time: string;
    close_time: string;
    description?: string;
    status?: PoolStatus;
}

export type UpdatePoolDTO = Partial<CreatePoolDTO>;

export interface PoolForm {
    name: string;
    address: string;
    city: string;
    province: string;
    district: string;
    open_time: string;
    close_time: string;
    description: string;
    status: PoolStatus;
    embed_url: string;
    latitude?: number;
    longitude?: number;
}

export interface PoolResponse extends BaseResponse {
    data: Pool;
}

export interface PoolListResponse extends BaseResponse, BasePagination {
    data: Pool[];
}

export interface AvailableLocationsResponse extends BaseResponse {
    data: string[];
}

export interface CreatePoolResponse extends BaseResponse {
    data: Pool;
}

export interface UpdatePoolResponse extends CreatePoolResponse {}

export interface PoolParams extends Params {
    search?: string;
}
