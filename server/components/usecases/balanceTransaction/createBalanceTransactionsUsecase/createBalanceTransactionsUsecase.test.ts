import { expect } from 'chai';
import { makeBalanceTransactionsUsecase } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import {
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { CreateBalanceTransactionsUsecase } from './createBalanceTransactionsUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let routeData: RouteData;
let fakePackageTransaction: PackageTransactionDoc;
let currentAPIUser: CurrentAPIUser;
let createBalanceTransactionsUsecase: CreateBalanceTransactionsUsecase;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createBalanceTransactionsUsecase = await makeBalanceTransactionsUsecase;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  currentAPIUser = {
    userId: fakePackageTransaction.hostedById,
    role: 'user',
  };
  routeData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {
      balanceTransactions: [
        {
          userId: fakePackageTransaction.hostedById,
          status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
          currency: 'SGD',
          type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
          packageTransactionId: fakePackageTransaction._id,
          balanceChange: 100,
          processingFee: 5,
          tax: 0.2,
          runningBalance: {
            currency: 'SGD',
            totalAvailable: 0,
          },
          paymentData: {
            gateway: 'paypal',
            id: 'some id',
          },
        },
      ],
    },
    query: {},
    endpointPath: '',
  };
});

describe('createBalanceTransactionsUsecase', () => {
  describe('makeRequest', () => {
    const createBalanceTransactions = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createBalanceTransactionsRes = await createBalanceTransactionsUsecase.makeRequest(
        controllerData
      );
      return createBalanceTransactionsRes;
    };
    const testBalanceTransactionsError = async () => {
      let error;
      try {
        error = await createBalanceTransactions();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if invalid data is passed', async () => {
          routeData.body.balanceTransactions[0].paymentData.gateway = 'bad gateway';
          await testBalanceTransactionsError();
        });
        it('should throw an error if body contains an invalid userId', async () => {
          routeData.body.balanceTransactions[0].userId = 'bad id';
          await testBalanceTransactionsError();
        });
        it('should throw an error if user not logged in', async () => {
          currentAPIUser.userId = undefined;
          await testBalanceTransactionsError();
        });
        it('should throw an error if at least one balance transaction is invalid', async () => {
          routeData.body.balanceTransactions.push({});
          await testBalanceTransactionsError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = async () => {
          const createBalanceTransactionsRes = await createBalanceTransactions();
          expect(createBalanceTransactionsRes).to.have.property('balanceTransactions');
        };
        it('should get return a valid balance transaction', async () => {
          await validResOutput();
        });
      });
    });
  });
});
