import fs from 'fs';
import mjml from 'mjml';
import { join } from 'path';
import vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { convertToTitlecase } from '../convertToTitlecase';
import { EmailHandler } from './emailHandler';
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const makeEmailHandler = new EmailHandler().init({
  fs,
  makeUserDbService,
  vue,
  createRenderer,
  mjml,
  join,
  sendgrid,
  convertToTitlecase,
});

export { makeEmailHandler };
