export interface PageInfo {
    route: string;
    name: string;
}

const routeMap: Record<string, PageInfo> = {
    daily_user: {
        route: "/app",
        name: "Daily User",
    },
    business_owner: {
        route: "/vendor",
        name: "Business Owner",
    },
    platform_owner: {
        route: "/superadmin",
        name: "Super Admin",
    },
    admin_business: {
        route: "/admin-owner",
        name: "Admin Vendor",
    },
    admin_pool: {
        route: "/admin-pool",
        name: "Admin Pool",
    },
};

const FALLBACK: PageInfo = {
    route: "/unauthorized",
    name: "Unauthorized",
};

export const mapRolesToRoute = (role: string): PageInfo => {
    return routeMap[role] ?? FALLBACK;
};
