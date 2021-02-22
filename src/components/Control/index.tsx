import classNames from 'classnames';
import { h, Component, createRef } from 'preact';
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

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type RgbGamma = {
  r: number;
  g: number;
  b: number;
};

type ColourName = keyof typeof namedColours;

const t = ['a', 'b'] as const;

const SCROLL_INTO_VIEW_OPTIONS = { behavior: 'smooth', block: 'center', inline: 'end' };
const TITLE_SCROLL_MARGIN = 48;
const TITLE_CONTAINING_BRACES = /(.*)\((.*)\)(.*)?/;

let namedColours: { [key: string]: string } = {
  green: '#049a5e',
  positive: '#049a5e',
  red: '#b71a3c',
  negative: '#b71a3c',
  grey: '#b5bbbc',
  gray: '#b5bbbc',
  neutral: '#b5bbbc',
  black: '#000000',
  default: '#000000',
  blue: '#1467cc'
} as const;

const configColourToHex = (colour: unknown) => {
  const c = String(colour).toLowerCase();
  return namedColours.hasOwnProperty(c)
    ? namedColours[c]
    : (c.length === 6 || c.length === 3) && /^[0-9a-f]+$/.test(c)
    ? '#' + colour
    : namedColours['default'];
};

let hex = (label, config) => {
  let labelConfigKey;
  if (label) {
    let labelName = label.toLowerCase().replace(/[^a-z]+/g, '');
    labelConfigKey = Object.keys(config).filter(
      key => label && (key === 'colour' + labelName || key === 'color' + labelName)
    )[0];
  }
  return configColourToHex(config.colourOverride || config[labelConfigKey] || config.colourDefault);
};
let hexToRGB = (hex: string): Rgb => {
  if (hex.substring(0, 1) === '#') {
    // discard it
    hex = hex.substring(1);
  }
  if (hex.length === 3) {
    // shorthand syntax
    hex = hex.replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  }
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
};
let perceivedBrightness = (rgb: Rgb): number => {
  // Based on https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  return Math.floor(Math.sqrt(rgb.r * rgb.r * 0.241 + rgb.g * rgb.g * 0.691 + rgb.b * rgb.b * 0.068));
};
let blackOrWhiteText = backgroundRGB => {
  return perceivedBrightness(backgroundRGB) < 145 ? 'white' : 'black';
};
let rgbGamma = (rgb: Rgb): RgbGamma => {
  let brightness = perceivedBrightness(rgb);
  const calcGamma = (channel: 'r' | 'g' | 'b') => (255 + brightness / 2 - rgb[channel]) / 255;
  return { r: calcGamma('r'), g: calcGamma('g'), b: calcGamma('b') };
};

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
          this.toggleRef.current.scrollIntoView(SCROLL_INTO_VIEW_OPTIONS);
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
    const matches = title.match(TITLE_CONTAINING_BRACES);
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
