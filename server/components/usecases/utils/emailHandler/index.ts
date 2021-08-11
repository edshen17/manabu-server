import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { EmailHandler } from './emailHandler';
import { makeUserDbService } from '../../../dataAccess/services/user';

const makeEmailHandler = new EmailHandler().init({
  nodemailer,
  fs,
  handlebars,
  makeUserDbService,
});

export { makeEmailHandler };
