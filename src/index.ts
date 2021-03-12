import { getGeneration, GENERATIONS } from '@abcnews/env-utils';
import { init as legacy } from './legacy';
import { init } from './pl';

if (getGeneration() === GENERATIONS.PL) init();
else legacy();
