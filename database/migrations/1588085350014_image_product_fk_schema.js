'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageProductFkSchema extends Schema {
  up () {
    this.table('images', (table) => {
      // alter table
      table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
    })
  }

  down () {
    this.table('products', (table) => {
      // reverse alternations
      table.dropForeign('image_id')
    })
  }
}

module.exports = ImageProductFkSchema
