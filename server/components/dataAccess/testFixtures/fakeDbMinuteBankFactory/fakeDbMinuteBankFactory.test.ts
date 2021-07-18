// import { expect } from 'chai';
// import { makeFakeDbMinuteBankFactory } from '.';
// import { makeMinuteBankDbService } from '../../services/minuteBank';
// import { MinuteBankDbService } from '../../services/minuteBank/minuteBankDbService';
// import { FakeDbMinuteBankFactory } from './fakeDbMinuteBankFactory';
// import { makeUserDbService } from '../../services/user';
// import { UserDbService } from '../../services/user/userDbService';
// import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
// import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

// let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
// let fakeDbUserFactory: FakeDbUserFactory;
// let minuteBankDbService: MinuteBankDbService;
// let userDbService: UserDbService;

// before(async () => {
//   fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
//   fakeDbUserFactory = await makeFakeDbUserFactory;
//   minuteBankDbService = await makeMinuteBankDbService;
//   userDbService = await makeUserDbService;
// });

// describe('fakeDbMinuteBankFactory', () => {
//   describe('createFakeDbData', () => {
//     it('should create a fake db minuteBank with data about the given users', async () => {
//       const fakeUser = await fakeDbUserFactory.createFakeDbUser();
//       const fakeDbMinutebank = await fakeDbMinuteBankFactory.createFakeDbData({
//         hostedById: fakeUser._id.toString(),
//         reservedById: fakeUser._id.toString(),
//       });
//       expect(fakeDbMinutebank).to.have.property('hostedById');
//       expect(fakeDbMinutebank.hostedByData).to.deep.equal(fakeUser);
//       expect(fakeDbMinutebank.reservedByData).to.deep.equal(fakeUser);
//     });
//     it('should create a fake db minuteBank with random users if not given a hostedById or reservedById', async () => {
//       const fakeDbMinutebank = await fakeDbMinuteBankFactory.createFakeDbData();
//       expect(fakeDbMinutebank).to.have.property('hostedById');
//       expect(fakeDbMinutebank.hostedByData).to.not.equal(undefined);
//       expect(fakeDbMinutebank).to.have.property('reservedById');
//       expect(fakeDbMinutebank.reservedByData).to.not.equal(undefined);
//     });
//   });
// });
