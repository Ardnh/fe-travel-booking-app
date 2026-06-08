import type { BasePagination, BaseResponse } from "../common";

export interface ServiceType {
    service_type_id: string;
    name: string;
    unique_code: string;
    description: string;
    need_chair: boolean;
    need_pickup_address: boolean;
    need_dropoff_address: boolean;
    display_order: number;
    status: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
    deleted_at: any;
}

export interface CreateServiceTypeDTO {
    name: string;
    unique_code: string;
    description: string;
    need_chair: boolean;
    need_pickup_address: boolean;
    need_dropoff_address: boolean;
    display_order: number;
    status: boolean;
    created_by: string;
}

export type UpdateServiceTypeDTO = Partial<CreateServiceTypeDTO>;

export interface ServiceTypeByIdResponse extends BaseResponse {
    data: ServiceType;
}

export interface ServiceTypeListResponse extends BaseResponse, BasePagination {
    data: ServiceType[];
}

export interface CreateServiceTypeResponse extends BaseResponse {
    data: ServiceType;
}

export interface UpdateServiceTypeResponse extends CreateServiceTypeResponse {}

export interface ServiceTypeForm {
    service_type_id?: string;
    name: string;
    unique_code: string;
    description: string;
    need_chair: boolean;
    need_pickup_address: boolean;
    need_dropoff_address: boolean;
}
