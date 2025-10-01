export const BlockLineParams = {
    type: "background", // "element" or "background" depending on purpose
    id: "BlockframeLibrary",
    colCount: 24,  // Number of buildings * 2
    rowCount: 8,
    size: 100, // WTF is this for now other than not being 0?
    angle: 12,
    brightness: 0.25,
    opacity: 1,
    types: ["Article","Calendar","Cart","Contact","Landing","Map","Timeline"]
}

export const RevealParams = {
    origin: {
        y: 25,
        opacity: 0
    },
    destination: {
        y: 0,
        opacity: 1
    },
    ease: "none",
    duration: .75 
}

export const WGParams = {
    id: "wg",
    paused: true,
    w: -6,
    h: -6,
    range: 1,
    envelope: 0,
    duration: 2, 
    colors: ["bravo", "alpha"], 
    wiggles: 50,
};

export const RadarParams = {
    id: "main-title",
    duration: .15,
    steps: 10,
    alpha_start: .85,
    alpha_end: .25,
    amount: 60,
    base: -61,
    settings: true
}

export const OFParams = {
    id: "fill",
    container: "main-title",
    duration: 1,
    stagger: 0.1,
    overlap: "<15%",
    color: "#1A171C00",
};

export const TRollParams = {
    id: "troll",
    paused: true,
    container: "#main-header",
    duration: .25,
    stagger: .5,
    overlap: "<25%",
    ease: "power1.inOut",
    rotation: -90,
};

export const HalftoneParams = {
    container: "avatar",
    dotSize: 10,
    gridSize: 8,
    color: true,
};

export const ARCParams = {
    scrollTrigger: {
        trigger: '#arc-animation',
        // pin: true, // pin the trigger element while active
        start: 'center center', // when the top of the trigger hits the top of the viewport
        // end: '+=500', // end after scrolling 500px beyond the start
        //. scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
    },
    duration: .75,
    overlap: "<10%"
}