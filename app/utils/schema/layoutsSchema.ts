import { z } from "zod";

export const schema = z.object({
    name: z.string().min(3, "Minimal 3 karakter"),
    grid_size_x: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(20, "Maksimal 20"),
    grid_size_y: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(20, "Maksimal 20"),
    seat_count: z
        .number("Harus berupa angka")
        .min(1, "Minimal 1")
        .max(500, "Maksimal 500"),
    created_by: z.string().optional(),
});

// export type LayoutForm = z.output<typeof schema>;
