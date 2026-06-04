export const PERMISSIONS = {
    PROFILE_READ: "profile:read",
    PROFILE_UPDATE: "profile:update",
    SERVICE_TYPES_READ: "service-types:read",
    SERVICE_TYPES_CREATE: "service-types:create",
    SERVICE_TYPES_UPDATE: "service-types:update",
    SERVICE_TYPES_DELETE: "service-types:delete",
    VENDORS_READ: "vendors:read",
    VENDORS_UPDATE: "vendors:update",
    VENDORS_DELETE: "vendors:delete",
    SCHEDULES_READ: "schedules:read",
    BOOKINGS_READ: "bookings:read",
    USER_ROLES_READ: "user-roles:read",
    USER_ROLES_CREATE: "user-roles:create",
    USER_ROLES_UPDATE: "user-roles:update",
    USER_ROLES_DELETE: "user-roles:delete",
    LAYOUTS_READ: "layouts:read",
    LAYOUTS_CREATE: "layouts:create",
    LAYOUTS_UPDATE: "layouts:update",
    LAYOUTS_DELETE: "layouts:delete",
    LAYOUT_POSITIONS_READ: "layout-positions:read",
    LAYOUT_POSITIONS_CREATE: "layout-positions:create",
    LAYOUT_POSITIONS_UPDATE: "layout-positions:update",
    LAYOUT_POSITIONS_DELETE: "layout-positions:delete",
    POOL_POINTS_READ: "pool-points:read",
    USERS_CREATE: "users:create",
    USERS_UPDATE: "users:update",
    USERS_DELETE: "users:delete",
    VENDORS_CREATE: "vendors:create",
    BOOKINGS_CREATE: "bookings:create",
} as const;

