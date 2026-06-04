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
