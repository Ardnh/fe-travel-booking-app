import { useAreaRepository } from "~/repositories";

export const useAreaService = () => {
    const repo = useAreaRepository();

    const getProvince = async () => {
        return await repo.getProvince();
    };

    const getRegencies = async (provinceCode: string) => {
        return await repo.getRegencies(provinceCode);
    };

    const getDistricts = async (regencyCode: string) => {
        return await repo.getDistricts(regencyCode);
    };

    return {
        getProvince,
        getRegencies,
        getDistricts,
    };
};
