import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import { configureCors } from './CorsSetup.js';
import swaggerUI from 'swagger-ui-express';
import generateDocs from '../../Infrastructure/config/ConfigSwagger.js';
import { errorMiddleware } from '../middleware/errorMiddleware.js';
import { globalRateLimiter } from '../middleware/rateLimiter.js';

export function setupApp(app) {
  app.use(helmet());
  app.use(morgan('dev'));
  configureCors(app); 
  app.use(express.json());
  app.set("trust proxy", 1);
  app.use(globalRateLimiter);

  
  const swaggerSpec = generateDocs(false);

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


  app.use(errorMiddleware);
}