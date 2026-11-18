"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

type Props = { artist?: string; defaultValue: string; maxLength: number };

export default function SearchForm({ artist, defaultValue, maxLength }: Props) {
    const router = useRouter();
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const onChange = (value: string) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            const trimmed = value.trim();
            const params = new URLSearchParams();
            if (artist) params.set("artist", artist);
            if (trimmed) params.set("q", trimmed);
            const qs = params.toString();
            router.replace(qs ? `/albums?${qs}` : "/albums");
        }, 250);
    };

    return (
        <form className="search-form" action="/albums" method="get" role="search" onSubmit={() => clearTimeout(timer.current)}>
            {artist && <input type="hidden" name="artist" value={artist} />}
            <label htmlFor="search-input">Search albums</label>
            <input
                id="search-input"
                name="q"
                type="search"
                maxLength={maxLength}
                defaultValue={defaultValue}
                placeholder="Title, artist, genre, year or track"
                onChange={(e) => onChange(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}
