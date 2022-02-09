"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentsUsecase = void 0;
const constants_1 = require("../../../../constants");
const userEntity_1 = require("../../../entities/user/userEntity");
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
const emailHandler_1 = require("../../utils/emailHandler/emailHandler");
class CreateAppointmentsUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _appointmentEntity;
    _packageTransactionDbService;
    _availableTimeDbService;
    _splitAvailableTimeHandler;
    _dayjs;
    _emailHandler;
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions, currentAPIUser } = props;
        const { session } = body;
        const { appointments, packageTransaction } = await this._createAppointments({
            appointments: body.appointments,
            dbServiceAccessOptions,
            currentAPIUser,
            session,
        });
        this._sendTeacherAppointmentCreationEmail(appointments);
        const usecaseRes = {
            appointments,
            packageTransaction,
        };
        return usecaseRes;
    };
    _createAppointments = async (props) => {
        const { appointments, dbServiceAccessOptions, session } = props;
        const modelToInsert = [];
        // all go through or none go through
        for (const appointment of appointments) {
            await this._createAppointment({ ...props, appointment, modelToInsert });
        }
        this._testSameAppointmentType(modelToInsert);
        const savedDbAppointments = await this._dbService.insertMany({
            modelToInsert,
            dbServiceAccessOptions,
            session,
        });
        const packageTransaction = await this._decrementAppointmentCount(savedDbAppointments);
        await this._splitAvailableTimeBrancher(savedDbAppointments);
        return { appointments: savedDbAppointments, packageTransaction };
    };
    _createAppointment = async (props) => {
        const { appointment, dbServiceAccessOptions, currentAPIUser, modelToInsert } = props;
        await this._testResourceOwnership({ appointment, dbServiceAccessOptions, currentAPIUser });
        await this._testAvailableTimeExistence({ appointment, dbServiceAccessOptions });
        await this._testAppointmentTimeConflict({
            appointment,
            dbServiceAccessOptions,
            currentAPIUser,
        });
        const appointmentEntity = await this._appointmentEntity.build({
            ...appointment,
            reservedById: currentAPIUser.userId,
        });
        modelToInsert.push(appointmentEntity);
    };
    _testResourceOwnership = async (props) => {
        const { appointment, dbServiceAccessOptions, currentAPIUser } = props;
        const packageTransaction = await this._packageTransactionDbService.findById({
            _id: appointment.packageTransactionId,
            dbServiceAccessOptions,
        });
        const isHostedByIdEqual = packageTransaction.hostedById.equals(appointment.hostedById);
        const isReservedByIdEqual = packageTransaction.reservedById.equals(currentAPIUser.userId);
        const hasResourceAccess = isHostedByIdEqual && isReservedByIdEqual;
        const timeDifference = this._dayjs(appointment.endDate).diff(appointment.startDate, 'minute');
        const isCorrectDuration = timeDifference == packageTransaction.lessonDuration;
        if (!hasResourceAccess) {
            throw new Error('Appointment foreign key mismatch.');
        }
        else if (!isCorrectDuration) {
            throw new Error('Appointment duration mismatch.');
        }
    };
    _testAvailableTimeExistence = async (props) => {
        const { appointment, dbServiceAccessOptions } = props;
        const { hostedById, startDate, endDate } = appointment;
        const availableTime = await this._availableTimeDbService.findOne({
            searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
            dbServiceAccessOptions,
        });
        if (!availableTime) {
            throw new Error('You cannot have an appointment with no corresponding available time slot.');
        }
    };
    _testAppointmentTimeConflict = async (props) => {
        const { appointment, dbServiceAccessOptions, currentAPIUser } = props;
        const { hostedById, startDate, endDate } = appointment;
        const overlappingHostedByAppointment = await this._dbService.findOne({
            searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
            dbServiceAccessOptions,
        });
        const overlappingReservedByAppointment = await this._dbService.findOne({
            searchQuery: {
                reservedById: currentAPIUser.userId,
                startDate: { $lt: endDate },
                endDate: { $gt: startDate },
            },
            dbServiceAccessOptions,
        });
        if (overlappingHostedByAppointment || overlappingReservedByAppointment) {
            throw new Error('You cannot have appointments that overlap.');
        }
    };
    _testSameAppointmentType = (appointments) => {
        const hostedById = appointments[0].hostedById;
        const reservedById = appointments[0].reservedById;
        const packageTransactionId = appointments[0].packageTransactionId;
        const sameAppointmentTypeCount = appointments.filter((appointment) => {
            const isHostedByIdEqual = this._deepEqual(appointment.hostedById, hostedById);
            const isReservedByIdEqual = this._deepEqual(appointment.reservedById, reservedById);
            const isPackageTransactionIdEqual = this._deepEqual(appointment.packageTransactionId, packageTransactionId);
            return isHostedByIdEqual && isReservedByIdEqual && isPackageTransactionIdEqual;
        }).length;
        if (sameAppointmentTypeCount != appointments.length) {
            throw new Error('All appointments must be of the same type.');
        }
    };
    _decrementAppointmentCount = async (appointments) => {
        const packageTransactionId = appointments[0].packageTransactionId;
        const dbServiceAccessOptions = this._packageTransactionDbService.getBaseDbServiceAccessOptions();
        const appointmentsToSubtract = appointments.length * -1;
        const packageTransaction = await this._packageTransactionDbService.findOne({
            searchQuery: { _id: packageTransactionId },
            dbServiceAccessOptions,
        });
        const hasAppointmentsRemaining = packageTransaction.remainingAppointments + appointmentsToSubtract >= 0;
        if (hasAppointmentsRemaining) {
            const packageTransaction = await this._packageTransactionDbService.findOneAndUpdate({
                searchQuery: { _id: packageTransactionId },
                updateQuery: {
                    $inc: { remainingAppointments: appointmentsToSubtract },
                },
                dbServiceAccessOptions,
            });
            return packageTransaction;
        }
        else {
            throw new Error('You do not have enough remaining lessons!');
        }
    };
    _splitAvailableTimeBrancher = async (appointments) => {
        if (!constants_1.IS_PRODUCTION) {
            await this._splitAvailableTimeHandler.split(appointments);
        }
        else {
            this._splitAvailableTimeHandler.split(appointments);
        }
    };
    _sendTeacherAppointmentCreationEmail = async (savedDbAppointments) => {
        savedDbAppointments.sort((a, b) => {
            return this._dayjs(b).valueOf() - this._dayjs(a).valueOf();
        });
        const appointment = savedDbAppointments[0];
        this._emailHandler.sendAlertFromUserId({
            userId: appointment.hostedById,
            emailAlertName: userEntity_1.USER_ENTITY_EMAIL_ALERT.APPOINTMENT_CREATION,
            from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
            templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.TEACHER_APPOINTMENT_CREATION,
            data: {
                name: appointment.packageTransactionData.hostedByData.name,
                appointment,
            },
        });
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeAppointmentEntity, makePackageTransactionDbService, makeSplitAvailableTimeHandler, makeAvailableTimeDbService, makeEmailHandler, dayjs, } = optionalInitParams;
        this._appointmentEntity = await makeAppointmentEntity;
        this._packageTransactionDbService = await makePackageTransactionDbService;
        this._splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
        this._availableTimeDbService = await makeAvailableTimeDbService;
        this._dayjs = dayjs;
        this._emailHandler = await makeEmailHandler;
    };
}
exports.CreateAppointmentsUsecase = CreateAppointmentsUsecase;
