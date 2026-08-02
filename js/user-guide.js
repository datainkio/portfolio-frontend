/**
 * ---
 * aix:
 *   id: frontend.js.user-guide
 *   role: Frontend runtime module: js/user-guide.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - user-guide.js
 * ---
 */
/** @format */

document.addEventListener("DOMContentLoaded", (event) => {
	gsap.registerPlugin(ScrollTrigger);

	const title = gsap.timeline({
		scrollTrigger: {
			trigger: "#title",
			start: "top top",
			scrub: 1
		},
	});
	title.add(gsap.to("#title", { height: "auto" }));
	title.add(gsap.to("#title p", { autoAlpha: 0 }));
	title.add(gsap.to("#title h1", { fontSize: "4rem" }), "<");

	const steps = gsap.utils.toArray("#progress .step");
	function updateSteps(n) {
		// console.log("update: " + n);
		steps.forEach((step, index) => {
			// console.log("step!");
			if (index < n) {
				step.classList.add("step-primary");
			} else {
				step.classList.remove("step-primary");
			}
		});
	}

	/** INTRODUCTION */
	/**
	const intro = gsap.timeline({
		scrollTrigger: {
			trigger: "#intro",
			start: "top top",
			pin: true,
			onEnter: () => updateSteps(1),
		},
	});

	var pars = gsap.utils.toArray("#intro p");
	pars.forEach((p) => {
		gsap.set(p, { opacity: 0, y: 50 });
		intro.to(p, { opacity: 1, y: 0 });
	});
	*/
});
