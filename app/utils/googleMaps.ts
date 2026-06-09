// utils/google-maps.ts
export function extractEmbedSrc(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();
    // bisa terima HTML <iframe ...> mentah maupun URL polos
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    const candidate = match ? match[1] : trimmed;

    if (!candidate) return null;

    try {
        const u = new URL(candidate);
        if (
            u.protocol === "https:" &&
            u.hostname === "www.google.com" &&
            u.pathname.startsWith("/maps/embed")
        ) {
            return candidate;
        }
    } catch {}
    return null;
}

export function coordsFromEmbedSrc(
    src: string,
): { lat: number; lng: number } | null {
    const lng = src.match(/!2d(-?\d+\.\d+)/);
    const lat = src.match(/!3d(-?\d+\.\d+)/);
    if (lat && lng) return { lat: Number(lat[1]), lng: Number(lng[1]) };
    return null;
}
