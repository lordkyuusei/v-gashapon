import puppeteer from "puppeteer"

const screenshot = async (browser, url) => {
    const page = await browser.newPage();

    await page.goto(url);

    const image = await page.screenshot();

    return image;
}

export const generateImage = async (card, variant) => {
    const browser = await puppeteer.launch({
        headless: true, defaultViewport: {
            height: 775,
            width: 460
        }
    });

    return await screenshot(browser, `http://localhost:3001/generate/${card.id}/${variant.id}`);
}
