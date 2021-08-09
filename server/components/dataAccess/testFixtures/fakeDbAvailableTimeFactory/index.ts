import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import { makeAvailableTimeEntity } from '../../../entities/availableTime';
import { makeAvailableTimeDbService } from '../../services/availableTime';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbAvailableTimeFactory } from './fakeDbAvailableTimeFactory';

const makeFakeDbAvailableTimeFactory = new FakeDbAvailableTimeFactory().init({
  makeEntity: makeAvailableTimeEntity,
  cloneDeep,
  makeDbService: makeAvailableTimeDbService,
  makeFakeDbUserFactory,
  dayjs,
});

export { makeFakeDbAvailableTimeFactory };
