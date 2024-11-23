import nodeHtmlToImage from "node-html-to-image";
import { hexBrightness } from "./utils";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const FILENAME = process.env.FILENAME ?? "words.txt";

if (!BOT_TOKEN) {
    console.error("No BOT_TOKEN enviroment variable found.")
    process.exit(1)
}

if (!CHAT_ID) {
    console.error("No CHAT_ID enviroment variable found.")
    process.exit(1)
}

async function generateImage(word: string): Promise<Buffer> {
    const generateColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

    const gradient1 = generateColor()
    const gradient2 = generateColor()

    return nodeHtmlToImage({
        html: await Bun.file("template.html").text(),
        content: {
            gradient1,
            gradient2,
            textColor: hexBrightness(gradient1) > 200 ? "#000" : "#FFF",
            slovoDnya: word,
            slovoDnyaLength: word.length,
        }
    }) as Promise<Buffer>
}

async function publishWord(word: string) {


    const url = `https://api.telegram.org/bot${BOT_TOKEN!}/sendPhoto`

    const formData = new FormData();

    formData.set("chat_id", CHAT_ID!)
    formData.set(
        "photo",
        new Blob([
            await generateImage(word)
        ]),
        `${word}.png`)
    formData.set("caption", `#словодня – ${word}`)
    formData.set("reply_markup", JSON.stringify(
        {
            inline_keyboard: [
                [
                    {
                        text: "Викисловарь",
                        url: `https://ru.wiktionary.org/wiki/${encodeURIComponent(word)}`
                    }
                ]
            ]
        }
    ))

    const resp = await fetch(url, {
        method: "POST",
        body: formData,
    })

    if (resp.ok) {
        console.info("Published word of a day!")
        console.info(` ${word}`)
    } else {
        const response = await resp.json()
        console.error("Couldn't publish word of a day...")
        console.error(response)
        process.exit(1)
    }
}

const output = await Bun.file(FILENAME).text();

const lines = output.split("\n");
const index = Math.floor(Math.random() * lines.length);

publishWord(lines[index]);
