import { h } from 'preact';
import render from 'preact-render-to-string';

import CardImage from '.';

describe('CardImage', () => {
  test('It renders', () => {
    const actual = render(<CardImage image={{ alt: 'Alt', url: 'url', renditions: [] }} tint={{ r: 1, g: 1, b: 1 }} />);
    expect(actual).toMatchSnapshot();
  });
});
