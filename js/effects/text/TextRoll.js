import { TextPartyEvent } from '../TextPartyEvent.js';
import { gsap } from '/assets/js/gsap/gsap-core.js';
import { SplitText } from '/assets/js/gsap/SplitText.js';

// Register SplitText plugin with GSAP
gsap.registerPlugin(SplitText);

var CONTAINER, SETTINGS, SRC, SPLIT, SVG;

/**
 *
 * @param {*} elem The element containing the text we will manipulate.
 * @param {*} params Values for optional settings
 * @returns
 */
export function TextRoll(elem, params) {
  CONTAINER = elem;
  SETTINGS = params;
  SRC = CONTAINER.innerText;
  SPLIT = _split();
  _applyMask();
  return _assembleTimeline();
}
/**
 * _applyMask creates a knockout mask for the text roll effect
 * */
function _applyMask() {
  // Create the SVG element that will hold the mask
  SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  SVG.setAttribute('width', '0');
  SVG.setAttribute('height', '0');
  SVG.style.position = 'absolute';

  // Create the mask element
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
  const maskId = `text-roll-mask-${Math.floor(Math.random() * 1000000)}`;
  mask.setAttribute('id', maskId);

  // Create a rectangle that covers the entire area
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', '100%');
  rect.setAttribute('height', '100%');
  rect.setAttribute('fill', 'black');

  // Create text elements for each character
  SPLIT.chars.forEach((char, index) => {
    const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElem.setAttribute('x', char.offsetLeft + char.offsetWidth / 2);
    textElem.setAttribute('y', char.offsetHeight + char.offsetTop);
    textElem.setAttribute('text-anchor', 'middle');
    textElem.setAttribute('font-size', window.getComputedStyle(char).fontSize);
    textElem.setAttribute('font-family', window.getComputedStyle(char).fontFamily);
    textElem.setAttribute('font-weight', window.getComputedStyle(char).fontWeight);
    textElem.setAttribute('fill', 'white');
    textElem.setAttribute('stroke', 'black');
    textElem.setAttribute('stroke-width', '1');
    textElem.textContent = char.innerText;
    mask.appendChild(textElem);
  });

  // Append the rectangle to the mask
  mask.appendChild(rect);

  // Append the mask to the SVG
  SVG.appendChild(mask);

  // Append the SVG to the document body
  document.body.appendChild(SVG);

  // Apply the mask to the container
  CONTAINER.style.maskImage = `url(#${maskId})`;
  CONTAINER.style.webkitMaskImage = `url(#${maskId})`;
}

function _split() {
  return new SplitText(CONTAINER, {
    type: 'chars, lines',
    charsClass: 'text-roll-char',
    linesClass: 'text-roll-line',
  });
}

function _assembleTimeline() {
  gsap.set(SPLIT.chars, {
    rotation: 0 - SETTINGS.rotation || 20,
    skewY: '.8rad',
    y: SETTINGS.y_delta || 200,
  });

  return gsap.to(SPLIT.chars, {
    duration: SETTINGS.duration || 0.1,
    rotation: 0,
    skewY: 0,
    y: finishY(),
    stagger: SETTINGS.stagger || 0.5, // {
    // wrap advanced options in an object
    // each: 0.15,
    // ease: 'power1.inOut',
    //},
    ease: SETTINGS.ease,
    onStart: onStart,
    onStartParams: [SPLIT],
    onComplete: onComplete,
    onCompleteParams: [SPLIT],
  });
}

function onStart(st) {
  document.dispatchEvent(TextPartyEvent('onTextPartyStart', gsap.getById(SETTINGS.id)));
}

function onComplete(st) {
  st.revert();
  document.dispatchEvent(TextPartyEvent('onTextPartyComplete', gsap.getById(SETTINGS.id)));
}

function startY() {
  return SETTINGS.y_delta;
}

function finishY() {
  console.log('SETTINGS.y_delta', SETTINGS.y_delta);
  return 10;
}

function settings() {
  // Create the container
  const container = document.createElement('div');
  container.classList.add('absolute', 'top-0', 'right-0', 'w-80', 'z-50', 'flex', 'p-4');

  // Create the range slider

  CONTROL.type = 'range';
  CONTROL.min = 0;
  CONTROL.max = 1000;
  CONTROL.value = Y_DELTA;
  CONTROL.classList.add('range', 'range-primary');

  // Create the value display
  const display = document.createElement('span');
  display.classList.add('basis-1/6');
  display.textContent = CONTROL.value;

  container.appendChild(display);
  container.appendChild(CONTROL);
  document.body.appendChild(container);

  // Update the view when the range changes
  CONTROL.addEventListener('input', event => {
    display.textContent = event.target.value;
    Y_DELTA = event.target.value;
    // base = 0 - amount - 1;
    // updateView();
  });
}
