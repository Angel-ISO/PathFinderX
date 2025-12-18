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