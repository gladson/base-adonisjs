'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FlatRateSchema extends Schema {
  up () {
    this.create('flat_rates', (table) => {
      table.increments()

      table.integer('user_id').unsigned().references('id').inTable('users')
      table
        .integer('ddd_origin_id')
        .unsigned()
        .notNullable()
      table
        .integer('ddd_destiny_id')
        .unsigned()
        .notNullable()

      table.float('rate').notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('flat_rates')
  }
}

module.exports = FlatRateSchema
