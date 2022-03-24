import { makeContentEntityValidator } from '../../validators/content/entity';
import { makeNGramHandler } from '../utils/nGramHandler';
import { ContentEntity } from './contentEntity';

const makeContentEntity = new ContentEntity().init({
  makeEntityValidator: makeContentEntityValidator,
  makeNGramHandler,
});

export { makeContentEntity };
