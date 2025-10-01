// Calculate the Euclidean distance between two colors
export function colorDistance(color1, color2) {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    return Math.sqrt(
        Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
    );
}

// Find the color with the greatest distance
export function findFarthestColor(source, palette) {
    let maxDistance = 0;
    let result = 0;

    for (let i = 0; i < palette.length; i++) {
        const distance = colorDistance(source, palette[i]);
        if (distance > maxDistance) {
        maxDistance = distance;
        result = palette[i];
        }
    }
    return result;
}