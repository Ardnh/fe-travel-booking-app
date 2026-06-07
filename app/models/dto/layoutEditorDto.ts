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
