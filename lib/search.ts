import { albums as allAlbums, type Album } from "../data/albums";

export const MAX_QUERY_LENGTH = 100;

export function normalizeQuery(query: string | undefined | null): string {
    return (query ?? "").trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH).toLowerCase();
}

export function searchAlbums(query: string | undefined | null, source: Album[] = allAlbums): Album[] {
    const q = normalizeQuery(query);
    if (!q) return [];
    return source.filter((album) =>
        [album.title, album.artist, album.genre, String(album.year), ...album.tracks]
            .some((field) => field.toLowerCase().includes(q))
    );
}
