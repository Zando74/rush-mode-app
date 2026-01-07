import {Container} from 'inversify';
import {RegisterRushFraudProjection} from './registration/service-registration';

export const RegisterRushFraudInstances = (container: Container) => {
  RegisterRushFraudProjection(container);
};
