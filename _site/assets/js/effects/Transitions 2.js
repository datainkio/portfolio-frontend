export function reveal(params) {
    // var elem = document.getElementById(id);
    var tl = gsap.timeline();
    tl.fromTo(params.elem, {y: params.origin.y, opacity: params.origin.opacity}, {duration: params.duration, y:params.destination.y, opacity: params.destination.opacity, ease: params.ease});
    return tl;
};