const classNames = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

const SCROLL_INTO_VIEW_OPTIONS = { behavior: 'smooth', block: 'center', inline: 'end' };
const TITLE_SCROLL_MARGIN = 48;
const TITLE_CONTAINING_BRACES = /(.*)\((.*)\)(.*)?/;

let colours = {
  green: '#049a5e', positive: '#049a5e',
  red: '#b71a3c', negative: '#b71a3c',
  grey: '#b5bbbc', gray: '#b5bbbc', neutral: '#b5bbbc',
  black: '#000000', default: '#000000',
  blue: '#1467cc',
};

let configColourToHex = colour => {
  if (typeof colour === 'string' || typeof colour === 'number') {
    colour = colour.toString().toLowerCase();
    if ((colour.length === 6 || colour.length === 3) && /^[0-9a-f]+$/.test(colour)) { // hex code
      return '#'+colour;
    }
    // Assume named colour
    return colours[colour];
  }
};
let hex = (label, config) => {
  let labelConfigKey;
  if (label) {
    let labelName = label.toLowerCase().replace(/[^a-z]+/g, '');
    labelConfigKey = Object.keys(config).filter(key => label && (key === 'colour'+labelName || key === 'color'+labelName))[0];
  }
  return configColourToHex(config.colourOverride || config[labelConfigKey] || config.colourDefault) || '#525252';
};
let hexToRGB = hex => {
  if (hex.substring(0, 1) === '#') { // discard it
    hex = hex.substring(1);
  }
  if (hex.length === 3) { // shorthand syntax
    hex = hex.replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3');
  }
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  }
};
let perceivedBrightness = rgb => {
  // Based on https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  return Math.floor(Math.sqrt(
    (rgb.r * rgb.r * 0.241) +
    (rgb.g * rgb.g * 0.691) +
    (rgb.b * rgb.b * 0.068)
  ));
};
let blackOrWhiteText = backgroundRGB => {
  return perceivedBrightness(backgroundRGB) < 145 ? 'white' : 'black';
}
let rgbGamma = rgb => {
  let brightness = perceivedBrightness(rgb);
  let gamma = {};
  for (let c of ['r', 'g', 'b']) {
    gamma[c] = (255 + (brightness / 2) - rgb[c]) / 255;
  }
  return gamma;
}

class Control extends Component {
  constructor(props) {
    super(props);
    this.getToggleElRef = this.getToggleElRef.bind(this);
  }

  getToggleElRef(el) {
    this.toggleEl = el;
  }

  componentDidUpdate({ open: wasAlreadyOpen }) {
    if (this.props.open && !wasAlreadyOpen) {
      setTimeout(() => {
        const { top, bottom } = this.toggleEl.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (top < TITLE_SCROLL_MARGIN || bottom > windowHeight - TITLE_SCROLL_MARGIN) {
          this.toggleEl.scrollIntoView(SCROLL_INTO_VIEW_OPTIONS);
        }
      }, 250);
    }
  }

  render({ id, categoryIndex, image, label, onNavigate, onToggle, open, order, regionId, siblingsHaveLabels, title, filterId, config }) {
    const matches = title.match(TITLE_CONTAINING_BRACES);
    const titleChildren = matches ? [matches[1], <span>{matches[2]}</span>, matches[3] || ''] : title;
    const bgHex = hex(label, config);
    const bgRGB = hexToRGB(bgHex);
    const bgRGBGamma = rgbGamma(bgRGB);
    const text = blackOrWhiteText(bgRGB);
    const filterCSS = this.props.config.tintPhoto === true ? `grayscale(100%) url(#${filterId})` : undefined;
    return (
      <button
        ref={this.getRootRef}
        id={id}
        aria-controls={regionId}
        aria-expanded={open ? 'true' : 'false'}
        className={classNames(styles.root, { [styles.open]: open, [styles.siblingsHaveLabels]: siblingsHaveLabels })}
        onClick={onToggle}
        onKeyDown={onNavigate}
        style={{ order, '--card-heading-bg': bgHex, '--card-heading-text': text }}
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
        <div ref={this.getToggleElRef} class={styles.toggle} role="presentation" />
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

const slug = string => {
  return string
    .replace(/\s/g, '-')
    .replace(/[()=:.,!#$@"'/\|?*+&]/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
};

module.exports = Control;
