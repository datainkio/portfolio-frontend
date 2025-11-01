/**
 * Run the title sequence. Assumes the given text is outlined via text-stroke text-stroke-[1px]
 * @param {*} id
 * @returns GSAP timeline
 *
 */
import { gsap } from '/assets/js/gsap/gsap-core.js';
import { SplitText } from '/assets/js/gsap/SplitText.js';

// Register SplitText plugin with GSAP
gsap.registerPlugin(SplitText);

const TL = gsap.timeline();

export function OutlineToFill(params) {
  TL.id = params.id;
  var container = document.getElementById(params.container);

  var st = new SplitText(container, { type: 'words,chars' });
  var chars = st.chars; // an array of all the divs that wrap each character
  TL.to({}, { duration: 0.0001 });
  TL.add(
    gsap.from(chars, {
      duration: params.duration,
      opacity: 0,
      stagger: params.stagger,
      onStart: onStart,
      onStartParams: [params],
    })
  );

  /**
     * Something's up here. The fill is not appearing.
    tl.add(gsap.from(chars, {
        duration: params.duration,
        color: params.color, // "#1A171C00",
        stagger: params.stagger
    }));
    */
  return TL;
}

function onStart(params) {
  console.log('Outline-to-Fill local onStart');
  var container = document.getElementById(params.container);
  container.classList.add('text-outline');
}
