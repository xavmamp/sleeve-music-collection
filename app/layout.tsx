import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { albums, artists } from "../data/albums";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sleeve | Record Index",
  description: "A personal archive of albums and the songs inside them.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="site-brand" href="/" aria-label="Sleeve home">
              <span className="brand-mark" aria-hidden="true">S</span>
              <span className="brand-wordmark">SLEEVE</span>
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
              <Link href="/">Home</Link>
              <Link href="/albums">
                Artists <span className="nav-count">{String(artists.length).padStart(2, "0")}</span>
              </Link>
            </nav>

            <span className="header-note">PERSONAL RECORD INDEX</span>
          </header>

          {children}

          <footer className="site-footer">
            <span>SLEEVE / LISTENING ARCHIVE</span>
            <span>{String(albums.length).padStart(2, "0")} RECORDS ON FILE</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
