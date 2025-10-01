import CanvasManager from "./CanvasManager.js";
import HalftoneEffect from "./HalftoneEffect.js";
import AnimationManager from "./AnimationManager.js";

/**
 * Example implementation:
 *  <picture id="testy" class="w-72 mx-auto">
        <img src="/assets/images/halftone.png" alt="A description of the image">
    </picture>
    <aside id="controls" class="w-144 mx-auto"></aside>

    <script type="module">
        // Import the Halftone class from your JavaScript modules
        import Halftone from '/assets/js/effects/image/halftone/Halftone.js';

        // Initialize the Halftone effect
        document.addEventListener('DOMContentLoaded', () => {
            const container = document.querySelector('#testy');
            new Halftone(container, {
                dotSize: 24,
                gridSize: 26,
                color: true,
            });
        });
    </script>
 */
export default class Halftone {
    constructor(container, settings) {
        const image = container.querySelector("img");
        this._canvasManager = new CanvasManager(image, container);
        this._halftoneEffect = null;
        this._animationManager = null;
        this._settings = settings;

        image.onload = () => {
            const canvas = this._canvasManager.initCanvas();
            this._canvasManager.captureOriginalImageData(); // Store original image data

            this.refreshHalftone();

            // Add controls for user interaction
            // this.addControls(document.getElementById("controls"));
        };

        if (image.complete) {
            image.onload();
        }
    }

    refreshHalftone() {
        console.log("Halftone.refresh");
        const originalImageData = this._canvasManager.getOriginalImageData();
        this._halftoneEffect = new HalftoneEffect(originalImageData, this._settings.dotSize, this._settings.gridSize);
        this._halftoneEffect.applyEffect();

        if (this._animationManager) {
            this._animationManager._dots = this._halftoneEffect.dots;
        } else {
            this._animationManager = new AnimationManager(this._halftoneEffect.dots, this._canvasManager);
        }

        this._animationManager.initAnimation();
        this._animationManager.play();
    }

    addControls(elem) {
        const controls = elem;
        controls.style.marginTop = "20px";

        // Helper function to create sliders
        const createSlider = (labelText, min, max, step, defaultValue, onChange) => {
            const wrapper = document.createElement("div");
            wrapper.style.marginBottom = "10px";

            const label = document.createElement("label");
            label.textContent = `${labelText}: `;

            const valueDisplay = document.createElement("span");
            valueDisplay.textContent = defaultValue;

            const input = document.createElement("input");
            input.type = "range";
            input.min = min;
            input.max = max;
            input.step = step;
            input.value = defaultValue;

            input.addEventListener("input", (event) => {
                const value = parseFloat(event.target.value);
                valueDisplay.textContent = value;
                onChange(value);
            });

            label.appendChild(valueDisplay);
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            controls.appendChild(wrapper);
        };

        // Dot Size Slider
        createSlider("Dot Size", 1, 100, 1, this._settings.dotSize, (value) => {
            this._settings.dotSize = value;
            this.refreshHalftone();
        });

        // Grid Size Slider
        createSlider("Grid Size", 1, 100, 1, this._settings.gridSize, (value) => {
            this._settings.gridSize = value;
            this.refreshHalftone();
        });

        // Ease Type Dropdown
        const easeLabel = document.createElement("label");
        easeLabel.textContent = "Ease Type: ";

        const easeSelect = document.createElement("select");
        ["linear", "power1.inOut", "power2.inOut", "elastic.out", "bounce.out"].forEach((easeType) => {
            const option = document.createElement("option");
            option.value = easeType;
            option.textContent = easeType;
            easeSelect.appendChild(option);
        });

        easeSelect.value = "power1.inOut"; // Default ease type
        easeSelect.addEventListener("change", (event) => {
            const easeType = event.target.value;
            this._settings.ease = easeType;
            this.refreshHalftone();
        });

        easeLabel.appendChild(easeSelect);
        controls.appendChild(easeLabel);

        // parentElement.appendChild(controls);
    }
}
