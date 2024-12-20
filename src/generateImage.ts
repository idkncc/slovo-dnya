import { generateImage } from "./utils/image";
import getMeaning from "./utils/meaning";

const word = Bun.argv[2]
if (!word) {
    console.error("No word provided!")
    console.error("")
    console.error("Usage:")
    console.error(` bun generate-image <word>   –   generates image <word>.png`)

    process.exit(1)
}

const meaning = await getMeaning(word)

const buffer = await generateImage(word, meaning)

await Bun.write(
    Bun.file(`${word}.png`),
    new Blob([buffer])
)
