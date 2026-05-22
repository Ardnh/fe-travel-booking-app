export interface UserProfileResponse {
    user_id: string
    name: string
    email: string
    phone: string
    avatar_url: string
    is_active: boolean
    roles: Role[]
    permissions: string[]
    created_at: string
    updated_at: string
}

export interface Role {
    user_role_id: string
    user_id: string
    role: string
}
