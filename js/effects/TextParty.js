/**
 * The purpose of this class is to consolidate all of the funky methods I've created for messing with text
 */
import { TextRadar } from './text/TextRadar.js';
import { TextRoll } from './text/TextRoll.js';
import { WanderingGel } from './text/TextWanderingGel.js';
import { OutlineToFill } from './text/TextOutlineToFill.js';
import { SeventiesNewsShow } from './text/TextSeventies.js';
import { TextMorph } from './text/TextMorph.js';
import { TextPartyEvent } from './TextPartyEvent.js';

export function ping() {
  return 'ping!';
}
export function morph(id, fonts) {
  console.log('TextParty.morph() called');
  const tl = TextMorph(id, fonts);
  tl.eventCallback('onStart', onStart, [tl, fonts]);
  tl.eventCallback('onComplete', onComplete, [tl, fonts]);
  return tl;
}

export function radar(elem, settings) {
  return TextRadar(elem, settings);
}

export function roll(container, settings) {
  let tl = TextRoll(container, settings);
  tl.eventCallback('onStart', onStart, [tl, settings]);
  tl.eventCallback('onComplete', onComplete, [tl, settings]);
  return tl;
}

/**
 * Given a container, display multiple instances of its inner text at slight offsets from each other
 * @param {*} container
 * @param {*} params
 * @returns
 */
export function gel(container, params) {
  let tl = WanderingGel(container, params);
  tl.eventCallback('onStart', onStart, [tl, params]);
  tl.eventCallback('onComplete', onComplete, [tl, params]);
  return tl;
}

export function fill(params) {
  return OutlineToFill(params);
}

export function seventies(container, params) {
  return SeventiesNewsShow(container, params);
}

export function lines(id) {
  var pars = document.getElementById(id).querySelectorAll('p');
  var st = new SplitText(pars, { type: 'chars' });
  var tl = gsap.timeline({ id: id });
  tl.from(st.lines, {
    duration: 2,
    opacity: 0,
    y: 25,
    stagger: 0.1,
  });
  return tl;
}

export function fadeInChars(elem) {
  var tl = gsap.timeline({ id: 'fadeInChars' });
  var st = new SplitText(elem, {
    type: 'chars',
  });
  gsap.set(st.chars, { opacity: 0 });
  tl.to(st.chars, {
    duration: 2,
    opacity: 1,
    stagger: 0.1,
    onStart: onStart,
    onStartParams: [tl, st],
    onComplete: onComplete,
    onCompleteParams: [tl, st],
  });
  return tl;
}

function onStart(tl, st) {
  switch (tl.id) {
    case 'fadeInChars':
      gsap.set(st.chars, { opacity: 0 });
      break;
  }
  document.dispatchEvent(TextPartyEvent('onTextPartyStart', tl));
}

function onComplete(tl, params) {
  switch (tl.id) {
    case 'fadeInChars':
      tl.revert();
      break;
  }
  document.dispatchEvent(TextPartyEvent('onTextPartyComplete', tl));
}

export function fadeOutChars(id) {
  var elem = document.getElementById(id);
  var tl = gsap.timeline({});
  tl.id = 'fadeOutChars';
  // LETTERS
  var st = new SplitText(elem, { type: 'chars' });
  tl.to(st.chars, {
    duration: 2,
    opacity: 0,
    stagger: 0.1,
  });
  return tl;
}
