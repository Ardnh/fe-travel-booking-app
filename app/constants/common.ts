import type { Pagination, Params } from "~/models";

export const INITIAL_PAGINATION: Pagination = {
    current_page: 1,
    page_size: 30,
    total_items: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
};

export const INITIAL_PARAMS: Params = {
    page: 1,
    page_size: 30,
};
