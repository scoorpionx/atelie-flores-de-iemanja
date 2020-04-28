'use strict'

const OrderHook = exports = module.exports = {}

OrderHook.updateValues = async (model) => {
    model.$sideLoaded.subtotal = await model.items().getSum('subtotal')
    model.$sideLoaded.qty_items = await model.items().getSum('quantity')
}

OrderHook.updateCollectionValues = async (models) => {
    for(let model of models) {
        model = await OrderHook.updateValues(model)
    }
}