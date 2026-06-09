import type { GetAreaResponse } from "~/models";

export const useAreaRepository = () => {
    return {
        getProvince: () =>
            $fetch<GetAreaResponse>("/api/wilayah/provinces.json"),
        getRegencies: (provinceCode: string) =>
            $fetch<GetAreaResponse>(
                `/api/wilayah/regencies/${provinceCode}.json`,
            ),
        getDistricts: (regencyCode: string) =>
            $fetch<GetAreaResponse>(
                `/api/wilayah/districts/${regencyCode}.json`,
            ),
    };
};
