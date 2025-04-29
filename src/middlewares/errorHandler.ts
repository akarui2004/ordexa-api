import { NextFunction, Request, Response } from 'express';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // TODO: improve the error http status code
  res.status(500).json({
    status: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
}

export default errorHandler;
