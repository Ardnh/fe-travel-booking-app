import { useUsersRepository } from "~/repositories/usersRepository";

export const useUsersService = () => {
    const repo = useUsersRepository();

    const getUserProfile = async () => {
        return await repo.getUserProfile();
    };

    return {
        getUserProfile,
    };
};
