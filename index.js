require("dotenv/config")

const fs = require("fs");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const FILENAME = process.env.FILENAME ?? "words.txt";

function publishWord(word) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

    axios(url, {
        method: "POST",
        data: {
            chat_id: Number.isNaN(parseInt(CHAT_ID)) ? CHAT_ID : parseInt(CHAT_ID),
            text: [
                "*Слово дня 😋🤔🫡* ||\\#словодня||",
                "",
                word
            ].join("\n"),
            parse_mode: "MarkdownV2",

            link_preview_options: {
                is_disabled: true
            },
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Викисловарь",
                            url: `https://ru.wiktionary.org/wiki/${encodeURIComponent(word)}`
                        }
                    ]
                ]
            }
        },
    })
        .then(() => {
            console.info("Published word of a day!")
            console.info(` ${word}`)
        })
        .catch((err) => {
            console.error("Couldn't publish word of a day...")
            console.error(err.response.data)
            process.exit(1)
        })
}

function main() {
    let output = "";

    const readStream = fs.createReadStream(FILENAME);

    readStream.on('data', (chunk) => {
        output += chunk.toString('utf8');
    });

    readStream.on('end', () => {
        const lines = output.split("\n");
        const index = Math.floor(Math.random() * lines.length);

        publishWord(lines[index]);
    });
}

main();
