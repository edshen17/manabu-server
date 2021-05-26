import express, { Request, Response, NextFunction } from 'express';
//@ts-ignore
import makeExpressCallback from '../../components/express-callback/index';
//@ts-ignore
import userControllerMain from '../../components/controllers/user/index';
const router = express.Router();

// Making a user in the db
// router.post('/register', makeExpressCallback(userControllerMain.postUserController));
router.get('/test', (req, res, next) => { return res.json('hi') })

module.exports = router;