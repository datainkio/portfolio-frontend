const { gasp } = window;
gsap.registerPlugin(Physics2DPlugin) 
export default class AnimationManager {
    constructor(dots, canvasManager) {
        this._dots = dots;
        this._canvasManager = canvasManager;
        this._timeline = gsap.timeline({
            timeScale: .1,
            onUpdate: () => this.updateCanvas(), // Redraw the canvas every frame
            yoyo: true,
            repeat: -1
        });
        this._duration = 0.05; // Default duration
        this._stagger = "<25%"; // Default stagger
        this._ease = "power1.inOut"; // Default ease
    }

    initAnimation() {
        this._timeline.clear();
        console.log("AnimationManager.initAnimation");

        // this._dots.forEach((dot, index) => {
        //      this._timeline.add(this.animateScan(dot), this._stagger);
        //  });
        this._timeline.add(this.animateScan(this._dots));
        this._timeline.add(this.animateScatter(this._dots));
    };

    animateScan(dots) {
        return gsap.fromTo(
                dots,
                {radius: 0},
                {
                    radius: function(index, target, targets) { //function-based value
                        return target.targetRadius;
                    },
                    duration: .1,
                    ease: this._ease,
                    stagger: .01
                }
            )
    }

    animateScatter(dots) {
        return gsap.to(dots, {
            radius: 0,
            duration: 5,
            physics2D: {
            velocity: "random(200, 650)",
            angle: "random(250, 290)",
            gravity: 500,
            }
        });
    }

    updateCanvas() {
        // console.log(dot);
        const ctx = this._canvasManager.ctx;
        const canvas = this._canvasManager.canvas;

        // Clear the canvas
        this._canvasManager.clearCanvas();

        // Draw each dot based on its current state
        // console.log(this._dots[720])
        this._dots.forEach((dot) => {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
            ctx.fillStyle = dot.color;
            ctx.fill();
        });
    }

    updateEase(ease) {
        this._ease = ease;
        this.initAnimation();
        this.play();
    }

    play() {
        this._timeline.play();
    }
}
