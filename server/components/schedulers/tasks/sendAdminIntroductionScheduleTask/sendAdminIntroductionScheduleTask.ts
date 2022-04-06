import { JoinedUserDoc } from '../../../../models/User';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../../usecases/utils/emailHandler/emailHandler';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalSendAdminIntroductionScheduleTaskInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeEmailHandler: Promise<EmailHandler>;
  makeCacheDbService: Promise<CacheDbService>;
};

type SendAdminIntroductionScheduleTaskResponse = void;

class SendAdminIntroductionScheduleTask extends AbstractScheduleTask<
  OptionalSendAdminIntroductionScheduleTaskInitParams,
  SendAdminIntroductionScheduleTaskResponse
> {
  private _userDbService!: UserDbService;
  private _emailHandler!: EmailHandler;
  private _cacheDbService!: CacheDbService;

  public execute = async (): Promise<void> => {
    const dbServiceAccessOptions = this._userDbService.getOverrideDbServiceAccessOptions();
    const newUsers = await this._userDbService.find({
      searchQuery: {
        createdDate: {
          $gte: this._dayjs().subtract(1, 'day').toDate(),
          $lte: new Date(),
        },
      },
      dbServiceAccessOptions,
    });
    await this._sendIntroductionEmails(newUsers);
  };

  private _sendIntroductionEmails = async (newUsers: JoinedUserDoc[]): Promise<void> => {
    for (const user of newUsers) {
      try {
        await this._sendIntroductionEmail(user);
      } catch (err) {
        continue;
      }
    }
  };

  private _sendIntroductionEmail = async (user: JoinedUserDoc): Promise<void> => {
    const ADMIN_INTRODUCTION_HASH_KEY = 'adminIntroductionEmail';
    const sentAdminIntroduction = await this._cacheDbService.get({
      hashKey: ADMIN_INTRODUCTION_HASH_KEY,
      key: user._id.toString(),
    });
    if (!sentAdminIntroduction) {
      const { email, name } = user;
      await this._emailHandler.send({
        to: email,
        from: EMAIL_HANDLER_SENDER_ADDRESS.SUPPORT,
        templateName: EMAIL_HANDLER_TEMPLATE.ADMIN_INTRODUCTION,
        data: {
          name,
        },
      });
      await this._cacheDbService.set({
        hashKey: ADMIN_INTRODUCTION_HASH_KEY,
        key: user._id.toString(),
        value: user,
        ttlMs: TTL_MS.DAY,
      });
    }
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalSendAdminIntroductionScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    const { makeUserDbService, makeEmailHandler, makeCacheDbService } =
      optionalScheduleTaskInitParams;
    this._userDbService = await makeUserDbService;
    this._emailHandler = await makeEmailHandler;
    this._cacheDbService = await makeCacheDbService;
  };
}

export { SendAdminIntroductionScheduleTask };
