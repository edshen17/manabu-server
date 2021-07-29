import faker from 'faker';
import { expect } from 'chai';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { CreateUserUsecase, CreateUserUsecaseResponse } from './createUserUsecase';
import { makeCreateUserUsecase } from '.';
import { QueryStringHandler } from '../../utils/queryStringHandler/queryStringHandler';
import { makeQueryStringHandler } from '../../utils/queryStringHandler';

let controllerDataBuilder: ControllerDataBuilder;
let createUserUsecase: CreateUserUsecase;
let queryStringHandler: QueryStringHandler;
let routeData: RouteData;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createUserUsecase = await makeCreateUserUsecase;
  queryStringHandler = makeQueryStringHandler;
});

beforeEach(() => {
  routeData = {
    params: {},
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: `${faker.internet.password()}A1!`,
    },
    query: {
      state: {
        isTeacherApp: true,
      },
    },
  };
});

describe('createUserUsecase', () => {
  describe('makeRequest', () => {
    const getUser = async () => {
      const controllerData = controllerDataBuilder.routeData(routeData).build();
      const createUserRes = await createUserUsecase.makeRequest(controllerData);
      return createUserRes;
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          const routeDataBody = routeData.body;
          routeDataBody._id = 'some id';
          routeDataBody.role = 'admin';
          routeDataBody.dateRegistered = new Date();
          routeDataBody.verificationToken = 'new token';

          try {
            await getUser();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw if no inputs are provided', async () => {
          try {
            await getUser();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        const validResOutput = (createUserRes: CreateUserUsecaseResponse) => {
          expect(createUserRes).to.have.property('user');
          expect(createUserRes.user).to.not.equal(null);
          expect(createUserRes).to.have.property('redirectUrl');
          expect(createUserRes.redirectUrl).to.not.equal(null);
          expect(createUserRes).to.have.property('cookies');
          expect(createUserRes.cookies).to.not.equal(null);
        };
        it('should return a new user, auth cookies, and a redirect url', async () => {
          const createUserRes = await getUser();
          validResOutput(createUserRes);
        });
        it('should return a joined user, auth cookies, and a redirect url', async () => {
          const createUserRes = await getUser();
          const savedDbUser = createUserRes.user;
          expect(savedDbUser).to.have.property('settings');
          expect(savedDbUser).to.not.have.property('password');
          expect(savedDbUser.teacherData).to.have.property('licensePathUrl');
        });
      });
    });
  });
});
