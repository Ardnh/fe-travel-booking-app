import type { CreateServiceTypeDTO, UpdateServiceTypeDTO } from "~/models";
import { useServiceTypeRepository } from "~/repositories";

export const useServiceTypesService = () => {
    const repo = useServiceTypeRepository();

    const getAllServiceType = (query: {
        page: number;
        page_size: number;
        search: string;
        sort_by: string;
        sort_order: string;
    }) => {
        return repo.getAllServiceType(query);
    };

    const getServiceTypeById = (id: string) => {
        return repo.getServiceTypeById(id);
    };

    const createServiceType = (data: CreateServiceTypeDTO) => {
        return repo.createServiceType(data);
    };

    const updateServiceType = (id: string, data: UpdateServiceTypeDTO) => {
        return repo.updateServiceType(id, data);
    };

    const deleteServiceType = (id: string) => {
        return repo.deleteServiceType(id);
    };

    return {
        getAllServiceType,
        getServiceTypeById,
        createServiceType,
        updateServiceType,
        deleteServiceType,
    };
};
