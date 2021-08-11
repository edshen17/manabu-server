import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { EmailHandler } from './emailHandler';

const makeEmailHandler = new EmailHandler().init({ nodemailer, fs, handlebars });

export { makeEmailHandler };
