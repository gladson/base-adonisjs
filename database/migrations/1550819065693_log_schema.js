'use strict'
/* global use */
/* eslint no-undef: "error" */

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogSchema extends Schema {
  up () {
    this.create('logs', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('set null')
      table.string('level').defaultTo('debug')
      table.string('event')
      table.text('description')
      table.string('tabela_nome')
      table.string('tabela_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('logs')
  }
}

module.exports = LogSchema
