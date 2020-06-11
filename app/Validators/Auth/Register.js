'use strict'

class AuthRegister {
  get rules () {
    return {
      // validation rules
      username: 'required',
      name: 'required',
      email: 'required|email|unique:users,email',
      password: 'required'
    }
  }

  get messages() {
    return {
      'username.required': 'O nome de usuário é obrigatório!',
      'name.required': 'O nome é obrigatório!',
      'email.required': 'O email é obrigatório!',
      'email.email': 'Email inválido!',
      'email.unique': 'Este email já existe!',
      'password.required': 'A senha é obrigatória!',
    }
  }
}

module.exports = AuthRegister
