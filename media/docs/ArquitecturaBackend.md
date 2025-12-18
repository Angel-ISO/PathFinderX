# Arquitectura Backend (PatFinderX)

## Mi visión general
Diseñé una arquitectura por capas, orientada a dominio y principios SOLID:
- **API**: rutas, controladores, DTOs, middleware.
- **Core (dominio)**: servicios, algoritmos (A*), helpers de grafo y distancias.
- **Infrastructure**: repositorios (MongoDB), configuración (DB, Cache), clientes externos.
- **Shared**: utilidades y manejo de errores.

## Mi flujo principal (cálculo de ruta)
1) Request POST /api/v1/path/calculate
2) **Middleware**: autenticación, caché (HIT/MISS)
3) **Controller**: adapta HTTP -> DTO
4) **Servicio**: PathService
   - Resuelve coordenadas a nodos con KD-Tree (NodeRepository)
   - Valida conectividad y delega al RouteCalculator
5) **RouteCalculator**
   - Inicializa grafo (una vez) con nodos + vías
   - Ejecuta A* por segmentos (paradas opcionales)
   - Calcula distancia total
6) **Respuesta DTO** (PathResponse)
7) **Middleware de caché** almacena respuesta exitosa (MISS)

## Mis decisiones técnicas clave
- **KD-Tree** para nearest-node queries
- **Grafo en memoria** con adyacencias
- **A* con heurística Haversine** (admisible) para optimalidad
- **Redis/Dragonfly** para caché de respuestas
- **Timeouts y validaciones previas** para robustez

## Mis buenas prácticas
- **SRP** en controladores/servicios
- **Inversión de dependencias** entre servicios y repositorios
- **DTOs** para aislar capa HTTP del dominio
- **Middleware** para cross-cutting concerns (auth, rate-limit, cache, errores)

## Mi entorno y configuraciones
- Variables .env para DB, puerto, TTL de caché, etc.
- Scripts npm para start/test/coverage e importación de datos

## Mis pruebas
- Jest con cobertura. Pruebo DTOs, helpers (distancias/algoritmos) y servicios.