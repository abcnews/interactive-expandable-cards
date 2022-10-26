import { getGeneration, GENERATIONS, whenDOMReady } from '@abcnews/env-utils';
import { init } from './pl';

if (getGeneration() === GENERATIONS.PL) {
  init();
} else {
  const whenLegacyImported = import(/* webpackChunkName: "legacy" */ './legacy');

  Promise.all([whenLegacyImported, whenDOMReady]).then(([{ init }]) => init());
}
