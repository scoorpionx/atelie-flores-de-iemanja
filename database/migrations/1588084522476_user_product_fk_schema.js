'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserProductFkSchema extends Schema {
  up () {
    this.table('products', (table) => {
      // alter table
    })
  }

  down () {
    this.table('products', (table) => {
      // reverse alternations
    })
  }
}

module.exports = UserProductFkSchema
