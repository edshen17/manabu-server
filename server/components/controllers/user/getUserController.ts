import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class GetUserController extends AbstractController implements IController {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { GetUserController };
