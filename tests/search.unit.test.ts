import { describe, expect, it } from "vitest";
import { MAX_QUERY_LENGTH, normalizeQuery, searchAlbums } from "../lib/search";

const titles = (q: string | null | undefined) => searchAlbums(q).map((a) => a.title);

describe("searchAlbums (unit)", () => {
    it("finds existing albums by title", () => expect(titles("Discovery")).toEqual(["Discovery"]));
    it("finds albums by artist (multiple results)", () =>
        expect(titles("Britney Spears").sort()).toEqual(["Blackout", "Circus"]));
    it("finds albums by genre, year and track", () => {
        expect(titles("electro").sort()).toEqual(["Braveface", "Enmity"]);
        expect(titles("2001")).toEqual(["Discovery"]);
        expect(titles("Womanizer")).toEqual(["Circus"]);
    });
    it("returns nothing for non-existing data", () => {
        expect(titles("zzzzxxxx")).toEqual([]);
        expect(titles("1850")).toEqual([]);
    });
    it("returns nothing for empty, whitespace, null and undefined input", () => {
        for (const q of ["", "   ", "\t\n", null, undefined]) expect(titles(q)).toEqual([]);
    });
    it("is case-insensitive", () => {
        expect(titles("dAfT pUnK")).toEqual(["Discovery"]);
        expect(titles("CIRCUS")).toEqual(["Circus"]);
    });
    it("ignores surrounding and repeated whitespace", () => {
        expect(titles("  Daft   Punk  ")).toEqual(["Discovery"]);
    });
    it("supports partial matches and special characters", () => {
        expect(titles("disc")).toEqual(["Discovery"]);
        expect(titles("(I Got a Plan)")).toEqual(["Blackout"]);
        expect(titles("S.ands")).toEqual(["Enmity"]);
        expect(titles(".*")).toEqual([]);
        expect(titles("<script>")).toEqual([]);
    });
    it("handles boundary values: 1 char, max length, over max length", () => {
        expect(titles("e").length).toBeGreaterThan(0);
        const max = "a".repeat(MAX_QUERY_LENGTH);
        expect(titles(max)).toEqual([]);
        expect(normalizeQuery(max + "extra")).toHaveLength(MAX_QUERY_LENGTH);
        expect(titles("Circus" + " ".repeat(500))).toEqual(["Circus"]);
    });
});
