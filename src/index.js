const {getGeneration, GENERATIONS} = require('@abcnews/env-utils');
const legacy = require('./legacy');
const init = require('./init');

const generation = getGeneration();
if (generation === GENERATIONS.P1 || generation === GENERATIONS.P2) {
  legacy();
} else {
  init();
}
