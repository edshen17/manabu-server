import chai from 'chai';
import { userDbService } from '../index';
import { UserDbService } from './usersDb';

const expect = chai.expect;
let userService: UserDbService;

before(async () => {
  userService = await userDbService;
});

describe('userDb service', () => {
  describe('findById', () => {
    it('given a bad user id as input, should throw an error', async () => {
      // try {
      //   await userService.findById({
      //     id: 'undefined',
      //     accessOptions: { isProtectedResource: false, isCurrentAPIUserPermitted: true },
      //   });
      // } catch (err) {
      //   expect(err).be.an('error');
      //   expect(err.message).to.be('hi');
      // }
      const t = await userService.findById({
        id: 'asdsadasdasdasdasddddddddddddd',
        accessOptions: { isProtectedResource: false, isCurrentAPIUserPermitted: true },
      });
      console.log(t);
    });

    // it('given a non-existent user id as input, should throw an error', async () => {
    //   try {
    //     await userService.findById('60979db0bb31ed001589a1ea', {});
    //   } catch (err) {
    //     console.log(err);
    //     expect(err).be.an('error');
    //   }
    // });

    // it('given an existing user id (teacher) as input, should return a joined version with user, teacher, and packages', async () => {
    //   try {
    //     await userService.findById('60979db0bb31ed001589a1ea', {});
    //   } catch (err) {
    //     expect(err).be.an('error');
    //   }
    // });

    it('given an existing user id (user) as input, should return a joined version with user, teacher, and packages', async () => {
      try {
        const modelToInsert = { name: 'test', email: 'test', password: 'pass' };
        const newUser = await userService.insert({
          modelToInsert,
          accessOptions: { isProtectedResource: false, isCurrentAPIUserPermitted: true },
        });
        console.log(newUser);
      } catch (err) {
        throw err;
      }
    });
  });
  // describe('findOne', () => {
  //   it('should return a user with the search properties', async () => {
  //     try {
  //       const user = await userService.findOne(
  //         { email: 'some-email@nonexist.com' },
  //         {},
  //         { isProtectedResource: false }
  //       );
  //     } catch (err) {
  //       throw err;
  //     }
  //   });
  // });
});
