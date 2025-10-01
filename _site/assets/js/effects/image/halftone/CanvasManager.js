export default class CanvasManager {
    constructor(image, container) {
        this._canvas = document.createElement("canvas");
        this._ctx = this._canvas.getContext("2d", { willReadFrequently: true });
        this._image = image;
        this._container = container;

        // Compute scaled dimensions
        const scale = Math.min(
            container.offsetWidth / image.naturalWidth,
            container.offsetHeight / image.naturalHeight
        );
        this._scaledWidth = Math.round(image.naturalWidth * scale);
        this._scaledHeight = Math.round(image.naturalHeight * scale);

        this._originalImageData = null; // Store original image data
    }

    initCanvas() {
        this._canvas.width = this._scaledWidth;
        this._canvas.height = this._scaledHeight;
        // Copy classList from the container to the canvas
        this._container.classList.forEach((className) => {
            this._canvas.classList.add(className);
        });
        this._container.replaceWith(this._canvas);
        return this._canvas;
    }

    captureOriginalImageData() {
        // Draw the image off-screen and capture its data
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = this._scaledWidth;
        offscreenCanvas.height = this._scaledHeight;

        const offscreenCtx = offscreenCanvas.getContext("2d");
        offscreenCtx.drawImage(
            this._image,
            0, 0, this._image.naturalWidth, this._image.naturalHeight, // Source dimensions
            0, 0, this._scaledWidth, this._scaledHeight // Destination dimensions
        );

        this._originalImageData = offscreenCtx.getImageData(0, 0, this._scaledWidth, this._scaledHeight);
    }

    getOriginalImageData() {
        if (!this._originalImageData) {
            throw new Error("Original image data is not initialized. Call captureOriginalImageData first.");
        }
        return this._originalImageData;
    }

    clearCanvas() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    get canvas() {
        return this._canvas;
    }

    get ctx() {
        return this._ctx;
    }
}