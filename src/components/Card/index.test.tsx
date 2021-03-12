import { h } from 'preact';
import render from 'preact-render-to-string';

import Card from '.';

describe('Card', () => {
  test('It renders', () => {
    const actual = render(
      <Card
        instance={0}
        index={0}
        title={'Title'}
        label={'Label'}
        image={{
          alt: 'Test',
          url: 'https://example.com/test.jpg',
          renditions: []
        }}
        detail={[document.createElement('p')]}
        siblingsHaveLabels={false}
        colour={'#000'}
        shouldTintPhoto={false}
        itemsPerRow={3}
        isOpen={false}
        onToggle={() => {}}
        onNavigate={ev => {}}
      />
    );
    expect(actual).toMatchSnapshot();
  });
});
