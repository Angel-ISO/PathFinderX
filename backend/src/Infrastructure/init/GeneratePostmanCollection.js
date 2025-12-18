const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const yaml = require('js-yaml');

/**
 * Script para generar automáticamente colecciones de Postman e Insomnia
 * desde el archivo swagger.yml
 */

const PATHS = {
  swagger: './media/docs/swagger.yml',
  postman: './media/docs/postman-collection.json',
  insomnia: './media/docs/insomnia-collection.json'
};

async function generateCollections() {
  try {
    console.log('🚀 Iniciando generación automática de colecciones...');
    
    // Verificar que existe el archivo swagger
    if (!fs.existsSync(PATHS.swagger)) {
      console.error('❌ No se encontró el archivo swagger.yml');
      process.exit(1);
    }

    // Generar colección de Postman
    console.log('📦 Generando colección de Postman...');
    await generatePostmanCollection();
    
    // Generar colección de Insomnia
    console.log('🌙 Generando colección de Insomnia...');
    await generateInsomniaCollection();
    
    console.log('✅ Colecciones generadas exitosamente!');
    console.log(`📁 Postman: ${PATHS.postman}`);
    console.log(`📁 Insomnia: ${PATHS.insomnia}`);
    
  } catch (error) {
    console.error('❌ Error al generar colecciones:', error.message);
    process.exit(1);
  }
}

function generatePostmanCollection() {
  return new Promise((resolve, reject) => {
    const cmd = `npx openapi-to-postman -s ${PATHS.swagger} -o ${PATHS.postman} -p`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error generando Postman: ${error.message}`));
        return;
      }
      
      if (stderr && !stderr.includes('warn')) {
        reject(new Error(`Error en Postman: ${stderr}`));
        return;
      }
      
      // Personalizar la colección generada
      customizePostmanCollection();
      resolve();
    });
  });
}

function generateInsomniaCollection() {
  return new Promise((resolve, reject) => {
    try {
      // Para Insomnia, usamos una conversión manual más simple
      const swaggerContent = fs.readFileSync(PATHS.swagger, 'utf8');
      const swaggerDoc = yaml.load(swaggerContent);
      
      const insomniaCollection = convertToInsomnia(swaggerDoc);
      
      fs.writeFileSync(
        PATHS.insomnia, 
        JSON.stringify(insomniaCollection, null, 2)
      );
      
      resolve();
    } catch (error) {
      reject(new Error(`Error generando Insomnia: ${error.message}`));
    }
  });
}

function customizePostmanCollection() {
  try {
    const collectionPath = PATHS.postman;
    if (!fs.existsSync(collectionPath)) return;
    
    const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
    
    // Agregar variables de entorno
    collection.variable = [
      {
        key: "baseUrl",
        value: "{{baseUrl}}",
        type: "string"
      },
      {
        key: "token",
        value: "{{token}}",
        type: "string"
      }
    ];
    
    // Agregar autenticación JWT a endpoints protegidos
    addAuthToEndpoints(collection.item);
    
    fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
    console.log('✨ Colección de Postman personalizada');
    
  } catch (error) {
    console.warn('⚠️  No se pudo personalizar la colección de Postman:', error.message);
  }
}

function addAuthToEndpoints(items) {
  if (!Array.isArray(items)) return;
  
  items.forEach(item => {
    if (item.item) {
      // Es una carpeta, procesar recursivamente
      addAuthToEndpoints(item.item);
    } else if (item.request) {
      // Es un endpoint, verificar si necesita auth
      const needsAuth = checkIfNeedsAuth(item);
      
      if (needsAuth) {
        item.request.auth = {
          type: "bearer",
          bearer: [
            {
              key: "token",
              value: "{{token}}",
              type: "string"
            }
          ]
        };
      }
    }
  });
}

function checkIfNeedsAuth(item) {
  // Endpoints que no necesitan autenticación
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/verify-email'
  ];
  
  const url = item.request.url.raw || item.request.url;
  const isPublic = publicEndpoints.some(endpoint => 
    url.includes(endpoint)
  );
  
  return !isPublic;
}

function convertToInsomnia(swaggerDoc) {
  const insomnia = {
    _type: "export",
    __export_format: 4,
    __export_date: new Date().toISOString(),
    __export_source: "patfinders-api",
    resources: []
  };
  
  // Agregar workspace
  insomnia.resources.push({
    _id: "wrk_patfinders",
    _type: "workspace",
    name: swaggerDoc.info?.title || "PatFinders API",
    description: swaggerDoc.info?.description || ""
  });
  
  // Agregar environment
  insomnia.resources.push({
    _id: "env_base",
    _type: "environment",
    name: "Base Environment",
    data: {
      baseUrl: swaggerDoc.servers?.[0]?.url || "http://localhost:3000",
      token: ""
    },
    parentId: "wrk_patfinders"
  });
  
  // Convertir endpoints
  Object.entries(swaggerDoc.paths || {}).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
      const request = {
        _id: `req_${path.replace(/[^\w]/g, '_')}_${method}`,
        _type: "request",
        parentId: "wrk_patfinders",
        name: details.summary || `${method.toUpperCase()} ${path}`,
        url: `{{ _.baseUrl }}${path}`,
        method: method.toUpperCase(),
        headers: [],
        body: {}
      };
      
      if (details.security) {
        request.authentication = {
          type: "bearer",
          token: "{{ _.token }}"
        };
      }
      
      insomnia.resources.push(request);
    });
  });
  
  return insomnia;
}

if (require.main === module) {
  generateCollections();
}

module.exports = { generateCollections };