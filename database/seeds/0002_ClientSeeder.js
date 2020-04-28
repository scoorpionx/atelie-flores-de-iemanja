'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role')
const User = use('User')

class ClientSeeder {
  async run () {
    const user = await User.create({
      name: 'Joao',
      username: 'dr4gon',
      email: 'email@email.com',
      password: 'senha123'
    })

    const adminRole = await Role.findBy('slug', 'admin')
    await user.roles().attach([roles.id])
  }
}

module.exports = ClientSeeder
