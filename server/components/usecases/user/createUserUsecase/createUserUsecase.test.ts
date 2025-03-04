import { expect } from 'chai';
import faker from 'faker';
import { makeCreateUserUsecase } from '.';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { CreateUserUsecase, CreateUserUsecaseResponse } from './createUserUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let createUserUsecase: CreateUserUsecase;
let routeData: RouteData;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createUserUsecase = await makeCreateUserUsecase;
});

beforeEach(() => {
  routeData = {
    rawBody: {},
    headers: {},
    params: {},
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
    query: {
      state: {
        isTeacherApp: true,
      },
    },
    endpointPath: '',
    cookies: {},
    req: {},
  };
});

describe('createUserUsecase', () => {
  describe('makeRequest', () => {
    const createUser = async () => {
      const controllerData = controllerDataBuilder.routeData(routeData).build();
      const createUserRes = await createUserUsecase.makeRequest(controllerData);
      return createUserRes;
    };

    const testUserError = async () => {
      let error;
      try {
        await createUser();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          const routeDataBody = routeData.body;
          routeDataBody._id = 'some id';
          routeDataBody.role = 'admin';
          routeDataBody.dateRegistered = new Date();
          routeDataBody.verificationToken = 'new token';
          await testUserError();
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
          const createUserRes = await createUser();
          validResOutput(createUserRes);
        });
        it('should return a joined user, auth cookies, and a redirect url', async () => {
          const createUserRes = await createUser();
          const savedDbUser = createUserRes.user;
          expect(savedDbUser).to.have.property('settings');
          expect(savedDbUser).to.not.have.property('password');
          expect(savedDbUser.teacherData).to.have.property('licenseUrl');
        });
      });
    });
  });
});
