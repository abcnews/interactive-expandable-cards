import classNames from 'classnames';
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { hex, hexToRGB, rgbGamma, blackOrWhiteText } from '../../lib/utils';
import styles from './styles.scss';

type ControlProps = {
  open: boolean;
  config: ControlConfig;
  id: string;
  label: string;
  categoryIndex: number;
  image: string;
  onNavigate: (event: KeyboardEvent) => void;
  onToggle: () => void;
  regionId: string;
  siblingsHaveLabels: boolean;
  title: string;
  filterId: string;
};

type ControlConfig = {
  tintPhoto?: boolean;
};

const TITLE_SCROLL_MARGIN = 48;

export const Control = ({
  id,
  categoryIndex,
  image,
  label,
  onNavigate,
  onToggle,
  open,
  regionId,
  siblingsHaveLabels,
  title,
  filterId,
  config
}: ControlProps) => {
  const toggleRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const { top, bottom } = toggleRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (top < TITLE_SCROLL_MARGIN || bottom > windowHeight - TITLE_SCROLL_MARGIN) {
          toggleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' });
        }
      }, 250);
    }
  }, [open]);

  const matches = title.match(/(.*)\((.*)\)(.*)?/); // Does the title contain braces?
  const titleChildren = matches ? [matches[1], <span>{matches[2]}</span>, matches[3] || ''] : title;
  const bgHex = hex(label, config);
  const bgRGB = hexToRGB(bgHex);
  const bgRGBGamma = rgbGamma(bgRGB);
  const text = blackOrWhiteText(bgRGB);
  const filterCSS = config.tintPhoto === true ? `grayscale(100%) url(#${filterId})` : undefined;

  return (
    <button
      id={id}
      aria-controls={regionId}
      aria-expanded={open ? 'true' : 'false'}
      className={classNames(styles.root, { [styles.open]: open, [styles.siblingsHaveLabels]: siblingsHaveLabels })}
      onClick={onToggle}
      onKeyDown={onNavigate}
      style={{ '--card-heading-bg': bgHex, '--card-heading-text': text }}
      data-component="Control"
    >
      {label ? (
        <div
          className={classNames(styles.label, { [styles.long]: label.length > 12 })}
          data-expandable-cards-label={slug(label)}
          data-expandable-cards-label-category-index={categoryIndex}
          style={{ backgroundColor: bgHex, color: text }} // in case CSS variables don't work (e.g. Internet Explorer)
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
      <svg className={styles.filter}>
        <filter id={filterId} color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
          <feComponentTransfer>
            {/*
            // @ts-ignore */}
            <feFuncR type="gamma" exponent={bgRGBGamma.r} />
            {/*
            // @ts-ignore */}
            <feFuncG type="gamma" exponent={bgRGBGamma.g} />
            {/*
            // @ts-ignore */}
            <feFuncB type="gamma" exponent={bgRGBGamma.b} />
          </feComponentTransfer>
        </filter>
      </svg>
    </button>
  );
};

const slug = (str: string) => {
  return str
    .replace(/\s/g, '-')
    .replace(/[()=:.,!#$@"'/\|?*+&]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
};
