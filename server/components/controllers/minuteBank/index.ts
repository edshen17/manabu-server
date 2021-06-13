import { StatusCodes } from 'http-status-codes';
import { makeGetMinuteBankUsecase } from '../../usecases/minuteBank';
import { GetMinuteBankController } from './getMinuteBankController';

const makeGetMinuteBankController = new GetMinuteBankController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeGetMinuteBankUsecase });

export { makeGetMinuteBankController };
