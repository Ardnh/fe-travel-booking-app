import type { UserProfileResponse } from "~/models";

export const useUsersRepository = () => {

    const { api } = useApi()

    return {
        getUserProfile: () => api<UserProfileResponse>('/users/profile')
    }
}