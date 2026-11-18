import Link from "next/link";
import { albums } from "../data/albums";

const trackCount = albums.reduce((total, album) => total + album.tracks.length, 0);

export default function Home() {
  return (
    <main className="page-shell home-page">
      <section className="home-copy">
        <p className="eyebrow">A PERSONAL RECORD INDEX</p>
        <h1>
          Keep the good
          <br />
          <span>side up.</span>
        </h1>
        <div className="home-stats" aria-label="Collection totals">
          <div>
            <strong>{String(albums.length).padStart(2, "0")}</strong>
            <span>albums</span>
          </div>
          <span className="stats-divider" aria-hidden="true" />
          <div>
            <strong>{String(trackCount).padStart(2, "0")}</strong>
            <span>tracks</span>
          </div>
        </div>
        <Link className="primary-link" href="/albums">
          <span>Open the collection</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
      <div className="home-art" aria-hidden="true">
        <div className="home-record">
          <span className="home-record-label">S</span>
          <span className="home-record-hole" />
          <span className="home-record-shine" />
        </div>
        <span className="home-art-caption">SIDE A / ARCHIVE 001</span>
      </div>
    </main>
  );
}
