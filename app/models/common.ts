export interface BaseResponse {
    success: boolean;
    message: string;
}

export interface Pagination {
    current_page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface BasePagination {
    pagination: Pagination;
}

export interface Params {
    page: number;
    page_size: number;
}
