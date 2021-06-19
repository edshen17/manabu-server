import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { makeMinuteBankDbService } from '../../dataAccess/services/minuteBanksDb';
import { makeMinuteBankEntity } from '../../entities/minuteBank';

const initializeMinuteBank = async (hostedBy: any, reservedBy: any) => {
  const minuteBankEntity = await makeMinuteBankEntity;
  const modelToInsert = await minuteBankEntity.build({ hostedBy, reservedBy });
  const minuteBankDbService = await makeMinuteBankDbService;
  const accessOptions: AccessOptions = {
    isProtectedResource: true,
    isCurrentAPIUserPermitted: true,
    currentAPIUserRole: 'user',
    isSelf: true,
  };
  return await minuteBankDbService.insert({ modelToInsert, accessOptions });
};

export { initializeMinuteBank };
