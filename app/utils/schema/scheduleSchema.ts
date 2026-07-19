import { z } from "zod";

// Schema untuk TimeBand (PriceBand)
const TimeBandSchema = z.object({
    label: z.string().min(1, "Band name is required"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    from: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:mm"),
    to: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:mm"),
});

// Schema utama untuk ScheduleBulkForm
export const ScheduleBulkFormSchema = z
    .object({
        // Required fields
        originPoolId: z.string("Origin pool is required"),
        destinationMode: z.enum(["city", "pools"]),

        // Conditional fields berdasarkan destinationMode
        destinationCity: z.string().min(1, "City name is required").max(100).optional(),
        destinationPoolIds: z
            .array(z.string())
            .min(0, "Minimum 0 destination pools") // Bisa kosong jika mode city
            .max(20, "Maximum 20 destination pools")
            .optional(),

        // Schedule fields
        departureTimes: z
            .array(z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:mm"))
            .min(1, "Minimum 1 departure time")
            .max(24, "Maximum 24 departure times"),
        validFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
        validTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
        daysOfWeek: z.array(z.number().min(0).max(6)).min(1, "Minimum 1 day").max(7, "Maximum 7 days"),
        layoutId: z.string("Layout ID is required"),
        priceBands: z.array(TimeBandSchema).min(1, "Minimum 1 price band"),
    })
    .superRefine((data, ctx) => {
        // Validasi conditional: jika destinationMode = "city", destinationCity harus diisi
        if (data.destinationMode === "city" && !data.destinationCity) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Destination city is required when mode is 'city'",
                path: ["destinationCity"],
            });
        }

        // Validasi conditional: jika destinationMode = "pools", destinationPoolIds harus diisi
        if (data.destinationMode === "pools" && (!data.destinationPoolIds || data.destinationPoolIds.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Destination pools are required when mode is 'pools'",
                path: ["destinationPoolIds"],
            });
        }

        // Validasi: validFrom tidak boleh lebih besar dari validTo
        if (data.validFrom && data.validTo && data.validFrom > data.validTo) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Valid from date cannot be greater than valid to date",
                path: ["validFrom"],
            });
        }
    });

// Infer type dari schema
export type ScheduleBulkFormSchemaType = z.infer<typeof ScheduleBulkFormSchema>;
