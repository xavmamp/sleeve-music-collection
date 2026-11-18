import Image from "next/image";

type AlbumArtworkProps = {
    cover?: string;
    alt: string;
    large?: boolean;
};

export default function AlbumArtwork({ cover, alt, large = false }: AlbumArtworkProps) {
    return (
        <div className={`album-artwork${large ? " album-artwork-large" : ""}`}>
            {cover && (
                <Image
                    src={cover}
                    alt={alt}
                    fill
                    sizes="(max-width: 820px) 100vw, 40vw"
                />
            )}
        </div>
    );
}