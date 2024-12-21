import wiki from "../wiki";

export async function hasWikiPage(word: string) {
    try {
        const page = await wiki.page(word)

        if (page.title.toLowerCase() === word.toLowerCase()) {
            return true
        }

        return false
    } catch (e) {
        return false
    }
}

export async function getMeaning(word: string): Promise<string> {
    try {
        const wordPage = await wiki
            .page(word)

        const content = await wordPage.content()

        const summary = await wordPage.summary()

        console.log(summary)

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
