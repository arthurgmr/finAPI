import 'reflect-metadata';
import 'express-async-errors';
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import '../typeorm';
import '../../container';
import { router } from './routes';
import { AppError } from '../../errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use('/api/v1', router);

app.use(
  (err: Error, request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} `,
    });
  }
);

export { app };
