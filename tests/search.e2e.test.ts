import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Builder, By, until, type WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3000";
let driver: WebDriver;

async function search(term: string) {
    await driver.get(`${BASE}/albums`);
    const input = await driver.wait(until.elementLocated(By.id("search-input")), 10000);
    await input.clear();
    if (term) await input.sendKeys(term);
    await driver.findElement(By.css(".search-form button")).click();
}
const message = async () => driver.wait(until.elementLocated(By.css("[data-testid=search-message]")), 5000).getText();
const resultCount = async () => (await driver.findElements(By.css("[data-testid=search-result]"))).length;

describe("Search UI (Selenium E2E)", () => {
    beforeAll(async () => {
        const options = new chrome.Options().addArguments("--headless=new", "--window-size=1280,900");
        driver = await new Builder().forBrowser("chrome").setChromeOptions(options as never).build();
    });
    afterAll(async () => { await driver?.quit(); });

    it("positive: finds an existing album by title", async () => {
        await search("Discovery");
        expect(await message()).toContain("1 result");
        expect(await resultCount()).toBe(1);
    });

    it("positive: case-insensitive artist search returns multiple albums", async () => {
        await search("bRiTnEy");
        await message();
        expect(await resultCount()).toBe(2);
    });

    it("positive: clicking a result opens the album details page", async () => {
        await search("Circus");
        await message();
        await driver.findElement(By.css("[data-testid=search-result]")).click();
        await driver.wait(until.urlContains("/albums/1"), 5000);
        expect(await driver.findElement(By.css("h1")).getText()).toContain("Circus");
    });

    it("positive: results update while typing, without submitting", async () => {
        await driver.get(`${BASE}/albums`);
        const input = await driver.wait(until.elementLocated(By.id("search-input")), 10000);
        await input.sendKeys("Discov");
        await driver.wait(until.elementLocated(By.css("[data-testid=search-result]")), 5000);
        expect(await resultCount()).toBe(1);
    });

    it("positive: search on an artist page is limited to that artist", async () => {
        await driver.get(`${BASE}/albums?artist=esser`);
        const input = await driver.wait(until.elementLocated(By.id("search-input")), 10000);
        await input.sendKeys("e");
        await driver.wait(until.elementLocated(By.css("[data-testid=search-result]")), 5000);
        const labels = await Promise.all((await driver.findElements(By.css("[data-testid=search-result]"))).map((e) => e.getAttribute("aria-label")));
        expect(labels.length).toBe(2);
        labels.forEach((l) => expect(l).toContain("Esser"));
    });

    it("negative: term from another artist yields no results on an artist page", async () => {
        await driver.get(`${BASE}/albums?artist=esser&q=Discovery`);
        expect(await message()).toContain("No results found");
    });

    it("negative: non-existing data shows 'No results'", async () => {
        await search("nonexistent-album-xyz");
        expect(await message()).toContain("No results found");
        expect(await resultCount()).toBe(0);
    });

    it("negative: empty input asks for a search term", async () => {
        await search("");
        expect(await message()).toContain("Please enter a search term");
        expect(await resultCount()).toBe(0);
    });

    it("negative: whitespace-only input asks for a search term", async () => {
        await search("   ");
        expect(await message()).toContain("Please enter a search term");
    });

    it("negative: HTML/script input is escaped and yields no results", async () => {
        await search("<script>alert(1)</script>");
        expect(await message()).toContain("No results found");
        expect(await resultCount()).toBe(0);
    });

    it("boundary: input is limited to 100 characters", async () => {
        await driver.get(`${BASE}/albums`);
    const input = await driver.wait(until.elementLocated(By.id("search-input")), 10000);
        await input.sendKeys("a".repeat(150));
        expect(((await input.getAttribute("value")) ?? "").length).toBe(100);
    });
}, 60000);
