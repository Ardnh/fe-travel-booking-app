import { useUsersRepository } from "~/repositories/usersRepository";

export const useUsersService = () => {

    const repo = useUsersRepository()

    const getUserProfile = () => {
        return repo.getUserProfile()
    }

    return {
        getUserProfile
    }
}