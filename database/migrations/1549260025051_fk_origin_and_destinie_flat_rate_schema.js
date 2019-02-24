'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FkOriginAndDestinieFlatRateSchema extends Schema {
  up () {
    this.table('flat_rates', (table) => {
      table
        .foreign('ddd_origin_id')
        .references('id')
        .inTable('origin_and_destinies')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .foreign('ddd_destiny_id')
        .references('id')
        .inTable('origin_and_destinies')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    // this.table('fk_origin_and_destinie_flat_rates', (table) => {
    //   // reverse alternations
    // })
    this.drop('fk_origin_and_destinie_flat_rates')
  }
}

module.exports = FkOriginAndDestinieFlatRateSchema
