import { isImage, isTitle, parseTitle } from './utils';

describe('isTitle', () => {
  const incorrectElement = document.createElement('h3');
  incorrectElement.textContent = 'Title';
  const emptyTitle = document.createElement('h2');

  test('should fail for an empty node', () => {
    const h2 = document.createElement('h2');
    expect(isTitle(h2)).toBe(false);
    h2.textContent = '';
    expect(isTitle(h2)).toBe(false);
    h2.textContent = ' ';
    expect(isTitle(h2)).toBe(false);
  });

  test('should fail for heading elements other than h2', () => {
    const h3 = document.createElement('h3');
    h3.textContent = 'Text';
    expect(isTitle(h3)).toBe(false);
  });

  test('should fail for non-heading elements', () => {
    const p = document.createElement('p');
    p.textContent = 'Text';
    expect(isTitle(p)).toBe(false);
  });

  test('should pass for h2 elements with text content', () => {
    const h2 = document.createElement('h2');
    h2.textContent = 'Title';
    expect(isTitle(h2)).toBe(true);
  });
});

describe('isImage', () => {
  const getFigure = (options?: { id?: string }) => {
    const figure = document.createElement('figure');
    if (options?.id) {
      figure.setAttribute('id', options.id);
    }
    return figure;
  };

  const addImage = (el: HTMLElement, options?: { src?: string }) => {
    const img = document.createElement('img');
    if (options?.src) img.setAttribute('src', options.src);
    el.append(img);
    return el;
  };

  test('should fail for an empty figure', () => {
    const figure = getFigure({ id: '123' });
    expect(isImage(figure)).toBe(false);
  });

  test('should fail for elements other than figure', () => {
    const other = document.createElement('h3');
    other.setAttribute('id', '123');
    const h3 = addImage(other, { src: 'yes' });
    expect(isImage(h3)).toBe(false);
  });

  test('should pass for a figure elements with and ID', () => {
    const figure = addImage(getFigure({ id: '123' }), { src: 'yes' });
    expect(isImage(figure)).toBe(true);
  });
});

describe('parseTitle', () => {
  test('should handle a title with label', () => {
    expect(parseTitle('Label: Title')).toEqual({ title: 'Title', label: 'Label' });
  });
  test('should handle a title without a label', () => {
    expect(parseTitle('Title')).toEqual({ title: 'Title', label: null });
  });
});

export {};
