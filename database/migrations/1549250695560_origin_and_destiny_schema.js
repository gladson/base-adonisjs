'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OriginAndDestinySchema extends Schema {
  up () {
    this.create('origin_and_destinies', (table) => {
      table.increments()
      table.string('ddd', 80).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('origin_and_destinies')
  }
}

module.exports = OriginAndDestinySchema
