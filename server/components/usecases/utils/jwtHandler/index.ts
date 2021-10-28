import jwt from 'jsonwebtoken';
import { JwtHandler } from './jwtHandler';

const makeJwtHandler = new JwtHandler().init({ jwt });

export { makeJwtHandler };
