import { NAMED_COLOURS, ACTO_PROP_MAP, ACTO_PROP_MAP_CARD } from './constants';
import acto from '@abcnews/alternating-case-to-object';
import {
  ExpandableCardsColourMap,
  ExpandableCardsConfig,
  ExpandableCardsItemConfig
} from '../components/ExpandableCards';

type RGB = {
  r: number;
  g: number;
  b: number;
};

export const getItemConfig = (str: string, availableColours: ExpandableCardsColourMap) => {
  const actos = acto(str, { propMap: ACTO_PROP_MAP_CARD });
  const defined = (val: unknown) => val !== null && typeof val !== 'undefined';
  const config: ExpandableCardsItemConfig = {};
  if (defined(actos.tintPhoto)) config.shouldTintPhoto = actos.tintPhoto === true;
  if (defined(actos.colourOverride)) config.cardColour = configColourToHex(actos.colourOverride, availableColours);
  return config;
};

export const getConfig = (str: string): ExpandableCardsConfig => {
  const actos = acto(str, { propMap: ACTO_PROP_MAP });
  const extractColours = (colours: ExpandableCardsColourMap, key: string) => {
    const val = actos[key];
    const nameMatch = key.match(/^colou?r([a-z]+)$/);
    const name = nameMatch && nameMatch[1];
    return name && typeof val === 'string' && typeof name === 'string'
      ? Object.assign(colours, { [name]: val })
      : colours;
  };
  const availableColours = Object.keys(actos).reduce<ExpandableCardsColourMap>(extractColours, NAMED_COLOURS);

  return {
    defaultShouldTintPhoto: actos.tintPhoto === true,
    defaultCardColour: configColourToHex(String(actos.colourDefault), availableColours),
    availableColours
  };
};

export const configColourToHex = (colour: unknown, colours: ExpandableCardsColourMap = NAMED_COLOURS) => {
  const c = String(colour).toLowerCase();
  return colours.hasOwnProperty(c)
    ? colours[c]
    : (c.length === 6 || c.length === 3) && /^[0-9a-f]+$/.test(c)
    ? '#' + colour
    : colours['default'];
};

export const getColourFromLabel = (label: string | null, colours: ExpandableCardsColourMap) => {
  return colours[label?.toLowerCase() || 'default'] || colours['default'];
};

export const hexToRGB = (hex: string): RGB => {
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
export const perceivedBrightness = (rgb: RGB): number => {
  // Based on https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  return Math.floor(Math.sqrt(rgb.r * rgb.r * 0.241 + rgb.g * rgb.g * 0.691 + rgb.b * rgb.b * 0.068));
};
export const blackOrWhiteText = backgroundRGB => {
  return perceivedBrightness(backgroundRGB) < 145 ? 'white' : 'black';
};
export const rgbGamma = (rgb: RGB): RGB => {
  let brightness = perceivedBrightness(rgb);
  const calcGamma = (channel: 'r' | 'g' | 'b') => (255 + brightness / 2 - rgb[channel]) / 255;
  return { r: calcGamma('r'), g: calcGamma('g'), b: calcGamma('b') };
};
