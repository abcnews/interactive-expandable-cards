import type { ExpandableCardsImage } from '../ExpandableCards';
import styles from './styles.scss';

const SIZES = '(min-width: 992px) 50vw, 90vw';

export const createImage = (image: ExpandableCardsImage): HTMLImageElement => {
  const el = document.createElement('img');

  el.className = styles.image;
  el.alt = image.alt;
  el.sizes = SIZES;
  el.src = image.renditions[0].url;
  el.srcset = image.renditions.map(i => `${i.url} ${i.width}w`).join(', ');

  return el;
};
