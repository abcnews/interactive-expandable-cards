import { h } from 'preact';
import render from 'preact-render-to-string';

import GammaFilter from '.';

describe('GammaFilter', () => {
  test('It renders', () => {
    const actual = render(<GammaFilter id="id" exponents={{ r: 10, g: 10, b: 10 }} />);
    expect(actual).toMatchSnapshot();
  });
});
