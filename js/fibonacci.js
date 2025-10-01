export function fibonacci(id) {
    try {
        var graph = gsap.utils.toArray(id)[0];
        var sides = gsap.utils.toArray(id + " path.side");
        var arcs = gsap.utils.toArray(id + " path.arc");
        var masked = gsap.utils.toArray(id + " #mask")[0];

        // Style all the things
        graph.classList.add("stroke-accent-400"); // Stroke all the things
        graph.classList.add("stroke-2");
        gsap.set(sides, { opacity: 0 }); // Hide the squares

        // Since we're using GSAP and GSAP relies on dash values to handle
        // animation, we have to get tricky and use masks if we want dashed
        // strokes
        // See https://www.motiontricks.com/svg-dashed-line-animation/)

        // Animate all the things
        var tl = gsap.timeline({
            onStart: onStart,
            onComplete: onComplete,
        });
        var dir = 1;
        var dur = .5;

        arcs.forEach((arc, index) => {
            var drawme = arc.cloneNode("true");
            masked.appendChild(drawme);
            arc.classList.add("stroke-dashed");
            switch (gsap.getProperty(drawme, "id")) {
                case "arc_01":
                case "arc_05":
                case "arc_07":
                case "arc_09":
                case "arc_11":
                    tl.add(gsap.fromTo(drawme, { drawSVG: "0%" }, { drawSVG: "100%", duration: dur, ease: "none" }));
                    break;
                case "arc_02":
                case "arc_03":
                case "arc_04":
                case "arc_06":
                case "arc_08":
                case "arc_10":
                    tl.add(gsap.fromTo(drawme, { drawSVG: "100% 100%" }, { drawSVG: "0% 100%", duration: dur, ease: "none" }));
            }
            dur *= .65; // Increase the speed of the animation to account for the increasingly shorter path lengths
        })
        return graph;
    } catch (e) {
        // trace(e);
        console.log(e);
        return e;
    }
}

function onStart() {
    // trace("fibonacci start...");
}

function onComplete() {
    // trace("fibonacci complete");
}
