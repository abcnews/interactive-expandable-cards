import { h } from 'preact';
import render from 'preact-render-to-string';

import CardImage from '.';

describe('CardImage', () => {
  test('It renders', () => {
    const actual = render(<CardImage image={{ alt: 'Alt', url: 'url', renditions: [] }} tint={false} />);
    expect(actual).toMatchSnapshot();
  });
});
