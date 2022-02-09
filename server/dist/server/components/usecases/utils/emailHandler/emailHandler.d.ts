/// <reference types="custom" />
import { ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../../types/custom';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
declare enum EMAIL_HANDLER_SENDER_ADDRESS {
    SUPPORT = "support@manabu.sg",
    NOREPLY = "no-reply@manabu.sg"
}
declare type EmailHandlerSendAlertFromUserIdParams = {
    userId: ObjectId;
    emailAlertName: string;
} & Omit<SendParams, 'to'>;
declare type SendParams = {
    from: EMAIL_HANDLER_SENDER_ADDRESS.SUPPORT | EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY;
    to: string | string[];
    subject?: string;
    templateName: string;
    data: StringKeyObject;
    locale?: string;
};
declare enum EMAIL_HANDLER_TEMPLATE {
    STUDENT_APPOINTMENT_UPDATE = "StudentAppointmentUpdate",
    TEACHER_APPOINTMENT_CREATION = "TeacherAppointmentCreation",
    INTERNAL_EXPIRED_APPOINTMENT = "InternalExpiredAppointment",
    STUDENT_PACKAGE_TRANSACTION_CREATION = "StudentPackageTransactionCreation",
    TEACHER_APPOINTMENT_REMINDER = "TeacherAppointmentReminder",
    STUDENT_APPOINTMENT_REMINDER = "StudentAppointmentReminder",
    TEACHER_APPOINTMENT_UPDATE = "TeacherAppointmentUpdate",
    EMAIL_VERIFICATION = "EmailVerification",
    INTERNAL_NEW_USER = "InternalNewUser",
    TEACHER_PACKAGE_TRANSACTION_CREATION = "TeacherPackageTransactionCreation"
}
declare class EmailHandler {
    private _sendgrid;
    private _fs;
    private _userDbService;
    private _vue;
    private _createRenderer;
    private _mjml;
    private _join;
    sendAlertFromUserId: (props: EmailHandlerSendAlertFromUserIdParams) => Promise<void>;
    send: (props: SendParams) => Promise<void>;
    private _initLocale;
    private _getSubject;
    private _createHtmlToRender;
    private _getTemplate;
    private _getComponents;
    init: (props: {
        sendgrid: any;
        fs: any;
        makeUserDbService: Promise<UserDbService>;
        vue: any;
        createRenderer: any;
        mjml: any;
        join: any;
    }) => Promise<this>;
}
export { EmailHandler, EMAIL_HANDLER_SENDER_ADDRESS, EmailHandlerSendAlertFromUserIdParams, EMAIL_HANDLER_TEMPLATE, };
