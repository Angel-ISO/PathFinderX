import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'yaml';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../../../../media/docs');
const SWAGGER_YML = path.join(DOCS_DIR, 'swagger.yml');
const SWAGGER_JSON = path.join(DOCS_DIR, 'swagger.json');
const POSTMAN_JSON = path.join(DOCS_DIR, 'postman_collection.json');
const GCP_JSON = path.join(DOCS_DIR, 'gcp_api_config.json');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Path-FinderX - API Documentation',
    version: '1.0.0',
    description: 'API documentation for a path finder application on the town of Bucaramanga, Colombia.',
    contact: {
      name: 'AngelBLadex',
      url: 'https://portafolio-beta-ebon.vercel.app/',
      email: 'angel.orteg@jala.university',
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../../api/routes/*.js')],
};

export function generateDocs(force = false) {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  if (!force && fs.existsSync(SWAGGER_YML) && fs.existsSync(SWAGGER_JSON)) {
    console.log(' Documentación Swagger ya existe. No se regeneró.');
    return swaggerJSDoc(options);
  }

  console.log(' Generando documentación Swagger...');

  const swaggerSpec = swaggerJSDoc(options);

  const yamlSpec = yaml.stringify(swaggerSpec);
  fs.writeFileSync(SWAGGER_YML, yamlSpec, 'utf8');

  fs.writeFileSync(SWAGGER_JSON, JSON.stringify(swaggerSpec, null, 2), 'utf8');

  try {
    execSync(`npx openapi-to-postmanv2 -s "${SWAGGER_JSON}" -o "${POSTMAN_JSON}" -p`, { stdio: 'inherit' });
    console.log(' Postman Collection generada.');
  } catch (err) {
    console.warn('No se pudo generar Postman Collection:', err.message);
  }

  try {
    const gcpConfig = {
      swagger: swaggerSpec,
      google_cloud_format: true,
    };
    fs.writeFileSync(GCP_JSON, JSON.stringify(gcpConfig, null, 2), 'utf8');
    console.log(' Configuración GCP generada.');
  } catch (err) {
    console.warn(' No se pudo generar configuración GCP:', err.message);
  }

  return swaggerSpec;
}

export default generateDocs;