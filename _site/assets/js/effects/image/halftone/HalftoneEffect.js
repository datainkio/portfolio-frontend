/**
 * Receives an image and renders it as a matrix of dots. The resolution is a combination of two values. dotSize sets
 * the max size (in pixels) of the dots. gridSize sets the space between the centers of the dots.
 * 
 * The size of the dot reflects the average brightness of pixels within dotSize of a given interval determined by 
 * gridSize. 
 */

export default class HalftoneEffect {
    constructor(imageData, dotSize, gridSize) {
        this._imageData = imageData;
        this._dotSize = dotSize;
        this._gridSize = gridSize;
        this._dots = [];
    }

    applyEffect() {
        const { data, width, height } = this._imageData;
        for (let y = 0; y < height; y += this._gridSize) {
            for (let x = 0; x < width; x += this._gridSize) {
                const { avgR, avgG, avgB, avgBrightness } = this._calculateBlockAverage(data, x, y, width, height);

                const radius = ((255 - avgBrightness) / 255) * (this._dotSize * 0.75);
                const targetRadius = radius;

                this._dots.push({
                    x: x + this._gridSize / 2,
                    y: y + this._gridSize / 2,
                    radius,
                    targetRadius,
                    color: `rgb(${avgR}, ${avgG}, ${avgB})`,
                });
            }
        }
    }

    _calculateBlockAverage(data, x, y, imageWidth, imageHeight) {
        let totalR = 0, totalG = 0, totalB = 0, totalBrightness = 0, count = 0;

        for (let dy = 0; dy < this._gridSize; dy++) {
            for (let dx = 0; dx < this._gridSize; dx++) {
                const pixelX = x + dx;
                const pixelY = y + dy;

                if (pixelX < imageWidth && pixelY < imageHeight) {
                    const index = (pixelY * imageWidth + pixelX) * 4;
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    totalR += r;
                    totalG += g;
                    totalB += b;

                    totalBrightness += (r + g + b) / 3;
                    count++;
                }
            }
        }

        return {
            avgR: totalR / count,
            avgG: totalG / count,
            avgB: totalB / count,
            avgBrightness: totalBrightness / count,
        };
    }

    get dots() {
        return this._dots;
    }
}
