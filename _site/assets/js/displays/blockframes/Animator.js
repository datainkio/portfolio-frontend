export function wipe(block) {
    const parent = block.ownerSVGElement;
    const pw = parent.getBoundingClientRect().width;
    const ph = parent.getBoundingClientRect().width;
    const w = block.getBoundingClientRect().width;
    const tl = gsap.timeline({});
    tl.fromTo(block, {opacity: 0, x: pw}, {opacity: 1, x: 0 - w, duration: 2, repeat: -1});
    // tl.to(block, { duration: 2, opacity: 0, yoyo: true, repeat: -1 });
    // return tl;
}