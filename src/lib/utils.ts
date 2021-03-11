import 'regenerator-runtime';
import { TERMINUS_KEY, NAMED_COLOURS, ACTO_PROP_MAP, ACTO_PROP_MAP_CARD, DEFAULT_IMAGE_RATIO } from './constants';
import acto from '@abcnews/alternating-case-to-object';
import { fetchOne, getImages } from '@abcnews/terminus-fetch';
import { getTier, TIERS } from '@abcnews/env-utils';

import {
  ExpandableCardsColourMap,
  ExpandableCardsConfig,
  ExpandableCardsItemConfig,
  ExpandableCardsImageRendition,
  ExpandableCardsImage
} from '../components/ExpandableCards';

export type TerminusImageData = {
  [key: string]: ExpandableCardsImage;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

enum ImageRatios {
  '1x1' = '1x1',
  '3x2' = '3x2',
  '3x4' = '3x4',
  '4x3' = '4x3',
  '16x9' = '16x9'
}

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
    const nameMatch = key.match(/^colou?r([a-z]*)$/);
    const name = (nameMatch && nameMatch[1]) || 'default';
    return name && typeof val === 'string' && typeof name === 'string'
      ? { ...colours, [name]: configColourToHex(val) }
      : colours;
  };
  const availableColours = Object.keys(actos).reduce<ExpandableCardsColourMap>(extractColours, NAMED_COLOURS);
  return {
    defaultShouldTintPhoto: actos.tintPhoto === true,
    defaultCardColour: configColourToHex(actos.colourDefault, availableColours),
    defaultImageRatio: typeof actos.imageRatio === 'string' ? actos.imageRatio : DEFAULT_IMAGE_RATIO,
    availableColours
  };
};

export const configColourToHex = (colour: unknown, colours: ExpandableCardsColourMap = NAMED_COLOURS) => {
  const c = String(colour).toLowerCase();

  return c.indexOf('#') === 0
    ? c
    : colours.hasOwnProperty(c)
    ? colours[c]
    : (c.length === 6 || c.length === 3) && /^[0-9a-f]+$/.test(c)
    ? '#' + colour
    : colours['default'];
};

export const getColourFromLabel = (label: string | null, colours: ExpandableCardsColourMap) => {
  return colours[label?.toLowerCase().replace(/[^a-z]/g, '') || 'default'] || colours['default'];
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
export const blackOrWhiteText = (background: RGB) => {
  return perceivedBrightness(background) < 145 ? 'white' : 'black';
};
export const rgbGamma = (rgb: RGB): RGB => {
  let brightness = perceivedBrightness(rgb);
  const calcGamma = (channel: 'r' | 'g' | 'b') => (255 + brightness / 2 - rgb[channel]) / 255;
  return { r: calcGamma('r'), g: calcGamma('g'), b: calcGamma('b') };
};

export const isTitle = (el: unknown): el is HTMLHeadingElement =>
  typeof el !== 'undefined' &&
  el instanceof HTMLHeadingElement &&
  el.tagName === 'H2' &&
  el.textContent !== null &&
  el.textContent.trim().length > 0;

export const parseTitle = (text: string): { title: string; label: string | null } => {
  const match = text.match(/^(([^:]*):\s+)?(.*)$/);
  const label = match ? match[2] || null : null;
  const title = match ? match[3] : '';
  return { title, label };
};

// Image functions are only relevant to the PL implementation
export const isImage = (el: unknown): el is HTMLElement =>
  typeof el !== 'undefined' &&
  el instanceof HTMLElement &&
  el.tagName === 'FIGURE' &&
  el.getAttribute('id') !== null &&
  el.getAttribute('id')?.length !== 0 &&
  el.children.length > 0;

export const getEmbeddedImageData = async (id: string) => {
  const { _embedded } = await fetchOne({
    id,
    apikey: TERMINUS_KEY,
    version: getTier() === TIERS.PREVIEW ? 'v1' : 'v2'
  });
  const media = _embedded?.mediaEmbedded || [];

  return media.reduce<TerminusImageData>((images, embed: any) => {
    try {
      const widths = [480, 240, 120];
      const imageData = getImages(embed, widths);
      const alt = imageData.alt || imageData.title || '';
      const id = imageData.cmid;
      images[id] = { alt, url: '', renditions: imageData.renditions };
      return images;
    } catch (e) {
      // this ignores embeds which aren't images (which will throw an error when passed to getImages)
      return images;
    }
  }, {});
};
