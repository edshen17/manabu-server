import { makeFakeDbUserFactory } from '../server/components/dataAccess/testFixtures/fakeDbUserFactory';

describe('test', () => {
  it('should work', async () => {
    const t = await makeFakeDbUserFactory;
    const z = await t.createFakeDbUser();
    // console.log(z);
  });
});
