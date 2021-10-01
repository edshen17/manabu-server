import { expect } from 'chai';
import { makeGetPackageTransactionsUsecase } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetPackageTransactionsUsecase } from './getPackageTransactionsUsecase';

let getPackageTransactionsUsecase: GetPackageTransactionsUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;

before(async () => {
  getPackageTransactionsUsecase = await makeGetPackageTransactionsUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  routeData = {
    params: {},
    body: {},
    query: {},
    endpointPath: '/self',
  };
  currentAPIUser = {
    userId: fakePackageTransaction.reservedById,
    role: 'user',
  };
});

describe('getPackageTransactionsUsecase', () => {
  describe('makeRequest', () => {
    const getPackageTransactions = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getPackageTransactionsRes = await getPackageTransactionsUsecase.makeRequest(
        controllerData
      );
      const packageTransactions = getPackageTransactionsRes.packageTransactions;
      return packageTransactions;
    };

    const testPackageTransaction = async () => {
      const packageTransactions = await getPackageTransactions();
      expect(packageTransactions.length > 0).to.equal(true);
    };

    const testPackageTransactionError = async () => {
      let err;
      try {
        err = await getPackageTransactions();
      } catch (err) {
        return;
      }
      expect(err).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid id is given', async () => {
          routeData.params = {
            hostedById: fakePackageTransaction.hostedById,
          };
          await testPackageTransactionError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it("should get the user's packageTransactions", async () => {
              await testPackageTransaction();
            });
          });
          context('viewing other (as hostedBy)', () => {
            it("should get the user's packageTransactions", async () => {
              currentAPIUser.userId = fakePackageTransaction.hostedById;
              await testPackageTransaction();
            });
          });
          context('as an unlogged-in user', async () => {
            it('should throw an error', async () => {
              currentAPIUser.userId = undefined;
              routeData.endpointPath = '';
              await testPackageTransactionError();
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it("should get the user's packageTransactions", async () => {
              currentAPIUser.userId = undefined;
              currentAPIUser.role = 'admin';
              routeData.params = {
                userId: fakePackageTransaction.hostedById,
              };
              await testPackageTransaction();
            });
          });
        });
      });
    });
  });
});
