import { TextPartyEvent } from "../TextPartyEvent.js";

var CONTAINER, SETTINGS, SRC;
export function TextRoll(elem, params) {
    
    CONTAINER = elem;
    SETTINGS = params;
    SRC = CONTAINER.innerText;

    let tl = gsap.timeline({
        id: params.id,
    });
    tl.add(moveRoll());
    return tl;
}

function moveRoll() {
    let st = new SplitText(CONTAINER, {
        type: "chars, lines",
        charsClass: "text-roll-char",
        linesClass: "text-roll-line"
    });
    gsap.set(st.chars, {rotation: 0 - SETTINGS.rotation, skewY: "1.2rad", y: SETTINGS.y_delta})
    return gsap.to(st.chars, {
        duration: SETTINGS.duration,
        rotation: 0,
        // scaleY: .5,
        // scaleX: 1.2,
        skewY: 0,
        y: 0,
        stagger: {
            // wrap advanced options in an object
            each: .1,
            ease: 'power1.inOut',
        },
        ease: SETTINGS.ease,
        onStart: onStart,
        onStartParams: [st],
        onComplete: onComplete,
        onCompleteParams: [st],
    });
}

function onStart(st) {
    document.dispatchEvent(TextPartyEvent("onTextPartyStart", gsap.getById(SETTINGS.id)));
}

function onComplete(st) {
    st.revert();
    document.dispatchEvent(TextPartyEvent("onTextPartyComplete", gsap.getById(SETTINGS.id)));
};

function startY() {
    return SETTINGS.y_delta;
}

function finishY() {
    return 0 - SETTINGS.y_delta;
}

function settings() {
    
    // Create the container
    const container = document.createElement("div");
    container.classList.add("absolute", "top-0", "right-0", "w-80", "z-50", "flex", "p-4");
    
    // Create the range slider
    
    CONTROL.type = "range";
    CONTROL.min = 0;
    CONTROL.max = 1000;
    CONTROL.value = Y_DELTA;
    CONTROL.classList.add("range", "range-primary");

    // Create the value display
    const display = document.createElement("span");
    display.classList.add("basis-1/6");
    display.textContent = CONTROL.value;

    container.appendChild(display);
    container.appendChild(CONTROL);
    document.body.appendChild(container);

    // Update the view when the range changes
    CONTROL.addEventListener('input', (event) => {
      display.textContent = event.target.value;
      Y_DELTA = event.target.value;
      // base = 0 - amount - 1;
      // updateView();
    });
};