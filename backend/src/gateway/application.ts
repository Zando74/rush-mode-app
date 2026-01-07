import {Logger} from '../shared/infra/logger/logger';
import initController from './express/init';

export const StartGatewayApplication = async () => {
  Logger.info('Gateway application started');
  if (process.env.NODE_ENV !== 'test') {
    initController();
  }
};
