import VueI18Next from '@panter/vue-i18next';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { ObjectId } from 'mongoose';
import { IS_PRODUCTION } from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';

enum EMAIL_HANDLER_SENDER_ADDRESS {
  SUPPORT = 'support@manabu.sg',
  NOREPLY = 'no-reply@manabu.sg',
}

type EmailHandlerSendAlertFromUserIdParams = {
  userId: ObjectId;
  emailAlertName: string;
} & Omit<SendParams, 'to'>;

type SendParams = {
  from: EMAIL_HANDLER_SENDER_ADDRESS.SUPPORT | EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY;
  to: string | string[];
  subject: string;
  mjmlFileName: string;
  data: StringKeyObject;
  locale?: string;
};

class EmailHandler {
  private _sendgrid!: any;
  private _fs!: any;
  private _userDbService!: UserDbService;
  private _vue!: any;
  private _createRenderer!: any;
  private _mjml!: any;
  private _join!: any;

  public sendAlertFromUserId = async (
    props: EmailHandlerSendAlertFromUserIdParams
  ): Promise<void> => {
    const { userId, emailAlertName, from, subject, mjmlFileName, data } = props;
    const dbServiceAccessOptions = this._userDbService.getOverrideDbServiceAccessOptions();
    const user = await this._userDbService.findById({
      _id: userId,
      dbServiceAccessOptions,
    });
    const userSettings = user.settings;
    const userEmailAlertSettings: StringKeyObject = userSettings.emailAlerts;
    const teacherEmailAlertSettings: StringKeyObject = user.teacherData
      ? user.teacherData.settings.emailAlerts
      : {};
    const shouldSendEmail =
      userEmailAlertSettings[emailAlertName] || teacherEmailAlertSettings[emailAlertName];
    if (shouldSendEmail) {
      this.send({
        to: user.email,
        data: { name: user.name, ...data },
        from,
        subject,
        mjmlFileName,
        locale: userSettings.locale,
      });
    }
  };

  public send = async (props: SendParams): Promise<void> => {
    const { to, from, subject, mjmlFileName, data, locale } = props;
    this._initLocale(locale!);
    const html = await this._createHtmlToRender({
      mjmlFileName,
      data: { ...data, t: i18next.t },
    });
    const email = {
      to,
      from,
      subject,
      html,
    };
    if (IS_PRODUCTION) {
      await this._sendgrid.send(email);
    }
  };

  private _initLocale = (locale: string): void => {
    const localesFolder = this._join(__dirname, './locales');
    i18next.use(Backend).init({
      initImmediate: false,
      lng: locale,
      fallbackLng: 'en',
      preload: this._fs.readdirSync(localesFolder).filter((fileName: string) => {
        const joinedPath = this._join(localesFolder, fileName);
        return this._fs.lstatSync(joinedPath).isDirectory();
      }),
      backend: {
        loadPath: this._join(localesFolder, '{{lng}}.json'),
      },
    });
  };

  private _createHtmlToRender = async (props: {
    mjmlFileName: string;
    data: StringKeyObject;
  }): Promise<string> => {
    const { mjmlFileName, data } = props;
    const dirname = __dirname.replace(/\\/g, '/');
    const template = this._readMJMLFile(`${dirname}/templates/${mjmlFileName}`);
    this._vue.use(VueI18Next);
    const i18n = new VueI18Next(i18next);
    const app = new this._vue({
      data,
      template,
      i18n,
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
    sendgrid: any;
    fs: any;
    makeUserDbService: Promise<UserDbService>;
    vue: any;
    createRenderer: any;
    mjml: any;
    join: any;
  }): Promise<this> => {
    const { sendgrid, fs, makeUserDbService, vue, createRenderer, mjml, join } = props;
    this._sendgrid = sendgrid;
    this._fs = fs;
    this._userDbService = await makeUserDbService;
    this._vue = vue;
    this._createRenderer = await createRenderer;
    this._mjml = mjml;
    this._join = join;
    return this;
  };
}

export { EmailHandler, EMAIL_HANDLER_SENDER_ADDRESS, EmailHandlerSendAlertFromUserIdParams };
