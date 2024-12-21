import font2base64 from "node-font2base64";

export const encodeFont = (path: string) => font2base64.encodeToDataUrl(path) as Promise<string>

export const encodeImage = async (path: string) => {
    const file = Bun.file(path)
    const buffer = Buffer.from(
        await file.arrayBuffer()
    )
    const data = buffer.toString("base64")

    return `data:${file.type};base64,${data}`
}
