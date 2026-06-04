export const usePermissions = () => {
    const auth = useUsersStore();

    // cek single permission
    const can = (permission: string): boolean => {
        return auth.userProfile?.permissions.includes(permission) ?? false;
    };

    // cek salah satu permission terpenuhi (OR)
    const canAny = (permissions: string[]): boolean => {
        return permissions.some((p) => auth.userProfile?.permissions.includes(p));
    };

    // cek semua permission harus terpenuhi (AND)
    const canAll = (permissions: string[]): boolean => {
        return permissions.every((p) => auth.userProfile?.permissions.includes(p));
    };

    // cek role
    const hasRole = (role: string): boolean => {
        return auth.userProfile?.roles.includes(role) ?? false;
    };

    // cek active role (untuk multi-role user)
    const isActiveRole = (role: string): boolean => {
        return auth.activeRole === role;
    };

    // cek jumlah role yang dimiliki user
    const hasMultiRole = () => {
        return (auth.userProfile?.roles ?? []).length > 1;
    };

    return { can, canAny, canAll, hasRole, isActiveRole, hasMultiRole };
};
