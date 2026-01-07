import {Request, Response} from 'express';
import {Logger} from '../../../shared/infra/logger/logger';
import {TRPCError} from '@trpc/server';
import {DomainError} from '../../../shared/domain/error/domain.error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: Function,
) => {
  if (err instanceof DomainError) {
    Logger.warn(err.message);
    res.status(400).json({
      message: [{message: err.message}],
    });
  } else if (err instanceof TRPCError) {
    Logger.warn(err.message);
    res.status(400).json({
      message: err.message,
    });
  } else {
    Logger.error(err);
    res.status(400).send({
      message: [{message: 'Something went wrong'}],
    });
  }
};
