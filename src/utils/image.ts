import nodeHtmlToImage from "node-html-to-image";
import font2base64 from "node-font2base64";

export async function generateImage(word: string, meaning: string): Promise<Buffer> {
    const _fontData = font2base64.encodeToDataUrlSync('./assets/Garamond.woff2')

    return nodeHtmlToImage({
        html: await Bun.file("template.html").text(),
        content: {
            _fontData,
            slovoDnya: word,
            slovoDnyaLength: word.length,
            meaning,
        }
    }) as Promise<Buffer>
}
