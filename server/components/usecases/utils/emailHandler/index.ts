// import fs from 'fs';
// import mjml from 'mjml';
// import nodemailer from 'nodemailer';
// import vue from 'vue';
// import { createRenderer } from 'vue-server-renderer';
// import { makeUserDbService } from '../../../dataAccess/services/user';
// import { EmailHandler } from './emailHandler';
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const makeEmailHandler = new EmailHandler().init({
//   makeUserDbService,
//   sendgrid,
// });

// export { makeEmailHandler };

import fs from 'fs';
import mjml from 'mjml';
import nodemailer from 'nodemailer';
import vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { EmailHandler } from './emailHandler';

const makeEmailHandler = new EmailHandler().init({
  nodemailer,
  fs,
  makeUserDbService,
  vue,
  createRenderer,
  mjml,
});

export { makeEmailHandler };
