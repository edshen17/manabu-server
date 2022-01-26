import { expect } from 'chai';
import { makeGraphDbService } from '.';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { GraphDbService } from './graphDbService';

let graphDbService: GraphDbService;
const dbServiceAccessOptions: DbServiceAccessOptions = {
  isCurrentAPIUserPermitted: true,
  currentAPIUserRole: 'user',
  isSelf: true,
};

before(async () => {
  graphDbService = await makeGraphDbService;
  await graphDbService.graphQuery({
    query: "CREATE (:person{name:'roi',age:32})",
    dbServiceAccessOptions,
  });
  await graphDbService.graphQuery({
    query: "CREATE (:person{name:'amit',age:30})",
    dbServiceAccessOptions,
  });
  await graphDbService.graphQuery({
    query:
      "MATCH (a:person), (b:person) WHERE (a.name = 'roi' AND b.name='amit') CREATE (a)-[:knows]->(b)",
    dbServiceAccessOptions,
  });
});

describe('graphDbService', () => {
  describe('graphQuery', () => {
    it('should make a graph query', async () => {
      const res = await graphDbService.graphQuery({
        query: 'MATCH (a:person)-[:knows]->(:person) RETURN a.name',
        dbServiceAccessOptions,
      });
      while (res.hasNext()) {
        const record = res.next();
        expect(record.get('a.name')).to.equal('roi');
      }
    });
  });
  describe('isConnected', () => {
    it('should return a boolean that signifies if a relationship exists', async () => {
      const isConnected = await graphDbService.isConnected({
        node1: ":person{name:'roi',age:32}",
        node2: ":person{name:'amit',age:30}",
        relationship: ':knows',
        dbServiceAccessOptions,
      });
      expect(isConnected).to.equal(true);
    });
  });
});
