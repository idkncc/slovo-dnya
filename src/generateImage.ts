import { generateImage } from "./utils/image";

const word = Bun.argv[2]
if (!word) {
    console.error("No word provided!")
    console.error("")
    console.error("Usage:")
    console.error(` bun generate-image <word>   –   generates image <word>.png`)

    process.exit(1)
}

const buffer = await generateImage(word)

await Bun.write(
    Bun.file(`${word}.png`),
    new Blob([buffer])
)
