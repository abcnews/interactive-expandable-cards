import classNames from 'classnames';
import { h, Component, createRef } from 'preact';
import { hex, hexToRGB, rgbGamma, blackOrWhiteText } from '../../lib/utils';
import styles from './styles.scss';

type ControlProps = {
  open: boolean;
  config: ControlConfig;
  id: string;
  label: string;
  categoryIndex: number;
  image: string;
  onNavigate: (index: string, event: KeyboardEvent) => void;
  onToggle: (index: number) => void;
  regionId: string;
  siblingsHaveLabels: boolean;
  title: string;
  filterId: string;
};

type ControlState = {};

type ControlConfig = {
  tintPhoto?: boolean;
};

const TITLE_SCROLL_MARGIN = 48;

export class Control extends Component<ControlProps, ControlState> {
  toggleRef = createRef();
  rootRef = createRef();
  constructor(props: ControlProps) {
    super(props);
  }

  componentDidUpdate({ open: wasAlreadyOpen }) {
    if (this.props.open && !wasAlreadyOpen) {
      setTimeout(() => {
        const { top, bottom } = this.toggleRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (top < TITLE_SCROLL_MARGIN || bottom > windowHeight - TITLE_SCROLL_MARGIN) {
          this.toggleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' });
        }
      }, 250);
    }
  }

  render({
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
  }: ControlProps) {
    const matches = title.match(/(.*)\((.*)\)(.*)?/); // Does the title contain braces?
    const titleChildren = matches ? [matches[1], <span>{matches[2]}</span>, matches[3] || ''] : title;
    const bgHex = hex(label, config);
    const bgRGB = hexToRGB(bgHex);
    const bgRGBGamma = rgbGamma(bgRGB);
    const text = blackOrWhiteText(bgRGB);
    const filterCSS = this.props.config.tintPhoto === true ? `grayscale(100%) url(#${filterId})` : undefined;
    return (
      <button
        ref={this.rootRef}
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
        <div ref={this.toggleRef} class={styles.toggle} role="presentation" />
        <svg className={styles.filter}>
          <filter id={filterId} color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
            <feComponentTransfer>
              <feFuncR type="gamma" exponent={bgRGBGamma.r} />
              <feFuncG type="gamma" exponent={bgRGBGamma.g} />
              <feFuncB type="gamma" exponent={bgRGBGamma.b} />
            </feComponentTransfer>
          </filter>
        </svg>
      </button>
    );
  }
}

const slug = (str: string) => {
  return str
    .replace(/\s/g, '-')
    .replace(/[()=:.,!#$@"'/\|?*+&]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
};
