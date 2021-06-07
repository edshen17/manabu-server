import { AbstractController, ControllerParams } from '../abstractions/AbstractController';
import { IController } from '../abstractions/IController';

class PostUserController extends AbstractController implements IController {
  constructor(props: ControllerParams) {
    super(props);
  }
}

export { PostUserController };
