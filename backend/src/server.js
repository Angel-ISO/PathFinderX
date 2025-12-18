import 'dotenv/config'; 
import http from 'http';
import app from './api/app.js';
import './Infrastructure/config/DbConect.js';  
import './Infrastructure/config/CacheClient.js';

const host = process.env.HOST;
const port = process.env.PORT;

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`🚀 Server running at: http://${host}:${port}`);
});