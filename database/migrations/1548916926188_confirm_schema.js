'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConfirmSchema extends Schema {
  up () {
    this.create('confirms', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('token').notNullable()
      table.integer('valid')
      table.integer('type')
      table.timestamps()
    })
  }

  down () {
    this.drop('confirms')
  }
}

module.exports = ConfirmSchema
