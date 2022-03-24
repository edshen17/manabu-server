import { joi } from '../../../entities/utils/joi';
import { ContentParamsValidator } from './contentParamsValidator';

const makeContentParamsValidator = new ContentParamsValidator().init({ joi });

export { makeContentParamsValidator };
