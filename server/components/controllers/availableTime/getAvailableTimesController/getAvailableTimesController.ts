import { GetAvailableTimesUsecaseResponse } from '../../../usecases/availableTime/getAvailableTimesUsecase/getAvailableTimesUsecase';
import { AbstractController, ControllerParams } from '../../abstractions/AbstractController';

class GetAvailableTimesController extends AbstractController<GetAvailableTimesUsecaseResponse> {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetAvailableTimesController };
