// Base URL of the public cloud storage bucket (S3, Supabase Storage, Firebase, Cloudinary, ...).
const DEFAULT_BASE_URL = "https://ubhyxbaexwllikokpbjv.supabase.co/storage/v1/object/public/music-application";

export const IMAGE_BASE_URL = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");

export function getImageUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${IMAGE_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
