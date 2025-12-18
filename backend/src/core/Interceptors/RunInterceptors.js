// OCP
// Esta clase está diseñada para ser extendida con nuevos métodos de validación de datos
// permite añadir muchos nuevos interceptores siguiendo su propia lógica sin modificar el run interceptors
// sin necesidad de modificar el código existente, cumpliendo el principio de abierto/cerrado.


export async function runInterceptors(validators = [], data = {}) {
  for (const validator of validators) {
    await validator(data);
  }
}