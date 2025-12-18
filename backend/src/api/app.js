import express from 'express';
import GlobalRoutes from './routes/MainRoutes.js';
import { setupApp } from './Extensions/AppServicesSetup.js';

const app = express();



setupApp(app);

app.use('/api/v1', GlobalRoutes);



export default app;