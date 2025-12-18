# Key Differences — Lo que pidieron vs. lo que construí 

Quise documentar, en mis propias palabras, por qué mi solución va más allá del típico "path finder" de juego y cómo traduje ese reto a un proyecto realista, con datos geográficos, distancias reales y una experiencia de uso completa.

---

## 1) Qué pedían originalmente

- Un buscador de caminos tipo "juego": cuadrícula, obstáculos abstractos, encontrar el camino más corto.
- Requisitos orientados a un mapa sintético: IDs de mapas, dimensiones, validaciones de que haya al menos un camino, etc.

## 2) Lo que yo construí

- Un planificador de rutas con coordenadas reales (lat/lon) y distancia Haversine.
- Un frontend con Leaflet que dibuja rutas y puntos en un mapa real.
- Backend en Node/Express con entidades y validaciones para datos geográficos.
- Persistencia y modelo de datos con nodos y rutas (lat/lon como números), más cálculo de distancia real.
- Manejo de estado en frontend, render reactivo y experiencia responsiva (móvil y escritorio).

Esto convierte un ejercicio académico en una mini-aplicación de navegación real.

---

## 3) Requisitos no aplicables (y por qué)

1. Validar Formato del ID del Mapa (UUID)
   - No uso "mapas" por ID; trabajo con coordenadas reales en un mapa base. No hay un recurso "mapa" versionado por UUID como en un juego.

3. Validar que la Configuración del Mapa incluya Obstáculos y Puntos de Parada
   - No hay un archivo de configuración de un mapa sintético. Los "obstáculos" están implícitos en la topología real (calles, nodos conectados o no). Los puntos de parada existen como POIs/waypoints reales.

4. Asegurar que las Dimensiones del Mapa estén dentro de límites aceptables
   - En un grid sintético tiene sentido. En un mapa real, lo que importa son límites geográficos/regionales, no un ancho/alto discreto.

6. Verificar Dependencias Cíclicas en la Configuración del Mapa
   - Ese tipo de dependencia ocurre cuando un mapa sintético se define por "reglas" o referencias circulares. En mi caso, la red de calles es un grafo real sin ese concepto de dependencia declarativa.

9. Asegurar que la Ruta Calculada no Intersecte con Obstáculos o Puntos de Parada
   - En un mapa real, el grafo de calles ya define por dónde se puede transitar. Si un segmento no existe, no se puede usar. No "intersecto" con obstáculos porque estos no son sprites en un grid, son simplemente aristas no disponibles.

10. Validar que la Longitud de la Ruta Sea Razonable y Dentro de Límites Aceptables
   - La longitud se calcula con Haversine en metros/kilómetros. "Razonable" en un mundo real depende de contexto (ciudad, región). No hay un límite universal (como en un tablero 10x10). Puedo alertar distancias atípicas, pero no invalidarlas por regla fija.

---

## 4) Requisitos que sí apliqué (o reinterpreté al mundo real)

2. Verificar la Existencia del ID del Mapa en la Base de Datos → Reinterpretado
   - En lugar de un "mapa" con UUID, valido que los nodos/puntos existan (o encuentro el nodo más cercano). El objeto consultado no es "un mapa", sino la red de nodos y sus conexiones.

5. Verificar que los Puntos de Inicio y Destino no Estén Obstruidos
   - En mi dominio, significa: que existan nodos alcanzables alrededor de esos puntos y que haya conexiones válidas en el grafo.

7. Asegurar que exista al menos un camino válido
   - El algoritmo de ruta (A*/Dijkstra según configuración) recorre el grafo real; si no hay camino, informo un "no reachable" realista.

8. Verificar posibles fugas de memoria o cuellos de botella
   - En frontend optimicé renders (memoización) y en backend mantengo cálculos acotados al grafo/consulta actual. Además, monitoreo errores y rendimiento básico.

11. Manejar el caso especial Inicio = Destino
   - Caso controlado: retorno ruta vacía (o distancia cero) con un mensaje amigable.

12. Unit Tests ≥ 70%
   - Mantengo pruebas unitarias e integración donde aporta valor. La cobertura es una métrica útil, pero priorizo probar la lógica crítica (cálculo de ruta, validaciones, formatos de salida) sobre perseguir un número vacío.

13. Registro de errores en el backend
   - Implementé manejo centralizado de errores y logs estructurados. Se puede conectar a Winston/Morgan si se requiere mayor trazabilidad o transporte a servicios externos.

---

## 5) Decisiones técnicas clave (y por qué)

- Coordenadas con llaves lat/lon como números: evito ambigüedades (lng vs lon) y mantengo consistencia a través de backend y frontend.
- Distancia Haversine: imprescindible en un entorno geográfico real; no uso "pasos de celda".
- Leaflet + polyline: render directo sobre mapas reales, con markers para inicio/fin/paradas.
- Estado y reactividad: el mapa invalida tamaño cuando cambian contenedores (sidebar, responsive), evitando fallos de render en desktop.
- API clara: el backend retorna { route: [{id, lat, lon}], totalDistance } para un consumo predecible.

---

## 6) Valor agregado frente al pedido original

- Realismo: de un grid de juguete a un mapa real con distancias reales.
- UX: marcadores, panel de rutas, mobile/desktop, feedback de carga/errores.
- Robustez: validaciones de entrada y salidas consistentes.
- Escalabilidad: estructura de datos alineada a grafos reales; API preparada para crecer (costos, restricciones, preferencias).

---

## 7) Qué podría añadir si el alcance lo requiere

- Criterios de costo múltiples (tiempo, tráfico, pendientes).
- Búsqueda multi-parada optimizada (TSP heurístico para ordenar paradas).
- Caché de rutas y memoización en backend.
- Logs con Winston + correlación de request-id.
- Métricas (Prometheus) y profiling puntual del algoritmo.
- Tests E2E en el frontend para validar UI/Leaflet.

---