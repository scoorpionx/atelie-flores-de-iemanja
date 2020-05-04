'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const Product = use('App/Models/Product')
const Transformer = use('App/Transformers/Admin/ProductTransformer')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination, transform }) {
    const name = request.input('name')
    const query = Product.query()

    if(name) {
      query.where('name', 'LIKE', `%${name}%`)
    }

    const products = await query.paginate(pagination.page, pagination.limit)
    const transformedProducts = await transform.paginate(products, Transformer)
    
    return response.send(transformedProducts)
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, transform }) {
    const trx = await Database.beginTransaction()
    try {
      const { name, price, image_id } = request.all()
      const product = await Product.create({
        name,
        price,
        image_id
      }, trx)

      await trx.commit()
      const transformedProduct = await transform.item(product, Transformer)
      return response.status(201).send(transformedProduct)
    } catch(err) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar o produto neste momento!',
        error: err,
      })
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, transform }) {
    const product = await Product.findOrFail(id)
    const transformedProduct = await transform.item(product, Transformer)    
    return response.send(transformedProduct)
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform }) {
    const product = await Product.findOrFail(id)
    try {
      const { name, price, image_id } = request.all()
      product.merge({ name, price, image_id })
      await product.save()

      const transformedProduct = await transform.item(product, Transformer)
      return response.send(transformedProduct)
    } catch(err) {
      return response.status(400).send({
        message: 'Não foi possível atualizar este produto no momento!'
      })
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    try {
      await product.delete()
      return response.status(204).send()
    } catch (err) {
      return response.status(500).send({
        message: 'Não foi possível deletar este produto no momento!'
      })
    }
  }
}

module.exports = ProductController
