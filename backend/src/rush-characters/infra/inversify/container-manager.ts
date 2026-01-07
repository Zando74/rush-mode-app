import {Container} from 'inversify';
import {RegisterRushCharactersProjection} from './registration/service-registration';

export const RegisterRushCharactersInstances = (container: Container) => {
  RegisterRushCharactersProjection(container);
};
