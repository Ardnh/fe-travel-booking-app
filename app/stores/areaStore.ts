import type { Area } from "~/models";
import { useAreaService } from "~/services";

export const useAreaStore = defineStore("area", () => {
    const { isLoading, getError, run } = useAsync();
    const service = useAreaService();

    const provinces = ref<Area[]>([]);
    const regencies = ref<Area[]>([]);
    const districts = ref<Area[]>([]);

    const getProvince = async () => {
        const result = await run("getProvince", () => service.getProvince());
        provinces.value = result.data ?? [];
    };

    const getRegencies = async (provinceCode: string) => {
        const result = await run("getRegencies", () =>
            service.getRegencies(provinceCode),
        );
        regencies.value = result.data ?? [];
    };

    const getDistricts = async (regencyCode: string) => {
        const result = await run("getDistricts", () =>
            service.getDistricts(regencyCode),
        );
        districts.value = result.data ?? [];
    };

    return {
        provinces,
        regencies,
        districts,
        getProvince,
        getRegencies,
        getDistricts,
    };
});
