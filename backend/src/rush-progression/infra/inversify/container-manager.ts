import {Container} from 'inversify';
import {RegisterRushProgressionProjection} from './registration/service-registration';

export const RegisterRushProgressionInstances = (container: Container) => {
  RegisterRushProgressionProjection(container);
};
