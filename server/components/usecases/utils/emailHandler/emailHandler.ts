import { ObjectId } from 'mongoose';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';

type RequiredSendEmailParams = {
  sendFrom: string;
  subjectLine: string;
  htmlFileName: string;
  templateStrings: StringKeyObject;
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
  private _handlebars!: any;
  private _fs!: any;
  private _userDbService!: UserDbService;

  public sendAlertEmailFromUserId = async (
    props: { userId: ObjectId; alertSettingName: string } & RequiredSendEmailParams
  ): Promise<void> => {
    const { userId, alertSettingName, sendFrom, subjectLine, htmlFileName, templateStrings } =
      props;
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
        templateStrings: { name: user.name, ...templateStrings },
        sendFrom,
        subjectLine,
        htmlFileName,
      });
    }
  };

  public sendEmail = (
    props: { recipientEmails: string | string[] } & RequiredSendEmailParams
  ): void => {
    const { recipientEmails, sendFrom, subjectLine, htmlFileName, templateStrings } = props;
    const isProduction = process.env.NODE_ENV == 'production';
    if (isProduction) {
      const nodeMailerOptions: any = {
        ...this._NODE_MAILER_OPTIONS,
      };
      nodeMailerOptions.auth = this._MAIL_SEND_FROM_OPTIONS[sendFrom];
      const transporter = this._nodemailer.createTransport(nodeMailerOptions);
      const self = this;

      this._readHTMLFile(`${__dirname}/templates/${htmlFileName}.html`, (err, html) => {
        if (err) {
          throw err;
        }
        const template = self._handlebars.compile(html);
        const htmlToSend = template(templateStrings);
        const mailOptions = {
          from: self._MAIL_SEND_FROM_OPTIONS[sendFrom]['emailName'],
          to: recipientEmails,
          subject: subjectLine,
          html: htmlToSend,
        };
        transporter.sendMail(mailOptions);
      });
    }
  };

  private _readHTMLFile = (path: string, callback: (...args: any[]) => any) => {
    this._fs.readFile(path, { encoding: 'utf-8' }, function (err: Error, html: string) {
      if (err) {
        throw err;
      } else {
        callback(null, html);
      }
    });
  };

  public init = async (props: {
    handlebars: any;
    nodemailer: any;
    fs: any;
    makeUserDbService: Promise<UserDbService>;
  }): Promise<this> => {
    const { handlebars, nodemailer, fs, makeUserDbService } = props;
    this._handlebars = handlebars;
    this._nodemailer = nodemailer;
    this._fs = fs;
    this._userDbService = await makeUserDbService;
    return this;
  };
}

export { EmailHandler };
