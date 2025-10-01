import { Halftone } from '/assets/js/effects/image-halftone.js';
const TL = gsap.timeline();

export function init() {
    // registerTimeline(headerAnimation(gsap.utils.toArray("#resume header")[0]));
    // registerTimeline(statementAnimation(gsap.utils.toArray("#statement")[0]));
    // registerTimeline(practicesAnimation(gsap.utils.toArray("#practices")[0]));
    // registerTimeline(philosophyAnimation(gsap.utils.toArray("#philosophy")[0]));
    // registerTimeline(avatarAnimation(gsap.utils.toArray("#resume .avatar")[0]));
    // registerTimeline(awardsAnimation(gsap.utils.toArray("#awards")[0]));
    return TL;
};

function headerAnimation(elem) {
    const tl = gsap.timeline();
    tl.id = "header";
    return tl;
};

function statementAnimation(elem) {
    const tl = gsap.timeline();
    tl.id = "statement";
    tl.set(elem, { opacity: 0 })
    return tl;
};

function practicesAnimation(elem) {
    const tl = gsap.timeline();
    tl.id = "practices";
    tl.set(elem, {opacity: 0});
    return tl;
};

function philosophyAnimation(elem) {
    const tl = gsap.timeline();
    tl.id = "philosophy";
    tl.set(elem, {opacity: 0})
    return tl;
};

export function avatarAnimation(elem) {
    const tl = Halftone({
        container: elem,
        dotSize: 12,
        gridSize: 6,
        color: true
    });
    tl.id = "avatar";
    return tl;
};

function awardsAnimation(elem) {
    const tl = gsap.timeline();
    tl.id = "awards";
    tl.set(elem, {opacity: 0})
    return tl;
};

function registerTimeline(tl) {
    tl.eventCallback("onStart", onStart, [tl.id]);
    tl.eventCallback("onComplete", onComplete, [tl.id]);
    // TL.addLabel(tl.id);
    TL.add(tl, tl.id);
    return tl;
};

function onStart(id) {
    console.log(id + ".onStart");
};
function onUpdate(obj) {
    console.log(obj + ".onUpdate");
};
function onComplete(id) {
    console.log(id + ".onComplete");
};