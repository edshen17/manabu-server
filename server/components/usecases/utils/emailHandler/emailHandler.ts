import { ObjectId } from 'mongoose';
import {
  IS_PRODUCTION,
  MANABU_EMAIL_NOREPLY_PASS,
  MANABU_EMAIL_SUPPORT_PASS,
} from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';

enum EMAIL_SENDER_NAME {
  SUPPORT = 'SUPPORT',
  NOREPLY = 'NOREPLY',
}

type RequiredSendEmailParams = {
  sendFrom: string;
  subjectLine: string;
  mjmlFileName: string;
  data: StringKeyObject;
};

class EmailHandler {
  private _NODE_MAILER_OPTIONS = Object.freeze({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
  });
  private _MAIL_AUTH: { [key: string]: any } = {
    SUPPORT: {
      emailName: 'manabu.sg <support@manabu.sg>',
      user: 'support@manabu.sg',
      pass: MANABU_EMAIL_SUPPORT_PASS,
    },
    NOREPLY: {
      emailName: 'manabu.sg <no-reply@manabu.sg>',
      user: 'no-reply@manabu.sg',
      pass: MANABU_EMAIL_NOREPLY_PASS,
    },
  };
  private _nodemailer!: any;
  private _fs!: any;
  private _userDbService!: UserDbService;
  private _vue!: any;
  private _createRenderer!: any;
  private _mjml!: any;

  public sendAlertEmailFromUserId = async (
    props: { userId: ObjectId; emailAlertName: string } & RequiredSendEmailParams
  ): Promise<void> => {
    const { userId, emailAlertName, sendFrom, subjectLine, mjmlFileName, data } = props;
    const dbServiceAccessOptions = this._userDbService.getOverrideDbServiceAccessOptions();
    const user = await this._userDbService.findById({
      _id: userId,
      dbServiceAccessOptions,
    });
    const userEmailAlertSettings: StringKeyObject = user.settings.emailAlerts;
    const teacherEmailAlertSettings: StringKeyObject = user.teacherData
      ? user.teacherData.settings.emailAlerts
      : {};
    if (userEmailAlertSettings[emailAlertName] || teacherEmailAlertSettings[emailAlertName]) {
      this.sendEmail({
        recipientEmails: user.email,
        data: { name: user.name, ...data },
        sendFrom,
        subjectLine,
        mjmlFileName,
      });
    }
  };

  public sendEmail = async (props: {
    recipientEmails: string | string[];
    sendFrom: string;
    subjectLine: string;
    mjmlFileName: string;
    data: StringKeyObject;
  }): Promise<void> => {
    const { recipientEmails, sendFrom, subjectLine, mjmlFileName, data } = props;
    if (IS_PRODUCTION) {
      const nodeMailerOptions: any = {
        ...this._NODE_MAILER_OPTIONS,
      };
      nodeMailerOptions.auth = this._MAIL_AUTH[sendFrom];
      const transporter = this._nodemailer.createTransport(nodeMailerOptions);
      const html = await this._createHtmlToRender({ mjmlFileName, data });
      const mailOptions = {
        from: this._MAIL_AUTH[sendFrom]['emailName'],
        to: recipientEmails,
        subject: subjectLine,
        html,
      };
      transporter.sendMail(mailOptions);
    }
  };

  private _createHtmlToRender = async (props: {
    mjmlFileName: string;
    data: StringKeyObject;
  }): Promise<string> => {
    const { mjmlFileName, data } = props;
    const dirname = __dirname.replace(/\\/g, '/');
    const template = this._readMJMLFile(`${dirname}/templates/${mjmlFileName}`);
    const app = new this._vue({
      data: { ...data, dirname },
      template,
    });
    const renderer = await this._createRenderer().renderToString(app);
    const html = this._mjml(renderer).html;
    return html;
  };

  private _readMJMLFile = (fileName: string) => {
    const data = this._fs.readFileSync(`${fileName}.mjml`, 'utf8');
    return data;
  };

  public init = async (props: {
    nodemailer: any;
    fs: any;
    makeUserDbService: Promise<UserDbService>;
    vue: any;
    createRenderer: any;
    mjml: any;
  }): Promise<this> => {
    const { nodemailer, fs, makeUserDbService, vue, createRenderer, mjml } = props;
    this._nodemailer = nodemailer;
    this._fs = fs;
    this._userDbService = await makeUserDbService;
    this._vue = vue;
    this._createRenderer = await createRenderer;
    this._mjml = mjml;
    return this;
  };
}

export { EmailHandler, EMAIL_SENDER_NAME };
