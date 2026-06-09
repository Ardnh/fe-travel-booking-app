export interface Area {
    code: string;
    name: string;
}

export interface Meta {
    administrative_area_level: number;
    updated_at: string;
}

export interface GetAreaResponse {
    data: Area[];
    meta: Meta;
}
