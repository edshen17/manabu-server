import { expect } from 'chai';
import { makeGetPackageTransactionsController } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { GetPackageTransactionsUsecaseResponse } from '../../../usecases/packageTransaction/getPackageTransactionsUsecase/getPackageTransactionsUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetPackageTransactionsController } from './getPackageTransactionsController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getPackageTransactionsController: GetPackageTransactionsController;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;
let path: string;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getPackageTransactionsController = await makeGetPackageTransactionsController;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  params = {};
  body = {};
  currentAPIUser = {
    role: fakePackageTransaction.hostedByData.role,
    userId: fakePackageTransaction.hostedById,
  };
  path = '';
});

describe('getPackageTransactionsController', () => {
  describe('makeRequest', () => {
    const getPackageTransactions = async (): Promise<
      ControllerResponse<GetPackageTransactionsUsecaseResponse>
    > => {
      const getPackageTransactionsHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .path(path)
        .build();
      const getPackageTransactionsRes = await getPackageTransactionsController.makeRequest(
        getPackageTransactionsHttpRequest
      );
      return getPackageTransactionsRes;
    };
    const testValidGetPackageTransactions = async (): Promise<void> => {
      const getPackageTransactionsRes = await getPackageTransactions();
      expect(getPackageTransactionsRes.statusCode).to.equal(200);
      expect(getPackageTransactionsRes.body).to.have.property('packageTransactions');
    };
    const testInvalidGetPackageTransactions = async (): Promise<void> => {
      const getPackageTransactionsRes = await getPackageTransactions();
      expect(getPackageTransactionsRes.statusCode).to.equal(404);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('viewing self', () => {
          it('should get the packageTransactions for the user', async () => {
            params = {};
            path = '/self';
            await testValidGetPackageTransactions();
          });
        });
        context('viewing other', () => {
          it('should throw an error if not package transaction owner', async () => {
            currentAPIUser.userId = undefined;
            await testInvalidGetPackageTransactions();
          });
        });
      });
      context('as an admin', () => {
        it('should get the packageTransactions', async () => {
          currentAPIUser.role = 'admin';
          await testValidGetPackageTransactions();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {
          packageTransactionId: 'some id',
        };
        await testInvalidGetPackageTransactions();
      });
    });
  });
});