export const usePermissions = () => {
    const auth = useUsersStore();

    // cek single permission
    const can = (permission: string): boolean => {
        return auth.userProfile?.permissions.includes(permission) ?? false;
    };

    // cek salah satu permission terpenuhi (OR)
    const canAny = (permissions: string[]): boolean => {
        return permissions.some((p) =>
            auth.userProfile?.permissions.includes(p),
        );
    };

    // cek semua permission harus terpenuhi (AND)
    const canAll = (permissions: string[]): boolean => {
        return permissions.every((p) =>
            auth.userProfile?.permissions.includes(p),
        );
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

    // Permissions

    // Layouts
    const HAS_ACCESS_LAYOUTS_READ = can(PERMISSIONS.LAYOUTS_READ);
    const HAS_ACCESS_LAYOUTS_CREATE = can(PERMISSIONS.LAYOUTS_CREATE);
    const HAS_ACCESS_LAYOUTS_UPDATE = can(PERMISSIONS.LAYOUTS_UPDATE);
    const HAS_ACCESS_LAYOUTS_DELETE = can(PERMISSIONS.LAYOUTS_DELETE);

    // Layouts Positions
    const HAS_ACCESS_LAYOUT_POSITIONS_READ = can(
        PERMISSIONS.LAYOUT_POSITIONS_READ,
    );
    const HAS_ACCESS_LAYOUT_POSITIONS_CREATE = can(
        PERMISSIONS.LAYOUT_POSITIONS_CREATE,
    );
    const HAS_ACCESS_LAYOUT_POSITIONS_UPDATE = can(
        PERMISSIONS.LAYOUT_POSITIONS_UPDATE,
    );
    const HAS_ACCESS_LAYOUT_POSITIONS_DELETE = can(
        PERMISSIONS.LAYOUT_POSITIONS_DELETE,
    );

    // Profile
    const HAS_ACCESS_PROFILE_READ = can(PERMISSIONS.PROFILE_READ);
    const HAS_ACCESS_PROFILE_UPDATE = can(PERMISSIONS.PROFILE_UPDATE);

    // Service Types
    const HAS_ACCESS_SERVICE_TYPES_READ = can(PERMISSIONS.SERVICE_TYPES_READ);
    const HAS_ACCESS_SERVICE_TYPES_CREATE = can(
        PERMISSIONS.SERVICE_TYPES_CREATE,
    );
    const HAS_ACCESS_SERVICE_TYPES_UPDATE = can(
        PERMISSIONS.SERVICE_TYPES_UPDATE,
    );
    const HAS_ACCESS_SERVICE_TYPES_DELETE = can(
        PERMISSIONS.SERVICE_TYPES_DELETE,
    );

    // Vendor
    const HAS_ACCESS_VENDORS_READ = can(PERMISSIONS.VENDORS_READ);
    const HAS_ACCESS_VENDORS_CREATE = can(PERMISSIONS.VENDORS_CREATE);
    const HAS_ACCESS_VENDORS_UPDATE = can(PERMISSIONS.VENDORS_UPDATE);
    const HAS_ACCESS_VENDORS_DELETE = can(PERMISSIONS.VENDORS_DELETE);

    // Schedules
    const HAS_ACCESS_SCHEDULES_READ = can(PERMISSIONS.SCHEDULES_READ);

    // Bookings
    const HAS_ACCESS_BOOKINGS_READ = can(PERMISSIONS.BOOKINGS_READ);
    const HAS_ACCESS_BOOKINGS_CREATE = can(PERMISSIONS.BOOKINGS_CREATE);

    // User Roles
    const HAS_ACCESS_USER_ROLES_READ = can(PERMISSIONS.USER_ROLES_READ);
    const HAS_ACCESS_USER_ROLES_CREATE = can(PERMISSIONS.USER_ROLES_CREATE);
    const HAS_ACCESS_USER_ROLES_UPDATE = can(PERMISSIONS.USER_ROLES_UPDATE);
    const HAS_ACCESS_USER_ROLES_DELETE = can(PERMISSIONS.USER_ROLES_DELETE);

    // Pool Points
    const HAS_ACCESS_POOL_POINTS_READ = can(PERMISSIONS.POOL_POINTS_READ);

    // Users
    const HAS_ACCESS_USERS_CREATE = can(PERMISSIONS.USERS_CREATE);
    const HAS_ACCESS_USERS_UPDATE = can(PERMISSIONS.USERS_UPDATE);
    const HAS_ACCESS_USERS_DELETE = can(PERMISSIONS.USERS_DELETE);

    return {
        can,
        canAny,
        canAll,
        hasRole,
        isActiveRole,
        hasMultiRole,
        PERMISSIONS,
        HAS_ACCESS_LAYOUTS_READ,
        HAS_ACCESS_LAYOUTS_CREATE,
        HAS_ACCESS_LAYOUTS_UPDATE,
        HAS_ACCESS_LAYOUTS_DELETE,
        HAS_ACCESS_LAYOUT_POSITIONS_READ,
        HAS_ACCESS_LAYOUT_POSITIONS_CREATE,
        HAS_ACCESS_LAYOUT_POSITIONS_UPDATE,
        HAS_ACCESS_LAYOUT_POSITIONS_DELETE,
        HAS_ACCESS_PROFILE_READ,
        HAS_ACCESS_PROFILE_UPDATE,
        HAS_ACCESS_SERVICE_TYPES_READ,
        HAS_ACCESS_SERVICE_TYPES_CREATE,
        HAS_ACCESS_SERVICE_TYPES_UPDATE,
        HAS_ACCESS_SERVICE_TYPES_DELETE,
        HAS_ACCESS_VENDORS_READ,
        HAS_ACCESS_VENDORS_CREATE,
        HAS_ACCESS_VENDORS_UPDATE,
        HAS_ACCESS_VENDORS_DELETE,
        HAS_ACCESS_SCHEDULES_READ,
        HAS_ACCESS_BOOKINGS_READ,
        HAS_ACCESS_BOOKINGS_CREATE,
        HAS_ACCESS_USER_ROLES_READ,
        HAS_ACCESS_USER_ROLES_CREATE,
        HAS_ACCESS_USER_ROLES_UPDATE,
        HAS_ACCESS_USER_ROLES_DELETE,
        HAS_ACCESS_POOL_POINTS_READ,
        HAS_ACCESS_USERS_CREATE,
        HAS_ACCESS_USERS_UPDATE,
        HAS_ACCESS_USERS_DELETE,
    };
};
