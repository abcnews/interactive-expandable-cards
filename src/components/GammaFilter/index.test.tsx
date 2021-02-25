import { h } from 'preact';
import render from 'preact-render-to-string';
import htmlLooksLike from 'html-looks-like';

import styles from './styles.scss';
import GammaFilter from '.';

describe('GammaFilter', () => {
  test('It renders', () => {
    const actual = render(<GammaFilter id="id" r={10} g={10} b={10} />);
    const expected = `
      <svg className="${styles.filter}">
      <defs></defs>
      <filter id="id" color-interpolation-filters="sRGB" x="0" y="0" height="100%" width="100%">
        <feComponentTransfer>
          <feFuncR type="gamma" exponent="10" />
          <feFuncG type="gamma" exponent="10" />
          <feFuncB type="gamma" exponent="10" />
        </feComponentTransfer>
      </filter>
    </svg>
    `;

    htmlLooksLike(actual, expected);
  });
});
