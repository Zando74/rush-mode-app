import ContainerManager from '../shared/infra/inversify/container-manager';
import {RegisterRushFraudInstances} from './infra/inversify/container-manager';
import {Logger} from '../shared/infra/logger/logger';

export const StartRushFraudApplication = async () => {
  RegisterRushFraudInstances(ContainerManager.container);
  Logger.info('Rush Fraud tracking application started');
};
