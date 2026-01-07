import {Request, Response, NextFunction} from 'express';

export const requireFrontendKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers['x-api-key'];
  if (
    apiKey !== process.env.ADMIN_API_KEY &&
    apiKey !== process.env.FRONTEND_API_KEY
  ) {
    return res.status(403).send('Forbidden: Invalid API Key');
  }
  return next();
};
