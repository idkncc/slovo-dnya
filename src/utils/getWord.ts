const FILENAME = process.env.FILENAME ?? "words.txt";

export default async function getWord() {
    const output = await Bun.file(FILENAME).text();

    const lines = output.split("\n");
    const index = Math.floor(Math.random() * lines.length);

    return lines[index]
}
