import ContainerManager from '../shared/infra/inversify/container-manager';
import {RegisterRushProgressionInstances} from './infra/inversify/container-manager';
import {Logger} from '../shared/infra/logger/logger';

export const StartRushProgressionApplication = async () => {
  RegisterRushProgressionInstances(ContainerManager.container);
  Logger.info('Rush Progression tracking application started');
};
