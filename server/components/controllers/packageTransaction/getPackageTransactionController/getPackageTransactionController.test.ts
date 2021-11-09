import { expect } from 'chai';
import { makeGetPackageTransactionController } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { GetPackageTransactionUsecaseResponse } from '../../../usecases/packageTransaction/getPackageTransactionUsecase/getPackageTransactionUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetPackageTransactionController } from './getPackageTransactionController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getPackageTransactionController: GetPackageTransactionController;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getPackageTransactionController = await makeGetPackageTransactionController;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});

beforeEach(async () => {
  params = {
    packageTransactionId: fakePackageTransaction._id,
  };
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: fakePackageTransaction.reservedById,
  };
});

describe('getPackageTransactionController', () => {
  describe('makeRequest', () => {
    const getPackageTransaction = async (): Promise<
      ControllerResponse<GetPackageTransactionUsecaseResponse>
    > => {
      const getPackageTransactionHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const getPackageTransactionRes = await getPackageTransactionController.makeRequest(
        getPackageTransactionHttpRequest
      );
      return getPackageTransactionRes;
    };
    const testValidGetPackageTransaction = async (): Promise<void> => {
      const getPackageTransactionRes = await getPackageTransaction();
      expect(getPackageTransactionRes.statusCode).to.equal(200);
      if ('packageTransaction' in getPackageTransactionRes.body) {
        expect(getPackageTransactionRes.body.packageTransaction._id).to.deep.equal(
          fakePackageTransaction._id
        );
      }
    };
    const testInvalidGetPackageTransaction = async (): Promise<void> => {
      const getPackageTransactionRes = await getPackageTransaction();
      expect(getPackageTransactionRes.statusCode).to.equal(404);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('viewing self', () => {
          it('should get the packageTransaction for the user (reservedBy)', async () => {
            await testValidGetPackageTransaction();
          });
        });
        context('viewing other', () => {
          it('should throw an error', async () => {
            currentAPIUser.userId = undefined;
            await testInvalidGetPackageTransaction();
          });
        });
      });
      context('as an admin', () => {
        it('should get the packageTransaction', async () => {
          currentAPIUser.role = 'admin';
          await testValidGetPackageTransaction();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {
          packageTransactionId: 'some id',
        };
        await testInvalidGetPackageTransaction();
      });
    });
  });
});
