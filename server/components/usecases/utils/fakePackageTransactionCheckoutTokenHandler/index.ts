import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { makeControllerDataBuilder } from '../controllerDataBuilder';
import { FakePackageTransactionCheckoutTokenHandler } from './fakePackageTransactionCheckoutTokenHandler';

const makeFakePackageTransactionCheckoutTokenHandler =
  new FakePackageTransactionCheckoutTokenHandler().init({
    makeFakeDbUserFactory,
    makeControllerDataBuilder,
    makeCreatePackageTransactionCheckoutUsecase,
  });

export { makeFakePackageTransactionCheckoutTokenHandler };
