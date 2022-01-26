import { Graph } from 'redisgraph.js';
import { redisClient } from '../cache';
import { GraphDbService } from './graphDbService';

const redisGraph = new Graph('social-network', redisClient);

const makeGraphDbService = new GraphDbService().init({ redisGraph });

export { makeGraphDbService };
