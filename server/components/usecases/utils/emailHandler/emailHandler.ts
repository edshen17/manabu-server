import { ObjectId } from 'mongoose';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';

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
  private _MAIL_SEND_FROM_OPTIONS: { [key: string]: any } = {
    SUPPORT: {
      emailName: 'manabu.sg <support@manabu.sg>',
      user: 'support@manabu.sg',
      pass: process.env.MANABU_EMAIL_SUPPORT_PASS!,
    },
    NOREPLY: {
      emailName: 'manabu.sg <no-reply@manabu.sg>',
      user: 'no-reply@manabu.sg',
      pass: process.env.MANABU_EMAIL_NOREPLY_PASS!,
    },
  };
  private _nodemailer!: any;
  private _fs!: any;
  private _userDbService!: UserDbService;
  private _vue!: any;
  private _createRenderer!: any;
  private _mjml!: any;

  public sendAlertEmailFromUserId = async (
    props: { userId: ObjectId; alertSettingName: string } & RequiredSendEmailParams
  ): Promise<void> => {
    const { userId, alertSettingName, sendFrom, subjectLine, mjmlFileName, data } = props;
    const dbServiceAccessOptions = this._userDbService.getOverrideDbServiceAccessOptions();
    const user = await this._userDbService.findById({
      _id: userId,
      dbServiceAccessOptions,
    });
    const userEmailAlertSettings: StringKeyObject = user.settings.emailAlerts;
    const teacherEmailAlertSettings: StringKeyObject = user.teacherData
      ? user.teacherData.settings.emailAlerts
      : {};
    if (userEmailAlertSettings[alertSettingName] || teacherEmailAlertSettings[alertSettingName]) {
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
  }) => {
    const { recipientEmails, sendFrom, subjectLine, mjmlFileName, data } = props;
    const isProduction = process.env.NODE_ENV == 'production';
    if (isProduction) {
      const nodeMailerOptions: any = {
        ...this._NODE_MAILER_OPTIONS,
      };
      nodeMailerOptions.auth = this._MAIL_SEND_FROM_OPTIONS[sendFrom];
      const transporter = this._nodemailer.createTransport(nodeMailerOptions);
      const html = await this._createHtmlToRender({ mjmlFileName, data });
      const mailOptions = {
        from: this._MAIL_SEND_FROM_OPTIONS[sendFrom]['emailName'],
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
    const template = this._readMJMLFile(`${__dirname}/templates/${mjmlFileName}`);
    const app = new this._vue({
      data,
      template,
    });
    const html = this._mjml(await this._createRenderer().renderToString(app)).html;
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

export { EmailHandler };
