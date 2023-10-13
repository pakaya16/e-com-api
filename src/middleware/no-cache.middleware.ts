import { Request, Response, NextFunction } from 'express';

export function noCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
}
