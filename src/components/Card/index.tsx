import { h, FunctionalComponent, Fragment } from 'preact';
import classNames from 'classnames';
import { Detail } from '../Detail';
import styles from './styles.scss';
import { blackOrWhiteText, hexToRGB, slug } from '../../lib/utils';
import { useEffect, useRef } from 'preact/hooks';
import { TITLE_SCROLL_MARGIN } from '../../lib/constants';
import CardImage from '../CardImage';
import { ExpandableCardsImage } from '../ExpandableCards';

type CardProps = {
  instance: number;
  index: number;
  title: string;
  image: ExpandableCardsImage | null;
  label: string | null;
  detail: HTMLElement[];
  colour: string;
  shouldTintPhoto: boolean;
  isOpen: boolean;
  siblingsHaveLabels: boolean;
  onNavigate: (event: KeyboardEvent) => void;
  onToggle: () => void;
  itemsPerRow: number;
};

const Card: FunctionalComponent<CardProps> = ({
  instance,
  index,
  title,
  image,
  label,
  detail,
  colour: cardColour,
  shouldTintPhoto,
  isOpen,
  siblingsHaveLabels,
  onNavigate,
  onToggle,
  itemsPerRow
}) => {
  const controlId = `ExpandableCards_${instance}__Control_${index}`;
  const regionId = `ExpandableCards_${instance}__Region_${index}`;
  const order = 1 + (index % itemsPerRow) + Math.floor(index / itemsPerRow) * itemsPerRow * 2;

  const toggleRef = useRef<HTMLDivElement>(null);

  // Scroll newly opened cards into view.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const rect = toggleRef.current?.getBoundingClientRect();
        if (!rect) return;
        const { top, bottom } = rect;
        const windowHeight = window.innerHeight;
        if (top < TITLE_SCROLL_MARGIN || bottom > windowHeight - TITLE_SCROLL_MARGIN) {
          toggleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' });
        }
      }, 250);
    }
  }, [isOpen]);

  const matches = title.match(/(.*)\((.*)\)(.*)?/); // Does the title contain braces?
  const titleChildren = matches ? [matches[1], <span>{matches[2]}</span>, matches[3] || ''] : title;
  const cardColourRGB = hexToRGB(cardColour);
  const textColour = blackOrWhiteText(cardColourRGB);

  return (
    <Fragment>
      <dt role="heading" aria-level={3} className={styles[`of${itemsPerRow}`]} style={{ order: order }}>
        <button
          id={controlId}
          aria-controls={regionId}
          aria-expanded={isOpen ? 'true' : 'false'}
          className={classNames(styles.card, {
            [styles.open]: isOpen,
            [styles.siblingsHaveLabels]: siblingsHaveLabels
          })}
          onClick={onToggle}
          onKeyDown={onNavigate}
          style={{ '--card-heading-bg': cardColour, '--card-heading-text': textColour }}
          data-component="Control"
        >
          {label ? (
            <div
              className={classNames(styles.label, { [styles.long]: label.length > 12 })}
              data-expandable-cards-label={slug(label)}
            >
              {label}
            </div>
          ) : null}
          {image && <CardImage image={image} tint={shouldTintPhoto && cardColourRGB} />}
          <div class={styles.title}>{titleChildren}</div>
          <div ref={toggleRef} class={styles.toggle} role="presentation">
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="m20 8-8 8-8-8" stroke="currentColor" stroke-width="2" />
            </svg>
          </div>
        </button>
      </dt>
      <dd
        id={regionId}
        role="region"
        aria-hidden={isOpen ? 'false' : 'true'}
        aria-labelledby={controlId}
        className={styles.details}
        style={{ order: order + itemsPerRow, '-webkit-order': order + itemsPerRow }}
      >
        <Detail nodes={detail} open={isOpen} />
      </dd>
    </Fragment>
  );
};

export default Card;
