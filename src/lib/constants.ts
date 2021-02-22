type ColourName = keyof typeof namedColours;

export const namedColours: { [key: string]: string } = {
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
