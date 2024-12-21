import font2base64 from "node-font2base64";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import { encodeFont, encodeImage } from "./base64encoder";

export async function generateImage(word: string, meaning: string): Promise<Buffer> {
    const targetSize = 2048

    const template = handlebars.compile(await Bun.file("template.html").text())
    const content = template({
        garamondFont: await encodeFont('./assets/Garamond.woff2'),
        notoSansFont: await encodeFont('./assets/NotoSans-Regular.woff2'),

        xmasVibesImage: await encodeImage("./assets/lights.png"),
        targetSize,

        slovoDnya: word,
        slovoDnyaLength: word.length,
        meaning,
    })
    Bun.write("template.generated.html", content)

    const browser = await puppeteer.launch({
        headless: true,
    })
    const page = await browser.newPage()

    await page.setViewport({ width: targetSize, height: targetSize })
    await page.setContent(content)

    const image = Buffer.from(await page.screenshot())

    await browser.close()

    return image
}
