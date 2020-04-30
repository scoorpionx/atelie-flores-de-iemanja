'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * OrderTransformer class
 *
 * @class OrderTransformer
 * @constructor
 */
class OrderTransformer extends BumblebeeTransformer {
  availableInclude() {
    return ['items']
  }
  /**
   * This method is used to transform the data.
   */
  transform (order) {
    order = order.toJSON()
    return {
     id: order.id,
     status: order.status,
     total: order.total ? parseFloat(order.total.toFixed(2)) : 0,
     qty_items: order.__meta__ && order.__meta__.qty_items ? order.__meta__.qty_items : 0,
     data: order.created_at,
     discount: order.__meta__ && order.__meta__.discount ? order.__meta__.discount : 0,
     subtotal: order.__meta__ && order.__meta__.subtotal ? order.__meta__.subtotal : 0
    }
  }

  includeItems() {
    return this.collection(order.getRelated('items'), OrderItemTransformer)
  }
}

module.exports = OrderTransformer
