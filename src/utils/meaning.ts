import wiki from "../wiki";

export default async function getMeaning(word: string): Promise<string> {
    try {
        const wordPage = await wiki
            .page(word)

        const content = await wordPage.content()

        const summary = await wordPage.summary()

        if (summary.type === "disambiguation") {
            const regex = content.match(/(.*) — (.*)\n/)

            return regex?.[0] ?? ""
        } else {
            return summary.extract
        }

    } catch (e) {
        console.error("Failed to get meanin' of the word!!1!")
        console.error(" ")
        console.error("Sad. But still sending fallback")

        return ""
    }
}
