import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  translateTime: true,
  ignore: 'pid,hostname',
  messageKey: 'msg',
});

const level = process.env.NODE_ENV === 'test' ? 'silent' : 'info';

export const Logger = pino({level}, stream);
