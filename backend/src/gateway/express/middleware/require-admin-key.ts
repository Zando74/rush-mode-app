import {Request, Response, NextFunction} from 'express';

export const requireAdminKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).send('Forbidden: Invalid API Key');
  }
  return next();
};
