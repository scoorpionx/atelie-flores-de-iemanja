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
const Role = use('Role')
const Factory = use('Factory')
const User = use('App/Models/User')

class ClientSeeder {
  async run () {
    const user = await User.create({
      name: 'Joao',
      username: 'dr4gon',
      email: 'email@email.com',
      password: 'senha123'
    })

    const adminRole = await Role.findBy('slug', 'admin')
    await user.roles().attach([adminRole.id])

    await Factory.model('App/Models/Product').createMany(10)

    // await Promise.all(
    //   products.map(async product => {
    //     await product.user.attach([user.id])
    //   })
    //   )
  }
}

module.exports = ClientSeeder
