"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_HANDLER_TEMPLATE = exports.EMAIL_HANDLER_SENDER_ADDRESS = exports.EmailHandler = void 0;
const vue_i18next_1 = __importDefault(require("@panter/vue-i18next"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const constants_1 = require("../../../../constants");
var EMAIL_HANDLER_SENDER_ADDRESS;
(function (EMAIL_HANDLER_SENDER_ADDRESS) {
    EMAIL_HANDLER_SENDER_ADDRESS["SUPPORT"] = "support@manabu.sg";
    EMAIL_HANDLER_SENDER_ADDRESS["NOREPLY"] = "no-reply@manabu.sg";
})(EMAIL_HANDLER_SENDER_ADDRESS || (EMAIL_HANDLER_SENDER_ADDRESS = {}));
exports.EMAIL_HANDLER_SENDER_ADDRESS = EMAIL_HANDLER_SENDER_ADDRESS;
var EMAIL_HANDLER_TEMPLATE;
(function (EMAIL_HANDLER_TEMPLATE) {
    EMAIL_HANDLER_TEMPLATE["STUDENT_APPOINTMENT_UPDATE"] = "StudentAppointmentUpdate";
    EMAIL_HANDLER_TEMPLATE["TEACHER_APPOINTMENT_CREATION"] = "TeacherAppointmentCreation";
    EMAIL_HANDLER_TEMPLATE["INTERNAL_EXPIRED_APPOINTMENT"] = "InternalExpiredAppointment";
    EMAIL_HANDLER_TEMPLATE["STUDENT_PACKAGE_TRANSACTION_CREATION"] = "StudentPackageTransactionCreation";
    EMAIL_HANDLER_TEMPLATE["TEACHER_APPOINTMENT_REMINDER"] = "TeacherAppointmentReminder";
    EMAIL_HANDLER_TEMPLATE["STUDENT_APPOINTMENT_REMINDER"] = "StudentAppointmentReminder";
    EMAIL_HANDLER_TEMPLATE["TEACHER_APPOINTMENT_UPDATE"] = "TeacherAppointmentUpdate";
    EMAIL_HANDLER_TEMPLATE["EMAIL_VERIFICATION"] = "EmailVerification";
    EMAIL_HANDLER_TEMPLATE["INTERNAL_NEW_USER"] = "InternalNewUser";
    EMAIL_HANDLER_TEMPLATE["TEACHER_PACKAGE_TRANSACTION_CREATION"] = "TeacherPackageTransactionCreation";
})(EMAIL_HANDLER_TEMPLATE || (EMAIL_HANDLER_TEMPLATE = {}));
exports.EMAIL_HANDLER_TEMPLATE = EMAIL_HANDLER_TEMPLATE;
class EmailHandler {
    _sendgrid;
    _fs;
    _userDbService;
    _vue;
    _createRenderer;
    _mjml;
    _join;
    sendAlertFromUserId = async (props) => {
        const { userId, emailAlertName, from, subject, templateName, data } = props;
        const dbServiceAccessOptions = this._userDbService.getOverrideDbServiceAccessOptions();
        const user = await this._userDbService.findById({
            _id: userId,
            dbServiceAccessOptions,
        });
        const userSettings = user.settings;
        const userEmailAlertSettings = userSettings.emailAlerts;
        const teacherEmailAlertSettings = user.teacherData
            ? user.teacherData.settings.emailAlerts
            : {};
        const shouldSendEmail = userEmailAlertSettings[emailAlertName] || teacherEmailAlertSettings[emailAlertName];
        if (shouldSendEmail) {
            this.send({
                to: user.email,
                data: { name: user.name, ...data },
                from,
                subject,
                templateName,
                locale: userSettings.locale,
            });
        }
    };
    send = async (props) => {
        const { to, from, subject, templateName, data, locale } = props;
        this._initLocale(locale);
        const html = await this._createHtmlToRender({
            templateName,
            data: { ...data, t: i18next_1.default.t },
        });
        const email = {
            to,
            from: {
                name: 'Minato Manabu',
                email: from,
            },
            subject: subject || this._getSubject({ data, templateName }),
            html,
        };
        if (constants_1.IS_PRODUCTION) {
            await this._sendgrid.send(email);
        }
    };
    _initLocale = (locale) => {
        const localesFolder = this._join(__dirname, './locales');
        i18next_1.default.use(i18next_fs_backend_1.default).init({
            initImmediate: false,
            lng: locale,
            fallbackLng: 'en',
            preload: this._fs.readdirSync(localesFolder).filter((fileName) => {
                const joinedPath = this._join(localesFolder, fileName);
                return this._fs.lstatSync(joinedPath).isDirectory();
            }),
            backend: {
                loadPath: this._join(localesFolder, '{{lng}}.json'),
            },
        });
    };
    _getSubject = (props) => {
        const { templateName, data } = props;
        const camlizedTemplateName = templateName
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase())
            .replace(/\s+/g, '');
        const subject = i18next_1.default.t(`${camlizedTemplateName}.subject`, data);
        return subject;
    };
    _createHtmlToRender = async (props) => {
        const { templateName, data } = props;
        const template = this._getTemplate(templateName);
        const components = await this._getComponents(templateName);
        this._vue.use(vue_i18next_1.default);
        const i18n = new vue_i18next_1.default(i18next_1.default);
        const app = new this._vue({
            data() {
                return {
                    emailData: data,
                };
            },
            template,
            i18n,
            components,
        });
        const mjml = await this._createRenderer().renderToString(app);
        const html = this._mjml(mjml).html;
        return html;
    };
    _getTemplate = (templateName) => {
        const templateComponent = templateName
            .match(/([A-Z]?[^A-Z]*)/g)
            .slice(0, -1)
            .join('-')
            .toLowerCase();
        const template = `<${templateComponent} v-bind="emailData"/>`;
        return template;
    };
    _getComponents = async (templateName) => {
        const dirname = __dirname.replace(/\\/g, '/');
        const components = await Promise.resolve().then(() => __importStar(require(`${dirname}/views/${templateName}.ts`)));
        return components;
    };
    init = async (props) => {
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
exports.EmailHandler = EmailHandler;
