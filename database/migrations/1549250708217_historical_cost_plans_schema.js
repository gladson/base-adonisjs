'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoricalCostPlansSchema extends Schema {
  up () {
    this.create('historical_cost_plans', (table) => {
      table.increments()

      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('flat_rate_id').unsigned().references('id').inTable('flat_rates')
      table.string('plan', 80).notNullable()
      table.string('with_plan', 80).notNullable()
      table.string('no_plan', 80).notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('historical_cost_plans')
  }
}

module.exports = HistoricalCostPlansSchema
