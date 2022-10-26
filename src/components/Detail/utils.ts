import type { ExpandableCardsImage } from '../ExpandableCards';
import styles from './styles.scss';

export const createImage = (image: ExpandableCardsImage): HTMLImageElement => {
  const el = document.createElement('img');

  el.className = styles.image;
  el.alt = image.alt;
  el.srcset = image.renditions.map(i => `${i.url} ${i.width}w`).join(', ');

  return el;
};
