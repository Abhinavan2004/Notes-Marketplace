import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const message = err instanceof Error ? err.message : 'Internal server error';
  return res.status(500).json({ message });
};

