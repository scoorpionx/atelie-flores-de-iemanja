'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

/**
 * ProductTransformer class
 *
 * @class ProductTransformer
 * @constructor
 */
const Env = use('Env')
class ProductTransformer extends BumblebeeTransformer {
  defaultIclude() {
    return ['image']
  }
  
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
     data: model
    }
  }

  transform (model) {
    if(!model.images) {
      return {
        id: model.id,
        name: model.name,
        price: model.price,
        description: model.description,
      }
    }
    
    /**
     * String treatment to become json
     **/
    let str = model.images
    let res = str.split(",")
    let images = []
    for(let i = 0; i < res.length; i++) {
      if(i%2===0) {
        var id = '"id":' + res[i]
      } else {
        let path = `${Env.get('APP_URL')}/images/${res[i]}`
        path = '"path":"' + path + '"'
        let row = '{'+id+', '+path+'}'
        let obj = JSON.parse(row)
        images.push(obj)
      }
    }
    return {
      id: model.id,
      name: model.name,
      price: model.price,
      description: model.description,
      images: images
    }

  }

  includeImage(model) {
    return this.collection(model.getRelated('image'), ImageTransformer)
  }
}

module.exports = ProductTransformer
