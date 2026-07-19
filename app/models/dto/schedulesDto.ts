// Tipe untuk UUID
type UUID = string;

// Tipe untuk jam (format HH:mm)
type TimeString = string; // Format: "15:04"

// Tipe untuk tanggal (format YYYY-MM-DD)
type DateString = string; // Format: "2006-01-02"

// Tipe untuk hari dalam minggu (0 = Minggu, 6 = Sabtu)
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Interface PriceBandDTO
interface PriceBandDTO {
    from: TimeString;
    to: TimeString;
    label: string;
    price: number;
}

// Interface utama dengan tipe lebih spesifik
export interface CreateScheduleDTO {
    vendor_id: UUID;
    service_type_id: UUID;
    origin_pool_id: UUID;
    destination_pool_ids: UUID[]; // Array UUID dengan min 1 max 20
    layout_id: UUID;
    vehicle_type?: string; // Optional, max 100 karakter
    valid_from: DateString; // Format: YYYY-MM-DD
    valid_to: DateString; // Format: YYYY-MM-DD
    days_of_week: DayOfWeek[]; // Array dengan nilai 0-6, min 1 max 7
    departure_times: TimeString[]; // Format: HH:mm, min 1 max 24
    duration_minutes?: number; // Optional, 1-2880 menit
    price_bands: PriceBandDTO[]; // Min 1 item
    overwrite_existing: boolean;
}

// ── Tipe ───────────────────────────────────────────────────────────────
export interface TimeBand {
    label: string;
    from: string; // "05:00"
    to: string; // "17:00"  (kalau from > to → window melewati tengah malam)
    price: number;
}

export interface ScheduleBulkForm {
    originPoolId: string;
    destinationMode: "city" | "pools";
    destinationCity?: string;
    destinationPoolIds: string[];
    departureTimes: string[];
    validFrom: string;
    validTo: string;
    daysOfWeek: number[];
    layoutId: string;
    priceBands: TimeBand[];
}
