import Card from "./Card.js";

const CARD_ROOT_SELECTOR = '[data-card-el="root"]';

export default class CardManager {
  constructor() {
    this.cards = Array.from(document.querySelectorAll(CARD_ROOT_SELECTOR)).map(
      (root, index) => new Card(root, { index }),
    );
  }

  kill() {
    this.cards.forEach((card) => card.destroy?.() ?? card.kill?.());
    this.cards = [];
  }
}
