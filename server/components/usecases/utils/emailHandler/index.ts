import fs from 'fs';
import nodemailer from 'nodemailer';
import vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import mjml from 'mjml';
import { EmailHandler } from './emailHandler';
import { makeUserDbService } from '../../../dataAccess/services/user';

const makeEmailHandler = new EmailHandler().init({
  nodemailer,
  fs,
  makeUserDbService,
  vue,
  createRenderer,
  mjml,
});

export { makeEmailHandler };
