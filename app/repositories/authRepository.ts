import type { BaseResponse, LoginRequestDTO, LoginResponse, RegisterRequestDTO } from "~/models";

export const useAuthRepository = () => {

    const { api } = useApi()

    return {
        login: (req: LoginRequestDTO) => api<LoginResponse>('/auth/login', { method: 'POST', body: req }),
        register: (req: RegisterRequestDTO) => api<BaseResponse>('/auth/register', { method: 'POST', body: req })
    }
}