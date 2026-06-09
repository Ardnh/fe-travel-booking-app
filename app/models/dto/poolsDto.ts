import type { BaseResponse, BasePagination } from "../common";

export type PoolStatus = "active" | "inactive" | "suspended" | "pending";

export interface Pool {
    pool_id: string;
    vendor_id: string;
    name: string;
    slug: string;
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
    open_time: string;
    close_time: string;
    status: string;
    description?: string;
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
    latitude: number;
    longitude: number;
    open_time: string;
    close_time: string;
    description?: string;
    status?: PoolStatus;
}

export type UpdatePoolDTO = Partial<CreatePoolDTO>;

export interface PoolResponse extends BaseResponse {
    data: Pool;
}

export interface PoolListResponse extends BaseResponse, BasePagination {
    data: Pool[];
}
