export function hexBrightness(color: string): number {
    const m = color
        .slice(1)
        .match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g) ?? ["0", "0", "0"];

    return (
        (parseInt(m[0], 16) * 299)
        + (parseInt(m[1], 16) * 587)
        + (parseInt(m[2], 16) * 114)
    ) / 1000;
}
