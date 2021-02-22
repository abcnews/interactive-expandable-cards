import { namedColours } from './constants';
type RedGreenBlue = {
  r: number;
  g: number;
  b: number;
};

export const configColourToHex = (colour: unknown) => {
  const c = String(colour).toLowerCase();
  return namedColours.hasOwnProperty(c)
    ? namedColours[c]
    : (c.length === 6 || c.length === 3) && /^[0-9a-f]+$/.test(c)
    ? '#' + colour
    : namedColours['default'];
};

export const hex = (label, config) => {
  let labelConfigKey;
  if (label) {
    let labelName = label.toLowerCase().replace(/[^a-z]+/g, '');
    labelConfigKey = Object.keys(config).filter(
      key => label && (key === 'colour' + labelName || key === 'color' + labelName)
    )[0];
  }
  return configColourToHex(config.colourOverride || config[labelConfigKey] || config.colourDefault);
};
export const hexToRGB = (hex: string): RedGreenBlue => {
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
export const perceivedBrightness = (rgb: RedGreenBlue): number => {
  // Based on https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  return Math.floor(Math.sqrt(rgb.r * rgb.r * 0.241 + rgb.g * rgb.g * 0.691 + rgb.b * rgb.b * 0.068));
};
export const blackOrWhiteText = backgroundRGB => {
  return perceivedBrightness(backgroundRGB) < 145 ? 'white' : 'black';
};
export const rgbGamma = (rgb: RedGreenBlue): RedGreenBlue => {
  let brightness = perceivedBrightness(rgb);
  const calcGamma = (channel: 'r' | 'g' | 'b') => (255 + brightness / 2 - rgb[channel]) / 255;
  return { r: calcGamma('r'), g: calcGamma('g'), b: calcGamma('b') };
};
