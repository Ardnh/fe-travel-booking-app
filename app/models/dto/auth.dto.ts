import type { BaseResponse } from "../common";

export interface RegisterRequestDTO {
    name: string
    email: string
    password: string
}

export interface LoginRequestDTO {
    email: string
    password: string
}

export interface LoginResponse extends BaseResponse {
    data: {
        token: string
        expire_date: string
    }
}