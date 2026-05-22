import type { LoginRequestDTO, RegisterRequestDTO } from "~/models";
import { useAuthRepository } from "~/repositories";

export const useAuthService = () => {

    const repo = useAuthRepository()

    const login = async (req: LoginRequestDTO) => {
        return repo.login(req)
    }

    const register = async (req: RegisterRequestDTO) => {
        return repo.register(req)
    }

    return {
        login,
        register
    }
}