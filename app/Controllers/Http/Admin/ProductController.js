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
  async index({
    request,
    response,
    pagination,
    transform,
    auth
  }) {
    var uid = await auth.getUser()
    uid = uid.$attributes.id

    const query = Product.query()

    // query.where('user_id', uid)

    query
      .select([
        'products.*',
        Database.raw('GROUP_CONCAT (`images`.`id`, ",", `images`.`path`) AS images')
      ])
      .where('products.user_id', uid)
      .leftJoin('images', 'products.id', 'images.product_id')
      .groupBy('products.id')

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
  async store({
    request,
    response,
    transform,
    auth
  }) {
    const trx = await Database.beginTransaction()
    try {
      const {
        name,
        price,
        description,
        image_id
      } = request.all()
      var uid = await auth.getUser()
      uid = uid.$attributes.id
      const product = await Product.create({
        user_id: uid,
        name,
        price,
        description,
      }, trx)

      await trx.commit()
      const transformedProduct = await transform.item(product, Transformer)
      return response.status(201).send(transformedProduct)
    } catch (err) {
      await trx.rollback()
      console.log(err.message)
      return response.status(400).send({
        message: 'Não foi possível criar o produto neste momento!',
        error: err.message,
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
  async show({
    params: {
      id
    },
    request,
    response,
    auth,
    transform,
    pagination
  }) {
    let uid = await auth.getUser()
    uid = uid.$attributes.id

    const query = Product.query()

    query
      .select([
        'products.*',
        Database.raw('GROUP_CONCAT (`images`.`id`, ",", `images`.`path`) AS images')
      ])
      .where({
        'products.user_id': uid,
        'products.id': id
      })
      .leftJoin('images', 'products.id', 'images.product_id')
      .groupBy('products.id')


    const product = await query.paginate(pagination.page, pagination.limit)
    const transformedProduct = await transform.collection(product, Transformer)
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
  async update({
    params: {
      id
    },
    request,
    response,
    transform
  }) {
    const product = await Product
      .findByOrFail('products.id', id)
    try {
      const {
        name,
        price,
        image_id
      } = request.all()
      product.merge({
        name,
        price,
        image_id
      })
      await product.save()

      return response.status(200).send()
    } catch (err) {
      return response.status(400).send({
        message: 'Não foi possível atualizar este produto no momento!',
        error: err.message,
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
  async destroy({
    params: {
      id
    },
    request,
    response
  }) {
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
