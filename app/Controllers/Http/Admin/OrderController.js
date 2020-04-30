'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Order = use('App/Models/Order')
const Database = use('Database')
const Service = use('App/Services/Order/OrderServices')
const Transformer = use('App/Transformers/Admin/OrderTransformer')

/**
 * Resourceful controller for interacting with orders
 */
class OrderController {
  /**
   * Show a list of all orders.
   * GET orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ req, res, pagination, transform }) {
    const { status, id } = req.only(['status', 'id'])
    const query = Order.query()

    if(status && id) {
      query.where('status', status).orWhere('id', 'LIKE', `%${id}%`)
    } else if(status) {
      query.where('status', status)
    } else if(id) {
      query.orWhere('id', 'LIKE', `%${id}%`)
    }

    const orders = await query.paginate(pagination.page, pagination.limit)
    const TransformedOrders = await transform.item(orders, Transformer)
    return res.sen(TransformedOrders)
  }

  /**
   * Create/save a new order.
   * POST orders
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ req, res, transform }) {
    const trx = await Database.beginTransaction()

    try {
      const { user_id, items, status } = req.all()
      var order = await Order.create({ user_id, status }, trx)
      const service = new Service(order, trx)
      if(items && items.length > 0) {
        await service.syncItems(items)
      }
      await trx.commit()

      order = await Order.find(order.id)
      const TransformedOrder = await transform.include('items').item(order, Transformer)
      return res.status(201).send(TransformedOrder)
    } catch (err) {
      return res.status(400).send({
        message: 'Não foi prossível criar o pedido no momento!'
      })
    }
  }

  /**
   * Display a single order.
   * GET orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, req, res, transform }) {
    const order = await Order.findOrFail(id)
    const TransformedOrder = await transform.include('items').item(order, Transformer)
    return res.send(TransformedOrder)
  }

  /**
   * Update order details.
   * PUT or PATCH orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response }) {
    const order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()

    try {
      const { user_id, items, status } = req.all()
      order.merge({ user_id, status })
      const service = new Service(order, trx)
      await service.updateItems(items)
      await order.save(trx)
      await trx.commit()
      const TransformedOrder = await transform.include('items').item(order, Transformer)
      return res.send(TransformedOrder)
    } catch (err) {
      await trx.rollback()
      return res.status(400).send({
        message: 'Não foi possível atualizar este pedido no momento!'
      })
    }
  }

  /**
   * Delete a order with id.
   * DELETE orders/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, req, res }) {
    const order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()
    
    try {
      await order.items().delete(trx)
      await order.delete(trx)
      await trx.commit()
      return res.status(204).send()
    } catch (err) {
      await trx.rollback()
      return res.status(400).send({
        message: 'Erro ao deletar este pedido!'
      })
    }
  }
}

module.exports = OrderController
