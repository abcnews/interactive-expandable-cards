import './polyfills';

import { h, render } from 'preact';
import dewysiwyg from 'util-dewysiwyg';
import ns from 'util-news-selectors';
import { isMount, getMountValue } from '@abcnews/mount-utils';

import { ExpandableCards, ExpandableCardsColourMap, ExpandableCardsImage } from './components/ExpandableCards';
import type { ExpandableCardsItem } from './components/ExpandableCards';
import { getConfig, getItemConfig, isTitle, parseTitle } from './lib/utils';
import { getApplication } from '@abcnews/env-utils';

const IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-\d+x\d+/;
const THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-460x307';
const P2_IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-thumbnail/;
const P2_THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-large';

const toItems = (availableColours: ExpandableCardsColourMap) => (
  section: HTMLElement[]
): ExpandableCardsItem | null => {
  let itemConfigString: string = '';

  const nodes = (section = section.filter(el => {
    if (isMount(el, 'card')) {
      itemConfigString = getMountValue(el, 'card');
      return false;
    }
    return true;
  }));

  const headingEl = nodes.shift();

  if (!isTitle(headingEl)) {
    return null;
  }

  const { title, label } = parseTitle(headingEl.textContent || '');

  let imgEl: HTMLElement | null | undefined = section?.shift();

  if (imgEl && imgEl.tagName !== 'IMG') {
    imgEl = imgEl.querySelector<HTMLElement>('img, picture > :last-child');
  }

  if (imgEl && !imgEl.hasAttribute('src')) {
    const prev = imgEl.previousElementSibling;
    imgEl = prev instanceof HTMLElement ? prev : null;
  }

  var image: ExpandableCardsImage | null = null;

  if (imgEl) {
    const url = (imgEl.getAttribute('src') || imgEl.getAttribute('srcset') || imgEl.getAttribute('data-srcset') || '')
      .replace(IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, THREE_TWO_IMAGE_SRC_SEGMENT)
      .replace(P2_IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, P2_THREE_TWO_IMAGE_SRC_SEGMENT);
    const alt = imgEl.getAttribute('alt');
    if (typeof alt === 'string' && typeof url === 'string') {
      image = { alt, url, renditions: [] };
    }
  }

  const detail = section.filter(el => el.textContent !== ' ' || el.tagName === 'A');
  const itemConfig = getItemConfig(itemConfigString, availableColours);

  return { label, image, title, detail, ...itemConfig };
};

const splitIntoSections = (teaserEl: HTMLElement) => {
  const sections: HTMLElement[][] = [];
  let buffer: HTMLElement[] = [];

  const add = () => {
    if (!buffer.length) {
      return;
    }

    sections.push(
      buffer.map(node => {
        node.parentElement && node.parentElement.removeChild(node);
        return node;
      })
    );

    buffer = [];
  };

  Array.from(teaserEl.children).forEach(el => {
    if (el.tagName === 'H2') {
      add();
    } else if (!buffer.length) {
      return;
    }

    if (el instanceof HTMLElement) buffer.push(el);
  });

  add();

  return sections;
};

export const init = () => {
  const BEACON_NAME = 'interactive-expandable-cards';
  const platform = getApplication();
  const PLATFORM = {
    '-1': 'p1m',
    0: 'p2',
    1: 'p1s'
  }[
    +(document.body.className.indexOf('platform-standard') > -1) -
      +(document.body.className.indexOf('platform-mobile') > -1)
  ];
  const EMBED_WYSIWYG_SELECTOR = ns('embed:wysiwyg', PLATFORM);
  const EMBED_FULL_CLASS_NAME = { p1s: 'full', p1m: '', p2: 'view-embed-full' }[PLATFORM || ''];
  const MOCK_TEASER_OUTER_CLASS_NAME = (EMBED_WYSIWYG_SELECTOR.split(' ')[0] + ' ' + EMBED_FULL_CLASS_NAME).replace(
    /\./g,
    ' '
  );
  const MOCK_TEASER_INNER_CLASS_NAME = (PLATFORM === 'p2' ? EMBED_WYSIWYG_SELECTOR.split(' ')[1] : '').replace(
    /\./g,
    ' '
  );

  // Mock WYSIWYG teaser containing beacon for embed-less cards
  Array.from(document.querySelectorAll<HTMLElement>('a[name^="cards"]')).forEach(startNode => {
    const beaconEl = document.createElement('div');
    const outerEl = document.createElement('div');
    const innerEl = MOCK_TEASER_INNER_CLASS_NAME ? document.createElement('div') : null;
    const betweenNodes: Node[] = [beaconEl];
    let nextNode: Node | null = startNode;
    let isMoreContent = true;

    while (isMoreContent && (nextNode = nextNode.nextSibling) !== null) {
      if (
        nextNode instanceof Element &&
        nextNode.tagName &&
        (nextNode.getAttribute('name') || '').indexOf('endcards') === 0
      ) {
        isMoreContent = false;
      } else {
        betweenNodes.push(nextNode);
      }
    }

    beaconEl.setAttribute('data-beacon', BEACON_NAME);
    beaconEl.setAttribute('data-config', startNode.getAttribute('name') || '');
    outerEl.className = MOCK_TEASER_OUTER_CLASS_NAME;

    betweenNodes.forEach(node => {
      (innerEl || outerEl).appendChild(node);
    });

    if (innerEl) {
      innerEl.className = MOCK_TEASER_INNER_CLASS_NAME;
      outerEl.append(innerEl);
    }
    if (startNode.parentElement) {
      startNode.parentElement.insertBefore(outerEl, startNode);
      startNode.parentElement.removeChild(startNode);
    } else {
      throw new Error('Could not create mock teaser');
    }

    nextNode?.parentElement && nextNode.parentElement.removeChild(nextNode);
  });

  // Transform WYSIWYG teasers containing beacons into ExpandableCards apps

  const teaserEls = Array.from(document.querySelectorAll(`[data-beacon="${BEACON_NAME}"]`)).map(beaconEl => {
    const teaserEl = beaconEl.closest<HTMLElement>(EMBED_WYSIWYG_SELECTOR);
    if (!teaserEl) {
      throw new Error('Unexpected DOM structure, could not transform cards');
    }

    beaconEl.parentElement && beaconEl.parentElement.removeChild(beaconEl);

    const config = getConfig((beaconEl.getAttribute('data-config') || '') + 'COLOURDEFAULT01cfff');

    if (!window.__ODYSSEY__) {
      dewysiwyg.normalise(teaserEl);
    }

    const items = splitIntoSections(teaserEl)
      .map(toItems(config.availableColours))
      .filter((x): x is ExpandableCardsItem => x !== null);

    Array.from(teaserEl.childNodes).forEach(node => node.parentElement?.removeChild(node));

    render(<ExpandableCards items={items} {...config} />, teaserEl, teaserEl?.lastElementChild || undefined);

    return teaserEl;
  });

  function supportOdyssey() {
    teaserEls.forEach(teaserEl => {
      teaserEl.classList.remove('u-richtext');
      teaserEl.classList.add('u-pull');
    });
  }

  if (window.__ODYSSEY__) {
    supportOdyssey();
  } else {
    window.addEventListener('odyssey:api', supportOdyssey);
  }

  if (process.env.NODE_ENV === 'development') {
    require('preact/devtools');
  }
};
