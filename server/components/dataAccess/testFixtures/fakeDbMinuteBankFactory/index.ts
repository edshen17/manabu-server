import cloneDeep from 'clone-deep';
import { makeMinuteBankEntity } from '../../../entities/minuteBank';
import { makeMinuteBankDbService } from '../../services/minuteBank';
import { FakeDbMinuteBankFactory } from './fakeDbMinuteBankFactory';

const makeFakeDbMinuteBankFactory = new FakeDbMinuteBankFactory().init({
  makeEntity: makeMinuteBankEntity,
  makeDbService: makeMinuteBankDbService,
  cloneDeep,
});

export { makeFakeDbMinuteBankFactory };
