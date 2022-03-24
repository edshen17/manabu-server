// import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
// import { makeGraphDbService } from '../../../dataAccess/services/graph';
// import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
// import { makeFakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory';
// import { FakeDbContentFactory } from '../../../dataAccess/testFixtures/fakeDbContentFactory/fakeDbContentFactory';

// let fakeDbContentFactory: FakeDbContentFactory;
// let graphDbService: GraphDbService;
// const dbServiceAccessOptions: DbServiceAccessOptions = {
//   isCurrentAPIUserPermitted: true,
//   currentAPIUserRole: 'user',
//   isSelf: true,
// };

// before(async () => {
//   fakeDbContentFactory = await makeFakeDbContentFactory;
//   graphDbService = await makeGraphDbService;
// });

// describe('contentTokenHandler', () => {
//   it('should run', async () => {
//     const content = await fakeDbContentFactory.createFakeDbData();
//     const { tokens } = content;
//     console.log(tokens);
//     // await graphDbService.graphQuery({
//     //   query: "CREATE (:person{name:'roi',age:32})",
//     //   dbServiceAccessOptions,
//     // });
//   });
// });
