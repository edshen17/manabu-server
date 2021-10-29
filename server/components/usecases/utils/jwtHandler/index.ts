import jwt from 'jsonwebtoken';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { JwtHandler } from './jwtHandler';

const makeJwtHandler = new JwtHandler().init({ jwt, makeCacheDbService });

export { makeJwtHandler };
