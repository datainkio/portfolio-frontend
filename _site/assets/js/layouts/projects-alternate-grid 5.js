const DUR = .25; // base value for animation duration (in seconds)
const Y_DELTA = 0; // vertical origin of elements
const POS = "-=50%"; // offset (in seconds) of animation relative to the previous

/** INITIALIZE VIEW */
export function init(trace) {
    const PROJECTS = gsap.utils.toArray(".project.card");
    const CATEGORIES = gsap.utils.toArray("a.category");
    const FEATURED = gsap.utils.toArray(".project.card.featured");
    const CONTROLS = gsap.timeline();

    // SET UP PROJECT VIEWS AND CONTROLS
    PROJECTS.forEach(project => {
        // Set the default state for the project view
        project.style.opacity = 0;
        project.classList.add("hidden");
        // Respond to mouse events
        project.addEventListener("mouseover", onMouseOver);
        project.addEventListener("mouseout", onMouseOut);
        // Let the user navigate forward and backward through a given set of projects while in modal view
        var prev = gsap.utils.toArray("#modal_" + project.id + " button.prev")[0];
        var next = gsap.utils.toArray("#modal_" + project.id + " button.next")[0];
        prev.addEventListener("click", navigate_projects);
        next.addEventListener("click", navigate_projects);
    });

    // SHOW FEATURED PROJECTS
    FEATURED.forEach((project, index) => {
        project.classList.remove("hidden");
        project.classList.add("current");
        controls.add(gsap.to(project, { opacity: 1, y: y_delta, duration: dur * .76, ease: "sine.inOut" }), pos);
    });
    updateNav();
    try {
        applyAlternatingStyles();
    } catch(e) {
        trace(e);
    }



    // Handle resize events by updating layout
    window.addEventListener('resize', applyAlternatingStyles);
    let portrait = window.matchMedia("(orientation: portrait)");
    portrait.addEventListener("change", function (e) {
        applyAlternatingStyles();
    })

    // ASSIGN CLICK HANDLERS FOR CATEGORY NAV CONTROLS
    CATEGORIES.forEach(cat => {
        var label = document.getElementById("category_current");
        // When the user selects a category...
        cat.addEventListener("click", () => {

            // Update button states to highlight the selected category
            categories.forEach(item => {
                item.classList.remove("active");
                item.classList.remove("btn-active");
                if (item.innerHTML == cat.innerHTML) {
                    if (item.classList.contains("btn")) {
                        item.classList.add("btn-active");
                    } else {
                        item.classList.add("active");
                    }
                }
            })

            // Update the project previews to reflect the selected category
            const outro = gsap.timeline({ onComplete: clearCards });
            const intro = gsap.timeline({ onStart: showSelected, onStartParams: [cat] });
            projects.forEach(project => {
                // clear all visible projects
                if (!project.classList.contains("hidden")) {
                    outro.add(gsap.to(project, { opacity: 0, y: y_delta, duration: dur * .75, ease: "sine.inOut" }), pos);
                }
                // display projects belonging to the selected category
                if (project.classList.contains(cat.id)) {
                    intro.add(gsap.to(project, { opacity: 1, y: y_delta, duration: dur * .75, ease: "sine.inOut" }), pos);
                }
            });

            // updateNav();

            const transition = gsap.timeline({});
            // intro.pause();
            transition.add(outro);
            transition.add(intro);
            transition.play();
        });
    });
};

/**
 * Respond to mouseover events for project cards
 **/
function onMouseOver(e) {
    console.log(e.currentTarget);
    // Dim all the other projects
    PROJECTS.forEach(project => {
        var opacity = project != e.currentTarget ? .5 : 1;
        gsap.to(project, {duration: .5, opacity: opacity});
    })
};

/**
 * Respond to mouseout events for project  cards
 */
function onMouseOut(e) {
    // Return to their original state
    PROJECTS.forEach(project => {
        gsap.to(project, { duration: .5, opacity: 1 });
    })
}

/**
 * Keep the prev/next buttons for each project updated according to their
 * position in the set of projects currently in view.
 **/
function updateNav() {
    console.log("updateNav");
    var siblings = gsap.utils.toArray(".project.link.current");
    // trace(siblings.length + " items in the new set");
    siblings.forEach((item, index) => {
        // trace(index + " of " + siblings.length);
        var prev = gsap.utils.toArray("#modal_" + item.id + " button.prev")[0];
        var next = gsap.utils.toArray("#modal_" + item.id + " button.next")[0];
        // Hide by default
        prev.classList.add("hidden");
        next.classList.add("hidden");
        if (index > 0) {
            var younger = siblings[index - 1];
            prev.classList.remove("hidden");
        }
        if (index < siblings.length - 1) {
            var older = siblings[index + 1];
            next.classList.remove("hidden");
        }
    })
}

/**
 * Respond to user input for navigating forward and backward through the set
 * of projects currently in view.
 **/
function navigate_projects(e) {
    var distance = e.target.id.split("_")[0] === "next" ? 1 : -1;
    var id = e.target.id.split("_")[1];
    var siblings = gsap.utils.toArray(".project.link.current");
    // trace("navigate_projects: " + siblings.length + " items in the current set");
    var index = siblings.indexOf(gsap.utils.toArray("#" + id)[0]);
    var outgoing = gsap.utils.toArray("#modal_" + id)[0];
    var incoming = gsap.utils.toArray("#modal_" + siblings[index + distance]["id"])[0];
    outgoing.close();
    incoming.showModal();
}

function clearCards() {
    // trace("clearCards");
    PROJECTS.forEach(project => {
        project.classList.add("hidden");
        project.classList.remove("current");
        project.classList.remove("even-column");
    })
}

function showSelected(cat) {
    var set = gsap.utils.toArray("." + cat.id);
    // trace("showSelected");
    set.forEach(project => {
        project.classList.remove("hidden");
        project.classList.add("current");
    });
    updateNav();
    applyAlternatingStyles();
};

function applyAlternatingStyles() {
    const grid = document.getElementById('projects');
    const cols = window.getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').length;
    const current = gsap.utils.toArray(".project.current");
    // console.log(current.length + " cards in " + cols + " columns");
    current.forEach((card, index) => {
        const colIndex = (index % cols) + 1; // Get the 1-based column index
        if ((cols > 1) && (colIndex % 2 !== 0)) {
            card.classList.remove('even-column');
        } else {
            card.classList.add('even-column');
        }
    });

};