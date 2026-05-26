import type { BaseResponse } from "../common";

export interface UserProfile {
    user_id: string;
    name: string;
    email: string;
    phone: string;
    avatar_url: string;
    is_active: boolean;
    roles: string[];
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface UserProfileResponse extends BaseResponse {
    data: UserProfile;
}
