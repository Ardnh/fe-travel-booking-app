import type {
    CreateServiceTypeDTO,
    ServiceType,
    UpdateServiceTypeDTO,
} from "~/models";
import { useAsync } from "~/composables";
import { useServiceTypesService } from "~/services";

export const useServiceTypesStore = defineStore("serviceTypes", () => {
    const { isLoading, getError, run } = useAsync();
    const service = useServiceTypesService();

    const serviceTypes = ref<ServiceType[]>([]);
    const serviceType = ref<ServiceType | null>(null);

    const getAllServiceType = async (query: {
        page: number;
        page_size: number;
        search: string;
        sort_by: string;
        sort_order: string;
    }) => {
        const result = await run("getAllServiceType", () =>
            service.getAllServiceType(query),
        );
        serviceTypes.value = result.data;
    };

    const getServiceTypeById = async (id: string) => {
        const result = await run("getServiceTypeById", () =>
            service.getServiceTypeById(id),
        );
        serviceType.value = result.data;
    };

    const createServiceType = async (data: CreateServiceTypeDTO) => {
        const result = await run("createServiceType", () =>
            service.createServiceType(data),
        );

        if (result.success) {
            serviceTypes.value = [...serviceTypes.value, result.data];
        }
    };

    const updateServiceType = async (
        id: string,
        data: UpdateServiceTypeDTO,
    ) => {
        const result = await run("updateServiceType", () =>
            service.updateServiceType(id, data),
        );
        if (result.success) {
            serviceTypes.value = serviceTypes.value.map((item: ServiceType) =>
                item.service_type_id === id ? result.data : item,
            );
        }
    };

    const deleteServiceType = async (id: string) => {
        const result = await run("deleteServiceType", () =>
            service.deleteServiceType(id),
        );
        if (result.success) {
            serviceTypes.value = serviceTypes.value.filter(
                (item: ServiceType) => item.service_type_id !== id,
            );
        }
    };

    return {
        isLoading,
        getError,
        serviceTypes,
        serviceType,
        getAllServiceType,
        getServiceTypeById,
        createServiceType,
        updateServiceType,
        deleteServiceType,
    };
});
