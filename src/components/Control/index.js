const classNames = require('classnames');
const { h, Component } = require('preact');
const styles = require('./styles.scss');

const SCROLL_INTO_VIEW_OPTIONS = { behavior: 'smooth', block: 'center', inline: 'end' };
const TITLE_SCROLL_MARGIN = 48;
const TITLE_CONTAINING_BRACES = /(.*)\((.*)\)(.*)?/;

let colours = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgrey: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#bebebe',
  grey: '#bebebe',
  webgray: '#808080',
  webgrey: '#808080',
  green: '#00ff00',
  webgreen: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrod: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#b03060',
  webmaroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  navyblue: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#a020f0',
  webpurple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
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
