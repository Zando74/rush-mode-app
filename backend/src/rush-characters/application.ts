import ContainerManager from '../shared/infra/inversify/container-manager';
import {RegisterRushCharactersInstances} from './infra/inversify/container-manager';
import {Logger} from '../shared/infra/logger/logger';

export const StartRushCharactersApplication = async () => {
  RegisterRushCharactersInstances(ContainerManager.container);
  Logger.info('Rush Characters tracking application started');
};
