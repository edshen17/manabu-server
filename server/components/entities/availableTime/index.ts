import { AvailableTimeEntity } from './availableTimeEntity';
import { makeAvailableTimeEntityValidator } from '../../validators/availableTime/entity';

const makeAvailableTimeEntity = new AvailableTimeEntity().init({
  makeEntityValidator: makeAvailableTimeEntityValidator,
});

export { makeAvailableTimeEntity };
