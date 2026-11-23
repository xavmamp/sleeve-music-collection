import Link from "next/link";
import AlbumArtwork from "../../components/AlbumArtwork";
import { Comments } from "../../components/Comments";
import { albums } from "../../../data/albums";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AlbumPage({ params, searchParams }: Props) {
    const [{ id }, query] = await Promise.all([params, searchParams]);
    const artistSlug = typeof query.artist === "string" ? query.artist : undefined;
    const album = albums.find((item) => item.id === Number(id));

    if (!album) {
        return (
            <main className="page-shell detail-page">
                <p className="eyebrow">NOT IN THE INDEX</p>
                <h1>Album not found</h1>
                <Link className="back-link" href="/albums">Back to albums</Link>
            </main>
        );
    }

    return (
        <main className="page-shell detail-page">
            <Link className="back-link" href={artistSlug ? `/albums?artist=${artistSlug}` : "/albums"}>
                ← {artistSlug ? "Artist albums" : "All artists"}
            </Link>
            <article className="detail-layout">
                <AlbumArtwork cover={album.cover} alt={`${album.title} by ${album.artist}`} large />
                <div className="detail-copy">
                    <p className="eyebrow">{album.genre} / {album.year}</p>
                    <h1>{album.title}</h1>
                    <p className="detail-artist">{album.artist}</p>
                    <section className="track-section" aria-labelledby="tracks-heading">
                        <div className="track-heading-row">
                            <h2 id="tracks-heading">Track list</h2>
                            <span>{String(album.tracks.length).padStart(2, "0")} TRACKS</span>
                        </div>
                        <ol className="track-list">
                            {album.tracks.map((track, index) => (
                                <li className="track-row" key={track}>
                                    <span className="track-number">{String(index + 1).padStart(2, "0")}</span>
                                    <span>{track}</span>
                                </li>
                            ))}
                        </ol>
                    </section>
                </div>
            </article>
            <Comments albumId={album.id} />
        </main>
    );
}