import { proxy } from '@abcnews/dev-proxy';
import { init } from './pl';

proxy('interactive-expandable-cards').then(init);
