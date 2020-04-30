'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')
const Transformer = use('App/Transformers/Admin/UserTransform')

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ req, res, pagination, transform }) {
    const name = req.input('name')
    const query = User.query()

    if(name) {
      query.where('name', 'LIKE', `%${name}%`)
      query.orWhere('email', 'LIKE', `%${name}%`)
    }

    const users = await query.paginate(pagination.page, pagination.limit)
    const transformedUsers = await transform.paginate(users, Transformer)
    return res.send(transformedUsers)
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ req, res, transform }) {
    try {
      const userData = req.only([
        'name',
        'username',
        'email',
        'password',
      ])

      const user = User.create(userData)
      const transformedUser = await transform.paginate(user, Transformer)
      return res.status(201).send(transformedUser)
    } catch (err) {
      return res.status(400).send({
        message: 'Não foi possível criar este usuário no momento!'
      })
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, req, res, transform }) {
    const user = await User.findOrFail(id)
    const transformedUser = await transform.paginate(user, Transformer)
    return res.send(transformedUser)
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, req, res, transform }) {
    const user = await User.findOrFail(id)
    const userData = req.only([
      'name',
      'username',
      'email',
      'password',
    ])
    user.merge(userData)
    await user.save()
    const transformedUser = await transform.paginate(user, Transformer)
    return res.send(transformedUser)
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, req, res }) {
    const user = await User.findOrFail(id)
    try {
      await user.delete()
      return res.status(204).send()
    } catch (err) {
      return res.status(500).send({
        message: 'Não foi possível deletar o usuário no momento'
      })
    }
  }
}

module.exports = UserController
