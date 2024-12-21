import getWord from "./utils/getWord";
import { generateImage } from "./utils/image";
import { getMeaning, hasWikiPage } from "./utils/meaning";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (!BOT_TOKEN) {
    console.error("No BOT_TOKEN enviroment variable found.")
    process.exit(1)
}

if (!CHAT_ID) {
    console.error("No CHAT_ID enviroment variable found.")
    process.exit(1)
}

async function publishWord(word: string) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN!}/sendPhoto`

    const formData = new FormData();

    formData.set("chat_id", CHAT_ID!)
    formData.set(
        "photo",
        new Blob([
            await generateImage(word, await getMeaning(word))
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

let word = ""

console.log("Starting word generation...")
while (true) {
    word = await getWord()

    if (await hasWikiPage(word)) {
        console.log(`${word}: has meaning in wikipedia!`)
        break
    } else {
        console.log(`${word}: doesn't have meaning in wikipedia. regenerating...`)
        await Bun.sleep(100)
    }
}

await publishWord(word);
