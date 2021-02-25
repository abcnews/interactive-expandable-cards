import { h, FunctionalComponent, Fragment } from 'preact';
import classNames from 'classnames';
import { Detail } from '../Detail';
import styles from './styles.scss';
import { blackOrWhiteText, hexToRGB, rgbGamma } from '../../lib/utils';
import { useEffect, useRef } from 'preact/hooks';
import { TITLE_SCROLL_MARGIN } from '../../lib/constants';
import GammaFilter from '../GammaFilter';

type CardProps = {
  instance: number;
  index: number;
  title: string;
  image: string | null;
  label: string | null;
  detail: HTMLElement[];
  colour: string;
  tint: boolean;
  isOpen: boolean;
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
  colour,
  tint,
  isOpen,
  onNavigate,
  onToggle,
  itemsPerRow
}) => {
  const controlId = `ExpandableCards_${instance}__Control_${index}`;
  const regionId = `ExpandableCards_${instance}__Region_${index}`;
  const filterId = `ExpandableCards_${instance}__Filter_${index}`;
  const order = 1 + (index % itemsPerRow) + Math.floor(index / itemsPerRow) * itemsPerRow * 2;

  const toggleRef = useRef<HTMLDivElement>();

  // Scroll newly opened cards into view.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const { top, bottom } = toggleRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (top < TITLE_SCROLL_MARGIN || bottom > windowHeight - TITLE_SCROLL_MARGIN) {
          toggleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' });
        }
      }, 250);
    }
  }, [isOpen]);

  const matches = title.match(/(.*)\((.*)\)(.*)?/); // Does the title contain braces?
  const titleChildren = matches ? [matches[1], <span>{matches[2]}</span>, matches[3] || ''] : title;

  const bgRGB = hexToRGB(colour);
  const bgRGBGamma = rgbGamma(bgRGB);
  const textColour = blackOrWhiteText(bgRGB);
  const filterCSS = tint === true ? `grayscale(100%) url(#${filterId})` : undefined;

  // TODO: Investigate and reinstate this functionality
  const siblingsHaveLabels = true;

  return (
    <Fragment>
      <dt
        role="heading"
        aria-level="3"
        className={styles[`of${itemsPerRow}`]}
        style={{ order: order, '-webkit-order': order }}
      >
        <button
          id={controlId}
          aria-controls={regionId}
          aria-expanded={isOpen ? 'true' : 'false'}
          className={classNames(styles.card, { [styles.open]: open, [styles.siblingsHaveLabels]: siblingsHaveLabels })}
          onClick={onToggle}
          onKeyDown={onNavigate}
          style={{ '--card-heading-bg': colour, '--card-heading-text': textColour }}
          data-component="Control"
        >
          {label ? (
            <div
              className={classNames(styles.label, { [styles.long]: label.length > 12 })}
              style={{ backgroundColor: colour, color: textColour }} // in case CSS variables don't work (e.g. Internet Explorer)
            >
              {label}
            </div>
          ) : null}
          {image ? (
            <div className={styles.image} role="presentation">
              <img src={image} style={{ filter: filterCSS, '-webkit-filter': filterCSS }} />
            </div>
          ) : null}
          <div class={styles.title}>{titleChildren}</div>
          <div ref={toggleRef} class={styles.toggle} role="presentation" />
          <GammaFilter id={filterId} exponents={bgRGBGamma} />
        </button>
      </dt>
      <dd
        id={regionId}
        role="region"
        aria-hidden={isOpen ? 'false' : 'true'}
        aria-labelledby={controlId}
        style={{ order: order + itemsPerRow, '-webkit-order': order + itemsPerRow }}
      >
        <Detail nodes={detail} open={isOpen} />
      </dd>
    </Fragment>
  );
};

export default Card;
