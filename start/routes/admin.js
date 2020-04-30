'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    Route.resource('products', 'ProductController')
        .apiOnly()
    
    Route.resource('images', 'ImageController')
        .apiOnly()
    
    Route.resource('orders', 'OrderController')
        .apiOnly()
        .validator(new Map(
            [
                [['orders.store'], ['Admin/StoreOrder']]
            ]
        ))
    
    Route.resource('users', 'UserController')
        .apiOnly()
        .validator(new Map([
            [['users.store'], ['Admin/StoreUser']],
            [['users.update'], ['Admin/StoreUser']]
        ]))

})
    .prefix('v1/admin')
    .namespace('Admin')
    .middleware(['auth', 'is:( admin || manager )'])