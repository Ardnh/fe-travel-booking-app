import type { BasePagination, BaseResponse } from "../common";

export interface Layouts {
    layout_id: string;
    name: string;
    grid_size_x: number;
    grid_size_y: number;
    seat_count: number;
    created_by: string;
    layout_positions: any[];
}

export interface LayoutListResponse extends BaseResponse, BasePagination {
    data: Layouts[];
}

export interface CreateLayoutResponse extends BaseResponse, BasePagination {
    data: Layouts;
}

export interface UpdateLayoutResponse extends CreateLayoutResponse {}

export interface CreateLayoutDto extends Pick<
    Layouts,
    "name" | "grid_size_x" | "grid_size_y" | "seat_count" | "created_by"
> {}

export interface UpdateLayoutDto extends Partial<
    Pick<Layouts, "name" | "grid_size_x" | "grid_size_y" | "seat_count">
> {
    layout_id: Layouts["layout_id"];
}

export interface LayoutForm {
    layout_id?: string;
    name?: string;
    grid_size_x?: number;
    grid_size_y?: number;
    seat_count?: number;
    created_by?: string;
    layout_positions?: any[];
}
