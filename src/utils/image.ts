import font2base64 from "node-font2base64";
import puppeteer from "puppeteer";
import handlebars from "handlebars";

export async function generateImage(word: string, meaning: string): Promise<Buffer> {
    const _fontData = font2base64.encodeToDataUrlSync('./assets/Garamond.woff2')

    const template = handlebars.compile(await Bun.file("template.html").text())
    const content = template({
        _fontData,
        slovoDnya: word,
        slovoDnyaLength: word.length,
        meaning,
    })

    const browser = await puppeteer.launch({
        headless: true,
    })
    const page = await browser.newPage()

    await page.setViewport({ width: 1024, height: 1024 })
    await page.setContent(content)

    const image = Buffer.from(await page.screenshot())

    await browser.close()

    return image
}
