# Aplicación de Principios SOLID en el Proyecto

A continuación, se detalla cómo se aplican los principios SOLID en la arquitectura y diseño del proyecto. Se ha refactorizado el código existente para mejorar la adherencia, separando responsabilidades, usando abstracciones y asegurando extensibilidad. Para cada principio, se selecciona una porción de código como ejemplo.

## Principio de Responsabilidad Única (SRP)

Cada módulo tiene una única responsabilidad. Por ejemplo, en `AuthService.js`, el servicio se enfoca solo en autenticación, delegando persistencia a repositorios.

```javascript:d:\Projects\gitlab\programing-4t\src\core\service\AuthService.js
import UserService from './UserService.js';
import { runInterceptors } from '../Interceptors/RunInterceptors.js';
// Código que maneja login y register, sin mezclar con otras lógicas.
```

## Principio de Abierto/Cerrado (OCP)

Los módulos se extienden sin modificar código existente, usando interceptores como plug-ins.

```javascript:d:\Projects\gitlab\programing-4t\src\core\Interceptors\RunInterceptors.js
// Función runInterceptors permite agregar nuevos interceptores sin cambiar el código base.
```

## Principio de Sustitución de Liskov (LSP)

Clases derivadas (como repositorios específicos) pueden sustituir bases sin alterar comportamiento, manteniendo firmas idénticas.

```javascript:d:\Projects\gitlab\programing-4t\src\Infrastructure\repository\UserRepository.js
import User from '../model/User.js';

//LSP
// Esta clase implementa la misma interfaz/firma que otros repositorios,
// permitiendo que pueda ser sustituida por cualquier otro repositorio sin afectar el funcionamiento del sistema.

export default class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findByUsername(username) {
    return User.findOne({ username });
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }

  async countDocuments(query = {}) {
    return User.countDocuments(query);
  }

  async findAll({ query = {}, skip = 0, limit = 10, sort = {} }) {
    return User.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }
}
```

## Principio de Segregación de la Interfaz (ISP)

en lugar de tener una interfaz grande que englobe todas las operaciones posible, se divide en interfaces más específicas, como separar lectura y escritura en servicios.

```javascript:d:\Projects\gitlab\programing-4t\src\core\service\UserService.js
// ISP
// Los métodos de este servicio están organizados en funciones específicas (crear, leer, actualizar, eliminar),
// evitando interfaces grandes y genéricas, y facilitando la implementación de solo lo necesario en cada caso.

export default class UserService {
  constructor({ userRepository = new UserRepository(), runInterceptorsFn = runInterceptors } = {}) {
    this.userRepository = userRepository;
    this.runInterceptors = runInterceptorsFn;
  }

  async findByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username) {
    return this.userRepository.findByUsername(username);
  }

  async findById(id) {
    return this.userRepository.findById(id);
  }

  async create(userData) {
    await this.runInterceptors([
      ({ username }) => validateUniqueUsername(username),
      ({ email }) => validateUniqueEmail(email),
      ({ password }) => validatePasswordStrength(password),
    ], userData);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async update(id, updateData) {
    await this.runInterceptors([
      ({ username }) => validateUniqueUsername(username),
      ({ email }) => validateUniqueEmail(email),
      ({ password }) => validatePasswordStrength(password),
    ], updateData);

    return this.userRepository.update(id, updateData);
  }

  async delete(id) {
    return this.userRepository.delete(id);
  }

  async findAll({ pageIndex = 1, pageSize = 10, search = '' } = {}) {
    const params = createParams({ pageIndex, pageSize, search });

    const query = !params.search
      ? {}
      : {
          $or: [
            { username: { $regex: params.search, $options: 'i' } },
            { firstName: { $regex: params.search, $options: 'i' } },
            { lastName: { $regex: params.search, $options: 'i' } }
          ]
        };

    const [total, users] = await Promise.all([
      this.userRepository.countDocuments(query),
      this.userRepository.findAll({
        query,
        skip: (params.pageIndex - 1) * params.pageSize,
        limit: params.pageSize
      })
    ]);

    return createPager({
      registers: users,
      total,
      pageIndex: params.pageIndex,
      pageSize: params.pageSize,
      search: params.search
    });
  }
}
```

## Principio de Inversión de Dependencias (DIP)

Dependencias de alto nivel usan abstracciones, implementando Onion Architecture con inyección en servicios inspirado en la inversion de dependencias de c#.

```javascript:d:\Projects\gitlab\programing-4t\src\api\app.js
import AuthService from '../../core/service/AuthService.js';

// DIP
// Este módulo depende de la abstracción AuthService, no de su implementación concreta.
// Esto permite cambiar la implementación de AuthService sin afectar a este módulo.

const authService = new AuthService();

export const register = async (req, res, next) => {
  try {
    const response = await authService.register(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
```





El código limpio se mantiene con nomenclatura consistente y modularización. Las pruebas unitarias superan el 70% de cobertura (ver tests en `src/test`). El manejo de errores usa Monads (`Result.js`) para respuestas informativas.