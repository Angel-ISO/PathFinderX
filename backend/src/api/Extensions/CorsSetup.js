import cors from 'cors';

export function configureCors(app) {
  app.use(
    cors({
      origin: ['http://localhost:5173','https://pathfinderx.stellarco.online', 'localhost:3000'],
      methods: ['GET', 'POST', 'PUT','PATCH','DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'], 
      credentials: true,
    })
  );
}
