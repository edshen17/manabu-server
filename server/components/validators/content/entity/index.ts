import { joi } from '../../../entities/utils/joi';
import { ContentEntityValidator } from './contentEntityValidator';

const makeContentEntityValidator = new ContentEntityValidator().init({ joi });

export { makeContentEntityValidator };
