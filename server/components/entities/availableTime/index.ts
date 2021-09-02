import { makeAvailableTimeEntityValidator } from '../../validators/availableTime/entity';
import { AvailableTimeEntity } from './availableTimeEntity';

const makeAvailableTimeEntity = new AvailableTimeEntity().init({
  makeEntityValidator: makeAvailableTimeEntityValidator,
});

export { makeAvailableTimeEntity };
