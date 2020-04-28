'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
    static boot() {
        super.boot()

        this.addHook('afterFind', 'OrderHook.updateValues')
        this.addHook('afterPaginate', 'OrderHook.updateCollectionValues')
    }

    item() {
        return this.hasMany('App/Models/Product')
    }

    user() {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

}

module.exports = Order
