import { expect } from 'chai';
import { makeGetPackageTransactionUsecase } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetPackageTransactionUsecase } from './getPackageTransactionUsecase';

let getPackageTransactionUsecase: GetPackageTransactionUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;

before(async () => {
  getPackageTransactionUsecase = await makeGetPackageTransactionUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  routeData = {
    headers: {},
    params: {
      packageTransactionId: fakePackageTransaction._id,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: fakePackageTransaction.reservedById,
    role: 'user',
  };
});

describe('getPackageTransactionUsecase', () => {
  describe('makeRequest', () => {
    const getPackageTransaction = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getPackageTransactionRes = await getPackageTransactionUsecase.makeRequest(
        controllerData
      );
      const packageTransaction = getPackageTransactionRes.packageTransaction;
      return packageTransaction;
    };

    const testPackageTransaction = async () => {
      const packageTransactions = await getPackageTransaction();
      expect(packageTransactions._id).to.deep.equal(fakePackageTransaction._id);
    };

    const testPackageTransactionError = async () => {
      let err;
      try {
        err = await getPackageTransaction();
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
              await testPackageTransactionError();
            });
          });
        });
      });
    });
  });
});
