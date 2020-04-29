'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.get('products', 'ProductController.index').apiOnly()
    Route.get('products/:id', 'ProductController.show').apiOnly()
    Route.get('orders', 'OrderController.index').apiOnly()
    Route.post('orders', 'OrderController.store').apiOnly()
    Route.put('orders/:id', 'OrderController.put').apiOnly()

}).prefix('v1').namespace('Client')