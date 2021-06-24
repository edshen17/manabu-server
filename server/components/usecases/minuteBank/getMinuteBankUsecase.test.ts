import chai from 'chai';
import { ControllerData } from '../abstractions/IUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
import { GetUserUsecaseResponse } from '../user/getUserUsecase/getUserUsecase';
import { initializeMinuteBank } from '../testFixtures/initializeMinuteBank';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';
import { makeGetMinuteBankUsecase } from '.';
const expect = chai.expect;
let controllerData: ControllerData;
let initUserParams: any;
let newTeacherUser: GetUserUsecaseResponse;
let getMinuteBankUsecase: GetMinuteBankUsecase;
beforeEach(async () => {
  initUserParams = await initializeUsecaseSettings();
  initUserParams.isTeacherApp = true;
  controllerData = initUserParams.controllerData;
  newTeacherUser = await initializeUser(initUserParams);
  getMinuteBankUsecase = await makeGetMinuteBankUsecase;
});

context('getMinuteBankUsecase', () => {
  describe('makeRequest', () => {
    it('should return a minuteBank given a valid inputs', async () => {
      if ('user' in newTeacherUser!) {
        const newMinuteBank = await initializeMinuteBank(
          newTeacherUser.user._id,
          newTeacherUser.user._id
        );
        controllerData.endpointPath = '/self/minuteBanks';
        const minuteBankRes = await getMinuteBankUsecase.makeRequest(controllerData);
        if ('minuteBanks' in minuteBankRes) {
          expect(minuteBankRes).to.have.property('minuteBanks');
          expect(minuteBankRes.minuteBanks).to.be.an('array');
          expect(minuteBankRes.minuteBanks.length > 0).to.equal(true);
        }
      }
    });
  });
});
