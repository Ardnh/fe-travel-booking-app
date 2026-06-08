import type { BasePagination, BaseResponse } from "../common";

export type CellType = "seat" | "isle" | "driver" | "door" | "window";
export type SeatStatus = "available" | "booked" | "blocked";

export interface Cell {
    type: CellType;
    row: number;
    col: number;
    id?: string; // untuk seat
    status?: SeatStatus; // untuk seat
    isWindow?: boolean;
    windowPosition?: "left" | "right";
}

export interface Layouts {
    layout_id: string;
    name: string;
    grid_size_x: number;
    grid_size_y: number;
    seat_count: number;
    created_by: string;
    layout_config: Cell[][];
}

export interface LayoutListResponse extends BaseResponse, BasePagination {
    data: Cell[];
}

export interface CreateLayoutResponse extends BaseResponse, BasePagination {
    data: Cell;
}

export interface UpdateLayoutResponse extends CreateLayoutResponse {}

export interface CreateLayoutDto extends Pick<
    Layouts,
    | "name"
    | "grid_size_x"
    | "grid_size_y"
    | "seat_count"
    | "created_by"
    | "layout_config"
> {}

export interface UpdateLayoutDto extends Partial<
    Pick<
        Layouts,
        "name" | "grid_size_x" | "grid_size_y" | "seat_count" | "layout_config"
    >
> {
    layout_id: Layouts["layout_id"];
}

export interface LayoutForm {
    layout_id?: string;
    name: string;
    grid_size_x: number;
    grid_size_y: number;
    seat_count?: number;
    created_by?: string;
    layout_config: Cell[][];
}
