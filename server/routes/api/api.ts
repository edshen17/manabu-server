import express, { Request, Response, NextFunction } from 'express';
import { makeExpressCallback } from '../../components/expressCallback/index';
// import userControllerMain from '../../components/controllers/user/index';
const router = express.Router();
// const VerifyToken = require('../../components/VerifyToken'); // TODO: turn into ts + import statement
router.get('/user/:uId', (req, res, next) => {
  return res.json('hi');
});
// Making a user in the db
// router.post('/register', makeExpressCallback());

module.exports = router;
