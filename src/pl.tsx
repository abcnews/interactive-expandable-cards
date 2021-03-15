import 'regenerator-runtime';
import { h, render } from 'preact';
import {
  ExpandableCards,
  ExpandableCardsColourMap,
  ExpandableCardsImage,
  ExpandableCardsItem
} from './components/ExpandableCards';
import { getConfig, getEmbeddedImageData, getItemConfig, isImage, isTitle, parseTitle } from './lib/utils';
import type { TerminusImageData } from './lib/utils';
import { requestDOMPermit } from '@abcnews/env-utils';
import { getMountValue, isMount } from '@abcnews/mount-utils';
import { DEFAULT_IMAGE_RATIO } from './lib/constants';

type ExpandableCardsItemCollector = {
  cards: ExpandableCardsItem[];
  next?: ExpandableCardsItem;
};

const DECOY_KEY = 'cards';

let embeddedImageDataPromise: Promise<TerminusImageData>;

const parseDOM = async (el: HTMLElement, availableColours: ExpandableCardsColourMap, defaultImageRatio: string) => {
  const children = Array.from(el.children);

  return (
    await children.reduce<Promise<ExpandableCardsItemCollector>>(async (collectorPromise, child, idx, arr) => {
      const collector = await collectorPromise;

      // If this is a title
      if (isTitle(child)) {
        if (collector.next) {
          collector.cards.push(collector.next);
        }
        collector.next = { ...parseTitle(child.textContent || ''), image: null, detail: [] };
        return collector;
      }

      // If this is an image (and we're already collecting and there isn't already an image on this card)
      if (collector.next && !collector.next?.image && isImage(child)) {
        const uri = child.dataset.uri;
        const id = uri && uri.substr(uri.lastIndexOf('/') + 1);
        const img = child.querySelector('img');
        const alt = img?.getAttribute('alt');
        const url = img?.dataset.src || img?.getAttribute('src');
        if (typeof id !== 'undefined' && typeof alt === 'string' && typeof url === 'string') {
          const image: ExpandableCardsImage = { alt, url, renditions: [] };
          const embeddedImageData = await embeddedImageDataPromise;
          const availableRenditions = embeddedImageData[id].renditions;

          // If there are no renditions, just return what we've got.
          if (availableRenditions.length === 0) {
            collector.next.image = image;
            return collector;
          }

          // Try to find the requested ratio

          const ratios = [defaultImageRatio, DEFAULT_IMAGE_RATIO, availableRenditions[0].ratio];
          while (image.renditions.length === 0) {
            const ratio = ratios.shift();
            image.renditions = availableRenditions.filter(d => d.ratio === ratio);
          }
          collector.next.image = image;
          return collector;
        }
      }

      // Card config
      if (
        collector.next &&
        typeof collector.next.cardColour === 'undefined' &&
        typeof collector.next.shouldTintPhoto === 'undefined' &&
        isMount(child)
      ) {
        collector.next = { ...collector.next, ...getItemConfig(getMountValue(child), availableColours) };
        return collector;
      }

      // Otherwise, this is just content, so push it into the details.
      if (child instanceof HTMLElement) collector.next?.detail.push(child);

      // Add the final card
      if (idx === arr.length - 1 && collector.next) {
        collector.cards.push(collector.next);
        collector.next = undefined;
      }

      return collector;
    }, Promise.resolve({ cards: [] }))
  ).cards;
};

export const init = async () => {
  // Fire of a request for the embedded image data ASAP.
  const id = document.querySelector('meta[name=ContentId]')?.getAttribute('content');
  embeddedImageDataPromise = id ? getEmbeddedImageData(id) : Promise.resolve({});

  // TODO: is just trying to re-init an appropriate response to deactivation of a decoy?
  const instances = await requestDOMPermit(DECOY_KEY, init);
  instances !== true &&
    instances.forEach(async el => {
      el.dataset['used'] = 'true';
      const config = getConfig(el.dataset?.tag || '');
      const items = await parseDOM(el, config.availableColours, config.defaultImageRatio);
      el.textContent = null;
      render(<ExpandableCards {...config} items={items} />, el);
    });
};
