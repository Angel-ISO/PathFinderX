# Optimizaciones y Validaciones en PatFinderX

Este documento mapea los puntos solicitados por el profesor a mi implementación real de PatFinderX (grafo de calles real, A*, KD-Tree, y caché con Redis). No añadí endpoints artificiales; en su lugar, explico cómo esas validaciones se cumplen dentro de mi flujo real y cómo lo llevé "un paso más allá".

## 1) Mapa con al menos un punto de parada válido
- **Qué pedían**: verificar que exista al menos un punto de parada válido.
- **Cómo lo apliqué**: en mi caso, las "paradas" (stoppingPoints) son opcionales. La validación relevante es que los nodos (inicio, fin y paradas si existen) sean válidos en el grafo. Para inputs con coordenadas, resuelvo el nodo más cercano usando KD-Tree; si no existe nodo cercano, devuelvo error 400.
- **En mi código**: PathService resuelve coordenadas a IDs y valida existencia, lanzando ApiResponse(400) cuando no hay correspondencia válida.
- **Mi resultado**: garantizo que, si el usuario provee paradas, estas deben existir en el grafo; si no hay ninguna válida, el request falla.

## 2) Puntos de parada alcanzables desde el inicio
- **Qué pedían**: comprobar conectividad entre inicio y paradas.
- **Cómo lo apliqué**: antes de calcular A*, valido conectividad con un BFS ligero. Si no hay conectividad entre inicio y destino (o entre segmentos al usar paradas), devuelvo 404.
- **Mi beneficio**: evito gastar CPU en A* cuando sé que es imposible.

## 3) Geometrías complejas o formas irregulares
- **Qué pedían**: usar memoization para intermedios en mapas complejos.
- **Cómo lo apliqué**: trabajo con un grafo real y A*. Optimicé de dos formas:
  1) **En memoria**: KD-Tree y grafo se construyen una sola vez por proceso y se reutilizan.
  2) **A nivel respuesta**: implementé cache-aside con Redis/Dragonfly para reutilizar resultados completos de rutas repetidas (mismo body). Esto es más efectivo que memorizar pasos internos para mi caso de uso.

## 4) Considerar todas las rutas posibles
- **Qué pedían**: explorar todas las rutas y filtrar las no viables.
- **Cómo lo apliqué**: en grafos reales, enumerar todas las rutas es inviable. Uso A* con heurística Haversine, que garantiza optimalidad en pesos no negativos y explora de forma informada. Para múltiples paradas, calculo segmentos consecutivos (start->stop1->...->end) respetando obstáculos.

## 5) Ruta óptima sin desvíos innecesarios
- **Qué pedían**: seleccionar la ruta más corta.
- **Cómo lo apliqué**: A* con heurística admisible (Haversine) produce rutas óptimas. Calculo la distancia total sobre el grafo y devuelvo { route: [{id,lat,lon}], totalDistance }.

## 6) Errores para entradas inválidas o mapas no solucionables
- **Qué pedían**: validar entradas e informar errores adecuados.
- **Cómo lo apliqué**: mis DTOs y servicios validan formato y existencia. Si no se puede resolver a nodos válidos o no hay conectividad, respondo 400 o 404 con mensajes claros.

## 7) Gran número de obstáculos o paradas
- **Qué pedían**: optimizaciones para grandes volúmenes.
- **Cómo lo apliqué**:
  - KD-Tree para nearest-node O(log N) promedio.
  - Grafo construido una sola vez en memoria.
  - Caché de respuestas en Redis para evitar recomputar rutas idénticas.
  - Timeout en cálculo de segmentos para acotar tiempos patológicos.

## 12) Pruebas unitarias y cobertura
- **Objetivo**: >= 70% de cobertura.
- **Mi implementación**: en el proyecto configuré Jest y genero reportes de cobertura. Pruebo DTOs, servicios y helpers (distancias, algoritmo, etc.).

## Caché de respuestas (mi extra)
- **Patrón**: implementé cache-aside (read-through) en Redis/Dragonfly.
- **Clave**: namespace + método + URL + hash estable del body (ordenación profunda + SHA-256).
- **TTL**: configurable por variable de entorno (ej. CACHE_TTL_SECONDS).
- **Mi comportamiento**: cacheo solo 2xx, renuevo TTL en cada HIT (sliding), añado header X-Cache: HIT/MISS.

Esto me permite evitar recalcular rutas idénticas y reduce la carga de mi backend en escenarios repetitivos.