# Grafo en Memoria y Caché con Redis

Este documento explica cómo gestiono en memoria las estructuras pesadas (KD-Tree y grafo) y cómo llevé la optimización al siguiente nivel con un caché externo para respuestas.

## 1) Grafo y KD-Tree en memoria
- **KD-Tree**: al primer uso cargo todos los nodos desde la base, construyo un KD-Tree (lat,lon) y lo reutilizo para resolver el nodo más cercano a coordenadas.
- **Grafo**: al primer cálculo de ruta, cargo nodos y vías, construyo el grafo (adyacencias) y lo reuso para todas las peticiones siguientes en el mismo proceso.
- **Mis beneficios**: latencias bajas después del warm-up, sin hits a DB en cada request para estos datos.

## 2) Warm-up opcional
- Puedo precalentar KD-Tree y grafo al arrancar el servidor para que la primera petición del usuario no pague el costo de construcción.

## 3) "Siguiente nivel" con Redis

- **Qué cacheo**: no persisto el grafo en Redis (por tamaño y coherencia), sino el resultado completo de rutas para solicitudes idénticas (mismo body) durante un TTL corto.
- **Por qué lo hice así**: el grafo cambia raramente; el costo real proviene de cálculos repetidos. Cachear respuestas evita recomputar y reduce CPU/IO.
- **Mi patrón**: cache-aside. En MISS, calculo y guardo; en HIT, respondo en milisegundos.
- **Mis claves estables**: método+URL+hash(body normalizado). TTL configurable y sliding expiration.
- **Mi tolerancia a fallos**: si Redis no está disponible, sigo sirviendo sin caché.

## 4) Seguridad y alcance
- Mi endpoint de cálculo no depende del usuario autenticado para el resultado; por eso la clave no incluye userId. Si agrego rutas user-specific, aislaría la clave por usuario.

## 5) Alternativas (que no implementé)
- Serializar y persistir un snapshot del grafo en Redis/disk para acelerar el cold start. Es posible, pero complica la coherencia ante cambios de datos.
- **Mi balance**: opté por mantener el grafo/KD-Tree en memoria y cachear respuestas, logrando muy buen rendimiento con complejidad baja.