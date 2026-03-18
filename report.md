<div align="center">

![d6c29722d610118d585e963bd40987c7.png](:/8a4b3815f15a473f8514f132671508d9)


**Nombre:** Angel Gabriel Ortega  
**Asignatura:** Arquitectura 1  
**Fecha de Entrega:** 1/15/2026
</div>

---

## Análisis de Connascence en el Proyecto PathFinderX

En este análisis, voy a examinar el proyecto [PathFinderX](https://pathfinderx.stellarco.online/intro), que desarrollé como parte de una materia anterior de programación. PathFinderX es una aplicación full-stack para calcular rutas en el mapa de Bucaramanga, Colombia, utilizando un backend en Node.js con Express y MongoDB, y un frontend en React. El análisis se centra en identificar los tipos de connascence presentes en el código, mostrando los resultados iniciales y proponiendo mejoras para reducir el acoplamiento y aumentar la mantenibilidad.

### Resultados Iniciales del Análisis de Connascence

Después de revisar el código, pille varios tipos de connascence que afectan la estructura del proyecto que en su momento la real no le di importancia. Aquí estan, con ejemplos concretos del código:

1. **Connascence of Name (CoN)**: Esta es la forma más común y se presenta cuando múltiples componentes deben acordar en el nombre de una entidad. Por ejemplo:
   - En el modelo `User.js` y el DTO `UserDto.js`, los campos como `firstName`, `lastName`, `username`, `email` y `password` deben coincidir exactamente. Si cambio el nombre de un campo en el modelo, tengo que actualizar el DTO, el mapeo en `toUserResponse.js` y posiblemente el frontend.
   
   [Insertar captura de pantalla del modelo User.js y UserDto.js aquí]

   - En las rutas de la API, el frontend asume endpoints como `/auth/login` y `/path/calculate`. Cualquier cambio en estos nombres rompería la integración.

   [Insertar captura de pantalla de AuthActions.js y MainRoutes.js aquí]

2. **Connascence of Position (CoP)**: Ocurre cuando los componentes deben acordar en el orden de los elementos. Un ejemplo es en el constructor de `UserDto`, donde los parámetros deben estar en el orden `{ firstName, lastName, username, email, password }`. Si agrego un nuevo campo, debo asegurarme de que el orden se mantenga en todos los lugares donde se instancia.

3. **Connascence of Value (CoV)**: Los componentes deben acordar en el valor de una entidad. Por instancia, en `AuthResponse.js`, el campo se llama `jwt`, pero en el frontend `AuthActions.js`, se intenta desestructurar `{ token }` de la respuesta, lo que indica una inconsistencia que podría causar errores en tiempo de ejecución.

   [Insertar captura de pantalla de AuthResponse.js y AuthActions.js aquí]

4. **Connascence of Structure (CoS)**: En `GraphBuilder.js`, se asume que los objetos `way` tienen una propiedad `nodes` como array y `tags.oneway` como booleano. Esto acopla fuertemente con la estructura de datos de MongoDB definida en `Way.js`.

   [Insertar captura de pantalla de GraphBuilder.js y Way.js aquí]

5. **Connascence of Execution (CoE)**: En los servicios como `PathService.js`, el orden de ejecución de métodos como `resolveNodes`, `calculate` y `formatResponse` debe mantenerse para que el cálculo de rutas funcione correctamente.

Estos hallazgos muestran que el proyecto tiene un alto grado de connascence, especialmente de nombre y estructura, lo que hace que los cambios sean propensos a errores y difíciles de mantener.

### Sugerencias para Mejorar el Valor del Proyecto

Para reducir la connascence y mejorar la calidad del código, propongo las siguientes mejoras:

1. **Introducir Interfaces o Contratos Explícitos**: Definir interfaces TypeScript o esquemas JSON Schema para las DTOs y respuestas de API. Por ejemplo, crear un esquema para `UserDto` que valide la estructura, reduciendo CoN y CoP.

2. **Usar Mapeadores Automáticos**: Implementar bibliotecas como AutoMapper para mapear entre modelos y DTOs, eliminando la necesidad de mantener nombres manualmente sincronizados.

3. **Normalizar Nombres de Campos**: Establecer convenciones claras, como usar `token` en lugar de `jwt` en todas partes, y documentarlas.

4. **Implementar Versionado de API**: Para endpoints, usar versiones como `/api/v1/auth/login`, permitiendo cambios sin romper clientes existentes.

5. **Refactorizar Estructuras de Datos**: En `GraphBuilder`, crear una clase `Way` con métodos para acceder a `nodes` y `isOneway()`, encapsulando la lógica y reduciendo CoS.

6. **Agregar Pruebas de Integración**: Escribir tests que verifiquen la compatibilidad entre frontend y backend, detectando cambios en connascence temprano.

Estas mejoras harían el proyecto más robusto, facilitando futuras expansiones como agregar nuevos tipos de rutas o integrar con otros mapas.

---

## Referencias

Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley Professional.

Fowler, M. (2018). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional.

Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley Professional.

Richards, M., & Ford, N. (2020). *Fundamentals of Software Architecture: An Engineering Approach*. O'Reilly Media.

---

<div align="center">

*angel gabriel ortega* | Jala University | 2026

</div>