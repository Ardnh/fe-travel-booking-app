export const useScheduleGetPoolsAsync = (vendorId: string) => {
    const config = useRuntimeConfig();

    return useLazyFetch(
        () =>
            `${config.public.apiBase}/api/v1/pool-points/vendors/${vendorId}/pool-points`,
        {
            key: `pool-points-${vendorId}`,
            transform: (data: { id: number; name: string }[]) =>
                data?.map((p) => ({ label: p.name, value: String(p.id) })),
            immediate: false,
        },
    );
};
