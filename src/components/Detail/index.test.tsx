import { h } from 'preact';
import render from 'preact-render-to-string';

import Detail from '.';

describe('Detail', () => {
  test('It renders', () => {
    const actual = render(<Detail open={false} nodes={[document.createElement('p')]} />);
    expect(actual).toMatchSnapshot();
  });
});
