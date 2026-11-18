import Link from "next/link";
import AlbumArtwork from "../components/AlbumArtwork";
import SearchForm from "../components/SearchForm";
import { albums, artists } from "../../data/albums";
import { MAX_QUERY_LENGTH, normalizeQuery, searchAlbums } from "../../lib/search";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AlbumsPage({ searchParams }: Props) {
    const { artist: artistSlug, q } = await searchParams;
    const rawQuery = typeof q === "string" ? q : "";
    const isSearching = typeof q === "string";
    const hasQuery = normalizeQuery(rawQuery) !== "";
    const selectedArtist = typeof artistSlug === "string"
        ? artists.find((artist) => artist.slug === artistSlug)
        : undefined;
    const artistAlbums = selectedArtist
        ? albums.filter((album) => album.artist === selectedArtist.name)
        : [];
    const results = searchAlbums(rawQuery, selectedArtist ? artistAlbums : albums);

    return (
        <main className="page-shell collection-page">
            <div className="collection-heading">
                <div>
                    <p className="eyebrow">{selectedArtist ? "ARTIST / ALBUMS" : "THE LISTENING ARCHIVE"}</p>
                    <h1>{selectedArtist?.name ?? "The collection"}</h1>
                </div>
                <p className="collection-count">
                    {String(selectedArtist ? artistAlbums.length : artists.length).padStart(2, "0")} {" "}
                    <span>{selectedArtist ? "ALBUMS" : "ARTISTS"}</span>
                </p>
            </div>

            <SearchForm artist={selectedArtist?.slug} defaultValue={rawQuery} maxLength={MAX_QUERY_LENGTH} />

            {isSearching && (
                <section aria-label="Search results" data-testid="search-results">
                    {!hasQuery ? (
                        <p data-testid="search-message">Please enter a search term.</p>
                    ) : results.length === 0 ? (
                        <p data-testid="search-message">No results found for &quot;{rawQuery.trim()}&quot;.</p>
                    ) : (
                        <>
                            <p data-testid="search-message">{results.length} result(s) found.</p>
                            <div className="album-grid">
                                {results.map((album) => (
                                    <Link
                                        className="album-card"
                                        data-testid="search-result"
                                        href={selectedArtist ? `/albums/${album.id}?artist=${selectedArtist.slug}` : `/albums/${album.id}`}
                                        key={album.id}
                                        aria-label={`Open ${album.title} by ${album.artist}`}
                                    >
                                        <AlbumArtwork cover={album.cover} alt={`${album.title} by ${album.artist}`} />
                                        <span className="album-card-meta">
                                            <span className="album-artist">{album.title}</span>
                                            <span className="album-year">{album.year}</span>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {selectedArtist && <Link className="back-link" href="/albums">← All artists</Link>}

            {!isSearching && <section className="album-grid" aria-label={selectedArtist ? `${selectedArtist.name} albums` : "Artists"}>
                {selectedArtist
                    ? artistAlbums.map((album, index) => (
                        <Link
                            className="album-card"
                            href={`/albums/${album.id}?artist=${selectedArtist.slug}`}
                            key={album.id}
                            aria-label={`Open ${album.title} by ${album.artist}`}
                        >
                            <AlbumArtwork cover={album.cover} alt={`${album.title} by ${album.artist}`} />
                            <span className="album-card-meta">
                                <span className="album-artist">{album.title}</span>
                                <span className="album-year">{album.year}</span>
                            </span>
                            <span className="album-card-index">
                                <span>NO. {String(index + 1).padStart(2, "0")}</span>
                                <span>OPEN ↗</span>
                            </span>
                        </Link>
                    ))
                    : artists.map((artist, index) => (
                        <Link
                            className="album-card"
                            href={`/albums?artist=${artist.slug}`}
                            key={artist.slug}
                            aria-label={`Open ${artist.name} albums`}
                        >
                            <AlbumArtwork cover={artist.image} alt={artist.name} />
                            <span className="album-card-meta">
                                <span className="album-artist">{artist.name}</span>
                                <span className="album-year">
                                    {albums.filter((album) => album.artist === artist.name).length} albums
                                </span>
                            </span>
                            <span className="album-card-index">
                                <span>NO. {String(index + 1).padStart(2, "0")}</span>
                                <span>OPEN ↗</span>
                            </span>
                        </Link>
                    ))}
            </section>}
        </main>
    );
}