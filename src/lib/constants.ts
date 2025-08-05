import { type ExpandableCardsColourMap } from '../components/ExpandableCards';

type ColourName = keyof typeof NAMED_COLOURS;

export const NAMED_COLOURS: ExpandableCardsColourMap = {
  green: '#049a5e',
  positive: '#049a5e',
  winner: '#049a5e',
  red: '#b71a3c',
  negative: '#b71a3c',
  loser: '#b71a3c',
  grey: '#b5bbbc',
  gray: '#b5bbbc',
  neutral: '#b5bbbc',
  black: '#000000',
  default: '#000000',
  blue: '#1467cc'
} as const;

export const ACTO_PROP_MAP = {
  colour: 'colourDefault',
  color: 'colourDefault',
  tintphoto: 'tintPhoto',
  tintphotos: 'tintPhoto',
  tintimages: 'tintPhoto',
  ratio: 'imageRatio'
};
export const ACTO_PROP_MAP_CARD = {
  colour: 'colourOverride',
  color: 'colourOverride',
  tintphoto: 'tintPhoto',
  tintphotos: 'tintPhoto',
  tintimages: 'tintPhoto'
};

export const TITLE_SCROLL_MARGIN = 48;

export const DEFAULT_IMAGE_RATIO = '3x2';

export const DETAIL_IMAGE_RATIO = '16x9';
