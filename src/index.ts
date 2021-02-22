import { getGeneration, GENERATIONS } from '@abcnews/env-utils';
import { init as legacy } from './legacy';
import { init } from './pl';

const generation = getGeneration();
if (generation === GENERATIONS.P1 || generation === GENERATIONS.P2) {
  legacy();
} else {
  init();
}
