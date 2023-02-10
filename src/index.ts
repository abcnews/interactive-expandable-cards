import { proxy } from '@abcnews/dev-proxy';
import { getGeneration, GENERATIONS, whenDOMReady } from '@abcnews/env-utils';
import { init } from './pl';

if (getGeneration() === GENERATIONS.PL) {
  proxy('interactive-expandable-cards').then(init);
} else {
  const whenLegacyImported = import(/* webpackChunkName: "legacy" */ './legacy');

  Promise.all([whenLegacyImported, whenDOMReady]).then(([{ init }]) =>
    proxy('interactive-expandable-cards').then(init)
  );
}
