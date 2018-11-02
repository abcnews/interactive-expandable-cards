require('./polyfills');

const { h, render } = require('preact');
const dewysiwyg = require('util-dewysiwyg');
const ns = require('util-news-selectors');
const ExpandableCards = require('./components/ExpandableCards');

const slice = Array.prototype.slice;

const LABEL_DELIMETER = ': ';
const LABEL_REGEX = /^([^:]*)/;
const TITLE_MINUS_LABEL_REGEX = /:\s+(.*)/;
const IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-\d+x\d+/;
const THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-460x307';
const P2_IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX = /\d+x\d+-thumbnail/;
const P2_THREE_TWO_IMAGE_SRC_SEGMENT = '3x2-large';
const BEACON_NAME = 'interactive-expandable-cards';
const PLATFORM = {
  '-1': 'p1m',
  0: 'p2',
  1: 'p1s'
}[
  +(document.body.className.indexOf('platform-standard') > -1) -
    +(document.body.className.indexOf('platform-mobile') > -1)
];
const EMBED_WYSIWYG_SELECTOR = ns('embed:wysiwyg', PLATFORM);
const EMBED_FULL_CLASS_NAME = { p1s: 'full', p1m: '', p2: 'view-embed-full' }[PLATFORM];
const MOCK_TEASER_OUTER_CLASS_NAME = (EMBED_WYSIWYG_SELECTOR.split(' ')[0] + ' ' + EMBED_FULL_CLASS_NAME).replace(
  /\./g,
  ' '
);
const MOCK_TEASER_INNER_CLASS_NAME = (PLATFORM === 'p2' ? EMBED_WYSIWYG_SELECTOR.split(' ')[1] : '').replace(
  /\./g,
  ' '
);

// Mock WYSIWYG teaser containing beacon for embed-less cards

slice.call(document.querySelectorAll('a[name^="cards"]')).forEach((startNode, index) => {
  const beaconEl = document.createElement('div');
  const outerEl = document.createElement('div');
  const innerEl = MOCK_TEASER_INNER_CLASS_NAME ? document.createElement('div') : null;
  const betweenNodes = [beaconEl];
  let nextNode = startNode;
  let isMoreContent = true;

  while (isMoreContent && (nextNode = nextNode.nextSibling) !== null) {
    if (nextNode.tagName && (nextNode.getAttribute('name') || '').indexOf('endcards') === 0) {
      isMoreContent = false;
    } else {
      betweenNodes.push(nextNode);
    }
  }

  beaconEl.setAttribute('data-beacon', BEACON_NAME);
  outerEl.className = MOCK_TEASER_OUTER_CLASS_NAME;

  betweenNodes.forEach(node => {
    (innerEl || outerEl).appendChild(node);
  });

  if (innerEl) {
    innerEl.className = MOCK_TEASER_INNER_CLASS_NAME;
    outerEl.append(innerEl);
  }

  startNode.parentElement.insertBefore(outerEl, startNode);
  startNode.parentElement.removeChild(startNode);
  nextNode.parentElement.removeChild(nextNode);
});

// Transform WYSIWYG teasers containing beacons into ExpandableCards apps

const teaserEls = slice.call(document.querySelectorAll(`[data-beacon="${BEACON_NAME}"]`)).map(beaconEl => {
  const teaserEl = beaconEl.closest(EMBED_WYSIWYG_SELECTOR);

  beaconEl.parentElement.removeChild(beaconEl);

  if (!window.__ODYSSEY__) {
    // dewysiwyg.normalise(teaserEl);
  }

  const items = splitIntoSections(teaserEl)
    .map(toItems)
    .filter(x => x);

  slice.call(teaserEl.childNodes).forEach(node => node.parentElement.removeChild(node));

  render(<ExpandableCards items={items} />, teaserEl, teaserEl.lastChild);

  return teaserEl;
});

function splitIntoSections(teaserEl) {
  const sections = [];
  let buffer = [];

  const add = () => {
    if (!buffer.length) {
      return;
    }

    sections.push(
      buffer.map(node => {
        node.parentElement.removeChild(node);

        return node;
      })
    );

    buffer = [];
  };

  slice.call(teaserEl.children).forEach(el => {
    if (el.tagName === 'H2') {
      add();
    } else if (!buffer.length) {
      return;
    }

    buffer.push(el);
  });

  add();

  return sections;
}

function toItems(section) {
  const headingEl = section.shift();

  let title = headingEl.textContent;

  if (title.replace(' ', '').length === 0) {
    return null;
  }

  let label;

  if (title.indexOf(LABEL_DELIMETER) > -1) {
    label = title.match(LABEL_REGEX)[1];
    title = title.match(TITLE_MINUS_LABEL_REGEX)[1];
  }

  let imgEl = section.shift();

  if (imgEl.tagName !== 'IMG') {
    imgEl = imgEl.querySelector('img, picture > :last-child');
  }

  if (imgEl && !imgEl.hasAttribute('src')) {
    imgEl = imgEl.previousElementSibling;
  }

  let image;

  if (imgEl) {
    image = (imgEl.getAttribute('src') || imgEl.getAttribute('srcset') || imgEl.getAttribute('data-srcset') || '')
      .replace(IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, THREE_TWO_IMAGE_SRC_SEGMENT)
      .replace(P2_IMAGE_DIMENSIONS_SRC_SEGMENT_REGEX, P2_THREE_TWO_IMAGE_SRC_SEGMENT);
  }

  const detail = section.filter(el => el.textContent !== ' ' || el.tagName === 'A');

  return {
    label,
    image,
    title,
    detail
  };
}

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
